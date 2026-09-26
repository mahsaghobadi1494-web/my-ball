/* =============================================================================
 * ultra/toppers.js — 46 toppers with REAL geometry
 * -----------------------------------------------------------------------------
 * The old cosmetic list was a name, a size and a colour string. Nothing was
 * ever built. Everything here is a mesh:
 *
 *   - authored in the car's own frame, sitting on the roof at the origin,
 *     +Y up, +Z toward the nose, so one model fits all 40 bodies
 *   - every surface is a named slot, optionally tinted:  'knit#c8342c'
 *   - a slot resolves to a baked PBR surface (albedo + roughness + BUMP MAP),
 *     a polished metal, or a flat lacquer
 *
 * Two primitives had to be added: revolveY() and torusY(). The base library
 * only revolves about X (wheels), and a hat is a surface of revolution about Y.
 *
 * NORMAL ORIENTATION — the one thing that will silently ruin a revolve:
 * a surface of revolution's normal is the profile tangent rotated 90 degrees.
 *   profile travelling +Y  ->  normal points +radius (outward)   [a hat crown]
 *   profile travelling +R  ->  normal points -Y                 [a brim underside]
 * So every profile here is authored bottom -> top, and every brim is authored
 * underside-first. Both are asserted by the smoke test in tools/verify.mjs.
 * ===========================================================================*/

import {
  TAU, PI, Parts, Mesh, rbox, plate, slab, revolveX, washerX, torusX, spoke, tube,
} from '../carLibraryPro.js';
import { SURFACES, METALS, FLAT, bakeSurface, hash2 } from './materials.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;

/* ========================================================================== *
 *  ROTATION ABOUT Y
 * ========================================================================== */

/** Revolve a profile [[y, radius], ...] about the Y axis.
 *  Author the profile BOTTOM -> TOP or every normal comes out inverted. */
export function revolveY(M, prof, seg = 24, closeA = false, closeB = false) {
  const rings = [];
  for (const [y, r] of prof) {
    const rr = [];
    for (let k = 0; k < seg; k++) {
      const a = (k / seg) * TAU;
      rr.push([Math.cos(a) * r, y, Math.sin(a) * r]);
    }
    rings.push(rr);
  }
  const base = M.count;
  for (let ri = 0; ri < rings.length; ri++) {
    for (let k = 0; k < seg; k++) {
      const p = rings[ri][k];
      const l = Math.hypot(p[0], p[2]) || 1;
      M.vert(p[0], p[1], p[2], p[0] / l, 0, p[2] / l, k / seg, ri / (rings.length - 1));
    }
  }
  for (let ri = 0; ri < rings.length - 1; ri++) {
    for (let k = 0; k < seg; k++) {
      const j = (k + 1) % seg;
      // quad(a, d, c, b) with a=(ri,k) d=(ri+1,k) c=(ri+1,k+1) b=(ri,k+1)
      M.quad(base + ri * seg + k, base + (ri + 1) * seg + k, base + (ri + 1) * seg + j, base + ri * seg + j);
    }
  }
  M.smooth(base);
  if (closeA) capY(M, prof[0][0], prof[0][1], seg, -1);
  if (closeB) capY(M, prof[prof.length - 1][0], prof[prof.length - 1][1], seg, 1);
  return base;
}

/** Flat disc cap in the XZ plane facing ±Y. */
export function capY(M, y, r, seg, dir) {
  const c = M.vert(0, y, 0, 0, dir, 0, 0.5, 0.5), ids = [];
  for (let k = 0; k < seg; k++) {
    const a = (k / seg) * TAU, ca = Math.cos(a), sa = Math.sin(a);
    ids.push(M.vert(ca * r, y, sa * r, 0, dir, 0, 0.5 + ca * 0.5, 0.5 + sa * 0.5));
  }
  for (let k = 0; k < seg; k++) {
    const j = (k + 1) % seg;
    dir > 0 ? M.tri(c, ids[j], ids[k]) : M.tri(c, ids[k], ids[j]);
  }
}

/** Torus about Y — hat bands, halo rings, trims. */
export function torusY(M, yc, R, r, segA = 26, segB = 8) {
  const base = M.count;
  for (let i = 0; i < segA; i++) {
    const a = (i / segA) * TAU, ca = Math.cos(a), sa = Math.sin(a);
    for (let k = 0; k < segB; k++) {
      const b = (k / segB) * TAU, cb = Math.cos(b), sb = Math.sin(b);
      const rr = R + r * cb;
      M.vert(ca * rr, yc + r * sb, sa * rr, ca * cb, sb, sa * cb, i / segA, k / segB);
    }
  }
  for (let i = 0; i < segA; i++) {
    const i2 = (i + 1) % segA;
    for (let k = 0; k < segB; k++) {
      const k2 = (k + 1) % segB;
      M.quad(base + i * segB + k, base + i * segB + k2, base + i2 * segB + k2, base + i2 * segB + k);
    }
  }
  M.smooth(base);
  return base;
}

/** Ring brim with droop. Authored underside-first so the top face points +Y. */
export function brim(M, y, rIn, rOut, thick, seg, droop = 0, lift = 0) {
  const N = 5, prof = [];
  const yAt = (t) => y + droop * t * t - lift * t * t * t;
  for (let i = 0; i <= N; i++) { const t = i / N; prof.push([yAt(t) - thick * 0.5, lerp(rIn, rOut, t)]); }
  for (let i = N; i >= 0; i--) { const t = i / N; prof.push([yAt(t) + thick * 0.5, lerp(rIn, rOut, t)]); }
  return revolveY(M, prof, seg);
}

/** Cone / frustum about Y, bottom -> top. */
export function coneY(M, y0, r0, y1, r1, seg = 20, closeA = true, closeB = false) {
  return revolveY(M, [[y0, r0], [lerp(y0, y1, 0.5), lerp(r0, r1, 0.62)], [y1, r1]], seg, closeA, closeB);
}

/** Ellipsoid about Y. Profile runs bottom -> top so normals face outward. */
export function sphereY(M, y, r, seg = 18, rings = 9, ry = null) {
  const R = ry === null ? r : ry;
  const prof = [];
  for (let i = 0; i <= rings; i++) {
    const a = (1 - i / rings) * PI;   // PI -> 0 : bottom -> top
    prof.push([y + Math.cos(a) * R, Math.sin(a) * r]);
  }
  return revolveY(M, prof, seg);
}

/** Dome: half an ellipsoid sitting on a flat cut face at yBase. */
export function domeY(M, yBase, r, h, seg = 20, rings = 8) {
  const prof = [];
  for (let i = 0; i <= rings; i++) {
    const a = (i / rings) * PI * 0.5;
    prof.push([yBase + Math.sin(a) * h, Math.cos(a) * r]);
  }
  return revolveY(M, prof, seg, true, false);
}

/** Build a sub-shape then move everything it added — the safe way to place a
 *  revolve at an arbitrary point (no fragile vertex-count arithmetic). */
function at(M, x, y, z, fn) {
  const from = M.count;
  fn();
  M.translate(x, y, z, from);
}

/* ========================================================================== *
 *  ANCHOR
 * ========================================================================== */

/** Roof point of a built body, in the car's authoring frame. */
export function topperAnchor(built) {
  const cab = built.meta && built.meta.cabin;
  const src = (cab && cab.length) ? cab : built.stations;
  let best = src[0];
  for (const s of src) if (s[1] + s[3] > best[1] + best[3]) best = s;
  return { y: best[1] + best[3], z: best[0], hw: best[2] };
}

/* ========================================================================== *
 *  MATERIAL RESOLUTION
 * ========================================================================== */

/** Resolve 'knit#c8342c' | 'gold' | 'glow#ff0' | 'fblack' | 'rubber' into a
 *  THREE material. Surfaces are baked with albedo + roughness + bump map. */
