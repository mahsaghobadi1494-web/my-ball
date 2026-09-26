/* =============================================================================
 * ultra/wheeltex.js — animated wheel surfaces (fire, ice, heartbeat, donut...)
 * -----------------------------------------------------------------------------
 * The base library paints a tyre with one of four rubber patterns and a rim
 * with a flat PBR colour. That is a wheel. It is not fifty wheels.
 *
 * This module bakes a wheel surface the same way materials.js bakes a topper:
 * a height field h(x, y) drives albedo, roughness, normal and an optional
 * emissive channel. On top of that it adds TIME — a recipe may declare a frame
 * strip (N real time samples stacked vertically, played back by stepping
 * texture offset.y, exactly like the animated vinyls) or a continuous UV
 * scroll, a rotation, or a glow envelope such as a heartbeat.
 *
 * ---------------------------------------------------------------------------
 *  THE TWO UV SPACES
 * ---------------------------------------------------------------------------
 * Both are (x = along, y = across), so one pattern serves both targets:
 *
 *   face   x = angle around the hub (0..1)   y = radius (0 = hub, 1 = rim)
 *   tread  x = around the circumference      y = bead to bead
 *
 * `revolveX` already gives the tyre exactly the tread mapping (u runs around,
 * v runs bead-to-bead), and the face disc in wheels.js is emitted with a
 * matching radial UV, so nothing here has to know about geometry at all.
 *
 * Because the face is polar, a vertical stripe pattern becomes radial spokes
 * on the hub and a circumferential band on the tyre — one definition, two
 * correct readings. That is why the pattern library is written in (x, y).
 *
 * ---------------------------------------------------------------------------
 *  WHY FRAME STRIPS AND NOT A SCROLLING NOISE TRICK
 * ---------------------------------------------------------------------------
 * A fire that only slides sideways reads as a sliding texture. A fire that
 * flickers needs the shape to change, not just its position. Recipes that
 * genuinely move (flame, lightning, plasma) bake 8 real frames; the rest use
 * the cheap scroll / spin / pulse modes.
 * ===========================================================================*/

import { TAU, PI, buffer, fill, normalFromHeight, hexToRgb } from '../carLibraryPro.js';
import { hash2, vnoise, fbm, voronoi, weave, dome } from './materials.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const mix3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const mul3 = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const BLACK = [0, 0, 0];

/* ---- UV space conversion -------------------------------------------------- */

/** Map a texture-space sample into the (along, across) space a pattern expects.
 *  The face disc is polar, so `along` is the angle and `across` the radius. */
function toSpace(space, u, v) {
  if (space === 'tread') return [u, v];
  const dx = u - 0.5, dy = v - 0.5;
  let t = Math.atan2(dy, dx) / TAU;
  if (t < 0) t += 1;
  return [t, Math.min(1, Math.hypot(dx, dy) * 2)];
}

/* ========================================================================== *
 *  PATTERN LIBRARY
 * ---------------------------------------------------------------------------
 *  Every pattern is  (x, y, r, ph) -> { c, h, e }
 *    r   the recipe   (pal = palette, s = scale, plus per-pattern extras)
 *    ph  animation phase 0..1 for the frame currently being baked
 *    c   albedo 0..255      h   height 0..1      e   emissive 0..255
 *  Returning `e` costs nothing when the recipe has no emissive strength: the
 *  baker skips the whole emissive channel.
 * ========================================================================== */

