/* =============================================================================
 * ultra/lib.js — UltraCarLib: animated decal baking + extended builder
 * -----------------------------------------------------------------------------
 * bakeBodyUltra() is the heart of the animated-decal system. A vinyl that
 * declares `frames: N` is baked as N time-samples STACKED VERTICALLY into a
 * single texture, then played back by stepping texture offset.y. One bake, N
 * frames, real animation — not a scrolling noise trick.
 *
 *   texture layout          material sampling
 *   +---------------+       repeat.y = 1/N        v' in [0, 1/N]
 *   |  frame 0      |       offset.y = f/N        + f/N  -> frame f
 *   |  frame 1      |
 *   |  ...          |
 *   |  frame N-1    |
 *   +---------------+
 *
 * Two details that matter:
 *  - the height/roughness/normal maps are baked from the SAME per-frame sample,
 *    so the bump map animates with the albedo instead of sliding under it
 *  - animated strips disable mipmaps, because mip level 1 would average frame
 *    f with frame f+1 and ghost the decal at a distance
 * ===========================================================================*/

import {
  TAU, PI, CarLib, CarInstance, FINISHES, PALETTES, PALETTE_BY_ID, VINYLS, VINYL_BY_ID,
  RIM_FINISHES, CARS, WHEELS, buffer, fill, normalFromHeight, hexToRgb,
  buildWheel, tube,
} from '../carLibraryPro.js';
import { fbm } from './materials.js';
import { ULTRA_VINYLS, ULTRA_VINYL_BY_ID } from './vinyls.js';
import {
  ULTRA_CARS, ULTRA_CAR_BY_ID, ULTRA_WHEELS, ULTRA_WHEELS_ALL, ULTRA_WHEEL_BY_ID, ULTRA_RIM_FINISHES,
  buildBodyUltra, findCar, findWheel,
} from './bodies.js';
import {
  buildWheelEx, wheelMaterialSet, WHEELS_EXTRA, WHEEL_SLOTS,
} from './wheels.js';
import {
  WHEEL_TEX, WHEEL_TEX_IDS, bakeWheelTex, texSignature, beat,
} from './wheeltex.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const mix3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/* ---- shared helpers (module-private in the base library) ----------------- */

function crownUV(u) {
  let c = (u - 0.25 + 1) % 1;
  if (c > 0.5) c -= 1;
  return { m: Math.abs(c) * 2, side: c < 0 ? -1 : 1, c };
}
const peelH = (u, v, k) => fbm(u * 26, v * 26, 3) * k * 0.6 + fbm(u * 90, v * 90, 2) * k * 0.25;
const flakeH = (u, v, k) => {
  const f = ((Math.floor(u * 900) * 374761393 + Math.floor(v * 900) * 668265263) >>> 0) / 4294967295;
  return f > 1 - 0.14 * k ? k * 0.9 : 0;
};
function weaveH(u, v, rep = 32) {
  const gx = u * rep * 2, gy = v * rep;
  const cx = Math.floor(gx), cy = Math.floor(gy);
  const over = ((cx >> 1) + (cy >> 1)) % 2;
  const fx = gx - cx, fy = gy - cy;
  return (over ? Math.sin(fx * PI) : Math.sin(fy * PI)) * 0.55 + (over ? 0.12 : 0);
}

/** Look up a decal in either library. */
export function findVinyl(id) {
  return VINYL_BY_ID.get(id) || ULTRA_VINYL_BY_ID.get(id) || null;
}

/** Look up a paint finish, base library first then ultra extras. */
export function findFinish(id) {
  return FINISHES[id] || FINISHES.gloss;
}

/* ========================================================================== *
 *  BODY BAKING
 * ========================================================================== */

/**
 * Bake albedo / roughness / normal / emissive for one (paint, decal) pair.
 * @param {object} paint  { base, secondary, accent, finish }
 * @param {string} vinylId
 * @param {number} size   texture width; height = size/2 * frames
 * @param {number} frame  which animation frame to bake (0..frames-1)
 */
