/* =============================================================================
 * ultra/materials.js — procedural PBR surface + bump-map engine
 * -----------------------------------------------------------------------------
 * The base library had exactly one surface language: paint, carbon, chrome,
 * rubber, glass. That is enough for a car shell and nowhere near enough for a
 * wardrobe. A top hat made of the same shader as a fender is why the old
 * accessories read as coloured plastic.
 *
 * Every surface here is a HEIGHT FIELD. From that one field we derive:
 *   albedo    — tinted by the height, so grooves go dark on their own
 *   roughness — modulated by the field, so raised threads catch light
 *   normal    — central-difference bump map (this is the "bump map" request)
 *   emissive  — optional, for lava / slime / glowing jelly / jack-o-lantern
 *
 * Same constraints as the base library: raw Uint8 buffers, no <canvas>, so it
 * runs in node, in a worker, during SSR and in a unit test.
 * ===========================================================================*/

import {
  TAU, PI, buffer, fill, normalFromHeight, hexToRgb, rgbToHex,
} from '../carLibraryPro.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const mix3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/* ---- noise --------------------------------------------------------------- */

function hash2(x, y) {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = smooth(x - xi), yf = smooth(y - yi);
  const a = hash2(xi, yi), b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
  return lerp(lerp(a, b, xf), lerp(c, d, xf), yf);
}
function fbm(x, y, oct = 4, gain = 0.5, lac = 2.0) {
  let s = 0, a = 0.5, n = 0;
  for (let i = 0; i < oct; i++) { s += a * vnoise(x, y); n += a; x *= lac; y *= lac; a *= gain; }
  return s / n;
}
function voronoi(x, y, jitter = 1) {
  const xi = Math.floor(x), yi = Math.floor(y);
  let best = 9, second = 9, id = 0;
  for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
    const cx = xi + i, cy = yi + j;
    const px = cx + hash2(cx, cy) * jitter, py = cy + hash2(cy * 7 + 3, cx * 13 + 1) * jitter;
    const d = Math.hypot(px - x, py - y);
    if (d < best) { second = best; best = d; id = hash2(cx * 3 + 11, cy * 5 + 7); }
    else if (d < second) second = d;
  }
  return { d: best, edge: second - best, id };
}
/** 2x2 over/under weave, the primitive behind carbon, straw, basket and cloth. */
function weave(x, y, rep = 24) {
  const gx = x * rep * 2, gy = y * rep;
  const cx = Math.floor(gx), cy = Math.floor(gy);
  const over = ((cx >> 1) + (cy >> 1)) % 2;
  const fx = gx - cx, fy = gy - cy;
  return (over ? Math.sin(fx * PI) : Math.sin(fy * PI)) * 0.8 + (over ? 0.2 : 0);
}
/** Radial falloff used by every "cell" surface (pebbles, sequins, scales). */
const dome = (r) => Math.sqrt(Math.max(0, 1 - r * r));

/* ---- surface definitions -------------------------------------------------
 * h(u,v) -> 0..1 height. `rough` is the mid roughness, `var` how much the
 * height field is allowed to move it, `str` the bump strength.
 * ------------------------------------------------------------------------- */

