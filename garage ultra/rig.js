/* =============================================================================
 * ultra/rig.js — where the accessories attach to a car
 * -----------------------------------------------------------------------------
 * Toppers and antennas are authored in the car's own frame with their origin at
 * the roof contact point, so "where does it go" reduces to one question: where
 * is the roof surface? The loft stations answer that in closed form.
 *
 * The section is a superellipse, |x/a|^n + |y/b|^n = 1 — carLibraryPro's ring()
 * parameterises it as |cos t|^(2/n), which satisfies exactly that. So for
 * k = |x|/a the roof height is
 *
 *     y = cy + b * (1 - k^n)^(1/n)
 *
 * Sampling the built mesh instead looks easier and is wrong: taking the highest
 * vertex within a radius reports the crown rather than the surface at x, so the
 * mast ends up hovering a few centimetres above the roof.
 *
 * This lives in the library, not the gallery, so it can be tested headlessly
 * against every body in the pack.
 * ===========================================================================*/

import { topperAnchor } from './toppers.js';
import { stationAt } from '../carLibraryPro.js';

/** The station list to use: the cabin subset when the body has one.
 *
 *  NOTE: `built.meta.cabin` is a plain ARRAY of stations, not an object — the
 *  `{z0, z1, hw, hh, ...}` shape is on the car *spec*. Reading `cabin.z0` gives
 *  `undefined`, and arithmetic on it yields NaN. */
export function roofStations(built) {
  const cab = built.meta && built.meta.cabin;
  return (cab && cab.length) ? cab : built.stations;
}

/** Index of the highest station — the crown — in a station list. */
export function crownIndex(src) {
  let crown = 0;
  for (let i = 1; i < src.length; i++) {
    if (src[i][1] + src[i][3] > src[crown][1] + src[crown][3]) crown = i;
  }
  return crown;
}

/**
 * A point on the roof surface at station index `i`.
 * `xFrac` is how far out across the half-width to sit (0 = centreline, 1 = the
 * widest point of the section).
 *
 * This is the primitive. roofSpot() below wraps it in the `t` parameterisation
 * for callers that want a position along the roof rather than a station; the
 * placement code works in indices because that is what its walk actually steps
 * over, and round-tripping through a fraction loses the station it chose.
 */
export function roofSpotAt(built, i, xFrac) {
  const src = roofStations(built);
  const crown = crownIndex(src);
  const s = src[Math.max(0, Math.min(src.length - 1, i))];
  const a = s[2], b = s[3], cy = s[1], n = s[4];
  const k = Math.min(0.999, Math.max(0, xFrac));
  const y = cy + b * Math.pow(Math.max(0, 1 - Math.pow(k, n)), 1 / n);
  return { z: s[0], y, hw: a, x: -a * k, i: Math.max(0, Math.min(src.length - 1, i)), crown };
}

/**
 * A point on the roof surface.
 * `t` walks from the crown toward the nose (0 = crown, 1 = nose end of the
 * roof); NEGATIVE t walks back toward the tail instead.
 */
export function roofSpot(built, t, xFrac) {
  const src = roofStations(built);
  const crown = crownIndex(src);
  const last = src.length - 1;
  const i = t >= 0
    ? Math.round(crown + (last - crown) * t)
    : Math.round(crown * (1 + t));
  return roofSpotAt(built, i, xFrac);
}

/** How far below the ideal surface to seat an accessory. Creases inset the real
 *  shell by up to ~4.5% of the half height — a few millimetres — so seating it
 *  exactly on the ideal surface would leave a visible gap. */
export const SEAT = 0.012;

/** Antennas are authored around 0.33 m tall, which against a 2.5 m car reads as
 *  a wire rather than an accessory. The gallery scales the whole assembly about
 *  its base, so this only changes how big it looks. */
export const ANTENNA_SCALE = 1.32;

/**
 * How far back along the roof the mast sits, as a fraction of the crown-to-tail
 * run of the roof stations. The antenna used to sit FORWARD of the crown (the
 * old call was `roofSpot(built, 0.5, 0.86)`), which put it over the windscreen
 * and — on anything with a topper — right through the hat's brim.
 */
const ANTENNA_BACK = 0.46;

/** How far out across the section the mast sits. */
const ANTENNA_X = 0.80;

/** The radius, in metres, that counts as "right here" when asking whether
 *  something is standing above the shell. Exported so the tests probe with the
 *  same number the placement used — a test with its own radius measures a
 *  different question and drifts the moment this one changes. */
export const NEAR_R = 0.10;

/** How much structure above the ideal surface makes a station unusable. Below
 *  this it is dome curvature, which reads as a few millimetres; above it, a
 *  rack, a wing, an airbox. */
const OBSTRUCTION = 0.02;