export function bakeBodyUltra(paint, vinylId, size = 768, frame = 0) {
  const f = findFinish(paint.finish);
  const vin = findVinyl(vinylId) || { fn: () => [0, 0], id: 'clean' };
  const frames = Math.max(1, (vin.frames | 0) || 1);
  const phase = frames > 1 ? (frame % frames) / frames : 0;
  const base = hexToRgb(paint.base), sec = hexToRgb(paint.secondary), acc = hexToRgb(paint.accent);

  const w = size, h = (size >> 1) * frames;
  const rs = Math.max(64, size >> 1);
  const rh = Math.max(32, (size >> 2) * frames);

  const sample = (u, v) => {
    const lv = frames > 1 ? (v * frames) % 1 : v;
    const r = vin.fn(u, lv, phase) || [0, 0, 0];
    return [clamp(r[0] || 0, 0, 1), clamp(r[1] || 0, 0, 1), clamp(r[2] || 0, 0, 1), lv];
  };

  let glowPeak = 0;

  /* ---- albedo ---------------------------------------------------------- */
  const albedo = fill(buffer(w, h), (u, v) => {
    const [s, a, e, lv] = sample(u, v);
    let c = mix3(base, sec, s);
    c = mix3(c, acc, a);
    const { m } = crownUV(u);
    // clearcoat depth: pearl / candy finishes darken toward the shoulders
    const depth = 1 - (f.depth || 0) * 0.35 * smooth(clamp((m - 0.35) / 0.65, 0, 1));
    const spark = f.flake ? flakeH(u, lv, f.flake) * 90 : 0;
    const dirt = 1 - 0.05 * fbm(u * 8 + 31, lv * 8, 4);
    let ir = [0, 0, 0];
    if (f.iri) {
      const tt = (m * 1.6 + fbm(u * 5, lv * 5, 3) * 0.7) % 1;
      ir = [Math.sin(tt * TAU) * 9 * f.iri, Math.sin(tt * TAU + 2.1) * 9 * f.iri, Math.sin(tt * TAU + 4.2) * 9 * f.iri];
    }
    // a decal that glows also lifts its own albedo a little, so the lit part
    // reads as hot rather than as a flat bright paint
    const lift = e * 34;
    return [c[0] * depth * dirt + spark + ir[0] + lift * (acc[0] / 255),
      c[1] * depth * dirt + spark + ir[1] + lift * (acc[1] / 255),
      c[2] * depth * dirt + spark + ir[2] + lift * (acc[2] / 255)];
  });

  /* ---- roughness ------------------------------------------------------- */
  const rough = fill(buffer(rs, rh), (u, v) => {
    const [s, a, e, lv] = sample(u, v);
    let r = f.rough + (s > 0.5 ? 0.06 : 0) + (a > 0.5 ? -0.04 : 0);
    r += (fbm(u * 18 + 7, lv * 18, 4) - 0.5) * 0.07;
    if (f.weave) r += weaveH(u, lv, 26) * 0.08;
    // glowing decals are wet-looking, so they polish the film under them
    r -= e * 0.18;
    const g = clamp(r, 0.02, 0.98) * 255;
    return [g, g, g];
  });

  /* ---- bump / normal --------------------------------------------------- */
  const normal = normalFromHeight(rs, rh, (u, v) => {
    const lv = frames > 1 ? (v * frames) % 1 : v;
    let hgt = peelH(u, lv, f.peel) * 0.35 + flakeH(u, lv, f.flake) * 0.5;
    if (f.weave) hgt += weaveH(u, lv, 26) * 1.6;
    const r = vin.fn(u, lv, phase) || [0, 0, 0];
    const s = clamp(r[0] || 0, 0, 1), a = clamp(r[1] || 0, 0, 1);
    // real vinyl has thickness: a hair of relief on every decal edge
    hgt += (s > 0.5 ? 0.12 : 0) + (a > 0.5 ? 0.1 : 0);
    return hgt;
  }, f.weave ? 2.4 : 0.9);

  /* ---- emissive -------------------------------------------------------- */
  let emis = null;
  const anyGlow = (vin.glow || 0) > 0 || (typeof vin.fn === 'function' && (vin.fn(0.25, 0.5, phase) || [0, 0, 0])[2] > 0);
  if (anyGlow) {
    emis = fill(buffer(rs, rh), (u, v) => {
      const e = sample(u, v)[2];
      if (e > glowPeak) glowPeak = e;
      const g = clamp(e, 0, 1) * 255;
      return [g, g, g];
    });
  }

  return { albedo, rough, normal, emis, finish: f, frames, phase, vinyl: vin, glowPeak };
}

