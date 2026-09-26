/* =============================================================================
 * ultra/lamps.js — real lamp clusters for the ultra bodies
 * -----------------------------------------------------------------------------
 * WHY THIS EXISTS
 * The base library builds lights by painting a *patch* of emissive material onto
 * the shell (`flankPatch` in section 9 of carLibraryPro.js). On a low, wide
 * wedge nose that patch lands on the upper surface of the bonnet, is barely
 * 50 mm tall against a 2.6 m car, and under a bright studio it reads as a smudge
 * of blown-out paint rather than a lamp. The cars look like they have no lights
 * at all.
 *
 * This module builds lamps instead of painting them: a chrome bezel, a dark
 * recess and a proud emissive lens, nested so the lens sits inside a black
 * surround inside a bright rim. That is what makes a light read as a light.
 *
 * THE SURFACE PROBLEM
 * A lamp has to sit ON the shell, and the shell is a lofted superellipse whose
 * section changes width and height along the car. Two consequences:
 *
 *  1. Sampling the finished mesh for a height (the trick rig.js uses for the
 *     antenna) reports the *crown* of whatever is nearby, not the surface under
 *     the lamp. So we evaluate the section analytically instead, replicating
 *     `ring()` exactly — including the `creases` inset, which pulls the shell in
 *     by up to 13% of the half-width and would otherwise leave the lamp floating
 *     90 mm off the body.
 *
 *  2. The section normal (nx, ny, 0) has no Z component, so a lamp built from it
 *     would face sideways on a nose that tapers. We therefore difference along
 *     z as well as around the section and take the true 3D normal, so lamps on
 *     the nose genuinely face forward.
 *
 * THE OCCLUSION PROBLEM
 * Fender flares, roof racks, roll cages and light bars are all built before the
 * lamps and all stand proud of the shell. A lamp laid on the bare shell can end
 * up buried inside one. So the lamps are built last, against a uniform grid of
 * every other vertex in the body, and pushed out along their own normal until
 * they clear whatever is in front of them. That is a 3D generalisation of the
 * `shellTopNear` trick in rig.js and it is what keeps this working across 40
 * bodies with wildly different silhouettes.
 * ===========================================================================*/

import { PI, TAU, stationAt } from '../carLibraryPro.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;

/* ========================================================================== *
 *  THE SHELL SURFACE
 * ========================================================================== */

/** Shortest wrapped angular distance, [0, PI]. Mirrors the base library. */
function angDist(a, b) { const d = Math.abs(((a - b) % TAU + TAU) % TAU); return d > PI ? TAU - d : d; }

/**
 * Exact point on the painted shell at (z, t), in the body's own frame.
 *
 * This is `ring()` from carLibraryPro.js with the same arguments buildBody
 * passes for the primary shell — `shear` is always 0 there, because stations are
 * 5-tuples so `s[5]` is undefined. If ring() ever gains a term, this has to gain
 * it too; tools/verify.mjs asserts the two agree by differencing against the
 * built mesh.
 *
 * @returns {{x:number, y:number, cy:number, hw:number, hh:number, n:number, inset:number}}
 */
export function surfaceAt(stations, creases, z, t) {
  const s = stationAt(stations, z);
  const cy = s[1], hw = s[2], hh = s[3], n = s[4];
  const e = 2 / n, ct = Math.cos(t), sn = Math.sin(t);
  let x = Math.sign(ct) * Math.pow(Math.abs(ct), e) * hw;
  let y = Math.sign(sn) * Math.pow(Math.abs(sn), e) * hh;
  let inset = 0;
  if (creases) {
    for (let c = 0; c < creases.length; c++) {
      const cr = creases[c];
      if (cr.z0 !== undefined && (z < cr.z0 || z > cr.z1)) continue;
      const d = angDist(t, cr.t) / cr.w;
      inset += cr.k * Math.exp(-d * d);
    }
    inset = Math.min(inset, 0.45);
    x *= 1 - inset; y *= 1 - inset;
  }
  return { x, y: cy + y, cy, hw, hh, n, inset };
}

