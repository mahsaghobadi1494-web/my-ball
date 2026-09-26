/* =============================================================================
 * ultra/vinyls.js — 50 new liveries, 18 of them genuinely ANIMATED
 * -----------------------------------------------------------------------------
 * Authored in the body loft's own UV space:
 *     u = around the section   (u = 0.25 is the spine / roof centreline)
 *     v = nose (0) -> tail (1)
 * Every pattern returns [secondary, accent, emissive] coverage, NOT colours.
 * Returning coverage is what lets one livery be recoloured live to any team
 * palette, drive roughness (matte decal film on gloss paint) and drive a glow
 * channel without a second code path.
 *
 * ANIMATION
 * ---------
 * A vinyl may declare `frames: N`. bakeBodyUltra then bakes N time-samples
 * stacked vertically into ONE texture and the material plays them back by
 * stepping texture offset.y — a real frame-by-frame animated decal, the way the
 * source material does it, not a scrolling noise hack. `scroll` adds a slow
 * continuous u drift on top, `glow` drives emissive intensity.
 *
 * t is the animation phase in 0..1 and every animated pattern is authored to
 * loop seamlessly at t = 1.
 * ===========================================================================*/

import { TAU, PI } from '../carLibraryPro.js';
import { hash2, vnoise, fbm, voronoi, weave } from './materials.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);

/** Signed distance from the spine. m: 0 at the roof centreline, 1 at the
 *  underside. c: signed, -0.5..0.5, so a symmetric pair of stripes is one term. */
function crownUV(u) {
  let c = (u - 0.25 + 1) % 1;
  if (c > 0.5) c -= 1;
  return { m: Math.abs(c) * 2, side: c < 0 ? -1 : 1, c };
}
const band = (x, a, b, soft = 0.012) =>
  clamp((x - (a - soft)) / soft, 0, 1) * clamp(((b + soft) - x) / soft, 0, 1);
const stripe = (x, c, w, soft = 0.01) => band(x, c - w, c + w, soft);

/** Hex lattice used by the camo patterns. */
function hexGrid(x, y) {
  const r3 = Math.sqrt(3);
  const q = x * 2 / 3, r = (-x / 3 + y / r3);
  const rx = Math.round(q), ry = Math.round(r), rz = Math.round(-q - r);
  let X = rx, Y = ry;
  const dx = Math.abs(rx - q), dy = Math.abs(ry - r), dz = Math.abs(rz + q + r);
  if (dx > dy && dx > dz) X = -ry - rz; else if (dy > dz) Y = -rx - rz;
  const cx = 1.5 * X, cy = r3 * (Y + X / 2);
  return { d: Math.max(Math.abs(x - cx), Math.abs(y - cy) / r3 * 1.15), id: hash2(X * 7 + 3, Y * 11 + 5) };
}

/* ========================================================================== *
 *  ANIMATED  (frames: N  ->  baked as an N-frame strip, played at runtime)
 * ========================================================================== */

