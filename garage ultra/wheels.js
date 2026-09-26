/* =============================================================================
 * ultra/wheels.js — 50 new wheel sets, half of them not really wheels
 * -----------------------------------------------------------------------------
 * The base library builds a wheel as "tyre + rim + face + cap + brake". That is
 * the right skeleton and it is also a box: every set looks like every other set
 * with a different spoke count. This module keeps the skeleton for the sets that
 * want it and steps outside it for the ones that do not.
 *
 *   shapes
 *     ring       a fat torus body with a glaze shell and sprinkles   (donut, cookie)
 *     foxtail    a fur plume swept around a slim carcass
 *     gear       real teeth cut on the outside of the carcass
 *     pineapple  crosshatch barrel under a leaf crown
 *     flower     petals standing off the rim
 *     sushi      a nori band over a rice body
 *     knobby     chunky lug blocks around the tread
 *     paddle     straight paddles, for sand
 *     shroud     a ducted fan: a ring shroud with blades inside it
 *     saw        sharp teeth, because subtlety is overrated
 *
 *   plus two pure-parameter presets that need no new geometry at all:
 *     balloon    a very round, very wide tyre with no shoulder
 *     lowpro     a rubber band stretched over a huge rim
 *
 * ---------------------------------------------------------------------------
 *  WHEEL-LOCAL FRAME (the same one the base library uses)
 * ---------------------------------------------------------------------------
 *   X   the axle. Everything is authored facing +X and mirrored for the far
 *       side by the car builder, so nothing here has to know which corner it
 *       ends up on.
 *   YZ  the radial plane. An angle `a` about X is (cos a, sin a) in (Y, Z).
 *
 * All lengths are in wheel radii — the car builder scales the whole group by
 * the wheel's rolling radius afterwards.
 * ===========================================================================*/

import {
  TAU, PI, Mesh, Parts, revolveX, torusX, washerX, spoke, rbox, tube, plate, slab, loft,
} from '../carLibraryPro.js';
import { buildWheel } from '../carLibraryPro.js';
import {
  bakeWheelTex, wheelTexMaterial, makeWheelTexAnim, WHEEL_TEX_BY_ID,
} from './wheeltex.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
/** deterministic per-index jitter, so a rebuild is always identical */
const jit = (i, k) => {
  const h = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return h - Math.floor(h);
};

const put = (parts, slot, mesh) => { if (mesh && mesh.count) parts.set(slot, mesh); return mesh; };
/** Replace a slot outright. `Parts` has no delete, and the base tyre has to go
 *  when a donut is wearing it. */
const swap = (parts, slot, mesh) => { parts.m.delete(slot); return put(parts, slot, mesh); };

/* ========================================================================== *
 *  SHAPE BUILDERS
 *  Each one receives the base wheel bag and mutates it. `q` is the quality
 *  scalar 0.55 / 0.8 / 1.
 * ========================================================================== */

/** A ring of swept elements in the wheel plane. `fn(i, t, a)` returns the spoke
 *  parameters, so teeth, petals, lugs and fur strands are all one loop. */
function ringOf(M, n, fn, phase = 0) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU + phase;
    const p = fn(i, i / n, a);
    if (!p) continue;
    spoke(M, p.r0, p.r1, a, p.w0, p.w1, p.x0, p.x1, p.th0, p.th1, p.twist || 0, p.seg || 4, p.curve || 0);
  }
}

/* --- ring: donut / cookie / any pastry ----------------------------------- */

/** A fat torus carcass, a glaze shell over its outer half, and real 3D
 *  sprinkles. The glaze carries the texture; the sprinkles give the silhouette
 *  a fuzzy edge so it does not read as a plain torus at thumbnail size. */
function shapeRing(wb, s, q, o) {
  const R = o.R, tr = o.r, seg = Math.round(38 * q);
  const dough = new Mesh();
  torusX(dough, 0, R, tr, seg, Math.round(16 * q));
  swap(wb.spin, 'tyre', dough);

  if (o.glaze !== false) {
    // the glaze follows the tube's outer half, offset outward so it sits proud
    const g = o.glazeGap === undefined ? 0.020 : o.glazeGap;
    const span = o.glazeSpan === undefined ? 1.24 : o.glazeSpan;
    const prof = [];
    const N = Math.round(20 * q);
    for (let i = 0; i <= N; i++) {
      const b = -span + 2 * span * (i / N);
      prof.push([(tr + g) * Math.sin(b), R + (tr + g) * Math.cos(b)]);
    }
    const glaze = new Mesh();
    revolveX(glaze, prof, seg, 1, false, false);
    put(wb.spin, 'face', glaze);
  }

  const nSug = Math.round((o.sprinkles === undefined ? 34 : o.sprinkles) * q);
  if (nSug > 0) {
    const sug = new Mesh();
    for (let i = 0; i < nSug; i++) {
      const a = jit(i, 1) * TAU;
      const b = (jit(i, 2) - 0.5) * 2 * (o.sprinkleSpan === undefined ? 1.0 : o.sprinkleSpan);
      const rr = tr + (o.glazeGap === undefined ? 0.020 : o.glazeGap) + 0.012;
      const x = rr * Math.sin(b), rad = R + rr * Math.cos(b);
      const ca = Math.cos(a), sa = Math.sin(a);
      // a sprinkle is a short rod lying along a random tangent
      const th = jit(i, 3) * PI;
      const tl = 0.055 + jit(i, 4) * 0.045;
      const dx = Math.cos(th) * tl, dt = Math.sin(th) * tl;
      const p0 = [x + dx * 0.5, ca * (rad - dt * 0.5), sa * (rad - dt * 0.5)];
      const p1 = [x - dx * 0.5, ca * (rad + dt * 0.5), sa * (rad + dt * 0.5)];
      tube(sug, p0, p1, 0.016, 0.014, 5, true, true);
    }
    put(wb.spin, 'sugar', sug);
  }
}

/* --- foxtail ------------------------------------------------------------- */

/** A slim carcass wearing a brushed fur plume. The strands sweep tangentially
 *  rather than radiating, which is what makes it read as a tail and not as a
 *  sea urchin; the length envelope peaks on one side so the plume is lopsided,
 *  and the longest layer is a second colour so the tail has a white tip. */
