/* =============================================================================
 * ultra/signatures.js — one signature detail per car
 * -----------------------------------------------------------------------------
 * 60 cars in the catalogue, 60 distinct details. The base library can vary
 * length, width, height, superellipse power and a few decorations, but the
 * silhouette difference between two cars of the same family is small. What
 * makes a car unmistakable in the showroom is a single thing on it that no
 * other car has: a roof scoop, a tow hook, a row of spotlights, a propeller.
 *
 * The rule is one signature per car id. A second car may use the same builder
 * with different parameters, but two cars never share the same id AND the
 * same params — that pair would look identical from the showroom camera.
 *
 * Every builder reads the body's own stations, then mutates P (paint/dark/
 * chrome/accent/glow). Lamp pass runs last so it can see them when it picks
 * the front and rear of the shell.
 * ===========================================================================*/

import {
  TAU, PI, stationAt, tube, plate, slab, rbox, revolveX, washerX, torusX,
} from '../carLibraryPro.js';

const lerp = (a, b, t) => a + (b - a) * t;
const sign = (v) => (v < 0 ? -1 : v > 0 ? 1 : 0);
const both = (fn) => { fn(1); fn(-1); };

/** The five body archetypes. A car wears at most one, and the family it
 *  belongs to is what tune() spreads its members across — see tune(). */
const ARCHETYPES = ['van_box', 'pickup_bed', 'fastback', 'notchback', 'speedster'];
/** stationAt, clamped. A detail anchored to a wheel can ask for z outside the
 *  body — monster-truck tyres are taller than the car is long — and stationAt
 *  answers zeros there, which strands the whole part at the origin. */
const _sa = stationAt;
const secAt = (st, z) => _sa(st, clamp(z, st[0][0], st[st.length - 1][0]));
/** revolveX and washerX both put their axis on X and cannot be told where to
 *  go. Several details want a drum or a ring somewhere in Z, so: emit it at
 *  the origin, then translate every vertex the call just made. */
const placed = (M, fn, cx, cy, cz) => {
  const from = M.count;
  fn();
  for (let k = from; k < M.count; k++) {
    M.p[k * 3] += cx; M.p[k * 3 + 1] += cy; M.p[k * 3 + 2] += cz;
  }
  return from;
};

/** The cabin's roof line — the top of the greenhouse, tail station first, as
 *  [z, y] pairs, with the half-width to draw a roof at and the crown height.
 *
 *  `meta.cabin` runs rear (-0.5ish) to front (+0.18ish) and carries the same
 *  [z, cy, hw, hh, n] station format as the body. The archetypes are all
 *  changes to this line rather than trim laid on it, so they all start here.
 */
function roofLine(r, st) {
  const cab = (r.meta && r.meta.cabin && r.meta.cabin.length) ? r.meta.cabin : st;
  let hw = 0, top = -Infinity;
  const pts = [];
  for (const p of cab) {
    const y = p[1] + p[3];
    pts.push([p[0], y]);
    if (p[2] > hw) hw = p[2];
    if (y > top) top = y;
  }
  return { hw, top, pts, zBack: cab[0][0], zFront: cab[cab.length - 1][0] };
}

/** Publish the roof an archetype just built.
 *
 *  The rig seats the antenna and the topper on whatever `meta.cabin` says the
 *  roof is, and it walks back from the highest point looking for a station with
 *  nothing above it. An archetype roof is by definition above the old cabin, so
 *  leaving `meta.cabin` alone meant the walk found the new volume in the way at
 *  every station, gave up, and walked FORWARD — 31 of 60 bodies ended up with
 *  the mast over the windscreen, which is the exact placement the user asked to
 *  have removed. Republishing the roof is what makes the rig agree with the
 *  body it is standing on.
 *
 *  `slices` are [z, topY, halfWidth] as the archetype built them, in any order;
 *  flat roofs and sloped ones both work. Two details matter and both were
 *  learned from the verifier:
 *
 *  - Inset from both ends. The roofs are rounded boxes, so the last few
 *    centimetres of each end fall away; a mount placed on the end edge sits in
 *    mid-air and the seat check reports it floating 28 mm above everything.
 *  - Crown the middle. crownIndex() keeps the FIRST maximum, so a perfectly
 *    flat roof puts the crown at its rearmost station and leaves the backward
 *    walk nowhere to go. A few millimetres of crown puts the peak in the
 *    middle, which is both where a roof crowns in reality and where the walk
 *    has stations on either side of it.
 *
 *  Stations are thin (40 mm) because only the TOP line matters: roofSpotAt()
 *  reads cy + hh to find the surface, and the mount needs a point, not a
 *  volume. `n` is the section squareness — a box roof wants a high one. */
function publishRoof(r, slices, n = 6) {
  if (!r.meta || !slices || slices.length < 2) return;
  const p = [...slices].sort((a, b) => a[0] - b[0]);   // tail first
  const k = p.length;
  const at = (t) => {
    const f = t * (k - 1), i = Math.min(k - 2, Math.floor(f)), u = f - i;
    const A = p[i], B = p[i + 1];
    return [lerp(A[0], B[0], u), lerp(A[1], B[1], u), lerp(A[2], B[2], u)];
  };
  const N = 5, out = [];
  for (let i = 0; i < N; i++) {
    const f = i / (N - 1);
    const [z, y, w] = at(0.14 + 0.72 * f);
    const crown = Math.sin(Math.PI * (0.20 + 0.60 * f));
    out.push([z, y + 0.012 * crown, w * (0.90 + 0.10 * crown)]);
  }
  r.meta.cabin = out.map(([z, y, w]) => [z, y - 0.04, Math.max(0.03, w), 0.04, n]);
}

/** Emit a roof as a run of overlapping slices rather than one long box.
 *
 *  Two reasons, and the second is not obvious.
 *
 *  A run follows the hull, where a single slab laid over it floats at the ends.
 *
 *  And `shellTopNear()` — which the rig uses to decide whether a roof station
 *  is clear, and which the seat check uses to find what the mast is standing
 *  on — samples VERTICES within 100 mm. One long rbox has vertices only at its
 *  eight corners, so a mount placed anywhere along its length found nothing
 *  within 100 mm, concluded there was no roof there, and reported the mast
 *  floating 300-460 mm above the car. Slices put vertices every few centimetres
 *  along the whole span, which is what the mount needs to seat at all.
 *
 *  Returns [z, topY, halfWidth] per slice, ready for publishRoof(). */
function roofRun(P, slot, zA, zB, topAt, botAt, wAt, N = 8) {
  const M = P.get(slot);
  const out = [];
  const z0 = Math.min(zA, zB), z1 = Math.max(zA, zB);
  const span = z1 - z0;
  if (span < 0.08) return out;
  const hz = (span / N) * 0.55;      // 10% overlap, so the run has no seams
  for (let i = 0; i < N; i++) {
    const t = (i + 0.5) / N;
    const z = lerp(z0, z1, t);
    const top = topAt(t, z), bot = botAt(t, z), w = wAt(t, z);
    if (!(top > bot) || !(w > 0)) continue;
    rbox(M, 0, (top + bot) / 2, z, w, (top - bot) / 2, hz, 0.02, 4);
    out.push([z, top, w * 0.94]);
  }
  return out;
}

/** Deterministic per-car parameters for an archetype.
 *
 *  This exists because a fixed archetype shape makes things WORSE, not better.
 *  Twelve cars sharing one `fastback` roof converge on one silhouette, and
 *  tools/probe-shapes.mjs showed exactly that: nocturne and mako — both
 *  fastbacks — went from 0.0136 apart to 0.0107 the first time the archetypes
 *  were given real volume. A family read is worth having across families; it
 *  is fatal within one.
 *
 *  Hashing the id per axis is not enough either. Twelve points thrown at
 *  random into a range collide often enough to matter: that version still left
 *  nocturne and wraith at 0.0196. Randomness does not guarantee spread; a
 *  schedule does.
 *
 *  So this is a Latin hypercube. On each axis the family's members are ranked
 *  by a salted hash and each is given its own quantile, which means on every
 *  axis the twelve occupy twelve evenly spaced slots and no two can collide on
 *  all six. Same car, same roof, every time — no state, no RNG. */
function familyMembers(family) {
  if (!_fam.size) {
    // 'hull' is not an archetype: it is every car in the catalogue, because
    // hull shaping applies to all sixty and must spread across all sixty.
    _fam.set('hull', Object.keys(KITS).sort());
    for (const f of ARCHETYPES) {
      const ids = Object.keys(KITS).filter((id) => KITS[id].includes(f)).sort();
      _fam.set(f, ids);
    }
  }
  return _fam.get(family) || [];
}

const _fam = new Map();
const _axisCache = new Map();

function axisQuantile(spec, family, k) {
  const members = familyMembers(family);
  const n = members.length;
  if (n < 2) return 0.5;
  const key = family + '#' + k;
  let order = _axisCache.get(key);
  if (!order) {
    order = [...members].sort((a, b) => hash32(a + '|' + key) - hash32(b + '|' + key));
    _axisCache.set(key, order);
  }
  const i = order.indexOf(spec.id);
  return ((i < 0 ? 0 : i) + 0.5) / n;
}

function hash32(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h;
}

function tune(spec, family) {
  const q = (k) => axisQuantile(spec, family, k);
  return {
    lift: 0.09 + 0.36 * q(0),     // how far the new roof stands above the old
    wide: 0.86 + 0.20 * q(1),     // width of the new roof, x cabin half-width
    reach: 0.10 + 0.26 * q(2),    // how far short of the bumper it stops
    drop: 0.62 + 0.34 * q(3),     // how low the far end of a slope falls
    deck: 0.26 + 0.24 * q(4),     // deck height, x hull half-height at the tail
    tilt: q(5),                   // 0 = boxy, 1 = tapered
    // Shape, not scale. A Latin hypercube spreads the twelve members of a
    // family evenly on every axis, but it cannot stop two of them landing
    // beside each other on ALL of them at once — and two fastbacks whose lift,
    // reach and drop all came out close are two identical ramps. nocturne and
    // mako did exactly that and sat at 0.0148 while their bare hulls were
    // 0.0163 apart, i.e. the roofs were pulling them together. An exponent
    // makes the ramp's SHAPE a parameter, so two cars with the same endpoints
    // still leave the cabin differently.
    exp: 0.52 + 1.56 * q(6),      // < 1 convex, > 1 concave
    arc: q(7),                    // crown position along a box roof
  };
}

/* ========================================================================== *
 *  HULL SHAPING
 * --------------------------------------------------------------------------
 * `tools/probe-shapes.mjs --base` builds every body with all sixty signatures
 * stripped and compares the bare hulls. That run is what settled a question
 * three rounds of bolt-on detail had been failing to answer:
 *
 *     phantom   wraith     0.0020
 *     rallyhawk hooligan   0.0032
 *     dominator breaker    0.0116
 *     nocturne  mako       0.0136
 *
 * 0.0020 of a 2.6 m car is 5 mm. phantom and wraith were not similar, they
 * were the same body — both authored by hand in carLibraryPro.js, both with a
 * near-identical station table. No quantity of roof scoops fixes that: the
 * hull IS the silhouette, and the profile is 28 numbers of which a bolt-on
 * moves maybe five.
 *
 * tools/verify.mjs had a silhouette check the whole time, but it only asked
 * whether the Formula and monster families were as varied as the hand-authored
 * twenty. It never asked whether the hand-authored twenty were varied among
 * themselves, which is precisely where the duplicates were. That gap is now
 * closed by a check over all sixty; this function is what makes it pass.
 *
 * The shaping is four smooth basis profiles over the length of the car, and
 * every car gets its own coefficients for them from the same Latin hypercube
 * the archetypes use — so no two cars are stretched the same way, and no car
 * can collide with another by accident.
 *
 * Amplitudes are deliberately small. This runs on all sixty bodies, including
 * the twenty the user authored by hand, and it has to leave them looking like
 * themselves: heights move by at most ~15%, widths by ~9%, the centreline by
 * ~3 cm. That is enough to separate the clusters and not enough to break the
 * wheel arches, which are cut from whatever hull they are given.
 * ========================================================================== */