const PATTERNS = {

  /* --- heat ------------------------------------------------------------- */

  /** Turbulent licks rising outward. The noise field is advected with the
   *  frame phase, so the tongues genuinely travel rather than slide. */
  flame: (x, y, r, ph) => {
    const s = r.s;
    const w = fbm(x * s * 1.6 + ph * 0.9, y * s * 0.9 - ph * 3.1, 4);
    const w2 = fbm(x * s * 5.0 + 21, y * s * 2.4 - ph * 5.0, 3);
    const front = w * 0.82 + w2 * 0.22 + 0.14;
    const k = clamp((front - (1 - y)) * 2.4, 0, 1);
    const hot = clamp(k * 1.3 - 0.3, 0, 1);
    const c = mix3(r.pal[2], mix3(r.pal[1], r.pal[0], Math.pow(hot, 0.65)), Math.pow(k, 0.5));
    const e = mul3(mix3(r.pal[1], r.pal[0], hot), Math.pow(hot, 1.5) * 1.35);
    return { c, h: 0.2 + k * 0.75, e };
  },

  /** Quenched lava crust: a dark shell with glowing seams between the plates. */
  crack: (x, y, r, ph) => {
    const p = voronoi(x * r.s, y * r.s * 0.8, 1.1);
    const seam = clamp(1 - p.edge * 7.5, 0, 1);
    const crust = clamp(1 - p.d * 1.35, 0, 1);
    const glow = Math.pow(seam, 1.6) * (0.7 + 0.3 * Math.sin(ph * TAU + p.id * 6.28));
    const c = mix3(r.pal[1], r.pal[0], crust * 0.5);
    const e = mul3(r.pal[2], glow * 1.5);
    return { c: mix3(c, r.pal[2], glow * 0.6), h: 0.15 + crust * 0.4 + seam * 0.1, e };
  },

  /** A molten core bleeding through a cracked shell — hotter sibling of crack. */
  magma: (x, y, r, ph) => {
    const p = voronoi(x * r.s * 1.4, y * r.s * 1.1, 1.3);
    const seam = clamp(1 - p.edge * 9, 0, 1);
    const flow = fbm(x * r.s * 0.7 + ph * 1.4, y * r.s * 0.7, 3);
    const heat = clamp(seam * 1.3 + flow * 0.35 - 0.12, 0, 1);
    const c = mix3(r.pal[1], r.pal[0], Math.pow(heat, 0.6));
    const e = mul3(r.pal[0], Math.pow(heat, 1.3) * 1.6);
    return { c, h: 0.3 + (1 - seam) * 0.4, e };
  },

  /* --- cold ------------------------------------------------------------- */

  /** Interlocking ice shards. Cell id drives the facet brightness so the
   *  surface reads as faceted rather than as noise. */
  crystal: (x, y, r, ph) => {
    const p = voronoi(x * r.s, y * r.s * 0.85, 0.55);
    const facet = 0.35 + p.id * 0.65;
    const edge = clamp(1 - p.edge * 6, 0, 1);
    const frost = fbm(x * r.s * 3.2, y * r.s * 3.2, 3);
    const k = clamp(facet * 0.7 + frost * 0.3, 0, 1);
    const c = mix3(r.pal[1], r.pal[0], k);
    const e = mul3(r.pal[2], edge * 0.5 + 0.25 * (0.6 + 0.4 * Math.sin(ph * TAU)));
    return { c, h: clamp(k * 0.7 + edge * 0.3, 0, 1), e };
  },

  /** Long needle frost growing outward from the hub. */
  frost: (x, y, r, ph) => {
    const n = r.s * 5;
    const a = Math.floor(x * n);
    const jitter = hash2(a, 7) * 0.5;
    const blade = clamp(1 - Math.abs(((x * n) % 1) - 0.5) * 2.4, 0, 1);
    const len = 0.35 + hash2(a, 13) * 0.6 + jitter * 0.2;
    const k = clamp((len - y) * 2.6, 0, 1) * blade;
    const c = mix3(r.pal[1], r.pal[0], k);
    const e = mul3(r.pal[2], k * 0.55);
    return { c, h: 0.15 + k * 0.8, e };
  },

  /* --- organic ---------------------------------------------------------- */

  /** Branching capillaries — the base of the heartbeat wheel. */
  vein: (x, y, r, ph) => {
    const wob = fbm(x * r.s * 0.9, y * r.s * 0.9, 4) * 0.9;
    const trunk = Math.abs(Math.sin((x * r.s * 3.1 + wob * 3.4) * PI));
    const twig = Math.abs(Math.sin((x * r.s * 8.4 - wob * 5.1) * PI));
    const veinK = Math.pow(clamp(1 - trunk * 1.6, 0, 1), 0.7) * clamp(y * 1.6, 0, 1);
    const twigK = Math.pow(clamp(1 - twig * 2.0, 0, 1), 0.9) * clamp((y - 0.25) * 1.8, 0, 1);
    const k = clamp(veinK + twigK * 0.55, 0, 1);
    // the whole surface breathes, but the pulse envelope lives in the animator
    const throb = 0.55 + 0.45 * Math.sin(ph * TAU * 2);
    const c = mix3(r.pal[1], r.pal[0], k);
    const e = mul3(r.pal[0], k * 0.9 * throb);
    return { c, h: 0.2 + k * 0.7, e };
  },

  /** Blood vessel network seen through a membrane, no throb in the bake. */
  flesh: (x, y, r, ph) => {
    const wob = fbm(x * r.s * 1.3 + 5, y * r.s * 1.3, 4);
    const grid = Math.abs(Math.sin((x * r.s * 4.2 + wob * 4) * PI));
    const k = Math.pow(clamp(1 - grid * 1.7, 0, 1), 0.8);
    const c = mix3(r.pal[1], r.pal[0], k);
    const e = mul3(r.pal[2], k * 0.45);
    return { c, h: 0.3 + k * 0.5, e };
  },

  /** Reptile scales in offset rows, each with a bright crown. */
  scale: (x, y, r, ph) => {
    const cols = Math.round(r.s * 3);
    const row = Math.floor(y * cols * 1.6);
    const off = row % 2 ? 0.5 : 0;
    const cu = (x * cols + off) % 1, cv = (y * cols * 1.6) - row;
    const d = Math.hypot((cu - 0.5) * 1.9, (cv - 0.42) * 1.5);
    const k = clamp(1 - d, 0, 1);
    const crown = dome(clamp(d * 1.5, 0, 1));
    const c = mix3(r.pal[1], r.pal[0], crown * 0.85 + 0.15);
    const e = r.pal[2] ? mul3(r.pal[2], k * 0.3) : BLACK;
    return { c, h: clamp(crown * 0.85 + k * 0.15, 0, 1), e };
  },

  /** Fur strands sweeping along the wheel — the fox tail's coat. */
  fur: (x, y, r, ph) => {
    const n = Math.round(r.s * 7);
    const a = Math.floor(x * n);
    const wob = fbm(x * r.s * 0.6, y * r.s * 1.2 + ph * 1.5, 3) * 1.6;
    const strand = clamp(1 - Math.abs(((x * n + wob) % 1) - 0.5) * 2.3, 0, 1);
    const len = 0.45 + hash2(a, 31) * 0.55;
    const k = clamp((len - y) * 2.2, 0, 1) * strand;
    // the classic fox gradient: dark base, warm body, white tip
    const tip = clamp((y - 0.62) * 2.8, 0, 1);
    const c = mix3(mix3(r.pal[1], r.pal[0], clamp(k * 1.4, 0, 1)), r.pal[2] || [250, 246, 238], tip);
    return { c, h: 0.15 + k * 0.85, e: BLACK };
  },

  /* --- energy ----------------------------------------------------------- */

  /** Smooth flowing bands of light. High emissive, low relief. */
  plasma: (x, y, r, ph) => {
    const a = fbm(x * r.s + ph * 2.6, y * r.s * 0.7 - ph * 1.1, 4);
    const b = fbm(x * r.s * 2.4 - ph * 3.4, y * r.s * 1.6, 3);
    const k = clamp(a * 0.75 + b * 0.35, 0, 1);
    const band = Math.pow(Math.abs(Math.sin(k * PI * 2.2)), 0.6);
    const c = mix3(r.pal[1], r.pal[0], band);
    const e = mul3(mix3(r.pal[1], r.pal[0], Math.pow(band, 1.4)), 1.5);
    return { c, h: 0.35 + band * 0.4, e };
  },

  /** Forked lightning radiating from the hub. */
  bolt: (x, y, r, ph) => {
    const wob = fbm(x * r.s * 2.2 + ph * 1.2, y * r.s * 0.7, 3);
    const spine = Math.abs(Math.sin((x * r.s * 2.4 + wob * 6.0) * PI));
    const k = Math.pow(clamp(1 - spine * 2.2, 0, 1), 0.7) * clamp(1 - y * 0.25, 0, 1);
    const fork = Math.pow(clamp(1 - Math.abs(Math.sin((x * r.s * 6.1 - wob * 4) * PI)) * 3.0, 0, 1), 1.1)
      * clamp((y - 0.35) * 2.0, 0, 1) * 0.6;
    const g = clamp(k + fork, 0, 1);
    const c = mix3(r.pal[1], r.pal[0], g);
    const e = mul3(r.pal[0], Math.pow(g, 1.2) * 1.8);
    return { c, h: 0.3 + g * 0.5, e };
  },

  /** Neon lattice: emissive traces on a dark plate. */
  grid: (x, y, r, ph) => {
    const n = Math.round(r.s * 2);
    const gx = Math.abs(((x * n + ph) % 1) - 0.5);
    const gy = Math.abs(((y * n) % 1) - 0.5);
    const line = clamp(1 - Math.min(gx, gy) * 14, 0, 1);
    const node = clamp(1 - Math.hypot(gx, gy) * 22, 0, 1);
    const glow = clamp(line + node, 0, 1);
    const c = mix3(r.pal[1], r.pal[0], glow);
    const e = mul3(r.pal[0], glow * 1.5);
    return { c, h: 0.2 + glow * 0.5, e };
  },

  /** Printed circuit: rectilinear traces with pads and vias. */
  circuit: (x, y, r, ph) => {
    const n = Math.round(r.s * 1.6);
    const cx = x * n, cy = y * n;
    const fx = cx - Math.floor(cx), fy = cy - Math.floor(cy);
    const row = Math.floor(cy), col = Math.floor(cx);
    const dir = hash2(col, row) > 0.5;
    // a trace runs either across or along its cell, and only half the cells have one
    const on = hash2(col * 3 + 1, row * 7 + 2) > 0.42;
    const trace = on ? clamp(1 - (dir ? Math.abs(fx - 0.5) : Math.abs(fy - 0.5)) * 11, 0, 1) : 0;
    const pad = clamp(1 - Math.hypot(fx - 0.5, fy - 0.5) * 9, 0, 1);
    const flow = 0.55 + 0.45 * Math.sin(ph * TAU + (cx + cy) * 0.9);
    const g = clamp(Math.max(trace, pad * 0.9), 0, 1);
    const c = mix3(r.pal[1], r.pal[0], g);
    const e = mul3(r.pal[0], g * flow * 1.3);
    return { c, h: 0.2 + g * 0.55, e };
  },

  /** Iridescent oil film — a thin-film rainbow over a black pool. */
  slick: (x, y, r, ph) => {
    const t = (fbm(x * r.s * 0.8, y * r.s * 0.8, 4) * 1.4 + y * 0.6 + ph * 0.35) % 1;
    const c = [
      Math.sin(t * TAU) * 0.5 + 0.5,
      Math.sin(t * TAU + 2.09) * 0.5 + 0.5,
      Math.sin(t * TAU + 4.19) * 0.5 + 0.5,
    ].map((v) => Math.pow(v, 0.75));
    const k = fbm(x * r.s * 2.6, y * r.s * 2.6, 3);
    return {
      c: mix3(r.pal[1], [c[0] * 255, c[1] * 255, c[2] * 255], 0.55 + k * 0.45),
      h: 0.4 + k * 0.25, e: BLACK,
    };
  },

  /** Holographic foil: wide rainbow sweeps with a hard sheen break. */
  holo: (x, y, r, ph) => {
    const t = (x * 3 + y * 0.8 + fbm(x * r.s, y * r.s, 3) * 0.8 + ph * 0.5) % 1;
    const c = [0, 2.09, 4.19].map((o) => (Math.sin(t * TAU + o) * 0.5 + 0.5) * 255);
    const sheen = Math.pow(clamp(Math.sin((x * r.s * 1.4 + y) * PI * 2), 0, 1), 0.5);
    return { c: mul3(c, 0.6 + sheen * 0.6), h: 0.45 + sheen * 0.2, e: mul3(c, sheen * 0.5) };
  },

  /* --- patterns --------------------------------------------------------- */

  /** Bold bands across the wheel. On the face these read as pie wedges. */
  stripe: (x, y, r, ph) => {
    const n = Math.round(r.s * 1.5);
    const k = ((x * n + ph) % 1);
    const band = k < 0.5 ? 0 : 1;
    const thin = Math.abs(k - 0.5) < 0.045 ? 1 : 0;
    const c = mix3(r.pal[band ? 0 : 1], r.pal[2] || r.pal[0], thin * 0.7);
    return { c, h: band ? 0.75 : 0.25, e: BLACK };
  },

  /** Checkerboard — four-colour when the palette has a third and fourth tone. */
  checker: (x, y, r, ph) => {
    const n = Math.round(r.s);
    const on = (Math.floor(x * n) + Math.floor(y * n)) % 2;
    const c = on ? r.pal[0] : r.pal[1];
    const acc = (Math.floor(x * n * 2) + Math.floor(y * n * 2)) % 2;
    const c2 = acc && r.pal[2] ? r.pal[2] : c;
    return { c: c2, h: on ? 0.7 : 0.3, e: BLACK };
  },

  /** Cheetah / leopard rosettes: a light field, dark rings, warm cores. */
  spot: (x, y, r, ph) => {
    const p = voronoi(x * r.s, y * r.s * 0.9, 1.0);
    const ring = clamp(1 - Math.abs(p.d - 0.42) * 9, 0, 1);
    const core = clamp(1 - p.d * 4.2, 0, 1);
    const c = mix3(mix3(r.pal[1], r.pal[0], core * 0.8), r.pal[2] || [20, 16, 12], ring * 0.9);
    return { c, h: 0.3 + core * 0.4 + ring * 0.2, e: BLACK };
  },

  /** Camouflage: three tones thresholded out of a warped noise field. */
  camo: (x, y, r, ph) => {
    const a = fbm(x * r.s * 0.9, y * r.s * 0.9, 3);
    const b = fbm(x * r.s * 2.1 + 40, y * r.s * 2.1 + 9, 3);
    const k = a * 0.7 + b * 0.4;
    const idx = k < 0.36 ? 1 : k < 0.55 ? 0 : (k < 0.72 ? 1 : 2);
    const c = r.pal[Math.min(idx, r.pal.length - 1)];
    return { c, h: 0.3 + (idx === 0 ? 0.45 : idx === 1 ? 0.2 : 0.6), e: BLACK };
  },

  /** Concentric ripples on water, warped so the rings are never perfect. */
  ripple: (x, y, r, ph) => {
    const w = fbm(x * r.s * 1.6 + ph * 2, y * r.s * 1.6, 3);
    const ring = Math.sin((y * r.s * 2.4 + w * 2.6) * TAU) * 0.5 + 0.5;
    const spec = Math.pow(ring, 3);
    const c = mix3(r.pal[1], r.pal[0], spec);
    const e = mul3(r.pal[2] || r.pal[0], spec * 0.4);
    return { c, h: 0.3 + ring * 0.5, e };
  },

  /** Soft smoke curls. */
  smoke: (x, y, r, ph) => {
    const a = fbm(x * r.s * 0.7 + ph * 1.6, y * r.s * 1.1, 5);
    const b = fbm(x * r.s * 2.2 - ph * 2.2, y * r.s * 2.2, 3);
    const k = clamp(a * 0.8 + b * 0.35, 0, 1);
    const c = mix3(r.pal[1], r.pal[0], smooth(k));
    const e = r.pal[2] ? mul3(r.pal[2], Math.pow(k, 2) * 0.7) : BLACK;
    return { c, h: 0.35 + k * 0.45, e };
  },

  /** Toxic bubbles rising through sludge. */
  acid: (x, y, r, ph) => {
    const p = voronoi(x * r.s * 1.6 + ph * 1.5, y * r.s * 1.6 - ph * 2.2, 0.95);
    const bubble = clamp(1 - p.d * 3.4, 0, 1);
    const rim = clamp(1 - Math.abs(p.d - 0.36) * 10, 0, 1);
    const k = clamp(bubble * 0.8 + rim * 0.6, 0, 1);
    const c = mix3(r.pal[1], r.pal[0], Math.pow(k, 0.7));
    const e = mul3(r.pal[0], Math.pow(k, 1.6) * 1.2);
    return { c, h: 0.25 + k * 0.6, e };
  },

  /** Gum bubbles — fat glossy spheres on a flat base. */
  bubble: (x, y, r, ph) => {
    const p = voronoi(x * r.s * 1.2, y * r.s * 1.2, 0.8);
    const k = clamp(1 - p.d * 2.4, 0, 1);
    const gloss = Math.pow(k, 0.4);
    const hue = p.id;
    const c = mix3(r.pal[1], r.pal[0], gloss);
    const tint = r.pal[2] ? mix3(c, r.pal[2], hue * 0.5) : c;
    return { c: tint, h: 0.2 + gloss * 0.75, e: BLACK };
  },

  /* --- geometric -------------------------------------------------------- */

  /** Hex cells — honeycomb, or a machined alloy core. */
  honey: (x, y, r, ph) => {
    const n = Math.round(r.s * 2);
    const row = Math.floor(y * n * 0.87);
    const off = row % 2 ? 0.5 : 0;
    const cu = (x * n + off) % 1, cv = (y * n * 0.87) - row;
    const d = Math.hypot(cu - 0.5, (cv - 0.5) * 1.15);
    const wall = clamp(1 - Math.abs(d - 0.44) * 7, 0, 1);
    const cell = clamp(1 - d * 2.0, 0, 1);
    const k = clamp(cell * 0.8 + wall * 0.5, 0, 1);
    const c = mix3(r.pal[1], r.pal[0], k);
    const e = r.pal[2] ? mul3(r.pal[2], wall * 0.5) : BLACK;
    return { c, h: 0.2 + k * 0.65, e };
  },

  /** A toothed gear ring: square teeth around the rim of the face. */
  gear: (x, y, r, ph) => {
    const n = Math.round(r.s * 4);
    const tooth = ((x * n) % 1) < 0.55 ? 1 : 0;
    const inner = y < 0.62 ? 1 : 0;
    const k = tooth || inner ? 1 : 0;
    const rim = clamp(1 - Math.abs(y - 0.62) * 14, 0, 1);
    const hub = clamp(1 - Math.abs(y - 0.2) * 8, 0, 1);
    const g = clamp(k * 0.7 + rim + hub * 0.6, 0, 1);
    const c = mix3(r.pal[1], r.pal[0], g);
    return { c, h: 0.25 + g * 0.6, e: BLACK };
  },

  /** Eight-bit blocks. */
  pixel: (x, y, r, ph) => {
    const n = Math.round(r.s * 2.5);
    const cx = Math.floor(x * n), cy = Math.floor(y * n);
    const h = hash2(cx * 7 + 3, cy * 13 + 5);
    const idx = h < 0.4 ? 0 : h < 0.68 ? 1 : (r.pal[2] ? 2 : 1);
    const c = r.pal[idx];
    const blink = hash2(cx, cy * 3 + 1) > 0.88 ? (ph * TAU) % 1 < 0.5 ? 1 : 0 : 0;
    const e = blink && r.pal[0] ? mul3(r.pal[0], 1.2) : BLACK;
    return { c, h: 0.3 + h * 0.5, e };
  },

  /** Wood grain: growth rings warped around knots. */
  wood: (x, y, r, ph) => {
    const warp = fbm(x * r.s * 0.5, y * r.s * 0.5, 3) * 2.2;
    const ring = Math.sin((y * r.s * 3.4 + warp * 3.0) * PI) * 0.5 + 0.5;
    const grain = fbm(x * r.s * 8, y * r.s * 26, 2) * 0.28;
    const k = clamp(ring * 0.75 + grain, 0, 1);
    const c = mix3(r.pal[1], r.pal[0], k);
    return { c, h: 0.35 + ring * 0.35 + grain * 0.2, e: BLACK };
  },

  /** Twill weave — denim, burlap, carbon cloth. */
  cloth: (x, y, r, ph) => {
    const w = weave(x, y, Math.round(r.s * 4));
    const slub = fbm(x * r.s * 6, y * r.s * 0.6, 2) * 0.3;
    const k = clamp(w * 0.8 + slub, 0, 1);
    const c = mix3(r.pal[1], r.pal[0], k);
    return { c, h: clamp(0.15 + k * 0.75, 0, 1), e: BLACK };
  },

  /** Marble: a veined stone with a directional flow. */
  marble: (x, y, r, ph) => {
    const t = fbm(x * r.s * 0.7, y * r.s * 1.4, 5) * 2.4 + y * 1.2;
    const vein = Math.pow(Math.abs(Math.sin(t * PI)), 0.35);
    const k = clamp(vein, 0, 1);
    const c = mix3(r.pal[1], r.pal[0], k);
    const grey = fbm(x * r.s * 5, y * r.s * 5, 2) * 0.18;
    return { c: mul3(c, 0.85 + grey), h: 0.45 + k * 0.35, e: BLACK };
  },

  /** Terrazzo: chips of colour set in a pale binder. */
  terrazzo: (x, y, r, ph) => {
    const p = voronoi(x * r.s * 2.2, y * r.s * 2.2, 0.9);
    const chip = clamp(1 - p.d * 3.6, 0, 1);
    const idx = Math.floor(p.id * (r.pal.length - 1) + 0.001);
    const c = mix3(r.pal[1], r.pal[idx], chip);
    const speck = hash2(Math.floor(x * r.s * 30), Math.floor(y * r.s * 30)) > 0.96 ? 1 : 0;
    return { c: speck ? r.pal[0] : c, h: 0.5 + chip * 0.3 + speck * 0.2, e: BLACK };
  },

  /** Paint splatter / graffiti tags. */
  paint: (x, y, r, ph) => {
    const p = voronoi(x * r.s * 1.1, y * r.s * 1.1, 1.4);
    const blob = clamp(1 - p.d * 2.0, 0, 1);
    const idx = Math.floor(p.id * (r.pal.length - 1) + 0.001);
    const base = r.pal[1];
    const c = mix3(base, r.pal[idx], Math.pow(blob, 0.6));
    const drip = Math.abs(Math.sin((y * r.s * 5 + fbm(x * 4, y * 4, 2) * 3) * PI));
    const run = blob > 0.5 ? Math.pow(clamp(1 - drip * 2.2, 0, 1), 2) : 0;
    return { c: mix3(c, r.pal[0], run * 0.35), h: 0.4 + blob * 0.4, e: BLACK };
  },

  /** Flaking oxide over bare steel. */
  rust: (x, y, r, ph) => {
    const p = voronoi(x * r.s * 1.7, y * r.s * 1.7, 1.2);
    const plate = clamp(1 - p.d * 1.5, 0, 1);
    const pit = fbm(x * r.s * 6, y * r.s * 6, 4);
    const k = clamp(plate * 0.6 + pit * 0.55, 0, 1);
    const c = mix3(mix3(r.pal[1], r.pal[0], k), r.pal[2] || r.pal[1], Math.pow(pit, 3) * 0.6);
    return { c, h: 0.25 + k * 0.6, e: BLACK };
  },

  /* --- novelty ---------------------------------------------------------- */

  /** Icing with scattered sprinkles — the donut wheel's glaze. */
  sprinkle: (x, y, r, ph) => {
    const icing = fbm(x * r.s * 1.4, y * r.s * 1.4, 3);
    const wave = Math.sin((x * r.s * 1.6 + icing * 2.2) * TAU) * 0.5 + 0.5;
    const edge = clamp((y - 0.34) * 3.4, 0, 1);         // icing sits on the outer half
    const g = clamp(wave * 0.35 + icing * 0.65, 0, 1);
    let c = mix3(r.pal[1], r.pal[0], g * edge);
    let h = 0.35 + edge * 0.3 + g * 0.2;
    // sprinkles: short capsules on a jittered grid
    const n = Math.round(r.s * 5);
    const gx = x * n, gy = y * n * 1.6;
    const cx = Math.floor(gx), cy = Math.floor(gy);
    const jx = hash2(cx, cy) * 0.7 + 0.15, jy = hash2(cx + 9, cy + 3) * 0.7 + 0.15;
    const ang = hash2(cx * 3, cy * 7) * PI;
    const dx = (gx % 1) - jx, dy = (gy % 1) - jy;
    const rx = dx * Math.cos(ang) + dy * Math.sin(ang);
    const ry = -dx * Math.sin(ang) + dy * Math.cos(ang);
    const cap = clamp(1 - (Math.abs(rx) * 5.5 + Math.abs(ry) * 16), 0, 1);
    if (cap > 0 && edge > 0.6) {
      const si = Math.floor(hash2(cx + 5, cy + 11) * (r.pal.length - 2)) + 2;
      c = mix3(c, r.pal[Math.min(si, r.pal.length - 1)], cap);
      h = Math.max(h, 0.55 + cap * 0.45);
    }
    return { c, h, e: BLACK };
  },

  /** Chocolate-chip cookie: a cracked dough field with chips sunk into it. */
  cookie: (x, y, r, ph) => {
    const p = voronoi(x * r.s * 2.4, y * r.s * 2.4, 1);
    const crackle = clamp(1 - p.edge * 9, 0, 1);
    const dough = fbm(x * r.s * 5, y * r.s * 5, 3);
    const c = mix3(r.pal[1], r.pal[0], dough * 0.6 + 0.25);
    const chip = clamp(1 - p.d * 3.0, 0, 1) * (p.id > 0.55 ? 1 : 0);
    const cc = mix3(c, r.pal[2] || [46, 30, 22], Math.pow(chip, 0.6));
    return { c: mix3(cc, r.pal[1], crackle * 0.35), h: 0.4 + dough * 0.25 - chip * 0.3, e: BLACK };
  },

  /** Watermelon: rind stripes with seeds on the flesh side. */
  melon: (x, y, r, ph) => {
    const stripe = Math.sin(x * r.s * 2.2 * PI) * 0.5 + 0.5;
    const wob = fbm(x * r.s * 2, y * r.s * 0.8, 3) * 0.5;
    const k = clamp(stripe * 0.8 + wob, 0, 1);
    const rind = clamp((y - 0.55) * 3.2, 0, 1);
    let c = mix3(r.pal[1], r.pal[0], k);
    c = mix3(c, r.pal[2] || [222, 46, 60], rind * 0.85);
    let h = 0.4 + k * 0.3;
    // seeds on the flesh
    const n = Math.round(r.s * 2.4);
    const cx = Math.floor(x * n * 1.7), cy = Math.floor(y * n * 1.7);
    if (hash2(cx, cy) > 0.86 && rind > 0.5) {
      const fx = (x * n * 1.7) % 1 - 0.5, fy = (y * n * 1.7) % 1 - 0.5;
      const seed = clamp(1 - Math.hypot(fx * 1.6, fy * 3.2) * 5, 0, 1);
      c = mix3(c, [26, 20, 16], seed);
      h = Math.max(h, 0.3 + seed * 0.2);
    }
    return { c, h, e: BLACK };
  },

  /** A vinyl record: fine grooves, a label, and a light sheen. */
  record: (x, y, r, ph) => {
    const label = y < 0.42 ? 1 : 0;
    const groove = Math.sin(y * r.s * 14 * PI) * 0.5 + 0.5;
    const sheen = Math.pow(clamp(Math.sin((x + 0.25) * TAU), 0, 1), 3);
    let c = label
      ? mix3(r.pal[2] || [190, 60, 90], r.pal[3] || [240, 180, 80], groove * 0.5)
      : mul3(r.pal[1], 0.85 + groove * 0.35);
    c = add3(c, mul3(r.pal[0], sheen * (label ? 0.15 : 0.22)));
    return { c, h: label ? 0.55 : 0.4 + groove * 0.2, e: BLACK };
  },

  /** A daisy: petals around a hub. */
  flower: (x, y, r, ph) => {
    const n = Math.round(r.s * 3);
    const petalWave = Math.sin(x * n * PI) * 0.5 + 0.5;
    const petal = clamp(1 - Math.abs(y - (0.42 + petalWave * 0.26)) * 4.2, 0, 1);
    const core = clamp(1 - y * 4.6, 0, 1);
    const k = clamp(petal + core, 0, 1);
    const c = mix3(r.pal[1], r.pal[0], k);
    const centre = mix3(c, r.pal[2] || [246, 196, 70], core);
    return { c: centre, h: 0.3 + k * 0.6, e: BLACK };
  },

  /** Paw pads: one big pad plus four toes, laid around the hub. */
  paw: (x, y, r, ph) => {
    const toeWave = Math.abs(Math.sin(x * 4 * PI));
    const toe = clamp(1 - Math.hypot((toeWave - 0.85) * 3.2, (y - 0.72) * 3.0) * 1.6, 0, 1);
    const pad = clamp(1 - Math.hypot((y - 0.32) * 1.9, Math.sin(x * 4 * PI + 0.8) * 0.9) * 2.2, 0, 1);
    const k = clamp(toe * 0.9 + pad, 0, 1);
    const c = mix3(r.pal[1], r.pal[0], Math.pow(k, 0.6));
    return { c, h: 0.25 + k * 0.7, e: BLACK };
  },

  /** Pineapple: a diagonal crosshatch with a spiky crown. */
  pineapple: (x, y, r, ph) => {
    const n = Math.round(r.s * 3);
    const a = Math.abs(((x * n + y * n) % 1) - 0.5);
    const b = Math.abs(((x * n - y * n) % 1) - 0.5);
    const cross = clamp(1 - Math.min(a, b) * 8, 0, 1);
    const cell = clamp(1 - Math.hypot(a, b) * 3.4, 0, 1);
    const k = clamp(cross * 0.7 + cell * 0.5, 0, 1);
    const c = mix3(r.pal[1], r.pal[0], k);
    const crown = y < 0.16 ? 1 : 0;
    return {
      c: crown ? mix3(c, r.pal[2] || [70, 150, 60], 0.85) : c,
      h: crown ? 0.9 : 0.25 + k * 0.6, e: BLACK,
    };
  },

  /** Candy cane: a helical stripe that wraps as the wheel turns. */
  candy: (x, y, r, ph) => {
    const t = ((x * r.s * 2 - y * 1.6 + ph) % 1 + 1) % 1;
    const band = t < 0.5 ? 0 : 1;
    const edge = clamp(1 - Math.abs(t - 0.5) * 12, 0, 1) + clamp(1 - Math.abs(t - 0.0) * 12, 0, 1);
    const c = mix3(r.pal[band ? 0 : 1], r.pal[2] || [255, 255, 255], clamp(edge, 0, 1) * 0.6);
    return { c, h: band ? 0.7 : 0.3, e: BLACK };
  },

  /** A sushi roll: nori band, rice, and a salmon spiral in the middle. */
  sushi: (x, y, r, ph) => {
    const nori = y > 0.74 ? 1 : 0;
    const riceN = 46;
    const rx = (x * riceN) % 1, ry = (y * riceN * 0.7) % 1;
    const grain = clamp(1 - Math.hypot(rx - 0.5, ry - 0.5) * 2.4, 0, 1);
    const spiral = Math.pow(Math.abs(Math.sin((x * 3.2 + y * 1.6) * PI)), 0.5);
    const flesh = clamp((0.72 - y) * 2.2, 0, 1);
    let c = mix3(r.pal[1], r.pal[0], grain * 0.5 + 0.4);
    c = mix3(c, r.pal[2] || [236, 128, 104], spiral * flesh * 0.85);
    if (nori) c = mul3(r.pal[3] || [26, 32, 28], 0.9 + grain * 0.4);
    return { c, h: nori ? 0.8 : 0.35 + grain * 0.3 + spiral * flesh * 0.25, e: BLACK };
  },

  /** A retro sun with horizontal slats — pure 1980s. */
  sun: (x, y, r, ph) => {
    const disc = clamp((0.72 - y) * 3.4, 0, 1);
    const slat = Math.floor(y * 14);
    const gap = y > 0.34 && (slat % 2 === 0) ? 0 : 1;
    const bands = (y * 5) % 1;
    const c = mix3(r.pal[1], r.pal[0], clamp(y * 1.6, 0, 1));
    const sky = mix3(r.pal[2] || [60, 30, 90], r.pal[1], clamp(y, 0, 1));
    const e = mul3(mix3(r.pal[1], r.pal[0], clamp(y * 1.4, 0, 1)), disc * gap * 0.9);
    return {
      c: mix3(sky, c, disc * gap),
      h: 0.4 + disc * gap * 0.3 + bands * 0.1,
      e,
    };
  },
};

