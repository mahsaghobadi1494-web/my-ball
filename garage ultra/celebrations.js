/* =============================================================================
 * ultra/celebrations.js — 26 goal explosions built from REAL 3D OBJECTS
 * -----------------------------------------------------------------------------
 * The old celebration list was a name, a duration and a number. Nothing was
 * ever spawned; the "effect" was a coloured particle spray. That is a firework
 * display, not a goal explosion.
 *
 * Everything here is a physics-lite object system:
 *
 *   OBJECT  — a real mesh (donut, beach ball, turtle, dragon, gear, skull...)
 *             with velocity, gravity, spin, squash, bounce and a lifetime
 *   TRAIL   — a ribbon of geometry streaming behind the object, additive,
 *             tapering and fading to black. This is what makes a flying donut
 *             drag a rainbow behind it instead of just moving.
 *   BURST   — additive point sparks for the pop, separate from the objects
 *   SHOCK   — an expanding ground ring
 *   FLASH   — a point light that decays fast, plus a shake value the camera
 *             reads
 *
 * A celebration is authored as a `build(E)` function using the E.* helpers, so
 * adding a 27th is ten lines, not a new file.
 * ===========================================================================*/

import {
  TAU, PI, Mesh, Parts, rbox, plate, slab, revolveX, washerX, torusX, spoke, tube,
} from '../carLibraryPro.js';
import { revolveY, torusY, capY, coneY, sphereY, brim } from './toppers.js';
import { hash2, fbm } from './materials.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[(Math.random() * arr.length) | 0];

/* ========================================================================== *
 *  GEOMETRY LIBRARY
 * ========================================================================== */

function meshGeo(T, m) {
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(m.p, 3));
  g.setAttribute('normal', new T.Float32BufferAttribute(m.n, 3));
  g.setAttribute('uv', new T.Float32BufferAttribute(m.t, 2));
  g.setIndex(m.count > 65535 ? new T.Uint32BufferAttribute(m.idx, 1) : new T.Uint16BufferAttribute(m.idx, 1));
  g.computeBoundingSphere();
  return g;
}

/** Deterministic lumpiness so every rock is the same rock (cache-friendly). */
function lump(M, amp, seed) {
  for (let i = 0; i < M.count; i++) {
    const x = M.p[i * 3], y = M.p[i * 3 + 1], z = M.p[i * 3 + 2];
    const l = Math.hypot(x, y, z) || 1;
    const k = 1 + (fbm(x * 3 + seed, y * 3 + z * 2 + seed, 3) - 0.5) * amp;
    M.p[i * 3] = x / l * l * k; M.p[i * 3 + 1] = y / l * l * k; M.p[i * 3 + 2] = z / l * l * k;
  }
}