/**
 * True outward unit normal at (z, t), including the plan-view taper.
 *
 * T_t x T_z gives the surface normal; its sign is then fixed by requiring it to
 * point away from the section spine. Doing it by projection rather than by
 * assuming a winding means this cannot silently invert when a body's station
 * table happens to run the other way.
 */
export function surfaceNormal(stations, creases, z, t) {
  const dt = 0.012, dz = 0.010;
  const p = surfaceAt(stations, creases, z, t);
  const pa = surfaceAt(stations, creases, z, t - dt), pb = surfaceAt(stations, creases, z, t + dt);
  const pc = surfaceAt(stations, creases, z - dz, t), pd = surfaceAt(stations, creases, z + dz, t);
  const tx = pb.x - pa.x, ty = pb.y - pa.y;
  const ux = pd.x - pc.x, uy = pd.y - pc.y, uz = 2 * dz;
  let nx = ty * uz, ny = -tx * uz, nz = tx * uy - ty * ux;
  const l = Math.hypot(nx, ny, nz) || 1;
  nx /= l; ny /= l; nz /= l;
  // away from the spine: the section's centre line is x = 0, y = cy
  if (nx * p.x + ny * (p.y - p.cy) < 0) { nx = -nx; ny = -ny; nz = -nz; }
  return { x: nx, y: ny, z: nz };
}

/* ========================================================================== *
 *  OCCLUSION FIELD
 * ========================================================================== */

/**
 * A uniform XZ grid of every vertex already in the body, so a lamp can ask "how
 * far does anything stick out past me along my own normal, right here?".
 *
 * Only the horizontal plane is hashed: a lamp's question is always "is something
 * in front of me locally", and the vertical axis of a car body is thin, so a 2D
 * grid is both sufficient and a third of the memory.
 */
class Occluders {
  constructor(parts, skip, cell = 0.08) {
    this.cell = cell;
    this.map = new Map();
    for (const [slot, m] of parts.entries()) {
      if (skip.has(slot)) continue;
      const p = m.p;
      for (let i = 0; i < m.count; i++) {
        const x = p[i * 3], z = p[i * 3 + 2];
        const k = Math.round(x / cell) + ':' + Math.round(z / cell);
        let a = this.map.get(k);
        if (!a) { a = []; this.map.set(k, a); }
        a.push(p[i * 3], p[i * 3 + 1], p[i * 3 + 2]);
      }
    }
  }

  /**
   * The largest positive projection along `n` of any occluder vertex within `r`
   * of `p`. 0 means nothing is in front of the lamp.
   */
  reach(px, py, pz, n, r) {
    const c = this.cell, R = Math.ceil(r / c), r2 = r * r;
    const cx = Math.round(px / c), cz = Math.round(pz / c);
    let best = 0;
    for (let ix = cx - R; ix <= cx + R; ix++) {
      for (let iz = cz - R; iz <= cz + R; iz++) {
        const a = this.map.get(ix + ':' + iz);
        if (!a) continue;
        for (let i = 0; i < a.length; i += 3) {
          const dx = a[i] - px, dy = a[i + 1] - py, dz = a[i + 2] - pz;
          if (dx * dx + dy * dy + dz * dz > r2) continue;
          const d = dx * n.x + dy * n.y + dz * n.z;
          if (d > best) best = d;
        }
      }
    }
    return best;
  }
}

/* ========================================================================== *
 *  LAMP GEOMETRY
 * ========================================================================== */

/**
 * One lamp panel: a grid over a band of section angles `t0..t1` and a span of
 * `z0..z1`, laid `lift` above the shell along the true surface normal.
 *
 * Open by design — a sheet, not a closed shell. The body is directly behind it,
 * so there is nothing to see through, and the winding is right by construction:
 * stepping +t then +z winds outward, because T_t x T_z is the outward normal.
 * That is what lets tools/verify.mjs keep asserting on signed volume.
 */