export const ULTRA_VINYLS_ANIMATED = [

  { id: 'datastream', name: 'Data Stream', grade: 'epic', tags: ['tech', 'animated'], frames: 6, fps: 14, scroll: 0.02, glow: 0.5,
    fn: (u, v, t) => {
      const cols = 26, ci = Math.floor(u * cols), r = hash2(ci, 7);
      const ph = (v * 3 + t * (0.6 + r * 1.4) + r) % 1;
      const bar = band(ph, 0, 0.34, 0.05);
      const on = hash2(ci, 3) > 0.32 ? 1 : 0;
      const s = bar * on;
      const a = s * (hash2(ci, 11) > 0.6 ? 1 : 0);
      return [s, a, s * 0.4];
    } },

  { id: 'lavaflow', name: 'Lava Flow', grade: 'legendary', tags: ['elemental', 'animated'], frames: 6, fps: 12, glow: 1.0,
    fn: (u, v, t) => {
      const n = fbm(u * 9 + t * 2.4, v * 7 - t * 1.6, 4);
      const crack = clamp(1 - Math.abs(n - 0.5) * 7.5, 0, 1);
      const pool = clamp((n - 0.46) * 3.4, 0, 1);
      return [pool, clamp(crack + pool * 0.4, 0, 1), clamp(crack * 0.95 + pool * 0.35, 0, 1)];
    } },

  { id: 'portal', name: 'Portal Rift', grade: 'legendary', tags: ['cosmic', 'animated'], frames: 8, fps: 16, glow: 0.9,
    fn: (u, v, t) => {
      const { c } = crownUV(u);
      const r = Math.hypot(c * 1.15, (v - 0.5) * 1.0);
      const a = Math.atan2(v - 0.5, c * 1.2);
      const spiral = Math.sin(r * 10 - a * 2.2 - t * TAU) * 0.5 + 0.5;
      const core = clamp(1 - r * 2.0, 0, 1);
      return [spiral * clamp(1.3 - r, 0, 1), core, clamp(core * 0.85 + spiral * 0.3, 0, 1)];
    } },

  // id was 'aurora', which the base library already ships. findVinyl() checks
  // VINYL_BY_ID before ULTRA_VINYL_BY_ID, so this decal was unreachable.
  { id: 'auroraveil', name: 'Aurora Veil', grade: 'epic', tags: ['cosmic', 'animated'], frames: 6, fps: 10, glow: 0.55,
    fn: (u, v, t) => {
      const { m } = crownUV(u);
      const w = fbm(v * 2.6 + t * 1.6, m * 2.0 + 4, 4);
      const cur = smooth(clamp(v * 0.55 + w * 0.7 - 0.08, 0, 1));
      return [cur, clamp((w - 0.58) * 4, 0, 1) * cur, cur * 0.4];
    } },

  { id: 'hyperspace', name: 'Hyperspace', grade: 'epic', tags: ['space', 'animated'], frames: 5, fps: 18, glow: 0.6,
    fn: (u, v, t) => {
      const { c } = crownUV(u);
      const s = (v * 9 + t * 6) % 1;
      const len = band(s, 0, 0.22, 0.05);
      const lane = Math.abs(Math.sin(c * 22)) > 0.72 ? 1 : 0;
      const k = len * lane;
      return [k, k * (v > 0.28 ? 1 : 0), k * 0.65];
    } },

  { id: 'circuitpulse', name: 'Circuit Pulse', grade: 'legendary', tags: ['tech', 'animated'], frames: 6, fps: 15, glow: 1.0,
    fn: (u, v, t) => {
      const gx = u * 64, gy = v * 32;
      const cx = Math.floor(gx), cy = Math.floor(gy);
      const r = hash2(cx, cy), fx = gx - cx, fy = gy - cy;
      let tr = 0;
      if (r < 0.22) tr = band(fy, 0.44, 0.56, 0.04);
      else if (r < 0.40) tr = band(fx, 0.44, 0.56, 0.04);
      else if (r < 0.50) tr = Math.max(band(fx, 0.42, 0.58, 0.05) * (fy < 0.55 ? 1 : 0), band(fy, 0.42, 0.58, 0.05) * (fx > 0.45 ? 1 : 0));
      const pulse = Math.sin((gx * 0.35 + gy * 0.2 - t * TAU * 3)) * 0.5 + 0.5;
      const glow = Math.pow(pulse, 6) * tr;
      return [tr, glow, glow];
    } },

  { id: 'hologram', name: 'Hologram', grade: 'black market', tags: ['neon', 'animated'], frames: 8, fps: 14, glow: 0.7,
    fn: (u, v, t) => {
      const { c } = crownUV(u);
      const b = Math.sin((v * 14 + Math.abs(c) * 6 + t * TAU) * PI) * 0.5 + 0.5;
      const sweep = smooth(clamp(v - 0.15 + Math.sin(t * TAU) * 0.08, 0, 1));
      return [b * sweep, clamp((b - 0.74) * 4, 0, 1) * sweep, sweep * 0.45];
    } },

  { id: 'solarflare', name: 'Solar Flare', grade: 'legendary', tags: ['elemental', 'animated'], frames: 6, fps: 13, glow: 1.0,
    fn: (u, v, t) => {
      const { c } = crownUV(u);
      const arc = Math.sin((Math.abs(c) * 9 - v * 4.5 + t * TAU * 0.8) * PI) * 0.5 + 0.5;
      const flare = clamp((1 - v) * 1.6, 0, 1);
      return [arc * flare, Math.pow(arc, 4) * flare, Math.pow(arc, 3) * flare * 0.95];
    } },

  { id: 'liquidmetal', name: 'Liquid Metal', grade: 'black market', tags: ['tech', 'animated'], frames: 6, fps: 11,
    fn: (u, v, t) => {
      const p = voronoi(u * 10 + t * 2.4, v * 7 - t * 1.5, 1);
      const blob = clamp(1 - p.d * 2.4, 0, 1);
      const rim = clamp(1 - Math.abs(p.d - 0.42) * 9, 0, 1);
      return [blob, rim, 0];
    } },

  { id: 'nebulaswirl', name: 'Nebula Swirl', grade: 'black market', tags: ['space', 'animated'], frames: 8, fps: 10, glow: 0.8,
    fn: (u, v, t) => {
      const { c } = crownUV(u);
      const a = Math.atan2(v - 0.5, c * 1.3) + t * TAU;
      const r = Math.hypot(c * 1.3, (v - 0.5));
      const n = fbm(Math.cos(a) * r * 6 + 3, Math.sin(a) * r * 6 + 7, 4);
      return [clamp((n - 0.42) * 3, 0, 1), clamp((n - 0.72) * 5, 0, 1), clamp((n - 0.6) * 3, 0, 1) * 0.7];
    } },

  { id: 'neonpulse', name: 'Neon Pulse', grade: 'epic', tags: ['neon', 'animated'], frames: 5, fps: 16, glow: 1.0,
    fn: (u, v, t) => {
      const gx = (u * 34) % 1, gy = (v * 18) % 1;
      const line = Math.max(band(gx, 0, 0.05, 0.02), band(gy, 0, 0.05, 0.02));
      const wave = Math.sin((u * 6 + v * 3 - t * TAU * 1.5) * PI) * 0.5 + 0.5;
      return [line * 0.6, line, line * Math.pow(wave, 2)];
    } },

  { id: 'tigerprowl', name: 'Tiger Prowl', grade: 'epic', tags: ['animal', 'animated'], frames: 6, fps: 9, scroll: 0.012,
    fn: (u, v, t) => {
      const { m } = crownUV(u);
      const warp = fbm(v * 4 + t * 2, m * 2 + 7, 3) * 1.4;
      const s = Math.sin(v * 13 + warp * 3.1 + t * TAU * 0.5) * 0.5 + 0.5;
      return [s > 0.62 ? 1 : 0, 0, 0];
    } },

  { id: 'toxicdrip', name: 'Toxic Drip', grade: 'legendary', tags: ['elemental', 'animated'], frames: 6, fps: 11, glow: 0.9,
    fn: (u, v, t) => {
      const { m } = crownUV(u);
      const n = fbm(u * 8 + t * 1.4, v * 5, 4);
      const drip = clamp((0.55 - m * 0.35 - n * 0.5) * 4, 0, 1);
      return [clamp((n - 0.35) * 3, 0, 1), drip, drip * 0.85];
    } },

  { id: 'trongrid', name: 'Tron Grid', grade: 'epic', tags: ['neon', 'animated'], frames: 5, fps: 14, scroll: 0.02, glow: 1.0,
    fn: (u, v, t) => {
      const gx = (u * 40 + t) % 1, gy = (v * 20 - t * 0.5) % 1;
      const l = Math.max(band(gx, 0, 0.045, 0.02), band(gy, 0, 0.045, 0.02));
      const fade = clamp(1 - v * 0.8, 0.25, 1);
      return [l * 0.5 * fade, l * fade, l * fade];
    } },

  { id: 'koiswim', name: 'Koi Pond', grade: 'legendary', tags: ['animal', 'animated'], frames: 8, fps: 12,
    fn: (u, v, t) => {
      const { c } = crownUV(u);
      const a = t * TAU, cx = Math.cos(a) * 0.30, cy = 0.5 + Math.sin(a) * 0.26;
      const body = clamp(1 - Math.hypot(c - cx, (v - cy) * 1.6) * 7, 0, 1);
      const tail = clamp(1 - Math.hypot(c - (cx + Math.cos(a) * 0.10), (v - (cy + Math.sin(a) * 0.10)) * 1.6) * 9, 0, 1);
      const fin = clamp(1 - Math.hypot(c - (cx - Math.cos(a) * 0.06), (v - (cy - Math.sin(a) * 0.06)) * 1.6) * 11, 0, 1);
      return [body, Math.max(tail, fin), 0];
    } },

  { id: 'clockwork', name: 'Clockwork', grade: 'legendary', tags: ['steam', 'animated'], frames: 6, fps: 10,
    fn: (u, v, t) => {
      const gx = u * 8, gy = v * 5;
      const cx = Math.floor(gx), cy = Math.floor(gy);
      const fx = gx - cx - 0.5, fy = gy - cy - 0.5;
      const dir = hash2(cx, cy) > 0.5 ? 1 : -1;
      const ang = Math.atan2(fy, fx) + t * TAU * dir;
      const r = Math.hypot(fx, fy);
      const teeth = Math.sin(ang * 8) * 0.5 + 0.5;
      const rim = clamp(1 - Math.abs(r - 0.34) * 7, 0, 1);
      const body = r < 0.30 ? 1 : 0;
      const cog = Math.max(rim * 0.6, teeth * clamp(1 - Math.abs(r - 0.40) * 9, 0, 1));
      return [body * 0.75, cog, 0];
    } },

  { id: 'matrixrain', name: 'Matrix Rain', grade: 'legendary', tags: ['tech', 'animated'], frames: 6, fps: 16, glow: 0.9,
    fn: (u, v, t) => {
      const cols = 34, ci = Math.floor(u * cols), r = hash2(ci, 5);
      const ph = (v * 2.2 + t * (0.5 + r * 1.2) * 2 + r * 3) % 1;
      const glyph = hash2(ci * 7, Math.floor(ph * 22)) > 0.45 ? 1 : 0;
      const tail = Math.pow(1 - ph, 1.6);
      const on = hash2(ci, 3) > 0.3 ? 1 : 0;
      const head = band(ph, 0, 0.05, 0.02);
      return [glyph * tail * on, head * on, glyph * tail * on * 0.75];
    } },

  { id: 'heartbeat', name: 'Heartbeat', grade: 'epic', tags: ['neon', 'animated'], frames: 6, fps: 15, glow: 1.0,
    fn: (u, v, t) => {
      const { c } = crownUV(u);
      const p = (v * 1.6 - t) % 1;
      const spike = Math.pow(clamp(1 - Math.abs(p - 0.5) * 22, 0, 1), 0.6);
      const line = clamp(1 - Math.abs(Math.abs(c) - 0.10) * 40, 0, 1);
      return [line, spike * line, spike * line * 0.95];
    } },
];