/* ========================================================================== *
 *  MATERIALS
 * ========================================================================== */

/** Build the three body materials for a paint + decal pair, wired for
 *  animation. Returns { paint, accent, glow, _maps, _anim }. */
export function paintMaterialsUltra(lib, paint, vinyl, size) {
  const T = lib.T;
  const sz = size || lib.decalSizeFor(vinyl);
  const key = `ubody|${paint.base}|${paint.secondary}|${paint.accent}|${paint.finish}|${vinyl}|${sz}`;
  const baked = lib.maps(key, () => {
    const vin = findVinyl(vinyl) || { frames: 1 };
    const frames = Math.max(1, (vin.frames | 0) || 1);
    const out = { frames, slices: [] };
    for (let i = 0; i < frames; i++) out.slices.push(bakeBodyUltra(paint, vinyl, sz, i));
    // stitch the per-frame maps into one strip
    const stitch = (field) => {
      const first = out.slices[0][field];
      if (!first) return null;
      const W = first.w, H = first.h * frames;
      const buf = buffer(W, H);
      for (let i = 0; i < frames; i++) {
        const s = out.slices[i][field];
        buf.data.set(s.data, i * W * s.h * 4);
      }
      return buf;
    };
    out.albedo = stitch('albedo');
    out.rough = stitch('rough');
    out.normal = stitch('normal');
    out.emis = stitch('emis');
    out.finish = out.slices[0].finish;
    out.vinyl = out.slices[0].vinyl;
    out.glowPeak = out.slices[0].glowPeak;
    return out;
  }, { animated: (findVinyl(vinyl)?.frames | 0) > 1 });

  const f = baked.finish || FINISHES.gloss;
  const anim = baked.frames > 1;
  const rep = [1, 1 / baked.frames];

  const body = new T.MeshPhysicalMaterial({
    color: 0xffffff,
    map: baked.map,
    roughnessMap: baked.roughnessMap,
    normalMap: baked.normalMap,
    metalness: f.metal,
    roughness: 1,
    clearcoat: f.cc,
    clearcoatRoughness: f.ccRough,
    sheen: f.sheen || 0,
    sheenColor: new T.Color(0xffffff),
    normalScale: new T.Vector2(0.85, 0.85),
    envMapIntensity: 1.2,
    iridescence: f.iri ? Math.min(0.45, f.iri * 0.45) : 0,
    iridescenceIOR: 1.4,
  });

  const accent = new T.MeshPhysicalMaterial({
    color: new T.Color(paint.accent), metalness: 0.5, roughness: 0.22,
    clearcoat: 1, clearcoatRoughness: 0.05,
  });
  const glow = new T.MeshStandardMaterial({
    color: new T.Color(paint.accent), emissive: new T.Color(paint.accent),
    emissiveIntensity: 2.2, roughness: 0.3, metalness: 0,
  });

  /* emissive decal channel (already baked into a frame strip by maps()) */
  if (baked.emissiveMap) {
    body.emissiveMap = baked.emissiveMap;
    body.emissive = new T.Color(paint.accent);
    body.emissiveIntensity = 0.35 + (baked.vinyl?.glow || 0) * 0.9 + (f.emit || 0);
  } else if (f.emit) {
    body.emissive = new T.Color(paint.accent);
    body.emissiveIntensity = f.emit;
  }

  const vin = findVinyl(vinyl) || {};
  const _anim = {
    frames: baked.frames,
    fps: vin.fps || 12,
    scroll: vin.scroll || 0,
    glow: vin.glow || 0,
    frame: 0, acc: 0, offset: 0, glowT: 0,
    maps: [body.map, body.roughnessMap, body.normalMap, body.emissiveMap].filter(Boolean),
    body,
    baseGlow: body.emissiveIntensity,
    apply(frame, offset) {
      const yy = frame / baked.frames + offset * 0;
      for (const m of this.maps) {
        m.repeat.set(rep[0], rep[1]);
        m.offset.set(offset, yy);
      }
    },
  };
  _anim.apply(0, 0);

  return { paint: body, accent, glow, _maps: baked, _anim, _frames: baked.frames };
}

/* ========================================================================== *
 *  WHEELS
 * ========================================================================== */

/** buildWheel + studded tyres for ice-racing sets. */
export function buildWheelUltra(s, quality = 'high') {
  return buildWheelEx(s, quality);
}