export const SURFACES = {

  /* --- textiles --------------------------------------------------------- */
  felt: {
    tint: [34, 32, 40], rough: 0.95, var: 0.10, str: 1.0, metal: 0,
    h: (u, v) => fbm(u * 260, v * 260, 2) * 0.55 + fbm(u * 48, v * 48, 3) * 0.45,
  },
  knit: {
    tint: [214, 214, 220], rough: 0.92, var: 0.14, str: 1.7, metal: 0,
    // chunky vertical ribs + the little V of each stitch
    h: (u, v) => {
      const rib = Math.sin(u * TAU * 16) * 0.5 + 0.5;
      const row = Math.sin(v * TAU * 22) * 0.5 + 0.5;
      const st = Math.abs(Math.sin((u * 16 + v * 22) * PI)) * 0.6;
      return clamp(rib * 0.45 + row * 0.2 + st * 0.45, 0, 1);
    },
  },
  fur: {
    tint: [236, 228, 214], rough: 0.88, var: 0.16, str: 2.2, metal: 0,
    // strands run along v so the pile lies down the ear
    h: (u, v) => fbm(u * 130, v * 460, 3) * 0.7 + fbm(u * 420, v * 1200, 2) * 0.3,
  },
  plush: {
    tint: [255, 236, 176], rough: 0.9, var: 0.12, str: 1.4, metal: 0,
    h: (u, v) => fbm(u * 90, v * 90, 4) * 0.75 + fbm(u * 340, v * 340, 2) * 0.25,
  },
  leather: {
    tint: [58, 34, 28], rough: 0.62, var: 0.22, str: 1.5, metal: 0,
    h: (u, v) => {
      const p = voronoi(u * 62, v * 62, 0.9);
      return clamp(dome(clamp(p.d / 0.62, 0, 1)) * 0.8 + fbm(u * 300, v * 300, 2) * 0.2, 0, 1);
    },
  },
  denim: {
    tint: [46, 62, 96], rough: 0.86, var: 0.10, str: 1.1, metal: 0,
    h: (u, v) => {
      const twill = Math.sin((u * 0.72 + v) * TAU * 84) * 0.5 + 0.5;
      return clamp(twill * 0.7 + fbm(u * 220, v * 220, 2) * 0.3, 0, 1);
    },
  },
  canvas: {
    tint: [96, 104, 84], rough: 0.9, var: 0.12, str: 1.6, metal: 0,
    h: (u, v) => weave(u, v, 46),
  },
  velvet: {
    tint: [58, 22, 92], rough: 0.55, var: 0.10, str: 0.5, metal: 0, sheen: 1.0,
    h: (u, v) => fbm(u * 200, v * 200, 3) * 0.6 + fbm(u * 40, v * 40, 2) * 0.4,
  },
  rope: {
    tint: [176, 146, 96], rough: 0.85, var: 0.14, str: 2.0, metal: 0,
    h: (u, v) => {
      const strand = Math.sin((u * 3 + v * 26) * PI) * 0.5 + 0.5;
      return clamp(strand * 0.8 + fbm(u * 90, v * 90, 2) * 0.2, 0, 1);
    },
  },

  /* --- hard / luxury ---------------------------------------------------- */
  sequin: {
    tint: [190, 40, 150], rough: 0.16, var: 0.45, str: 2.6, metal: 0.85, cc: 1,
    // a grid of tilted discs: bright dome centre, hard shadow between discs
    h: (u, v) => {
      const cols = 26, row = Math.floor(v * cols), off = row % 2 ? 0.5 : 0;
      const cu = (u * cols + off) % 1, cv = v * cols - row;
      const d = Math.hypot(cu - 0.5, (cv - 0.5) * 0.92) * 2;
      return clamp(dome(clamp(d, 0, 1)) * 1.1, 0, 1);
    },
    albedo: (u, v, h, t) => {
      const s = 0.45 + h * 0.9;
      return [t[0] * s + h * 70, t[1] * s + h * 55, t[2] * s + h * 75];
    },
  },
  straw: {
    tint: [214, 176, 96], rough: 0.78, var: 0.18, str: 2.2, metal: 0,
    h: (u, v) => weave(u, v, 34) * 0.8 + fbm(u * 120, v * 120, 2) * 0.2,
  },
  wood: {
    tint: [122, 82, 48], rough: 0.66, var: 0.16, str: 1.0, metal: 0,
    h: (u, v) => {
      const grain = Math.sin(v * TAU * 7 + fbm(u * 8, v * 40, 3) * 9) * 0.5 + 0.5;
      const pores = fbm(u * 320, v * 40, 2);
      return clamp(grain * 0.65 + pores * 0.35, 0, 1);
    },
    albedo: (u, v, h, t) => {
      const g = 0.7 + h * 0.55;
      return [t[0] * g, t[1] * g * 0.96, t[2] * g * 0.88];
    },
  },
  hammered: {
    tint: [196, 202, 212], rough: 0.34, var: 0.30, str: 2.0, metal: 1.0,
    h: (u, v) => {
      const p = voronoi(u * 26, v * 26, 0.85);
      return clamp(dome(clamp(p.d / 0.7, 0, 1)) * 0.9, 0, 1);
    },
  },
  scale: {
    tint: [40, 132, 96], rough: 0.28, var: 0.30, str: 2.4, metal: 0.35, cc: 1,
    // offset rows of overlapping scales, each with a raised ridge
    h: (u, v) => {
      const cols = 30, row = Math.floor(v * cols), off = row % 2 ? 0.5 : 0;
      const cu = (u * cols + off) % 1, cv = v * cols - row;
      const d = Math.hypot((cu - 0.5) * 1.05, cv - 0.08) * 1.9;
      return clamp(dome(clamp(d, 0, 1)) * 1.05 + (cv < 0.2 ? 0.25 : 0), 0, 1);
    },
  },
  stone: {
    tint: [126, 124, 118], rough: 0.92, var: 0.14, str: 1.9, metal: 0,
    h: (u, v) => {
      const p = voronoi(u * 22, v * 22, 1.0);
      const crack = clamp(p.edge * 9, 0, 1);
      return clamp(fbm(u * 160, v * 160, 4) * 0.8 + (1 - crack) * -0.5 + 0.25, 0, 1);
    },
  },
  bone: {
    tint: [228, 222, 202], rough: 0.7, var: 0.14, str: 1.2, metal: 0,
    h: (u, v) => clamp(fbm(u * 120, v * 120, 4) * 0.7 + fbm(u * 30, v * 30, 3) * 0.3, 0, 1),
  },
  ceramic: {
    tint: [252, 226, 70], rough: 0.12, var: 0.05, str: 0.4, metal: 0, cc: 1,
    h: (u, v) => fbm(u * 400, v * 400, 2) * 0.5 + 0.5,
  },
  porcelain: {
    tint: [244, 246, 250], rough: 0.1, var: 0.04, str: 0.3, metal: 0, cc: 1,
    h: (u, v) => fbm(u * 300, v * 300, 2) * 0.5 + 0.5,
  },
  candy: {
    tint: [255, 106, 176], rough: 0.08, var: 0.06, str: 0.6, metal: 0, cc: 1,
    h: (u, v) => fbm(u * 160, v * 160, 3) * 0.6 + 0.4,
  },
  ice: {
    tint: [186, 228, 246], rough: 0.07, var: 0.22, str: 1.4, metal: 0, cc: 1,
    h: (u, v) => {
      const p = voronoi(u * 14, v * 14, 0.7);
      return clamp(p.edge * 6, 0, 1) * 0.8 + fbm(u * 60, v * 60, 3) * 0.2;
    },
  },
  glitter: {
    tint: [232, 200, 90], rough: 0.2, var: 0.5, str: 1.2, metal: 1.0, cc: 1,
    h: (u, v) => (hash2(Math.floor(u * 620), Math.floor(v * 620)) > 0.86 ? 1 : 0.15),
    albedo: (u, v, h, t) => {
      const f = hash2(Math.floor(u * 620), Math.floor(v * 620));
      const spark = f > 0.86 ? 120 * (f - 0.86) * 7 : 0;
      const g = 0.75 + h * 0.5;
      return [t[0] * g + spark, t[1] * g + spark * 0.95, t[2] * g + spark * 0.8];
    },
  },
  pearl: {
    tint: [242, 236, 244], rough: 0.14, var: 0.10, str: 0.5, metal: 0.6, cc: 1, iri: 0.9,
    h: (u, v) => fbm(u * 24 + Math.sin(v * 9), v * 24, 4) * 0.7 + fbm(u * 90, v * 90, 2) * 0.3,
  },
  moss: {
    tint: [66, 108, 44], rough: 0.95, var: 0.12, str: 2.2, metal: 0,
    h: (u, v) => {
      const p = voronoi(u * 40, v * 40, 1);
      return clamp(dome(clamp(p.d / 0.5, 0, 1)) * 0.7 + fbm(u * 240, v * 240, 3) * 0.4, 0, 1);
    },
  },
  feather: {
    tint: [244, 244, 250], rough: 0.6, var: 0.18, str: 1.6, metal: 0, sheen: 0.8,
    h: (u, v) => {
      const barb = Math.abs(Math.sin((u * 0.5 + v * 46) * PI));
      return clamp(barb * 0.75 + fbm(u * 120, v * 260, 2) * 0.25, 0, 1);
    },
  },
  slime: {
    tint: [96, 244, 128], rough: 0.1, var: 0.14, str: 1.1, metal: 0, cc: 1,
    h: (u, v) => fbm(u * 40, v * 40, 4) * 0.7 + fbm(u * 150, v * 150, 2) * 0.3,
    emis: (u, v) => {
      const g = fbm(u * 30, v * 30, 3);
      return [g * 40, g * 120, g * 60];
    },
  },
  lava: {
    tint: [40, 22, 18], rough: 0.85, var: 0.20, str: 1.6, metal: 0,
    h: (u, v) => clamp(fbm(u * 60, v * 60, 5) * 0.7 + fbm(u * 200, v * 200, 2) * 0.3, 0, 1),
    emis: (u, v) => {
      const p = voronoi(u * 18, v * 18, 1);
      const crack = clamp(p.edge * 7, 0, 1);
      const g = Math.pow(crack, 0.6);
      return [g * 255, g * 96, g * 12];
    },
  },
  bread: {
    tint: [226, 168, 92], rough: 0.86, var: 0.16, str: 1.5, metal: 0,
    h: (u, v) => {
      const p = voronoi(u * 30, v * 30, 1);
      return clamp(dome(clamp(p.d / 0.55, 0, 1)) * 0.6 + fbm(u * 260, v * 260, 3) * 0.5, 0, 1);
    },
  },
  sesame: {
    tint: [214, 156, 76], rough: 0.8, var: 0.2, str: 2.0, metal: 0,
    h: (u, v) => {
      const p = voronoi(u * 46, v * 46, 1);
      return clamp(dome(clamp(p.d / 0.42, 0, 1)) * 0.9 + fbm(u * 200, v * 200, 2) * 0.3, 0, 1);
    },
    albedo: (u, v, h, t) => {
      const p = voronoi(u * 46, v * 46, 1);
      const seed = p.d < 0.4;
      const c = seed ? [248, 236, 206] : t;
      const g = 0.85 + h * 0.3;
      return [c[0] * g, c[1] * g, c[2] * g];
    },
  },
  cheese: {
    tint: [248, 196, 52], rough: 0.34, var: 0.2, str: 1.8, metal: 0, cc: 0.4,
    h: (u, v) => {
      const p = voronoi(u * 20, v * 20, 1);
      const hole = p.d < 0.34 ? -0.7 : 0;
      return clamp(0.7 + hole + fbm(u * 180, v * 180, 2) * 0.3, 0, 1);
    },
  },
  watermelon: {
    tint: [220, 48, 62], rough: 0.2, var: 0.1, str: 0.8, metal: 0, cc: 0.6,
    h: (u, v) => clamp(Math.sin(v * TAU * 9) * 0.4 + 0.6, 0, 1),
    albedo: (u, v, h, t) => {
      const stripe = Math.sin(v * TAU * 9) > 0.2 ? 1 : 0.42;
      return [t[0] * stripe, t[1] * stripe * 1.05, t[2] * stripe];
    },
  },
  pineapple: {
    tint: [216, 168, 52], rough: 0.72, var: 0.24, str: 2.4, metal: 0,
    h: (u, v) => {
      const cols = 22, row = Math.floor(v * cols), off = row % 2 ? 0.5 : 0;
      const cu = (u * cols + off) % 1, cv = v * cols - row;
      const d = Math.hypot(cu - 0.5, cv - 0.5) * 2.1;
      return clamp(dome(clamp(d, 0, 1)) * 1.0, 0, 1);
    },
  },
  chainmail: {
    tint: [150, 156, 168], rough: 0.3, var: 0.34, str: 2.4, metal: 1.0,
    h: (u, v) => {
      const cols = 22, row = Math.floor(v * cols), off = row % 2 ? 0.5 : 0;
      const cu = (u * cols + off) % 1, cv = v * cols - row;
      const d = Math.abs(Math.hypot(cu - 0.5, cv - 0.5) * 2 - 0.62);
      return clamp(1 - d * 5, 0, 1);
    },
  },
  carboncloth: {
    tint: [26, 28, 32], rough: 0.3, var: 0.18, str: 2.2, metal: 0.3, cc: 0.9,
    h: (u, v) => weave(u, v, 34),
  },
  ember: {
    tint: [56, 18, 14], rough: 0.7, var: 0.2, str: 1.4, metal: 0,
    h: (u, v) => clamp(fbm(u * 70, v * 70, 4), 0, 1),
    emis: (u, v) => {
      const g = Math.pow(clamp(fbm(u * 26, v * 26, 4) * 1.5 - 0.35, 0, 1), 1.2);
      return [g * 255, g * 110, g * 20];
    },
  },
  plastic: {
    tint: [240, 200, 60], rough: 0.22, var: 0.06, str: 0.5, metal: 0, cc: 0.9,
    h: (u, v) => fbm(u * 220, v * 220, 2) * 0.6 + 0.4,
  },
  rubbermat: {
    tint: [30, 32, 36], rough: 0.9, var: 0.14, str: 1.8, metal: 0,
    h: (u, v) => {
      const cols = 20, row = Math.floor(v * cols), off = row % 2 ? 0.5 : 0;
      const cu = (u * cols + off) % 1, cv = v * cols - row;
      return clamp(dome(clamp(Math.hypot(cu - 0.5, cv - 0.5) * 2.2, 0, 1)) * 0.9, 0, 1);
    },
  },
  ruby: {
    tint: [206, 22, 52], rough: 0.06, var: 0.10, str: 0.9, metal: 0.2, cc: 1, iri: 0.5,
    h: (u, v) => {
      const p = voronoi(u * 8, v * 8, 0.6);
      return clamp(1 - p.d * 3.2, 0, 1) * 0.7 + fbm(u * 60, v * 60, 3) * 0.3;
    },
  },
  gem: {
    tint: [80, 220, 240], rough: 0.05, var: 0.16, str: 1.2, metal: 0.3, cc: 1, iri: 1.0,
    h: (u, v) => {
      const p = voronoi(u * 10, v * 10, 0.5);
      return clamp(1 - p.edge * 12, 0, 1) * 0.8 + fbm(u * 80, v * 80, 3) * 0.2;
    },
  },
  jade: {
    tint: [70, 176, 130], rough: 0.12, var: 0.10, str: 0.7, metal: 0.1, cc: 1,
    h: (u, v) => fbm(u * 40, v * 40, 4) * 0.7 + fbm(u * 140, v * 140, 2) * 0.3,
  },
  honey: {
    tint: [232, 168, 40], rough: 0.08, var: 0.12, str: 1.0, metal: 0, cc: 1,
    h: (u, v) => {
      const drip = Math.sin(v * TAU * 5 + fbm(u * 8, v * 8, 3) * 6) * 0.5 + 0.5;
      return clamp(drip * 0.7 + fbm(u * 90, v * 90, 2) * 0.3, 0, 1);
    },
  },
  shell: {
    tint: [244, 214, 206], rough: 0.18, var: 0.14, str: 1.3, metal: 0.15, cc: 1, iri: 0.6,
    h: (u, v) => {
      const rib = Math.sin(v * TAU * 22) * 0.5 + 0.5;
      return clamp(rib * 0.6 + fbm(u * 40, v * 40, 3) * 0.4, 0, 1);
    },
  },
  toast: {
    tint: [214, 158, 84], rough: 0.82, var: 0.18, str: 1.7, metal: 0,
    h: (u, v) => {
      const p = voronoi(u * 26, v * 26, 1);
      return clamp(dome(clamp(p.d / 0.5, 0, 1)) * 0.6 + fbm(u * 240, v * 240, 3) * 0.5, 0, 1);
    },
  },
  icing: {
    tint: [246, 138, 190], rough: 0.1, var: 0.10, str: 1.0, metal: 0, cc: 1,
    h: (u, v) => {
      const drip = Math.sin(v * TAU * 4.5 + fbm(u * 7, v * 7, 3) * 5) * 0.5 + 0.5;
      return clamp(drip * 0.75 + fbm(u * 120, v * 120, 2) * 0.25, 0, 1);
    },
  },
  waffle: {
    tint: [216, 168, 96], rough: 0.7, var: 0.2, str: 2.2, metal: 0,
    h: (u, v) => {
      const gx = (u * 18) % 1, gy = (v * 18) % 1;
      return clamp(1 - Math.min(Math.abs(gx - 0.5), Math.abs(gy - 0.5)) * 3.2, 0, 1);
    },
  },

  /* --- added after the first verification pass --------------------------- *
   * 'silk' and 'rust' were referenced by the topper specs but never defined,
   * so those slots fell through to the magenta "unknown slot" material and
   * the top hat's band and the barrel's hoops rendered bright magenta.
   * ---------------------------------------------------------------------- */
  silk: {
    tint: [176, 42, 74], rough: 0.24, var: 0.06, str: 0.5, metal: 0, cc: 0.9, sheen: 0.9,
    // a fine twill under a soft, broad sheen roll — silk is smooth cloth
    h: (u, v) => {
      const twill = Math.abs(Math.sin((u * 220 + v * 220) * PI)) * 0.35;
      const roll = fbm(u * 5, v * 5, 3) * 0.45;
      return clamp(twill + roll + 0.2, 0, 1);
    },
  },
  rust: {
    tint: [138, 90, 42], rough: 0.93, var: 0.24, str: 2.6, metal: 0.35,
    // flaking oxide: voronoi cells give the plates, fbm the pitting
    h: (u, v) => {
      const p = voronoi(u * 34, v * 34, 1.2);
      const plate = clamp(1 - p.d * 1.6, 0, 1);
      const pit = fbm(u * 190, v * 190, 4);
      return clamp(plate * 0.55 + pit * 0.6, 0, 1);
    },
  },
};