/** t = 0 at the tail, 1 at the nose. Any combination is a plausible roofline.
 *
 *  The first four move the curve up and down as a whole. The last two bend it,
 *  which matters more than it sounds: scale alone cannot separate two cars
 *  whose authored tables are already close — it can only make one of them a
 *  slightly larger copy of the other. A bend changes where the body is fat and
 *  where it is thin, and that is what the eye reads as a different car. */
const PROFILE = [
  (t) => 1,                                // uniform scale
  (t) => t - 0.5,                          // rake: nose low, tail high or vice versa
  (t) => Math.sin(Math.PI * t) - 0.63662,  // mid bulge: fat in the middle
  (t) => Math.cos(Math.PI * t),            // contrast: ends against middle
];

/** Build a modulation curve from coefficients in [-1, 1].
 *
 *  Four basis functions, not six. Two extra bends (a quadratic and a
 *  front-loaded term) were tried on the theory that shape separates cars
 *  better than scale, and they made the pack measurably WORSE — the worst pair
 *  in the catalogue fell from 0.0235 to 0.0206 and the Formula family from
 *  0.0317 to 0.0258. Six coefficients sum to a wider range, so more of them
 *  hit the clamp and the curves flatten out towards the same shape. Four
 *  distinct profiles per car is already more than the LHC can spend. */
function curve(coeffs, amt) {
  return (t) => {
    let s = 0;
    for (let i = 0; i < coeffs.length; i++) s += coeffs[i] * PROFILE[i](t);
    return 1 + amt * clamp(s * 0.6, -1.5, 1.5);
  };
}

/**
 * Stretch a spec's station table into its own shape. Returns a new spec; the
 * input is never mutated, so this is idempotent and can be called on every
 * build without the stretch compounding.
 */
export function reshapeSpec(spec) {
  const keys = spec.keys;
  if (!Array.isArray(keys) || keys.length < 3) return spec;
  const q = (k) => axisQuantile(spec, 'hull', k) * 2 - 1;

  const z0 = keys[0][0], z1 = keys[keys.length - 1][0];
  const L = (z1 - z0) || 1;
  const fH = curve([q(0), q(1), q(2), q(3)], 0.22);    // half-height
  const fW = curve([q(4), q(5), q(6), q(7)], 0.13);    // half-width
  const fY = curve([q(8), q(9), q(10), q(11)], 0.045); // centreline rake

  const shaped = keys.map((p) => {
    const t = (p[0] - z0) / L;
    // fY is a SCALE curve — it returns ~1.0 — but the centreline wants an
    // OFFSET, so subtract the unit back out. Adding it raw lifted every hull
    // one metre into the air, and nothing noticed: the silhouette probe
    // normalises by length and measures top-minus-bottom, and a uniform lift
    // changes neither. The rig was what caught it.
    return [p[0], p[1] + (fY(t) - 1), p[2] * fW(t), Math.max(0.03, p[3] * fH(t)), p[4]];
  });

  const next = { ...spec, keys: shaped };
  // The greenhouse is built from its own box, not from the station table, so
  // it has to be re-proportioned separately or the new hull wears the old
  // cabin and the two silhouettes drift apart.
  if (spec.cabin) {
    next.cabin = {
      ...spec.cabin,
      hh: spec.cabin.hh * (0.88 + 0.24 * axisQuantile(spec, 'hull', 12)),
      hw: spec.cabin.hw * (0.90 + 0.20 * axisQuantile(spec, 'hull', 13)),
    };
  }
  return next;
}
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