export const PATTERN_IDS = Object.keys(PATTERNS);

/* ========================================================================== *
 *  RECIPES
 * ---------------------------------------------------------------------------
 *  A recipe = one pattern + a palette + a scale + material parameters + an
 *  animation descriptor. The 50 wheels in wheels.js each name exactly one, so
 *  "all fifty are distinct" is a property of this table, not of a hope.
 *
 *  anim modes
 *    strip  N real baked frames, played back by stepping offset.y  (frames, fps)
 *    scroll the map slides under the surface                          (vx, vy)
 *    spin   the map rotates about its centre                          (speed)
 *    pulse  emissive breathes                                         (hz, lo, hi)
 *    beat   double-thump heartbeat envelope                           (bpm)
 *  Any mode may also carry `glow` for a second, slower emissive envelope.
 * ========================================================================== */

const R = (id, name, pat, pal, o = {}) => ({
  id, name, pat,
  pal: pal.map((c) => (Array.isArray(c) ? c : hexToRgb(c))),
  s: o.s === undefined ? 4 : o.s,
  rough: o.rough === undefined ? 0.5 : o.rough,
  metal: o.metal === undefined ? 0.12 : o.metal,
  emis: o.emis === undefined ? 0 : o.emis,
  relief: o.relief === undefined ? 1.0 : o.relief,
  var: o.var === undefined ? 0.22 : o.var,
  anim: o.anim || null,
  note: o.note || '',
});