export function createAccessoryMaterials(THREE, opts = {}) {
  const size = opts.size || 384;
  const cache = new Map(), surfaceCache = new Map();

  const hexTint = (hex) => {
    if (!hex) return null;
    let s = hex.replace('#', '');
    if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
    const n = parseInt(s, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };

  const dataTex = (buf, srgb) => {
    const t = new THREE.DataTexture(buf.data, buf.w, buf.h, THREE.RGBAFormat);
    t.needsUpdate = true;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.anisotropy = 4;
    if (srgb && THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };

  function surfaceMat(kind, tint) {
    const key = kind + '|' + (tint ? tint.join(',') : 'base');
    if (surfaceCache.has(key)) return surfaceCache.get(key);
    const baked = bakeSurface(kind, size, tint);
    const S = SURFACES[kind];
    const o = {
      color: 0xffffff,
      map: dataTex(baked.albedo, true),
      roughnessMap: dataTex(baked.rough, false),
      normalMap: dataTex(baked.normal, false),
      metalness: S.metal || 0,
      roughness: 1,
      side: THREE.DoubleSide,
      envMapIntensity: 1.15,
    };
    if (S.cc) { o.clearcoat = S.cc; o.clearcoatRoughness = 0.06; }
    if (S.sheen) { o.sheen = S.sheen; o.sheenColor = new THREE.Color(0xffffff); }
    if (S.iri) { o.iridescence = S.iri * 0.5; o.iridescenceIOR = 1.4; }
    if (baked.emis) {
      o.emissiveMap = dataTex(baked.emis, false);
      o.emissive = new THREE.Color(0xffffff);
      o.emissiveIntensity = 1.6;
    }
    const m = new THREE.MeshPhysicalMaterial(o);
    surfaceCache.set(key, m);
    return m;
  }

  /** 'fblack' -> 'black', so both spellings work. */
  function flatKey(name) {
    if (FLAT[name]) return name;
    if (name[0] === 'f' && FLAT[name.slice(1)]) return name.slice(1);
    return null;
  }

  return {
    get(slot) {
      if (cache.has(slot)) return cache.get(slot);
      const [name, hex] = String(slot).split('#');
      const tint = hexTint(hex);
      const fk = flatKey(name);
      let mat;
      if (name === 'glow') {
        const c = new THREE.Color(hex ? '#' + hex : '#ffd166');
        mat = new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 2.6, roughness: 0.3, metalness: 0, side: THREE.DoubleSide });
      } else if (name === 'glass') {
        mat = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(hex ? '#' + hex : '#9fd8ff'), metalness: 0.1, roughness: 0.05,
          transparent: true, opacity: 0.4, transmission: 0.55, thickness: 0.05, ior: 1.45,
          clearcoat: 1, clearcoatRoughness: 0.02, side: THREE.DoubleSide, envMapIntensity: 1.4,
        });
      } else if (name === 'rubber') {
        mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(hex ? '#' + hex : '#141418'), metalness: 0, roughness: 0.9, side: THREE.DoubleSide });
      } else if (METALS[name]) {
        const M = METALS[name];
        mat = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(tint ? '#' + hex : M.color), metalness: M.metal, roughness: M.rough,
          clearcoat: M.cc, clearcoatRoughness: 0.06, side: THREE.DoubleSide, envMapIntensity: 1.5,
        });
      } else if (fk) {
        const c = tint || FLAT[fk];
        mat = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(c[0] / 255, c[1] / 255, c[2] / 255), metalness: 0.05, roughness: 0.42,
          clearcoat: 0.6, clearcoatRoughness: 0.1, side: THREE.DoubleSide,
        });
      } else if (SURFACES[name]) {
        mat = surfaceMat(name, tint);
      } else {
        // unknown slot: loud magenta so a typo is visible, not fatal
        mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xff00ff), roughness: 0.5, side: THREE.DoubleSide });
      }
      cache.set(slot, mat);
      return mat;
    },
    dispose() {
      for (const [, m] of cache) m.dispose();
      for (const [, m] of surfaceCache) m.dispose();
      cache.clear(); surfaceCache.clear();
    },
  };
}

/* ========================================================================== *
 *  THE 46 TOPPERS
 * ========================================================================== */

