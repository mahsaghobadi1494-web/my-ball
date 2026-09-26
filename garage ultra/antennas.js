/* =============================================================================
 * ultra/antennas.js — 12 antennas
 * -----------------------------------------------------------------------------
 * Same authoring frame as the toppers: origin on the roof, +Y up, +Z forward.
 * An antenna is a base cone, a thin shaft and a payload.
 *
 * Every antenna is built TWICE over, as two meshes rather than one:
 *
 *   the mast     base cone + shaft. Bends as a cantilever — the roof end is
 *                clamped, the tip swings.
 *   the payload  everything above SHAFT_TOP. Rides the mast top rigidly: it
 *                translates with the tip and leans by the mast's end slope.
 *
 * The split is what makes the whip read correctly. Applying one displacement
 * field to the whole model would either freeze the payload (if the field
 * saturates at the mast top) or shear it into a parallelogram (if it keeps
 * growing) — a dice or a sword is a rigid object and has to stay one. The two
 * halves are separated by vertex index, not by material: `mast()` records a
 * watermark per slot on the way past, and everything written afterwards is
 * payload. That works because every one of the twelve builds starts with
 * `mast(P)`, and the primitives never straddle the boundary.
 * ===========================================================================*/

import { TAU, PI, Parts, Mesh, rbox, plate, slab, revolveX, torusX, tube } from '../carLibraryPro.js';
import { revolveY, capY, torusY, coneY, sphereY, brim } from './toppers.js';
import { hash2 } from './materials.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;

const BASE_Y = 0.006, SHAFT_TOP = 0.330;

/** Where the shaft leaves the base cone. Below this the mast is clamped. */
export const BEND_BASE = 0.038;
/** How far the tip swings at full load, in metres. Against a 0.29 m mast this
 *  is a 30% deflection — about 24 degrees of lean at the tip. It has to be that
 *  large to read: the antenna is 0.44 m tall on a 2.5 m car, so a "realistic"
 *  couple of centimetres is invisible on screen. */
export const BEND_MAX = 0.095;
/** Spring constants for the whip. omega = sqrt(K) ~ 6.8 rad/s (about 1.1 Hz),
 *  zeta = C / (2 sqrt(K)) ~ 0.55 — underdamped enough to overshoot and ring
 *  after a stab of throttle, damped enough to settle inside a second. */
export const SWAY_K = 46, SWAY_C = 7.5;

/** Shaft segments. A straight `tube()` emits two rings, and two rings cannot
 *  curve — the cubic below would just tilt the shaft as a rigid rod. Eight
 *  rings is where the arc reads as an arc. */
const SHAFT_SEGS = 8;

function at(M, x, y, z, fn) {
  const from = M.count;
  fn();
  M.translate(x, y, z, from);
}

/** Base cone + shaft, shared by every antenna. Also stamps `P.__mast`: the
 *  vertex count of each slot at the moment the mast finished, which is what
 *  buildAntennaRig() splits on. */
function mast(P) {
  const cone = P.get('rubber#141418');
  revolveY(cone, [[BASE_Y, 0.030], [0.026, 0.024], [0.040, 0.012]], 14, true, false);

  const SH = P.get('silver');
  for (let i = 0; i < SHAFT_SEGS; i++) {
    const t0 = i / SHAFT_SEGS, t1 = (i + 1) / SHAFT_SEGS;
    tube(SH, [0, lerp(0.030, SHAFT_TOP, t0), 0], [0, lerp(0.030, SHAFT_TOP, t1), 0],
      lerp(0.008, 0.005, t0), lerp(0.008, 0.005, t1), 8,
      i === 0, i === SHAFT_SEGS - 1);
  }
  sphereY(SH, SHAFT_TOP, 0.008, 10, 5);

  // antennaSlots() drives this with a bare `{get}` stub that has no slot map —
  // it only wants to know which materials are touched.
  if (P.m) {
    const mark = new Map();
    for (const [name, m] of P.m) mark.set(name, m.count);
    P.__mast = mark;
  }
}