function shapeFoxTail(wb, s, q) {
  const carcass = new Mesh();
  torusX(carcass, 0, 0.58, 0.13, Math.round(30 * q), 12);
  swap(wb.spin, 'tyre', carcass);

  const hub = new Mesh();
  washerX(hub, 0.10, 0.05, 0.13, 0.58, Math.round(26 * q));
  put(wb.spin, 'face', hub);

  /* four orange layers plus one cream one at the tips */
  const LAYERS = [
    { n: 54, r0: 0.64, len: 0.26, w: 0.115, th: 0.075, x: 0.20, slot: 'fur' },
    { n: 50, r0: 0.66, len: 0.42, w: 0.098, th: 0.062, x: 0.12, slot: 'fur' },
    { n: 44, r0: 0.68, len: 0.58, w: 0.080, th: 0.050, x: 0.04, slot: 'fur' },
    { n: 36, r0: 0.70, len: 0.74, w: 0.062, th: 0.040, x: -0.04, slot: 'fur' },
    { n: 28, r0: 0.72, len: 0.92, w: 0.050, th: 0.032, x: -0.12, slot: 'sugar' },
  ];
  const bags = { fur: new Mesh(), sugar: new Mesh() };
  for (let L = 0; L < LAYERS.length; L++) {
    const ly = LAYERS[L];
    const M = bags[ly.slot];
    const n = Math.max(10, Math.round(ly.n * (0.55 + 0.45 * q)));
    ringOf(M, n, (i, t, ang) => {
      const j0 = jit(i, L * 7 + 1), j1 = jit(i, L * 7 + 2);
      // longest around ang = PI (behind the wheel) so the tail sweeps backwards
      const env = 0.30 + 0.70 * Math.pow(0.5 + 0.5 * Math.cos(ang - PI), 1.5);
      const len = ly.len * env * (0.70 + j0 * 0.60);
      return {
        r0: ly.r0 - j0 * 0.03, r1: ly.r0 + len,
        w0: ly.w * (0.85 + j1 * 0.4), w1: ly.w * 0.20,
        x0: ly.x + (j0 - 0.5) * 0.06, x1: ly.x * 0.4 + (j1 - 0.5) * 0.14,
        th0: ly.th, th1: ly.th * 0.22,
        // the tangential sweep is what turns a spike into a laid-down strand
        twist: 0.52 + j1 * 0.36, curve: 0.26 + j0 * 0.24, seg: 5,
      };
    }, L * 0.13);
  }
  put(wb.spin, 'fur', bags.fur);
  put(wb.spin, 'sugar', bags.sugar);
}

/* --- gear ---------------------------------------------------------------- */

/** Square teeth cut on the outside of the carcass. The carcass itself stays a
 *  tyre so the wheel still grips something. */
function shapeGear(wb, s, q) {
  const n = s.teeth || 18;
  const M = new Mesh();
  ringOf(M, Math.round(n * (q > 0.7 ? 1 : 0.6)), (i) => ({
    r0: 0.86, r1: 1.17, w0: 0.090, w1: 0.072, x0: 0, x1: 0,
    th0: 0.120, th1: 0.104, seg: 3,
  }));
  put(wb.fixed, 'gear', M);
}

/* --- pineapple ----------------------------------------------------------- */

/** A crosshatch barrel with a leaf crown standing off the shoulder. */
function shapePineapple(wb, s, q) {
  const n = Math.round(26 * q);
  const leaf = new Mesh();
  ringOf(leaf, n, (i, t, a) => {
    const j = jit(i, 3);
    return {
      r0: 0.86 + j * 0.03, r1: 1.22 + j * 0.18,
      w0: 0.070, w1: 0.020, x0: 0.30, x1: 0.52 + j * 0.10,
      th0: 0.030, th1: 0.010, twist: 0.20, curve: 0.14, seg: 4,
    };
  });
  put(wb.spin, 'crown', leaf);

  const crown = new Mesh();
  torusX(crown, 0.30, 0.86, 0.035, Math.round(26 * q), 6);
  put(wb.spin, 'crown', crown);
}

/* --- flower -------------------------------------------------------------- */

/** Petals standing off the rim, two staggered rows. */
function shapeFlower(wb, s, q) {
  const n = Math.round((s.petals || 11) * (q > 0.7 ? 1 : 0.6));
  const petal = new Mesh();
  ringOf(petal, n, (i, t, a) => ({
    r0: 0.72, r1: 1.14, w0: 0.16, w1: 0.13, x0: 0.02, x1: 0.06,
    th0: 0.13, th1: 0.10, curve: 0.10, seg: 5,
  }));
  ringOf(petal, n, (i, t, a) => ({
    r0: 0.70, r1: 1.06, w0: 0.13, w1: 0.10, x0: -0.02, x1: 0.02,
    th0: 0.11, th1: 0.08, curve: 0.10, seg: 4,
  }), PI / n);
  put(wb.fixed, 'petal', petal);
}

/* --- sushi --------------------------------------------------------------- */

/** A nori band wrapped round the middle of the tyre. */
function shapeSushi(wb, s, q) {
  const nori = new Mesh();
  const w = s.width || 0.44;
  revolveX(nori, [[-w * 0.30, 0.995], [w * 0.30, 0.995]], Math.round(30 * q), 1, false, false);
  revolveX(nori, [[-w * 0.30, 1.012], [w * 0.30, 1.012]], Math.round(30 * q), 1, false, false);
  put(wb.fixed, 'nori', nori);
}

/* --- knobby / paddle ----------------------------------------------------- */

/** Chunky lugs standing off the tread. `s.lugW`/`s.lugH` tune the bite. */
function shapeKnobby(wb, s, q) {
  const rows = s.lugRows || 3;
  const n = Math.round((s.lugs || 18) * (q > 0.7 ? 1 : 0.6));
  const M = new Mesh();
  for (let r = 0; r < rows; r++) {
    const x = lerp(-0.30, 0.30, rows === 1 ? 0.5 : r / (rows - 1));
    ringOf(M, n, (i, t, a) => ({
      r0: 0.90, r1: 0.90 + (s.lugH || 0.14), w0: (s.lugW || 0.070),
      w1: (s.lugW || 0.070) * 0.85, x0: x - 0.055, x1: x + 0.055,
      th0: 0.070, th1: 0.060, seg: 3,
    }), r * (PI / n));
  }
  put(wb.fixed, 'lug', M);
}

/** Straight paddles, spaced wide, for digging through sand. */
function shapePaddle(wb, s, q) {
  const n = Math.round((s.paddles || 12) * (q > 0.7 ? 1 : 0.6));
  const M = new Mesh();
  ringOf(M, n, (i, t, a) => ({
    r0: 0.84, r1: 1.38, w0: 0.060, w1: 0.115, x0: -0.34, x1: -0.34,
    th0: 0.095, th1: 0.082, twist: 0.16, seg: 4,
  }));
  put(wb.fixed, 'lug', M);
}