function panel(M, stations, creases, o) {
  const { z0, z1, t0, t1, lift = 0.016, cols = 4, rows = 6, occl = null, clear = 0 } = o;
  const base = M.count;
  const put = (r, c) => {
    const z = lerp(z0, z1, r / rows), t = lerp(t0, t1, c / cols);
    const p = surfaceAt(stations, creases, z, t), n = surfaceNormal(stations, creases, z, t);
    let l = lift;
    if (occl) l += clamp(occl.reach(p.x, p.y, z, n, clear) - 0.012, 0, 0.10);
    M.vert(p.x + n.x * l, p.y + n.y * l, z + n.z * l, n.x, n.y, n.z, c / cols, r / rows);
  };
  for (let r = 0; r <= rows; r++) for (let c = 0; c <= cols; c++) put(r, c);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const a = base + r * (cols + 1) + c, b = a + 1;
    const d = base + (r + 1) * (cols + 1) + c, e = d + 1;
    M.quad(a, b, e, d);
  }
  return base;
}

/**
 * One complete lamp: accent bezel, black recess, emissive lens.
 *
 * The three layers are strictly nested — each smaller and higher than the one
 * outside it — so from any angle you see lens, inside a dark ring, inside a
 * coloured rim. Lift is ordered rather than equal so the layers cannot z-fight.
 *
 * Two things this deliberately does NOT do, both learned from renders:
 *
 *  - no mirror chrome bezel. `chrome` is metalness 1 / roughness 0.055, so under
 *    the studio softbox it clips to the same white as the lens and the whole
 *    lamp becomes one featureless blob. The car's own `accent` metal is used
 *    instead: a mid-tone that reads against both the white lens and the black
 *    recess, and ties the lamps to the livery for free.
 *  - no raised projector in the middle. At this scale a bright centre plus a
 *    dark surround reads as an eyeball. A lamp reads as a lamp by being long,
 *    thin and evenly lit.
 */
function cluster(P, stations, creases, o) {
  const { z0, z1, t0, t1, occl, clear, lamp = 'head', rim = true } = o;
  const LENS = P.get(lamp), DARK = P.get('dark'), RIM = P.get('accent');

  if (rim) {
    panel(RIM, stations, creases, {
      z0: z0 - 0.010, z1: z1 + 0.010, t0: t0 - 0.026, t1: t1 + 0.026,
      lift: 0.012, cols: 5, rows: 4, occl, clear,
    });
  }
  panel(DARK, stations, creases, {
    z0: z0 - 0.005, z1: z1 + 0.005, t0: t0 - 0.012, t1: t1 + 0.012,
    lift: 0.017, cols: 5, rows: 3, occl, clear,
  });
  panel(LENS, stations, creases, { z0, z1, t0, t1, lift: 0.023, cols: 4, rows: 3, occl, clear });
}

/* ========================================================================== *
 *  LAYOUT
 * ========================================================================== */

/**
 * Where the lights go, in the body's own proportions.
 *
 * `spec.lamps` can override any field for character.
 *
 *   zt  [a, b] fraction of the total length: back from the nose, forward from
 *       the tail. Kept SMALL — these are lamps, not livery.
 *   t   section angle: 0 = widest point of the flank, PI/2 = crown.
 *
 * HEAD LAMPS ARE PLACED AGAINST THE FENDER, NOT AGAINST THE CLOCK.
 * The first version put them at a fixed fraction of the car's length and half of
 * them ended up sitting inside a fender flare: buildBody sweeps each flare
 * through +/-1.34*span radians around the wheel, so the front flare's tip can
 * reach within 150 mm of the nose. The band is therefore derived from the wheel
 * and the flare span — forward of the flare tip, back from the nose — and falls
 * back to a fixed band only if that leaves no room at all.
 *
 * TAIL LAMPS RUN RIGHT ACROSS THE CAR.
 * A full-width bar is the single most legible light on a car seen from behind,
 * and the default camera spends most of its time behind the car.
 */