/* ========================================================================== *
 *  THE BEND
 * ---------------------------------------------------------------------------
 * A whip is a cantilever: clamped at the roof, free at the tip. Under a side
 * load the true deflection curve is
 *
 *     w(s) = (3s^2 - s^3) / 2        s = 0 at the root, 1 at the top of the mast
 *
 * which satisfies w(0) = 0 and w'(0) = 0 — the foot neither moves nor tilts.
 * That is exactly the "moves from the tip, base stays put" behaviour: at the
 * bottom the weight and the slope both vanish, and they grow quadratically
 * upward. The tip deflection is D and the end slope is 1.5 D / L.
 *
 * A cubic s^3 would also pass through the ends but starts with a finite slope,
 * so the whole mast would hinge at the roof instead of curving out of it.
 * ========================================================================== */

export function cantilever(s) {
  if (s <= 0) return 0;
  if (s >= 1) return 1;
  return (3 * s * s - s * s * s) * 0.5;
}

/** Split one Mesh into the triangles wholly below `mark` and the rest. */
function splitMesh(src, mark) {
  const lo = new Mesh(), hi = new Mesh();
  const { p, n, t, idx } = src;
  const put = (dst, i) => dst.vert(
    p[i * 3], p[i * 3 + 1], p[i * 3 + 2],
    n[i * 3], n[i * 3 + 1], n[i * 3 + 2],
    t[i * 2], t[i * 2 + 1]);
  for (let k = 0; k < idx.length; k += 3) {
    const a = idx[k], b = idx[k + 1], c = idx[k + 2];
    const dst = (a < mark && b < mark && c < mark) ? lo : hi;
    dst.tri(put(dst, a), put(dst, b), put(dst, c));
  }
  return { lo, hi };
}

/** Build an antenna as `{ mast, payload }`. Slots are the same in both, so the
 *  material bag from antennaSlots() feeds either. */
export function buildAntennaRig(spec, quality = 'high') {
  const P = new Parts();
  spec.build(P, quality === 'low' ? 0.6 : quality === 'med' ? 0.8 : 1);
  const mark = P.__mast || new Map();
  const mast = new Parts(), payload = new Parts();
  for (const [name, m] of P.m) {
    const { lo, hi } = splitMesh(m, mark.get(name) || 0);
    if (lo.count) mast.set(name, lo);
    if (hi.count) payload.set(name, hi);
  }
  return { mast, payload, top: SHAFT_TOP, base: BEND_BASE };
}

/**
 * Cache the rest positions and per-vertex bend weight for a built mast, so the
 * per-frame step is a multiply-add over a flat Float32Array and nothing else.
 */
export function bindMast(group, base = BEND_BASE, top = SHAFT_TOP) {
  const L = Math.max(1e-4, top - base);
  const meshes = [];
  group.traverse((o) => { if (o.isMesh && o.geometry) meshes.push(o); });
  for (const m of meshes) {
    const pos = m.geometry.getAttribute('position');
    const rest = new Float32Array(pos.array);
    const w = new Float32Array(pos.count);
    for (let i = 0; i < pos.count; i++) w[i] = cantilever((rest[i * 3 + 1] - base) / L);
    m.geometry.userData.rest = rest;
    m.geometry.userData.w = w;
    // The deformed positions leave the rest bounding sphere behind, and a
    // frustum cull against a stale sphere can drop the antenna mid-swing.
    m.frustumCulled = false;
  }
  return { meshes, L, base, top };
}

/**
 * Drive the whip one frame.
 *
 * `loadX` / `loadZ` are the normalised side load, roughly -1.5 .. 1.5; -Z is a
 * backward push, which is what accelerating does to a mast on the roof.
 * Returns the bend vector so a caller can read it back.
 */
export function stepSway(state, dt, loadX, loadZ) {
  const K = SWAY_K, C = SWAY_C;
  state.vx += ((loadX * BEND_MAX - state.x) * K - state.vx * C) * dt;
  state.vz += ((loadZ * BEND_MAX - state.z) * K - state.vz * C) * dt;
  state.x += state.vx * dt;
  state.z += state.vz * dt;
  return state;
}

export function makeSway() { return { x: 0, z: 0, vx: 0, vz: 0 }; }

/**
 * Write the current bend into the built geometry.
 *
 * `pivot` is a Group sitting at (0, SHAFT_TOP, 0) with the payload parented to
 * it at y = -SHAFT_TOP, so a rotation about the pivot turns the payload about
 * the mast top rather than about the roof.
 */