export const WHEEL_TEX = [
  /* --- the two the user asked for by name ------------------------------- */
  R('glaze', 'Strawberry Glaze', 'sprinkle',
    ['#ff5fa2', '#ffd9ea', '#fff3b0', '#7ee0ff', '#c8ff8a', '#ffe066', '#ff9ad5'],
    { s: 3.2, rough: 0.24, metal: 0.02, relief: 1.5, anim: { mode: 'scroll', vy: 0.03, spin: 0.04 }, note: 'donut icing' }),

  R('foxtail', 'Fox Tail', 'fur',
    ['#e8761f', '#a83c0c', '#faf4ea'],
    { s: 5, rough: 0.92, metal: 0, relief: 1.9, var: 0.3, anim: { mode: 'scroll', vx: 0.10 }, note: 'brushed fur' }),

  R('emberheart', 'Ember Heart', 'vein',
    ['#ff2d20', '#3a0507', '#ff8a3d'],
    { s: 3.4, rough: 0.42, metal: 0.06, emis: 1.35, relief: 1.4, anim: { mode: 'beat', bpm: 78 } }),

  R('pyre', 'Pyre', 'flame',
    ['#fff0b8', '#ff8c14', '#5c0f04'],
    { s: 3.6, rough: 0.45, metal: 0.05, emis: 1.5, relief: 1.3, anim: { mode: 'strip', frames: 8, fps: 13, glow: { hz: 1.7, lo: 0.6, hi: 1.25 } } }),

  /* --- heat ------------------------------------------------------------- */
  R('magmaflow', 'Magma Flow', 'magma',
    ['#ffd24a', '#2a1410', '#ff4a0a'],
    { s: 3.2, rough: 0.55, metal: 0.1, emis: 1.55, relief: 1.5, anim: { mode: 'strip', frames: 8, fps: 10 } }),
  R('lavaflow', 'Lava Flow', 'crack',
    ['#ff7a1a', '#241a16', '#ffdd66'],
    { s: 3.8, rough: 0.62, metal: 0.15, emis: 1.4, relief: 1.7, anim: { mode: 'strip', frames: 8, fps: 8 } }),
  R('dragonfire', 'Dragonfire', 'flame',
    ['#f6ff8a', '#22c96a', '#0a2c14'],
    { s: 4.4, rough: 0.42, metal: 0.08, emis: 1.4, relief: 1.3, anim: { mode: 'strip', frames: 8, fps: 16 } }),
  R('cinder', 'Cinder', 'crack',
    ['#ffae42', '#15161a', '#ff6a00'],
    { s: 5.4, rough: 0.78, metal: 0.2, emis: 0.95, relief: 2.0, anim: { mode: 'pulse', hz: 0.9, lo: 0.45, hi: 1.1 } }),

  /* --- cold ------------------------------------------------------------- */
  R('glacier', 'Glacier', 'crystal',
    ['#eafcff', '#2b6d92', '#8fe6ff'],
    { s: 4.0, rough: 0.14, metal: 0.25, emis: 0.75, relief: 1.8, anim: { mode: 'pulse', hz: 0.7, lo: 0.5, hi: 1.05 } }),
  R('permafrost', 'Permafrost', 'frost',
    ['#ffffff', '#7fb6cf', '#cdf3ff'],
    { s: 5.5, rough: 0.2, metal: 0.15, emis: 0.6, relief: 2.1, anim: { mode: 'spin', speed: 0.10 } }),
  R('cryocore', 'Cryo Core', 'crystal',
    ['#d6fbff', '#12405e', '#4fd8ff'],
    { s: 5.6, rough: 0.1, metal: 0.35, emis: 1.25, relief: 1.6, anim: { mode: 'strip', frames: 6, fps: 9 } }),
  R('shiver', 'Shiver', 'frost',
    ['#f2feff', '#4a6f8c', '#a9e8ff'],
    { s: 8.0, rough: 0.3, metal: 0.1, emis: 0.5, relief: 2.2, anim: { mode: 'scroll', vy: -0.05 } }),

  /* --- energy ----------------------------------------------------------- */
  R('plasmadrive', 'Plasma Drive', 'plasma',
    ['#e5c6ff', '#3a1a6b', '#a05cff'],
    { s: 3.4, rough: 0.16, metal: 0.2, emis: 1.6, relief: 1.1, anim: { mode: 'scroll', vx: 0.16, vy: 0.05, glow: { hz: 2.1, lo: 0.7, hi: 1.2 } } }),
  R('thunder', 'Thunderhead', 'bolt',
    ['#ffffff', '#1b2a52', '#7fc4ff'],
    { s: 3.0, rough: 0.3, metal: 0.2, emis: 1.5, relief: 1.4, anim: { mode: 'strip', frames: 8, fps: 18 } }),
  R('circuit', 'Circuit Board', 'circuit',
    ['#7dff9b', '#08160c', '#1c6b32'],
    { s: 2.6, rough: 0.34, metal: 0.3, emis: 1.35, relief: 1.6, anim: { mode: 'scroll', vx: 0.22, glow: { hz: 1.6, lo: 0.65, hi: 1.2 } } }),
  R('cyber', 'Cyberdeck', 'circuit',
    ['#ff4fd8', '#10041c', '#4a0a52'],
    { s: 4.2, rough: 0.26, metal: 0.35, emis: 1.45, relief: 1.5, anim: { mode: 'strip', frames: 6, fps: 12 } }),
  R('neongrid', 'Neon Grid', 'grid',
    ['#3ff5ff', '#050912', '#ff2fd0'],
    { s: 4.0, rough: 0.22, metal: 0.25, emis: 1.5, relief: 1.4, anim: { mode: 'scroll', vx: 0.12, vy: 0.08 } }),
  R('holofoil', 'Holofoil', 'holo',
    ['#ffffff', '#20242e', '#8ad6ff'],
    { s: 4.0, rough: 0.08, metal: 0.85, emis: 0.55, relief: 0.9, anim: { mode: 'spin', speed: 0.30 } }),
  R('oilslick', 'Oil Slick', 'slick',
    ['#ffffff', '#0a0b0f', '#4a4a55'],
    { s: 3.2, rough: 0.1, metal: 0.7, emis: 0, relief: 1.0, anim: { mode: 'spin', speed: 0.22 } }),
  R('acidrain', 'Acid Rain', 'acid',
    ['#b6ff2e', '#0f1a06', '#5cff8a'],
    { s: 3.6, rough: 0.36, metal: 0.1, emis: 1.3, relief: 1.6, anim: { mode: 'strip', frames: 8, fps: 11 } }),
  R('toxic', 'Toxic Bloom', 'acid',
    ['#7dff2e', '#12200a', '#ffe23a'],
    { s: 5.6, rough: 0.5, metal: 0.08, emis: 1.05, relief: 1.9, anim: { mode: 'pulse', hz: 1.1, lo: 0.5, hi: 1.15 } }),
  R('ghostfire', 'Ghost Fire', 'smoke',
    ['#dffcff', '#0b1a24', '#4fd8ff'],
    { s: 3.2, rough: 0.4, metal: 0.1, emis: 1.1, relief: 1.2, anim: { mode: 'scroll', vy: 0.14, glow: { hz: 0.8, lo: 0.55, hi: 1.15 } } }),
  R('sunburst', 'Sunburst', 'sun',
    ['#ffe36a', '#ff5a2e', '#3a1052'],
    { s: 4.0, rough: 0.3, metal: 0.2, emis: 1.2, relief: 1.1, anim: { mode: 'spin', speed: 0.18, glow: { hz: 0.6, lo: 0.8, hi: 1.15 } } }),
  R('retrosun', 'Retro Sunset', 'sun',
    ['#ffe066', '#ff6b2c', '#2a0e3f'],
    { s: 5.4, rough: 0.42, metal: 0.15, emis: 1.0, relief: 1.2, anim: { mode: 'strip', frames: 6, fps: 7 } }),

  /* --- pattern / print -------------------------------------------------- */
  R('zebra', 'Zebra', 'stripe',
    ['#f4f4f0', '#131316', '#8c8c92'],
    { s: 3.6, rough: 0.44, metal: 0.08, relief: 1.5, anim: { mode: 'spin', speed: 0.14 } }),
  R('candycane', 'Candy Cane', 'candy',
    ['#ff2b45', '#fdfdff', '#ffb3bf'],
    { s: 3.0, rough: 0.22, metal: 0.05, relief: 1.6, anim: { mode: 'scroll', vx: 0.10, vy: 0.05 } }),
  R('checkerflag', 'Checker Flag', 'checker',
    ['#f7f7f7', '#101014', '#b8bcc4'],
    { s: 5.0, rough: 0.4, metal: 0.08, relief: 1.5, anim: { mode: 'spin', speed: 0.10 } }),
  R('cheetah', 'Cheetah', 'spot',
    ['#e8b262', '#1a1410', '#3a2a18'],
    { s: 4.4, rough: 0.5, metal: 0.06, relief: 1.6, anim: { mode: 'spin', speed: 0.16 } }),
  R('camo', 'Woodland', 'camo',
    ['#4f5a3a', '#2b3322', '#6e7a52'],
    { s: 3.2, rough: 0.72, metal: 0.05, relief: 1.7, anim: null }),
  R('stealth', 'Stealth', 'camo',
    ['#2f3a34', '#121815', '#4d5a50'],
    { s: 5.2, rough: 0.6, metal: 0.25, relief: 1.6, anim: null }),
  R('dazzle', 'Dazzle', 'camo',
    ['#dfe6f2', '#16233a', '#7f96b8'],
    { s: 6.5, rough: 0.5, metal: 0.15, relief: 1.5, anim: { mode: 'spin', speed: 0.08 } }),
  R('graffiti', 'Graffiti', 'paint',
    ['#ffe23a', '#181a1f', '#ff2fd0', '#3ff5ff', '#7dff2e'],
    { s: 3.0, rough: 0.42, metal: 0.06, relief: 1.5, anim: { mode: 'scroll', vx: 0.05 } }),
  R('pixel', 'Pixel Art', 'pixel',
    ['#ff4fd8', '#0a0a14', '#3ff5ff'],
    { s: 4.4, rough: 0.36, metal: 0.1, emis: 0.5, relief: 1.7, anim: { mode: 'strip', frames: 6, fps: 9 } }),

  /* --- stone / metal / natural ------------------------------------------ */
  R('honeycomb', 'Honeycomb', 'honey',
    ['#ffc23a', '#5c3a08', '#fff0b0'],
    { s: 3.4, rough: 0.3, metal: 0.15, emis: 0.5, relief: 1.9, anim: { mode: 'pulse', hz: 0.5, lo: 0.7, hi: 1.1 } }),
  R('alloycore', 'Alloy Core', 'honey',
    ['#cfd6e2', '#3a4048', '#8ad6ff'],
    { s: 5.0, rough: 0.28, metal: 0.9, emis: 0, relief: 1.8, anim: null }),
  R('marble', 'Carrara', 'marble',
    ['#f8f8f4', '#1e2026', '#c9c9c0'],
    { s: 3.0, rough: 0.16, metal: 0.2, relief: 1.1, anim: null }),
  R('terrazzo', 'Terrazzo', 'terrazzo',
    ['#ff6a4d', '#f0ece2', '#3a6ea8', '#e8c34a', '#4fb87a'],
    { s: 3.2, rough: 0.3, metal: 0.12, relief: 1.2, anim: null }),
  R('rustbucket', 'Rust Bucket', 'rust',
    ['#b06a2c', '#3a3028', '#7d4a1e'],
    { s: 3.6, rough: 0.9, metal: 0.4, relief: 2.2, anim: null }),
  R('dragonscale', 'Dragon Scale', 'scale',
    ['#d8c05a', '#1f4a2c', '#ffd166'],
    { s: 3.6, rough: 0.3, metal: 0.5, emis: 0.3, relief: 2.1, anim: { mode: 'spin', speed: 0.06 } }),
  R('snakeskin', 'Snakeskin', 'scale',
    ['#e0b878', '#2a1a12', '#f6e0b0'],
    { s: 5.4, rough: 0.36, metal: 0.25, relief: 2.0, anim: null }),
  R('timber', 'Timber', 'wood',
    ['#c08a4a', '#4a2c14', '#e0b878'],
    { s: 3.4, rough: 0.68, metal: 0.04, relief: 1.8, anim: null }),
  R('denim', 'Denim', 'cloth',
    ['#4a6ea8', '#1e2a44', '#8fb0d8'],
    { s: 3.0, rough: 0.86, metal: 0.03, relief: 1.9, anim: null }),
  R('carbonwrap', 'Carbon Wrap', 'cloth',
    ['#3a3f48', '#0d0f13', '#8ad6ff'],
    { s: 4.2, rough: 0.28, metal: 0.35, relief: 1.7, anim: null }),

  /* --- novelty ---------------------------------------------------------- */
  R('cookie', 'Choc Chip', 'cookie',
    ['#d9a05a', '#8a5a2a', '#2e1c12'],
    { s: 3.4, rough: 0.78, metal: 0.02, relief: 2.0, anim: null }),
  R('watermelon', 'Watermelon', 'melon',
    ['#1f7a3a', '#0f4a22', '#e8304a'],
    { s: 4.2, rough: 0.36, metal: 0.05, relief: 1.7, anim: null }),
  R('vinyl', 'Long Play', 'record',
    ['#ffffff', '#0b0b0e', '#c8305a', '#ffcf5c'],
    { s: 3.0, rough: 0.14, metal: 0.55, emis: 0, relief: 1.0, anim: { mode: 'spin', speed: 0.9 } }),
  R('daisy', 'Daisy', 'flower',
    ['#fffdf2', '#2a3a20', '#ffc23a'],
    { s: 3.2, rough: 0.34, metal: 0.06, relief: 1.6, anim: { mode: 'spin', speed: 0.12 } }),
  R('rose', 'Black Rose', 'flower',
    ['#d8203c', '#120a10', '#4a0a18'],
    { s: 4.6, rough: 0.24, metal: 0.25, relief: 1.5, anim: { mode: 'spin', speed: -0.14 } }),
  R('pawprint', 'Paw Print', 'paw',
    ['#ffd9ea', '#3a2440', '#ff5fa2'],
    { s: 3.0, rough: 0.44, metal: 0.05, relief: 1.6, anim: null }),
  R('pineapple', 'Pineapple', 'pineapple',
    ['#f0c040', '#8a5a10', '#4fa03a'],
    { s: 3.4, rough: 0.5, metal: 0.08, relief: 1.9, anim: null }),
  R('gumball', 'Gumball', 'bubble',
    ['#ff9ad5', '#f6f6fa', '#7ee0ff', '#ffe066'],
    { s: 3.2, rough: 0.12, metal: 0.05, relief: 1.6, anim: { mode: 'scroll', vx: 0.06, vy: 0.04 } }),
  R('candycrush', 'Candy Crush', 'bubble',
    ['#7ee0ff', '#2a1040', '#ff4fd8', '#c8ff8a'],
    { s: 5.0, rough: 0.16, metal: 0.1, emis: 0.4, relief: 1.5, anim: { mode: 'spin', speed: -0.20 } }),
  R('sushi', 'Sushi Roll', 'sushi',
    ['#f7f4ea', '#e8dfc8', '#ec8068', '#1a201c'],
    { s: 3.4, rough: 0.5, metal: 0.05, relief: 1.8, anim: null }),
  R('gearhead', 'Gearhead', 'gear',
    ['#c6ccd6', '#2a2e36', '#8ad6ff'],
    { s: 3.0, rough: 0.34, metal: 0.92, relief: 2.1, anim: { mode: 'spin', speed: 0.34 } }),
  R('ripplewave', 'Ripple Wave', 'ripple',
    ['#cdf3ff', '#0a2a44', '#4fd8ff'],
    { s: 3.6, rough: 0.18, metal: 0.2, emis: 0.7, relief: 1.4, anim: { mode: 'scroll', vy: 0.20 } }),
  R('inkblot', 'Ink Blot', 'smoke',
    ['#e8e8f0', '#0a0a12', '#3a3a52'],
    { s: 4.6, rough: 0.55, metal: 0.1, relief: 1.4, anim: { mode: 'spin', speed: 0.05 } }),
  R('buzzsaw', 'Buzzsaw', 'gear',
    ['#f0f2f6', '#8c1a10', '#ffd166'],
    { s: 5.0, rough: 0.2, metal: 0.95, relief: 2.3, anim: { mode: 'spin', speed: 0.55 } }),
];