/* ========================================================================== *
 *  UltraCarLib
 * ========================================================================== */

export class UltraCarLib extends CarLib {
  constructor(THREE, opts = {}) {
    super(THREE, opts);
    this.cars = [...CARS, ...ULTRA_CARS];
    this.wheels = [...WHEELS, ...ULTRA_WHEELS_ALL];
    this.vinyls = [...VINYLS, ...ULTRA_VINYLS];
    this.finishes = FINISHES;
    this.palettes = PALETTES;
    this.staticDecalSize = opts.staticDecalSize || 768;
    this.animDecalSize = opts.animDecalSize || 384;
    this._decalQueue = [];
  }

  /** Animated strips are baked smaller — N frames at full res is a lot of
   *  pixels and the animation hides the resolution anyway. */
  decalSizeFor(vinylId) {
    const v = findVinyl(vinylId);
    return (v && v.frames > 1) ? this.animDecalSize : this.staticDecalSize;
  }

  /** Cached bake, extended for frame strips: honours `animated` (mipmap off so
   *  frames cannot bleed into each other) and carries the emissive channel. */
  maps(key, fn, o = {}) {
    let m = this.tex.get(key);
    if (m) return m;
    const b = fn();
    const rep = o.repeat;
    m = {};
    if (b.albedo) m.map = this.dataTex(b.albedo, { srgb: true, repeat: rep, noMip: o.animated });
    if (b.rough) m.roughnessMap = this.dataTex(b.rough, { repeat: rep, noMip: o.animated });
    if (b.normal) m.normalMap = this.dataTex(b.normal, { repeat: rep, noMip: o.animated });
    if (b.emis) m.emissiveMap = this.dataTex(b.emis, { repeat: rep, noMip: o.animated });
    // The base library's shared() does `new MeshPhysicalMaterial({ ...carbon })`,
    // so every enumerable key on this object becomes a constructor parameter and
    // three.js logs "parameter 'finish' has value of undefined" for each one.
    // Keep the metadata readable but out of the spread.
    const meta = { finish: b.finish, frames: b.frames, vinyl: b.vinyl, glowPeak: b.glowPeak };
    for (const k in meta) {
      Object.defineProperty(m, k, { value: meta[k], enumerable: false, writable: true, configurable: true });
    }
    this.tex.set(key, m);
    return m;
  }

  dataTex(buf, o = {}) {
    const T = this.T;
    const t = new T.DataTexture(buf.data, buf.w, buf.h, T.RGBAFormat);
    t.needsUpdate = true;
    t.wrapS = T.RepeatWrapping; t.wrapT = T.RepeatWrapping;
    if (o.noMip) {
      // animated frame strips must NOT be mipmapped: mip 1 would average
      // frame f with frame f+1 and ghost the decal at distance
      t.generateMipmaps = false;
      t.minFilter = T.LinearFilter;
    } else {
      t.generateMipmaps = true;
      t.minFilter = T.LinearMipmapLinearFilter;
    }
    t.magFilter = T.LinearFilter;
    t.anisotropy = o.aniso || 8;
    if (o.srgb && T.SRGBColorSpace) t.colorSpace = T.SRGBColorSpace;
    if (o.repeat) t.repeat.set(o.repeat[0], o.repeat[1]);
    return t;
  }

  rimMaterial(finishId) {
    const u = ULTRA_RIM_FINISHES[finishId];
    if (!u) return super.rimMaterial(finishId);
    const T = this.T;
    return new T.MeshPhysicalMaterial({
      color: new T.Color(u.color), metalness: u.metal, roughness: u.rough,
      clearcoat: u.cc, clearcoatRoughness: 0.08, envMapIntensity: 1.4,
    });
  }

  paintMaterials(paint, vinyl) {
    return paintMaterialsUltra(this, paint, vinyl);
  }