export const SURFACE_IDS = Object.keys(SURFACES);

/* ---- baking -------------------------------------------------------------- */

/** Bake one surface into { albedo, rough, normal, emis, meta }.
 *  `tint` overrides the palette colour, so the same weave can be a red beanie
 *  or a green one without a second bake. */
export function bakeSurface(kind, size = 512, tint = null) {
  const S = SURFACES[kind] || SURFACES.felt;
  const t = tint || S.tint;
  const hf = (u, v) => clamp(S.h(u, v), 0, 1);
  const varAmt = S.var === undefined ? 0.1 : S.var;
  const str = S.str === undefined ? 1.0 : S.str;

  const albedo = fill(buffer(size, size), (u, v) => {
    const h = hf(u, v);
    if (S.albedo) return S.albedo(u, v, h, t);
    const g = 0.82 + h * 0.36;
    // a slow large-scale tint drift keeps it from looking like flat noise
    const drift = 1 + (fbm(u * 6 + 11, v * 6, 3) - 0.5) * 0.16;
    return [t[0] * g * drift, t[1] * g * drift, t[2] * g * drift];
  });

  const rs = size >> 1;
  const rough = fill(buffer(rs, rs), (u, v) => {
    const g = clamp((S.rough + (hf(u, v) - 0.5) * 2 * varAmt), 0.02, 1) * 255;
    return [g, g, g];
  });

  const normal = normalFromHeight(rs, rs, hf, str);

  let emis = null;
  if (S.emis) {
    emis = fill(buffer(rs, rs), (u, v) => S.emis(u, v));
  }

  return { albedo, rough, normal, emis, kind, tint: t, meta: S };
}