export const WHEEL_TEX_IDS = WHEEL_TEX.map((r) => r.id);
export const WHEEL_TEX_BY_ID = new Map(WHEEL_TEX.map((r) => [r.id, r]));

/* ========================================================================== *
 *  BAKING
 * ========================================================================== */

/** Bake one channel set for one UV space. */
function bakeSpace(rec, space, size, frames) {
  const pat = PATTERNS[rec.pat] || PATTERNS.smoke;
  const h = size * frames;

  const sample = (u, v) => {
    const fi = frames > 1 ? Math.min(frames - 1, Math.floor(v * frames)) : 0;
    const lv = frames > 1 ? (v * frames) % 1 : v;
    const [x, y] = toSpace(space, u, lv);
    return pat(x, y, rec, frames > 1 ? fi / frames : 0);
  };

  const albedo = fill(buffer(size, h), (u, v) => {
    const s = sample(u, v);
    const g = 0.72 + clamp(s.h, 0, 1) * 0.52;
    const c = s.c || [128, 128, 128];
    // the emissive channel is added into the albedo too, so a hot texel stays
    // bright when the material's emissiveIntensity is dialled down
    const e = s.e || BLACK;
    return [c[0] * g + e[0] * 0.32, c[1] * g + e[1] * 0.32, c[2] * g + e[2] * 0.32, 255];
  });

  const rs = Math.max(16, size >> 1);
  const rough = fill(buffer(rs, rs * frames), (u, v) => {
    const s = sample(u, v);
    const k = clamp(rec.rough + (clamp(s.h, 0, 1) - 0.5) * 2 * rec.var, 0.02, 1) * 255;
    return [k, k, k, 255];
  });

  const normal = normalFromHeight(rs, rs * frames, (u, v) => clamp(sample(u, v).h, 0, 1), rec.relief * 1.6);

  let emis = null;
  if (rec.emis > 0) {
    emis = fill(buffer(rs, rs * frames), (u, v) => {
      const e = sample(u, v).e || BLACK;
      return [e[0] * rec.emis, e[1] * rec.emis, e[2] * rec.emis, 255];
    });
  }
  return { albedo, rough, normal, emis, size, frames };
}