  /** Full build: ultra body + ultra wheels + animated decal materials. */
  buildCar(opts = {}) {
    const T = this.T, S = this.shared();
    const spec = findCar(opts.body) || CARS[0];
    const wspec = findWheel(opts.wheels) || WHEELS[0];
    const vinyl = opts.vinyl || 'clean';
    const pal = PALETTE_BY_ID.get(opts.palette) || PALETTES[0];
    const paint = { base: pal.base, secondary: pal.secondary, accent: pal.accent, finish: pal.finish, ...(opts.paint || {}) };
    const quality = opts.quality || this.quality;

    const built = buildBodyUltra(spec, quality);
    const pm = this.paintMaterials(paint, vinyl);
    const mats = { ...S, paint: pm.paint, accent: pm.accent, glow: pm.glow };

    const root = new T.Group();
    root.name = 'car:' + spec.id;
    const bodyGroup = this.toGroup(built.parts, mats, `ubody|${spec.id}|${quality}`);
    root.add(bodyGroup);

    const wb = buildWheelUltra(wspec, quality);
    // The wheel decides its own wardrobe: rim finish, the bespoke slots a shape
    // needs (dough, fur, sugar...) and the animated surface textures. All of it
    // comes back from one call so nothing about a donut leaks in here.
    const wm = wheelMaterialSet(this, wspec, { accent: paint.accent, quality });
    const wmats = { ...S, ...wm.mats };

    const wheelNodes = [];
    const wkey = `uwheel|${wspec.id}|${quality}`;
    for (const w of built.meta.wheels) {
      const outer = new T.Group();
      outer.position.set(w.x, w.y, w.z);
      const mirror = new T.Group();
      mirror.rotation.y = w.x < 0 ? PI : 0;
      const scale = new T.Group();
      scale.scale.setScalar(w.r);
      const spin = this.toGroup(wb.spin, wmats, wkey + '|spin');
      const fixed = this.toGroup(wb.fixed, wmats, wkey + '|fixed');
      const extra = this.toGroup(wb.extra, wmats, wkey + '|extra');
      scale.add(spin, fixed, extra);
      mirror.add(scale); outer.add(mirror); root.add(outer);
      wheelNodes.push({ ...w, outer, mirror, scale, spin, fixed, extra, baseY: w.y, angle: 0, extraAngle: 0 });
    }

    const inst = new CarInstance(this, {
      root, spec, wspec, vinyl, paint, built, bodyGroup, wheelNodes,
      mats, pm, wglow: wmats.glow, discMat: wmats.disc,
    });
    inst.ultra = true;
    inst.decalAnim = pm._anim;
    // CarInstance.update drains this once per frame — see the texAnims hook.
    inst.texAnims = wm.anims;
    return inst;
  }

  /** Swap only the decal, keeping paint and geometry. */
  setDecal(inst, vinylId) {
    inst.vinyl = vinylId;
    const pm = this.paintMaterials(inst.paint, vinylId);
    inst._swap(pm);
    inst.pm = pm;
    inst.decalAnim = pm._anim;
    return pm;
  }
}

/* ========================================================================== *
 *  PER-FRAME ANIMATION
 * ========================================================================== */

/** Advance an animated decal. Call once per frame with the car instance. */
export function updateDecal(inst, dt) {
  const a = inst && inst.decalAnim;
  if (!a || (a.frames <= 1 && !a.scroll)) return;
  if (a.frames > 1) {
    a.acc += dt * a.fps;
    if (a.acc >= 1) {
      const step = Math.floor(a.acc);
      a.acc -= step;
      a.frame = (a.frame + step) % a.frames;
    }
  }
  if (a.scroll) a.offset = (a.offset + dt * a.scroll) % 1;
  a.apply(a.frame, a.offset);
  if (a.glow) {
    a.glowT += dt;
    a.body.emissiveIntensity = a.baseGlow * (0.75 + 0.45 * Math.sin(a.glowT * 3.1));
  }
}

/* ========================================================================== *
 *  DECAL PREVIEW STRIPS (garage UI thumbnails)
 * ========================================================================== */

/** Bake a small flat swatch of a decal for the picker grid. Returns a data URL
 *  when a DOM is present, otherwise the raw buffer. */
export function bakeDecalSwatch(paint, vinylId, w = 96, h = 48, frame = 0) {
  const b = bakeBodyUltra(paint, vinylId, w, frame);
  return b.albedo;
}

export const ULTRA_LIB_STATS = {
  cars: ULTRA_CARS.length,
  wheels: ULTRA_WHEELS_ALL.length,
  wheelsSensible: ULTRA_WHEELS.length,
  wheelsShaped: WHEELS_EXTRA.length,
  wheelTextures: WHEEL_TEX_IDS.length,
  vinyls: ULTRA_VINYLS.length,
};