/* --- shroud (ducted fan) ------------------------------------------------- */

/** A ring duct with blades inside it — the Turbofan's louder cousin. */
function shapeShroud(wb, s, q) {
  const sh = new Mesh();
  const w = s.width || 0.44;
  revolveX(sh, [[-w * 1.10, 0.99], [-w * 1.24, 1.10], [w * 1.24, 1.10], [w * 1.10, 0.99]],
    Math.round(34 * q), 1, false, false);
  washerX(sh, -w * 1.24, 0.018, 1.00, 1.10, Math.round(30 * q));
  washerX(sh, w * 1.24, 0.018, 1.00, 1.10, Math.round(30 * q));
  put(wb.fixed, 'shroud', sh);

  const bl = new Mesh();
  const n = Math.round((s.blades || 13) * (q > 0.7 ? 1 : 0.6));
  ringOf(bl, n, (i) => ({
    r0: 0.20, r1: 1.00, w0: 0.085, w1: 0.135, x0: -w * 0.9, x1: -w * 0.2,
    th0: 0.022, th1: 0.018, twist: 0.60, curve: 0.22, seg: 5,
  }));
  put(wb.extra, 'blade', bl);
}

/* --- saw ----------------------------------------------------------------- */

/** Sharp alternating teeth on the rim. */
function shapeSaw(wb, s, q) {
  const n = Math.round((s.teeth || 16) * (q > 0.7 ? 1 : 0.6));
  const M = new Mesh();
  ringOf(M, n, (i) => ({
    r0: 0.88, r1: 1.34, w0: 0.058, w1: 0.004, x0: 0.02, x1: 0.02,
    th0: 0.085, th1: 0.018, twist: 0.30, seg: 3,
  }));
  put(wb.fixed, 'tooth', M);
}

/* --- spikes -------------------------------------------------------------- */

/** Short radial spikes — studded ice, or a mace. */
function shapeSpikes(wb, s, q) {
  const rows = s.spikeRows || 3;
  const n = Math.round((s.spikes || 22) * (q > 0.7 ? 1 : 0.6));
  const M = new Mesh();
  for (let r = 0; r < rows; r++) {
    const x = lerp(-0.28, 0.28, rows === 1 ? 0.5 : r / (rows - 1));
    ringOf(M, n, (i) => ({
      r0: 0.94, r1: 1.22, w0: 0.038, w1: 0.005, x0: x, x1: x,
      th0: 0.038, th1: 0.005, seg: 3,
    }), r * (PI / n));
  }
  put(wb.fixed, 'spike', M);
}

export const SHAPES = {
  ring: shapeRing, foxtail: shapeFoxTail, gear: shapeGear, pineapple: shapePineapple,
  flower: shapeFlower, sushi: shapeSushi, knobby: shapeKnobby, paddle: shapePaddle,
  shroud: shapeShroud, saw: shapeSaw, spikes: shapeSpikes,
};

/* ========================================================================== *
 *  THE TEXTURED FACE PLATE
 * ---------------------------------------------------------------------------
 *  A disc behind the spokes carrying the recipe's face map. It is emitted with
 *  the same radial UV the baker assumes: angle around, radius outward, centre
 *  of the map at the hub. Open geometry (an annulus), so it is single-sided and
 *  never trips the closed-shell winding check.
 * ========================================================================== */

function facePlate(M, x, r0, r1, seg = 44, flip = false) {
  const nx = flip ? -1 : 1;
  const base = M.count;
  for (let k = 0; k <= seg; k++) {
    const a = (k / seg) * TAU;
    const ca = Math.cos(a), sa = Math.sin(a);
    for (const rr of [r0, r1]) {
      const q = rr / r1;
      M.vert(x, ca * rr, sa * rr, nx, 0, 0,
        0.5 + ca * 0.5 * q, 0.5 + sa * 0.5 * q);
    }
  }
  for (let k = 0; k < seg; k++) {
    const a = base + k * 2, b = base + (k + 1) * 2;
    if (flip) M.quad(a, a + 1, b + 1, b); else M.quad(a, b, b + 1, a + 1);
  }
  return base;
}

/** Add the textured plate for a spec, unless a shape already supplied one. */
function addFacePlate(wb, s, q) {
  if (!s.texFace) return;
  if (wb.spin.m.has('face')) return;         // a shape got there first
  const w = s.width || 0.44;
  const xFace = w * 0.84;
  const xIn = xFace - (s.concave === undefined ? 0.3 : s.concave) * 0.26;
  const M = new Mesh();
  const rimR = s.rimR === undefined ? 0.715 : s.rimR;
  facePlate(M, xIn - 0.012, rimR * 0.07, rimR * 0.985, Math.round(44 * q));
  put(wb.spin, 'face', M);
}

/* ========================================================================== *
 *  THE BUILDER
 * ========================================================================== */

/** buildWheel + shape + studs + face plate. */
export function buildWheelEx(s, quality = 'high') {
  const q = quality === 'low' ? 0.55 : quality === 'med' ? 0.8 : 1;
  const wb = buildWheel(s, quality);
  const sh = s.shape && SHAPES[s.shape];
  if (sh) sh(wb, s, q, s.shapeOpt || {});
  addFacePlate(wb, s, q);

  if (s.studs) {
    const M = wb.spin.get('chrome');
    for (const row of [-0.26, 0.0, 0.26]) {
      const n = 24;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU + (row ? 0.13 : 0);
        const cy = Math.cos(a), sz = Math.sin(a);
        // wheel axis is X, so a radial stud is a short segment in Y/Z
        tube(M, [row, cy * 0.985, sz * 0.985], [row, cy * 1.045, sz * 1.045], 0.013, 0.007, 5, true, true);
      }
    }
  }
  return wb;
}

/* ========================================================================== *
 *  MATERIALS + ANIMATION
 * ---------------------------------------------------------------------------
 *  Everything the car builder needs to dress one wheel set, in one call. The
 *  spec's `mats` bag declares plain colours for the bespoke slots a shape uses
 *  (dough, sugar, fur, crown, nori, gear...) so this module stays the only
 *  place that knows what a donut is made of.
 * ========================================================================== */

/** The slots a shape may emit beyond the base set. */
export const WHEEL_SLOTS = [
  'tyre', 'rim', 'lip', 'cap', 'disc', 'glow', 'caliper', 'dark', 'chrome',
  'face', 'sugar', 'dough', 'fur', 'crown', 'nori', 'petal', 'lug', 'tooth',
  'spike', 'gear', 'shroud', 'blade',
];