/**
 * Bake a recipe into { face, tread } channel sets.
 * @param id     recipe id
 * @param size   albedo edge length; roughness/normal/emissive are half that
 * @param opt.strip  false forces a single frame even for a strip recipe
 */
export function bakeWheelTex(id, size = 160, opt = {}) {
  const rec = WHEEL_TEX_BY_ID.get(id);
  if (!rec) return null;
  const a = rec.anim;
  const wantStrip = opt.strip !== false && !!a && a.mode === 'strip';
  const frames = wantStrip ? Math.max(2, Math.min(16, (a.frames | 0) || 8)) : 1;
  return {
    id, meta: rec, frames, anim: a,
    face: bakeSpace(rec, 'face', size, frames),
    tread: bakeSpace(rec, 'tread', size, frames),
  };
}

/** Cheap signature of a baked albedo, for the "all fifty differ" check.
 *  Six radial bands, each contributing its mean RGB and the standard deviation
 *  of its luminance — a mean alone would call two different greys identical. */
export function texSignature(baked) {
  const d = baked.face.albedo.data, w = baked.face.albedo.w, h = baked.face.albedo.h;
  const mean = new Array(18).fill(0), sq = new Array(6).fill(0);
  const n = new Array(6).fill(0);
  for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) {
    const dx = (x + 0.5) / w - 0.5, dy = (y + 0.5) / h - 0.5;
    const rr = Math.hypot(dx, dy) * 2;
    if (rr > 1) continue;
    const b = Math.min(5, Math.floor(rr * 6));
    const o = (y * w + x) * 4;
    for (let c = 0; c < 3; c++) mean[b * 3 + c] += d[o + c];
    const lum = 0.30 * d[o] + 0.59 * d[o + 1] + 0.11 * d[o + 2];
    sq[b] += lum * lum;
    n[b]++;
  }
  const sig = new Array(24);
  for (let b = 0; b < 6; b++) {
    const k = n[b] || 1;
    for (let c = 0; c < 3; c++) sig[b * 3 + c] = mean[b * 3 + c] / k;
    const mu = (sig[b * 3] * 0.3 + sig[b * 3 + 1] * 0.59 + sig[b * 3 + 2] * 0.11);
    sig[18 + b] = Math.sqrt(Math.max(0, sq[b] / k - mu * mu));
  }
  return sig;
}