const OBJ = {
  donut: () => {
    const P = new Parts(), M = P.get('m');
    torusY(M, 0, 0.075, 0.038, 22, 10);
    return P;
  },
  ball: () => {
    const P = new Parts(), M = P.get('m');
    sphereY(M, 0, 0.085, 20, 10);
    return P;
  },
  beachball: () => {
    const P = new Parts(), A = P.get('a'), B = P.get('b');
    for (let i = 0; i < 3; i++) {
      const from = (i % 2 ? B : A).count;
      const T = (i % 2 ? B : A);
      const prof = [];
      for (let k = 0; k <= 12; k++) {
        const a2 = (1 - k / 12) * PI;
        prof.push([Math.cos(a2) * 0.085, Math.sin(a2) * 0.085]);
      }
      revolveY(T, prof, 20);
      // squash the panel into a wedge and rotate it around
      for (let k = from; k < T.count; k++) {
        const px = T.p[k * 3], pz = T.p[k * 3 + 2];
        const ang = Math.atan2(pz, px);
        const band = Math.cos(ang * 3);
        T.p[k * 3] = px * (band > 0 ? 1 : 0.998);
      }
    }
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * PI * 2;
      const M = P.get('c');
      const from = M.count;
      for (let k = 0; k <= 12; k++) {
        const a2 = (1 - k / 12) * PI;
        const rr = Math.sin(a2) * 0.085;
        for (let s = -1; s <= 1; s += 2) {
          M.vert(Math.cos(a + s * 0.5) * rr, Math.cos(a2) * 0.085, Math.sin(a + s * 0.5) * rr, 0, 0, 1, k / 12, s > 0 ? 1 : 0);
        }
      }
      for (let k = 0; k < 12; k++) M.quad(from + k * 2, from + k * 2 + 1, from + (k + 1) * 2 + 1, from + (k + 1) * 2);
    }
    return P;
  },
  shell: () => {
    const P = new Parts(), M = P.get('m');
    sphereY(M, 0, 0.062, 16, 8);
    tube(M, [0, 0.058, 0], [0, 0.098, 0], 0.026, 0.012, 10);
    tube(P.get('a'), [0, 0.098, 0], [0, 0.132, 0], 0.010, 0.002, 8);
    return P;
  },
  rock: () => {
    const P = new Parts(), M = P.get('m');
    sphereY(M, 0, 0.085, 14, 8);
    lump(M, 0.55, 3.1);
    return P;
  },
  confetti: () => {
    const P = new Parts(), M = P.get('m');
    const from = M.count;
    const w = 0.030, h = 0.022, bend = 0.010;
    for (let i = 0; i <= 4; i++) {
      const t = i / 4;
      const y = lerp(-h, h, t);
      M.vert(-w, y, Math.sin(t * PI) * bend, 0, 0, 1, 0, t);
      M.vert(w, y, Math.sin(t * PI) * bend, 0, 0, 1, 1, t);
    }
    for (let i = 0; i < 4; i++) M.quad(from + i * 2, from + i * 2 + 1, from + (i + 1) * 2 + 1, from + (i + 1) * 2);
    return P;
  },
  balloon: () => {
    const P = new Parts(), M = P.get('m');
    sphereY(M, 0, 0.070, 18, 9, 0.086);
    revolveY(M, [[-0.086, 0.012], [-0.100, 0.004]], 8, true, false);
    return P;
  },
  turtle: () => {
    const P = new Parts(), S = P.get('m'), B = P.get('a');
    for (let i = 0; i <= 8; i++) {
      const a = (i / 8) * PI * 0.5;
      const prof = [[Math.sin(a) * 0.055, Math.cos(a) * 0.075]];
      revolveY(S, [[Math.sin(a) * 0.055, Math.cos(a) * 0.075], [Math.sin(a) * 0.055 + 0.004, Math.cos(a) * 0.075 * 0.98]], 18);
    }
    revolveY(S, [[0.000, 0.075], [0.055, 0.062]], 18, true, false);
    tube(B, [0, 0.030, 0.062], [0, 0.036, 0.108], 0.026, 0.020, 10);
    sphereY(B, 0.036, 0.022, 10, 5);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      tube(B, [sx * 0.052, 0.012, sz * 0.042], [sx * 0.088, 0.006, sz * 0.062], 0.016, 0.010, 8);
    }
    tube(B, [0, 0.014, -0.070], [0, 0.014, -0.098], 0.010, 0.005, 8);
    return P;
  },
  snowflake: () => {
    const P = new Parts(), M = P.get('m');
    const from = M.count;
    const arms = 6, rOut = 0.070, rIn = 0.026, th = 0.006;
    for (let layer = 0; layer < 2; layer++) {
      const yy = layer ? th : -th;
      const c = M.vert(0, yy, 0, 0, layer ? 1 : -1, 0, 0.5, 0.5);
      const ids = [];
      for (let i = 0; i < arms * 2; i++) {
        const a = (i / (arms * 2)) * TAU;
        const r = i % 2 ? rIn : rOut;
        ids.push(M.vert(Math.cos(a) * r, yy, Math.sin(a) * r, 0, layer ? 1 : -1, 0, 0.5 + Math.cos(a) * 0.5, 0.5 + Math.sin(a) * 0.5));
      }
      for (let i = 0; i < arms * 2; i++) {
        const j = (i + 1) % (arms * 2);
        layer ? M.tri(c, ids[j], ids[i]) : M.tri(c, ids[i], ids[j]);
      }
    }
    const rim = from + 1 + arms * 4 + 1;
    for (let i = 0; i < arms * 2; i++) {
      const j = (i + 1) % (arms * 2);
      M.quad(from + 1 + i, from + 1 + j, rim + j, rim + i);
    }
    M.smooth(from);
    return P;
  },
  flame: () => {
    const P = new Parts(), M = P.get('m');
    const prof = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      prof.push([-0.070 + t * 0.150, 0.052 * Math.sin(t * PI * 0.92) * (1 - t * 0.25)]);
    }
    revolveY(M, prof, 16, true, false);
    return P;
  },
  dragon: () => {
    const P = new Parts(), M = P.get('m'), W = P.get('a');
    const pts = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      pts.push([0, Math.sin(t * PI) * 0.045, -t * 0.240]);
    }
    for (let i = 0; i < pts.length - 1; i++)
      tube(M, pts[i], pts[i + 1], lerp(0.040, 0.008, i / 7), lerp(0.038, 0.006, (i + 1) / 7), 10);
    tube(M, [0, 0.010, 0.036], [0, 0.030, 0.086], 0.030, 0.022, 10);
    rbox(M, 0, 0.030, 0.108, 0.026, 0.020, 0.034, 0.010, 3);
    for (const s of [-1, 1]) {
      const from = W.count;
      for (let k = 0; k <= 4; k++) {
        const t = k / 4;
        W.vert(s * t * 0.130, 0.030 + Math.sin(t * PI) * 0.030, 0.020 - t * 0.090, 0, 1, 0, t, 0);
        W.vert(s * t * 0.130, 0.030 + Math.sin(t * PI) * 0.030, 0.020 - t * 0.090, 0, 1, 0, t, 1);
        W.p[(W.count - 1) * 3 + 1] -= 0.010;
        W.p[(W.count - 1) * 3 + 2] -= 0.014;
      }
      for (let k = 0; k < 4; k++) W.quad(from + k * 2, from + k * 2 + 1, from + (k + 1) * 2 + 1, from + (k + 1) * 2);
      W.smooth(from);
    }
    for (const s of [-1, 1]) tube(P.get('b'), [s * 0.020, 0.048, 0.100], [s * 0.045, 0.070, 0.058], 0.008, 0.003, 6);
    return P;
  },
  atom: () => {
    const P = new Parts(), M = P.get('m'), R = P.get('a');
    sphereY(M, 0, 0.032, 14, 7);
    for (let i = 0; i < 3; i++) {
      const from = R.count;
      torusX(R, 0, 0.080, 0.006, 22, 6);
      // rotate the ring about Y and tilt it
      const ang = (i / 3) * PI, tilt = 0.9;
      for (let k = from; k < R.count; k++) {
        const x = R.p[k * 3], y = R.p[k * 3 + 1], z = R.p[k * 3 + 2];
        const y2 = y * Math.cos(tilt) - z * Math.sin(tilt);
        const z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
        R.p[k * 3] = x * Math.cos(ang) - z2 * Math.sin(ang);
        R.p[k * 3 + 1] = y2;
        R.p[k * 3 + 2] = x * Math.sin(ang) + z2 * Math.cos(ang);
      }
      R.smooth(from);
      const a = (i / 3) * TAU;
      const E = P.get('b');
      const f2 = E.count;
      sphereY(E, 0, 0.014, 8, 4);
      for (let k = f2; k < E.count; k++) E.p[k * 3] += Math.cos(a) * 0.080;
    }
    return P;
  },
  butterfly: () => {
    const P = new Parts(), W = P.get('m'), B = P.get('a');
    for (const s of [-1, 1]) for (let wing = 0; wing < 2; wing++) {
      const from = W.count;
      const sc = wing ? 0.72 : 1.0;
      for (let i = 0; i <= 5; i++) {
        const t = i / 5;
        const a = lerp(0.25, 2.5, t);
        const r = 0.048 * sc * Math.sin(t * PI * 0.9);
        W.vert(s * r * 1.35, Math.sin(t * PI) * 0.030 - 0.010, Math.cos(a) * r * 0.5 + (wing ? -0.020 : 0.014), 0, 1, 0, t, 0);
        W.vert(s * 0.002, 0.008 + (wing ? -0.006 : 0.006), (wing ? -0.012 : 0.010), 0, 1, 0, t, 1);
      }
      for (let i = 0; i < 5; i++) {
        s > 0 ? W.quad(from + i * 2, from + i * 2 + 1, from + (i + 1) * 2 + 1, from + (i + 1) * 2)
              : W.quad(from + i * 2, from + (i + 1) * 2, from + (i + 1) * 2 + 1, from + i * 2 + 1);
      }
      W.smooth(from);
    }
    tube(B, [0, -0.014, -0.020], [0, 0.014, 0.026], 0.010, 0.005, 8);
    return P;
  },
  puff: () => {
    const P = new Parts(), M = P.get('m');
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU, r = i % 2 ? 0.045 : 0.062;
      const from = M.count;
      sphereY(M, 0, 0.048, 10, 6);
      for (let k = from; k < M.count; k++) {
        M.p[k * 3] += Math.cos(a) * r;
        M.p[k * 3 + 1] += Math.sin(i * 2.1) * 0.030;
        M.p[k * 3 + 2] += Math.sin(a) * r;
      }
    }
    return P;
  },
  voxel: () => {
    const P = new Parts(), M = P.get('m');
    rbox(M, 0, 0, 0, 0.042, 0.042, 0.042, 0.006, 3);
    return P;
  },
  shard: () => {
    const P = new Parts(), M = P.get('m'), from = M.count;
    const pts = [[0, 0.075, 0], [-0.030, -0.040, 0.014], [0.030, -0.040, 0.014], [0, -0.030, -0.016]];
    for (const p of pts) M.vert(p[0], p[1], p[2], 0, 1, 0, 0.5, 0.5);
    M.tri(from, from + 1, from + 2); M.tri(from, from + 2, from + 3);
    M.tri(from, from + 3, from + 1); M.tri(from + 1, from + 3, from + 2);
    M.smooth(from);
    return P;
  },
  vine: () => {
    const P = new Parts(), M = P.get('m');
    const pts = [];
    for (let i = 0; i <= 6; i++) {
      const t = i / 6;
      pts.push([Math.sin(t * 3.1) * 0.055, t * 0.150, Math.cos(t * 2.3) * 0.040]);
    }
    for (let i = 0; i < pts.length - 1; i++) tube(M, pts[i], pts[i + 1], lerp(0.012, 0.005, i / 5), lerp(0.011, 0.004, (i + 1) / 5), 6);
    const L = P.get('a');
    for (let i = 1; i < 6; i += 2) {
      const p = pts[i], from = L.count;
      for (let k = 0; k <= 3; k++) {
        const t = k / 3;
        L.vert(p[0] + t * 0.048, p[1] + Math.sin(t * PI) * 0.026, p[2] + t * 0.020, 0, 1, 0, t, 0);
        L.vert(p[0] + t * 0.048, p[1] + Math.sin(t * PI) * 0.026, p[2] - 0.020 + t * 0.020, 0, 1, 0, t, 1);
      }
      for (let k = 0; k < 3; k++) L.quad(from + k * 2, from + k * 2 + 1, from + (k + 1) * 2 + 1, from + (k + 1) * 2);
      L.smooth(from);
    }
    return P;
  },
  bolt: () => {
    const P = new Parts(), M = P.get('m');
    let x = 0, z = 0;
    for (let i = 0; i < 8; i++) {
      const t = i / 8;
      const x2 = x + (hash2(i, 3) - 0.5) * 0.055, z2 = z + (hash2(i, 7) - 0.5) * 0.030;
      tube(M, [x, t * 0.180 - 0.090, z], [x2, (t + 0.125) * 0.180 - 0.090, z2], lerp(0.012, 0.002, t), lerp(0.010, 0.001, t + 0.125), 5);
      x = x2; z = z2;
    }
    return P;
  },
  nitro: () => {
    const P = new Parts(), M = P.get('m');
    revolveY(M, [[-0.062, 0.018], [-0.050, 0.030], [0.050, 0.030], [0.062, 0.018]], 14, true, true);
    revolveY(P.get('a'), [[0.062, 0.010], [0.086, 0.008], [0.098, 0.004]], 10, true, false);
    return P;
  },
  spike: () => {
    const P = new Parts(), M = P.get('m');
    const prof = [];
    for (let i = 0; i <= 6; i++) {
      const t = i / 6;
      prof.push([-0.055 + t * 0.170, 0.040 * (1 - t) * (1 - t * 0.3)]);
    }
    revolveY(M, prof, 8, true, false);
    return P;
  },
  partyhat: () => {
    const P = new Parts(), M = P.get('m');
    coneY(M, -0.045, 0.058, 0.082, 0.004, 14, true, false);
    sphereY(P.get('a'), 0.092, 0.018, 10, 5);
    return P;
  },
  ring: () => {
    const P = new Parts(), M = P.get('m');
    torusY(M, 0, 0.088, 0.013, 28, 9);
    return P;
  },
  bubble: () => {
    const P = new Parts(), M = P.get('m');
    sphereY(M, 0, 0.070, 16, 9);
    return P;
  },
  duck: () => {
    const P = new Parts(), M = P.get('m');
    sphereY(M, 0, 0.058, 14, 7, 0.048);
    sphereY(M, 0.062, 0.040, 12, 6, 0.040);
    tube(P.get('a'), [0, 0.060, 0.036], [0, 0.058, 0.070], 0.014, 0.006, 8);
    return P;
  },
  gear: () => {
    const P = new Parts(), M = P.get('m');
    revolveY(M, [[-0.012, 0.030], [0.012, 0.030]], 18, true, true);
    torusY(M, 0, 0.052, 0.014, 20, 7);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * TAU;
      rbox(M, Math.cos(a) * 0.062, 0, Math.sin(a) * 0.062, 0.014, 0.012, 0.010, 0.003, 3);
    }
    return P;
  },
  skull: () => {
    const P = new Parts(), M = P.get('m');
    sphereY(M, 0.014, 0.052, 16, 8, 0.058);
    rbox(M, 0, -0.040, 0.010, 0.036, 0.026, 0.040, 0.010, 4);
    for (const s of [-1, 1]) rbox(P.get('a'), s * 0.021, 0.020, 0.048, 0.014, 0.012, 0.008, 0.004, 3);
    return P;
  },
  rocket: () => {
    const P = new Parts(), M = P.get('m');
    revolveY(M, [[-0.070, 0.012], [-0.058, 0.026], [0.050, 0.026], [0.086, 0.0]], 14, true, false);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * TAU;
      const F = P.get('a'), from = F.count;
      for (let k = 0; k <= 3; k++) {
        const t = k / 3;
        F.vert(Math.cos(a) * (0.026 + t * 0.030), -0.058 - t * 0.024, Math.sin(a) * (0.026 + t * 0.030), 0, 1, 0, t, 0);
        F.vert(Math.cos(a + 0.5) * (0.026 + t * 0.030), -0.058 - t * 0.024, Math.sin(a + 0.5) * (0.026 + t * 0.030), 0, 1, 0, t, 1);
      }
      for (let k = 0; k < 3; k++) F.quad(from + k * 2, from + k * 2 + 1, from + (k + 1) * 2 + 1, from + (k + 1) * 2);
      F.smooth(from);
    }
    revolveY(P.get('b'), [[-0.070, 0.012], [-0.086, 0.014]], 12, true, true);
    return P;
  },
  tophat: () => {
    const P = new Parts(), M = P.get('m');
    revolveY(M, [[-0.055, 0.052], [-0.050, 0.054], [0.050, 0.056], [0.062, 0.052]], 20, true, true);
    brim(M, -0.055, 0.054, 0.098, 0.008, 22, 0.004, 0.010);
    return P;
  },
  fish: () => {
    const P = new Parts(), M = P.get('m');
    const prof = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      prof.push([-0.070 + t * 0.150, 0.036 * Math.sin(t * PI * 0.95)]);
    }
    revolveY(M, prof, 12, true, false);
    for (const s of [-1, 1]) {
      const F = P.get('a'), from = F.count;
      for (let k = 0; k <= 3; k++) {
        const t = k / 3;
        F.vert(s * t * 0.040, Math.sin(t * PI) * 0.020 - 0.010, -0.070 + t * 0.010, 0, 1, 0, t, 0);
        F.vert(s * t * 0.040, Math.sin(t * PI) * 0.020 - 0.010, -0.070 - 0.008 + t * 0.010, 0, 1, 0, t, 1);
      }
      for (let k = 0; k < 3; k++) F.quad(from + k * 2, from + k * 2 + 1, from + (k + 1) * 2 + 1, from + (k + 1) * 2);
      F.smooth(from);
    }
    return P;
  },
  star: () => {
    const P = new Parts(), M = P.get('m');
    const arms = 5, rOut = 0.075, rIn = 0.032, th = 0.014;
    const from = M.count;
    for (let layer = 0; layer < 2; layer++) {
      const yy = layer ? th : -th;
      const c = M.vert(0, yy, 0, 0, layer ? 1 : -1, 0, 0.5, 0.5);
      const ids = [];
      for (let i = 0; i < arms * 2; i++) {
        const a = (i / (arms * 2)) * TAU - PI / 2;
        const r = i % 2 ? rIn : rOut;
        ids.push(M.vert(Math.cos(a) * r, yy, Math.sin(a) * r, 0, layer ? 1 : -1, 0, 0.5 + Math.cos(a) * 0.5, 0.5 + Math.sin(a) * 0.5));
      }
      for (let i = 0; i < arms * 2; i++) {
        const j = (i + 1) % (arms * 2);
        layer ? M.tri(c, ids[j], ids[i]) : M.tri(c, ids[i], ids[j]);
      }
    }
    const rim = from + 1 + arms * 4 + 1;
    for (let i = 0; i < arms * 2; i++) {
      const j = (i + 1) % (arms * 2);
      M.quad(from + 1 + i, from + 1 + j, rim + j, rim + i);
    }
    M.smooth(from);
    return P;
  },
};