/* ========================================================================== *
 *  STATIC  (single bake, but built to read at any distance)
 * ========================================================================== */

export const ULTRA_VINYLS_STATIC = [

  { id: 'sakura', name: 'Sakura', grade: 'epic', tags: ['nature'],
    fn: (u, v) => {
      const p = voronoi(u * 13, v * 8, 1);
      const petal = clamp(1 - p.d * 3.4, 0, 1);
      const edge = clamp(1 - Math.abs(p.d - 0.3) * 12, 0, 1);
      return [petal, edge * 0.6, 0];
    } },

  { id: 'koi', name: 'Koi', grade: 'epic', tags: ['animal'],
    fn: (u, v) => {
      const { c } = crownUV(u);
      const body = clamp(1 - Math.hypot(c - 0.22, (v - 0.42) * 1.7) * 7, 0, 1);
      const tail = clamp(1 - Math.hypot(c - 0.34, (v - 0.56) * 1.7) * 10, 0, 1);
      const spot = clamp(1 - Math.hypot(c - 0.18, (v - 0.34) * 1.7) * 13, 0, 1);
      return [body, Math.max(tail, spot), 0];
    } },

  { id: 'howl', name: 'Howl', grade: 'legendary', tags: ['animal'],
    fn: (u, v) => {
      const { c, m } = crownUV(u);
      const moon = clamp(1 - Math.hypot(c + 0.06, (v - 0.30) * 1.1) * 5.0, 0, 1);
      const arc = Math.abs(Math.sin((v * 4 + m * 1.2) * PI));
      const howl = clamp(1 - Math.abs(arc - 0.5) * 6, 0, 1) * clamp((v - 0.35) * 2.4, 0, 1);
      return [howl, moon, 0];
    } },

  { id: 'eaglewing', name: 'Eagle Wing', grade: 'epic', tags: ['animal'],
    fn: (u, v) => {
      const { c, m } = crownUV(u);
      const row = Math.floor(v * 10), off = row % 2 ? 0.5 : 0;
      const fv = v * 10 - row;
      const fu = (Math.abs(c) * 9 + off) % 1;
      const feather = clamp(1 - Math.hypot((fu - 0.5) * 1.5, (fv - 0.15) * 2.0) * 2.6, 0, 1);
      const side = m > 0.15 ? 1 : 0;
      return [feather * side, clamp((feather - 0.7) * 4, 0, 1) * side, 0];
    } },

  { id: 'skullwrap', name: 'Skull Wrap', grade: 'legendary', tags: ['dark'],
    fn: (u, v) => {
      const { c } = crownUV(u);
      const d = Math.hypot(c * 1.1, (v - 0.28) * 1.2);
      const skull = clamp(1 - d * 6.5, 0, 1);
      const eye = (Math.hypot(c - 0.055, (v - 0.26) * 1.2) < 0.045 || Math.hypot(c + 0.055, (v - 0.26) * 1.2) < 0.045) ? 1 : 0;
      const jaw = clamp(1 - Math.abs(d - 0.20) * 16, 0, 1);
      const bone = Math.abs(Math.sin((v * 2.6 + Math.abs(c) * 2.2) * PI)) < 0.12 ? 1 : 0;
      return [Math.max(skull, bone * 0.9), Math.max(eye, jaw * 0.6), 0];
    } },

  { id: 'rosevine', name: 'Rose Vine', grade: 'epic', tags: ['nature'],
    fn: (u, v) => {
      const { c, m } = crownUV(u);
      const vine = Math.abs(Math.sin(v * 5.0 + Math.sin(m * 3) * 0.8));
      const stem = clamp(1 - Math.abs(vine - 0.5) * 8, 0, 1) * clamp(m - 0.05, 0, 1);
      const p = voronoi(u * 10, v * 6, 1);
      const rose = clamp(1 - p.d * 3.2, 0, 1) * (p.id > 0.45 ? 1 : 0);
      return [stem, rose, 0];
    } },

  { id: 'aztec', name: 'Aztec', grade: 'rare', tags: ['art'],
    fn: (u, v) => {
      const { c } = crownUV(u);
      const step = Math.abs(((v * 7) % 1) - 0.5) * 2;
      const zig = Math.abs(((Math.abs(c) * 11) % 1) - 0.5) * 2;
      const s = (step > 0.4 ? 1 : 0) ^ (zig > 0.55 ? 1 : 0);
      return [s, clamp(1 - Math.abs(step - zig) * 4, 0, 1), 0];
    } },

  { id: 'mandala', name: 'Mandala', grade: 'legendary', tags: ['art'],
    fn: (u, v) => {
      const { c } = crownUV(u);
      const r = Math.hypot(c * 1.2, (v - 0.5) * 0.95);
      const rings = Math.abs(((r * 9) % 1) - 0.5) * 2;
      const fine = clamp(1 - Math.abs(((r * 18) % 1) - 0.5) * 8, 0, 1);
      return [rings > 0.55 ? 1 : 0, fine, 0];
    } },

  { id: 'runic', name: 'Runic', grade: 'rare', tags: ['fantasy'],
    fn: (u, v) => {
      const { c, m } = crownUV(u);
      const bm = clamp(1 - Math.abs(m - 0.42) * 7, 0, 1);
      const glyph = hash2(Math.floor(v * 26), Math.floor(Math.abs(c) * 14)) > 0.45 ? 1 : 0;
      return [bm * glyph, bm * glyph * (hash2(Math.floor(v * 26), 3) > 0.6 ? 1 : 0), 0];
    } },

  { id: 'kintsugi', name: 'Kintsugi', grade: 'black market', tags: ['art'],
    fn: (u, v) => {
      const p = voronoi(u * 9, v * 6, 1);
      const crack = clamp(1 - p.edge * 10, 0, 1);
      const branch = clamp(1 - p.edge * 26, 0, 1);
      return [clamp(crack * 0.6 + fbm(u * 20, v * 20, 3) * 0.4, 0, 1), branch, 0];
    } },

  { id: 'circuitry', name: 'Circuitry', grade: 'rare', tags: ['tech'],
    fn: (u, v) => {
      const gx = u * 64, gy = v * 32;
      const cx = Math.floor(gx), cy = Math.floor(gy);
      const r = hash2(cx, cy), fx = gx - cx, fy = gy - cy;
      let t = 0;
      if (r < 0.22) t = band(fy, 0.44, 0.56, 0.04);
      else if (r < 0.40) t = band(fx, 0.44, 0.56, 0.04);
      else if (r < 0.50) t = Math.max(band(fx, 0.42, 0.58, 0.05) * (fy < 0.55 ? 1 : 0), band(fy, 0.42, 0.58, 0.05) * (fx > 0.45 ? 1 : 0));
      const pad = hash2(cx * 3, cy * 7) > 0.93 ? (Math.hypot(fx - 0.5, fy - 0.5) < 0.2 ? 1 : 0) : 0;
      return [t, pad, 0];
    } },

  { id: 'jetstream', name: 'Jet Stream', grade: 'rare', tags: ['racing'],
    fn: (u, v) => {
      const { c } = crownUV(u);
      const k = (Math.abs(c) * 16 + v * 0.6) % 1;
      const len = clamp((v - 0.1) * 1.8, 0, 1);
      return [band(k, 0, 0.3, 0.07) * len, band(k, 0.42, 0.5, 0.03) * len, 0];
    } },

  { id: 'bomber', name: 'Bomber', grade: 'epic', tags: ['racing'],
    fn: (u, v) => {
      const { c } = crownUV(u);
      const d1 = (v * 2.2 + Math.abs(c) * 1.6) % 1;
      const roundel = Math.hypot(c * 1.15, (v - 0.55) * 1.0) < 0.14 ? 1 : 0;
      return [band(d1, 0, 0.34, 0.05), roundel, 0];
    } },

  { id: 'razor', name: 'Razor', grade: 'rare', tags: ['art'],
    fn: (u, v) => {
      const { c } = crownUV(u);
      const blade = Math.abs(((v * 6 + Math.abs(c) * 4) % 1) - 0.5) * 2;
      return [blade > 0.62 ? 1 : 0, clamp(1 - Math.abs(blade - 0.62) * 14, 0, 1), 0];
    } },

  { id: 'viper', name: 'Viper', grade: 'epic', tags: ['animal'],
    fn: (u, v) => {
      const { c } = crownUV(u);
      const cols = 18, rows = 12;
      const row = Math.floor(v * rows), off = row % 2 ? 0.5 : 0;
      const cu = (Math.abs(c) * cols + off) % 1, cv = v * rows - row;
      const dd = Math.abs(cu - 0.5) + Math.abs(cv - 0.5);
      return [dd < 0.45 ? 1 : 0, clamp(1 - Math.abs(dd - 0.45) * 10, 0, 1), 0];
    } },

  { id: 'sunburst', name: 'Sunburst', grade: 'rare', tags: ['art'],
    fn: (u, v) => {
      const { c } = crownUV(u);
      const a = Math.atan2(v - 0.05, c * 1.3);
      return [Math.sin(a * 14) > 0 ? 1 : 0, 0, 0];
    } },

  { id: 'checkerpro', name: 'Checker Pro', grade: 'common', tags: ['racing'],
    fn: (u, v) => [(Math.floor(u * 40) + Math.floor(v * 20)) % 2, 0, 0] },

  { id: 'oceanic', name: 'Oceanic', grade: 'epic', tags: ['nature'],
    fn: (u, v) => {
      const { c } = crownUV(u);
      const w1 = Math.sin(v * 9 + Math.abs(c) * 3) * 0.5 + 0.5;
      const w2 = Math.sin(v * 17 - Math.abs(c) * 5 + 1.4) * 0.5 + 0.5;
      return [w1 > 0.55 ? 1 : 0, w2 > 0.68 ? 1 : 0, 0];
    } },

  { id: 'desertdune', name: 'Desert Dune', grade: 'rare', tags: ['nature'],
    fn: (u, v) => {
      const { m } = crownUV(u);
      const n = fbm(u * 4, v * 9, 4);
      const dune = clamp((n * 1.4 + v * 0.5 - m * 0.3 - 0.4) * 3, 0, 1);
      return [dune, clamp((dune - 0.75) * 4, 0, 1), 0];
    } },

  { id: 'arcticcamo', name: 'Arctic Camo', grade: 'rare', tags: ['camo'],
    fn: (u, v) => {
      const n = fbm(u * 14, v * 9, 4);
      const px = Math.floor(u * 30), py = Math.floor(v * 16);
      const n2 = hash2(px, py) * 0.6 + hash2(px >> 1, py >> 1) * 0.4;
      return [n > 0.52 ? 1 : 0, n2 > 0.66 ? 1 : 0, 0];
    } },

  { id: 'urbancamo', name: 'Urban Camo', grade: 'rare', tags: ['camo'],
    fn: (u, v) => {
      const g = hexGrid(u * 22, v * 11);
      return [g.id > 0.42 ? 1 : 0, g.id > 0.78 ? 1 : 0, 0];
    } },

  { id: 'lavarock', name: 'Lava Rock', grade: 'epic', tags: ['elemental'],
    fn: (u, v) => {
      const p = voronoi(u * 16, v * 10, 1);
      const rock = p.edge < 0.09 ? 1 : 0;
      const hot = clamp(1 - p.edge * 16, 0, 1);
      return [rock, hot, hot * 0.7];
    } },

  { id: 'crystal', name: 'Crystal', grade: 'legendary', tags: ['elemental'],
    fn: (u, v) => {
      const p = voronoi(u * 11, v * 7, 0.7);
      const face = clamp(1 - p.d * 3.0, 0, 1);
      const edge = clamp(1 - p.edge * 14, 0, 1);
      return [face, edge, edge * 0.35];
    } },

  { id: 'honeycomb', name: 'Honeycomb', grade: 'rare', tags: ['nature'],
    fn: (u, v) => {
      const g = hexGrid(u * 30, v * 15);
      const cell = g.d > 0.62 ? 1 : 0;
      return [cell, g.id > 0.7 ? cell : 0, 0];
    } },

  { id: 'graffiti', name: 'Graffiti', grade: 'epic', tags: ['art'],
    fn: (u, v) => {
      const n = fbm(u * 7, v * 7, 5);
      const tag = fbm(u * 22 + 5, v * 22, 4);
      const splat = voronoi(u * 9, v * 6, 1);
      return [clamp((n - 0.45) * 3, 0, 1), clamp((tag - 0.6) * 3, 0, 1), 0];
    } },

  { id: 'splatterpro', name: 'Splatter Pro', grade: 'rare', tags: ['art'],
    fn: (u, v) => {
      const p = voronoi(u * 14, v * 7, 1);
      const wob = fbm(u * 18, v * 18, 3) * 0.22;
      const rad = 0.16 + p.id * 0.3;
      return [p.d + wob < rad ? 1 : 0, p.d + wob < rad * 0.45 ? 1 : 0, 0];
    } },

  { id: 'carbontwill', name: 'Carbon Twill', grade: 'rare', tags: ['tech'],
    fn: (u, v) => {
      const { m } = crownUV(u);
      const w = weave(u, v, 40);
      const zone = m < 0.62 ? 1 : 0;
      return [zone * (w > 0.55 ? 1 : 0), zone * (w > 0.85 ? 1 : 0), 0];
    } },

  { id: 'brushedsteel', name: 'Brushed Steel', grade: 'common', tags: ['tech'],
    fn: (u, v) => {
      const h = fbm(u * 420, v * 3.5, 2) * 0.8 + fbm(u * 1400, v * 2, 1) * 0.2;
      return [h > 0.55 ? 1 : 0, h > 0.8 ? 1 : 0, 0];
    } },

  { id: 'chromelines', name: 'Chrome Lines', grade: 'epic', tags: ['tech'],
    fn: (u, v) => {
      const { c } = crownUV(u);
      const k = (Math.abs(c) * 26) % 1;
      const line = band(k, 0, 0.16, 0.02);
      const sweep = clamp((v - 0.15) * 1.5, 0, 1);
      return [line * sweep, band(k, 0.4, 0.5, 0.02) * sweep, 0];
    } },

  { id: 'stardust', name: 'Stardust', grade: 'legendary', tags: ['space'],
    fn: (u, v) => {
      const n = fbm(u * 8 + 1, v * 8 + 4, 5);
      const star = hash2(Math.floor(u * 380), Math.floor(v * 200)) > 0.995 ? 1 : 0;
      return [clamp((n - 0.42) * 3.2, 0, 1), star, star * 0.9];
    } },

  { id: 'comettail', name: 'Comet Tail', grade: 'epic', tags: ['space'],
    fn: (u, v) => {
      const { c } = crownUV(u);
      const lane = clamp(1 - Math.abs(Math.abs(c) - 0.14) * 16, 0, 1);
      const head = clamp(1 - Math.hypot((Math.abs(c) - 0.14) * 8, (v - 0.14) * 5) * 3, 0, 1);
      const tail = lane * clamp((v - 0.14) * 1.6, 0, 1);
      return [tail, head, head * 0.6];
    } },

  { id: 'pinstripeduo', name: 'Pinstripe Duo', grade: 'common', tags: ['classic'],
    fn: (u) => {
      const { c } = crownUV(u);
      const a = stripe(Math.abs(c), 0.20, 0.005, 0.003) + stripe(Math.abs(c), 0.235, 0.003, 0.002);
      return [0, Math.min(1, a), 0];
    } },

  { id: 'tribalbold', name: 'Tribal Bold', grade: 'epic', tags: ['art'],
    fn: (u, v) => {
      const { m } = crownUV(u);
      const sweep = Math.sin(v * 6.0 + m * 4.2) * 0.5 + 0.5;
      const arm = stripe(sweep, 0.5, 0.16, 0.06);
      const barb = Math.sin(v * 24 + m * 9) * 0.5 + 0.5;
      return [arm * (0.35 + barb * 0.9) > 0.55 ? 1 : 0, arm * (barb > 0.86 ? 1 : 0), 0];
    } },

  { id: 'dragonscale', name: 'Dragon Scale', grade: 'legendary', tags: ['fantasy'],
    fn: (u, v) => {
      const cols = 30, rows = 17;
      const row = Math.floor(v * rows), off = row % 2 ? 0.5 : 0;
      const cu = (u * cols + off) % 1, cv = v * rows - row;
      const d = Math.hypot(cu - 0.5, (cv - 0.15) * 0.85);
      return [d < 0.5 ? 1 : 0, band(d, 0.4, 0.5, 0.03), 0];
    } },

  { id: 'mechapane', name: 'Mecha Panel', grade: 'epic', tags: ['tech'],
    fn: (u, v) => {
      const gx = Math.floor(u * 14), gy = Math.floor(v * 9);
      const fx = (u * 14) % 1, fy = (v * 9) % 1;
      const seam = Math.max(band(fx, 0, 0.05, 0.02), band(fy, 0, 0.05, 0.02));
      const rivet = Math.hypot(fx - 0.12, fy - 0.12) < 0.05 ? 1 : 0;
      const tone = hash2(gx, gy);
      return [seam, Math.max(rivet, tone > 0.8 ? seam : 0), 0];
    } },

  { id: 'wasteland', name: 'Wasteland', grade: 'rare', tags: ['dark'],
    fn: (u, v) => {
      const n = fbm(u * 12, v * 12, 5);
      const rust = voronoi(u * 18, v * 18, 1);
      return [clamp((n - 0.4) * 2.6, 0, 1), clamp(1 - rust.edge * 9, 0, 1) * 0.8, 0];
    } },

  { id: 'origami', name: 'Origami', grade: 'rare', tags: ['art'],
    fn: (u, v) => {
      const cols = 12, rows = 8;
      const cu = (u * cols) % 1, cv = (v * rows) % 1;
      const fold = Math.abs(cu - 0.5) + Math.abs(cv - 0.5);
      return [fold < 0.5 ? 1 : 0, clamp(1 - Math.abs(fold - 0.5) * 9, 0, 1), 0];
    } },

  { id: 'zebra', name: 'Zebra', grade: 'common', tags: ['animal'],
    fn: (u, v) => {
      const { m } = crownUV(u);
      const warp = fbm(v * 3 + 2, m * 2 + 7, 4) * 1.6;
      return [Math.sin(v * 15 + warp * 3.4) > 0.25 ? 1 : 0, 0, 0];
    } },

  { id: 'ripple', name: 'Ripple', grade: 'rare', tags: ['nature'],
    fn: (u, v) => {
      const { c } = crownUV(u);
      const r = Math.hypot(c * 1.2, (v - 0.5) * 1.1);
      const w = Math.sin(r * 26 - fbm(u * 6, v * 6, 3) * 5) * 0.5 + 0.5;
      return [w > 0.6 ? 1 : 0, w > 0.86 ? 1 : 0, 0];
    } },

  { id: 'thorns', name: 'Thorns', grade: 'rare', tags: ['nature'],
    fn: (u, v) => {
      const { c } = crownUV(u);
      const k = (v * 11) % 1;
      const thorn = Math.abs(k - 0.5) * 2;
      const x = clamp(1 - Math.abs(Math.abs(c) - 0.28) * 20, 0, 1);
      return [clamp(1 - thorn * 3, 0, 1) * x, 0, 0];
    } },

  { id: 'mosaic', name: 'Mosaic', grade: 'rare', tags: ['art'],
    fn: (u, v) => {
      const p = voronoi(u * 20, v * 12, 1);
      const tile = clamp(1 - p.d * 3.6, 0, 1);
      return [tile, clamp(1 - Math.abs(p.d - 0.28) * 12, 0, 1), 0];
    } },

  { id: 'camohex', name: 'Hex Camo', grade: 'rare', tags: ['camo'],
    fn: (u, v) => {
      const g = hexGrid(u * 26, v * 13);
      return [g.id > 0.42 ? 1 : 0, g.id > 0.78 ? 1 : 0, 0];
    } },

  { id: 'holobands', name: 'Holo Bands', grade: 'epic', tags: ['neon'],
    fn: (u, v) => {
      const { c } = crownUV(u);
      const k = (v * 18 + Math.abs(c) * 4) % 1;
      return [band(k, 0, 0.35, 0.05), band(k, 0.45, 0.55, 0.03), 0];
    } },

  // id was 'carbonhood', also already taken by the base library. Renamed.
  { id: 'carbonweave', name: 'Carbon Hood', grade: 'common', tags: ['tech'],
    fn: (u, v) => {
      const { m } = crownUV(u);
      const zone = (m < 0.5 ? 1 : 0) * band(v, 0.02, 0.4, 0.03);
      const w = ((Math.floor(u * 260) + Math.floor(v * 130)) % 2) * 0.35;
      return [zone, zone * w, 0];
    } },
];

export const ULTRA_VINYLS = [...ULTRA_VINYLS_ANIMATED, ...ULTRA_VINYLS_STATIC];
export const ULTRA_VINYL_BY_ID = new Map(ULTRA_VINYLS.map(v => [v.id, v]));

/** All decals the gallery can show, base library included. */
export function allVinyls(baseVinyls) {
  return [...baseVinyls, ...ULTRA_VINYLS];
}

export const VINYL_STATS = {
  total: ULTRA_VINYLS.length,
  animated: ULTRA_VINYLS_ANIMATED.length,
  static: ULTRA_VINYLS_STATIC.length,
  glow: ULTRA_VINYLS.filter(v => v.glow).length,
  frames: ULTRA_VINYLS_ANIMATED.reduce((a, v) => a + (v.frames || 1), 0),
};