/**
 * Highest vertex of the shell within `radius` of (x, z), in the car frame.
 *
 * Note this reports the highest vertex *near* the point, not the surface at the
 * point, so it over-reads on a domed roof. That is fine for its one use below,
 * which only asks "is there something well above the shell here?" — but it is
 * the wrong tool for finding the roof height, which is what roofSpot's closed
 * form is for.
 */
function shellTopNear(parts, x, z, radius) {
  let best = -Infinity;
  const r2 = radius * radius;
  for (const [, mesh] of parts.entries()) {
    const p = mesh.p;
    if (!p) continue;
    for (let i = 0; i < mesh.count; i++) {
      const dx = p[i * 3] - x, dz = p[i * 3 + 2] - z;
      if (dx * dx + dz * dz > r2) continue;
      if (p[i * 3 + 1] > best) best = p[i * 3 + 1];
    }
  }
  return best;
}

/**
 * The highest the SHELL ITSELF could be within `radius` of (x, z).
 *
 * This is the yardstick that makes "is something standing here?" answerable.
 * Comparing shellTopNear() against the surface height at the mount is wrong: a
 * domed roof reads as 30-50 mm of structure and every station behind the crown
 * looks obstructed. But a section can never be taller than its own crown, so
 * anything above the best crown in the window is real structure — a rack, a
 * wing, an airbox — and nothing else.
 */
function shellCeiling(stations, z, radius) {
  let best = -Infinity;
  for (let i = 0; i <= 6; i++) {
    const s = stationAt(stations, z - radius + (2 * radius) * (i / 6));
    const crown = s[1] + s[3];
    if (crown > best) best = crown;
  }
  return best;
}

/** Where the topper sits.
 *  `scale` grows it about the roof contact point, which is why every topper is
 *  authored with its base at y ~= 0: scaling then keeps it planted. */
export function topperMount(built, scale = 1) {
  const anchor = topperAnchor(built);
  return { x: 0, y: anchor.y - 0.004, z: anchor.z, scale };
}

/**
 * Where the antenna sits: as far back along the roof as it can go without
 * standing in something.
 *
 * Three rules do the work, and all of them exist because a fixed fraction back
 * is wrong somewhere in a pack of sixty very different cars.
 *
 * HEIGHT. `roofStations` hands back the CABIN subset when the body has one, and
 * the crown is rarely in the middle of it. Walk back station by station and stop
 * where the section drops below two thirds of the crown height — past that it is
 * a rear screen or a boot lid, and the mast would grow out of it at an angle.
 *
 * OBSTRUCTION. On a car with no cabin at all — every Formula body — the crown is
 * the back of the engine cover and the rear wing sits directly behind it. The
 * height rule happily walks the mast into the endplate. So a station only counts
 * if it is CLEAR: nothing above the shell's own crown within `NEAR_R`.
 *
 * DIRECTION. Backward is the preference, but when nothing behind the crown is
 * clear the search continues FORWARD, which is where a real single-seater
 * carries its antenna anyway. Only if neither direction yields a clean station
 * does the mast perch on top of the nearest structure.
 *
 * The returned `i` is the station index it settled on, so callers and tests can
 * address the exact station rather than re-deriving it from `t`.
 */
export function antennaMount(built, scale = ANTENNA_SCALE) {
  const src = roofStations(built);
  const crown = crownIndex(src);
  const lastI = src.length - 1;
  const topY = src[crown][1] + src[crown][3];
  const floor = topY - 0.34 * src[crown][3];
  const parts = built.parts;

  const order = [];
  const limit = Math.max(0, Math.round(crown * (1 - ANTENNA_BACK)));
  for (let k = crown; k >= limit; k--) {
    if (k !== crown && src[k][1] + src[k][3] < floor) break;
    order.push(k);
  }
  order.reverse();                       // furthest back first
  const fwd = Math.min(lastI, crown + Math.max(1, Math.round(lastI * 0.22)));
  for (let k = crown + 1; k <= fwd; k++) order.push(k);   // then forward, nearest first

  let fallback = null;
  for (const i of order) {
    const s = roofSpotAt(built, i, ANTENNA_X);
    const y = s.y - SEAT;
    if (!fallback) fallback = { s, y };
    if (!parts) return { x: s.x, y, z: s.z, scale, i };
    const top = shellTopNear(parts, s.x, s.z, NEAR_R);
    const ceiling = shellCeiling(src, s.z, NEAR_R);
    if (!Number.isFinite(top) || top <= ceiling + OBSTRUCTION) {
      return { x: s.x, y, z: s.z, scale, i };
    }
    fallback = { s, y };
  }

  // Nowhere is clear. Sit on top of whatever is there rather than inside it.
  const { s, y } = fallback || { s: roofSpotAt(built, crown, ANTENNA_X), y: 0 };
  const top = parts ? shellTopNear(parts, s.x, s.z, NEAR_R) : -Infinity;
  return {
    x: s.x,
    y: Number.isFinite(top) && top > y + 0.03 ? top - 0.004 : y,
    z: s.z,
    scale,
    i: s.i,
  };
}