export const OBJECT_KEYS = Object.keys(OBJ);

/* ========================================================================== *
 *  TRAIL — the thing that makes a flying object read as a flying object
 * ========================================================================== */

class Trail {
  constructor(T, color, width = 0.05, max = 26) {
    this.T = T; this.width = width; this.max = max;
    this.pts = [];
    this.fade = 1;
    this.pos = new Float32Array(max * 2 * 3);
    this.col = new Float32Array(max * 2 * 3);
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(this.pos, 3));
    g.setAttribute('color', new T.BufferAttribute(this.col, 3));
    const idx = [];
    for (let i = 0; i < max - 1; i++) {
      const a = i * 2;
      idx.push(a, a + 1, a + 3, a, a + 3, a + 2);
    }
    g.setIndex(idx);
    g.setDrawRange(0, 0);
    g.boundingSphere = new T.Sphere(new T.Vector3(), 1e6);
    this.geo = g;
    this.mat = new T.MeshBasicMaterial({
      vertexColors: true, transparent: true, opacity: 1,
      blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, toneMapped: false,
    });
    this.mesh = new T.Mesh(g, this.mat);
    this.mesh.frustumCulled = false;
    this.color = new T.Color(color);
    this._v1 = new T.Vector3(); this._v2 = new T.Vector3(); this._v3 = new T.Vector3();
  }
  push(x, y, z) {
    const n = this.pts.length;
    if (n) {
      const p = this.pts[n - 1];
      const dx = x - p[0], dy = y - p[1], dz = z - p[2];
      if (dx * dx + dy * dy + dz * dz < 1e-5) return;
    }
    this.pts.push([x, y, z]);
    while (this.pts.length > this.max) this.pts.shift();
  }
  update(dt) {
    this.fade = Math.max(0, this.fade - dt * 0.5);
    const n = this.pts.length;
    if (n < 2) { this.geo.setDrawRange(0, 0); return; }
    const up = this._v3.set(0, 1, 0);
    for (let i = 0; i < n; i++) {
      const p = this.pts[i];
      const a = this.pts[Math.max(0, i - 1)], b = this.pts[Math.min(n - 1, i + 1)];
      const dir = this._v1.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
      if (dir.lengthSq() < 1e-8) dir.set(0, 1, 0);
      dir.normalize();
      const side = this._v2.crossVectors(dir, up);
      if (side.lengthSq() < 1e-6) side.crossVectors(dir, this._v3.set(1, 0, 0));
      side.normalize();
      const t = i / (n - 1);
      const w = this.width * Math.pow(t, 0.65) * this.fade;
      const o = i * 6;
      this.pos[o] = p[0] - side.x * w; this.pos[o + 1] = p[1] - side.y * w; this.pos[o + 2] = p[2] - side.z * w;
      this.pos[o + 3] = p[0] + side.x * w; this.pos[o + 4] = p[1] + side.y * w; this.pos[o + 5] = p[2] + side.z * w;
      const br = Math.pow(t, 1.7) * this.fade;
      const r = this.color.r * br, g2 = this.color.g * br, b2 = this.color.b * br;
      this.col[o] = r; this.col[o + 1] = g2; this.col[o + 2] = b2;
      this.col[o + 3] = r; this.col[o + 4] = g2; this.col[o + 5] = b2;
    }
    this.geo.setDrawRange(0, (n - 1) * 6);
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.color.needsUpdate = true;
  }
  dispose() { this.geo.dispose(); this.mat.dispose(); }
}

/* ========================================================================== *
 *  SPARKS — additive point burst
 * ========================================================================== */

class Sparks {
  constructor(T, count, color, size = 0.06) {
    this.T = T; this.count = count; this.life = 0; this.maxLife = 1.4;
    this.pos = new Float32Array(count * 3);
    this.vel = new Float32Array(count * 3);
    this.size = new Float32Array(count);
    this.g = new T.BufferGeometry();
    this.g.setAttribute('position', new T.BufferAttribute(this.pos, 3));
    this.g.setAttribute('size', new T.BufferAttribute(this.size, 1));
    this.g.boundingSphere = new T.Sphere(new T.Vector3(), 1e6);
    this.mat = new T.PointsMaterial({
      color: new T.Color(color), size, sizeAttenuation: true,
      transparent: true, opacity: 1, blending: T.AdditiveBlending,
      depthWrite: false, toneMapped: false,
    });
    this.mesh = new T.Points(this.g, this.mat);
    this.mesh.frustumCulled = false;
  }
  emit(x, y, z, speed, spread = 1) {
    for (let i = 0; i < this.count; i++) {
      const o = i * 3;
      this.pos[o] = x; this.pos[o + 1] = y; this.pos[o + 2] = z;
      const a = Math.random() * TAU, e = (Math.random() - 0.5) * PI * spread;
      const s = speed * (0.35 + Math.random() * 0.9);
      this.vel[o] = Math.cos(a) * Math.cos(e) * s;
      this.vel[o + 1] = Math.sin(e) * s + speed * 0.3;
      this.vel[o + 2] = Math.sin(a) * Math.cos(e) * s;
    }
  }
  update(dt, gravity = 5) {
    this.life += dt;
    const k = clamp(1 - this.life / this.maxLife, 0, 1);
    for (let i = 0; i < this.count; i++) {
      const o = i * 3;
      this.vel[o + 1] -= gravity * dt;
      this.pos[o] += this.vel[o] * dt;
      this.pos[o + 1] += this.vel[o + 1] * dt;
      this.pos[o + 2] += this.vel[o + 2] * dt;
    }
    this.mat.opacity = k * k;
    this.g.attributes.position.needsUpdate = true;
    return k > 0;
  }
  dispose() { this.g.dispose(); this.mat.dispose(); }
}

/* ========================================================================== *
 *  EXPLOSION
 * ========================================================================== */

const MAT_PRESETS = {
  candy:   { metal: 0.05, rough: 0.16, cc: 1.0, emis: 0.55 },
  chrome:  { metal: 1.0, rough: 0.08, cc: 0.4, emis: 0.0 },
  gold:    { metal: 1.0, rough: 0.16, cc: 0.6, emis: 0.0 },
  glow:    { metal: 0.0, rough: 0.3, cc: 0.0, emis: 1.6 },
  matte:   { metal: 0.0, rough: 0.75, cc: 0.1, emis: 0.0 },
  glass:   { metal: 0.1, rough: 0.05, cc: 1.0, emis: 0.2, transparent: true, opacity: 0.45 },
  stone:   { metal: 0.1, rough: 0.9, cc: 0.0, emis: 0.0 },
  rubber:  { metal: 0.0, rough: 0.85, cc: 0.0, emis: 0.0 },
};

export class GoalExplosion {
  constructor(THREE, spec, opts = {}) {
    this.T = THREE;
    this.spec = spec;
    this.root = new THREE.Group();
    this.root.name = 'fx:' + spec.id;
    this.objs = [];
    this.sparks = [];
    this.lights = [];
    this.rings = [];
    this.time = 0;
    this.shake = 0;
    // NOT `this.flash` — that would shadow the flash() method below and make
    // every spec that calls E.flash(...) throw "E.flash is not a function".
    this.flashAmt = 0;
    this.scale = opts.scale || 1;
    this.origin = opts.origin || { x: 0, y: 0.5, z: 0 };
    this.ground = opts.ground === undefined ? 0 : opts.ground;
    this.palette = opts.palette || spec.palette || ['#ff2d55', '#ffd166', '#25f4ff', '#7b5cff', '#3ddc84'];
    this._geo = new Map();
    this._mat = new Map();
    this._trailCount = 0;
    this.events = [];
    this._evId = 0;
    this.build(opts);
  }

  /* ---- deterministic scheduler ---------------------------------------- *
   * Sequenced beats (firework shells popping, a delayed white flash) must be
   * driven by scene time, not wall-clock time: otherwise they keep firing
   * after dispose(), they cannot be paused, and they cannot be fast-forwarded
   * when the gallery scrubs the timeline. `timer` is the only scheduler the
   * celebration specs are allowed to use.
   * ---------------------------------------------------------------------- */

  /** Run `fn` after `ms` milliseconds of scene time. Returns a cancel id. */
  after(ms, fn) {
    const id = ++this._evId;
    this.events.push({ t: ms / 1000, fn, id });
    return id;
  }

  /** setTimeout-compatible argument order, for readable call sites. */
  timer(fn, ms) { return this.after(ms, fn); }