export function poseAntenna(rig, sway, pivot) {
  const dx = sway.x, dz = sway.z;
  for (const m of rig.meshes) {
    const pos = m.geometry.getAttribute('position');
    const rest = m.geometry.userData.rest, w = m.geometry.userData.w;
    const arr = pos.array;
    for (let i = 0; i < w.length; i++) {
      const k = w[i];
      arr[i * 3] = rest[i * 3] + dx * k;
      arr[i * 3 + 1] = rest[i * 3 + 1];
      arr[i * 3 + 2] = rest[i * 3 + 2] + dz * k;
    }
    pos.needsUpdate = true;
  }
  if (!pivot) return;
  // The mast top has moved by (dx, dz) and its tangent there has slope
  // 1.5 D / L, so the payload rides across AND leans by that angle.
  //
  // The pivot must stay at its own height: it is the hinge, and dropping it to
  // y = 0 would swing the payload about the roof instead of about the mast top.
  pivot.position.set(dx, rig.top, dz);
  pivot.rotation.x = Math.atan2(1.5 * dz, rig.L);
  pivot.rotation.z = -Math.atan2(1.5 * dx, rig.L);
}

/** Flat extruded star, for the star antenna. */
function starPrism(M, y, rOut, rIn, points, thick) {
  const from = M.count;
  for (let layer = 0; layer < 2; layer++) {
    const yy = y + (layer ? thick : -thick);
    const c = M.vert(0, yy, 0, 0, layer ? 1 : -1, 0, 0.5, 0.5);
    const ids = [];
    for (let i = 0; i < points * 2; i++) {
      const a = (i / (points * 2)) * TAU - PI / 2;
      const r = i % 2 ? rIn : rOut;
      ids.push(M.vert(Math.cos(a) * r, yy, Math.sin(a) * r, 0, layer ? 1 : -1, 0, 0.5 + Math.cos(a) * 0.5, 0.5 + Math.sin(a) * 0.5));
    }
    for (let i = 0; i < points * 2; i++) {
      const j = (i + 1) % (points * 2);
      layer ? M.tri(c, ids[j], ids[i]) : M.tri(c, ids[i], ids[j]);
    }
  }
  // Rim winding matters. Stepping (bottom-i -> bottom-j -> top-j -> top-i)
  // makes AB x BC point at the axis, so the wall faced inward: the outer star
  // survived on the cap contributions alone and the inner one came out with a
  // negative signed volume. Going bottom-i -> top-i -> top-j -> bottom-j puts
  // the normal on the outside.
  const rimStart = from + points * 2 + 2;
  for (let i = 0; i < points * 2; i++) {
    const j = (i + 1) % (points * 2);
    M.quad(from + 1 + i, rimStart + i, rimStart + j, from + 1 + j);
  }
  M.smooth(from);
}