function plain(T, d) {
  const o = {
    color: new T.Color(d.color || '#888888'),
    metalness: d.metal === undefined ? 0.2 : d.metal,
    roughness: d.rough === undefined ? 0.6 : d.rough,
  };
  if (d.emissive) { o.emissive = new T.Color(d.emissive); o.emissiveIntensity = d.emis === undefined ? 1.4 : d.emis; }
  return new T.MeshStandardMaterial(o);
}

/**
 * @returns {{ mats, anims, texSize }}
 *   mats     slot -> material, to be merged over the library's shared bag
 *   anims    per-frame steppers; hand them to CarInstance.texAnims
 */
export function wheelMaterialSet(lib, spec, o = {}) {
  const T = lib.T;
  const S = lib.shared();
  const thumb = !!o.thumb;
  const accent = o.accent || '#37e0c8';
  const anims = [];
  /** Materials this call created. The thumbnail renderer must release these or
   *  every card leaks a rim material; a car keeps them for its lifetime. */
  const dispose = [];

  const rimMat = lib.rimMaterial(spec.finish);
  dispose.push(rimMat);

  const caliperMat = new T.MeshStandardMaterial({ color: new T.Color(accent), metalness: 0.7, roughness: 0.3 });
  dispose.push(caliperMat);
  const glowMat = spec.glow ? new T.MeshStandardMaterial({
    color: new T.Color(spec.glow), emissive: new T.Color(spec.glow),
    emissiveIntensity: 2.6, roughness: 0.35, metalness: 0,
  }) : null;
  if (glowMat) dispose.push(glowMat);

  const mats = {
    rim: rimMat,
    lip: S.chrome,
    cap: rimMat,
    disc: thumb ? S.disc : S.disc.clone(),
    caliper: caliperMat,
    glow: glowMat || S.head,
  };
  if (!thumb) dispose.push(mats.disc);

  /* bespoke slots -------------------------------------------------------- */
  for (const [slot, d] of Object.entries(spec.mats || {})) {
    mats[slot] = plain(T, d);
    dispose.push(mats[slot]);
  }

  /* textures ------------------------------------------------------------- */
  const size = thumb ? (o.size || 72) : (o.size || 128);
  const bake = (id, tag) => {
    const b = bakeWheelTex(id, size, { strip: !thumb });
    if (!b) return null;
    const m = wheelTexMaterial(lib, b, tag, {
      metal: tag === 'tread' ? Math.min(b.meta.metal, 0.25) : b.meta.metal,
      emissive: b.meta.emis > 0 ? 1.2 : undefined,
      bump: tag === 'tread' ? 1.3 : 1.0,
      color: tag === 'tread' ? 0xf2f2f2 : 0xffffff,
    });
    if (!m) return null;
    dispose.push(m);
    if (!thumb && b.anim) {
      const maps = [m.map, m.roughnessMap, m.normalMap, m.emissiveMap].filter(Boolean);
      const step = makeWheelTexAnim(b, maps, [m]);
      if (step) anims.push(step);
    }
    return m;
  };

  const faceId = spec.texFace;
  const treadId = spec.texTread || spec.texFace;
  if (faceId) {
    const fm = bake(faceId, 'face');
    if (fm) mats.face = fm;
    if (spec.texSpokes) mats.rim = fm;
  }
  if (treadId && spec.texTread !== false) {
    const tm = bake(treadId, 'tread');
    if (tm) mats.tyre = tm;
  }

  return { mats, anims, dispose, texSize: size };
}

/* ========================================================================== *
 *  THE FIFTY SETS
 * ========================================================================== */

/* The bespoke slots a shape may emit. A palette constant names one or more of
 * these directly and W() sweeps them into spec.mats — writing `...PINK` at the
 * call site reads far better than repeating `mats: { dough: … }`.
 *
 * Deliberately NOT the whole of WHEEL_SLOTS: `tyre`, `rim`, `cap` and friends
 * are also spec OPTIONS (`tyre: 'slick'`), and sweeping those into the material
 * bag would replace a material with a string. */
const PALETTE_SLOTS = new Set([
  'face', 'sugar', 'dough', 'fur', 'crown', 'nori', 'petal', 'lug', 'tooth',
  'spike', 'gear', 'shroud', 'blade',
]);

const W = (id, name, rim, spokes, o = {}) => {
  const spec = {
    id, name, rim, spokes,
    rimR: o.rimR === undefined ? 0.715 : o.rimR,
    shoulder: o.shoulder === undefined ? 0.82 : o.shoulder,
    grooves: o.grooves === undefined ? 3 : o.grooves,
    tyre: o.tyre || 'block',
    finish: o.finish || 'chrome',
    cap: o.cap || 'flat',
    concave: o.concave === undefined ? 0.3 : o.concave,
    caliper: o.caliper === undefined ? true : o.caliper,
    anim: o.anim || { kind: 'none' },
  };
  const mats = { ...(o.mats || {}) };
  for (const [k, v] of Object.entries(o)) {
    if (PALETTE_SLOTS.has(k)) mats[k] = v;
    else if (k !== 'mats') spec[k] = v;
  }
  if (Object.keys(mats).length) spec.mats = mats;
  return spec;
};

/* palette shorthands, so the fifty read as a list of ideas and not of hex */
const PINK = { dough: { color: '#e8a860', rough: 0.85, metal: 0.03 }, sugar: { color: '#fff4c0', rough: 0.28, metal: 0.0, emissive: '#ff9ad5', emis: 0.35 } };
const CHOC = { dough: { color: '#8a5a2a', rough: 0.9, metal: 0.02 }, sugar: { color: '#3a2416', rough: 0.5, metal: 0.0 } };
const FOX = {
  dough: { color: '#3a2418', rough: 0.9, metal: 0.0 },
  fur: { color: '#e8761f', rough: 0.92, metal: 0.0 },
  sugar: { color: '#faf4ea', rough: 0.88, metal: 0.0 },
};
const RICE = { dough: { color: '#f7f4ea', rough: 0.72, metal: 0.02 }, nori: { color: '#1c2420', rough: 0.6, metal: 0.05 }, sugar: { color: '#ec8068', rough: 0.5, metal: 0.05 } };
const LEAF = { crown: { color: '#4fa03a', rough: 0.62, metal: 0.05 }, dough: { color: '#f0c040', rough: 0.6, metal: 0.06 } };
const FLORA = { petal: { color: '#fffdf2', rough: 0.42, metal: 0.04 }, dough: { color: '#ffc23a', rough: 0.5, metal: 0.05 } };
const STEEL = { gear: { color: '#c6ccd6', rough: 0.3, metal: 0.95 }, tooth: { color: '#eef2f8', rough: 0.16, metal: 1.0 } };
const RUB = {
  lug: { color: '#17181c', rough: 0.92, metal: 0.0 },
  spike: { color: '#d8e4ee', rough: 0.14, metal: 0.9 },
  shroud: { color: '#2a2e36', rough: 0.4, metal: 0.8 },
  // the ducted fan's impeller blades: without this they fell through to the
  // dark fallback and the shroud read as an empty drum
  blade: { color: '#b9c4d2', rough: 0.28, metal: 0.92 },
};