  cancel(id) {
    const i = this.events.findIndex(e => e.id === id);
    if (i >= 0) this.events.splice(i, 1);
  }

  /** Fire every event whose deadline has passed. */
  _pumpEvents(dt) {
    if (!this.events.length) return;
    const due = [];
    // Walk backwards so events scheduled *by* a firing callback are not
    // considered until the next frame.
    for (let i = this.events.length - 1; i >= 0; i--) {
      const e = this.events[i];
      e.t -= dt;
      if (e.t <= 0) { due.push(e.fn); this.events.splice(i, 1); }
    }
    for (let i = due.length - 1; i >= 0; i--) due[i]();
  }

  geo(key) {
    if (!this._geo.has(key)) {
      const P = OBJ[key]();
      const out = {};
      for (const [slot, mesh] of P.entries()) out[slot] = meshGeo(this.T, mesh);
      this._geo.set(key, out);
    }
    return this._geo.get(key);
  }

  mat(preset, color) {
    const k = preset + '|' + color;
    if (this._mat.has(k)) return this._mat.get(k);
    const T = this.T, p = MAT_PRESETS[preset] || MAT_PRESETS.candy;
    const c = new T.Color(color);
    const m = new T.MeshPhysicalMaterial({
      color: c, metalness: p.metal, roughness: p.rough,
      clearcoat: p.cc, clearcoatRoughness: 0.08, envMapIntensity: 1.2,
      transparent: !!p.transparent, opacity: p.opacity === undefined ? 1 : p.opacity,
      emissive: p.emis ? c : new T.Color(0x000000),
      emissiveIntensity: p.emis || 0,
      side: T.DoubleSide,
    });
    this._mat.set(k, m);
    return m;
  }

  /* ---- builder helpers used by the celebration specs ------------------- */

  /** Spawn one object. Returns the object record so a spec can tweak it. */
  spawn(type, o = {}) {
    const T = this.T;
    const geoBag = this.geo(type);
    const g = new T.Group();
    const preset = o.preset || 'candy';
    const color = o.color || pick(this.palette);
    for (const slot in geoBag) {
      const mat = this.mat(slot === 'a' ? (o.preset2 || preset) : preset, slot === 'a' && o.color2 ? o.color2 : (slot === 'b' ? (o.color3 || color) : color));
      const mesh = new T.Mesh(geoBag[slot], mat);
      mesh.castShadow = false;
      g.add(mesh);
    }
    const s = (o.scale || 1) * this.scale;
    g.scale.setScalar(s);
    const pos = new T.Vector3(
      this.origin.x + (o.x || 0), this.origin.y + (o.y || 0), this.origin.z + (o.z || 0));
    g.position.copy(pos);
    this.root.add(g);

    const rec = {
      type, mesh: g, pos,
      vel: new T.Vector3(o.vx || 0, o.vy || 0, o.vz || 0),
      spin: new T.Vector3(o.sx === undefined ? rnd(-3, 3) : o.sx, o.sy === undefined ? rnd(-3, 3) : o.sy, o.sz === undefined ? rnd(-3, 3) : o.sz),
      gravity: o.gravity === undefined ? 9.0 : o.gravity,
      life: o.life || 3.2, maxLife: o.life || 3.2,
      scale: s, baseScale: s,
      bounce: o.bounce === undefined ? 0.45 : o.bounce,
      drag: o.drag === undefined ? 0.06 : o.drag,
      grow: o.grow === undefined ? 0.14 : o.grow,
      popAt: o.popAt === undefined ? null : o.popAt,
      trail: null, delay: o.delay || 0,
    };
    if (o.trail) {
      rec.trail = new Trail(T, o.trail === true ? color : o.trail, (o.trailW || 0.055) * this.scale, o.trailLen || 26);
      this.root.add(rec.trail.mesh);
      this._trailCount++;
    }
    if (o.delay) g.visible = false;
    this.objs.push(rec);
    return rec;
  }

  /** Additive point burst. */
  burst(o = {}) {
    const s = new Sparks(this.T, o.count || 40, o.color || pick(this.palette), (o.size || 0.07) * this.scale);
    s.maxLife = o.life || 1.4;
    s.emit(this.origin.x + (o.x || 0), this.origin.y + (o.y || 0), this.origin.z + (o.z || 0), (o.speed || 6) * this.scale, o.spread === undefined ? 1 : o.spread);
    s._gravity = o.gravity === undefined ? 6 : o.gravity;
    this.root.add(s.mesh);
    this.sparks.push(s);
    return s;
  }

  /** Expanding ground ring. */
  shock(color, r0 = 0.4, r1 = 5.5, dur = 0.9, y = 0.02) {
    const T = this.T;
    const geo = new T.RingGeometry(r0, r0 * 1.18, 48);
    const mat = new T.MeshBasicMaterial({ color: new T.Color(color), transparent: true, opacity: 0.9, blending: T.AdditiveBlending, side: T.DoubleSide, depthWrite: false, toneMapped: false });
    const m = new T.Mesh(geo, mat);
    m.rotation.x = -PI / 2;
    m.position.set(this.origin.x, this.origin.y + y, this.origin.z);
    this.root.add(m);
    this.rings.push({ mesh: m, mat, geo, t: 0, dur, r0, r1 });
  }

  flash(color, intensity = 8, dist = 3) {
    const T = this.T;
    const l = new T.PointLight(new T.Color(color), intensity, dist * 3, 2);
    l.position.set(this.origin.x, this.origin.y + 0.4, this.origin.z);
    this.root.add(l);
    this.lights.push({ light: l, t: 0, dur: 0.55, base: intensity });
    this.flashAmt = Math.max(this.flashAmt, Math.min(1, intensity / 12));
    return l;
  }

  /* ---- lifecycle -------------------------------------------------------- */

  build(opts) {
    const b = this.spec.build;
    if (b) b(this, opts);
  }

  update(dt) {
    this.time += dt;
    this._pumpEvents(dt);
    const T = this.T;

    for (const o of this.objs) {
      if (o.delay > 0) {
        o.delay -= dt;
        if (o.delay > 0) continue;
        o.mesh.visible = true;
        if (o.trail) o.trail.mesh.visible = true;
      }
      o.life -= dt;
      if (o.life <= 0) {
        o.mesh.visible = false;
        if (o.trail) { o.trail.fade -= dt * 2.2; o.trail.update(dt); }
        continue;
      }
      // pop: scale to zero at the end of life
      if (o.popAt !== null && o.life < o.popAt) {
        const k = clamp(o.life / o.popAt, 0, 1);
        o.mesh.scale.setScalar(o.baseScale * k * (1 + (1 - k) * 0.5));
        if (k < 0.35 && !o._popped) {
          o._popped = true;
          // getHexString() returns '3ddc84' with no leading '#', which
          // THREE.Color cannot parse — it logs "Unknown color" and leaves the
          // material white, so every pop burst came out colourless.
          this.burst({ x: o.pos.x - this.origin.x, y: o.pos.y - this.origin.y, z: o.pos.z - this.origin.z, count: 22, speed: 5, life: 0.8, color: o.trail ? '#' + o.trail.color.getHexString() : undefined });
        }
      } else if (o.grow > 0 && o.maxLife - o.life < o.grow) {
        const k = (o.maxLife - o.life) / o.grow;
        o.mesh.scale.setScalar(o.baseScale * (0.15 + 0.85 * k));
      }
      o.vel.y -= o.gravity * dt;
      o.vel.multiplyScalar(1 - o.drag * dt);
      o.pos.addScaledVector(o.vel, dt);
      if (this.ground !== null && o.pos.y < this.ground + 0.02 && o.vel.y < 0) {
        o.pos.y = this.ground + 0.02;
        o.vel.y = Math.abs(o.vel.y) * o.bounce;
        o.vel.x *= 0.86; o.vel.z *= 0.86;
        o.spin.multiplyScalar(0.8);
      }
      o.mesh.position.copy(o.pos);
      o.mesh.rotation.x += o.spin.x * dt;
      o.mesh.rotation.y += o.spin.y * dt;
      o.mesh.rotation.z += o.spin.z * dt;
      if (o.trail) { o.trail.push(o.pos.x, o.pos.y, o.pos.z); o.trail.update(dt); }
    }

    for (const s of this.sparks) s.update(dt, s._gravity);

    for (const r of this.rings) {
      r.t += dt;
      const k = clamp(r.t / r.dur, 0, 1);
      const sc = lerp(r.r0, r.r1, k) / r.r0;
      r.mesh.scale.setScalar(sc);
      r.mat.opacity = 0.9 * (1 - k) * (1 - k);
      r.mesh.visible = k < 1;
    }

    for (const l of this.lights) {
      l.t += dt;
      const k = clamp(1 - l.t / l.dur, 0, 1);
      l.light.intensity = l.base * k * k;
    }

    this.shake = Math.max(0, this.shake - dt * 1.6);
    this.flashAmt = Math.max(0, this.flashAmt - dt * 2.4);
    return this.time < this.spec.duration + 3.5;
  }

  get finished() { return this.time > this.spec.duration + 3.0; }

  dispose() {
    this.events.length = 0;
    this.root.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose());
    });
    for (const [, bag] of this._geo) for (const k in bag) bag[k].dispose();
    for (const [, m] of this._mat) m.dispose();
    this._geo.clear(); this._mat.clear();
    this.objs.length = 0; this.sparks.length = 0; this.lights.length = 0; this.rings.length = 0;
  }
}

/* ========================================================================== *
 *  THE 26 CELEBRATIONS
 * ========================================================================== */