export const TOPPERS = [

  { id: 'tophat', name: 'Top Hat', grade: 'rare', anim: 'none', tags: ['formal'],
    build: (P) => {
      revolveY(P.get('felt#1b1a20'), [[0.006, 0.118], [0.012, 0.120], [0.235, 0.122], [0.262, 0.128], [0.276, 0.118]], 24, true, true);
      torusY(P.get('silk#6d1b2a'), 0.038, 0.121, 0.015, 26, 8);
      brim(P.get('felt#1b1a20'), 0.006, 0.120, 0.248, 0.016, 30, 0.008, 0.022);
    } },

  { id: 'bowler', name: 'Bowler', grade: 'common', anim: 'none', tags: ['formal'],
    build: (P) => {
      revolveY(P.get('felt#242028'), [[0.006, 0.135], [0.022, 0.140], [0.080, 0.132], [0.135, 0.108], [0.165, 0.062], [0.180, 0.0]], 24, true, false);
      torusY(P.get('silk#141414'), 0.030, 0.141, 0.013, 26, 8);
      brim(P.get('felt#242028'), 0.006, 0.140, 0.228, 0.014, 30, 0.010, 0.016);
    } },

  { id: 'beanie', name: 'Beanie', grade: 'common', anim: 'none', tags: ['cosy'],
    build: (P) => {
      revolveY(P.get('knit#c8342c'), [[0.006, 0.150], [0.032, 0.152], [0.090, 0.146], [0.150, 0.118], [0.192, 0.070], [0.212, 0.0]], 26, true, false);
      torusY(P.get('knit#e8e4dc'), 0.040, 0.153, 0.030, 30, 10);
      sphereY(P.get('plush#e8e4dc'), 0.232, 0.046, 16, 8);
    } },

  { id: 'crown', name: 'Royal Crown', grade: 'legendary', anim: 'bob', tags: ['royal'],
    build: (P) => {
      revolveY(P.get('velvet#4a0f2a'), [[0.006, 0.150], [0.032, 0.152], [0.078, 0.150]], 26, true, false);
      torusY(P.get('gold'), 0.022, 0.152, 0.015, 30, 8);
      torusY(P.get('gold'), 0.082, 0.150, 0.013, 30, 8);
      const G = P.get('gold');
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU;
        at(G, Math.cos(a) * 0.138, 0, Math.sin(a) * 0.138, () => coneY(G, 0.080, 0.030, 0.180, 0.0, 10));
      }
      const R = P.get('ruby#d01030');
      for (let i = 0; i < 8; i++) {
        const a = ((i + 0.5) / 8) * TAU;
        at(R, Math.cos(a) * 0.150, 0.100, Math.sin(a) * 0.150, () => sphereY(R, 0, 0.026, 12, 6));
      }
      sphereY(R, 0.056, 0.032, 14, 7);
    } },

  { id: 'pirate', name: 'Pirate Tricorn', grade: 'epic', anim: 'none', tags: ['nautical'],
    build: (P) => {
      revolveY(P.get('leather#241a16'), [[0.006, 0.140], [0.042, 0.142], [0.092, 0.132], [0.128, 0.100]], 24, true, true);
      const L = P.get('leather#241a16');
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * TAU + 0.4;
        const from = L.count;
        for (let s = 0; s <= 5; s++) {
          const t = s / 5, rr = lerp(0.150, 0.238, t), yy = lerp(0.058, 0.155, t * t);
          const x1 = Math.cos(a) * rr, z1 = Math.sin(a) * rr;
          const x2 = Math.cos(a + 0.58) * rr, z2 = Math.sin(a + 0.58) * rr;
          L.vert(x1, yy, z1, 0, 1, 0, t, 0);
          L.vert(x2, yy, z2, 0, 1, 0, t, 1);
        }
        for (let s = 0; s < 5; s++) L.quad(from + s * 2, from + s * 2 + 1, from + (s + 1) * 2 + 1, from + (s + 1) * 2);
        L.smooth(from);
      }
      brim(L, 0.006, 0.142, 0.238, 0.013, 28, 0.012, 0.012);
      sphereY(P.get('bone#efe8d6'), 0.092, 0.038, 14, 7, 0.032);
      rbox(P.get('bone#efe8d6'), 0, 0.052, 0, 0.021, 0.019, 0.027, 0.006, 3);
      for (const s of [-1, 1]) rbox(P.get('bone#efe8d6'), s * 0.032, 0.066, -0.040, 0.044, 0.008, 0.006, 0.003, 3);
      rbox(P.get('gold'), 0, 0.142, 0.078, 0.018, 0.010, 0.006, 0.003, 3);
    } },

  { id: 'viking', name: 'Viking Helm', grade: 'epic', anim: 'none', tags: ['warrior'],
    build: (P) => {
      const I = P.get('hammered#8e949e');
      sphereY(I, 0.085, 0.160, 26, 11, 0.136);
      torusY(P.get('leather#3a2a20'), 0.022, 0.160, 0.017, 30, 8);
      rbox(I, 0, 0.092, 0.152, 0.021, 0.082, 0.015, 0.008, 4);
      const B = P.get('bone#efe8d6');
      for (const s of [-1, 1]) {
        const pts = [[s * 0.140, 0.120, 0.02], [s * 0.215, 0.180, 0.06], [s * 0.255, 0.255, 0.12], [s * 0.245, 0.320, 0.19], [s * 0.205, 0.360, 0.25]];
        for (let i = 0; i < pts.length - 1; i++)
          tube(B, pts[i], pts[i + 1], lerp(0.031, 0.006, i / 4), lerp(0.027, 0.004, (i + 1) / 4), 10);
      }
    } },

  { id: 'wizard', name: 'Wizard Hat', grade: 'epic', anim: 'bob', tags: ['magic'],
    build: (P) => {
      const V = P.get('velvet#2a1252');
      revolveY(V, [[0.006, 0.205], [0.032, 0.200], [0.090, 0.170], [0.190, 0.115], [0.320, 0.062], [0.430, 0.028], [0.472, 0.0]], 26, true, false);
      brim(V, 0.006, 0.200, 0.322, 0.018, 32, 0.016, 0.032);
      tube(V, [0, 0.472, 0], [0.058, 0.512, 0.022], 0.028, 0.015, 10);
      const G = P.get('glow#b98cff');
      for (let i = 0; i < 7; i++) {
        const a = i * 1.9, yy = 0.10 + (i % 5) * 0.078;
        const rr = lerp(0.190, 0.052, yy / 0.45);
        at(G, Math.cos(a) * rr, yy, Math.sin(a) * rr, () => sphereY(G, 0, 0.018, 10, 5));
      }
    } },

  { id: 'police', name: 'Police Cap', grade: 'rare', anim: 'none', tags: ['service'],
    build: (P) => {
      revolveY(P.get('leather#1b2030'), [[0.006, 0.150], [0.032, 0.152], [0.086, 0.148], [0.128, 0.130]], 26, true, true);
      torusY(P.get('fblack'), 0.022, 0.153, 0.019, 30, 8);
      const M = P.get('fblack'), from = M.count;
      for (let i = 0; i <= 12; i++) {
        const t = i / 12, a = lerp(-1.0, 1.0, t);
        const rr = 0.150 + 0.088 * Math.cos(a * 0.9);
        const yy = 0.012 - 0.014 * Math.cos(a);
        M.vert(Math.sin(a) * rr, yy, Math.cos(a) * rr, 0, 1, 0, t, 0);
        M.vert(Math.sin(a) * rr * 1.02, yy - 0.014, Math.cos(a) * rr * 1.02, 0, 1, 0, t, 1);
      }
      for (let i = 0; i < 12; i++) M.quad(from + i * 2, from + i * 2 + 1, from + (i + 1) * 2 + 1, from + (i + 1) * 2);
      sphereY(P.get('gold'), 0.092, 0.025, 12, 6);
      rbox(P.get('gold'), 0, 0.054, 0.152, 0.017, 0.023, 0.008, 0.003, 3);
      rbox(P.get('silver'), 0, 0.150, 0, 0.013, 0.008, 0.013, 0.003, 3);
    } },

  { id: 'chef', name: 'Chef Toque', grade: 'rare', anim: 'bob', tags: ['food'],
    build: (P) => {
      const W = P.get('canvas#f2f0ea');
      revolveY(P.get('fwhite'), [[0.006, 0.150], [0.032, 0.152], [0.072, 0.150]], 26, true, true);
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * TAU;
        at(W, Math.cos(a) * 0.058, 0.168, Math.sin(a) * 0.058, () => sphereY(W, 0, 0.074, 14, 8, 0.062));
      }
      sphereY(W, 0.216, 0.082, 16, 8, 0.056);
    } },

  { id: 'cowboy', name: 'Cowboy Hat', grade: 'epic', anim: 'none', tags: ['western'],
    build: (P) => {
      const L = P.get('leather#6b4a2a');
      revolveY(L, [[0.006, 0.135], [0.036, 0.140], [0.106, 0.128], [0.152, 0.106]], 24, true, true);
      const M = L, from = M.count;
      for (let i = 0; i <= 10; i++) {
        const t = i / 10, a = lerp(-PI * 0.5, PI * 0.5, t);
        const rr = 0.106 * Math.cos(a * 0.75);
        const yy = 0.152 + 0.032 * (1 - Math.abs(Math.sin(a)));
        M.vert(Math.sin(a) * 0.098, yy, rr, 0, 1, 0, t, 0);
        M.vert(Math.sin(a) * 0.098, yy, -rr, 0, 1, 0, t, 1);
      }
      for (let i = 0; i < 10; i++) M.quad(from + i * 2, from + i * 2 + 1, from + (i + 1) * 2 + 1, from + (i + 1) * 2);
      M.smooth(from);
      brim(L, 0.006, 0.140, 0.302, 0.014, 32, 0.030, 0.022);
      torusY(P.get('leather#2a1c12'), 0.032, 0.141, 0.017, 28, 8);
      rbox(P.get('silver'), 0, 0.032, 0.144, 0.021, 0.015, 0.008, 0.004, 3);
    } },

  { id: 'santa', name: 'Santa Hat', grade: 'rare', anim: 'wobble', tags: ['holiday'],
    build: (P) => {
      const R = P.get('velvet#b81f2a');
      revolveY(R, [[0.006, 0.170], [0.042, 0.165], [0.110, 0.130], [0.200, 0.080], [0.300, 0.040], [0.368, 0.014]], 24, true, true);
      torusY(P.get('fur#f4f2ec'), 0.030, 0.172, 0.031, 30, 10);
      tube(R, [0, 0.368, 0], [0.024, 0.412, 0.058], 0.014, 0.010, 8);
      sphereY(P.get('fur#f4f2ec'), 0.420, 0.048, 16, 8);
    } },

  { id: 'halo', name: 'Halo', grade: 'legendary', anim: 'spin', tags: ['divine'],
    build: (P) => {
      torusY(P.get('gold'), 0.135, 0.150, 0.014, 34, 9);
      torusY(P.get('glow#fff2b0'), 0.135, 0.150, 0.027, 34, 9);
      const G = P.get('glow#fff2b0');
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * TAU;
        at(G, Math.cos(a) * 0.150, 0.135, Math.sin(a) * 0.150, () => sphereY(G, 0, 0.011, 8, 4));
      }
    } },

  { id: 'flowers', name: 'Flower Crown', grade: 'epic', anim: 'none', tags: ['nature'],
    build: (P) => {
      torusY(P.get('moss#3f6b2a'), 0.036, 0.160, 0.017, 30, 8);
      const cols = ['#f0a0c0', '#f6e06a', '#c9a0f0', '#f4f2ec', '#f08050'];
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * TAU, c = cols[i % cols.length];
        const M = P.get('plush' + c);
        for (let k = 0; k < 5; k++) {
          const b = (k / 5) * TAU;
          at(M, Math.cos(a) * 0.160 + Math.cos(b) * 0.024, 0.056, Math.sin(a) * 0.160 + Math.sin(b) * 0.024,
            () => sphereY(M, 0, 0.021, 8, 5, 0.015));
        }
        at(P.get('glow#fff3c0'), Math.cos(a) * 0.160, 0.066, Math.sin(a) * 0.160, () => sphereY(P.get('glow#fff3c0'), 0, 0.013, 8, 4));
      }
    } },

  { id: 'propeller', name: 'Propeller Cap', grade: 'epic', anim: 'spin', tags: ['toy'],
    build: (P) => {
      revolveY(P.get('knit#2b6fd0'), [[0.006, 0.150], [0.036, 0.152], [0.090, 0.142], [0.132, 0.100]], 24, true, true);
      torusY(P.get('fwhite'), 0.026, 0.153, 0.015, 28, 8);
      revolveY(P.get('silver'), [[0.132, 0.022], [0.170, 0.014], [0.186, 0.010]], 12, true, false);
      sphereY(P.get('fwhite'), 0.198, 0.021, 12, 6);
      const M = P.get('fred'), from = M.count;
      for (const s of [-1, 1]) {
        const f2 = M.count;
        for (let i = 0; i <= 6; i++) {
          const t = i / 6;
          // the chord must not taper to zero at the root: with z = 0.050*t the
          // two edges of the first quad were the same point, so those triangles
          // had no area and smooth() gave their vertices zero-length normals
          const x = s * t * 0.152, yy = 0.198 + Math.sin(t * PI) * 0.007, z = 0.012 + 0.040 * t;
          M.vert(x, yy, z, 0, 1, 0, t, 0);
          M.vert(x, yy, -z, 0, 1, 0, t, 1);
        }
        for (let i = 0; i < 6; i++) M.quad(f2 + i * 2, f2 + i * 2 + 1, f2 + (i + 1) * 2 + 1, f2 + (i + 1) * 2);
      }
      M.smooth(from);
    } },

  { id: 'baseball', name: 'Baseball Cap', grade: 'common', anim: 'none', tags: ['sport'],
    build: (P) => {
      revolveY(P.get('denim#25406e'), [[0.006, 0.150], [0.036, 0.152], [0.086, 0.144], [0.122, 0.115]], 24, true, true);
      torusY(P.get('denim#1b3055'), 0.024, 0.153, 0.014, 28, 8);
      const M = P.get('denim#1b3055'), from = M.count;
      for (let i = 0; i <= 12; i++) {
        const t = i / 12, a = lerp(-1.05, 1.05, t);
        const rr = 0.150 + 0.108 * Math.cos(a * 0.85);
        const yy = 0.010 - 0.022 * Math.cos(a) - 0.008 * t;
        M.vert(Math.sin(a) * rr, yy, Math.cos(a) * rr, 0, 1, 0, t, 0);
        M.vert(Math.sin(a) * rr * 1.03, yy - 0.013, Math.cos(a) * rr * 1.03, 0, 1, 0, t, 1);
      }
      for (let i = 0; i < 12; i++) M.quad(from + i * 2, from + i * 2 + 1, from + (i + 1) * 2 + 1, from + (i + 1) * 2);
      M.smooth(from);
      sphereY(P.get('fwhite'), 0.126, 0.015, 10, 5);
    } },

  { id: 'party', name: 'Party Cone', grade: 'common', anim: 'wobble', tags: ['party'],
    build: (P) => {
      coneY(P.get('glitter#e040a0'), 0.006, 0.140, 0.362, 0.0, 22, true, false);
      for (const t of [0.20, 0.46, 0.72]) {
        const rr = lerp(0.140, 0.0, t), yy = lerp(0.006, 0.362, t);
        torusY(P.get('fwhite'), yy, rr * 1.02, 0.010, 24, 6);
      }
      sphereY(P.get('glitter#f6e06a'), 0.382, 0.039, 14, 7);
      torusY(P.get('fwhite'), 0.022, 0.142, 0.015, 26, 8);
    } },

  { id: 'grad', name: 'Graduation Cap', grade: 'rare', anim: 'wobble', tags: ['formal'],
    build: (P) => {
      const B = P.get('felt#14141a');
      revolveY(B, [[0.006, 0.140], [0.032, 0.142], [0.062, 0.138]], 24, true, true);
      const M = B, from = M.count;
      for (let i = 0; i <= 4; i++) {
        const t = i / 4;
        for (let k = 0; k <= 4; k++) {
          const s = k / 4;
          M.vert(lerp(-0.192, 0.192, t), 0.070, lerp(-0.192, 0.192, s), 0, 1, 0, t, s);
        }
      }
      for (let i = 0; i < 4; i++) for (let k = 0; k < 4; k++)
        M.quad(from + i * 5 + k, from + i * 5 + k + 1, from + (i + 1) * 5 + k + 1, from + (i + 1) * 5 + k);
      M.smooth(from);
      sphereY(P.get('gold'), 0.080, 0.015, 10, 5);
      tube(P.get('gold'), [0.152, 0.072, 0.152], [0.152, 0.032, 0.152], 0.006, 0.006, 6);
      tube(P.get('gold'), [0.152, 0.032, 0.152], [0.188, -0.012, 0.188], 0.005, 0.005, 6);
      at(P.get('gold'), 0.192, -0.022, 0.192, () => sphereY(P.get('gold'), 0, 0.021, 12, 6));
    } },

  { id: 'devil', name: 'Devil Horns', grade: 'epic', anim: 'none', tags: ['dark'],
    build: (P) => {
      const M = P.get('ember#3a0d0a');
      for (const s of [-1, 1]) {
        const pts = [[s * 0.072, 0.032, 0.012], [s * 0.106, 0.100, 0.032], [s * 0.136, 0.166, 0.062], [s * 0.146, 0.216, 0.102], [s * 0.130, 0.248, 0.142]];
        for (let i = 0; i < pts.length - 1; i++)
          tube(M, pts[i], pts[i + 1], lerp(0.035, 0.006, i / 4), lerp(0.031, 0.003, (i + 1) / 4), 10);
      }
      torusY(M, 0.012, 0.150, 0.017, 28, 8);
    } },

  { id: 'unicorn', name: 'Unicorn Horn', grade: 'legendary', anim: 'spin', tags: ['magic'],
    build: (P) => {
      const M = P.get('pearl#f2ecf4');
      const prof = [];
      for (let i = 0; i <= 14; i++) prof.push([0.006 + i * 0.024, Math.max(0.0015, 0.052 * (1 - i / 14))]);
      revolveY(M, prof, 16, true, false);
      for (let i = 0; i < 9; i++) {
        const t = i / 9;
        torusY(P.get('glow#f6d8ff'), 0.006 + t * 0.336, Math.max(0.004, 0.052 * (1 - t) * 1.03), 0.006, 16, 5);
      }
      torusY(M, 0.014, 0.148, 0.021, 28, 8);
    } },

  { id: 'dragon', name: 'Dragon Skull', grade: 'legendary', anim: 'none', tags: ['fantasy'],
    build: (P) => {
      const B = P.get('bone#e8e0cc'), H = P.get('bone#cfc4a8');
      sphereY(B, 0.082, 0.115, 20, 10, 0.136);
      rbox(B, 0, 0.032, 0.122, 0.072, 0.050, 0.076, 0.024, 5);
      for (const s of [-1, 1]) {
        at(P.get('glow#ff5a1f'), s * 0.058, 0.102, 0.090, () => sphereY(P.get('glow#ff5a1f'), 0, 0.027, 12, 6));
        const pts = [[s * 0.090, 0.152, -0.02], [s * 0.150, 0.212, -0.06], [s * 0.182, 0.268, -0.12]];
        for (let i = 0; i < 2; i++) tube(H, pts[i], pts[i + 1], lerp(0.027, 0.008, i), lerp(0.025, 0.005, i + 1), 9);
        for (let i = 0; i < 4; i++) {
          const z = 0.152 - i * 0.027;
          tube(H, [s * (0.062 - i * 0.008), 0.032, z], [s * (0.062 - i * 0.008), 0.008, z], 0.010, 0.002, 6);
        }
      }
    } },

  { id: 'cactus', name: 'Cactus', grade: 'rare', anim: 'none', tags: ['nature'],
    build: (P) => {
      const C = P.get('moss#3f8a3a');
      revolveY(C, [[0.006, 0.075], [0.040, 0.078], [0.180, 0.072], [0.215, 0.060], [0.232, 0.0]], 18, true, false);
      for (const s of [-1, 1]) {
        at(C, s * 0.062, 0, 0.010, () => revolveY(C, [[0.078, 0.045], [0.112, 0.046], [0.152, 0.042]], 14, true, true));
      }
      const SP = P.get('glow#e8e0b0');
      for (let i = 0; i < 26; i++) {
        const a = i * 2.4, yy = 0.030 + (i % 13) * 0.016, rr = 0.071;
        tube(SP, [Math.cos(a) * rr, yy, Math.sin(a) * rr], [Math.cos(a) * (rr + 0.027), yy + 0.011, Math.sin(a) * (rr + 0.027)], 0.005, 0.001, 5);
      }
      sphereY(P.get('glow#f0a0c0'), 0.244, 0.033, 12, 6);
    } },

  { id: 'traffic', name: 'Traffic Cone', grade: 'common', anim: 'none', tags: ['street'],
    build: (P) => {
      coneY(P.get('orange'), 0.006, 0.135, 0.382, 0.005, 20, true, false);
      for (const t of [0.26, 0.56]) {
        const rr = lerp(0.135, 0.005, t), yy = lerp(0.006, 0.382, t);
        revolveY(P.get('fwhite'), [[yy - 0.022, rr * 1.03], [yy + 0.022, rr * 0.92]], 20, true, true);
      }
      rbox(P.get('orange'), 0, 0.008, 0, 0.178, 0.013, 0.178, 0.022, 5);
    } },

  { id: 'donut', name: 'Donut', grade: 'epic', anim: 'wobble', tags: ['food'],
    build: (P) => {
      torusY(P.get('bread#d8a052'), 0.086, 0.115, 0.058, 28, 12);
      torusY(P.get('icing#f06aa8'), 0.102, 0.116, 0.053, 28, 10);
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * TAU + 0.3, len = 0.030 + hash2(i, 3) * 0.048;
        const rr = 0.164;
        tube(P.get('icing#f06aa8'), [Math.cos(a) * rr, 0.086, Math.sin(a) * rr],
          [Math.cos(a) * rr * 0.99, 0.086 - len, Math.sin(a) * rr * 0.99], 0.022, 0.008, 8);
      }
      const cols = ['#f6e06a', '#5ad0f0', '#f0f0f0', '#a0f070', '#f08050'];
      for (let i = 0; i < 24; i++) {
        const a = hash2(i, 7) * TAU, rr = 0.085 + hash2(i, 11) * 0.078;
        rbox(P.get('plastic' + cols[i % cols.length]), Math.cos(a) * rr, 0.150 + hash2(i, 13) * 0.006, Math.sin(a) * rr, 0.015, 0.005, 0.005, 0.002, 3);
      }
    } },

  { id: 'sombrero', name: 'Sombrero', grade: 'epic', anim: 'none', tags: ['festival'],
    build: (P) => {
      const S = P.get('straw#d8b060');
      revolveY(S, [[0.006, 0.150], [0.042, 0.155], [0.130, 0.140], [0.210, 0.105], [0.272, 0.062], [0.302, 0.0]], 26, true, false);
      brim(S, 0.006, 0.150, 0.362, 0.020, 34, 0.056, 0.032);
      torusY(P.get('red'), 0.072, 0.152, 0.021, 30, 8);
      torusY(P.get('green'), 0.132, 0.140, 0.017, 28, 8);
      const B = P.get('straw#e8c878');
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * TAU;
        at(B, Math.cos(a) * 0.356, 0.362 + (i % 2) * 0.010, Math.sin(a) * 0.356, () => sphereY(B, 0, 0.021, 10, 5));
      }
    } },

  { id: 'beret', name: 'Beret', grade: 'common', anim: 'none', tags: ['art'],
    build: (P) => {
      const W = P.get('felt#8c1f2c');
      revolveY(W, [[0.006, 0.155], [0.042, 0.162], [0.090, 0.150], [0.130, 0.108], [0.152, 0.050]], 26, true, true);
      torusY(P.get('leather#2a1c16'), 0.022, 0.158, 0.015, 28, 8);
      sphereY(W, 0.158, 0.017, 10, 5);
    } },

  { id: 'fedora', name: 'Fedora', grade: 'rare', anim: 'none', tags: ['formal'],
    build: (P) => {
      const F = P.get('felt#3a3226');
      revolveY(F, [[0.006, 0.140], [0.036, 0.145], [0.096, 0.138], [0.142, 0.112]], 24, true, true);
      const M = F, from = M.count;
      for (let i = 0; i <= 10; i++) {
        const t = i / 10, a = lerp(-PI * 0.5, PI * 0.5, t);
        const rr = 0.100 * Math.cos(a * 0.8);
        const yy = 0.142 + 0.022 * (1 - Math.abs(Math.sin(a))) - 0.006;
        M.vert(Math.sin(a) * 0.092, yy, rr, 0, 1, 0, t, 0);
        M.vert(Math.sin(a) * 0.092, yy, -rr, 0, 1, 0, t, 1);
      }
      for (let i = 0; i < 10; i++) M.quad(from + i * 2, from + i * 2 + 1, from + (i + 1) * 2 + 1, from + (i + 1) * 2);
      M.smooth(from);
      brim(F, 0.006, 0.142, 0.258, 0.013, 30, 0.016, 0.028);
      torusY(P.get('leather#1e1610'), 0.032, 0.143, 0.016, 28, 8);
    } },

  { id: 'knight', name: 'Knight Helm', grade: 'epic', anim: 'none', tags: ['warrior'],
    build: (P) => {
      const I = P.get('hammered#9aa2ae');
      sphereY(I, 0.086, 0.150, 24, 11, 0.132);
      rbox(P.get('fblack'), 0, 0.100, 0.130, 0.090, 0.013, 0.021, 0.004, 3);
      rbox(P.get('fblack'), 0, 0.062, 0.134, 0.102, 0.027, 0.017, 0.006, 3);
      const R = P.get('feather#e03a4a');
      for (let i = 0; i < 7; i++) {
        const t = i / 6;
        at(R, 0, 0.152 + Math.sin(t * PI) * 0.072, lerp(-0.112, 0.112, t), () => sphereY(R, 0, 0.034 - t * 0.010, 10, 5));
      }
      for (const s of [-1, 1]) rbox(I, s * 0.136, 0.076, 0.032, 0.023, 0.056, 0.031, 0.010, 4);
      torusY(P.get('leather#2a1c16'), 0.012, 0.150, 0.016, 28, 8);
    } },

  { id: 'astro', name: 'Astro Helmet', grade: 'legendary', anim: 'none', tags: ['space'],
    build: (P) => {
      sphereY(P.get('porcelain#eef2f8'), 0.102, 0.160, 26, 12, 0.150);
      at(P.get('glass#8fd8ff'), 0, 0.102, 0.062, () => sphereY(P.get('glass#8fd8ff'), 0, 0.128, 20, 10, 0.118));
      torusY(P.get('silver'), 0.242, 0.092, 0.017, 22, 7);
      revolveY(P.get('silver'), [[0.252, 0.030], [0.288, 0.020]], 14, true, false);
      for (let i = 0; i < 3; i++) {
        const a = -0.7 + i * 0.7;
        rbox(P.get('glow#ff6a3a'), Math.sin(a) * 0.152, 0.062, Math.cos(a) * 0.152, 0.015, 0.015, 0.011, 0.004, 3);
      }
      torusY(P.get('silver'), 0.014, 0.150, 0.018, 28, 8);
    } },

  { id: 'catears', name: 'Cat Ears', grade: 'rare', anim: 'wobble', tags: ['animal'],
    build: (P) => {
      const F = P.get('fur#2a2a32');
      torusY(F, 0.012, 0.150, 0.025, 30, 9);
      for (const s of [-1, 1]) {
        const from = F.count;
        for (let k = 0; k <= 4; k++) {
          const t = k / 4;
          const x = s * lerp(0.078, 0.022, t), yy = 0.012 + t * 0.138, z = 0.010;
          const w = lerp(0.060, 0.006, t), d = lerp(0.032, 0.004, t);
          F.vert(x, yy, z - d, 0, 1, 0, t, 0);
          F.vert(x, yy, z + d, 0, 1, 0, t, 1);
          F.vert(x - s * w, yy, z - d * 0.5, 0, 1, 0, t, 0);
          F.vert(x - s * w, yy, z + d * 0.5, 0, 1, 0, t, 1);
        }
        for (let k = 0; k < 4; k++) {
          F.quad(from + k * 4, from + k * 4 + 1, from + (k + 1) * 4 + 1, from + (k + 1) * 4);
          F.quad(from + k * 4 + 2, from + (k + 1) * 4 + 2, from + (k + 1) * 4 + 3, from + k * 4 + 3);
          F.quad(from + k * 4, from + k * 4 + 2, from + (k + 1) * 4 + 2, from + (k + 1) * 4);
          F.quad(from + k * 4 + 1, from + (k + 1) * 4 + 1, from + (k + 1) * 4 + 3, from + k * 4 + 3);
        }
        F.smooth(from);
        const N = P.get('plush#f0a8b8'), f2 = N.count;
        for (let k = 0; k <= 3; k++) {
          const t = k / 3;
          const x = s * lerp(0.072, 0.034, t), yy = 0.024 + t * 0.102;
          const w = lerp(0.036, 0.005, t);
          N.vert(x, yy, 0.012, 0, 0, 1, t, 0);
          N.vert(x - s * w, yy, 0.012, 0, 0, 1, t, 1);
        }
        for (let k = 0; k < 3; k++) N.quad(f2 + k * 2, f2 + k * 2 + 1, f2 + (k + 1) * 2 + 1, f2 + (k + 1) * 2);
      }
    } },

  { id: 'bunny', name: 'Bunny Ears', grade: 'rare', anim: 'wobble', tags: ['animal'],
    build: (P) => {
      const F = P.get('fur#f2eee6'), N = P.get('plush#f0a8b8');
      torusY(F, 0.012, 0.150, 0.023, 30, 9);
      for (const s of [-1, 1]) {
        const pts = [[s * 0.072, 0.022, 0], [s * 0.096, 0.142, -0.02], [s * 0.101, 0.282, -0.05], [s * 0.087, 0.402, -0.09], [s * 0.072, 0.458, -0.12]];
        for (let i = 0; i < pts.length - 1; i++)
          tube(F, pts[i], pts[i + 1], lerp(0.048, 0.012, i / 4), lerp(0.046, 0.008, (i + 1) / 4), 12);
        for (let i = 0; i < pts.length - 1; i++)
          tube(N, [pts[i][0], pts[i][1], pts[i][2] + 0.031], [pts[i + 1][0], pts[i + 1][1], pts[i + 1][2] + 0.031],
            lerp(0.026, 0.006, i / 4), lerp(0.024, 0.004, (i + 1) / 4), 10);
      }
    } },

  { id: 'burger', name: 'Burger', grade: 'epic', anim: 'wobble', tags: ['food'],
    build: (P) => {
      const B = P.get('sesame#d8a052');
      revolveY(B, [[0.006, 0.140], [0.022, 0.142], [0.052, 0.136], [0.064, 0.120]], 22, true, true);
      revolveY(P.get('bread#8a5a34'), [[0.064, 0.148], [0.092, 0.150], [0.120, 0.146]], 22, true, true);
      revolveY(P.get('cheese#f8c434'), [[0.120, 0.156], [0.134, 0.158], [0.144, 0.150]], 22, true, true);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * TAU + 0.4;
        rbox(P.get('cheese#f8c434'), Math.cos(a) * 0.150, 0.118, Math.sin(a) * 0.150, 0.031, 0.006, 0.031, 0.002, 3);
      }
      const L = P.get('moss#4a9a3a');
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * TAU;
        at(L, Math.cos(a) * 0.128, 0.148, Math.sin(a) * 0.128, () => sphereY(L, 0, 0.037, 8, 5, 0.015));
      }
      revolveY(P.get('red'), [[0.160, 0.126], [0.176, 0.128], [0.188, 0.120]], 22, true, true);
      revolveY(B, [[0.188, 0.138], [0.212, 0.140], [0.252, 0.126], [0.292, 0.090], [0.317, 0.040], [0.324, 0.0]], 24, true, false);
      for (let i = 0; i < 18; i++) {
        const a = hash2(i, 3) * TAU, rr = hash2(i, 7) * 0.116;
        rbox(P.get('bone#f4ecd8'), Math.cos(a) * rr, 0.252 + hash2(i, 11) * 0.072, Math.sin(a) * rr, 0.011, 0.005, 0.006, 0.002, 3);
      }
    } },

  { id: 'pizza', name: 'Pizza Slice', grade: 'rare', anim: 'wobble', tags: ['food'],
    build: (P) => {
      const M = P.get('bread#e8c078'), W = 0.44;
      for (const [yy, ny] of [[0.006, 1], [0.032, -1]]) {
        const from = M.count;
        for (let i = 0; i <= 6; i++) {
          const t = i / 6, r = lerp(0.020, 0.232, t);
          M.vert(0, yy, -r, 0, ny, 0, t, 0);
          M.vert(Math.sin(W) * r, yy, -Math.cos(W) * r, 0, ny, 0, t, 1);
        }
        for (let i = 0; i < 6; i++)
          ny > 0 ? M.quad(from + i * 2, from + i * 2 + 1, from + (i + 1) * 2 + 1, from + (i + 1) * 2)
                 : M.quad(from + i * 2, from + (i + 1) * 2, from + (i + 1) * 2 + 1, from + i * 2 + 1);
        M.smooth(from);
      }
      const C = P.get('cheese#f8d878'), from = C.count;
      for (let i = 0; i <= 6; i++) {
        const t = i / 6, r = lerp(0.024, 0.198, t);
        C.vert(0, 0.034, -r, 0, 1, 0, t, 0);
        C.vert(Math.sin(0.42) * r, 0.034, -Math.cos(0.42) * r, 0, 1, 0, t, 1);
      }
      for (let i = 0; i < 6; i++) C.quad(from + i * 2, from + i * 2 + 1, from + (i + 1) * 2 + 1, from + (i + 1) * 2);
      C.smooth(from);
      for (let i = 0; i < 4; i++) {
        const t = 0.35 + hash2(i, 5) * 0.5, a = 0.10 + hash2(i, 9) * 0.22, r = lerp(0.020, 0.232, t);
        at(P.get('red'), Math.sin(a) * r, 0.036, -Math.cos(a) * r,
          () => revolveY(P.get('red'), [[0.000, 0.031], [0.008, 0.032]], 12, true, true));
      }
      torusY(P.get('bread#c89858'), 0.022, 0.218, 0.031, 14, 8);
    } },

  { id: 'duck', name: 'Rubber Duck', grade: 'epic', anim: 'wobble', tags: ['toy'],
    build: (P) => {
      const Y = P.get('ceramic#fcdc28');
      sphereY(Y, 0.078, 0.120, 20, 10, 0.100);
      sphereY(Y, 0.182, 0.086, 20, 10, 0.086);
      rbox(P.get('orange'), 0, 0.172, 0.080, 0.043, 0.017, 0.029, 0.006, 4);
      for (const s of [-1, 1]) {
        at(P.get('fblack'), s * 0.038, 0.200, 0.064, () => sphereY(P.get('fblack'), 0, 0.017, 10, 5));
      }
      sphereY(Y, 0.240, 0.027, 12, 6);
      for (const s of [-1, 1]) rbox(Y, s * 0.102, 0.062, -0.010, 0.031, 0.021, 0.062, 0.013, 4);
    } },

  { id: 'octopus', name: 'Octopus', grade: 'epic', anim: 'wobble', tags: ['animal'],
    build: (P) => {
      const V = P.get('slime#7a3fd0');
      sphereY(V, 0.118, 0.130, 22, 11, 0.140);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU;
        for (let s = 0; s < 5; s++) {
          const t = s / 4;
          const rr = lerp(0.116, 0.192, t), yy = lerp(0.032, -0.010 - t * 0.020, t);
          const x = Math.cos(a + t * 0.7) * rr, z = Math.sin(a + t * 0.7) * rr;
          tube(V, [x, yy + 0.015, z], [x, yy - 0.015, z], lerp(0.031, 0.008, t), lerp(0.029, 0.006, t), 8);
        }
      }
      for (const s of [-1, 1]) {
        at(P.get('glow#fff6d0'), s * 0.062, 0.152, 0.100, () => sphereY(P.get('glow#fff6d0'), 0, 0.035, 12, 6, 0.031));
        at(P.get('fblack'), s * 0.062, 0.152, 0.114, () => sphereY(P.get('fblack'), 0, 0.017, 10, 5));
      }
    } },

  { id: 'sharkfin', name: 'Shark Fin', grade: 'rare', anim: 'none', tags: ['animal'],
    build: (P) => {
      const M = P.get('scale#4a6a86'), from = M.count;
      for (let i = 0; i <= 7; i++) {
        const t = i / 7;
        const z = lerp(-0.152, 0.152, t);
        const h = 0.232 * Math.cos((t - 0.5) * 2.0) + 0.010;
        const w = 0.029 * (1 - Math.abs(t - 0.5) * 1.4);
        M.vert(z, 0.006, -w, 0, 0, -1, t, 0);
        M.vert(z, 0.006 + h, -w * 0.35, 0, 0, -1, t, 1);
        M.vert(z, 0.006 + h, w * 0.35, 0, 0, 1, t, 1);
        M.vert(z, 0.006, w, 0, 0, 1, t, 0);
      }
      for (let i = 0; i < 7; i++) {
        const a = from + i * 4;
        M.quad(a, a + 4, a + 5, a + 1);
        M.quad(a + 3, a + 2, a + 6, a + 7);
        M.quad(a, a + 3, a + 7, a + 4);
        M.quad(a + 1, a + 5, a + 6, a + 2);
      }
      M.smooth(from);
      revolveY(M, [[0.006, 0.140], [0.016, 0.142]], 24, false, false);
    } },

  { id: 'moai', name: 'Moai', grade: 'legendary', anim: 'none', tags: ['ancient'],
    build: (P) => {
      const S = P.get('stone#8e8a80');
      rbox(S, 0, 0.112, 0, 0.106, 0.116, 0.086, 0.030, 5);
      rbox(S, 0, 0.248, -0.010, 0.116, 0.062, 0.092, 0.040, 5);
      rbox(S, 0, 0.182, 0.088, 0.037, 0.076, 0.031, 0.012, 4);
      for (const s of [-1, 1]) {
        rbox(P.get('fblack'), s * 0.053, 0.270, 0.080, 0.031, 0.015, 0.011, 0.004, 3);
        rbox(S, s * 0.109, 0.252, 0.032, 0.021, 0.051, 0.031, 0.010, 4);
      }
      rbox(P.get('fblack'), 0, 0.224, 0.084, 0.049, 0.011, 0.011, 0.003, 3);
      revolveY(S, [[0.006, 0.150], [0.012, 0.152]], 24, false, false);
    } },

  { id: 'pumpkin', name: 'Jack-o-Lantern', grade: 'epic', anim: 'bob', tags: ['holiday'],
    build: (P) => {
      const O = P.get('ember#e07018');
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * PI;
        const from = O.count;
        sphereY(O, 0.138, 0.145, 20, 10, 0.132);
        for (let k = from; k < O.count; k++) {
          const px = O.p[k * 3], pz = O.p[k * 3 + 2];
          O.p[k * 3] = px * Math.cos(a) - pz * Math.sin(a);
          O.p[k * 3 + 2] = px * Math.sin(a) + pz * Math.cos(a);
        }
      }
      revolveY(P.get('moss#3f6b2a'), [[0.272, 0.027], [0.312, 0.023], [0.332, 0.014]], 10, true, false);
      const G = P.get('glow#ffb020');
      for (const s of [-1, 1]) {
        rbox(G, s * 0.057, 0.162, 0.132, 0.037, 0.006, 0.011, 0.003, 3);
        rbox(G, s * 0.063, 0.162, 0.130, 0.020, 0.037, 0.011, 0.003, 3);
      }
      rbox(G, 0, 0.102, 0.142, 0.071, 0.027, 0.011, 0.004, 3);
      rbox(G, 0, 0.102, 0.148, 0.011, 0.041, 0.007, 0.002, 3);
    } },

  { id: 'snowman', name: 'Snowman', grade: 'rare', anim: 'wobble', tags: ['holiday'],
    build: (P) => {
      const S = P.get('ice#dff0f8');
      sphereY(S, 0.072, 0.115, 20, 10);
      sphereY(S, 0.206, 0.086, 20, 10);
      sphereY(S, 0.320, 0.063, 18, 9);
      tube(P.get('orange'), [0, 0.320, 0.056], [0, 0.320, 0.118], 0.015, 0.001, 8);
      for (const s of [-1, 1]) at(P.get('fblack'), s * 0.028, 0.340, 0.050, () => sphereY(P.get('fblack'), 0, 0.013, 8, 4));
      revolveY(P.get('felt#1b1a20'), [[0.370, 0.076], [0.402, 0.070], [0.422, 0.055]], 16, true, true);
      brim(P.get('felt#1b1a20'), 0.370, 0.070, 0.118, 0.008, 18, 0.004, 0.004);
      torusY(P.get('red'), 0.402, 0.073, 0.010, 18, 6);
      for (let i = 0; i < 3; i++) rbox(P.get('fblack'), 0, 0.172 + i * 0.033, 0.080, 0.009, 0.009, 0.007, 0.002, 3);
    } },

  { id: 'antlers', name: 'Antlers', grade: 'epic', anim: 'none', tags: ['nature'],
    build: (P) => {
      const B = P.get('bone#c8ac78');
      for (const s of [-1, 1]) {
        const main = [[s * 0.076, 0.032, 0], [s * 0.116, 0.132, -0.01], [s * 0.151, 0.232, -0.03], [s * 0.171, 0.322, -0.06], [s * 0.166, 0.392, -0.10]];
        for (let i = 0; i < main.length - 1; i++)
          tube(B, main[i], main[i + 1], lerp(0.025, 0.007, i / 4), lerp(0.023, 0.005, (i + 1) / 4), 9);
        for (let b = 0; b < 3; b++) {
          const t = 0.28 + b * 0.24, i0 = Math.floor(t * 4), f = t * 4 - i0;
          const px = lerp(main[i0][0], main[i0 + 1][0], f);
          const py = lerp(main[i0][1], main[i0 + 1][1], f);
          const pz = lerp(main[i0][2], main[i0 + 1][2], f);
          tube(B, [px, py, pz], [px + s * 0.056, py + 0.076 + b * 0.013, pz + 0.031], 0.016, 0.005, 8);
        }
      }
      torusY(P.get('leather#3a2a1c'), 0.012, 0.148, 0.019, 28, 8);
    } },

  { id: 'tiara', name: 'Tiara', grade: 'legendary', anim: 'bob', tags: ['royal'],
    build: (P) => {
      const G = P.get('rosegold');
      revolveY(G, [[0.006, 0.150], [0.032, 0.152], [0.072, 0.150]], 26, true, false);
      torusY(G, 0.016, 0.152, 0.011, 30, 7);
      torusY(G, 0.074, 0.150, 0.010, 30, 7);
      for (let i = 0; i < 7; i++) {
        const a = lerp(-1.2, 1.2, i / 6);
        const h = 0.056 + Math.cos(a * 1.3) * 0.050;
        const x = Math.sin(a) * 0.148, z = Math.cos(a) * 0.148;
        at(G, x, 0, z, () => coneY(G, 0.074, 0.027, 0.074 + h, 0.0, 8));
        at(P.get('glow#fff0f6'), x, 0.074 + h + 0.015, z, () => sphereY(P.get('glow#fff0f6'), 0, 0.015, 10, 5));
      }
    } },

  { id: 'mushroom', name: 'Mushroom', grade: 'rare', anim: 'none', tags: ['nature'],
    build: (P) => {
      revolveY(P.get('bone#f0ead8'), [[0.006, 0.062], [0.060, 0.058], [0.122, 0.052]], 16, true, true);
      revolveY(P.get('red'), [[0.112, 0.070], [0.150, 0.145], [0.190, 0.160], [0.230, 0.130], [0.255, 0.060], [0.266, 0.0]], 24, true, false);
      const W = P.get('bone#f4f0e2');
      for (let i = 0; i < 12; i++) {
        const a = hash2(i, 3) * TAU, rr = 0.040 + hash2(i, 7) * 0.100;
        const yy = 0.150 + hash2(i, 11) * 0.086;
        at(W, Math.cos(a) * rr, yy, Math.sin(a) * rr, () => sphereY(W, 0, 0.027, 10, 5, 0.011));
      }
      torusY(P.get('moss#4a7a3a'), 0.014, 0.064, 0.015, 18, 6);
    } },

  { id: 'sushi', name: 'Sushi', grade: 'epic', anim: 'none', tags: ['food'],
    build: (P) => {
      rbox(P.get('porcelain#f4f2ec'), 0, 0.072, 0, 0.116, 0.063, 0.071, 0.030, 5);
      rbox(P.get('salmon'), 0, 0.142, 0, 0.121, 0.021, 0.076, 0.014, 5);
      for (let i = 0; i < 5; i++) {
        const x = lerp(-0.086, 0.086, i / 4);
        rbox(P.get('salmon#e87050'), x, 0.154, 0, 0.011, 0.006, 0.071, 0.003, 3);
      }
      for (const s of [-1, 1]) {
        slab(P.get('carboncloth#1a2a24'), [[s * 0.061, 0.012, -0.079], [s * 0.119, 0.012, -0.079], [s * 0.119, 0.170, -0.079], [s * 0.061, 0.170, -0.079]], 0.008, 'z');
        slab(P.get('carboncloth#1a2a24'), [[s * 0.061, 0.012, 0.079], [s * 0.119, 0.012, 0.079], [s * 0.119, 0.170, 0.079], [s * 0.061, 0.170, 0.079]], 0.008, 'z');
      }
      at(P.get('moss#4a9a3a'), 0, 0.170, -0.058, () => sphereY(P.get('moss#4a9a3a'), 0, 0.021, 10, 5, 0.013));
    } },

  { id: 'brain', name: 'Brain', grade: 'legendary', anim: 'bob', tags: ['weird'],
    build: (P) => {
      sphereY(P.get('slime#e8a0b8'), 0.118, 0.140, 22, 11, 0.130);
      const M = P.get('slime#d08098');
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * TAU;
        const pts = [];
        for (let k = 0; k <= 6; k++) {
          const t = k / 6, ang = a + Math.sin(t * PI * 2 + i) * 0.55;
          const yy = 0.118 + Math.cos(t * PI) * 0.125;
          const rr = 0.136 * Math.sin(t * PI) + 0.008;
          pts.push([Math.cos(ang) * rr, yy, Math.sin(ang) * rr]);
        }
        for (let k = 0; k < 6; k++) tube(M, pts[k], pts[k + 1], 0.011, 0.010, 6);
      }
      revolveY(P.get('glow#ff6aa0'), [[0.242, 0.021], [0.258, 0.014]], 12, true, false);
    } },

  { id: 'alien', name: 'Alien', grade: 'legendary', anim: 'bob', tags: ['space'],
    build: (P) => {
      const G = P.get('moss#7ac04a');
      sphereY(G, 0.152, 0.150, 24, 12, 0.170);
      rbox(G, 0, 0.042, 0.022, 0.071, 0.041, 0.061, 0.020, 4);
      for (const s of [-1, 1]) {
        at(P.get('fblack'), s * 0.074, 0.172, 0.100, () => sphereY(P.get('fblack'), 0, 0.053, 14, 7, 0.037));
        at(P.get('glow#eaffd0'), s * 0.078, 0.178, 0.122, () => sphereY(P.get('glow#eaffd0'), 0, 0.019, 10, 5));
        tube(G, [s * 0.120, 0.292, 0], [s * 0.150, 0.402, 0.022], 0.010, 0.004, 6);
        at(P.get('glow#eaffd0'), s * 0.150, 0.410, 0.022, () => sphereY(P.get('glow#eaffd0'), 0, 0.015, 8, 4));
      }
    } },

  { id: 'ghost', name: 'Ghost', grade: 'rare', anim: 'bob', tags: ['spooky'],
    build: (P) => {
      const W = P.get('porcelain#eaf4ff');
      revolveY(W, [[0.020, 0.120], [0.070, 0.150], [0.130, 0.156], [0.190, 0.128], [0.230, 0.086], [0.252, 0.032], [0.262, 0.0]], 24, true, false);
      const M = W, from = M.count;
      for (let i = 0; i <= 24; i++) {
        const t = i / 24, a = t * TAU;
        const rr = 0.122 + Math.sin(t * TAU * 5) * 0.016;
        M.vert(Math.cos(a) * rr, 0.020 + Math.sin(t * TAU * 5) * 0.026, Math.sin(a) * rr, 0, -1, 0, t, 0);
        M.vert(Math.cos(a) * rr * 0.35, 0.006, Math.sin(a) * rr * 0.35, 0, -1, 0, t, 1);
      }
      for (let i = 0; i < 24; i++) M.quad(from + i * 2, from + i * 2 + 1, from + (i + 1) * 2 + 1, from + (i + 1) * 2);
      for (const s of [-1, 1]) at(P.get('glow#8fe0ff'), s * 0.056, 0.172, 0.130, () => sphereY(P.get('glow#8fe0ff'), 0, 0.031, 12, 6, 0.021));
      rbox(P.get('fblack'), 0, 0.110, 0.132, 0.033, 0.017, 0.015, 0.006, 3);
    } },

  { id: 'pineapple', name: 'Pineapple', grade: 'rare', anim: 'wobble', tags: ['food'],
    build: (P) => {
      revolveY(P.get('pineapple#d8a834'), [[0.006, 0.055], [0.042, 0.105], [0.110, 0.135], [0.190, 0.130], [0.250, 0.108], [0.290, 0.060], [0.306, 0.0]], 24, true, false);
      const L = P.get('moss#3f7a2a');
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * TAU;
        tube(L, [Math.cos(a) * 0.030, 0.302, Math.sin(a) * 0.030],
          [Math.cos(a) * 0.070, 0.432, Math.sin(a) * 0.070], 0.031, 0.004, 8);
      }
    } },

  { id: 'watermelon', name: 'Watermelon', grade: 'rare', anim: 'wobble', tags: ['food'],
    build: (P) => {
      const R = P.get('green');
      revolveY(R, [[0.006, 0.150], [0.034, 0.150]], 26, true, true);
      torusY(P.get('green'), 0.036, 0.150, 0.020, 26, 7);
      const F = P.get('watermelon#d8303e');
      const prof = [];
      for (let i = 0; i <= 10; i++) {
        const a = (i / 10) * PI * 0.5;
        prof.push([0.034 + Math.sin(a) * 0.132, Math.cos(a) * 0.148]);
      }
      revolveY(F, prof, 26, true, false);
      for (let i = 0; i < 10; i++) {
        const a = hash2(i, 3) * TAU, rr = 0.030 + hash2(i, 7) * 0.085;
        rbox(P.get('fblack'), Math.cos(a) * rr, 0.160 + hash2(i, 11) * 0.040, Math.sin(a) * rr, 0.011, 0.005, 0.007, 0.002, 3);
      }
    } },

  { id: 'icecream', name: 'Ice Cream Cone', grade: 'epic', anim: 'wobble', tags: ['food'],
    build: (P) => {
      revolveY(P.get('waffle#d8a860'), [[0.006, 0.070], [0.022, 0.062], [0.142, 0.028], [0.192, 0.007]], 20, true, false);
      for (let i = 0; i < 6; i++) {
        const t = i / 6, yy = lerp(0.022, 0.182, t), rr = lerp(0.062, 0.011, t);
        torusY(P.get('waffle#c89850'), yy, rr * 1.04, 0.005, 18, 5);
      }
      sphereY(P.get('porcelain#f4f0e4'), 0.238, 0.090, 20, 10, 0.086);
      sphereY(P.get('candy#f6a8c0'), 0.322, 0.082, 20, 10, 0.078);
      sphereY(P.get('candy#8a5a34'), 0.392, 0.066, 18, 9, 0.062);
      sphereY(P.get('red'), 0.442, 0.032, 12, 6);
      for (let i = 0; i < 10; i++) {
        const a = hash2(i, 5) * TAU, rr = hash2(i, 9) * 0.090, yy = 0.232 + hash2(i, 13) * 0.200;
        rbox(P.get('glow#ffe0a0'), Math.cos(a) * rr, yy, Math.sin(a) * rr, 0.013, 0.004, 0.005, 0.002, 3);
      }
    } },

  { id: 'barrel', name: 'Barrel', grade: 'common', anim: 'none', tags: ['pirate'],
    build: (P) => {
      revolveY(P.get('wood#7a5230'), [[0.006, 0.130], [0.042, 0.152], [0.110, 0.158], [0.180, 0.152], [0.222, 0.130]], 22, true, true);
      for (const t of [0.14, 0.5, 0.86]) {
        const yy = lerp(0.006, 0.222, t), rr = 0.130 + Math.sin(t * PI) * 0.030;
        torusY(P.get('rust#8a5a2a'), yy, rr * 1.02, 0.013, 22, 7);
      }
    } },

  { id: 'treasure', name: 'Treasure Chest', grade: 'legendary', anim: 'none', tags: ['pirate'],
    build: (P) => {
      const W = P.get('wood#6a4426'), G = P.get('gold');
      rbox(W, 0, 0.064, 0, 0.152, 0.060, 0.102, 0.020, 5);
      revolveY(W, [[0.122, 0.100], [0.172, 0.090], [0.206, 0.055], [0.222, 0.0]], 20, true, false);
      for (const s of [-1, 1]) {
        rbox(G, s * 0.112, 0.092, 0, 0.015, 0.100, 0.106, 0.008, 4);
        slab(G, [[s * 0.152, 0.012, -0.104], [s * 0.152, 0.132, -0.104], [s * 0.152, 0.132, 0.104], [s * 0.152, 0.012, 0.104]], 0.010, 'x');
      }
      rbox(G, 0, 0.118, 0.106, 0.031, 0.035, 0.016, 0.008, 4);
      for (let i = 0; i < 9; i++) {
        const a = hash2(i, 3) * 1.4 - 0.7, rr = 0.020 + hash2(i, 7) * 0.076;
        at(G, a * 0.10, 0.228, rr, () => sphereY(G, 0, 0.019, 10, 5));
      }
    } },

  { id: 'hotdog', name: 'Hot Dog', grade: 'epic', anim: 'wobble', tags: ['food'],
    build: (P) => {
      revolveY(P.get('bread#d8a860'), [[0.006, 0.090], [0.032, 0.098], [0.092, 0.100], [0.132, 0.090]], 20, true, true);
      revolveY(P.get('maroon#b83a2a'), [[0.100, 0.052], [0.142, 0.056], [0.182, 0.052]], 18, true, true);
      const Y = P.get('yellow');
      for (let i = 0; i < 9; i++) {
        const a = (i / 8) * TAU;
        at(Y, Math.cos(a) * 0.030, 0.154, Math.sin(a) * 0.030, () => sphereY(Y, 0, 0.021, 8, 5, 0.015));
      }
      rbox(Y, 0, 0.152, 0, 0.041, 0.011, 0.076, 0.004, 3);
    } },

  { id: 'record', name: 'Vinyl Record', grade: 'rare', anim: 'spin', tags: ['music'],
    build: (P) => {
      revolveY(P.get('carboncloth#141416'), [[0.010, 0.150], [0.022, 0.152], [0.032, 0.150]], 34, true, true);
      revolveY(P.get('red'), [[0.032, 0.058], [0.042, 0.058]], 24, true, true);
      revolveY(P.get('fwhite'), [[0.042, 0.023], [0.048, 0.023]], 18, true, true);
      torusY(P.get('chrome'), 0.022, 0.152, 0.005, 34, 6);
      for (let i = 0; i < 5; i++) torusY(P.get('carboncloth#242428'), 0.022, 0.072 + i * 0.018, 0.002, 32, 5);
    } },

  { id: 'toaster', name: 'Toaster', grade: 'legendary', anim: 'bob', tags: ['appliance'],
    build: (P) => {
      rbox(P.get('chrome'), 0, 0.078, 0, 0.106, 0.074, 0.086, 0.024, 5);
      rbox(P.get('fblack'), 0, 0.152, 0, 0.086, 0.008, 0.063, 0.004, 3);
      for (const s of [-1, 1]) {
        slab(P.get('fblack'), [[s * 0.071, 0.152, -0.056], [s * 0.086, 0.152, -0.056], [s * 0.086, 0.152, 0.056], [s * 0.071, 0.152, 0.056]], 0.006, 'y');
        rbox(P.get('fblack'), s * 0.076, 0.078, 0.087, 0.015, 0.015, 0.008, 0.003, 3);
        rbox(P.get('toast#d8a860'), s * 0.050, 0.196, 0, 0.041, 0.046, 0.059, 0.014, 4);
      }
      rbox(P.get('fblack'), 0, 0.022, 0.087, 0.027, 0.021, 0.010, 0.004, 3);
    } },
];

export const TOPPER_BY_ID = new Map(TOPPERS.map(t => [t.id, t]));

/** Build one topper into a Parts bag. */
export function buildTopper(spec, quality = 'high') {
  const P = new Parts();
  const q = quality === 'low' ? 0.6 : quality === 'med' ? 0.8 : 1;
  spec.build(P, q);
  return P;
}

/** Every material slot a topper needs, so the gallery can pre-bake in one go.
 *  Uses real Mesh bags so the build runs exactly as it would for real.
 *  Deliberately NOT wrapped in try/catch: a topper that throws here would also
 *  throw in buildTopper(), and hiding it would turn a loud failure into a
 *  silently missing material slot. */
export function topperSlots(spec) {
  const seen = new Set(), bags = new Map();
  const fake = {
    get(slot) {
      seen.add(slot);
      let m = bags.get(slot);
      if (!m) { m = new Mesh(); bags.set(slot, m); }
      return m;
    },
  };
  spec.build(fake, 1);
  return [...seen];
}

export const TOPPER_STATS = {
  total: TOPPERS.length,
  byGrade: TOPPERS.reduce((a, t) => { a[t.grade] = (a[t.grade] || 0) + 1; return a; }, {}),
};