/** Bake several surfaces at once (the accessory pass needs ~14 of them). */
export function bakeSurfaceSet(kinds, size = 512) {
  const out = {};
  for (const k of kinds) out[k] = bakeSurface(k, size);
  return out;
}

/* ---- polished metals (no map needed, but keep one entry point) ----------- */

export const METALS = {
  gold:      { color: '#e6b833', metal: 1.0, rough: 0.14, cc: 1.0 },
  chrome:    { color: '#eef2f8', metal: 1.0, rough: 0.045, cc: 0.5 },
  silver:    { color: '#c9ced8', metal: 1.0, rough: 0.18, cc: 0.4 },
  gunmetal:  { color: '#5b626e', metal: 1.0, rough: 0.32, cc: 0.3 },
  bronze:    { color: '#9d6b3f', metal: 1.0, rough: 0.26, cc: 0.4 },
  copper:    { color: '#c46a3a', metal: 1.0, rough: 0.22, cc: 0.4 },
  titanium:  { color: '#8f98a4', metal: 1.0, rough: 0.34, cc: 0.3 },
  brass:     { color: '#c9a227', metal: 1.0, rough: 0.2, cc: 0.4 },
  rosegold:  { color: '#e8b4a0', metal: 1.0, rough: 0.12, cc: 0.6 },
  obsidian:  { color: '#16181d', metal: 0.75, rough: 0.3, cc: 0.9 },
  platinum:  { color: '#e2e6ee', metal: 1.0, rough: 0.1, cc: 0.5 },
};