export const CELEBRATIONS = [

  /* 1 — the one that started the conversation ---------------------------- */
  {
    id: 'donutstorm', name: 'Donut Storm', grade: 'black market', duration: 4.4, shake: 0.85,
    palette: ['#ff2d55', '#ff9f1c', '#ffd166', '#3ddc84', '#25f4ff', '#7b5cff', '#ff5d8f'],
    desc: 'Donuts of every size erupt out of the goal, each one dragging a rainbow ribbon.',
    build: (E) => {
      E.flash('#ffd166', 14, 6);
      E.shock('#ff2d55', 0.5, 9, 1.1);
      E.burst({ count: 70, speed: 9, life: 1.6, size: 0.09 });
      for (let i = 0; i < 22; i++) {
        const a = (i / 22) * TAU + rnd(-0.2, 0.2);
        const up = rnd(0.35, 1.0);
        const sp = rnd(4.2, 9.5);
        const size = rnd(0.55, 2.1);
        E.spawn('donut', {
          color: E.palette[i % E.palette.length],
          scale: size,
          x: Math.cos(a) * 0.18, y: rnd(0.05, 0.7), z: Math.sin(a) * 0.18,
          vx: Math.cos(a) * sp, vy: sp * up * 0.85, vz: Math.sin(a) * sp * 0.75,
          sx: rnd(-6, 6), sy: rnd(-6, 6), sz: rnd(-6, 6),
          gravity: 8.5, bounce: 0.42, life: rnd(3.0, 4.4),
          trail: E.palette[i % E.palette.length], trailW: 0.05 * size, trailLen: 30,
        });
      }
      for (let i = 0; i < 14; i++) {
        E.spawn('confetti', {
          color: pick(E.palette), scale: rnd(1.4, 2.6), preset: 'glow',
          x: rnd(-0.4, 0.4), y: rnd(0.2, 1.2), z: rnd(-0.3, 0.3),
          vx: rnd(-5, 5), vy: rnd(4, 10), vz: rnd(-5, 5),
          gravity: 4.5, life: rnd(2.4, 3.6), drag: 0.35,
          trail: true, trailW: 0.02, trailLen: 16,
        });
      }
    },
  },

  /* 2 -------------------------------------------------------------------- */
  {
    id: 'fireworks', name: 'Fireworks Barrage', grade: 'legendary', duration: 4.6, shake: 0.5,
    palette: ['#ff2d55', '#ffd166', '#25f4ff', '#7b5cff', '#3ddc84', '#ff9f1c'],
    desc: 'Nine shells climb, hang, then burst into full colour with falling trails.',
    build: (E) => {
      E.shock('#ffd166', 0.4, 6, 0.8);
      for (let i = 0; i < 9; i++) {
        const a = rnd(0, TAU), sp = rnd(3.5, 8);
        const c = E.palette[i % E.palette.length];
        const shell = E.spawn('shell', {
          color: c, scale: rnd(0.7, 1.2), preset: 'candy',
          x: rnd(-0.2, 0.2), y: rnd(0.0, 0.4), z: rnd(-0.2, 0.2),
          vx: Math.cos(a) * sp, vy: rnd(7.5, 11), vz: Math.sin(a) * sp,
          gravity: 7.5, life: rnd(1.0, 1.9), drag: 0.1,
          trail: c, trailW: 0.035, trailLen: 22,
        });
        shell.popAt = null;
        shell.onPop = true;
      }
      // the shells burst on a timer via delayed bursts
      for (let i = 0; i < 9; i++) {
        const a = rnd(0, TAU), r = rnd(2.5, 6.5);
        const c = E.palette[i % E.palette.length];
        E.timer(() => {
          if (!E.root.parent) return;
          E.burst({ x: Math.cos(a) * r, y: rnd(3, 6), z: Math.sin(a) * r, count: 60, speed: 11, life: 1.8, size: 0.10, color: c, gravity: 7 });
          E.flash(c, 9, 4);
        }, 700 + i * 180);
      }
    },
  },

  /* 3 -------------------------------------------------------------------- */
  {
    id: 'confetti', name: 'Confetti Cannon', grade: 'epic', duration: 3.8, shake: 0.35,
    palette: ['#ff2d55', '#ffd166', '#25f4ff', '#7b5cff', '#3ddc84', '#ff5d8f', '#ff9f1c'],
    desc: 'Two cannons of tumbling paper cards with thin ribbon tails.',
    build: (E) => {
      E.flash('#ffffff', 8, 4);
      E.shock('#7b5cff', 0.4, 7, 0.9);
      for (const side of [-1, 1]) {
        for (let i = 0; i < 34; i++) {
          const a = rnd(-0.5, 0.5) + (side > 0 ? 0 : PI);
          E.spawn('confetti', {
            color: pick(E.palette), scale: rnd(1.1, 2.2), preset: 'candy',
            x: side * 0.5, y: rnd(0.1, 0.5), z: rnd(-0.3, 0.3),
            vx: Math.cos(a) * rnd(6, 13), vy: rnd(5, 12), vz: Math.sin(a) * rnd(6, 13),
            sx: rnd(-14, 14), sy: rnd(-14, 14), sz: rnd(-14, 14),
            gravity: 5.5, life: rnd(2.6, 3.8), drag: 0.32, bounce: 0.2,
            trail: true, trailW: 0.014, trailLen: 12,
          });
        }
      }
    },
  },

  /* 4 -------------------------------------------------------------------- */
  {
    id: 'balloons', name: 'Balloon Pop', grade: 'epic', duration: 4.0, shake: 0.4,
    palette: ['#ff2d55', '#ffd166', '#25f4ff', '#3ddc84', '#ff5d8f', '#7b5cff'],
    desc: 'Balloons float up in a spiral, then pop one by one into sparks.',
    build: (E) => {
      E.flash('#ff9f1c', 7, 4);
      for (let i = 0; i < 20; i++) {
        const a = (i / 20) * TAU * 1.6;
        E.spawn('balloon', {
          color: E.palette[i % E.palette.length], scale: rnd(0.7, 1.25), preset: 'candy',
          x: Math.cos(a) * 0.6, y: rnd(0.0, 0.3), z: Math.sin(a) * 0.6,
          vx: Math.cos(a) * rnd(0.8, 2.2), vy: rnd(3.2, 5.6), vz: Math.sin(a) * rnd(0.8, 2.2),
          gravity: -1.2, life: rnd(2.2, 3.6), drag: 0.25, bounce: 0,
          popAt: rnd(0.25, 0.7),
          trail: true, trailW: 0.012, trailLen: 14,
        });
      }
      E.shock('#ff5d8f', 0.4, 6, 0.9);
    },
  },

  /* 5 -------------------------------------------------------------------- */
  {
    id: 'meteors', name: 'Meteor Shower', grade: 'legendary', duration: 4.2, shake: 1.0,
    palette: ['#ff6a13', '#ffb347', '#ff2d55', '#8a2a0a'],
    desc: 'Burning rocks slam down and kick up debris.',
    build: (E) => {
      E.flash('#ff6a13', 12, 6);
      E.shock('#ff6a13', 0.5, 10, 1.2);
      for (let i = 0; i < 14; i++) {
        const a = rnd(0, TAU), r = rnd(1.5, 6);
        E.spawn('rock', {
          color: pick(['#3a2a22', '#4a332a', '#2a1f18']), preset: 'stone', preset2: 'glow', color2: '#ff6a13',
          scale: rnd(0.8, 2.0),
          x: Math.cos(a) * r, y: rnd(5, 9), z: Math.sin(a) * r,
          vx: rnd(-1.5, 1.5), vy: -rnd(6, 12), vz: rnd(-1.5, 1.5),
          sx: rnd(-4, 4), sy: rnd(-4, 4), sz: rnd(-4, 4),
          gravity: 12, bounce: 0.35, life: rnd(2.6, 3.6), delay: rnd(0, 0.5),
          trail: '#ff6a13', trailW: 0.075, trailLen: 24,
        });
      }
      for (let i = 0; i < 10; i++) {
        const a = rnd(0, TAU), r = rnd(0.5, 4);
        E.timer(() => { if (E.root.parent) E.burst({ x: Math.cos(a) * r, y: 0.1, z: Math.sin(a) * r, count: 26, speed: 6, life: 1.1, color: '#ffb347' }); }, 900 + i * 160);
      }
    },
  },

  /* 6 -------------------------------------------------------------------- */
  {
    id: 'beachball', name: 'Beach Party', grade: 'epic', duration: 4.2, shake: 0.4,
    palette: ['#ff2d55', '#ffd166', '#25f4ff', '#3ddc84', '#ffffff'],
    desc: 'Striped beach balls bounce around the arena like it owes them money.',
    build: (E) => {
      E.flash('#25f4ff', 8, 5);
      E.shock('#25f4ff', 0.5, 8, 1.0);
      for (let i = 0; i < 16; i++) {
        const a = rnd(0, TAU), sp = rnd(4, 9);
        E.spawn('beachball', {
          color: E.palette[i % E.palette.length], color2: '#ffffff', color3: E.palette[(i + 2) % E.palette.length],
          preset: 'candy', preset2: 'matte',
          scale: rnd(0.8, 1.5),
          x: Math.cos(a) * 0.3, y: rnd(0.1, 0.6), z: Math.sin(a) * 0.3,
          vx: Math.cos(a) * sp, vy: rnd(3, 7), vz: Math.sin(a) * sp,
          sx: rnd(-3, 3), sy: rnd(-3, 3), sz: rnd(-3, 3),
          gravity: 11, bounce: 0.72, life: rnd(3.0, 4.2), drag: 0.05,
          trail: true, trailW: 0.03, trailLen: 16,
        });
      }
    },
  },

  /* 7 -------------------------------------------------------------------- */
  {
    id: 'turtles', name: 'Turtle Tide', grade: 'legendary', duration: 4.6, shake: 0.3,
    palette: ['#3ddc84', '#2a8f5a', '#8fd8a0', '#1f6b46'],
    desc: 'A shoal of turtles swims out of the goal in lazy arcs.',
    build: (E) => {
      E.flash('#8fd8a0', 6, 4);
      E.shock('#3ddc84', 0.4, 7, 1.0);
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * TAU + rnd(-0.15, 0.15);
        E.spawn('turtle', {
          color: pick(E.palette), color2: '#d8c9a0', preset: 'candy', preset2: 'matte',
          scale: rnd(0.9, 1.7),
          x: Math.cos(a) * 0.2, y: rnd(0.1, 0.5), z: Math.sin(a) * 0.2,
          vx: Math.cos(a) * rnd(2.4, 5.5), vy: rnd(2.5, 5.5), vz: Math.sin(a) * rnd(2.4, 5.5),
          sx: rnd(-2, 2), sy: rnd(-2, 2), sz: rnd(-2, 2),
          gravity: 6.5, bounce: 0.35, life: rnd(3.0, 4.2), drag: 0.22,
          trail: '#8fe8b0', trailW: 0.03, trailLen: 18,
        });
      }
    },
  },

  /* 8 -------------------------------------------------------------------- */
  {
    id: 'snowblind', name: 'Snowblind', grade: 'legendary', duration: 4.4, shake: 0.45,
    palette: ['#dff0ff', '#8fd8ff', '#ffffff', '#a0c8e8'],
    desc: 'Snowflake stars, erupting ice spikes and a whiteout of frost.',
    build: (E) => {
      E.flash('#dff0ff', 10, 6);
      E.shock('#8fd8ff', 0.5, 9, 1.1);
      for (let i = 0; i < 18; i++) {
        const a = rnd(0, TAU), r = rnd(0.4, 4.5);
        E.spawn('snowflake', {
          color: pick(E.palette), preset: 'glow',
          scale: rnd(0.7, 1.6),
          x: Math.cos(a) * r, y: rnd(2.5, 7), z: Math.sin(a) * r,
          vx: rnd(-1.2, 1.2), vy: -rnd(1.5, 3.5), vz: rnd(-1.2, 1.2),
          sx: rnd(-2, 2), sy: rnd(-2, 2), sz: rnd(-2, 2),
          gravity: 0.8, life: rnd(3.0, 4.2), drag: 0.15, bounce: 0,
          trail: '#dff0ff', trailW: 0.02, trailLen: 14,
        });
      }
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * TAU;
        E.spawn('spike', {
          color: '#bfe8ff', preset: 'glass',
          scale: rnd(1.0, 2.4),
          x: Math.cos(a) * rnd(0.8, 4.5), y: -0.05, z: Math.sin(a) * rnd(0.8, 4.5),
          vx: 0, vy: rnd(2.2, 4.2), vz: 0, sx: 0, sy: 0, sz: 0,
          gravity: 9, life: rnd(1.4, 2.4), bounce: 0.2,
        });
      }
      E.burst({ count: 90, speed: 5, life: 2.2, size: 0.05, color: '#ffffff', gravity: 1.2, spread: 1.4 });
    },
  },

  /* 9 -------------------------------------------------------------------- */
  {
    id: 'hellfire', name: 'Hellfire Rift', grade: 'black market', duration: 4.6, shake: 1.1,
    palette: ['#ff2d00', '#ff7a1a', '#ffd166', '#8a0f00'],
    desc: 'A rift tears open, spitting flame orbs and burning embers.',
    build: (E) => {
      E.flash('#ff4a00', 16, 7);
      E.shock('#ff2d00', 0.5, 11, 1.3);
      E.burst({ count: 120, speed: 7, life: 2.2, size: 0.08, color: '#ff7a1a', gravity: -1.5, spread: 1.2 });
      for (let i = 0; i < 18; i++) {
        const a = rnd(0, TAU);
        E.spawn('flame', {
          color: pick(E.palette), preset: 'glow',
          scale: rnd(0.8, 2.0),
          x: Math.cos(a) * 0.25, y: rnd(0.0, 0.8), z: Math.sin(a) * 0.25,
          vx: Math.cos(a) * rnd(2, 6), vy: rnd(3.5, 8.5), vz: Math.sin(a) * rnd(2, 6),
          sx: rnd(-4, 4), sy: rnd(-4, 4), sz: rnd(-4, 4),
          gravity: -2.2, life: rnd(2.4, 3.6), drag: 0.5, bounce: 0,
          trail: '#ff7a1a', trailW: 0.06, trailLen: 20,
        });
      }
    },
  },

  /* 10 ------------------------------------------------------------------- */
  {
    id: 'dragons', name: 'Dueling Dragons', grade: 'black market', duration: 5.0, shake: 0.7,
    palette: ['#7b5cff', '#25f4ff', '#ff2d55', '#ffd166'],
    desc: 'Two serpents spiral out of the goal, wings spread, trailing fire.',
    build: (E) => {
      E.flash('#7b5cff', 12, 6);
      E.shock('#7b5cff', 0.5, 9, 1.2);
      for (let d = 0; d < 2; d++) {
        const dir = d ? 1 : -1;
        const c = E.palette[d % 2];
        for (let i = 0; i < 10; i++) {
          const t = i / 9;
          const a = t * PI * 1.5 * dir + (d ? PI : 0);
          E.spawn('dragon', {
            color: c, color2: E.palette[(d + 2) % 4], preset: 'candy', preset2: 'glow',
            scale: rnd(0.55, 0.85) * (1 - t * 0.25),
            x: Math.cos(a) * t * 2.2, y: 0.4 + t * 1.6, z: Math.sin(a) * t * 2.2,
            vx: -Math.sin(a) * 3.2 * dir, vy: rnd(0.6, 1.6), vz: Math.cos(a) * 3.2 * dir,
            sx: 0, sy: a + PI / 2, sz: 0,
            gravity: 1.2, life: rnd(2.6, 3.8), drag: 0.08, bounce: 0,
            trail: c, trailW: 0.07, trailLen: 26, delay: t * 0.22,
          });
        }
      }
    },
  },

  /* 11 ------------------------------------------------------------------- */
  {
    id: 'gravity', name: 'Gravity Bomb', grade: 'black market', duration: 4.2, shake: 1.4,
    palette: ['#7b5cff', '#25f4ff', '#2a1a4a', '#ff2d55'],
    desc: 'Everything falls inward, hangs for a beat, then detonates outward.',
    build: (E) => {
      E.flash('#25f4ff', 6, 5);
      for (let i = 0; i < 30; i++) {
        const a = rnd(0, TAU), e = rnd(-0.8, 0.8), r = rnd(3, 7);
        E.spawn('voxel', {
          color: pick(E.palette), preset: 'glow',
          scale: rnd(0.7, 1.7),
          x: Math.cos(a) * Math.cos(e) * r, y: 1.2 + Math.sin(e) * r, z: Math.sin(a) * Math.cos(e) * r,
          vx: -Math.cos(a) * Math.cos(e) * r * 0.9, vy: -Math.sin(e) * r * 0.9, vz: -Math.sin(a) * Math.cos(e) * r * 0.9,
          sx: rnd(-6, 6), sy: rnd(-6, 6), sz: rnd(-6, 6),
          gravity: 0, life: 1.05, drag: 0, bounce: 0, grow: 0,
          trail: true, trailW: 0.02, trailLen: 12,
        });
      }
      E.timer(() => {
        if (!E.root.parent) return;
        E.flash('#ffffff', 20, 8);
        E.shock('#7b5cff', 0.5, 13, 1.2);
        E.burst({ count: 140, speed: 16, life: 1.8, size: 0.1, color: '#7b5cff', gravity: 3 });
        for (let i = 0; i < 22; i++) {
          const a = rnd(0, TAU), e = rnd(-0.7, 0.9);
          E.spawn('shard', {
            color: pick(E.palette), preset: 'glow',
            scale: rnd(0.8, 2.2),
            x: 0, y: 1.2, z: 0,
            vx: Math.cos(a) * Math.cos(e) * rnd(6, 14), vy: Math.sin(e) * rnd(6, 12), vz: Math.sin(a) * Math.cos(e) * rnd(6, 14),
            sx: rnd(-10, 10), sy: rnd(-10, 10), sz: rnd(-10, 10),
            gravity: 9, life: rnd(2.0, 3.2), bounce: 0.4,
            trail: '#25f4ff', trailW: 0.03, trailLen: 18,
          });
        }
      }, 1050);
    },
  },

  /* 12 ------------------------------------------------------------------- */
  {
    id: 'atomizer', name: 'Atomizer', grade: 'legendary', duration: 4.4, shake: 0.5,
    palette: ['#25f4ff', '#7b5cff', '#3ddc84', '#ffffff'],
    desc: 'An atom blooms, its electron rings spinning up and out.',
    build: (E) => {
      E.flash('#25f4ff', 14, 7);
      E.shock('#25f4ff', 0.4, 10, 1.0);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * TAU;
        const c = E.palette[i % E.palette.length];
        E.spawn('atom', {
          color: c, color2: E.palette[(i + 1) % 4], preset: 'glow', preset2: 'chrome',
          scale: rnd(1.0, 2.4),
          x: Math.cos(a) * 0.3, y: rnd(0.2, 0.9), z: Math.sin(a) * 0.3,
          vx: Math.cos(a) * rnd(2, 5), vy: rnd(1.5, 4.5), vz: Math.sin(a) * rnd(2, 5),
          sx: rnd(-5, 5), sy: rnd(-5, 5), sz: rnd(-5, 5),
          gravity: 1.5, life: rnd(2.6, 3.8), drag: 0.3, bounce: 0,
          trail: c, trailW: 0.035, trailLen: 22,
        });
      }
      E.burst({ count: 70, speed: 8, life: 1.6, size: 0.06, color: '#25f4ff', gravity: 2 });
    },
  },

  /* 13 ------------------------------------------------------------------- */
  {
    id: 'butterflies', name: 'Butterfly Bloom', grade: 'epic', duration: 4.6, shake: 0.2,
    palette: ['#ff5d8f', '#ffd166', '#25f4ff', '#c9a0f0', '#3ddc84'],
    desc: 'A cloud of butterflies flutters up and scatters.',
    build: (E) => {
      E.flash('#ffd166', 6, 4);
      E.shock('#ff5d8f', 0.35, 6, 1.0);
      for (let i = 0; i < 30; i++) {
        const a = rnd(0, TAU);
        const c = pick(E.palette);
        E.spawn('butterfly', {
          color: c, color2: '#2a2a32', preset: 'glow', preset2: 'matte',
          scale: rnd(0.9, 1.9),
          x: Math.cos(a) * 0.2, y: rnd(0.0, 0.5), z: Math.sin(a) * 0.2,
          vx: Math.cos(a) * rnd(1.2, 3.4), vy: rnd(2.0, 4.6), vz: Math.sin(a) * rnd(1.2, 3.4),
          sx: 0, sy: rnd(-2, 2), sz: rnd(-0.5, 0.5),
          gravity: 0.6, life: rnd(3.0, 4.4), drag: 0.25, bounce: 0,
          trail: c, trailW: 0.018, trailLen: 16,
        });
      }
    },
  },

  /* 14 ------------------------------------------------------------------- */
  {
    id: 'poof', name: 'Poof', grade: 'rare', duration: 3.2, shake: 0.5,
    palette: ['#ffffff', '#d8d8e0', '#ffd166'],
    desc: 'A puff of smoke, and a top hat pops up out of nowhere.',
    build: (E) => {
      E.flash('#ffffff', 10, 5);
      E.burst({ count: 110, speed: 4.5, life: 1.8, size: 0.11, color: '#ffffff', gravity: -0.8, spread: 1.5 });
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * TAU;
        E.spawn('puff', {
          color: '#e8e8f0', preset: 'matte',
          scale: rnd(1.2, 2.6),
          x: Math.cos(a) * 0.3, y: rnd(0.0, 0.5), z: Math.sin(a) * 0.3,
          vx: Math.cos(a) * rnd(1.5, 4), vy: rnd(1.5, 3.5), vz: Math.sin(a) * rnd(1.5, 4),
          sx: rnd(-1, 1), sy: rnd(-1, 1), sz: rnd(-1, 1),
          gravity: -0.6, life: rnd(1.4, 2.4), drag: 0.7, bounce: 0,
        });
      }
      const hat = E.spawn('tophat', {
        color: '#16161c', preset: 'candy', scale: 2.2,
        x: 0, y: 0.1, z: 0, vx: 0, vy: 6.5, vz: 0, sx: 2, sy: 3, sz: 0,
        gravity: 8, life: 2.4, bounce: 0.5, trail: '#ffd166', trailW: 0.04, trailLen: 18,
      });
      E.timer(() => { if (E.root.parent) E.burst({ count: 40, speed: 5, life: 1.0, color: '#ffd166' }); }, 420);
    },
  },

  /* 15 ------------------------------------------------------------------- */
  {
    id: 'voxel', name: 'Voxel Storm', grade: 'legendary', duration: 4.2, shake: 0.6,
    palette: ['#25f4ff', '#7b5cff', '#ff2d55', '#3ddc84', '#ffd166'],
    desc: 'Forty cubes assemble into a blocky sphere, then blow apart.',
    build: (E) => {
      E.flash('#25f4ff', 9, 5);
      const N = 40, R = 2.2;
      for (let i = 0; i < N; i++) {
        // fibonacci sphere target
        const y = 1 - (i / (N - 1)) * 2;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const th = i * 2.399963;
        const tx = Math.cos(th) * r * R, ty = y * R + 1.6, tz = Math.sin(th) * r * R;
        const a = rnd(0, TAU);
        const rec = E.spawn('voxel', {
          color: pick(E.palette), preset: 'glow',
          scale: rnd(0.9, 1.6),
          x: Math.cos(a) * 7, y: rnd(0.2, 4.5), z: Math.sin(a) * 7,
          vx: 0, vy: 0, vz: 0, sx: rnd(-4, 4), sy: rnd(-4, 4), sz: rnd(-4, 4),
          gravity: 0, life: 1.5, drag: 0, bounce: 0, grow: 0,
          trail: true, trailW: 0.02, trailLen: 10,
        });
        rec.assemble = { tx, ty, tz, t: 0 };
      }
      E.timer(() => {
        if (!E.root.parent) return;
        E.flash('#ffffff', 16, 7);
        E.shock('#7b5cff', 0.4, 11, 1.0);
        for (const o of E.objs) {
          if (!o.assemble) continue;
          const a = rnd(0, TAU), e = rnd(-0.8, 0.9);
          o.gravity = 9; o.drag = 0.02; o.life = rnd(1.8, 3.0); o.maxLife = o.life; o.bounce = 0.4;
          o.vel.set(Math.cos(a) * Math.cos(e) * rnd(5, 13), Math.sin(e) * rnd(5, 11), Math.sin(a) * Math.cos(e) * rnd(5, 13));
          o.spin.set(rnd(-12, 12), rnd(-12, 12), rnd(-12, 12));
        }
        E.burst({ count: 100, speed: 12, life: 1.5, size: 0.08, color: '#25f4ff' });
      }, 1500);
    },
  },

  /* 16 ------------------------------------------------------------------- */
  {
    id: 'kaleido', name: 'Kaleidoscope', grade: 'legendary', duration: 4.4, shake: 0.4,
    palette: ['#ff2d55', '#ffd166', '#25f4ff', '#3ddc84', '#7b5cff', '#ff5d8f'],
    desc: 'Mirrored glass shards spin outward in perfect symmetry.',
    build: (E) => {
      E.flash('#ffffff', 11, 6);
      E.shock('#ff5d8f', 0.4, 9, 1.1);
      for (let ring = 0; ring < 3; ring++) {
        const n = 10 + ring * 4;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * TAU + ring * 0.3;
          const sp = 3.5 + ring * 2.2;
          E.spawn('shard', {
            color: E.palette[(i + ring) % E.palette.length], preset: 'glass',
            scale: rnd(0.8, 2.0) * (1 + ring * 0.3),
            x: Math.cos(a) * 0.15, y: rnd(0.1, 0.6), z: Math.sin(a) * 0.15,
            vx: Math.cos(a) * sp, vy: rnd(2.5, 6), vz: Math.sin(a) * sp,
            sx: rnd(-8, 8), sy: rnd(-8, 8), sz: rnd(-8, 8),
            gravity: 5, life: rnd(2.6, 4.0), drag: 0.18, bounce: 0.3,
            trail: E.palette[(i + ring + 2) % E.palette.length], trailW: 0.026, trailLen: 20,
          });
        }
      }
    },
  },

  /* 17 ------------------------------------------------------------------- */
  {
    id: 'overgrowth', name: 'Overgrowth', grade: 'epic', duration: 4.6, shake: 0.35,
    palette: ['#3ddc84', '#2a8f5a', '#8fd8a0', '#1f6b46', '#ffd166'],
    desc: 'Vines crawl out across the arena floor and burst into leaf.',
    build: (E) => {
      E.flash('#3ddc84', 7, 5);
      E.shock('#3ddc84', 0.4, 9, 1.3);
      for (let i = 0; i < 26; i++) {
        const a = (i / 26) * TAU + rnd(-0.1, 0.1);
        E.spawn('vine', {
          color: pick(E.palette), color2: '#8fd8a0', preset: 'matte', preset2: 'candy',
          scale: rnd(0.9, 2.2),
          x: Math.cos(a) * 0.2, y: 0, z: Math.sin(a) * 0.2,
          vx: Math.cos(a) * rnd(2.5, 6), vy: rnd(1.5, 4.0), vz: Math.sin(a) * rnd(2.5, 6),
          sx: rnd(-4, 4), sy: rnd(-4, 4), sz: rnd(-4, 4),
          gravity: 4.5, life: rnd(3.0, 4.4), drag: 0.25, bounce: 0.25,
          trail: '#3ddc84', trailW: 0.03, trailLen: 18,
        });
      }
      E.burst({ count: 60, speed: 5, life: 2.0, size: 0.06, color: '#8fd8a0', gravity: 3, spread: 1.4 });
    },
  },

  /* 18 ------------------------------------------------------------------- */
  {
    id: 'electro', name: 'Electroshock', grade: 'legendary', duration: 4.0, shake: 0.9,
    palette: ['#25f4ff', '#ffffff', '#7b5cff', '#3ddc84'],
    desc: 'Coil pillars snap to life and arc lightning across the goal.',
    build: (E) => {
      E.flash('#25f4ff', 16, 7);
      E.burst({ count: 90, speed: 9, life: 1.0, size: 0.07, color: '#25f4ff', spread: 1.6 });
      for (let i = 0; i < 14; i++) {
        const a = rnd(0, TAU), r = rnd(0.8, 5);
        E.spawn('bolt', {
          color: pick(E.palette), preset: 'glow',
          scale: rnd(0.9, 2.4),
          x: Math.cos(a) * r, y: rnd(0.4, 3.0), z: Math.sin(a) * r,
          sx: rnd(-14, 14), sy: rnd(-14, 14), sz: rnd(-14, 14),
          vx: rnd(-1, 1), vy: rnd(-0.5, 0.5), vz: rnd(-1, 1),
          gravity: 0, life: rnd(0.5, 1.1), drag: 0, bounce: 0, grow: 0.04,
          trail: '#ffffff', trailW: 0.02, trailLen: 10,
        });
      }
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU;
        E.spawn('voxel', {
          color: '#7b5cff', preset: 'glow', scale: 2.2,
          x: Math.cos(a) * 3.4, y: 0.05, z: Math.sin(a) * 3.4,
          vx: 0, vy: 0, vz: 0, sx: 0, sy: 0, sz: 0,
          gravity: 0, life: 2.6, bounce: 0,
        });
      }
      E.shock('#25f4ff', 0.4, 11, 0.9);
    },
  },

  /* 19 ------------------------------------------------------------------- */
  {
    id: 'nitro', name: 'Nitro Circus', grade: 'epic', duration: 4.0, shake: 0.7,
    palette: ['#25f4ff', '#ff2d55', '#ffd166', '#7b5cff'],
    desc: 'Nitrous bottles rocket out leaving blue flame trails.',
    build: (E) => {
      E.flash('#25f4ff', 11, 6);
      E.shock('#25f4ff', 0.4, 8, 0.9);
      for (let i = 0; i < 18; i++) {
        const a = rnd(0, TAU), sp = rnd(6, 14);
        E.spawn('nitro', {
          color: pick(E.palette), color2: '#c8ced8', preset: 'candy', preset2: 'chrome',
          scale: rnd(0.8, 1.8),
          x: Math.cos(a) * 0.2, y: rnd(0.1, 0.6), z: Math.sin(a) * 0.2,
          vx: Math.cos(a) * sp, vy: rnd(2, 7), vz: Math.sin(a) * sp,
          sx: rnd(-8, 8), sy: rnd(-8, 8), sz: rnd(-8, 8),
          gravity: 7, life: rnd(2.4, 3.6), drag: 0.1, bounce: 0.4,
          trail: '#25f4ff', trailW: 0.055, trailLen: 24,
        });
      }
      for (let i = 0; i < 6; i++) E.timer(() => { if (E.root.parent) E.burst({ count: 30, speed: 6, life: 0.8, color: '#25f4ff' }); }, 300 + i * 220);
    },
  },

  /* 20 ------------------------------------------------------------------- */
  {
    id: 'subzero', name: 'Sub-Zero', grade: 'legendary', duration: 4.2, shake: 0.6,
    palette: ['#bfe8ff', '#8fd8ff', '#dff0ff', '#5a9fd0'],
    desc: 'Ice spikes erupt from the floor and the air freezes solid.',
    build: (E) => {
      E.flash('#bfe8ff', 12, 6);
      E.shock('#8fd8ff', 0.5, 10, 1.2);
      for (let i = 0; i < 20; i++) {
        const a = rnd(0, TAU), r = rnd(0.5, 6);
        E.spawn('spike', {
          color: pick(E.palette), preset: 'glass',
          scale: rnd(1.0, 3.0),
          x: Math.cos(a) * r, y: -0.1, z: Math.sin(a) * r,
          vx: 0, vy: rnd(1.5, 4.5), vz: 0,
          sx: rnd(-2, 2), sy: rnd(-2, 2), sz: rnd(-2, 2),
          gravity: 10, life: rnd(1.6, 2.8), bounce: 0.25, delay: rnd(0, 0.35),
          trail: '#dff0ff', trailW: 0.02, trailLen: 10,
        });
      }
      E.burst({ count: 80, speed: 6, life: 2.4, size: 0.05, color: '#dff0ff', gravity: 1.5, spread: 1.5 });
    },
  },

  /* 21 ------------------------------------------------------------------- */
  {
    id: 'party', name: 'Party Time', grade: 'epic', duration: 4.2, shake: 0.4,
    palette: ['#ff2d55', '#ffd166', '#25f4ff', '#3ddc84', '#ff5d8f', '#7b5cff'],
    desc: 'Party hats, streamers and balloons — a proper mess.',
    build: (E) => {
      E.flash('#ffd166', 9, 5);
      E.shock('#ff5d8f', 0.4, 8, 1.0);
      for (let i = 0; i < 22; i++) {
        const a = rnd(0, TAU), sp = rnd(3, 8);
        E.spawn('partyhat', {
          color: pick(E.palette), color2: '#ffffff', preset: 'candy', preset2: 'glow',
          scale: rnd(0.9, 2.0),
          x: Math.cos(a) * 0.2, y: rnd(0.0, 0.6), z: Math.sin(a) * 0.2,
          vx: Math.cos(a) * sp, vy: rnd(4, 9), vz: Math.sin(a) * sp,
          sx: rnd(-9, 9), sy: rnd(-9, 9), sz: rnd(-9, 9),
          gravity: 8, life: rnd(2.4, 3.8), drag: 0.15, bounce: 0.42,
          trail: true, trailW: 0.03, trailLen: 18,
        });
      }
      E.burst({ count: 100, speed: 8, life: 1.8, size: 0.05, color: '#ffd166', gravity: 4, spread: 1.5 });
    },
  },

  /* 22 ------------------------------------------------------------------- */
  {
    id: 'halo', name: 'Halo Rings', grade: 'legendary', duration: 4.4, shake: 0.3,
    palette: ['#ffd166', '#fff3c0', '#ffb020', '#ffffff'],
    desc: 'Golden rings expand outward, spinning on three different axes.',
    build: (E) => {
      E.flash('#ffd166', 13, 6);
      E.shock('#ffd166', 0.4, 12, 1.3);
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * TAU;
        E.spawn('ring', {
          color: pick(E.palette), preset: 'glow',
          scale: rnd(1.0, 3.0),
          x: Math.cos(a) * 0.3, y: rnd(0.2, 0.8), z: Math.sin(a) * 0.3,
          vx: Math.cos(a) * rnd(2, 5), vy: rnd(2, 5), vz: Math.sin(a) * rnd(2, 5),
          sx: rnd(-6, 6), sy: rnd(-6, 6), sz: rnd(-6, 6),
          gravity: 1.0, life: rnd(2.6, 4.0), drag: 0.2, bounce: 0,
          trail: '#fff3c0', trailW: 0.03, trailLen: 20,
        });
      }
      E.burst({ count: 60, speed: 7, life: 1.6, size: 0.05, color: '#fff3c0', gravity: 1 });
    },
  },

  /* 23 ------------------------------------------------------------------- */
  {
    id: 'bubbles', name: 'Bubble Pop', grade: 'epic', duration: 4.2, shake: 0.25,
    palette: ['#9fd8ff', '#c9f0ff', '#ffffff', '#b0e0d8'],
    desc: 'Iridescent bubbles drift up and pop in sequence.',
    build: (E) => {
      E.flash('#9fd8ff', 6, 4);
      for (let i = 0; i < 34; i++) {
        const a = rnd(0, TAU);
        E.spawn('bubble', {
          color: pick(E.palette), preset: 'glass',
          scale: rnd(0.6, 2.4),
          x: Math.cos(a) * 0.4, y: rnd(-0.2, 0.4), z: Math.sin(a) * 0.4,
          vx: Math.cos(a) * rnd(0.6, 2.4), vy: rnd(1.4, 3.4), vz: Math.sin(a) * rnd(0.6, 2.4),
          sx: rnd(-1, 1), sy: rnd(-1, 1), sz: rnd(-1, 1),
          gravity: -0.8, life: rnd(2.0, 3.6), drag: 0.3, bounce: 0,
          popAt: rnd(0.3, 0.9),
        });
      }
      E.shock('#9fd8ff', 0.3, 5, 1.0);
    },
  },

  /* 24 ------------------------------------------------------------------- */
  {
    id: 'duckstorm', name: 'Duck Storm', grade: 'black market', duration: 4.4, shake: 0.6,
    palette: ['#ffd166', '#ff9f1c', '#ffffff', '#ffb020'],
    desc: 'A tsunami of rubber ducks. Nobody knows why. Everybody loves it.',
    build: (E) => {
      E.flash('#ffd166', 12, 6);
      E.shock('#ff9f1c', 0.5, 9, 1.1);
      for (let i = 0; i < 26; i++) {
        const a = rnd(0, TAU), r = rnd(0.4, 4);
        E.spawn('duck', {
          color: pick(E.palette), color2: '#ff9f1c', preset: 'candy', preset2: 'glow',
          scale: rnd(0.9, 2.4),
          x: Math.cos(a) * r, y: rnd(2.5, 7), z: Math.sin(a) * r,
          vx: rnd(-2, 2), vy: -rnd(1.5, 4), vz: rnd(-2, 2),
          sx: rnd(-8, 8), sy: rnd(-8, 8), sz: rnd(-8, 8),
          gravity: 9, life: rnd(3.0, 4.2), drag: 0.12, bounce: 0.5,
          trail: '#ffd166', trailW: 0.03, trailLen: 16, delay: rnd(0, 0.4),
        });
      }
    },
  },

  /* 25 ------------------------------------------------------------------- */
  {
    id: 'clockwork', name: 'Clockwork', grade: 'legendary', duration: 4.4, shake: 0.45,
    palette: ['#c9a227', '#9d6b3f', '#e8e0cc', '#5b626e'],
    desc: 'Brass gears fly out and mesh together mid-air before scattering.',
    build: (E) => {
      E.flash('#c9a227', 10, 6);
      E.shock('#9d6b3f', 0.4, 9, 1.1);
      for (let i = 0; i < 20; i++) {
        const a = rnd(0, TAU), sp = rnd(2.5, 6);
        E.spawn('gear', {
          color: pick(E.palette), preset: 'gold',
          scale: rnd(0.9, 2.6),
          x: Math.cos(a) * 0.25, y: rnd(0.1, 0.7), z: Math.sin(a) * 0.25,
          vx: Math.cos(a) * sp, vy: rnd(2, 5.5), vz: Math.sin(a) * sp,
          sx: rnd(-4, 4), sy: rnd(-4, 4), sz: rnd(-4, 4),
          gravity: 4, life: rnd(2.8, 4.0), drag: 0.2, bounce: 0.35,
          trail: '#c9a227', trailW: 0.03, trailLen: 18,
        });
      }
      E.burst({ count: 50, speed: 6, life: 1.4, size: 0.05, color: '#e8e0cc', gravity: 3 });
    },
  },

  /* 26 ------------------------------------------------------------------- */
  {
    id: 'skullrain', name: 'Skull Rain', grade: 'black market', duration: 4.4, shake: 0.8,
    palette: ['#e8e0cc', '#8fe8b0', '#3a4a3a', '#ffffff'],
    desc: 'Skulls fall out of the goal mouth leaving sickly green trails.',
    build: (E) => {
      E.flash('#8fe8b0', 11, 6);
      E.shock('#8fe8b0', 0.5, 9, 1.2);
      for (let i = 0; i < 22; i++) {
        const a = rnd(0, TAU), r = rnd(0.3, 4.5);
        E.spawn('skull', {
          color: pick(['#e8e0cc', '#d0c8b0']), color2: '#8fe8b0', preset: 'matte', preset2: 'glow',
          scale: rnd(1.0, 2.4),
          x: Math.cos(a) * r, y: rnd(3, 8), z: Math.sin(a) * r,
          vx: rnd(-1.5, 1.5), vy: -rnd(1, 3), vz: rnd(-1.5, 1.5),
          sx: rnd(-6, 6), sy: rnd(-6, 6), sz: rnd(-6, 6),
          gravity: 10, life: rnd(2.8, 4.2), drag: 0.1, bounce: 0.45,
          trail: '#8fe8b0', trailW: 0.045, trailLen: 20, delay: rnd(0, 0.5),
        });
      }
      E.burst({ count: 60, speed: 7, life: 1.8, size: 0.05, color: '#8fe8b0', gravity: 4, spread: 1.3 });
    },
  },
];

export const CELEBRATION_BY_ID = new Map(CELEBRATIONS.map(c => [c.id, c]));

export function spawnCelebration(THREE, id, opts = {}) {
  const spec = CELEBRATION_BY_ID.get(id) || CELEBRATIONS[0];
  return new GoalExplosion(THREE, spec, opts);
}

export const CELEBRATION_STATS = {
  total: CELEBRATIONS.length,
  objects: OBJECT_KEYS.length,
  withTrails: CELEBRATIONS.length,
};