export function lampLayout(spec, st) {
  const noseZ = st[st.length - 1][0], tailZ = st[0][0];
  const L = noseZ - tailZ;
  const o = spec.lamps || {};

  // An open-wheel car has no bodywork at the front to hang a lamp on and its
  // nose is a needle, so the lamps sit high and tight on the flanks instead.
  const open = !!spec.exposedWheels;

  // Where the front flare stops. buildBody passes `1.34 * (F.span || 1)` as the
  // arch half-angle and `w.r * 1.045` as its radius, so this is exact.
  const W = spec.wheel;
  const span = 1.34 * ((spec.fenders && spec.fenders.span) || 1);
  const archF = W ? W.zf + W.r * 1.045 * Math.sin(Math.min(PI / 2, span)) : noseZ - 0.20 * L;

  let hz0 = archF + 0.022, hz1 = noseZ - 0.020;
  if (hz1 - hz0 < 0.055) hz0 = hz1 - 0.055;   // very short nose: take what there is
  if (open) { hz0 = noseZ - 0.175 * L; hz1 = noseZ - 0.055 * L; }
  if (o.head && o.head.zt) { hz0 = noseZ - o.head.zt[1] * L; hz1 = noseZ - o.head.zt[0] * L; }

  const head = {
    z0: hz0, z1: hz1,
    t0: o.head && o.head.t0 !== undefined ? o.head.t0 : (open ? 0.45 : 0.40),
    t1: o.head && o.head.t1 !== undefined ? o.head.t1 : (open ? 1.00 : 0.99),
    full: !!(o.head && o.head.full),
  };
  const tail = {
    z0: tailZ + ((o.tail && o.tail.zt) || [0.018, 0.055])[0] * L,
    z1: tailZ + ((o.tail && o.tail.zt) || [0.018, 0.055])[1] * L,
    t0: o.tail && o.tail.t0 !== undefined ? o.tail.t0 : 0.24,
    t1: o.tail && o.tail.t1 !== undefined ? o.tail.t1 : 1.02,
    // a bar all the way across is the default; twin clusters are the override
    full: o.tail && o.tail.full !== undefined ? !!o.tail.full : true,
  };

  const band = (side, s2) => {
    const t1 = s2.full ? PI / 2 : s2.t1;
    return { z0: s2.z0, z1: s2.z1, t0: side > 0 ? s2.t0 : PI - t1, t1: side > 0 ? t1 : PI - s2.t0 };
  };

  return { L, noseZ, tailZ, head, tail, band, archF };
}

/* ========================================================================== *
 *  ENTRY POINT
 * ========================================================================== */

/** Slots this module owns. Excluded from its own occlusion grid. */
export const LAMP_SLOTS = ['head', 'tail', 'glow'];

/**
 * Add lamp clusters to an already-built body. Purely additive: nothing the base
 * builder produced is touched, and the base's own light patches stay put as a
 * soft emissive fringe under the new lenses.
 */
export function buildLamps(P, st, spec) {
  const creases = spec.creases;
  const lay = lampLayout(spec, st);
  // 90 mm is about the gap between the shell and a fender flare; anything
  // further out than that is a separate structure the lamp should ignore rather
  // than try to climb over.
  const occl = new Occluders(P, new Set(LAMP_SLOTS), 0.08);

  for (const sd of [1, -1]) {
    const h = lay.band(sd, lay.head);
    cluster(P, st, creases, { ...h, occl, clear: 0.11, lamp: 'head' });
    const t = lay.band(sd, lay.tail);
    // the tail bar's two halves meet exactly at the crown, so the chrome rim
    // would draw a bright seam down the middle of the light. Suppress it there.
    cluster(P, st, creases, { ...t, occl, clear: 0.11, lamp: 'tail', rim: !lay.tail.full });
  }

  /* ---- a thin indicator tick at the outboard end of each head lamp ------
   * Sits just inboard of the main lens and a hair higher, so the front of the
   * car carries two lit elements per side instead of one. That is what makes
   * the front read as "has lights" at thumbnail size. */
  for (const sd of [1, -1]) {
    const h = lay.band(sd, lay.head);
    const zc = lerp(h.z0, h.z1, 0.16);
    panel(P.get('head'), st, creases, {
      z0: zc - 0.008, z1: zc + 0.008,
      t0: h.t0, t1: lerp(h.t0, h.t1, 0.22),
      lift: 0.025, cols: 3, rows: 2, occl, clear: 0.11,
    });
  }

  return lay;
}