/* ========================================================================== *
 *  ANIMATION
 * ========================================================================== */

/** Heartbeat envelope: two thumps, the second softer, then a rest. */
export function beat(t, bpm = 75) {
  const p = (t * (bpm / 60)) % 1;
  const thump = (x, w, a) => (x < 0 ? 0 : a * Math.exp(-x / w));
  return clamp(thump(p, 0.035, 1) + thump(p - 0.17, 0.055, 0.62), 0, 1.35);
}

/**
 * Wire a baked texture into a set of materials and return a per-frame stepper.
 * `maps` is the list of DataTextures that must move together (albedo, rough,
 * normal, emissive) — if they drifted apart the bump map would slide out from
 * under the colour.
 */
export function makeWheelTexAnim(baked, maps, mats) {
  const a = baked.anim;
  if (!a) return null;
  const frames = baked.frames;
  const st = { frame: 0, acc: 0, off: 0, t: 0 };
  const glow = a.glow || null;
  const base = mats.length ? (mats[0].emissiveIntensity || 1) : 1;
  const lit = mats.filter((m) => m && m.emissiveMap);
  const lo = a.lo === undefined ? 0.5 : a.lo;

  // A scrolling map needs somewhere to scroll TO, so a single-frame recipe
  // tiles 2x and wraps; a frame strip must stay at 1/N or frame f bleeds into
  // frame f+1.
  const repX = frames > 1 ? 1 : (a.mode === 'scroll' && a.vx ? 2 : 1);
  const repY = frames > 1 ? 1 / frames : (a.mode === 'scroll' && a.vy ? 2 : 1);

  const apply = (frame, ox, oy) => {
    for (const m of maps) {
      m.repeat.set(repX, repY);
      m.offset.set(ox, (frames > 1 ? frame / frames : 0) + oy);
    }
  };
  apply(0, 0, 0);

  return (dt) => {
    st.t += dt;
    if (frames > 1) {
      st.acc += dt * (a.fps || 12);
      if (st.acc >= 1) { const s = Math.floor(st.acc); st.acc -= s; st.frame = (st.frame + s) % frames; }
    }
    if (a.mode === 'scroll') {
      st.off += dt;
      apply(st.frame, a.vx ? (a.vx * st.off) % 1 : 0, a.vy ? (a.vy * st.off) % 1 : 0);
    } else if (a.mode === 'spin') {
      st.off += dt * (a.speed || 0.2);
      for (const m of maps) { m.center.set(0.5, 0.5); m.rotation = st.off; }
    } else {
      apply(st.frame, 0, 0);
    }

    if (lit.length) {
      let e = base;
      if (a.mode === 'pulse') e = base * (lo + (1 - lo) * (0.5 + 0.5 * Math.sin(st.t * TAU * (a.hz || 1))));
      else if (a.mode === 'beat') e = base * (0.30 + beat(st.t, a.bpm) * 1.20);
      if (glow) e *= glow.lo + (glow.hi - glow.lo) * (0.5 + 0.5 * Math.sin(st.t * TAU * glow.hz));
      for (const m of lit) m.emissiveIntensity = e;
    }
  };
}