export const WHEELS_EXTRA = [
  /* ====================================================================== *
   *  THE TWO ASKED FOR BY NAME
   * ====================================================================== */
  W('donut', 'Donut', 'star', 6, {
    shape: 'ring', shapeOpt: { R: 0.70, r: 0.40, glazeGap: 0.022, glazeSpan: 1.30, sprinkles: 40, sprinkleSpan: 1.15 },
    rimR: 0.30, shoulder: 0.99, grooves: 0, width: 0.50, cap: 'dome', capR: 0.30, lugs: false,
    texFace: 'glaze', texTread: 'glaze', finish: 'sakura', ...PINK,
    tagline: 'A wheel you could eat. Please do not eat it.',
  }),
  W('foxtail', 'Fox Tail', 'monoblock', 4, {
    shape: 'foxtail', rimR: 0.60, shoulder: 0.94, grooves: 0, width: 0.34, cap: 'dome', lugs: false,
    texFace: 'foxtail', texTread: 'foxtail', finish: 'matte', ...FOX,
    tagline: 'Brushed fur over a light carcass. Sweeps when it spins.',
  }),

  /* ====================================================================== *
   *  HEAT
   * ====================================================================== */
  W('pyre', 'Pyre', 'blade', 8, {
    texFace: 'pyre', texTread: 'pyre', finish: 'obsidian', rimR: 0.78, tyre: 'slick', grooves: 0,
    glow: '#ff8c14', glowPart: 'ring', anim: { kind: 'pulse', speed: 4.2 },
    tagline: 'Eight flame blades. The flicker is real, not a scroll.',
  }),
  W('emberheart', 'Ember Heart', 'y', 6, {
    texFace: 'emberheart', texTread: 'emberheart', finish: 'rust', tyre: 'slick', grooves: 0,
    glow: '#ff2d20', glowPart: 'cap', rimR: 0.74,
    tagline: 'It has a pulse. Seventy-eight beats a minute.',
  }),
  W('magmaflow', 'Magma Flow', 'cross', 8, {
    texFace: 'magmaflow', texTread: 'magmaflow', finish: 'obsidian', tyre: 'rally', grooves: 2,
    glow: '#ff4a0a', glowPart: 'spokes', rimR: 0.70,
    tagline: 'Molten seams between cold plates.',
  }),
  W('lavaflow', 'Lava Flow', 'honeycomb', 7, {
    texFace: 'lavaflow', texTread: 'lavaflow', finish: 'rust', tyre: 'v', grooves: 1, shoulder: 0.92,
    glow: '#ffdd66', glowPart: 'ring', rimR: 0.62,
    tagline: 'A crust that never quite cooled.',
  }),
  W('dragonfire', 'Dragonfire', 'spiral', 9, {
    texFace: 'dragonfire', texTread: 'dragonfire', finish: 'bronze', tyre: 'slick', grooves: 0,
    glow: '#22c96a', glowPart: 'ring', rimR: 0.76,
    tagline: 'Green fire, nine spiral blades.',
  }),
  W('cinder', 'Cinder', 'pin', 16, {
    texFace: 'cinder', texTread: 'cinder', finish: 'matte', tyre: 'knobby', lugRows: 2, lugs: 16, lugW: 0.06, lugH: 0.10,
    shape: 'knobby', rimR: 0.58, shoulder: 0.90, grooves: 0, ...RUB, finish: 'rust',
    tagline: 'Embers packed into a knobby tread.',
  }),

  /* ====================================================================== *
   *  COLD
   * ====================================================================== */
  W('glacier', 'Glacier', 'dish', 9, {
    texFace: 'glacier', texTread: 'glacier', finish: 'ice', rimR: 0.74, tyre: 'slick', grooves: 0,
    glow: '#9fe8ff', glowPart: 'ring', anim: { kind: 'pulse', speed: 1.4 },
    tagline: 'Faceted ice, cold light underneath.',
  }),
  W('permafrost', 'Permafrost', 'mesh', 10, {
    texFace: 'permafrost', texTread: 'permafrost', finish: 'ice', tyre: 'rally', grooves: 4, shoulder: 0.80,
    studs: true, rimR: 0.66,
    tagline: 'Needle frost on a studded rally carcass.',
  }),
  W('cryocore', 'Cryo Core', 'turbine', 11, {
    texFace: 'cryocore', texTread: 'cryocore', finish: 'ice', tyre: 'slick', grooves: 0, rimR: 0.80,
    glow: '#4fd8ff', glowPart: 'cap', anim: { kind: 'strobe', speed: 5 },
    tagline: 'A core that freezes and cracks on a loop.',
  }),
  W('shiver', 'Shiver', 'split', 6, {
    texFace: 'shiver', texTread: 'shiver', finish: 'ice', tyre: 'rally', grooves: 3,
    studs: true, rimR: 0.64,
    tagline: 'Fine frost creeping outward from the hub.',
  }),

  /* ====================================================================== *
   *  ENERGY
   * ====================================================================== */
  W('plasmadrive', 'Plasma Drive', 'turbine', 13, {
    texFace: 'plasmadrive', texTread: 'plasmadrive', finish: 'plasma', tyre: 'slick', grooves: 0,
    rimR: 0.80, glow: '#a05cff', glowPart: 'ring', anim: { kind: 'blades', count: 15, ratio: 1.7 },
    tagline: 'Energy banding that flows, with fifteen blades chasing it.',
  }),
  W('thunderhead', 'Thunderhead', 'cross', 6, {
    texFace: 'thunder', texTread: 'thunder', finish: 'obsidian', tyre: 'rally', grooves: 3,
    glow: '#7fc4ff', glowPart: 'spokes', rimR: 0.68, anim: { kind: 'strobe', speed: 7 },
    tagline: 'Lightning that forks differently every frame.',
  }),
  W('circuit', 'Circuit Board', 'mesh', 9, {
    texFace: 'circuit', texTread: 'circuit', finish: 'carbon', tyre: 'slick', grooves: 0, rimR: 0.76,
    glow: '#7dff9b', glowPart: 'cap', texSpokes: true,
    tagline: 'Traces running current through a carbon board.',
  }),
  W('cyberdeck', 'Cyberdeck', 'web', 12, {
    texFace: 'cyber', texTread: 'cyber', finish: 'obsidian', tyre: 'slick', grooves: 0, rimR: 0.78,
    glow: '#ff4fd8', glowPart: 'ring', texSpokes: true,
    tagline: 'Magenta logic on a black board.',
  }),
  W('neongrid', 'Neon Grid', 'fan', 9, {
    texFace: 'neongrid', texTread: 'neongrid', finish: 'neon', tyre: 'slick', grooves: 0, rimR: 0.72,
    glow: '#3ff5ff', glowPart: 'ring', texSpokes: true,
    tagline: 'A lattice scrolling across the whole face.',
  }),
  W('holofoil', 'Holofoil', 'dish', 8, {
    texFace: 'holofoil', texTread: 'holofoil', finish: 'ice', tyre: 'slick', grooves: 0, rimR: 0.78,
    cap: 'dome', texSpokes: true,
    tagline: 'Rainbow foil turning slowly under the light.',
  }),
  W('oilslick', 'Oil Slick', 'twist', 6, {
    texFace: 'oilslick', texTread: 'oilslick', finish: 'obsidian', tyre: 'slick', grooves: 0, rimR: 0.76,
    concave: 0.5, texSpokes: true,
    tagline: 'A thin film of oil on black water.',
  }),
  W('acidrain', 'Acid Rain', 'cage', 7, {
    texFace: 'acidrain', texTread: 'acidrain', finish: 'matte', tyre: 'rally', grooves: 3,
    glow: '#b6ff2e', glowPart: 'spokes', rimR: 0.66,
    tagline: 'Bubbles rising through a corrosive bath.',
  }),
  W('toxicbloom', 'Toxic Bloom', 'honeycomb', 8, {
    texFace: 'toxic', texTread: 'toxic', finish: 'matte', tyre: 'knobby', shape: 'knobby',
    lugRows: 2, lugs: 14, lugW: 0.075, lugH: 0.13, rimR: 0.56, shoulder: 0.90, grooves: 0, ...RUB,
    glow: '#7dff2e', glowPart: 'cap', anim: { kind: 'pulse', speed: 2.2 },
    tagline: 'Sludge bubbles on a chunky off-road carcass.',
  }),
  W('ghostfire', 'Ghost Fire', 'float', 8, {
    texFace: 'ghostfire', texTread: 'ghostfire', finish: 'ice', tyre: 'slick', grooves: 0, rimR: 0.74,
    glow: '#4fd8ff', glowPart: 'ring', anim: { kind: 'float' },
    tagline: 'Pale smoke with a cold light inside it.',
  }),
  W('sunburst', 'Sunburst', 'star', 10, {
    texFace: 'sunburst', texTread: 'sunburst', finish: 'gold', tyre: 'slick', grooves: 0, rimR: 0.74,
    cap: 'spinner', texSpokes: true, glow: '#ffe36a', glowPart: 'cap', anim: { kind: 'holo', speed: 0.8 },
    tagline: 'A retro sun on a gold ten-point.',
  }),
  W('retrosunset', 'Retro Sunset', 'split', 7, {
    texFace: 'retrosun', texTread: 'retrosun', finish: 'sakura', tyre: 'slick', grooves: 0, rimR: 0.72,
    texSpokes: true, glow: '#e0437a', glowPart: 'ring',
    tagline: 'Slatted sun, hot pink horizon.',
  }),

  /* ====================================================================== *
   *  PRINT AND PATTERN
   * ====================================================================== */
  W('zebra', 'Zebra', 'blade', 9, {
    texFace: 'zebra', texTread: 'zebra', finish: 'matte', tyre: 'slick', grooves: 0, rimR: 0.76,
    texSpokes: true,
    tagline: 'Bold stripes running out from the hub.',
  }),
  W('candycane', 'Candy Cane', 'spiral', 6, {
    texFace: 'candycane', texTread: 'candycane', finish: 'chrome', tyre: 'slick', grooves: 0, rimR: 0.78,
    texSpokes: true,
    tagline: 'A helix that crawls around the wheel as it turns.',
  }),
  W('checkerflag', 'Checker Flag', 'split', 8, {
    texFace: 'checkerflag', texTread: 'checkerflag', finish: 'chrome', tyre: 'slick', grooves: 0, rimR: 0.76,
    texSpokes: true,
    tagline: 'Chequered to the last lap.',
  }),
  W('cheetah', 'Cheetah', 'y', 7, {
    texFace: 'cheetah', texTread: 'cheetah', finish: 'bronze', tyre: 'slick', grooves: 0, rimR: 0.74,
    texSpokes: true,
    tagline: 'Rosettes at speed.',
  }),
  W('woodland', 'Woodland', 'cage', 8, {
    texFace: 'camo', texTread: 'camo', finish: 'sand', tyre: 'knobby', shape: 'knobby',
    lugRows: 3, lugs: 18, lugW: 0.065, lugH: 0.12, rimR: 0.58, shoulder: 0.90, grooves: 0, ...RUB,
    tagline: 'Three-tone camo on a chunky off-road carcass.',
  }),
  W('stealth', 'Stealth', 'blade', 11, {
    texFace: 'stealth', texTread: 'stealth', finish: 'obsidian', tyre: 'slick', grooves: 0, rimR: 0.78,
    texSpokes: true, cap: 'dome',
    tagline: 'Charcoal dazzle. You will not hear it coming.',
  }),
  W('dazzle', 'Dazzle', 'cross', 8, {
    texFace: 'dazzle', texTread: 'dazzle', finish: 'brushed', tyre: 'slick', grooves: 0, rimR: 0.76,
    texSpokes: true,
    tagline: 'Ship camouflage, on a wheel.',
  }),
  W('graffiti', 'Graffiti', 'fan', 10, {
    texFace: 'graffiti', texTread: 'graffiti', finish: 'matte', tyre: 'slick', grooves: 0, rimR: 0.74,
    texSpokes: true,
    tagline: 'Five colours of spray, no apology.',
  }),
  W('pixelart', 'Pixel Art', 'honeycomb', 9, {
    texFace: 'pixel', texTread: 'pixel', finish: 'obsidian', tyre: 'slick', grooves: 0, rimR: 0.76,
    glow: '#ff4fd8', glowPart: 'cap', texSpokes: true,
    tagline: 'Eight-bit blocks, and a few of them blink.',
  }),

  /* ====================================================================== *
   *  STONE, METAL, NATURE
   * ====================================================================== */
  W('honeycomb', 'Honeycomb', 'honeycomb', 8, {
    texFace: 'honeycomb', texTread: 'honeycomb', finish: 'gold', tyre: 'slick', grooves: 0, rimR: 0.76,
    glow: '#ffc23a', glowPart: 'cap', anim: { kind: 'pulse', speed: 1.1 }, texSpokes: true,
    tagline: 'Golden cells, warm light inside.',
  }),
  W('alloycore', 'Alloy Core', 'honeycomb', 12, {
    texFace: 'alloycore', texTread: 'alloycore', finish: 'brushed', tyre: 'slick', grooves: 0, rimR: 0.80,
    texSpokes: true, cap: 'hex',
    tagline: 'A machined honeycomb billet.',
  }),
  W('carrara', 'Carrara', 'mesh', 10, {
    texFace: 'marble', texTread: 'marble', finish: 'ice', tyre: 'slick', grooves: 0, rimR: 0.78,
    texSpokes: true,
    tagline: 'Veined marble, polished flat.',
  }),
  W('terrazzo', 'Terrazzo', 'star', 9, {
    texFace: 'terrazzo', texTread: 'terrazzo', finish: 'brushed', tyre: 'slick', grooves: 0, rimR: 0.78,
    texSpokes: true,
    tagline: 'Chips of five colours in a pale binder.',
  }),
  W('rustbucket', 'Rust Bucket', 'cage', 7, {
    texFace: 'rustbucket', texTread: 'rustbucket', finish: 'rust', tyre: 'block', grooves: 2,
    rimR: 0.62, shoulder: 0.86,
    tagline: 'Fifty years of weather in one wheel.',
  }),
  W('dragonscale', 'Dragon Scale', 'web', 8, {
    texFace: 'dragonscale', texTread: 'dragonscale', finish: 'gold', tyre: 'block', grooves: 2,
    glow: '#ffd166', glowPart: 'spokes', rimR: 0.66,
    tagline: 'Overlapping scales with a gold sheen.',
  }),
  W('snakeskin', 'Snakeskin', 'twist', 6, {
    texFace: 'snakeskin', texTread: 'snakeskin', finish: 'sand', tyre: 'slick', grooves: 0, rimR: 0.72,
    texSpokes: true,
    tagline: 'Fine scales, warm and dry.',
  }),
  W('timber', 'Timber', 'blade', 8, {
    texFace: 'timber', texTread: 'timber', finish: 'bronze', tyre: 'block', grooves: 2, rimR: 0.68,
    tagline: 'Solid oak, apparently.',
  }),
  W('denimwrap', 'Denim', 'cage', 8, {
    texFace: 'denim', texTread: 'denim', finish: 'brushed', tyre: 'slick', grooves: 0, rimR: 0.72,
    texSpokes: true,
    tagline: 'Indigo twill with a real weave you can see in the bump.',
  }),
  W('carbonwrap', 'Carbon Wrap', 'web', 12, {
    texFace: 'carbonwrap', texTread: 'carbonwrap', finish: 'carbon', tyre: 'slick', grooves: 0, rimR: 0.80,
    texSpokes: true,
    tagline: 'Woven carbon over the whole face.',
  }),

  /* ====================================================================== *
   *  NOVELTY
   * ====================================================================== */
  W('cookie', 'Choc Chip', 'star', 5, {
    shape: 'ring',
    shapeOpt: { R: 0.72, r: 0.34, glazeGap: 0.004, glazeSpan: 1.05, sprinkles: 26, sprinkleSpan: 0.9 },
    rimR: 0.32, shoulder: 0.99, grooves: 0, width: 0.52, cap: 'dome', capR: 0.28, lugs: false,
    texFace: 'cookie', texTread: 'cookie', finish: 'bronze', ...CHOC,
    tagline: 'Chocolate chips, sunk in properly.',
  }),
  W('watermelon', 'Watermelon', 'split', 6, {
    texFace: 'watermelon', texTread: 'watermelon', finish: 'matte', tyre: 'slick', grooves: 0, rimR: 0.80,
    texSpokes: true,
    tagline: 'Rind outside, flesh and seeds in the middle.',
  }),
  W('longplay', 'Long Play', 'none', 0, {
    texFace: 'vinyl', texTread: 'vinyl', finish: 'obsidian', tyre: 'slick', grooves: 0,
    rimR: 0.955, shoulder: 0.99, width: 0.26, cap: 'dome', capR: 0.20, lugs: false, caliper: false,
    tagline: 'A 12-inch single. It spins at the right speed, too.',
  }),
  W('daisy', 'Daisy', 'star', 12, {
    shape: 'flower', petals: 11, rimR: 0.62, shoulder: 0.94, grooves: 0, width: 0.34,
    texFace: 'daisy', texTread: 'daisy', finish: 'chrome', ...FLORA,
    tagline: 'Eleven petals standing off the rim.',
  }),
  W('blackrose', 'Black Rose', 'spiral', 8, {
    shape: 'flower', petals: 9, rimR: 0.60, shoulder: 0.94, grooves: 0, width: 0.34,
    texFace: 'rose', texTread: 'rose', finish: 'obsidian', ...FLORA,
    petalColour: '#d8203c',
    mats: { petal: { color: '#d8203c', rough: 0.3, metal: 0.2 }, dough: { color: '#120a10', rough: 0.4, metal: 0.3 } },
    tagline: 'Nine red petals on a black hub.',
  }),
  W('pawprint', 'Paw Print', 'y', 5, {
    texFace: 'pawprint', texTread: 'pawprint', finish: 'sakura', tyre: 'block', grooves: 2, rimR: 0.66,
    texSpokes: true,
    tagline: 'Four toes and a pad, straight through the middle.',
  }),
  W('pineapple', 'Pineapple', 'cage', 7, {
    shape: 'pineapple', rimR: 0.62, shoulder: 0.94, grooves: 0, width: 0.36,
    texFace: 'pineapple', texTread: 'pineapple', finish: 'gold', ...LEAF,
    tagline: 'Crosshatch barrel under a crown of leaves.',
  }),
  W('gumball', 'Gumball', 'fan', 9, {
    texFace: 'gumball', texTread: 'gumball', finish: 'sakura', tyre: 'slick', grooves: 0, rimR: 0.76,
    texSpokes: true, cap: 'dome',
    tagline: 'Glossy spheres in four flavours.',
  }),
  W('candycrush', 'Candy Crush', 'spiral', 11, {
    texFace: 'candycrush', texTread: 'candycrush', finish: 'plasma', tyre: 'slick', grooves: 0, rimR: 0.78,
    texSpokes: true, glow: '#ff4fd8', glowPart: 'ring',
    tagline: 'Candy-coloured bubbles on a violet hub.',
  }),
  W('sushiroll', 'Sushi Roll', 'none', 0, {
    shape: 'sushi', rimR: 0.52, shoulder: 0.97, grooves: 0, width: 0.40, lugs: false, caliper: false,
    texFace: 'sushi', texTread: 'sushi', finish: 'matte', ...RICE,
    tagline: 'Rice, nori, and a salmon spiral. Eight pieces.',
  }),
  W('gearhead', 'Gearhead', 'mesh', 8, {
    shape: 'gear', teeth: 18, rimR: 0.70, shoulder: 0.88, grooves: 2, width: 0.42,
    texFace: 'gearhead', texTread: 'gearhead', finish: 'brushed', ...STEEL,
    tagline: 'Eighteen real teeth cut into the carcass.',
  }),
  W('buzzsaw', 'Buzzsaw', 'blade', 10, {
    shape: 'saw', teeth: 20, rimR: 0.72, shoulder: 0.90, grooves: 0, width: 0.34,
    texFace: 'buzzsaw', texTread: 'buzzsaw', finish: 'brushed', ...STEEL,
    glow: '#ffd166', glowPart: 'ring', anim: { kind: 'blades', count: 20, ratio: 2.4 },
    tagline: 'Twenty teeth and a bad attitude.',
  }),
  W('ripplewave', 'Ripple Wave', 'dish', 9, {
    texFace: 'ripplewave', texTread: 'ripplewave', finish: 'plasma', tyre: 'slick', grooves: 0, rimR: 0.76,
    glow: '#4fd8ff', glowPart: 'ring', texSpokes: true,
    tagline: 'Rings travelling outward, forever.',
  }),
  W('inkblot', 'Ink Blot', 'twist', 7, {
    texFace: 'inkblot', texTread: 'inkblot', finish: 'obsidian', tyre: 'slick', grooves: 0, rimR: 0.78,
    texSpokes: true, cap: 'dome',
    tagline: 'Ink dropped in water, frozen mid-curl.',
  }),
  W('frostspike', 'Frost Spike', 'pin', 15, {
    shape: 'spikes', spikes: 24, spikeRows: 3, rimR: 0.62, shoulder: 0.90, grooves: 0, width: 0.40,
    texFace: 'shiver', texTread: 'permafrost', finish: 'ice', ...RUB,
    glow: '#a9e8ff', glowPart: 'cap', anim: { kind: 'pulse', speed: 1.8 },
    tagline: 'Seventy-two spikes of ice on a rally carcass.',
  }),
  W('sandpaddle', 'Sand Paddle', 'cage', 6, {
    shape: 'paddle', paddles: 12, rimR: 0.54, shoulder: 0.92, grooves: 0, width: 0.46,
    texFace: 'ripplewave', texTread: 'terrazzo', finish: 'sand', ...RUB,
    tagline: 'Twelve straight paddles for the dunes.',
  }),
  W('ductfan', 'Duct Fan', 'turbine', 12, {
    shape: 'shroud', blades: 13, rimR: 0.70, shoulder: 0.86, grooves: 2, width: 0.36,
    texFace: 'plasmadrive', texTread: 'carbonwrap', finish: 'plasma', ...RUB,
    glow: '#a05cff', glowPart: 'ring', anim: { kind: 'blades', count: 13, ratio: 2.1 },
    tagline: 'A ring duct with thirteen blades turning inside it.',
  }),
  W('mace', 'Mace', 'cross', 8, {
    shape: 'spikes', spikes: 16, spikeRows: 2, rimR: 0.62, shoulder: 0.86, grooves: 0, width: 0.44,
    texFace: 'rustbucket', texTread: 'cinder', finish: 'rust', ...RUB,
    tagline: 'Not road legal in any jurisdiction.',
  }),
  W('glacierbite', 'Glacier Bite', 'saw', 14, {
    shape: 'saw', teeth: 14, rimR: 0.64, shoulder: 0.90, grooves: 3,
    texFace: 'cryocore', texTread: 'shiver', finish: 'ice', ...STEEL,
    glow: '#4fd8ff', glowPart: 'spokes',
    tagline: 'Fourteen ice fangs on a studded carcass.',
  }),
  W('balloon', 'Balloon', 'dish', 10, {
    texFace: 'gumball', texTread: 'gumball', finish: 'sakura', tyre: 'slick', grooves: 0,
    rimR: 0.50, shoulder: 0.995, width: 0.52, concave: 0.55, cap: 'dome',
    tagline: 'An enormous round tyre on a tiny polished rim.',
  }),
  W('lowpro', 'Low Profile', 'mesh', 12, {
    texFace: 'carbonwrap', texTread: 'alloycore', finish: 'brushed', tyre: 'slick', grooves: 1,
    rimR: 0.90, shoulder: 0.97, width: 0.36, concave: 0.62,
    tagline: 'A rubber band stretched over an enormous rim.',
  }),
  W('donutglaze', 'Double Glaze', 'star', 8, {
    shape: 'ring', shapeOpt: { R: 0.66, r: 0.44, glazeGap: 0.018, glazeSpan: 1.45, sprinkles: 52, sprinkleSpan: 1.30 },
    rimR: 0.26, shoulder: 0.995, grooves: 0, width: 0.56, cap: 'dome', capR: 0.26, lugs: false,
    texFace: 'glaze', texTread: 'gumball', finish: 'sakura', ...PINK,
    mats: { dough: { color: '#c07a3a', rough: 0.86, metal: 0.03 }, sugar: { color: '#eaffff', rough: 0.2, metal: 0.0, emissive: '#7ee0ff', emis: 0.5 } },
    tagline: 'Twice the icing, twice the sprinkles, no regrets.',
  }),
];

export const WHEELS_EXTRA_BY_ID = new Map(WHEELS_EXTRA.map((w) => [w.id, w]));

export const WHEEL_EXTRA_STATS = {
  count: WHEELS_EXTRA.length,
  shapes: Object.keys(SHAPES).length,
  textures: WHEEL_TEX_BY_ID.size,
};

export default WHEELS_EXTRA;