const D = {
  roof_scoop({ P, st, r, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('paint'), D = P.get('dark');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : st;
    const cz = lerp(cab[0][0], cab[cab.length - 1][0], 0.55);
    const s = secAt(st, cz);
    const maxHw = Math.max(...cab.map((p) => p[2]));
    const maxHh = Math.max(...cab.map((p) => p[3]));
    rbox(C, 0, s[1] + maxHh * 0.88, cz, maxHw * 0.40, 0.07, maxHw * 0.55, 0.022, 5);
    rbox(D, 0, s[1] + maxHh * 0.96, cz, maxHw * 0.32, 0.045, maxHw * 0.42, 0.018, 4);
  },
  hood_scoop({ P, st }) {
    const C = P.get('paint'), D = P.get('dark');
    const z = lerp(st[0][0], st[st.length - 1][0], 0.65);
    const s = secAt(st, z);
    const x = s[2] * 0.55;
    rbox(C, 0, s[1] + s[3] * 0.78, z, x, 0.06, s[2] * 0.45, 0.02, 5);
    rbox(D, 0, s[1] + s[3] * 0.90, z, x * 0.7, 0.012, s[2] * 0.30, 0.008, 4);
  },
  spotlight_bar({ P, st, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('paint'), L = P.get('head');
    const z = st[st.length - 1][0] - 0.04;
    const s = secAt(st, z);
    const hw = s[2] * 1.10;
    rbox(C, 0, s[1] + s[3] * 0.45, z, hw, 0.05, 0.06, 0.012, 4);
    for (const sd of [1, -1]) {
      for (let i = 0; i < 2; i++) {
        const lx = lerp(-hw * 0.6, hw * 0.6, i) + sd * hw * 0.15;
        const from = L.count;
        revolveX(L, [[z + 0.06, 0.034], [z + 0.075, 0.020], [z + 0.080, 0]], 14, 1, false, true);
        const base = L.count;
        for (let k = from; k < base; k++) {
          const y = L.p[k * 3 + 1], zz = L.p[k * 3 + 2];
          L.p[k * 3] = lx; L.p[k * 3 + 1] = s[1] + s[3] * 0.50 + y; L.p[k * 3 + 2] = z + zz;
        }
      }
    }
  },
  bullbar({ P, st }) {
    const C = P.get('chrome');
    const z = st[st.length - 1][0] - 0.02;
    const s = secAt(st, z);
    const hw = s[2] * 1.15;
    rbox(C, 0, s[1] + s[3] * 0.30, z, hw, 0.035, 0.045, 0.010, 4);
    for (const sd of [1, -1]) tube(C, [sd * hw * 1.08, s[1] + s[3] * 0.30, z], [sd * hw * 1.08, s[1] + s[3] * 0.95, z + 0.10], 0.018, 0.012, 7);
  },
  side_pipes({ P, st }) {
    const C = P.get('chrome');
    const z0 = lerp(st[0][0], st[st.length - 1][0], 0.10);
    const z1 = lerp(st[0][0], st[st.length - 1][0], 0.78);
    const s0 = secAt(st, z0);
    for (const sd of [1, -1]) {
      const x = sd * s0[2] * 1.02;
      tube(C, [x, s0[1] - s0[3] * 0.65, z0], [x, s0[1] - s0[3] * 0.65, z1], 0.022, 0.022, 8);
      const sz = secAt(st, z1);
      const from = C.count;
      revolveX(C, [[z1 + 0.04, 0.028], [z1 + 0.06, 0.020], [z1 + 0.080, 0]], 16, 1, false, true);
      const base = C.count;
      for (let k = from; k < base; k++) {
        const y = C.p[k * 3 + 1], zz = C.p[k * 3 + 2];
        C.p[k * 3] = x; C.p[k * 3 + 1] = sz[1] - sz[3] * 0.65 + y; C.p[k * 3 + 2] = z1 + zz;
      }
    }
  },
  rear_diffuser({ P, st }) {
    const D = P.get('dark');
    const z = lerp(st[0][0], st[st.length - 1][0], 0.04);
    const s = secAt(st, z);
    for (let i = 0; i < 5; i++) {
      const x = lerp(-s[2] * 0.80, s[2] * 0.80, i / 4);
      rbox(D, x, s[1] - s[3] * 0.95, z - 0.02, 0.010, 0.07, 0.06, 0.005, 3);
    }
  },
  side_canards({ P, st, r }) {
    const C = P.get('paint');
    for (const w of r.meta.wheels) {
      const sd = sign(w.x);
      const s = secAt(st, w.z + w.r * 0.45);
      slab(C, [
        [sd * s[2] * 1.04, s[1] - s[3] * 0.55, w.z + w.r * 0.30],
        [sd * s[2] * 1.18, s[1] - s[3] * 0.42, w.z + w.r * 0.42],
        [sd * s[2] * 1.22, s[1] - s[3] * 0.20, w.z + w.r * 0.60],
        [sd * s[2] * 1.06, s[1] - s[3] * 0.30, w.z + w.r * 0.55],
      ], 0.012);
    }
  },
  roof_rails({ P, st, r, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('chrome');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : st;
    const z0 = cab[0][0], z1 = cab[cab.length - 1][0];
    const maxHw = Math.max(...cab.map((p) => p[2]));
    const maxHh = Math.max(...cab.map((p) => p[3]));
    const cz = (z0 + z1) / 2;
    const s = secAt(st, cz);
    for (const sd of [1, -1]) tube(C, [sd * maxHw * 0.95, s[1] + maxHh * 0.90, z0 + 0.04], [sd * maxHw * 0.95, s[1] + maxHh * 0.90, z1 - 0.04], 0.012, 0.012, 8);
  },
  roof_rack({ P, st, r, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('dark');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : st;
    const z0 = cab[0][0] + 0.10, z1 = cab[cab.length - 1][0] - 0.10;
    const maxHw = Math.max(...cab.map((p) => p[2]));
    const maxHh = Math.max(...cab.map((p) => p[3]));
    const cz = (z0 + z1) / 2;
    const s = secAt(st, cz);
    slab(C, [
      [-maxHw * 0.92, s[1] + maxHh * 0.98, z0],
      [maxHw * 0.92, s[1] + maxHh * 0.98, z0],
      [maxHw * 0.86, s[1] + maxHh * 0.98, z1],
      [-maxHw * 0.86, s[1] + maxHh * 0.98, z1],
    ], 0.012);
    for (const sd of [1, -1]) for (let i = 0; i < 3; i++) {
      const z = lerp(z0, z1, i / 2);
      tube(C, [sd * maxHw * 0.95, s[1] + maxHh * 0.98, z], [sd * maxHw * 0.95, s[1] + maxHh * 1.05, z], 0.008, 0.008, 4);
    }
  },
  antenna_array({ P, st, r, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('chrome');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : st;
    const z = lerp(cab[0][0], cab[cab.length - 1][0], 0.55);
    const s = secAt(st, z);
    const maxHw = Math.max(...cab.map((p) => p[2]));
    const maxHh = Math.max(...cab.map((p) => p[3]));
    for (let i = 0; i < 4; i++) {
      const x = lerp(-maxHw * 0.7, maxHw * 0.7, i / 3);
      const h = 0.10 + (i % 2) * 0.04;
      tube(C, [x, s[1] + maxHh * 0.92, z], [x, s[1] + maxHh * 0.92 + h, z], 0.007, 0.003, 4);
    }
  },
  roof_light_bar({ P, st, r, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('paint'), L = P.get('head');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : st;
    const z = lerp(cab[0][0], cab[cab.length - 1][0], 0.50);
    const s = secAt(st, z);
    const maxHw = Math.max(...cab.map((p) => p[2]));
    const maxHh = Math.max(...cab.map((p) => p[3]));
    rbox(C, 0, s[1] + maxHh * 1.06, z, maxHw * 0.85, 0.04, 0.10, 0.012, 4);
    for (let i = 0; i < 6; i++) {
      const lx = lerp(-maxHw * 0.75, maxHw * 0.75, i / 5);
      const from = L.count;
      revolveX(L, [[z + 0.08, 0.020], [z + 0.092, 0.012], [z + 0.094, 0]], 12, 1, false, true);
      const base = L.count;
      for (let k = from; k < base; k++) {
        const y = L.p[k * 3 + 1], zz = L.p[k * 3 + 2];
        L.p[k * 3] = lx; L.p[k * 3 + 1] = s[1] + maxHh * 1.02 + y; L.p[k * 3 + 2] = z + zz;
      }
    }
  },
  roof_vent({ P, st, r, spec }) {
    if (spec.exposedWheels) return;
    const D = P.get('dark'), C = P.get('chrome');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : st;
    const z = lerp(cab[0][0], cab[cab.length - 1][0], 0.45);
    const s = secAt(st, z);
    const maxHw = Math.max(...cab.map((p) => p[2]));
    const maxHh = Math.max(...cab.map((p) => p[3]));
    rbox(D, 0, s[1] + maxHh * 0.96, z, 0.05, 0.025, 0.05, 0.01, 4);
    rbox(C, 0, s[1] + maxHh * 1.04, z, 0.075, 0.025, 0.075, 0.012, 4);
  },
  sun_visor({ P, st, r, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('dark');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : st;
    const z = cab[0][0] + 0.05;
    const s = secAt(st, z);
    const maxHw = Math.max(...cab.map((p) => p[2]));
    const maxHh = Math.max(...cab.map((p) => p[3]));
    slab(C, [
      [-maxHw * 0.90, s[1] + maxHh * 0.50, z],
      [maxHw * 0.90, s[1] + maxHh * 0.50, z],
      [maxHw * 0.78, s[1] + maxHh * 0.78, z + 0.06],
      [-maxHw * 0.78, s[1] + maxHh * 0.78, z + 0.06],
    ], 0.012);
  },
  mud_flaps({ P, st, r }) {
    const D = P.get('dark');
    for (const w of r.meta.wheels) {
      if (!w.steer) continue;
      const sd = sign(w.x);
      const s = secAt(st, w.z - w.r * 0.95);
      slab(D, [
        [sd * s[2] * 0.92, s[1] + s[3] * 0.20, w.z - w.r * 1.10],
        [sd * s[2] * 0.96, s[1] + s[3] * 0.20, w.z - w.r * 1.10],
        [sd * s[2] * 0.96, s[1] - s[3] * 0.95, w.z - w.r * 0.30],
        [sd * s[2] * 0.92, s[1] - s[3] * 0.95, w.z - w.r * 0.30],
      ], 0.008);
    }
  },
  studded_tyres({ P, st, r }) {
    const D = P.get('chrome');
    for (const w of r.meta.wheels) {
      const sd = sign(w.x);
      const segs = 18;
      for (let i = 0; i < segs; i++) {
        const a = (i / segs) * TAU;
        const y = w.y + Math.cos(a) * w.r * 1.05;
        const zz = w.z + Math.sin(a) * w.r * 1.05;
        const s = secAt(st, zz);
        const x = sd * (s[2] * 0.99 + 0.02);
        tube(D, [x * 0.95, y, zz], [x * 1.10, y, zz], 0.008, 0.004, 3);
      }
    }
  },
  spare_wheel({ P, st, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('chrome'), D = P.get('dark');
    const z = lerp(st[0][0], st[st.length - 1][0], 0.04);
    const s = secAt(st, z);
    const mz = z - 0.08, cy = s[1] + s[3] * 0.25;
    placed(D, () => revolveX(D, [[-0.05, 0.20], [-0.06, 0.24], [0.06, 0.24], [0.05, 0.20]], 24, 1, false, false), 0, cy, mz);
    placed(C, () => washerX(C, 0.05, 0.008, 0.14, 0.20, 20), 0, cy, mz);
    rbox(D, 0, cy, mz, 0.16, 0.020, 0.18, 0.008, 4);
  },
  jerry_cans({ P, st, r }) {
    const D = P.get('paint'), L = P.get('chrome');
    for (const sd of [1, -1]) {
      const w = r.meta.wheels[0];
      for (let i = 0; i < 3; i++) {
        const z = w.z - w.r * (0.4 + i * 0.5);
        const sz = secAt(st, z);
        const x = sd * sz[2] * 1.04;
        rbox(D, x, sz[1] - sz[3] * 0.30, z, 0.08, 0.13, 0.10, 0.018, 4);
        rbox(L, x + sd * 0.085, sz[1] - sz[3] * 0.16, z, 0.008, 0.04, 0.04, 0.005, 3);
      }
    }
  },
  toolbox({ P, st, r, spec }) {
    const D = P.get('chrome');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : null;
    const z = cab ? cab[0][0] - 0.12 : st[0][0] + (st[st.length - 1][0] - st[0][0]) * 0.18;
    const s = secAt(st, z);
    const maxHw = Math.max(...st.map((p) => p[2]));
    rbox(D, 0, s[1] + s[3] * 0.78, z, maxHw * 0.55, 0.10, 0.32, 0.018, 4);
    for (const sd of [1, -1]) tube(D, [sd * maxHw * 0.54, s[1] + s[3] * 0.88, z], [sd * maxHw * 0.54, s[1] + s[3] * 0.88, z + 0.30], 0.006, 0.006, 4);
  },
  tow_hook({ P, st }) {
    const C = P.get('chrome');
    const z = lerp(st[0][0], st[st.length - 1][0], 0.06);
    const s = secAt(st, z);
    const hy = s[1] - s[3] * 0.95;
    tube(C, [0, s[1] - s[3] * 0.45, z + 0.10], [0, hy, z + 0.04], 0.024, 0.024, 7);
    placed(C, () => revolveX(C, [[0, 0.024], [0, 0.038]], 14, 1, false, false), 0, hy, z + 0.02);
  },
  winch({ P, st, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('chrome'), D = P.get('dark');
    const z = st[st.length - 1][0] - 0.02;
    const s = secAt(st, z);
    const cy = s[1] - s[3] * 0.85;
    placed(D, () => revolveX(D, [[-0.05, 0.10], [0.05, 0.10], [0.05, 0.12], [-0.05, 0.12]], 20, 1, false, false), 0, cy, z + 0.06);
    placed(C, () => washerX(C, 0.05, 0.010, 0.07, 0.12, 18), 0, cy, z + 0.06);
    tube(C, [0, cy, z + 0.11], [0, cy, z - 0.10], 0.008, 0.008, 6);
  },
  snow_plough({ P, st, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('chrome'), D = P.get('dark');
    const z = st[st.length - 1][0] + 0.04;
    const s = secAt(st, z - 0.10);
    const hw = s[2] * 1.40;
    slab(C, [
      [-hw, s[1] - s[3] * 0.55, z],
      [hw, s[1] - s[3] * 0.55, z],
      [hw * 0.85, s[1] - s[3] * 0.55, z - 0.18],
      [-hw * 0.85, s[1] - s[3] * 0.55, z - 0.18],
    ], 0.020);
    slab(D, [
      [-hw, s[1] - s[3] * 0.96, z],
      [hw, s[1] - s[3] * 0.96, z],
      [hw * 0.85, s[1] - s[3] * 0.96, z - 0.18],
      [-hw * 0.85, s[1] - s[3] * 0.96, z - 0.18],
    ], 0.012);
  },
  mud_spikes({ P, st, r }) {
    const D = P.get('chrome');
    for (const w of r.meta.wheels) {
      const sd = sign(w.x);
      const segs = 7;
      for (let i = 0; i < segs; i++) {
        const a = (i / segs) * PI - PI / 2;
        const z = w.z + Math.sin(a) * w.r * 1.06;
        const y = w.y + Math.cos(a) * w.r * 1.06;
        const s = secAt(st, z);
        const x = sd * (s[2] * 0.96 + 0.03);
        tube(D, [x, y, z], [x * 1.10, y, z], 0.010, 0.004, 4);
      }
    }
  },
  chassis_brace({ P, st, r }) {
    const C = P.get('chrome');
    for (const sd of [1, -1]) {
      const w0 = r.meta.wheels[sd > 0 ? 0 : 1];
      const w1 = r.meta.wheels[sd > 0 ? 2 : 3];
      const s0 = secAt(st, w0.z), s1 = secAt(st, w1.z);
      tube(C, [sd * s0[2] * 0.55, s0[1] - s0[3] * 0.95, w0.z], [sd * s1[2] * 0.55, s1[1] - s1[3] * 0.95, w1.z], 0.018, 0.018, 8);
    }
  },
  vortex_generators({ P, st, r, spec }) {
    if (spec.exposedWheels) return;
    const D = P.get('dark');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : st;
    const z = cab[cab.length - 1][0] - 0.04;
    const s = secAt(st, z);
    const maxHw = Math.max(...cab.map((p) => p[2]));
    const maxHh = Math.max(...cab.map((p) => p[3]));
    for (let i = 0; i < 5; i++) {
      const x = lerp(-maxHw * 0.8, maxHw * 0.8, i / 4);
      tube(D, [x, s[1] + maxHh * 0.95, z], [x, s[1] + maxHh * 0.95 + 0.045, z], 0.006, 0.012, 3);
    }
  },
  rear_louvres({ P, st, r, spec }) {
    if (spec.exposedWheels) return;
    const D = P.get('dark');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : st;
    const z = lerp(cab[0][0], cab[cab.length - 1][0], 0.25);
    const s = secAt(st, z);
    const maxHw = Math.max(...cab.map((p) => p[2]));
    const maxHh = Math.max(...cab.map((p) => p[3]));
    for (let i = 0; i < 5; i++) {
      const y = s[1] + maxHh * (0.30 + i * 0.12);
      slab(D, [
        [-maxHw * 0.80, y, z],
        [maxHw * 0.80, y, z],
        [maxHw * 0.80, y, z - 0.02],
        [-maxHw * 0.80, y, z - 0.02],
      ], 0.006);
    }
  },
  exhaust_flame_kit({ P, st }) {
    const D = P.get('glow');
    const z = lerp(st[0][0], st[st.length - 1][0], 0.02);
    const s = secAt(st, z);
    for (const sd of [1, -1]) {
      const x = sd * s[2] * 0.78;
      rbox(D, x, s[1] - s[3] * 0.78, z, 0.025, 0.012, 0.025, 0.006, 4);
    }
  },
  headlight_guards({ P, st, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('chrome');
    const z = st[st.length - 1][0];
    const s = secAt(st, z);
    for (const sd of [1, -1]) {
      const x = sd * s[2] * 0.74;
      tube(C, [x, s[1] - s[3] * 0.20, z + 0.05], [x, s[1] + s[3] * 0.90, z + 0.05], 0.010, 0.010, 6);
      tube(C, [x, s[1] + s[3] * 0.90, z + 0.05], [x * 0.6, s[1] + s[3] * 0.95, z + 0.10], 0.010, 0.010, 6);
    }
  },
  fuel_cell({ P, st }) {
    const C = P.get('chrome'), D = P.get('dark');
    const z = st[0][0] - 0.04;
    const s = secAt(st, z);
    const maxHw = Math.max(...st.map((p) => p[2]));
    const cy = s[1] + s[3] * 0.70;
    placed(D, () => revolveX(D, [[-0.34, 0.16], [-0.28, 0.20], [0.28, 0.20], [0.34, 0.16]], 20, 1, true, true), 0, cy, z);
    for (const sd of [1, -1]) tube(C, [sd * maxHw * 0.50, cy, z - 0.10], [sd * maxHw * 0.50, cy, z + 0.10], 0.012, 0.012, 6);
  },
  mud_flaps_heavy({ P, st, r }) {
    const D = P.get('dark');
    for (const w of r.meta.wheels) {
      const sd = sign(w.x);
      const s = secAt(st, w.z - w.r * 0.95);
      slab(D, [
        [sd * s[2] * 0.96, s[1] + s[3] * 0.40, w.z - w.r * 1.20],
        [sd * s[2] * 1.00, s[1] + s[3] * 0.40, w.z - w.r * 1.20],
        [sd * s[2] * 1.00, s[1] - s[3] * 1.05, w.z - w.r * 0.10],
        [sd * s[2] * 0.96, s[1] - s[3] * 1.05, w.z - w.r * 0.10],
      ], 0.012);
    }
  },
  rocket_boosters({ P, st }) {
    const C = P.get('chrome');
    const z = lerp(st[0][0], st[st.length - 1][0], 0.02);
    const s = secAt(st, z);
    for (const sd of [1, -1]) {
      const x = sd * s[2] * 0.66;
      const from = C.count;
      revolveX(C, [[z - 0.02, 0.060], [z + 0.04, 0.060], [z + 0.10, 0.055], [z + 0.12, 0.050]], 16, 1, true, true);
      const base = C.count;
      for (let k = from; k < base; k++) {
        const y = C.p[k * 3 + 1], zz = C.p[k * 3 + 2];
        C.p[k * 3] = x; C.p[k * 3 + 1] = s[1] + s[3] * 0.70 + y; C.p[k * 3 + 2] = z + zz;
      }
    }
  },
  flags({ P, st, r, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('chrome'), D = P.get('dark');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : st;
    const z = lerp(cab[0][0], cab[cab.length - 1][0], 0.50);
    const s = secAt(st, z);
    const maxHw = Math.max(...cab.map((p) => p[2]));
    const maxHh = Math.max(...cab.map((p) => p[3]));
    for (const x of [-maxHw * 0.70, maxHw * 0.70]) {
      tube(C, [x, s[1] + maxHh * 0.92, z], [x, s[1] + maxHh * 1.25, z], 0.005, 0.005, 4);
      slab(D, [[x, s[1] + maxHh * 1.25, z], [x + 0.10, s[1] + maxHh * 1.18, z], [x + 0.12, s[1] + maxHh * 1.05, z], [x + 0.01, s[1] + maxHh * 1.05, z]], 0.003);
    }
  },
  snorkel({ P, st, r, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('chrome');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : st;
    const z = cab[0][0] + 0.06;
    const s = secAt(st, z);
    const maxHw = Math.max(...cab.map((p) => p[2]));
    const maxHh = Math.max(...cab.map((p) => p[3]));
    tube(C, [maxHw * 0.88, s[1] - s[3] * 0.55, z + 0.10], [maxHw * 0.88, s[1] + maxHh * 1.05, z + 0.02], 0.020, 0.020, 8);
    const from = C.count;
    revolveX(C, [[z + 0.02, 0.025], [z + 0.05, 0.018], [z + 0.07, 0]], 12, 1, false, true);
    const base = C.count;
    for (let k = from; k < base; k++) {
      const y = C.p[k * 3 + 1], zz = C.p[k * 3 + 2];
      C.p[k * 3] = maxHw * 0.88; C.p[k * 3 + 1] = s[1] + maxHh * 1.05 + y; C.p[k * 3 + 2] = z + zz;
    }
  },
  rock_studded({ P, st, r }) {
    const D = P.get('dark');
    const z = lerp(st[0][0], st[st.length - 1][0], 0.10);
    const s = secAt(st, z);
    const n = 22;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU;
      const y = s[1] + Math.cos(a) * 0.08, zz = z + Math.sin(a) * 0.08;
      tube(D, [0, y + 0.005, zz], [Math.cos(a) * 0.045, y + 0.020, zz + Math.sin(a) * 0.045], 0.012, 0.006, 3);
    }
  },
  /* ---- Formula-native details -------------------------------------------
   * The ten open-wheel bodies have no cabin and no roof, so a roof scoop or a
   * set of louvres silently emits nothing on them — six cars were coming out
   * of the pass with no signature at all. These six live in the Formula
   * language instead: fins, airboxes, halos, bargeboards. */
  shark_fin({ P, st }) {
    const D = P.get('dark');
    const z0 = lerp(st[0][0], st[st.length - 1][0], 0.30);
    const z1 = lerp(st[0][0], st[st.length - 1][0], 0.86);
    const s0 = secAt(st, z0), s1 = secAt(st, z1);
    const y0 = s0[1] + s0[3] * 0.90, y1 = s1[1] + s1[3] * 0.90;
    slab(D, [[0, y0, z0], [0, y0 + 0.17, z0 + 0.06], [0, y1 + 0.11, z1 - 0.02], [0, y1, z1]], 0.014, 'x');
  },
  airbox({ P, st }) {
    const D = P.get('dark'), C = P.get('chrome');
    const z = lerp(st[0][0], st[st.length - 1][0], 0.62);
    const s = secAt(st, z);
    const y = s[1] + s[3] * 0.95;
    rbox(D, 0, y + 0.05, z, s[2] * 0.55, 0.09, 0.16, 0.02, 4);
    rbox(C, 0, y + 0.10, z + 0.02, s[2] * 0.40, 0.012, 0.12, 0.008, 4);
  },
  halo({ P, st }) {
    const D = P.get('dark');
    const z = lerp(st[0][0], st[st.length - 1][0], 0.70);
    const s = secAt(st, z);
    const y = s[1] + s[3] * 0.95, hw = s[2] * 0.95, segs = 10;
    for (let i = 0; i < segs; i++) {
      const a0 = -PI / 2 + (i / segs) * PI, a1 = -PI / 2 + ((i + 1) / segs) * PI;
      tube(D, [Math.cos(a0) * hw, y + Math.sin(a0) * 0.10 + 0.11, z],
        [Math.cos(a1) * hw, y + Math.sin(a1) * 0.10 + 0.11, z], 0.012, 0.012, 6);
    }
    for (const sd of [1, -1]) tube(D, [sd * hw, y + 0.11, z], [sd * hw * 0.90, y, z - 0.20], 0.012, 0.012, 6);
  },
  t_wing({ P, st }) {
    const C = P.get('carbon'), D = P.get('dark');
    const z = lerp(st[0][0], st[st.length - 1][0], 0.10);
    const s = secAt(st, z);
    const y = s[1] + s[3] * 0.95;
    for (const sd of [1, -1]) tube(D, [sd * 0.06, y, z], [sd * 0.06, y + 0.12, z], 0.010, 0.010, 5);
    slab(C, [[-0.22, y + 0.13, z - 0.02], [0.22, y + 0.13, z - 0.02], [0.20, y + 0.13, z + 0.06], [-0.20, y + 0.13, z + 0.06]], 0.008);
  },
  bargeboards({ P, st }) {
    const C = P.get('carbon');
    const z = lerp(st[0][0], st[st.length - 1][0], 0.72);
    const s = secAt(st, z);
    const y0 = s[1] - s[3] * 0.60, y1 = s[1] + s[3] * 0.20;
    for (const sd of [1, -1]) {
      slab(C, [[sd * (s[2] + 0.16), y0, z + 0.10], [sd * (s[2] + 0.16), y1, z + 0.10],
        [sd * (s[2] + 0.10), y1, z - 0.14], [sd * (s[2] + 0.10), y0, z - 0.14]], 0.010, 'x');
    }
  },
  mirror_stalks({ P, st }) {
    const C = P.get('chrome'), D = P.get('dark');
    const z = lerp(st[0][0], st[st.length - 1][0], 0.78);
    const s = secAt(st, z);
    const y = s[1] + s[3] * 0.55;
    for (const sd of [1, -1]) {
      tube(C, [sd * s[2] * 0.95, y, z], [sd * (s[2] + 0.16), y + 0.05, z + 0.04], 0.008, 0.008, 5);
      rbox(D, sd * (s[2] + 0.19), y + 0.06, z + 0.05, 0.030, 0.045, 0.070, 0.010, 4);
    }
  },
  /* ---- one-off variants -------------------------------------------------
   * Nineteen families turned out to be shared by two or three cars, which
   * defeats the point: two cars with the same detail are two cars you cannot
   * tell apart. Each of these is the same idea pushed somewhere the base
   * builder does not go — a different count, a different axis, a second one.
   * They are written out rather than parameterised because the difference has
   * to be geometry, not a flag nobody reads. */
  mud_flaps_wide({ P, st, r }) {
    const D = P.get('dark');
    for (const w of r.meta.wheels) {
      const sd = sign(w.x);
      const s = secAt(st, w.z - w.r * 0.95);
      slab(D, [[sd * s[2] * 0.99, s[1] + s[3] * 0.45, w.z - w.r * 1.30], [sd * s[2] * 0.99, s[1] + s[3] * 0.45, w.z - w.r * 0.05],
        [sd * s[2] * 0.99, s[1] - s[3] * 1.00, w.z - w.r * 0.05], [sd * s[2] * 0.99, s[1] - s[3] * 1.00, w.z - w.r * 1.30]], 0.014, 'x');
    }
  },
  mud_flaps_xl({ P, st, r }) {
    const D = P.get('dark'), C = P.get('chrome');
    for (const w of r.meta.wheels) {
      const sd = sign(w.x);
      const s = secAt(st, w.z - w.r * 0.95);
      slab(D, [[sd * s[2] * 0.99, s[1] + s[3] * 0.50, w.z - w.r * 1.45], [sd * s[2] * 0.99, s[1] + s[3] * 0.50, w.z + w.r * 0.05],
        [sd * s[2] * 0.99, s[1] - s[3] * 1.15, w.z + w.r * 0.05], [sd * s[2] * 0.99, s[1] - s[3] * 1.15, w.z - w.r * 1.45]], 0.016, 'x');
      tube(C, [sd * (s[2] * 0.99 + 0.008), s[1] - s[3] * 1.10, w.z - w.r * 1.35], [sd * (s[2] * 0.99 + 0.008), s[1] - s[3] * 1.10, w.z - w.r * 0.25], 0.012, 0.012, 6);
    }
  },
  plough_ramp({ P, st, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('chrome');
    const z = st[st.length - 1][0] + 0.10;
    const s = secAt(st, z - 0.16);
    const hw = s[2] * 1.30;
    slab(C, [[-hw, s[1] - s[3] * 1.00, z], [hw, s[1] - s[3] * 1.00, z],
      [hw * 0.90, s[1] + s[3] * 0.10, z - 0.34], [-hw * 0.90, s[1] + s[3] * 0.10, z - 0.34]], 0.016);
  },
  canards_wide({ P, st, r }) {
    const C = P.get('paint');
    const z0 = st[st.length - 1][0];
    const s0 = secAt(st, z0);
    for (const sd of [1, -1]) {
      slab(C, [[sd * s0[2] * 1.00, s0[1] + s0[3] * 0.20, z0 - 0.02], [sd * (s0[2] + 0.22), s0[1] + s0[3] * 0.34, z0 + 0.04],
        [sd * (s0[2] + 0.20), s0[1] + s0[3] * 0.34, z0 - 0.10], [sd * s0[2] * 1.00, s0[1] + s0[3] * 0.20, z0 - 0.14]], 0.010);
    }
    for (const w of r.meta.wheels) {
      const sd = sign(w.x);
      const s = secAt(st, w.z);
      slab(C, [[sd * s[2] * 1.04, s[1] - s[3] * 0.60, w.z + w.r * 0.50], [sd * (s[2] + 0.16), s[1] - s[3] * 0.45, w.z + w.r * 0.62],
        [sd * (s[2] + 0.16), s[1] - s[3] * 0.30, w.z + w.r * 0.70], [sd * s[2] * 1.04, s[1] - s[3] * 0.42, w.z + w.r * 0.62]], 0.009);
    }
  },
  toolbox_twin({ P, st, r }) {
    const D = P.get('chrome');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : null;
    const z = cab ? cab[0][0] - 0.12 : st[0][0] + (st[st.length - 1][0] - st[0][0]) * 0.18;
    const s = secAt(st, z);
    const hw = Math.max(...st.map((p) => p[2]));
    for (const sd of [1, -1]) {
      rbox(D, sd * hw * 0.52, s[1] + s[3] * 0.74, z, hw * 0.34, 0.09, 0.26, 0.016, 4);
      tube(D, [sd * hw * 0.52, s[1] + s[3] * 0.83, z - 0.12], [sd * hw * 0.52, s[1] + s[3] * 0.83, z + 0.12], 0.005, 0.005, 4);
    }
  },
  light_bar_narrow({ P, st, r, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('paint'), L = P.get('head');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : st;
    const z = lerp(cab[0][0], cab[cab.length - 1][0], 0.50);
    const s = secAt(st, z);
    const maxHw = Math.max(...cab.map((p) => p[2])), maxHh = Math.max(...cab.map((p) => p[3]));
    rbox(C, 0, s[1] + maxHh * 1.12, z, maxHw * 0.55, 0.022, 0.05, 0.010, 4);
    for (let i = 0; i < 8; i++) {
      const lx = lerp(-maxHw * 0.48, maxHw * 0.48, i / 7);
      const from = L.count;
      revolveX(L, [[z + 0.05, 0.014], [z + 0.058, 0.008], [z + 0.060, 0]], 10, 1, false, true);
      const base = L.count;
      for (let k = from; k < base; k++) {
        const y = L.p[k * 3 + 1], zz = L.p[k * 3 + 2];
        L.p[k * 3] = lx; L.p[k * 3 + 1] = s[1] + maxHh * 1.09 + y; L.p[k * 3 + 2] = z + zz;
      }
    }
  },
  jerry_cans_four({ P, st, r }) {
    const D = P.get('paint'), L = P.get('chrome');
    for (const sd of [1, -1]) {
      const w = r.meta.wheels[0];
      for (let i = 0; i < 2; i++) {
        const z = w.z - w.r * (0.3 + i * 0.7);
        const sz = secAt(st, z);
        const x = sd * sz[2] * 1.05;
        rbox(D, x, sz[1] - sz[3] * 0.22, z, 0.09, 0.15, 0.11, 0.020, 4);
        rbox(D, x, sz[1] + sz[3] * 0.06, z, 0.09, 0.13, 0.10, 0.020, 4);
        tube(L, [x - 0.045, sz[1] - sz[3] * 0.30, z], [x + 0.045, sz[1] - sz[3] * 0.30, z], 0.006, 0.006, 4);
      }
    }
  },
  flag_single({ P, st, r, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('chrome'), D = P.get('dark');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : st;
    const z = lerp(cab[0][0], cab[cab.length - 1][0], 0.50);
    const s = secAt(st, z);
    const maxHw = Math.max(...cab.map((p) => p[2])), maxHh = Math.max(...cab.map((p) => p[3]));
    tube(C, [0, s[1] + maxHh * 0.92, z], [0, s[1] + maxHh * 1.45, z], 0.007, 0.007, 4);
    slab(D, [[0, s[1] + maxHh * 1.45, z], [0.18, s[1] + maxHh * 1.36, z], [0.20, s[1] + maxHh * 1.16, z], [0.01, s[1] + maxHh * 1.16, z]], 0.004);
  },
  antennas_four({ P, st, r, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('chrome');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : st;
    const z = lerp(cab[0][0], cab[cab.length - 1][0], 0.50);
    const s = secAt(st, z);
    const maxHw = Math.max(...cab.map((p) => p[2])), maxHh = Math.max(...cab.map((p) => p[3]));
    for (const dx of [-1, 1]) for (const dz of [-1, 1]) {
      const x = dx * maxHw * 0.62, zz = z + dz * 0.14;
      tube(C, [x, s[1] + maxHh * 0.92, zz], [x, s[1] + maxHh * 1.18, zz], 0.006, 0.003, 4);
    }
  },
  side_pipes_twin({ P, st }) {
    const C = P.get('chrome');
    const z0 = lerp(st[0][0], st[st.length - 1][0], 0.12);
    const z1 = lerp(st[0][0], st[st.length - 1][0], 0.80);
    const s0 = secAt(st, z0);
    for (const sd of [1, -1]) {
      for (let i = 0; i < 2; i++) {
        const y = s0[1] - s0[3] * (0.62 + i * 0.16);
        const x = sd * s0[2] * (1.02 + i * 0.03);
        tube(C, [x, y, z0], [x, y, z1], 0.016, 0.016, 7);
        const sz = secAt(st, z1);
        const from = C.count;
        revolveX(C, [[z1 + 0.04, 0.022], [z1 + 0.055, 0.014], [z1 + 0.070, 0]], 14, 1, false, true);
        const base = C.count;
        for (let k = from; k < base; k++) {
          const yy = C.p[k * 3 + 1], zz = C.p[k * 3 + 2];
          C.p[k * 3] = x; C.p[k * 3 + 1] = sz[1] - sz[3] * (0.62 + i * 0.16) + yy; C.p[k * 3 + 2] = z1 + zz;
        }
      }
    }
  },
  tow_hook_small({ P, st }) {
    const C = P.get('chrome');
    const z = lerp(st[0][0], st[st.length - 1][0], 0.05);
    const s = secAt(st, z);
    tube(C, [0, s[1] - s[3] * 0.55, z + 0.06], [0, s[1] - s[3] * 0.85, z + 0.02], 0.014, 0.014, 6);
    revolveX(C, [[z + 0.10, 0.016], [z + 0.10, 0.024]], 12, 1, false, false);
  },
  hood_scoop_tiny({ P, st }) {
    const C = P.get('paint');
    const z = lerp(st[0][0], st[st.length - 1][0], 0.70);
    const s = secAt(st, z);
    rbox(C, 0, s[1] + s[3] * 0.84, z, s[2] * 0.30, 0.035, s[2] * 0.30, 0.014, 4);
  },
  hood_scoop_twin({ P, st }) {
    const C = P.get('paint');
    const z = lerp(st[0][0], st[st.length - 1][0], 0.66);
    const s = secAt(st, z);
    for (const sd of [1, -1]) rbox(C, sd * s[2] * 0.48, s[1] + s[3] * 0.80, z, s[2] * 0.20, 0.05, s[2] * 0.38, 0.014, 4);
  },
  brace_crossed({ P, st, r }) {
    const C = P.get('chrome');
    const w0 = r.meta.wheels[0], w1 = r.meta.wheels[2];
    const s0 = secAt(st, w0.z), s1 = secAt(st, w1.z);
    for (const sd of [1, -1]) {
      tube(C, [sd * s0[2] * 0.60, s0[1] - s0[3] * 0.95, w0.z], [-sd * s1[2] * 0.60, s1[1] - s1[3] * 0.95, w1.z], 0.014, 0.014, 7);
      tube(C, [-sd * s0[2] * 0.60, s0[1] - s0[3] * 0.95, w0.z], [sd * s1[2] * 0.60, s1[1] - s1[3] * 0.95, w1.z], 0.014, 0.014, 7);
    }
  },
  brace_slim({ P, st, r }) {
    const C = P.get('chrome');
    const w0 = r.meta.wheels[0], w1 = r.meta.wheels[2];
    const s0 = secAt(st, w0.z), s1 = secAt(st, w1.z);
    for (const sd of [1, -1]) tube(C, [sd * s0[2] * 0.70, s0[1] - s0[3] * 0.98, w0.z], [sd * s1[2] * 0.70, s1[1] - s1[3] * 0.98, w1.z], 0.010, 0.010, 6);
  },
  winch_twin({ P, st, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('chrome'), D = P.get('dark');
    const z = st[st.length - 1][0] - 0.02;
    const s = secAt(st, z);
    for (const sd of [1, -1]) {
      const x = sd * s[2] * 0.55;
      const from = D.count;
      revolveX(D, [[z + 0.03, 0.07], [z + 0.08, 0.07], [z + 0.08, 0.09], [z + 0.03, 0.09]], 16, 1, false, false);
      const base = D.count;
      for (let k = from; k < base; k++) {
        const yy = D.p[k * 3 + 1], zz = D.p[k * 3 + 2];
        D.p[k * 3] = x; D.p[k * 3 + 1] = s[1] - s[3] * 0.80 + yy; D.p[k * 3 + 2] = z + zz;
      }
      tube(C, [x, s[1] - s[3] * 0.80, z + 0.09], [x, s[1] - s[3] * 0.80, z - 0.08], 0.006, 0.006, 5);
    }
  },
  spikes_huge({ P, st, r }) {
    const D = P.get('chrome');
    for (const w of r.meta.wheels) {
      const sd = sign(w.x);
      for (let row = 0; row < 2; row++) {
        const segs = 9;
        for (let i = 0; i < segs; i++) {
          const a = (i / segs) * PI - PI / 2;
          const rr = w.r * (1.06 + row * 0.10);
          const z = w.z + Math.sin(a) * rr, y = w.y + Math.cos(a) * rr;
          const s = secAt(st, z);
          const x = sd * (s[2] * 0.96 + 0.03 + row * 0.05);
          tube(D, [x, y, z], [x * 1.16, y, z], 0.014, 0.006, 4);
        }
      }
    }
  },
  visor_plain({ P, st, r, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('dark');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : st;
    const z = cab[0][0] + 0.02;
    const s = secAt(st, z);
    const maxHw = Math.max(...cab.map((p) => p[2])), maxHh = Math.max(...cab.map((p) => p[3]));
    slab(C, [[-maxHw * 0.85, s[1] + maxHh * 0.62, z], [maxHw * 0.85, s[1] + maxHh * 0.62, z],
      [maxHw * 0.72, s[1] + maxHh * 0.80, z + 0.03], [-maxHw * 0.72, s[1] + maxHh * 0.80, z + 0.03]], 0.008);
  },
  bullbar_wide({ P, st }) {
    const C = P.get('chrome');
    const z = st[st.length - 1][0] - 0.02;
    const s = secAt(st, z);
    const hw = s[2] * 1.30;
    rbox(C, 0, s[1] + s[3] * 0.45, z, hw, 0.030, 0.040, 0.010, 4);
    for (const sd of [1, -1]) {
      for (let i = 0; i < 3; i++) {
        const x = lerp(-hw * 0.8, hw * 0.8, i / 2);
        tube(C, [x, s[1] + s[3] * 0.15, z], [x, s[1] + s[3] * 1.05, z + 0.06], 0.014, 0.014, 6);
      }
    }
  },
  diffuser_six({ P, st }) {
    const D = P.get('dark');
    const z = lerp(st[0][0], st[st.length - 1][0], 0.03);
    const s = secAt(st, z);
    for (let i = 0; i < 6; i++) {
      const x = lerp(-s[2] * 0.85, s[2] * 0.85, i / 5);
      rbox(D, x, s[1] - s[3] * 0.92, z - 0.03, 0.012, 0.09, 0.07, 0.005, 3);
    }
  },
  fuel_cell_twin({ P, st }) {
    const C = P.get('chrome'), D = P.get('dark');
    const z = st[0][0] - 0.04;
    const s = secAt(st, z);
    const maxHw = Math.max(...st.map((p) => p[2]));
    for (const sd of [1, -1]) {
      const x = sd * maxHw * 0.48;
      const from = D.count;
      revolveX(D, [[z + 0.02, 0.13], [z + 0.08, 0.15], [z + 0.18, 0.15], [z + 0.24, 0.13]], 16, 1, true, true);
      const base = D.count;
      for (let k = from; k < base; k++) {
        const yy = D.p[k * 3 + 1], zz = D.p[k * 3 + 2];
        D.p[k * 3] = x; D.p[k * 3 + 1] = s[1] + s[3] * 0.75 + yy; D.p[k * 3 + 2] = z + zz;
      }
    }
    tube(C, [-maxHw * 0.48, s[1] + s[3] * 0.75, z + 0.12], [maxHw * 0.48, s[1] + s[3] * 0.75, z + 0.12], 0.008, 0.008, 5);
  },
  /* ---- silhouette-breaking hardware -------------------------------------
   * The first pass made sixty small add-ons and the cars still read as one
   * shape, because a sun visor is eight triangles and eight triangles is
   * invisible at 168 px. What actually separates two cars is the OUTLINE: a
   * roof tent, a roll cage, a blower through the bonnet, stacks behind the
   * cab. These are the big ones, and every car now wears three details — see
   * KITS below — because a single bolt-on is not enough to tell sixty cars
   * apart but a distinct three-part combination always is. */
  roll_cage({ P, st, r, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('chrome');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : st;
    const z0 = cab[0][0] + 0.04, z1 = cab[cab.length - 1][0] - 0.04;
    const hw = Math.max(...cab.map((p) => p[2])) * 0.94;
    const hh = Math.max(...cab.map((p) => p[3]));
    const sa = secAt(st, z0), sb = secAt(st, z1);
    const yA = sa[1] + hh * 0.85, yB = sb[1] + hh * 0.90;
    for (const sd of [1, -1]) {
      tube(C, [sd * hw, yA, z0], [sd * hw, yB + 0.06, z0 + (z1 - z0) * 0.35], 0.016, 0.016, 6);
      tube(C, [sd * hw, yB + 0.06, z0 + (z1 - z0) * 0.35], [sd * hw * 0.88, yB, z1], 0.016, 0.016, 6);
      tube(C, [sd * hw, yB + 0.06, z0 + (z1 - z0) * 0.35], [sd * hw * 0.10, yB + 0.10, z1 - 0.04], 0.012, 0.012, 5);
    }
    tube(C, [-hw, yB + 0.06, z0 + (z1 - z0) * 0.35], [hw, yB + 0.06, z0 + (z1 - z0) * 0.35], 0.016, 0.016, 6);
    tube(C, [-hw * 0.88, yB, z1], [hw * 0.88, yB, z1], 0.016, 0.016, 6);
  },
  roof_tent({ P, st, r, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('paint'), D = P.get('dark');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : st;
    const z0 = cab[0][0] + 0.06, z1 = cab[cab.length - 1][0] - 0.06;
    const hw = Math.max(...cab.map((p) => p[2])), hh = Math.max(...cab.map((p) => p[3]));
    const cz = (z0 + z1) / 2, s = secAt(st, cz), base = s[1] + hh * 0.90;
    rbox(C, 0, base + 0.10, cz - 0.12, hw * 0.88, 0.09, (z1 - z0) * 0.32, 0.03, 4);
    rbox(C, 0, base + 0.21, cz + 0.16, hw * 0.80, 0.07, (z1 - z0) * 0.24, 0.03, 4);
    slab(D, [[-hw * 0.80, base + 0.28, cz + 0.04], [hw * 0.80, base + 0.28, cz + 0.04],
      [hw * 0.80, base + 0.28, cz + 0.26], [-hw * 0.80, base + 0.28, cz + 0.26]], 0.02);
    for (let i = 0; i < 3; i++) tube(D, [-hw * 0.45, base + 0.04 + i * 0.06, z0 + 0.02], [hw * 0.45, base + 0.04 + i * 0.06, z0 + 0.02], 0.008, 0.008, 4);
  },
  bed_rack({ P, st, r }) {
    const C = P.get('chrome');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : null;
    const zN = cab ? cab[0][0] - 0.06 : lerp(st[0][0], st[st.length - 1][0], 0.42);
    const zT = st[0][0] + 0.10;
    const s = secAt(st, (zN + zT) / 2);
    const hw = s[2] * 0.92, yB = s[1] + s[3] * 0.80, yT = yB + 0.30;
    for (const sd of [1, -1]) for (const z of [zN, (zN + zT) / 2, zT]) {
      tube(C, [sd * hw, yB, z], [sd * hw * 0.90, yT, z], 0.016, 0.016, 6);
    }
    for (const sd of [1, -1]) tube(C, [sd * hw * 0.95, yT, zN], [sd * hw * 0.95, yT, zT], 0.014, 0.014, 6);
    tube(C, [-hw * 0.95, yT, (zN + zT) / 2], [hw * 0.95, yT, (zN + zT) / 2], 0.014, 0.014, 6);
  },
  blower({ P, st }) {
    const C = P.get('chrome'), D = P.get('dark');
    const z = lerp(st[0][0], st[st.length - 1][0], 0.68);
    const s = secAt(st, z), y = s[1] + s[3] * 0.80;
    rbox(D, 0, y + 0.06, z, s[2] * 0.34, 0.09, s[2] * 0.40, 0.02, 4);
    rbox(C, 0, y + 0.15, z, s[2] * 0.26, 0.05, s[2] * 0.32, 0.02, 4);
    for (const sd of [1, -1]) tube(C, [sd * s[2] * 0.20, y + 0.20, z], [sd * s[2] * 0.20, y + 0.26, z], 0.022, 0.022, 6);
    placed(C, () => revolveX(C, [[-0.05, 0.020], [0.05, 0.020], [0.05, 0.030], [-0.05, 0.030]], 14, 1, false, false), 0, y + 0.28, z);
    rbox(C, 0, y + 0.30, z, 0.09, 0.03, 0.10, 0.02, 4);
  },
  exhaust_stacks({ P, st, r }) {
    const C = P.get('chrome');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : null;
    const z = cab ? cab[0][0] - 0.10 : lerp(st[0][0], st[st.length - 1][0], 0.30);
    const s = secAt(st, z);
    for (const sd of [1, -1]) {
      const x = sd * s[2] * 0.82, y0 = s[1] - s[3] * 0.30;
      tube(C, [x, y0, z], [x, y0 + 0.55, z + 0.02], 0.028, 0.032, 8);
      placed(C, () => revolveX(C, [[0, 0.030], [-0.03, 0.030], [-0.035, 0.040], [0, 0.040]], 12, 1, false, false), x, y0 + 0.55, z + 0.02);
    }
  },
  ladder({ P, st, r, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('chrome');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : st;
    const z0 = cab[0][0] + 0.02, z1 = cab[cab.length - 1][0] - 0.02;
    const hw = Math.max(...cab.map((p) => p[2])), hh = Math.max(...cab.map((p) => p[3]));
    const s = secAt(st, (z0 + z1) / 2), y = s[1] + hh * 0.95;
    const x = hw * 0.98;
    for (const sd of [1, -1]) tube(C, [sd * x, y, z0], [sd * x * 0.92, y + 0.34, z1], 0.012, 0.012, 5);
    const n = 6;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const zz = lerp(z0, z1, t), yy = lerp(y, y + 0.34, t), xx = lerp(x, x * 0.92, t);
      tube(C, [-xx, yy, zz], [xx, yy, zz], 0.008, 0.008, 4);
    }
  },
  roof_pod({ P, st, r, spec }) {
    if (spec.exposedWheels) return;
    const D = P.get('dark'), C = P.get('chrome');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : st;
    const z0 = cab[0][0] + 0.04, z1 = cab[cab.length - 1][0] - 0.04;
    const hw = Math.max(...cab.map((p) => p[2])), hh = Math.max(...cab.map((p) => p[3]));
    const cz = (z0 + z1) / 2, s = secAt(st, cz), y = s[1] + hh * 0.94;
    rbox(D, 0, y + 0.07, cz, hw * 0.62, 0.07, (z1 - z0) * 0.42, 0.05, 5);
    slab(C, [[-hw * 0.62, y + 0.14, cz - (z1 - z0) * 0.20], [hw * 0.62, y + 0.14, cz - (z1 - z0) * 0.20],
      [hw * 0.52, y + 0.14, cz + (z1 - z0) * 0.42], [-hw * 0.52, y + 0.14, cz + (z1 - z0) * 0.42]], 0.02);
  },
  spare_roof({ P, st, r, spec }) {
    if (spec.exposedWheels) return;
    const D = P.get('dark'), C = P.get('chrome');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : st;
    const cz = lerp(cab[0][0], cab[cab.length - 1][0], 0.45);
    const s = secAt(st, cz), hh = Math.max(...cab.map((p) => p[3]));
    const y = s[1] + hh * 0.95 + 0.24;
    placed(D, () => revolveX(D, [[-0.07, 0.20], [0.07, 0.20], [0.07, 0.26], [-0.07, 0.26]], 22, 1, false, false), 0, y, cz);
    placed(C, () => washerX(C, 0.07, 0.008, 0.12, 0.20, 18), 0, y, cz);
    for (const sd of [1, -1]) tube(C, [sd * 0.22, y - 0.24, cz], [0, y, cz + 0.20], 0.008, 0.008, 4);
  },
  wheelie_bar({ P, st }) {
    const C = P.get('chrome'), D = P.get('dark');
    const z = st[0][0], s = secAt(st, z);
    const y = s[1] - s[3] * 0.85, zz = z - 0.42;
    for (const sd of [1, -1]) {
      tube(C, [sd * s[2] * 0.62, y + 0.02, z + 0.04], [sd * s[2] * 0.62, y - 0.10, zz], 0.016, 0.016, 6);
      placed(D, () => revolveX(D, [[-0.035, 0.11], [0.035, 0.11], [0.035, 0.15], [-0.035, 0.15]], 14, 1, false, false), sd * s[2] * 0.62, y - 0.16, zz);
    }
    tube(C, [-s[2] * 0.62, y - 0.10, zz], [s[2] * 0.62, y - 0.10, zz], 0.014, 0.014, 6);
  },
  parachute({ P, st }) {
    const D = P.get('dark'), C = P.get('chrome');
    const z = lerp(st[0][0], st[st.length - 1][0], 0.04), s = secAt(st, z);
    const y = s[1] + s[3] * 0.80;
    rbox(D, 0, y + 0.06, z - 0.06, s[2] * 0.52, 0.09, 0.20, 0.02, 4);
    rbox(C, 0, y + 0.15, z - 0.06, s[2] * 0.40, 0.05, 0.16, 0.02, 4);
    for (const sd of [1, -1]) tube(C, [sd * s[2] * 0.44, y + 0.10, z - 0.16], [sd * s[2] * 0.30, y - 0.20, z - 0.34], 0.010, 0.010, 5);
  },
  side_steps({ P, st }) {
    const C = P.get('chrome'), D = P.get('dark');
    const z0 = lerp(st[0][0], st[st.length - 1][0], 0.28), z1 = lerp(st[0][0], st[st.length - 1][0], 0.68);
    const s = secAt(st, (z0 + z1) / 2), y = s[1] - s[3] * 1.00;
    for (const sd of [1, -1]) {
      slab(D, [[sd * s[2] * 0.98, y, z0], [sd * (s[2] + 0.14), y, z0], [sd * (s[2] + 0.14), y, z1], [sd * s[2] * 0.98, y, z1]], 0.03);
      tube(C, [sd * (s[2] + 0.14), y + 0.02, z0], [sd * (s[2] + 0.14), y + 0.02, z1], 0.010, 0.010, 5);
    }
  },
  ducktail({ P, st }) {
    const C = P.get('paint');
    const z = lerp(st[0][0], st[st.length - 1][0], 0.06), s = secAt(st, z);
    const y = s[1] + s[3] * 0.90;
    slab(C, [[-s[2] * 0.94, y, z + 0.02], [s[2] * 0.94, y, z + 0.02], [s[2] * 0.88, y + 0.10, z - 0.18], [-s[2] * 0.88, y + 0.10, z - 0.18]], 0.028);
  },
  whale_tail({ P, st }) {
    const C = P.get('paint'), D = P.get('dark');
    const z = lerp(st[0][0], st[st.length - 1][0], 0.05), s = secAt(st, z);
    const yB = s[1] + s[3] * 0.55, yT = s[1] + s[3] * 0.95 + 0.22;
    for (const sd of [1, -1]) slab(D, [[sd * s[2] * 0.80, yB, z + 0.02], [sd * s[2] * 0.80, yT, z - 0.06],
      [sd * s[2] * 0.80, yT, z - 0.14], [sd * s[2] * 0.80, yB, z - 0.08]], 0.022, 'x');
    slab(C, [[-s[2] * 0.86, yT, z - 0.04], [s[2] * 0.86, yT, z - 0.04], [s[2] * 0.80, yT + 0.02, z - 0.20], [-s[2] * 0.80, yT + 0.02, z - 0.20]], 0.05);
  },
  fender_flares({ P, st, r }) {
    const C = P.get('dark');
    for (const w of r.meta.wheels) {
      placed(C, () => revolveX(C, [[-0.10, w.r * 1.16], [-0.06, w.r * 1.30], [0.06, w.r * 1.30], [0.10, w.r * 1.16]], 20, 1, false, false), w.x, w.y, w.z);
    }
  },
  light_pod({ P, st, r, spec }) {
    if (spec.exposedWheels) return;
    const D = P.get('dark'), L = P.get('head');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : st;
    const z = cab[0][0] + 0.04, s = secAt(st, z);
    const hw = Math.max(...cab.map((p) => p[2])), hh = Math.max(...cab.map((p) => p[3]));
    const y = s[1] + hh * 0.70;
    for (const sd of [1, -1]) {
      const x = sd * hw * 1.02;
      rbox(D, x, y, z, 0.05, 0.06, 0.10, 0.02, 4);
      for (let i = 0; i < 2; i++) {
        const from = L.count;
        revolveX(L, [[z + 0.05, 0.026], [z + 0.065, 0.016], [z + 0.070, 0]], 12, 1, false, true);
        const base = L.count;
        for (let k = from; k < base; k++) {
          const yy = L.p[k * 3 + 1], zz = L.p[k * 3 + 2];
          L.p[k * 3] = x + sd * 0.045; L.p[k * 3 + 1] = y + (i ? 0.04 : -0.04) + yy; L.p[k * 3 + 2] = z + zz;
        }
      }
    }
  },
  roof_basket({ P, st, r, spec }) {
    if (spec.exposedWheels) return;
    const C = P.get('chrome'), D = P.get('dark');
    const cab = r.meta.cabin && r.meta.cabin.length ? r.meta.cabin : st;
    const z0 = cab[0][0] + 0.08, z1 = cab[cab.length - 1][0] - 0.08;
    const hw = Math.max(...cab.map((p) => p[2])), hh = Math.max(...cab.map((p) => p[3]));
    const s = secAt(st, (z0 + z1) / 2), y = s[1] + hh * 0.92;
    slab(D, [[-hw * 0.90, y, z0], [hw * 0.90, y, z0], [hw * 0.86, y, z1], [-hw * 0.86, y, z1]], 0.02);
    for (const sd of [1, -1]) {
      tube(C, [sd * hw * 0.90, y + 0.02, z0], [sd * hw * 0.86, y + 0.02, z1], 0.012, 0.012, 5);
      tube(C, [sd * hw * 0.90, y + 0.14, z0], [sd * hw * 0.86, y + 0.14, z1], 0.010, 0.010, 5);
    }
    rbox(C, -hw * 0.45, y + 0.11, (z0 + z1) / 2, 0.09, 0.09, 0.14, 0.02, 4);
    rbox(D, hw * 0.45, y + 0.09, (z0 + z1) / 2 + 0.10, 0.08, 0.07, 0.10, 0.02, 4);
  },
  /* ---- body archetypes ---------------------------------------------------
   * Three bolt-ons on a shared hull still read as "the same car with stuff
   * bolted on". These change the OUTLINE itself.
   *
   * Two things had to be learned the hard way here, both from
   * tools/probe-shapes.mjs:
   *
   * 1. A thin panel laid on the existing roof does not survive the trip to a
   *    260 px thumbnail. The probe samples the hull every 1/14 of its length,
   *    so a 5 cm deck moves one station by 5/260 = 0.02 — the same order as
   *    the difference it was meant to create. Each archetype is therefore a
   *    ROOF: a real volume with a different top line.
   * 2. A FIXED roof makes its own family converge. Twelve fastbacks sharing
   *    one shape are twelve similar cars. So every dimension below comes from
   *    tune(spec), which is seeded off the car id: same family, different
   *    vehicle. Four roofed families plus one for open cockpits:
   *
   *   van_box      flat and high, all the way to the tail     _/‾‾‾‾‾‾
   *   pickup_bed   cab roof ends in a wall, deck stays low    _/‾‾\____
   *   fastback     one long slope from crown down to bumper   _/‾\\\\\
   *   notchback    short cab roof, a step, then a flat deck   _/‾‾\___
   *   speedster    headrest fairing + tonneau, no roof        _/(_)___
   *
   * The guard is the honest one: an archetype reshapes a greenhouse, so a
   * body with no greenhouse cannot wear one. `needle` and `zephyr` are
   * open-cockpit and used to be assigned `fastback`, which silently did
   * nothing — see the `no-cabin` case in tools/probe-open.mjs. */
  van_box({ P, st, r, spec }) {
    if (spec.exposedWheels || !r.meta.cabin || !r.meta.cabin.length) return;
    const C = P.get('paint'), D = P.get('dark'), G = P.get('glass');
    const L = roofLine(r, st);
    const q = tune(spec, 'van_box');
    const z1 = st[0][0] + q.reach;                   // stops short of the bumper
    // Never bail for want of length: a short rear deck just means the box runs
    // forward over the cabin instead, which is what a real van box does. The
    // earlier version returned early here, so four of the eleven vans silently
    // got no roof at all and stayed identical to everything else.
    const z0 = Math.max(L.zBack + 0.02, z1 + 0.54);
    const s0 = secAt(st, z0), s1 = secAt(st, z1);
    const yTop = L.top + q.lift;
    const yBot = Math.min(s0[1] + s0[3], s1[1] + s1[3]) - 0.06;
    const hw = L.hw * q.wide;
    // The box's top bows by the car's own arc, so two vans are not two slabs.
    const bow = 0.055 * q.arc;
    const body = roofRun(P, 'paint', z1, z0,
      (t) => yTop + bow * Math.sin(Math.PI * (0.18 + 0.64 * t)),
      () => yBot, (t) => hw * (1 - 0.06 * q.tilt * (1 - t)), 12);
    if (!body.length) return;
    // A crown, inset by the car's own tilt, so the top edge is never a bare
    // rectangle and no two vans have the same roof profile.
    roofRun(P, 'paint', z1 + 0.03, z0 - 0.03, () => yTop + 0.028, () => yTop - 0.012,
      () => hw * (0.88 + 0.10 * (1 - q.tilt)), 10);
    // Rear doors: a dark panel inset into the back face.
    rbox(D, 0, (yTop + yBot) / 2, z1 + 0.006, hw * 0.84, (yTop - yBot) * 0.36, 0.012, 0.01, 4);
    // Window band down each flank.
    for (const sd of [1, -1]) {
      rbox(G, sd * (hw + 0.004), yTop - (yTop - yBot) * 0.30, (z1 + z0) / 2, 0.010,
        Math.min(0.055, (yTop - yBot) * 0.16), (z0 - z1) * 0.42, 0.01, 4);
    }
    publishRoof(r, body, 7);
  },
  pickup_bed({ P, st, r, spec }) {
    if (spec.exposedWheels || !r.meta.cabin || !r.meta.cabin.length) return;
    const C = P.get('paint'), D = P.get('dark'), G = P.get('glass');
    const L = roofLine(r, st);
    const q = tune(spec, 'pickup_bed');
    const zTail = st[0][0] + q.reach;
    const zCabR = Math.max(L.zBack + 0.05, zTail + 0.34);
    const zCabF = Math.max(L.zFront - 0.03, zCabR + 0.30);
    const sR = secAt(st, zCabR), sT = secAt(st, zTail);
    const hw = L.hw * q.wide;
    const yTop = L.top + q.lift;
    const yBot = sR[1] + sR[3] - 0.05;
    const cab = roofRun(P, 'paint', zCabR, zCabF,
      (t) => yTop - 0.050 * q.arc * (1 - Math.pow(t, q.exp)),
      () => yBot, () => hw, 8);
    if (!cab.length) return;
    // The wall the cab ends in — the step that makes it a pickup.
    rbox(C, 0, (yTop + sR[1] + sR[3]) / 2, zCabR - 0.025, hw,
      (yTop - (sR[1] + sR[3])) / 2 + 0.03, 0.035, 0.02, 4);
    rbox(G, 0, yTop - (yTop - yBot) * 0.30, zCabR - 0.02, hw * 0.88, 0.045, 0.02, 0.01, 4);
    // Bed floor and rails, at a height the car's own tail decides.
    const yBed = sT[1] + sT[3] * q.deck;
    const zb0 = zCabR - 0.05;
    const czb = (zb0 + zTail) / 2, hzb = (zb0 - zTail) / 2;
    slab(D, [[-hw, yBed, zb0], [hw, yBed, zb0], [hw, yBed, zTail], [-hw, yBed, zTail]], 0.02);
    const rail = 0.05 + 0.07 * q.tilt;
    for (const sd of [1, -1]) rbox(C, sd * hw, yBed + rail / 2, czb, 0.035, rail / 2, hzb, 0.02, 4);
    rbox(C, 0, yBed + rail / 2, zTail + 0.035, hw, rail / 2, 0.035, 0.02, 4);
    publishRoof(r, cab, 7);
  },
  fastback({ P, st, r, spec }) {
    if (spec.exposedWheels || !r.meta.cabin || !r.meta.cabin.length) return;
    const C = P.get('paint');
    const L = roofLine(r, st);
    const q = tune(spec, 'fastback');
    const z1 = st[0][0] + q.reach;
    const z0 = Math.max(L.zBack + 0.02, z1 + 0.58);
    const y0 = L.top + q.lift;
    const s1 = secAt(st, z1);
    const y1 = s1[1] + s1[3] * q.drop;
    const roof = roofRun(P, 'paint', z1, z0,
      (t) => y1 + (y0 - y1) * Math.pow(t, q.exp),
      (t, z) => secAt(st, z)[1] + secAt(st, z)[3] - 0.06,
      (t) => L.hw * (1 - (0.06 + 0.14 * q.tilt) * (1 - t)), 9);
    publishRoof(r, roof, 4);
  },
  notchback({ P, st, r, spec }) {
    if (spec.exposedWheels || !r.meta.cabin || !r.meta.cabin.length) return;
    const C = P.get('paint'), D = P.get('dark');
    const L = roofLine(r, st);
    const q = tune(spec, 'notchback');
    const zTail = st[0][0] + q.reach;
    const zCabR = Math.max(L.zBack + 0.06, zTail + 0.36);
    const zCabF = Math.max(L.zFront - 0.04, zCabR + 0.30);
    const sR = secAt(st, zCabR), sT = secAt(st, zTail);
    const hw = L.hw * q.wide;
    const yTop = L.top + q.lift;
    const yBot = sR[1] + sR[3] - 0.05;
    const cab = roofRun(P, 'paint', zCabR, zCabF,
      (t) => yTop - 0.045 * q.arc * (1 - Math.pow(t, q.exp)),
      () => yBot, () => hw, 8);
    if (!cab.length) return;
    // A vertical back window, so the step is a step and not a ramp.
    rbox(D, 0, yTop - (yTop - yBot) * 0.30, zCabR - 0.012, hw * 0.90,
      Math.min(0.06, (yTop - yBot) * 0.22), 0.02, 0.01, 4);
    // A short deck that sits clearly lower than the cab.
    const yDeck = sT[1] + sT[3] * q.deck;
    const zb0 = zCabR - 0.04;
    rbox(C, 0, yDeck - 0.02, (zb0 + zTail) / 2, hw * 0.96, 0.025, (zb0 - zTail) / 2, 0.02, 4);
    rbox(C, 0, yDeck + 0.02, zTail + 0.04, hw * 0.96, 0.045, 0.05, 0.02, 4);
    publishRoof(r, cab, 7);
  },
  speedster({ P, st, r, spec }) {
    if (r.meta.cabin && r.meta.cabin.length) return;   // it has a roof already
    const C = P.get('paint'), D = P.get('dark');
    const q = tune(spec, 'speedster');
    const cp = spec.cockpit || null;
    const zA = st[0][0], zB = st[st.length - 1][0];
    const zc1 = cp && cp.z1 != null ? cp.z1 : lerp(zA, zB, 0.72);
    const zc0 = cp && cp.z0 != null ? cp.z0 : lerp(zA, zB, 0.58);
    const hw = cp && cp.hw ? cp.hw : secAt(st, (zc0 + zc1) / 2)[2] * 0.55;
    // Headrest fairing: a hump right behind the cockpit. The classic speedster
    // read, and the only thing on an open car that can change its outline.
    // The fairing is the only thing on an open car that can change the
    // outline, so it carries the whole load: longer or shorter, higher or
    // lower, more or less tapered, all from this car's own family slots.
    // Pushing those ranges harder was tried and made things worse (0.0317 ->
    // 0.0282 for vortex/kestrel): a fairing big enough to dominate the profile
    // is also big enough to make every car's profile look the same.
    const zf0 = zc0 + 0.02;
    const zf1 = zf0 - (0.24 + 0.30 * q.reach);
    const s0 = secAt(st, zf0), s1 = secAt(st, zf1);
    const y0 = s0[1] + s0[3] * 0.72 + q.lift * 0.45;
    const y1 = s1[1] + s1[3] * q.drop;
    const fair = roofRun(P, 'paint', zf1, zf0,
      (t) => y1 + (y0 - y1) * Math.pow(t, q.exp),
      (t, z) => secAt(st, z)[1] + secAt(st, z)[3] * 0.18,
      (t) => hw * (1 - (0.30 + 0.35 * q.tilt) * (1 - t)), 7);
    if (fair.length) publishRoof(r, fair, 3);
    // Tonneau over the rear deck, so the tail is covered rather than open.
    const zt0 = zf1, zt1 = zA + q.reach;
    if (zt0 - zt1 > 0.16) {
      const sa = secAt(st, zt0), sb = secAt(st, zt1);
      slab(D, [[-hw * 0.94, sa[1] + sa[3] * 0.86, zt0], [hw * 0.94, sa[1] + sa[3] * 0.86, zt0],
        [hw * 0.72, sb[1] + sb[3] * 0.88, zt1], [-hw * 0.72, sb[1] + sb[3] * 0.88, zt1]], 0.018);
    }
  },
};

/* ========================================================================== *
 *  THE SIXTY ASSIGNMENTS
 *  Two cars may share a builder when the parameters differ, but no two cars in
 *  the catalogue share the same id AND the same params — that pair would be
 *  the same car from the showroom camera. tools/verify.mjs asserts it.
 * ========================================================================== */

export const KITS = {
  "titan": [
    "mud_flaps_xl",
    "bed_rack",
    "rock_studded",
    "van_box"
  ],
  "rampage": [
    "plough_ramp",
    "exhaust_stacks",
    "rear_diffuser",
    "fastback"
  ],
  "bison": [
    "toolbox_twin",
    "roof_basket",
    "side_canards",
    "pickup_bed"
  ],
  "mastodon": [
    "spare_wheel",
    "side_steps",
    "mud_spikes",
    "notchback"
  ],
  "colossus": [
    "spikes_huge",
    "fender_flares",
    "chassis_brace",
    "fastback"
  ],
  "anvil": [
    "rock_studded",
    "roll_cage",
    "bullbar",
    "pickup_bed"
  ],
  "bruiser": [
    "brace_crossed",
    "exhaust_stacks",
    "spotlight_bar",
    "fastback"
  ],
  "warthog": [
    "winch_twin",
    "bed_rack",
    "snorkel",
    "fastback"
  ],
  "grizzly": [
    "jerry_cans_four",
    "roof_tent",
    "side_pipes",
    "van_box"
  ],
  "bulwark": [
    "fuel_cell",
    "roll_cage",
    "tow_hook",
    "notchback"
  ],
  "apex": [
    "hood_scoop_tiny",
    "ducktail",
    "rear_diffuser",
    "speedster"
  ],
  "vortex": [
    "shark_fin",
    "whale_tail",
    "side_canards",
    "speedster"
  ],
  "aurora": [
    "airbox",
    "fender_flares",
    "rear_louvres",
    "speedster"
  ],
  "kestrel": [
    "bullbar",
    "ducktail",
    "vortex_generators",
    "speedster"
  ],
  "rapier": [
    "t_wing",
    "whale_tail",
    "rear_diffuser",
    "speedster"
  ],
  "seraph": [
    "halo",
    "fender_flares",
    "side_canards",
    "speedster"
  ],
  "talon": [
    "rear_diffuser",
    "ducktail",
    "mirror_stalks",
    "speedster"
  ],
  "halcyon": [
    "bargeboards",
    "whale_tail",
    "t_wing",
    "speedster"
  ],
  "vandal": [
    "canards_wide",
    "fender_flares",
    "shark_fin",
    "speedster"
  ],
  "zenith": [
    "mirror_stalks",
    "ducktail",
    "halo",
    "speedster"
  ],
  "hooligan": [
    "mud_flaps_heavy",
    "roll_cage",
    "spotlight_bar",
    "van_box"
  ],
  "leviathan": [
    "snow_plough",
    "roof_tent",
    "side_steps",
    "pickup_bed"
  ],
  "stingray": [
    "side_canards",
    "ducktail",
    "hood_scoop",
    "fastback"
  ],
  "brickhouse": [
    "toolbox",
    "roof_basket",
    "bullbar",
    "fastback"
  ],
  "sabretooth": [
    "roof_vent",
    "roof_pod",
    "rear_louvres",
    "fastback"
  ],
  "comet": [
    "roof_light_bar",
    "ladder",
    "side_pipes",
    "fastback"
  ],
  "pillager": [
    "jerry_cans",
    "bed_rack",
    "snorkel",
    "pickup_bed"
  ],
  "wraith": [
    "flags",
    "whale_tail",
    "rock_studded",
    "fastback"
  ],
  "goliath": [
    "antenna_array",
    "roof_tent",
    "side_steps",
    "van_box"
  ],
  "needle": [
    "side_pipes",
    "blower",
    "rear_diffuser",
    "speedster"
  ],
  "brutus": [
    "tow_hook",
    "fender_flares",
    "bullbar",
    "pickup_bed"
  ],
  "mako": [
    "hood_scoop",
    "ducktail",
    "vortex_generators",
    "pickup_bed"
  ],
  "thunderbug": [
    "chassis_brace",
    "roof_basket",
    "mud_flaps",
    "pickup_bed"
  ],
  "viceroy": [
    "roof_rack",
    "spare_roof",
    "side_pipes",
    "van_box"
  ],
  "scrapheap": [
    "winch",
    "exhaust_stacks",
    "rock_studded",
    "pickup_bed"
  ],
  "polaris": [
    "mud_spikes",
    "roof_pod",
    "rear_louvres",
    "fastback"
  ],
  "hummingbird": [
    "sun_visor",
    "roof_basket",
    "tow_hook",
    "fastback"
  ],
  "wideload": [
    "mud_flaps_wide",
    "bed_rack",
    "side_steps",
    "pickup_bed"
  ],
  "meteor": [
    "exhaust_flame_kit",
    "wheelie_bar",
    "ducktail",
    "fastback"
  ],
  "glasswing": [
    "light_bar_narrow",
    "roof_pod",
    "vortex_generators",
    "van_box"
  ],
  "octavius": [
    "roof_scoop",
    "roof_basket",
    "rear_diffuser",
    "notchback"
  ],
  "dominator": [
    "side_pipes_twin",
    "blower",
    "ducktail",
    "notchback"
  ],
  "fennecx": [
    "studded_tyres",
    "fender_flares",
    "roof_rails",
    "notchback"
  ],
  "vanguard": [
    "roof_rails",
    "roof_tent",
    "side_steps",
    "pickup_bed"
  ],
  "nocturne": [
    "rear_louvres",
    "whale_tail",
    "hood_scoop_twin",
    "notchback"
  ],
  "apex-r": [
    "hood_scoop_twin",
    "ducktail",
    "side_canards",
    "fastback"
  ],
  "brawler": [
    "bullbar_wide",
    "roll_cage",
    "spotlight_bar",
    "pickup_bed"
  ],
  "paladin": [
    "antennas_four",
    "roof_basket",
    "snorkel",
    "van_box"
  ],
  "breaker": [
    "flag_single",
    "roll_cage",
    "side_steps",
    "pickup_bed"
  ],
  "samurai": [
    "brace_slim",
    "roof_pod",
    "rear_louvres",
    "notchback"
  ],
  "rallyhawk": [
    "spotlight_bar",
    "roof_basket",
    "mud_flaps",
    "notchback"
  ],
  "zephyr": [
    "visor_plain",
    "ducktail",
    "side_pipes",
    "speedster"
  ],
  "mantis": [
    "diffuser_six",
    "whale_tail",
    "vortex_generators",
    "notchback"
  ],
  "centaur": [
    "tow_hook_small",
    "spare_roof",
    "bullbar",
    "notchback"
  ],
  "hornet": [
    "rocket_boosters",
    "parachute",
    "ducktail",
    "notchback"
  ],
  "bastion": [
    "headlight_guards",
    "light_pod",
    "roll_cage",
    "pickup_bed"
  ],
  "phantom": [
    "snorkel",
    "roof_tent",
    "tow_hook",
    "van_box"
  ],
  "dragline": [
    "fuel_cell_twin",
    "bed_rack",
    "exhaust_stacks",
    "van_box"
  ],
  "aerowing": [
    "vortex_generators",
    "ducktail",
    "roof_pod",
    "notchback"
  ],
  "voltaic": [
    "mud_flaps",
    "roof_basket",
    "rear_diffuser",
    "notchback"
  ],
};

/** The assignment table everything else reads. One row per car, three
 *  details each; the first is the car's headline and the other two are
 *  hardware that changes its outline. */
export const SIGNATURES = KITS;


export const SIGNATURE_DETAIL_IDS = Object.keys(D);

/**
 * Wire one signature into a built body.
 * @returns true when a signature was emitted
 */
export function applySignatures(P, st, r, spec) {
  return !!applySignature(P, st, spec, 'high', r);
}

export default SIGNATURES;

/* --------------------------------------------------------------------------
 *  Names the rest of the pack already imports. bodies.js asks for
 *  `applySignature(P, st, spec, quality)` and tools/verify.mjs walks
 *  `BODY_SIGNATURES` / `CAR_SIGNATURE`; both spellings live here so the module
 *  has one home.
 * ------------------------------------------------------------------------ */
export const BODY_SIGNATURES = D;
export const CAR_SIGNATURE = SIGNATURES;
export const SIGNATURE_KINDS = SIGNATURE_DETAIL_IDS;
export const SIGNATURE_STATS = (() => {
  const use = new Map();
  for (const id of Object.keys(SIGNATURES)) {
    const k = SIGNATURES[id][0];
    use.set(k, (use.get(k) || 0) + 1);
  }
  return {
    cars: Object.keys(SIGNATURES).length,
    kinds: SIGNATURE_DETAIL_IDS.length,
    used: use.size,
    reused: [...use.entries()].filter(([, n]) => n > 1).map(([k, n]) => `${k}x${n}`),
  };
})();

/**
 * bodies.js spelling. `r` is the built body (parts bag already made, wheel
 * anchors and cabin stations recorded); it is passed separately because the
 * details need real anchors, not guesses.
 * @returns the detail name, or null when this car has none
 */
export function applySignature(P, st, spec, quality = 'high', r = null) {
  const kit = SIGNATURES[spec.id];
  if (!kit || !r) return null;
  const done = [];
  for (const name of kit) {
    const fn = D[name];
    if (!fn) continue;
    fn({ P, st, r, spec, params: {}, quality });
    done.push(name);
  }
  if (!done.length) return null;
  return { kind: done[0], kit: done };
}