/* ========================================================================== *
 *  MATERIALS
 * ========================================================================== */

/**
 * Turn one baked space into a material. `lib` is an UltraCarLib instance so the
 * textures go through its cache and its no-mipmap path for frame strips.
 */
export function wheelTexMaterial(lib, baked, space, o = {}) {
  const T = lib.T;
  const b = baked[space];
  if (!b) return null;
  const strip = baked.frames > 1;
  const key = `wtex|${baked.id}|${space}|${b.size}|${baked.frames}|${o.tag || ''}`;
  const maps = lib.maps(key, () => ({ albedo: b.albedo, rough: b.rough, normal: b.normal, emis: b.emis }),
    { animated: strip, repeat: [1, 1] });

  const mat = new T.MeshStandardMaterial({
    color: o.color === undefined ? 0xffffff : new T.Color(o.color),
    map: maps.map,
    roughnessMap: maps.roughnessMap,
    normalMap: maps.normalMap,
    metalness: o.metal === undefined ? baked.meta.metal : o.metal,
    roughness: 1,
    normalScale: new T.Vector2(o.bump === undefined ? 1.0 : o.bump, o.bump === undefined ? 1.0 : o.bump),
  });
  if (maps.emissiveMap) {
    mat.emissiveMap = maps.emissiveMap;
    mat.emissive = new T.Color(0xffffff);
    mat.emissiveIntensity = o.emissive === undefined ? 1.2 : o.emissive;
  }
  if (o.side !== undefined) mat.side = o.side;
  if (strip) {
    // a frame strip must not be mipmapped or frame f averages with frame f+1
    for (const m of [maps.map, maps.roughnessMap, maps.normalMap, maps.emissiveMap]) {
      if (m) { m.repeat.set(1, 1 / baked.frames); }
    }
  }
  return mat;
}

/** Every DataTexture a baked set produced, so the animator can move them together. */
export function bakedMaps(lib, baked, space, mat) {
  if (!mat) return [];
  const out = [];
  for (const k of ['map', 'roughnessMap', 'normalMap', 'emissiveMap']) if (mat[k]) out.push(mat[k]);
  return out;
}

export default WHEEL_TEX;