/* ---- flat colour helpers used by the topper builders --------------------- */

export const FLAT = {
  black:   [18, 18, 22],
  white:   [242, 244, 248],
  red:     [206, 32, 46],
  crimson: [150, 18, 30],
  orange:  [240, 118, 26],
  amber:   [248, 176, 40],
  yellow:  [248, 216, 56],
  lime:    [154, 220, 44],
  green:   [44, 156, 74],
  teal:    [26, 156, 148],
  cyan:    [40, 200, 232],
  blue:    [38, 88, 214],
  indigo:  [72, 56, 200],
  violet:  [132, 62, 214],
  magenta: [214, 44, 168],
  pink:    [246, 122, 176],
  brown:   [110, 72, 44],
  tan:     [204, 164, 116],
  cream:   [246, 236, 208],
  grey:    [130, 134, 142],
  darkgrey:[62, 66, 74],
  navy:    [26, 42, 86],
  olive:   [104, 110, 62],
  salmon:  [248, 150, 130],
  mint:    [150, 240, 210],
  lilac:   [196, 170, 240],
  sky:     [140, 200, 250],
  coral:   [250, 122, 96],
  maroon:  [104, 26, 40],
  forest:  [30, 92, 52],
};

export { hash2, vnoise, fbm, voronoi, weave, dome, clamp as mClamp, lerp as mLerp, mix3 };