export const ANTENNAS = [

  { id: 'a_flag', name: 'Checkered Flag', grade: 'rare', anim: 'sway', tags: ['sport'],
    build: (P) => {
      mast(P);
      tube(P.get('silver'), [0, SHAFT_TOP - 0.02, 0], [0, SHAFT_TOP + 0.130, 0], 0.005, 0.004, 6, false, true);
      const W = P.get('fwhite'), B = P.get('fblack');
      const cols = 6, rows = 3, w = 0.130, h = 0.078;
      for (let layer = 0; layer < 2; layer++) {
        const M = layer ? B : W;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const isBlack = (r + c) % 2 === 1;
            const T = isBlack ? B : W;
            if ((layer === 0) !== !isBlack) continue;
            const x0 = 0.012 + (c / cols) * w, x1 = 0.012 + ((c + 1) / cols) * w;
            const y0 = SHAFT_TOP + 0.126 - (r / rows) * h, y1 = SHAFT_TOP + 0.126 - ((r + 1) / rows) * h;
            const wave = (xx) => Math.sin((xx - 0.012) * 22 + r * 1.2) * 0.008 * ((xx - 0.012) / w);
            const from = T.count;
            const p = (x, y, z) => T.vert(x, y + wave(x), z, layer ? 0 : 0, 0, layer ? 1 : -1, (x - 0.012) / w, (SHAFT_TOP + 0.126 - y) / h);
            const a = p(x0, y0, 0), b = p(x1, y0, 0), c2 = p(x1, y1, 0), d = p(x0, y1, 0);
            layer ? T.quad(a, d, c2, b) : T.quad(a, b, c2, d);
          }
        }
      }
    } },

  { id: 'a_balloon', name: 'Balloon', grade: 'common', anim: 'sway', tags: ['party'],
    build: (P) => {
      mast(P);
      tube(P.get('fwhite'), [0, SHAFT_TOP - 0.02, 0], [0.010, SHAFT_TOP + 0.090, 0.006], 0.0022, 0.0022, 5);
      const B = P.get('candy#e83a5a');
      sphereY(B, SHAFT_TOP + 0.156, 0.062, 20, 11, 0.074);
      revolveY(B, [[SHAFT_TOP + 0.088, 0.012], [SHAFT_TOP + 0.076, 0.004]], 10, true, false);
      at(P.get('glow#ffd6de'), 0.018, SHAFT_TOP + 0.196, 0.040, () => sphereY(P.get('glow#ffd6de'), 0, 0.012, 8, 4));
    } },

  { id: 'a_lollipop', name: 'Lollipop', grade: 'common', anim: 'sway', tags: ['food'],
    build: (P) => {
      mast(P);
      tube(P.get('fwhite'), [0, SHAFT_TOP - 0.02, 0], [0, SHAFT_TOP + 0.080, 0], 0.005, 0.005, 8);
      revolveY(P.get('candy#f04a8a'), [[SHAFT_TOP + 0.078, 0.052], [SHAFT_TOP + 0.120, 0.074], [SHAFT_TOP + 0.166, 0.052]], 22, true, true);
      const S = P.get('fwhite');
      for (let i = 0; i < 7; i++) {
        const a = i * 1.4, t = i / 7;
        const rr = lerp(0.010, 0.058, t), yy = SHAFT_TOP + 0.086 + t * 0.070;
        at(S, Math.cos(a) * rr, yy, Math.sin(a) * rr, () => sphereY(S, 0, 0.008, 6, 3, 0.004));
      }
      revolveY(P.get('candy#f04a8a'), [[SHAFT_TOP + 0.166, 0.020], [SHAFT_TOP + 0.176, 0.006]], 12, true, false);
    } },

  { id: 'a_palm', name: 'Palm Tree', grade: 'epic', anim: 'sway', tags: ['nature'],
    build: (P) => {
      mast(P);
      const T = P.get('wood#8a6236');
      const pts = [];
      for (let i = 0; i <= 5; i++) {
        const t = i / 5;
        pts.push([Math.sin(t * 1.1) * 0.020, SHAFT_TOP - 0.01 + t * 0.170, 0]);
      }
      for (let i = 0; i < pts.length - 1; i++)
        tube(T, pts[i], pts[i + 1], lerp(0.014, 0.008, i / 4), lerp(0.013, 0.007, (i + 1) / 4), 8);
      const L = P.get('moss#3f8a3a'), top = pts[pts.length - 1];
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * TAU;
        const from = L.count;
        for (let k = 0; k <= 5; k++) {
          const t = k / 5;
          const rr = t * 0.115, yy = top[1] + 0.030 - t * t * 0.075;
          const x = top[0] + Math.cos(a) * rr, z = Math.sin(a) * rr;
          const w = lerp(0.006, 0.030, t);
          L.vert(x, yy, z - w, 0, 1, 0, t, 0);
          L.vert(x, yy, z + w, 0, 1, 0, t, 1);
        }
        for (let k = 0; k < 5; k++) L.quad(from + k * 2, from + k * 2 + 1, from + (k + 1) * 2 + 1, from + (k + 1) * 2);
        L.smooth(from);
      }
      at(P.get('brown'), top[0] + 0.020, top[1] + 0.010, 0.018, () => sphereY(P.get('brown'), 0, 0.016, 10, 5, 0.012));
      at(P.get('brown'), top[0] - 0.014, top[1] + 0.004, -0.016, () => sphereY(P.get('brown'), 0, 0.014, 10, 5, 0.010));
    } },

  { id: 'a_popsicle', name: 'Popsicle', grade: 'common', anim: 'sway', tags: ['food'],
    build: (P) => {
      mast(P);
      tube(P.get('wood#c8a878'), [0, SHAFT_TOP - 0.02, 0], [0, SHAFT_TOP + 0.090, 0], 0.008, 0.008, 8, true, true);
      rbox(P.get('candy#3ad0f0'), 0, SHAFT_TOP + 0.148, 0, 0.044, 0.062, 0.012, 0.014, 5);
      rbox(P.get('candy#f06a3a'), 0, SHAFT_TOP + 0.148, 0, 0.024, 0.034, 0.0135, 0.008, 5);
      rbox(P.get('porcelain#f4f2ec'), 0, SHAFT_TOP + 0.176, 0, 0.008, 0.008, 0.014, 0.003, 3);
    } },

  { id: 'a_rocket', name: 'Mini Rocket', grade: 'epic', anim: 'sway', tags: ['space'],
    build: (P) => {
      mast(P);
      const R = P.get('porcelain#f2f0ea');
      revolveY(R, [[SHAFT_TOP + 0.040, 0.020], [SHAFT_TOP + 0.070, 0.034], [SHAFT_TOP + 0.160, 0.034], [SHAFT_TOP + 0.196, 0.0]], 16, true, false);
      revolveY(P.get('red'), [[SHAFT_TOP + 0.168, 0.036], [SHAFT_TOP + 0.190, 0.022]], 16, true, false);
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * TAU;
        const F = P.get('red'), from = F.count;
        for (let k = 0; k <= 3; k++) {
          const t = k / 3;
          F.vert(Math.cos(a) * (0.034 + t * 0.038), SHAFT_TOP + 0.070 - t * 0.030, Math.sin(a) * (0.034 + t * 0.038), 0, 1, 0, t, 0);
          F.vert(Math.cos(a + 0.5) * (0.034 + t * 0.038), SHAFT_TOP + 0.070 - t * 0.030, Math.sin(a + 0.5) * (0.034 + t * 0.038), 0, 1, 0, t, 1);
        }
        for (let k = 0; k < 3; k++) F.quad(from + k * 2, from + k * 2 + 1, from + (k + 1) * 2 + 1, from + (k + 1) * 2);
        F.smooth(from);
      }
      revolveY(P.get('glow#ff8a3a'), [[SHAFT_TOP + 0.030, 0.016], [SHAFT_TOP + 0.014, 0.022]], 14, true, true);
      at(P.get('glass#8fd8ff'), 0, SHAFT_TOP + 0.152, 0.030, () => sphereY(P.get('glass#8fd8ff'), 0, 0.014, 10, 5));
    } },

  { id: 'a_soccer', name: 'Soccer Ball', grade: 'rare', anim: 'sway', tags: ['sport'],
    build: (P) => {
      mast(P);
      const W = P.get('porcelain#f6f6f2');
      sphereY(W, SHAFT_TOP + 0.096, 0.062, 22, 11);
      const B = P.get('fblack');
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * TAU;
        const yy = SHAFT_TOP + 0.096 + (i % 2 ? 0.030 : -0.020);
        const rr = 0.058;
        at(B, Math.cos(a) * rr, yy, Math.sin(a) * rr, () => sphereY(B, 0, 0.020, 10, 5, 0.010));
      }
      at(B, 0, SHAFT_TOP + 0.096 + 0.058, 0, () => sphereY(B, 0, 0.020, 10, 5, 0.010));
      at(B, 0, SHAFT_TOP + 0.096 - 0.056, 0, () => sphereY(B, 0, 0.018, 10, 5, 0.010));
    } },

  { id: 'a_dice', name: 'Lucky Dice', grade: 'rare', anim: 'sway', tags: ['toy'],
    build: (P) => {
      mast(P);
      const W = P.get('porcelain#f6f4ee');
      rbox(W, 0, SHAFT_TOP + 0.092, 0, 0.056, 0.056, 0.056, 0.012, 4);
      const B = P.get('fblack');
      const face = (n, fx, fy, fz) => {
        const pats = { 1: [[0, 0]], 2: [[-0.026, -0.026], [0.026, 0.026]], 3: [[-0.026, -0.026], [0, 0], [0.026, 0.026]],
          4: [[-0.026, -0.026], [-0.026, 0.026], [0.026, -0.026], [0.026, 0.026]],
          5: [[-0.026, -0.026], [-0.026, 0.026], [0, 0], [0.026, -0.026], [0.026, 0.026]],
          6: [[-0.026, -0.030], [-0.026, 0], [-0.026, 0.030], [0.026, -0.030], [0.026, 0], [0.026, 0.030]] };
        for (const [u, v] of pats[n]) {
          const x = fx ? fx * 0.058 : u, y = SHAFT_TOP + 0.092 + (fy ? fy * 0.058 : u), z = fz ? fz * 0.058 : (fy ? u : v);
          rbox(B, fx ? x : (fy ? u : v), fy ? y : (fx ? u : SHAFT_TOP + 0.092 + v), fz ? z : (fx ? u : v), 0.010, 0.010, 0.010, 0.004, 3);
        }
      };
      // top(1), bottom(6), +z(3), -z(4), +x(5), -x(2)
      for (const [u, v] of [[0, 0]]) rbox(B, u, SHAFT_TOP + 0.152, v, 0.010, 0.010, 0.010, 0.004, 3);
      for (const [u, v] of [[-0.026, -0.030], [-0.026, 0], [-0.026, 0.030], [0.026, -0.030], [0.026, 0], [0.026, 0.030]])
        rbox(B, u, SHAFT_TOP + 0.032, v, 0.009, 0.009, 0.009, 0.003, 3);
      for (const [u, v] of [[-0.026, -0.026], [0, 0], [0.026, 0.026]])
        rbox(B, u, SHAFT_TOP + 0.092 + v, 0.060, 0.009, 0.009, 0.009, 0.003, 3);
      for (const [u, v] of [[-0.026, -0.026], [-0.026, 0.026], [0.026, -0.026], [0.026, 0.026]])
        rbox(B, u, SHAFT_TOP + 0.092 + v, -0.060, 0.009, 0.009, 0.009, 0.003, 3);
      for (const [u, v] of [[-0.026, -0.026], [-0.026, 0.026], [0, 0], [0.026, -0.026], [0.026, 0.026]])
        rbox(B, 0.060, SHAFT_TOP + 0.092 + v, u, 0.009, 0.009, 0.009, 0.003, 3);
      for (const [u, v] of [[-0.026, -0.026], [0.026, 0.026]])
        rbox(B, -0.060, SHAFT_TOP + 0.092 + v, u, 0.009, 0.009, 0.009, 0.003, 3);
    } },

  { id: 'a_star', name: 'Star', grade: 'legendary', anim: 'spin', tags: ['space'],
    build: (P) => {
      mast(P);
      tube(P.get('gold'), [0, SHAFT_TOP - 0.02, 0], [0, SHAFT_TOP + 0.060, 0], 0.005, 0.004, 6, false, true);
      starPrism(P.get('gold'), SHAFT_TOP + 0.132, 0.070, 0.030, 5, 0.011);
      starPrism(P.get('glow#ffe9a0'), SHAFT_TOP + 0.132, 0.052, 0.022, 5, 0.013);
    } },

  { id: 'a_umbrella', name: 'Umbrella', grade: 'rare', anim: 'sway', tags: ['nature'],
    build: (P) => {
      mast(P);
      const R = P.get('red');
      tube(P.get('silver'), [0, SHAFT_TOP - 0.02, 0], [0, SHAFT_TOP + 0.140, 0], 0.004, 0.004, 6, false, true);
      const from = R.count;
      for (let i = 0; i <= 16; i++) {
        const t = i / 16, a = t * TAU;
        const rr = 0.098 * Math.sin(Math.min(1, t * 1.0) * PI);
        R.vert(Math.cos(a) * rr, SHAFT_TOP + 0.128 - Math.sin(t * PI) * 0.010, Math.sin(a) * rr, 0, 1, 0, t, 0);
        R.vert(Math.cos(a) * rr * 0.06, SHAFT_TOP + 0.058, Math.sin(a) * rr * 0.06, 0, -1, 0, t, 1);
      }
      for (let i = 0; i < 16; i++) R.quad(from + i * 2, from + i * 2 + 1, from + (i + 1) * 2 + 1, from + (i + 1) * 2);
      R.smooth(from);
      const W = P.get('fwhite');
      for (let i = 0; i < 16; i += 2) {
        const t0 = i / 16, t1 = (i + 1) / 16;
        const a0 = t0 * TAU, a1 = t1 * TAU;
        const r0 = 0.098 * Math.sin(t0 * PI), r1 = 0.098 * Math.sin(t1 * PI);
        plate(W, [Math.cos(a0) * r0, SHAFT_TOP + 0.128, Math.sin(a0) * r0],
          [Math.cos(a1) * r1, SHAFT_TOP + 0.128, Math.sin(a1) * r1],
          [Math.cos(a1) * r1 * 0.06, SHAFT_TOP + 0.058, Math.sin(a1) * r1 * 0.06],
          [Math.cos(a0) * r0 * 0.06, SHAFT_TOP + 0.058, Math.sin(a0) * r0 * 0.06]);
      }
      revolveY(P.get('gold'), [[SHAFT_TOP + 0.140, 0.008], [SHAFT_TOP + 0.156, 0.004]], 8, true, false);
      torusY(P.get('gold'), SHAFT_TOP + 0.056, 0.007, 0.004, 10, 5);
    } },

  { id: 'a_sword', name: 'Mini Sword', grade: 'epic', anim: 'sway', tags: ['warrior'],
    build: (P) => {
      mast(P);
      const B = P.get('silver');
      tube(P.get('leather#3a2418'), [0, SHAFT_TOP - 0.020, 0], [0, SHAFT_TOP + 0.048, 0], 0.011, 0.011, 10, true, true);
      rbox(P.get('gold'), 0, SHAFT_TOP + 0.058, 0, 0.052, 0.009, 0.014, 0.004, 3);
      const from = B.count;
      for (let i = 0; i <= 6; i++) {
        const t = i / 6, yy = SHAFT_TOP + 0.068 + t * 0.112, w = lerp(0.013, 0.002, t), th = lerp(0.006, 0.002, t);
        B.vert(-w, yy, th, 0, 0, 1, t, 0); B.vert(w, yy, th, 0, 0, 1, t, 1);
        B.vert(-w, yy, -th, 0, 0, -1, t, 0); B.vert(w, yy, -th, 0, 0, -1, t, 1);
      }
      for (let i = 0; i < 6; i++) {
        const a = from + i * 4;
        B.quad(a, a + 1, a + 5, a + 4);
        B.quad(a + 2, a + 6, a + 7, a + 3);
        B.quad(a, a + 4, a + 6, a + 2);
        B.quad(a + 1, a + 3, a + 7, a + 5);
      }
      B.smooth(from);
      revolveY(P.get('gold'), [[SHAFT_TOP + 0.048, 0.014], [SHAFT_TOP + 0.038, 0.008]], 10, true, false);
    } },

  { id: 'a_mine', name: 'Sea Mine', grade: 'legendary', anim: 'sway', tags: ['nautical'],
    build: (P) => {
      mast(P);
      const M = P.get('obsidian#1a1c22');
      sphereY(M, SHAFT_TOP + 0.098, 0.058, 20, 10);
      for (let ring = 0; ring < 3; ring++) {
        const lat = -0.5 + ring * 0.5;
        const n = ring === 1 ? 8 : 6;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * TAU + ring * 0.3;
          const rr = 0.056 * Math.cos(lat * 1.1);
          const yy = SHAFT_TOP + 0.098 + 0.056 * Math.sin(lat * 1.1);
          const dir = [Math.cos(a) * Math.cos(lat * 1.1), Math.sin(lat * 1.1), Math.sin(a) * Math.cos(lat * 1.1)];
          tube(P.get('silver'), [Math.cos(a) * rr, yy, Math.sin(a) * rr],
            [Math.cos(a) * rr + dir[0] * 0.036, yy + dir[1] * 0.036, Math.sin(a) * rr + dir[2] * 0.036], 0.007, 0.003, 6);
        }
      }
      torusY(P.get('rust#8a5a2a'), SHAFT_TOP + 0.098, 0.058, 0.006, 20, 6);
      at(P.get('glow#ff4a3a'), 0, SHAFT_TOP + 0.152, 0, () => sphereY(P.get('glow#ff4a3a'), 0, 0.010, 8, 4));
    } },
];

export const ANTENNA_BY_ID = new Map(ANTENNAS.map(a => [a.id, a]));

export function buildAntenna(spec, quality = 'high') {
  const P = new Parts();
  spec.build(P, quality === 'low' ? 0.6 : quality === 'med' ? 0.8 : 1);
  return P;
}

/** Slots an antenna needs. Not wrapped in try/catch — see topperSlots(). */
export function antennaSlots(spec) {
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

export const ANTENNA_STATS = { total: ANTENNAS.length };
