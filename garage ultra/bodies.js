/* =============================================================================
 * ultra/bodies.js — 20 new car bodies + 12 new wheel sets
 * -----------------------------------------------------------------------------
 * The specs below use the EXACT same authoring schema as the base library, so
 * everything already in the host project (hit boxes, wheel rigs, garage UI,
 * livery UVs) keeps working untouched.
 *
 *   keys: [z, centreY, halfWidth, halfHeight, squareness]
 *     z  -1.30 tail .. +1.30 nose     (authoring frame, host rescales)
 *     n  2 = ellipse, 4 = squircle, 8+ = near-rectangle with soft corners
 *
 * Bodies that need geometry the base builder never had are marked with a flag
 * and finished off in buildBodyUltra():
 *
 *   exposedWheels  open-wheel formula car — front wing, sidepods, airbox, halo
 *   bed            pickup bed with walls, tailgate and a ribbed floor
 *   exo            full exoskeleton tube cage wrapped around the shell
 *   stacks         twin vertical exhaust stacks behind the cab
 *   roofrack       van/truck roof rack
 *   nos            nitrous bottles + plumbing
 *   studs          studded ice tyres (wheel-side flag, honoured by buildWheelUltra)
 * ===========================================================================*/

import {
  TAU, PI, Mesh, Parts, ring, loft, cap, shell, stationAt, withSeams, seamBands,
  crownY, flankX, crownPatch, flankPatch, louvres, arch, rbox, plate, slab,
  revolveX, washerX, torusX, spoke, tube, aerofoil, ringStrip, revolveZ,
  buildBody, buildWheel, CARS, CAR_BY_ID, WHEELS, WHEEL_BY_ID, RIM_FINISHES,
} from '../carLibraryPro.js';
import { buildLamps } from './lamps.js';
import { WHEELS_EXTRA } from './wheels.js';
import { applySignature, reshapeSpec } from './signatures.js';
import { F1_CARS, MONSTER_CARS } from './bodies2.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;

const W_STD = { x: 0.60, zf: 0.80, zr: -0.78, r: 0.288, y: -0.17 };

/* ========================================================================== *
 *  20 NEW BODIES
 * ========================================================================== */

/** The hand-authored twenty. The Formula and monster-truck families live in
 *  bodies2.js, because those two are generated from one profile each rather
 *  than typed out, and keeping them apart makes that obvious. */
/** The first twenty, written one station table at a time. Exported because
 *  tools/verify.mjs calibrates the silhouette-distinctness threshold against
 *  them: they are the set the user has already seen and accepted, so they are
 *  the honest yardstick for "varied enough". */
export const HANDMADE_CARS = [

  /* 1 ------------------------------------------------------------------- */
  {
    id: 'hooligan', name: 'Hooligan', cls: 'Rally', tagline: 'Gravel-spec hatch. Mud flaps, roof vent, no manners.',
    rings: 30, seg: 34, wheel: { x: 0.60, zf: 0.80, zr: -0.78, r: 0.312, y: -0.185 },
    keys: [
      [-1.24, 0.055, 0.500, 0.255, 5.2], [-1.00, 0.065, 0.665, 0.290, 5.8],
      [-0.48, 0.050, 0.700, 0.305, 6.2], [ 0.06, 0.030, 0.700, 0.295, 6.0],
      [ 0.62, 0.005, 0.675, 0.255, 5.2], [ 1.04,-0.030, 0.600, 0.195, 4.4],
      [ 1.24,-0.050, 0.485, 0.145, 3.6],
    ],
    creases: [ { t: 0, k: 0.08, w: 0.28 }, { t: PI, k: 0.08, w: 0.28 } ],
    seams: [-0.56, 0.20, 0.84],
    cabin: { z0: -0.44, z1: 0.36, hw: 0.50, hh: 0.170, cy: 0.300, n: 5.0, taper: 0.18, rake: 0.08, glass: true },
    fenders: { flareF: 0.100, flareR: 0.105, span: 1.00, thick: 0.050 },
    louvres: { z0: 0.58, z1: 0.86, halfW: 0.22, halfL: 0.026, count: 4, taper: 0.2 },
    splitter: { w: 0.68, len: 0.18, drop: 0.024, lip: true },
    diffuser: { fins: 4, w: 0.56, h: 0.085 },
    skirts: { h: 0.055, out: 0.030, flaps: true },
    wing: { type: 'roof', z: -1.10, y: 0.44, span: 0.66, chord: 0.20, tilt: 0.14, endplates: true },
    exhaust: { count: 1, x: 0.36, y: -0.12, z: -1.22, r: 0.065, style: 'single' },
    lights: { head: { z0: 1.02, z1: 1.22, y0: 0.02, y1: 0.11 }, tail: { w: 0.48, h: 0.07, y: 0.12 } },
    lightbar: { y: 0.16, z: 1.18, count: 4 },
    grille: { w: 0.34, h: 0.09, z: 1.23 }, badge: true, mirrors: true,
  },

  /* 2 ------------------------------------------------------------------- */
  {
    id: 'leviathan', name: 'Leviathan', cls: 'Monster', tagline: 'Two and a half tonnes of air. Wheels taller than the doors.',
    rings: 30, seg: 34, wheel: { x: 0.68, zf: 0.88, zr: -0.86, r: 0.460, y: -0.300 },
    keys: [
      [-1.26, 0.220, 0.520, 0.260, 6.0], [-1.02, 0.235, 0.680, 0.285, 6.6],
      [-0.46, 0.225, 0.710, 0.295, 7.0], [ 0.12, 0.210, 0.705, 0.285, 6.6],
      [ 0.68, 0.180, 0.680, 0.250, 5.8], [ 1.06, 0.140, 0.610, 0.195, 5.0],
      [ 1.26, 0.115, 0.500, 0.150, 4.2],
    ],
    creases: [ { t: 0, k: 0.05, w: 0.22 }, { t: PI, k: 0.05, w: 0.22 } ],
    seams: [-0.62, 0.14, 0.86],
    cabin: { z0: -0.40, z1: 0.34, hw: 0.52, hh: 0.170, cy: 0.440, n: 6.0, taper: 0.12, rake: 0.05, glass: true },
    fenders: { flareF: 0.110, flareR: 0.115, span: 1.10, thick: 0.055 },
    splitter: { w: 0.72, len: 0.14, drop: 0.020, lip: false, bullbar: true },
    diffuser: { fins: 3, w: 0.58, h: 0.080 },
    skirts: { h: 0.080, out: 0.030 },
    wing: { type: 'none' },
    stacks: 2, cage: true, ladder: true,
    exhaust: { count: 2, x: 0.52, y: 0.10, z: -0.98, r: 0.055, style: 'stack' },
    lights: { head: { z0: 1.02, z1: 1.22, y0: 0.16, y1: 0.28 }, tail: { w: 0.54, h: 0.10, y: 0.30 } },
    lightbar: { y: 0.62, z: 0.18, count: 6 },
    grille: { w: 0.44, h: 0.13, z: 1.23 }, badge: true, mirrors: true,
  },

  /* 3 ------------------------------------------------------------------- */
  {
    id: 'stingray', name: 'Stingray', cls: 'Sports', tagline: 'Low, wide and pointed. Built to slice air.',
    rings: 32, seg: 34, wheel: { x: 0.635, zf: 0.86, zr: -0.84, r: 0.286, y: -0.145 },
    keys: [
      [-1.28, 0.030, 0.460, 0.175, 4.2], [-1.04, 0.045, 0.660, 0.205, 4.8],
      [-0.48, 0.020, 0.720, 0.215, 5.2], [ 0.10,-0.005, 0.700, 0.190, 5.0],
      [ 0.66,-0.030, 0.630, 0.150, 4.2], [ 1.08,-0.055, 0.500, 0.105, 3.4],
      [ 1.30,-0.070, 0.320, 0.062, 2.6],
    ],
    creases: [ { t: 0, k: 0.12, w: 0.34 }, { t: PI, k: 0.12, w: 0.34 },
               { t: PI * 0.5, k: 0.05, w: 0.26, z0: 0.1, z1: 1.3 } ],
    seams: [-0.72, 0.26],
    cabin: { z0: -0.56, z1: 0.16, hw: 0.42, hh: 0.140, cy: 0.195, n: 3.4, taper: 0.32, rake: 0.12, glass: true, canopy: true },
    fenders: { flareF: 0.080, flareR: 0.100, span: 1.08, thick: 0.034 },
    splitter: { w: 0.72, len: 0.30, drop: 0.008, lip: true },
    diffuser: { fins: 7, w: 0.60, h: 0.100 },
    skirts: { h: 0.036, out: 0.030 },
    wing: { type: 'ducktail', z: -1.12, y: 0.22, span: 0.62, chord: 0.20, tilt: 0.20 },
    spine: { z0: -1.06, z1: -0.42, h: 0.10 },
    canards: true,
    exhaust: { count: 2, x: 0.16, y: 0.02, z: -1.30, r: 0.050, style: 'centre' },
    lights: { head: { z0: 1.06, z1: 1.28, y0: -0.05, y1: 0.02 }, tail: { w: 0.44, h: 0.026, y: 0.06, strip: true } },
    canardsFlag: true,
  },

  /* 4 ------------------------------------------------------------------- */
  {
    id: 'brickhouse', name: 'Brickhouse', cls: 'Van', tagline: 'Panel van with a roof rack and absolutely no interest in aerodynamics.',
    rings: 28, seg: 32, wheel: { x: 0.585, zf: 0.80, zr: -0.78, r: 0.300, y: -0.205 },
    keys: [
      [-1.22, 0.110, 0.600, 0.340, 7.5], [-1.00, 0.115, 0.690, 0.375, 8.0],
      [-0.44, 0.105, 0.710, 0.385, 8.5], [ 0.16, 0.090, 0.710, 0.370, 8.0],
      [ 0.74, 0.050, 0.690, 0.310, 6.4], [ 1.10, 0.005, 0.620, 0.230, 5.0],
      [ 1.26,-0.025, 0.520, 0.170, 4.2],
    ],
    creases: [ { t: 0, k: 0.045, w: 0.22 }, { t: PI, k: 0.045, w: 0.22 } ],
    seams: [-0.55, 0.24, 0.88],
    cabin: { z0: 0.20, z1: 0.76, hw: 0.560, hh: 0.100, cy: 0.420, n: 6.0, taper: 0.12, rake: 0.18, glass: true },
    fenders: { flareF: 0.040, flareR: 0.050, span: 0.92, thick: 0.045 },
    splitter: { w: 0.68, len: 0.14, drop: 0.020, lip: false },
    diffuser: { fins: 3, w: 0.56, h: 0.070 },
    skirts: { h: 0.060, out: 0.020 },
    wing: { type: 'roof', z: -1.06, y: 0.48, span: 0.68, chord: 0.18, tilt: 0.10, endplates: true },
    roofrack: true, ladder: true,
    exhaust: { count: 1, x: 0.42, y: -0.19, z: -1.24, r: 0.055, style: 'single' },
    lights: { head: { z0: 1.02, z1: 1.20, y0: 0.06, y1: 0.17 }, tail: { w: 0.54, h: 0.15, y: 0.24 } },
    grille: { w: 0.42, h: 0.12, z: 1.22 }, badge: true, mirrors: true,
  },

  /* 5 ------------------------------------------------------------------- */
  {
    id: 'sabretooth', name: 'Sabretooth', cls: 'Muscle', tagline: 'Long hood, fastback tail, big-block rumble.',
    rings: 30, seg: 34, wheel: { x: 0.620, zf: 0.84, zr: -0.82, r: 0.302, y: -0.160 },
    keys: [
      [-1.30, 0.030, 0.580, 0.215, 5.2], [-1.04, 0.040, 0.705, 0.245, 5.8],
      [-0.44, 0.020, 0.735, 0.250, 6.0], [ 0.16, 0.000, 0.720, 0.230, 5.6],
      [ 0.74,-0.025, 0.680, 0.190, 4.8], [ 1.14,-0.050, 0.590, 0.140, 4.0],
      [ 1.34,-0.065, 0.450, 0.098, 3.2],
    ],
    creases: [ { t: 0, k: 0.09, w: 0.30 }, { t: PI, k: 0.09, w: 0.30 },
               { t: PI * 0.5, k: 0.05, w: 0.24, z0: 0.3, z1: 1.35 } ],
    seams: [-0.60, 0.34, 0.90],
    cabin: { z0: -0.60, z1: 0.22, hw: 0.470, hh: 0.150, cy: 0.215, n: 4.4, taper: 0.33, rake: 0.10, glass: true },
    fenders: { flareF: 0.070, flareR: 0.100, span: 1.00, thick: 0.050 },
    louvres: { z0: 0.72, z1: 1.02, halfW: 0.20, halfL: 0.030, count: 4, taper: 0.3 },
    scoop: { type: 'hood', z: 0.62, w: 0.22, h: 0.060, l: 0.24 },
    splitter: { w: 0.70, len: 0.16, drop: 0.020, lip: false },
    diffuser: { fins: 3, w: 0.56, h: 0.075 },
    skirts: { h: 0.050, out: 0.020 },
    wing: { type: 'ducktail', z: -1.16, y: 0.26, span: 0.66, chord: 0.18, tilt: 0.14 },
    exhaust: { count: 2, x: 0.36, y: -0.15, z: -1.30, r: 0.045, style: 'twin' },
    lights: { head: { z0: 1.08, z1: 1.30, y0: -0.02, y1: 0.05 }, tail: { w: 0.50, h: 0.045, y: 0.08 } },
    grille: { w: 0.34, h: 0.09, z: 1.32 }, badge: true, mirrors: true,
  },

  /* 6 ------------------------------------------------------------------- */
  {
    id: 'comet', name: 'Comet', cls: 'EV', tagline: 'One-box electric. Light bars front and back, no grille at all.',
    rings: 30, seg: 32, wheel: { x: 0.615, zf: 0.84, zr: -0.82, r: 0.295, y: -0.175 },
    keys: [
      [-1.22, 0.060, 0.550, 0.260, 5.8], [-1.00, 0.070, 0.695, 0.290, 6.4],
      [-0.44, 0.055, 0.720, 0.300, 6.6], [ 0.18, 0.035, 0.715, 0.285, 6.2],
      [ 0.76, 0.010, 0.685, 0.240, 5.4], [ 1.12,-0.025, 0.610, 0.180, 4.4],
      [ 1.28,-0.045, 0.500, 0.130, 3.6],
    ],
    creases: [ { t: 0, k: 0.07, w: 0.28 }, { t: PI, k: 0.07, w: 0.28 },
               { t: PI * 0.5, k: 0.04, w: 0.24 } ],
    seams: [-0.52, 0.32, 0.94],
    cabin: { z0: -0.50, z1: 0.56, hw: 0.520, hh: 0.165, cy: 0.290, n: 5.0, taper: 0.24, rake: 0.12, glass: true, panoramic: true },
    fenders: { flareF: 0.060, flareR: 0.075, span: 1.00, thick: 0.040 },
    splitter: { w: 0.70, len: 0.20, drop: 0.016, lip: true },
    diffuser: { fins: 4, w: 0.58, h: 0.085 },
    skirts: { h: 0.050, out: 0.020 },
    wing: { type: 'ducktail', z: -1.10, y: 0.29, span: 0.64, chord: 0.16, tilt: 0.12 },
    glowvents: { z0: -0.94, z1: -0.52, count: 5 },
    exhaust: { count: 0 },
    lights: { head: { z0: 1.08, z1: 1.24, y0: 0.00, y1: 0.05, fullwidth: true },
              tail: { w: 0.60, h: 0.026, y: 0.10, strip: true, fullwidth: true } },
    badge: true, mirrors: true,
  },

  /* 7 ------------------------------------------------------------------- */
  {
    id: 'pillager', name: 'Pillager', cls: 'Pickup', tagline: 'Half truck, half weapon. Chrome stacks, open bed.',
    rings: 30, seg: 32, wheel: { x: 0.615, zf: 0.86, zr: -0.84, r: 0.330, y: -0.190 },
    keys: [
      [-1.30, 0.090, 0.620, 0.245, 6.5], [-1.06, 0.100, 0.720, 0.265, 7.0],
      [-0.44, 0.085, 0.740, 0.270, 7.0], [ 0.18, 0.070, 0.735, 0.260, 6.6],
      [ 0.78, 0.040, 0.705, 0.225, 5.6], [ 1.16, 0.000, 0.630, 0.180, 4.6],
      [ 1.34,-0.030, 0.520, 0.135, 3.8],
    ],
    creases: [ { t: 0, k: 0.05, w: 0.24 }, { t: PI, k: 0.05, w: 0.24 } ],
    seams: [-0.22, 0.62, 1.00],
    cabin: { z0: -0.10, z1: 0.62, hw: 0.520, hh: 0.160, cy: 0.330, n: 5.4, taper: 0.16, rake: 0.10, glass: true },
    bed: { z0: -1.26, z1: -0.16, h: 0.150, wall: 0.030, ribs: 4 },
    fenders: { flareF: 0.075, flareR: 0.085, span: 1.00, thick: 0.050 },
    splitter: { w: 0.72, len: 0.12, drop: 0.030, lip: false, bullbar: true },
    diffuser: { fins: 3, w: 0.58, h: 0.080 },
    skirts: { h: 0.060, out: 0.025 },
    wing: { type: 'none' },
    stacks: 2, ladder: true,
    exhaust: { count: 2, x: 0.48, y: 0.02, z: -0.98, r: 0.050, style: 'stack' },
    lights: { head: { z0: 1.04, z1: 1.24, y0: 0.06, y1: 0.16 }, tail: { w: 0.50, h: 0.09, y: 0.16 } },
    grille: { w: 0.42, h: 0.12, z: 1.26 }, badge: true, mirrors: true,
  },

  /* 8 ------------------------------------------------------------------- */
  {
    id: 'wraith', name: 'Wraith', cls: 'Stealth', tagline: 'Faceted arrow. Radar-absorbent everything, zero chrome.',
    rings: 28, seg: 22, wheel: { x: 0.620, zf: 0.86, zr: -0.82, r: 0.281, y: -0.155 },
    keys: [
      [-1.30, 0.040, 0.500, 0.185, 3.0], [-1.06, 0.055, 0.690, 0.215, 3.2],
      [-0.48, 0.035, 0.730, 0.220, 3.4], [ 0.12, 0.005, 0.700, 0.190, 3.2],
      [ 0.68,-0.028, 0.640, 0.145, 2.8], [ 1.10,-0.052, 0.500, 0.095, 2.4],
      [ 1.30,-0.068, 0.330, 0.058, 2.2],
    ],
    creases: [ { t: 0, k: 0.10, w: 0.20 }, { t: PI, k: 0.10, w: 0.20 },
               { t: PI * 0.5, k: 0.07, w: 0.18 }, { t: PI * 1.5, k: 0.07, w: 0.18 } ],
    seams: [-0.70, 0.22, 0.86], faceted: true,
    cabin: { z0: -0.58, z1: 0.10, hw: 0.40, hh: 0.125, cy: 0.185, n: 2.6, taper: 0.32, rake: 0.18, glass: true, canopy: true },
    fenders: { flareF: 0.055, flareR: 0.080, span: 1.05, thick: 0.030 },
    splitter: { w: 0.74, len: 0.30, drop: 0.010, lip: true },
    diffuser: { fins: 6, w: 0.60, h: 0.100 },
    skirts: { h: 0.038, out: 0.030 },
    wing: { type: 'swan', z: -1.20, y: 0.30, span: 0.72, chord: 0.20, tilt: 0.24, endplates: true, pylons: 2 },
    spine: { z0: -1.06, z1: -0.40, h: 0.10 },
    canards: true,
    exhaust: { count: 2, x: 0.18, y: 0.02, z: -1.30, r: 0.050, style: 'jet' },
    lights: { head: { z0: 1.10, z1: 1.30, y0: -0.05, y1: 0.00 }, tail: { w: 0.42, h: 0.022, y: 0.07, strip: true } },
  },

  /* 9 ------------------------------------------------------------------- */
  {
    id: 'goliath', name: 'Goliath', cls: 'Semi', tagline: 'Long-haul tractor unit. Air horns on the roof, chrome everywhere.',
    rings: 30, seg: 32, wheel: { x: 0.66, zf: 1.10, zr: -1.24, r: 0.360, y: -0.240 },
    keys: [
      [-1.60, 0.160, 0.660, 0.400, 8.0], [-1.30, 0.170, 0.760, 0.430, 8.5],
      [-0.60, 0.150, 0.780, 0.440, 8.5], [ 0.20, 0.130, 0.775, 0.425, 8.0],
      [ 0.90, 0.090, 0.750, 0.360, 6.8], [ 1.40, 0.030, 0.680, 0.270, 5.4],
      [ 1.60,-0.010, 0.560, 0.190, 4.4],
    ],
    creases: [ { t: 0, k: 0.04, w: 0.18 }, { t: PI, k: 0.04, w: 0.18 } ],
    seams: [-1.20, -0.30, 0.60, 1.30],
    cabin: { z0: 0.30, z1: 1.10, hw: 0.600, hh: 0.115, cy: 0.530, n: 6.5, taper: 0.10, rake: 0.06, glass: true },
    fenders: { flareF: 0.050, flareR: 0.060, span: 0.95, thick: 0.050 },
    splitter: { w: 0.76, len: 0.10, drop: 0.030, lip: false, bullbar: true },
    diffuser: { fins: 3, w: 0.62, h: 0.080 },
    skirts: { h: 0.090, out: 0.030 },
    wing: { type: 'roof', z: -1.50, y: 0.62, span: 0.74, chord: 0.20, tilt: 0.10, endplates: true },
    stacks: 2, ladder: true,
    exhaust: { count: 2, x: 0.58, y: 0.20, z: -0.10, r: 0.060, style: 'stack' },
    lights: { head: { z0: 1.40, z1: 1.58, y0: 0.10, y1: 0.22 }, tail: { w: 0.60, h: 0.16, y: 0.30 } },
    lightbar: { y: 0.74, z: 1.32, count: 5 },
    grille: { w: 0.50, h: 0.16, z: 1.58 }, badge: true, mirrors: true,
  },

  /* 10 ------------------------------------------------------------------ */
  {
    id: 'needle', name: 'Needle', cls: 'Formula', tagline: 'Open-wheel single seater. Nothing between you and the air.',
    rings: 30, seg: 28, wheel: { x: 0.620, zf: 0.94, zr: -0.98, r: 0.300, y: -0.160, clearance: 0.022 },
    keys: [
      [-1.34, 0.050, 0.300, 0.115, 4.0], [-1.10, 0.055, 0.360, 0.135, 4.0],
      [-0.50, 0.030, 0.400, 0.150, 4.2], [ 0.10, 0.000, 0.360, 0.135, 4.0],
      [ 0.70,-0.030, 0.300, 0.105, 3.6], [ 1.20,-0.055, 0.230, 0.075, 3.0],
      [ 1.40,-0.065, 0.150, 0.050, 2.6],
    ],
    creases: [ { t: 0, k: 0.06, w: 0.30 }, { t: PI, k: 0.06, w: 0.30 } ],
    seams: [-0.80, 0.30], exposedWheels: true,
    cockpit: { z0: -0.40, z1: 0.10, hw: 0.220, depth: 0.130, fairing: true, screen: false },
    fenders: { flareF: 0.000, flareR: 0.000, span: 0.80, thick: 0.012 },
    splitter: { w: 0.40, len: 0.06, drop: 0.010, lip: false },
    diffuser: { fins: 5, w: 0.42, h: 0.120 },
    wing: { type: 'gt', z: -1.30, y: 0.34, span: 0.29, chord: 0.20, tilt: 0.30, endplates: true, pylons: 2 },
    exhaust: { count: 1, x: 0.0, y: 0.06, z: -1.36, r: 0.060, style: 'jet' },
    lights: { head: null, tail: { w: 0.26, h: 0.05, y: 0.10 } },
    badge: false,
  },

  /* 11 ------------------------------------------------------------------ */
  {
    id: 'brutus', name: 'Brutus', cls: 'Armoured', tagline: 'Riveted plating, ram bar, ballistic glass. Door handles optional.',
    rings: 28, seg: 32, wheel: { x: 0.605, zf: 0.80, zr: -0.78, r: 0.325, y: -0.185 },
    keys: [
      [-1.28, 0.060, 0.620, 0.285, 8.0], [-1.04, 0.070, 0.720, 0.310, 8.5],
      [-0.44, 0.060, 0.740, 0.320, 9.0], [ 0.16, 0.045, 0.740, 0.310, 8.5],
      [ 0.76, 0.020, 0.720, 0.275, 7.5], [ 1.14,-0.015, 0.670, 0.215, 6.2],
      [ 1.32,-0.035, 0.580, 0.165, 5.2],
    ],
    creases: [ { t: 0, k: 0.04, w: 0.16 }, { t: PI, k: 0.04, w: 0.16 } ],
    seams: [-0.72, -0.16, 0.36, 0.92], rivets: true,
    cabin: { z0: -0.36, z1: 0.36, hw: 0.550, hh: 0.140, cy: 0.325, n: 7.5, taper: 0.06, rake: 0.05, glass: true, armored: true },
    fenders: { flareF: 0.060, flareR: 0.065, span: 0.92, thick: 0.058 },
    splitter: { w: 0.74, len: 0.10, drop: 0.030, lip: false, bullbar: true },
    diffuser: { fins: 3, w: 0.60, h: 0.070 },
    skirts: { h: 0.075, out: 0.030 },
    wing: { type: 'ducktail', z: -1.10, y: 0.29, span: 0.68, chord: 0.14, tilt: 0.08 },
    cage: true,
    exhaust: { count: 2, x: 0.50, y: 0.06, z: -0.90, r: 0.055, style: 'stack' },
    lights: { head: { z0: 1.06, z1: 1.22, y0: 0.05, y1: 0.13 }, tail: { w: 0.54, h: 0.08, y: 0.13 } },
    grille: { w: 0.42, h: 0.12, z: 1.23 }, badge: true,
  },

  /* 12 ------------------------------------------------------------------ */
  {
    id: 'mako', name: 'Mako', cls: 'Sports', tagline: 'Shark nose, dorsal fin, and a mouth full of intakes.',
    rings: 32, seg: 34, wheel: { x: 0.630, zf: 0.86, zr: -0.84, r: 0.292, y: -0.150 },
    keys: [
      [-1.30, 0.050, 0.500, 0.190, 4.6], [-1.06, 0.060, 0.700, 0.225, 5.0],
      [-0.46, 0.040, 0.735, 0.235, 5.2], [ 0.14, 0.010, 0.700, 0.205, 5.0],
      [ 0.72,-0.025, 0.630, 0.160, 4.2], [ 1.14,-0.050, 0.480, 0.108, 3.4],
      [ 1.32,-0.062, 0.280, 0.062, 2.4],
    ],
    creases: [ { t: 0, k: 0.13, w: 0.32 }, { t: PI, k: 0.13, w: 0.32 },
               { t: PI * 1.5, k: 0.08, w: 0.28 } ],
    seams: [-0.74, 0.24],
    cabin: { z0: -0.56, z1: 0.14, hw: 0.40, hh: 0.130, cy: 0.180, n: 3.0, taper: 0.34, rake: 0.16, glass: true, canopy: true },
    fenders: { flareF: 0.085, flareR: 0.105, span: 1.10, thick: 0.032 },
    splitter: { w: 0.72, len: 0.28, drop: 0.008, lip: true },
    diffuser: { fins: 8, w: 0.60, h: 0.110 },
    skirts: { h: 0.036, out: 0.032 },
    wing: { type: 'swan', z: -1.22, y: 0.32, span: 0.74, chord: 0.22, tilt: 0.26, endplates: true, pylons: 2 },
    spine: { z0: -1.12, z1: -0.28, h: 0.26 },
    canards: true,
    exhaust: { count: 2, x: 0.14, y: 0.03, z: -1.30, r: 0.048, style: 'jet' },
    lights: { head: { z0: 1.06, z1: 1.30, y0: -0.05, y1: 0.01 }, tail: { w: 0.40, h: 0.024, y: 0.07, strip: true } },
  },

  /* 13 ------------------------------------------------------------------ */
  {
    id: 'thunderbug', name: 'Thunderbug', cls: 'Buggy', tagline: 'Tube-frame desert buggy. Long travel, light bar, zero doors.',
    rings: 28, seg: 30, wheel: { x: 0.620, zf: 0.82, zr: -0.82, r: 0.400, y: -0.235 },
    keys: [
      [-1.16, 0.100, 0.520, 0.220, 5.0], [-0.94, 0.110, 0.660, 0.245, 5.4],
      [-0.40, 0.095, 0.690, 0.255, 5.6], [ 0.16, 0.075, 0.680, 0.245, 5.4],
      [ 0.70, 0.045, 0.650, 0.210, 4.8], [ 1.04, 0.010, 0.590, 0.170, 4.2],
      [ 1.20,-0.010, 0.490, 0.130, 3.6],
    ],
    creases: [ { t: 0, k: 0.05, w: 0.22 }, { t: PI, k: 0.05, w: 0.22 } ],
    seams: [-0.60, 0.18, 0.82], exo: true,
    cabin: { z0: -0.34, z1: 0.34, hw: 0.460, hh: 0.150, cy: 0.340, n: 4.6, taper: 0.20, rake: 0.10, glass: true },
    fenders: { flareF: 0.090, flareR: 0.100, span: 1.00, thick: 0.040 },
    splitter: { w: 0.66, len: 0.18, drop: 0.030, lip: false, bullbar: true },
    diffuser: { fins: 4, w: 0.56, h: 0.090 },
    skirts: { h: 0.055, out: 0.030 },
    wing: { type: 'roof', z: -1.02, y: 0.46, span: 0.62, chord: 0.20, tilt: 0.16, endplates: true },
    lightbar: { y: 0.52, z: 0.16, count: 5 },
    exhaust: { count: 2, x: 0.40, y: 0.06, z: -1.02, r: 0.048, style: 'stack' },
    lights: { head: { z0: 0.98, z1: 1.16, y0: 0.04, y1: 0.14 }, tail: { w: 0.46, h: 0.08, y: 0.14 } },
    badge: true,
  },

  /* 14 ------------------------------------------------------------------ */
  {
    id: 'viceroy', name: 'Viceroy', cls: 'Limousine', tagline: 'Four metres of grand tourer. The rear seats have their own climate.',
    rings: 32, seg: 34, wheel: { x: 0.620, zf: 1.06, zr: -1.02, r: 0.300, y: -0.165 },
    keys: [
      [-1.50, 0.040, 0.540, 0.225, 4.8], [-1.20, 0.050, 0.690, 0.255, 5.2],
      [-0.50, 0.030, 0.720, 0.265, 5.4], [ 0.30, 0.000, 0.700, 0.240, 5.0],
      [ 0.94,-0.028, 0.650, 0.195, 4.2], [ 1.34,-0.055, 0.560, 0.145, 3.6],
      [ 1.50,-0.070, 0.430, 0.100, 3.0],
    ],
    creases: [ { t: 0, k: 0.10, w: 0.32 }, { t: PI, k: 0.10, w: 0.32 },
               { t: PI * 0.5, k: 0.035, w: 0.24 } ],
    seams: [-0.60, 0.40, 1.00],
    cabin: { z0: -0.90, z1: 0.20, hw: 0.480, hh: 0.160, cy: 0.235, n: 4.2, taper: 0.30, rake: 0.10, glass: true },
    fenders: { flareF: 0.075, flareR: 0.095, span: 1.04, thick: 0.042 },
    louvres: { z0: 0.78, z1: 1.08, halfW: 0.18, halfL: 0.028, count: 4, taper: 0.3 },
    splitter: { w: 0.70, len: 0.22, drop: 0.016, lip: true },
    diffuser: { fins: 5, w: 0.58, h: 0.090 },
    skirts: { h: 0.048, out: 0.022 },
    wing: { type: 'ducktail', z: -1.36, y: 0.27, span: 0.64, chord: 0.20, tilt: 0.14 },
    exhaust: { count: 4, x: 0.28, y: -0.14, z: -1.48, r: 0.034, style: 'quad' },
    lights: { head: { z0: 1.30, z1: 1.48, y0: -0.02, y1: 0.06 }, tail: { w: 0.48, h: 0.040, y: 0.09, strip: true } },
    grille: { w: 0.30, h: 0.08, z: 1.49 }, badge: true, mirrors: true,
  },

  /* 15 ------------------------------------------------------------------ */
  {
    id: 'scrapheap', name: 'Scrapheap', cls: 'Rat Rod', tagline: 'Exposed blower, no hood, zoomie pipes. Held together by attitude.',
    rings: 28, seg: 30, wheel: { x: 0.600, zf: 0.80, zr: -0.78, r: 0.340, y: -0.190 },
    keys: [
      [-1.20, 0.040, 0.500, 0.200, 4.6], [-0.96, 0.050, 0.640, 0.225, 5.0],
      [-0.44, 0.030, 0.670, 0.230, 5.2], [ 0.16, 0.000, 0.650, 0.210, 5.0],
      [ 0.72,-0.030, 0.600, 0.170, 4.2], [ 1.06,-0.055, 0.520, 0.125, 3.6],
      [ 1.20,-0.070, 0.420, 0.085, 3.0],
    ],
    creases: [ { t: 0, k: 0.08, w: 0.28 }, { t: PI, k: 0.08, w: 0.28 } ],
    seams: [-0.50, 0.24],
    cabin: { z0: -0.46, z1: 0.20, hw: 0.440, hh: 0.150, cy: 0.225, n: 4.0, taper: 0.34, rake: 0.16, glass: true },
    fenders: { flareF: 0.000, flareR: 0.120, span: 0.90, thick: 0.020 },
    scoop: { type: 'blower', z: 0.66, w: 0.240, h: 0.220, l: 0.300 },
    diffuser: { fins: 4, w: 0.54, h: 0.080 },
    skirts: { h: 0.045, out: 0.020 },
    wing: { type: 'none' },
    exhaust: { count: 4, x: 0.440, y: 0.10, z: -0.30, r: 0.032, style: 'zoomie' },
    lights: { head: { z0: 1.00, z1: 1.18, y0: 0.02, y1: 0.12 }, tail: { w: 0.40, h: 0.07, y: 0.10 } },
    grille: { w: 0.28, h: 0.10, z: 1.20 }, badge: true,
  },

  /* 16 ------------------------------------------------------------------ */
  {
    id: 'polaris', name: 'Polaris', cls: 'Ice Racer', tagline: 'Studded tyres and a wing the size of a door. For frozen lakes only.',
    rings: 32, seg: 34, wheel: { x: 0.620, zf: 0.86, zr: -0.84, r: 0.286, y: -0.155, studs: true },
    keys: [
      [-1.30, 0.060, 0.520, 0.200, 5.0], [-1.04, 0.070, 0.690, 0.230, 5.4],
      [-0.46, 0.050, 0.730, 0.235, 5.6], [ 0.14, 0.015, 0.700, 0.200, 5.0],
      [ 0.72,-0.020, 0.640, 0.155, 4.2], [ 1.12,-0.045, 0.540, 0.105, 3.4],
      [ 1.30,-0.060, 0.400, 0.070, 2.8],
    ],
    creases: [ { t: 0, k: 0.12, w: 0.34 }, { t: PI, k: 0.12, w: 0.34 },
               { t: PI * 1.5, k: 0.09, w: 0.30 } ],
    seams: [-0.74, 0.22],
    cabin: { z0: -0.58, z1: 0.12, hw: 0.42, hh: 0.135, cy: 0.190, n: 3.2, taper: 0.33, rake: 0.14, glass: true, canopy: true },
    fenders: { flareF: 0.075, flareR: 0.100, span: 1.08, thick: 0.032 },
    splitter: { w: 0.76, len: 0.32, drop: 0.007, lip: true },
    diffuser: { fins: 8, w: 0.62, h: 0.105 },
    skirts: { h: 0.034, out: 0.032 },
    wing: { type: 'gt', z: -1.24, y: 0.40, span: 0.80, chord: 0.30, tilt: 0.34, endplates: true, pylons: 2 },
    spine: { z0: -1.10, z1: -0.44, h: 0.12 },
    canards: true,
    exhaust: { count: 2, x: 0.16, y: 0.02, z: -1.30, r: 0.048, style: 'centre' },
    lights: { head: { z0: 1.08, z1: 1.30, y0: -0.05, y1: 0.00 }, tail: { w: 0.42, h: 0.024, y: 0.07, strip: true } },
  },

  /* 17 ------------------------------------------------------------------ */
  {
    id: 'hummingbird', name: 'Hummingbird', cls: 'Kei', tagline: 'Two metres of car. Fits in a shopping trolley bay, embarrasses bigger things.',
    rings: 26, seg: 30, wheel: { x: 0.555, zf: 0.70, zr: -0.66, r: 0.260, y: -0.155 },
    keys: [
      [-1.06, 0.050, 0.480, 0.260, 5.4], [-0.86, 0.060, 0.600, 0.285, 6.0],
      [-0.36, 0.045, 0.630, 0.295, 6.2], [ 0.10, 0.025, 0.630, 0.285, 6.0],
      [ 0.54, 0.000, 0.610, 0.245, 5.2], [ 0.90,-0.030, 0.545, 0.185, 4.4],
      [ 1.06,-0.050, 0.450, 0.135, 3.6],
    ],
    creases: [ { t: 0, k: 0.085, w: 0.28 }, { t: PI, k: 0.085, w: 0.28 } ],
    seams: [-0.46, 0.22, 0.76],
    cabin: { z0: -0.38, z1: 0.30, hw: 0.460, hh: 0.145, cy: 0.280, n: 5.2, taper: 0.16, rake: 0.08, glass: true },
    fenders: { flareF: 0.075, flareR: 0.085, span: 1.00, thick: 0.042 },
    splitter: { w: 0.64, len: 0.16, drop: 0.018, lip: true },
    diffuser: { fins: 4, w: 0.52, h: 0.080 },
    skirts: { h: 0.050, out: 0.024 },
    wing: { type: 'gt', z: -0.96, y: 0.34, span: 0.60, chord: 0.18, tilt: 0.20, endplates: true, pylons: 2 },
    exhaust: { count: 2, x: 0.26, y: -0.14, z: -1.06, r: 0.040, style: 'twin' },
    lights: { head: { z0: 0.90, z1: 1.06, y0: 0.01, y1: 0.09 }, tail: { w: 0.44, h: 0.055, y: 0.10 } },
    grille: { w: 0.30, h: 0.08, z: 1.07 }, badge: true, mirrors: true,
  },

  /* 18 ------------------------------------------------------------------ */
  {
    id: 'wideload', name: 'Wideload', cls: 'Stance', tagline: 'Widebody kit, huge arches, wheels cambered within an inch of legality.',
    rings: 30, seg: 34, wheel: { x: 0.700, zf: 0.86, zr: -0.84, r: 0.300, y: -0.155 },
    keys: [
      [-1.28, 0.035, 0.620, 0.205, 5.0], [-1.02, 0.045, 0.760, 0.235, 5.4],
      [-0.44, 0.025, 0.790, 0.240, 5.6], [ 0.16, 0.000, 0.770, 0.220, 5.2],
      [ 0.74,-0.025, 0.720, 0.180, 4.4], [ 1.12,-0.050, 0.620, 0.132, 3.6],
      [ 1.30,-0.065, 0.470, 0.090, 3.0],
    ],
    creases: [ { t: 0, k: 0.11, w: 0.30 }, { t: PI, k: 0.11, w: 0.30 },
               { t: PI * 0.5, k: 0.045, w: 0.24 } ],
    seams: [-0.60, 0.28, 0.90],
    cabin: { z0: -0.54, z1: 0.20, hw: 0.500, hh: 0.150, cy: 0.210, n: 4.2, taper: 0.32, rake: 0.10, glass: true },
    fenders: { flareF: 0.130, flareR: 0.145, span: 1.14, thick: 0.045 },
    louvres: { z0: 0.58, z1: 0.90, halfW: 0.18, halfL: 0.030, count: 3, taper: 0.2 },
    splitter: { w: 0.86, len: 0.26, drop: 0.012, lip: true },
    diffuser: { fins: 6, w: 0.68, h: 0.095 },
    skirts: { h: 0.046, out: 0.038 },
    wing: { type: 'gt', z: -1.14, y: 0.34, span: 0.76, chord: 0.22, tilt: 0.20, endplates: true, pylons: 2 },
    canards: true,
    exhaust: { count: 2, x: 0.34, y: -0.14, z: -1.26, r: 0.075, style: 'single' },
    lights: { head: { z0: 1.04, z1: 1.24, y0: -0.01, y1: 0.06 }, tail: { w: 0.50, h: 0.05, y: 0.08 } },
    grille: { w: 0.32, h: 0.075, z: 1.25 }, badge: true, mirrors: true,
  },

  /* 19 ------------------------------------------------------------------ */
  {
    id: 'meteor', name: 'Meteor', cls: 'Hyper', tagline: 'Active aero, dorsal spine, exhaust you can see the heat off.',
    rings: 32, seg: 34, wheel: { x: 0.635, zf: 0.88, zr: -0.84, r: 0.298, y: -0.150 },
    keys: [
      [-1.30, 0.050, 0.540, 0.185, 4.4], [-1.06, 0.060, 0.720, 0.220, 4.8],
      [-0.46, 0.040, 0.750, 0.225, 5.0], [ 0.14, 0.010, 0.720, 0.195, 4.8],
      [ 0.74,-0.022, 0.660, 0.150, 4.0], [ 1.14,-0.048, 0.540, 0.100, 3.2],
      [ 1.32,-0.062, 0.360, 0.062, 2.6],
    ],
    creases: [ { t: 0, k: 0.13, w: 0.34 }, { t: PI, k: 0.13, w: 0.34 },
               { t: PI * 1.5, k: 0.09, w: 0.30 } ],
    seams: [-0.68, 0.24, 0.92],
    cabin: { z0: -0.56, z1: 0.14, hw: 0.400, hh: 0.140, cy: 0.185, n: 3.2, taper: 0.32, rake: 0.14, glass: true, canopy: true },
    fenders: { flareF: 0.090, flareR: 0.115, span: 1.10, thick: 0.034 },
    louvres: { z0: -0.98, z1: -0.62, halfW: 0.26, halfL: 0.026, count: 6, taper: 0.1 },
    splitter: { w: 0.74, len: 0.28, drop: 0.010, lip: true },
    diffuser: { fins: 9, w: 0.64, h: 0.115 },
    skirts: { h: 0.034, out: 0.034 },
    wing: { type: 'dual', z: -1.22, y: 0.36, span: 0.76, chord: 0.22, tilt: 0.28, endplates: true, pylons: 2 },
    spine: { z0: -1.12, z1: -0.44, h: 0.14 },
    canards: true,
    glowvents: { z0: -1.00, z1: -0.60, count: 5 },
    exhaust: { count: 2, x: 0.15, y: 0.00, z: -1.28, r: 0.058, style: 'centre' },
    lights: { head: { z0: 1.04, z1: 1.28, y0: -0.04, y1: 0.04 }, tail: { w: 0.46, h: 0.028, y: 0.08, strip: true } },
    badge: true, mirrors: true,
  },

  /* 20 ------------------------------------------------------------------ */
  {
    id: 'glasswing', name: 'Glasswing', cls: 'Concept', tagline: 'One continuous canopy from nose to tail. No pillars, no noise, no chrome.',
    rings: 32, seg: 34, wheel: { x: 0.615, zf: 0.86, zr: -0.84, r: 0.300, y: -0.175 },
    keys: [
      [-1.26, 0.070, 0.560, 0.240, 5.0], [-1.02, 0.085, 0.700, 0.275, 5.4],
      [-0.44, 0.070, 0.730, 0.285, 5.6], [ 0.18, 0.045, 0.725, 0.270, 5.4],
      [ 0.78, 0.015, 0.695, 0.225, 4.8], [ 1.14,-0.025, 0.620, 0.170, 4.0],
      [ 1.30,-0.045, 0.510, 0.125, 3.4],
    ],
    creases: [ { t: 0, k: 0.06, w: 0.26 }, { t: PI, k: 0.06, w: 0.26 },
               { t: PI * 0.5, k: 0.03, w: 0.22 } ],
    seams: [-0.54, 0.34, 0.96],
    cabin: { z0: -0.58, z1: 0.60, hw: 0.540, hh: 0.170, cy: 0.280, n: 4.0, taper: 0.22, rake: 0.14, glass: true, canopy: true, panoramic: true },
    fenders: { flareF: 0.060, flareR: 0.075, span: 1.00, thick: 0.040 },
    splitter: { w: 0.72, len: 0.22, drop: 0.014, lip: true },
    diffuser: { fins: 5, w: 0.60, h: 0.090 },
    skirts: { h: 0.050, out: 0.024 },
    wing: { type: 'ducktail', z: -1.12, y: 0.30, span: 0.68, chord: 0.18, tilt: 0.14 },
    glowvents: { z0: -0.96, z1: -0.54, count: 6 },
    exhaust: { count: 0 },
    lights: { head: { z0: 1.06, z1: 1.26, y0: -0.02, y1: 0.04, fullwidth: true },
              tail: { w: 0.62, h: 0.024, y: 0.11, strip: true, fullwidth: true } },
    badge: true, mirrors: false,
  },
];

export const ULTRA_CARS = [...HANDMADE_CARS, ...F1_CARS, ...MONSTER_CARS];

export const ULTRA_CAR_BY_ID = new Map(ULTRA_CARS.map(c => [c.id, c]));

/* ========================================================================== *
 *  EXTRA GEOMETRY PASSES
 * ========================================================================== */

/** Finish a body with the parts the base builder never had. Purely additive:
 *  everything buildBody already produced is left exactly as it was. */
export function buildBodyUltra(spec, quality = 'high') {
  /* The base builder paints its lights ON the shell (section 9 of
   * carLibraryPro.js) — a 50 mm emissive patch with a chrome eyebrow. Under the
   * studio that patch clips to white and spreads, so a lamp cluster laid on top
   * of it ends up sitting in the middle of a blown-out halo and reads as an
   * eyeball rather than a light. The ultra bodies therefore build with `lights`
   * and `lightbar` suppressed and get real lamp geometry from lamps.js instead.
   * `glowvents` is kept: it is a separate feature and does not clash. */
  const built = (spec.lights || spec.lightbar)
    ? { ...spec, lights: null, lightbar: null }
    : spec;
  /* Stretch the hull into its own shape before anything is lofted. Several of
   * the hand-authored station tables are near-duplicates of each other —
   * phantom and wraith measured 0.0020 apart on the bare-hull profile, which
   * is 5 mm on a 2.6 m car — and no amount of detail on top fixes two cars
   * that are the same car underneath. See HULL SHAPING in signatures.js. */
  const r = buildBody(reshapeSpec(built), quality);
  const P = r.parts, st = r.stations;
  const q = quality === 'low' ? 0.55 : quality === 'med' ? 0.8 : 1;
  const noseZ = st[st.length - 1][0], tailZ = st[0][0], L = noseZ - tailZ;
  const CB = P.get('carbon'), CH = P.get('chrome'), D = P.get('dark'), PA = P.get('paint');
  const W = spec.wheel;

  /* ---- open-wheel: front wing, sidepods, airbox, halo ------------------- */
  if (spec.exposedWheels) {
    /* `spec.f1` lets each Formula car in the pack differ in more than its
     * proportions. Ten cars that differ only by length and width still read as
     * one car at thumbnail size; ten cars that differ by wing plane count,
     * airbox style, sidepod volume and whether they carry a halo do not. */
    const F = spec.f1 || {};
    const pod = F.pod || [0.150, 0.095, 0.340];
    const podZ = F.podZ !== undefined ? F.podZ : W.zf - 0.36;
    const layers = Math.max(1, F.layers || 2);
    const airbox = F.airbox || 'snorkel';
    const halo = F.halo !== false;
    const wSeg = Math.max(6, Math.round(9 * q));

    /* Front wing, endplates and bargeboards all scale with the WIDTH OF THIS
     * BODY, not with a constant.
     *
     * They used to be absolute numbers (0.460 / 0.470 / 0.360), which meant the
     * front wing was exactly as wide on a 0.74x car as on a 1.26x one — and
     * since the wing is the widest thing on an open-wheeler, the wing was what
     * `meta.dims.width` reported. Every Formula car in the pack therefore
     * measured between 0.98 and 1.36 m across no matter how its monocoque was
     * stretched, which is most of why they read as one car. Deriving the factor
     * from the built stations means a new body cannot forget to set it: 0.400 is
     * the reference profile's widest half-section, so a car authored at wM = 1
     * gets exactly the numbers above. */
    const maxHw = Math.max(...st.map((s) => s[2]));
    const aw = Math.max(0.70, Math.min(1.35, maxHw / 0.400));

    // front wing: one to three planes, stacked and progressively shorter
    for (let i = 0; i < layers; i++) {
      const k = i / Math.max(1, layers - 1 || 1);
      aerofoil(CB, W.y + 0.020 + i * 0.030, W.zf + W.r * (1.05 - i * 0.24),
        lerp(0.460, 0.360, k) * aw, lerp(0.170, 0.115, k), 0.015 - i * 0.002,
        lerp(0.10, 0.04, k), 0.010, wSeg, 10);
    }
    for (const sd of [1, -1]) {
      slab(CB, [[sd * 0.470 * aw, W.y - 0.020, W.zf + W.r * 0.22], [sd * 0.470 * aw, W.y + 0.100, W.zf + W.r * 0.16],
        [sd * 0.470 * aw, W.y + 0.100, W.zf - W.r * 0.26], [sd * 0.470 * aw, W.y - 0.020, W.zf - W.r * 0.22]], 0.008, 'x');
      // sidepod: intake box blending back into the floor
      rbox(PA, sd * (0.330 * (pod[0] / 0.150) ** 0.4), W.y + 0.105, podZ, pod[0], pod[1], pod[2], 0.055, 5);
      rbox(D, sd * (0.330 * (pod[0] / 0.150) ** 0.4), W.y + 0.105, podZ + pod[2] * 0.88,
        pod[0] * 0.90, pod[1] * 0.84, 0.030, 0.020, 4);
      // bargeboard
      slab(CB, [[sd * 0.360 * aw, W.y + 0.020, W.zf - 0.02], [sd * 0.360 * aw, W.y + 0.130, W.zf - 0.06],
        [sd * 0.360 * aw, W.y + 0.130, W.zf - 0.20], [sd * 0.360 * aw, W.y + 0.020, W.zf - 0.16]], 0.007, 'x');
    }
    // engine cover, then whichever airbox this car carries
    const es = stationAt(st, -0.55);
    const ey = crownY(0, es[1], es[2], es[3], es[4]);
    rbox(PA, 0, ey + 0.055, -0.58, 0.085, 0.075, 0.180, 0.035, 5);
    if (airbox === 'snorkel') {
      rbox(D, 0, ey + 0.150, -0.44, 0.070, 0.090, 0.090, 0.026, 4);   // raised intake
    } else if (airbox === 'blade') {
      slab(D, [[-0.062, ey + 0.070, -0.36], [0.062, ey + 0.070, -0.36],
        [0.046, ey + 0.170, -0.56], [-0.046, ey + 0.170, -0.56]], 0.014, 'z');
    } else if (airbox === 'fin') {
      slab(D, [[-0.014, ey + 0.070, -0.30], [0.014, ey + 0.070, -0.30],
        [0.010, ey + 0.230, -0.92], [-0.010, ey + 0.230, -0.92]], 0.010, 'z');
    } else {
      rbox(D, 0, ey + 0.115, -0.40, 0.062, 0.048, 0.070, 0.022, 4);
    }
    // halo: a hoop over the cockpit, three tubes
    if (halo) {
      const cs = stationAt(st, -0.10);
      const cy2 = crownY(0, cs[1], cs[2], cs[3], cs[4]) + 0.155;
      tube(D, [0, cy2 + 0.015, 0.32], [0.200, cy2 - 0.030, -0.12], 0.014, 0.014, 8);
      tube(D, [0, cy2 + 0.015, 0.32], [-0.200, cy2 - 0.030, -0.12], 0.014, 0.014, 8);
      tube(D, [0.200, cy2 - 0.030, -0.12], [-0.200, cy2 - 0.030, -0.12], 0.014, 0.014, 8);
    }

    /* Suspension. On a covered-wheel car the fender arch hides the gap between
     * the body and the tyre, so the library never needed to model it. An
     * open-wheeler has nothing to hide it behind and the tyres read as floating
     * beside the car — which is exactly what the first pass looked like.
     *
     * Two wishbones and a track rod per corner is the minimum that sells it.
     * The inner ends are anchored to the section's own centre and half-height at
     * that axle, so a narrow tub and a fat sidepod both get arms that actually
     * meet the bodywork. */
    for (const w of r.meta.wheels) {
      const sd = w.x > 0 ? 1 : -1;
      const s = stationAt(st, w.z);
      const bx = sd * s[2] * 0.92, by = s[1], bh = s[3];
      const hubX = w.x - sd * 0.20 * w.r;
      tube(CB, [bx, by + bh * 0.55, w.z + w.r * 0.30], [hubX, w.y + w.r * 0.34, w.z], 0.017, 0.013, 7);
      tube(CB, [bx, by - bh * 0.70, w.z - w.r * 0.26], [hubX, w.y - w.r * 0.30, w.z], 0.019, 0.015, 7);
      tube(D, [sd * s[2] * 0.78, by + bh * 0.10, w.z + w.r * 0.74],
        [hubX, w.y + w.r * 0.10, w.z + w.r * 0.28], 0.011, 0.009, 6);
    }
  }

  /* ---- pickup bed ------------------------------------------------------- */
  if (spec.bed) {
    const b = spec.bed;
    const mid = stationAt(st, (b.z0 + b.z1) * 0.5);
    const yFloor = mid[1] - mid[3] * 0.42;
    const xIn = mid[2] * 0.94;
    const yTop = yFloor + b.h;
    // side walls
    for (const sd of [1, -1]) {
      slab(PA, [[sd * xIn, yFloor, b.z0], [sd * xIn, yTop, b.z0],
        [sd * (xIn - 0.012), yTop, b.z1], [sd * (xIn - 0.012), yFloor, b.z1]], b.wall, 'x');
      slab(D, [[sd * (xIn - b.wall - 0.002), yTop - 0.012, b.z0 + 0.01], [sd * (xIn - b.wall - 0.002), yTop, b.z0 + 0.01],
        // thickness must be along X. These four points already run along Y, so
        // extruding them along Y left two of the four side walls collinear:
        // zero-area quads, and plate() silently returns a (0,0,0) normal for
        // those instead of throwing.
        [sd * (xIn - b.wall - 0.014), yTop, b.z1 - 0.01], [sd * (xIn - b.wall - 0.014), yTop - 0.012, b.z1 - 0.01]], 0.020, 'x');
    }
    // floor with ribs
    slab(CB, [[-xIn, yFloor, b.z0], [xIn, yFloor, b.z0], [xIn - 0.012, yFloor, b.z1], [-xIn + 0.012, yFloor, b.z1]], 0.012);
    const ribs = b.ribs || 4;
    for (let i = 0; i < ribs; i++) {
      const z = lerp(b.z0 + 0.06, b.z1 - 0.06, ribs > 1 ? i / (ribs - 1) : 0.5);
      slab(CB, [[-xIn * 0.94, yFloor + 0.012, z], [xIn * 0.94, yFloor + 0.012, z],
        [xIn * 0.94, yFloor + 0.028, z], [-xIn * 0.94, yFloor + 0.028, z]], 0.014, 'z');
    }
    // tailgate
    const tail = stationAt(st, b.z0 + 0.01);
    const ty = tail[1] - tail[3] * 0.42;
    slab(PA, [[-tail[2] * 0.94, ty, b.z0], [tail[2] * 0.94, ty, b.z0],
      [tail[2] * 0.94, ty + b.h * 0.92, b.z0], [-tail[2] * 0.94, ty + b.h * 0.92, b.z0]], 0.016, 'z');
  }

  /* ---- exoskeleton cage ------------------------------------------------- */
  if (spec.exo) {
    const n = 6;
    for (const sd of [1, -1]) {
      for (let i = 0; i <= n; i++) {
        const z = lerp(tailZ + 0.10, noseZ - 0.10, i / n);
        const s = stationAt(st, z);
        const yb = s[1] - s[3] * 0.72, yt = s[1] + s[3] * 0.92;
        const x = s[2] * 1.02;
        tube(D, [sd * x, yb, z], [sd * (x * 0.98), yt, z], 0.016, 0.014, 7);
        if (i < n) {
          const z2 = lerp(tailZ + 0.10, noseZ - 0.10, (i + 1) / n);
          tube(D, [sd * x, yt, z], [sd * x, yt, z2], 0.014, 0.014, 7);
          tube(D, [sd * x, yb, z], [sd * x, yb, z2], 0.014, 0.014, 7);
        }
      }
    }
    const s0 = stationAt(st, tailZ + 0.10), s1 = stationAt(st, noseZ - 0.10);
    for (const zz of [tailZ + 0.10, noseZ - 0.10]) {
      const s = stationAt(st, zz);
      tube(D, [-s[2] * 1.02, s[1] + s[3] * 0.92, zz], [s[2] * 1.02, s[1] + s[3] * 0.92, zz], 0.014, 0.014, 8);
    }
  }

  /* ---- twin exhaust stacks --------------------------------------------- */
  if (spec.stacks) {
    const e = spec.exhaust || { x: 0.5, y: 0.0, z: -1.0, r: 0.05 };
    for (const sd of [1, -1]) {
      const zz = e.z;
      const s = stationAt(st, zz);
      const y0 = s[1] + s[3] * 0.55;
      tube(CH, [sd * e.x, y0, zz], [sd * e.x, y0 + 0.42, zz], e.r * 1.15, e.r, 12, true, false);
      tube(D, [sd * e.x, y0 + 0.42, zz], [sd * e.x, y0 + 0.455, zz], e.r * 0.98, e.r * 0.98, 12, false, true);
    }
  }

  /* ---- roof rack -------------------------------------------------------- */
  if (spec.roofrack) {
    const z0 = tailZ + L * 0.18, z1 = noseZ - L * 0.30;
    const s = stationAt(st, (z0 + z1) * 0.5);
    const y = s[1] + s[3] * 0.92;
    const hw = s[2] * 0.78;
    for (const sd of [1, -1]) tube(D, [sd * hw, y, z0], [sd * hw, y, z1], 0.014, 0.014, 7);
    for (let i = 0; i < 5; i++) {
      const z = lerp(z0, z1, i / 4);
      tube(D, [-hw, y, z], [hw, y, z], 0.011, 0.011, 6);
    }
    for (const sd of [1, -1]) {
      tube(D, [sd * hw, y, z0], [sd * hw, y - 0.05, z0], 0.012, 0.012, 6);
      tube(D, [sd * hw, y, z1], [sd * hw, y - 0.05, z1], 0.012, 0.012, 6);
    }
    rbox(CB, 0, y + 0.045, lerp(z0, z1, 0.28), hw * 0.86, 0.040, 0.28, 0.030, 5);
  }

  /* ---- nitrous bottles -------------------------------------------------- */
  if (spec.nos) {
    const n = spec.nos === true ? 2 : spec.nos;
    for (let i = 0; i < n; i++) {
      const x = n > 1 ? lerp(-0.22, 0.22, i / (n - 1)) : 0;
      const s = stationAt(st, -0.80);
      const y = s[1] + s[3] * 0.30;
      revolveX(CH, [[-0.13, 0.052], [-0.10, 0.060], [0.10, 0.060], [0.13, 0.040]], 16, 1, true, true);
      const M = P.get('chrome');
      const from = M.count - 16 * 4;
      for (let k = from; k < M.count; k++) {
        const px = M.p[k * 3];
        M.p[k * 3] = x; M.p[k * 3 + 1] = y + px; M.p[k * 3 + 2] = -0.80;
      }
      tube(D, [x, y + 0.06, -0.80], [x, y + 0.06, -0.30], 0.012, 0.010, 6);
    }
  }

  /* ---- formula-style front canard stack on plain cars ------------------ */
  if (spec.canardsFlag) {
    for (const sd of [1, -1]) {
      const z = noseZ - 0.10, s = stationAt(st, z);
      slab(CB, [[sd * s[2] * 0.98, s[1] + s[3] * 0.30, z], [sd * (s[2] * 0.98 + 0.10), s[1] + s[3] * 0.42, z],
        [sd * (s[2] * 0.98 + 0.08), s[1] + s[3] * 0.50, z - 0.06], [sd * s[2] * 0.98, s[1] + s[3] * 0.36, z - 0.06]], 0.007);
    }
  }

  /* ---- the car's signature detail ---------------------------------------
   * One thing no other car has. Proportions are only ever a silhouette, and
   * sixty silhouettes at thumbnail size are not enough on their own — this is
   * what actually stops the pack reading as one shape. See signatures.js.
   *
   * Before the lamps, deliberately: the lamp module pushes each lens out past
   * whatever it finds, so anything a signature puts near a corner gets
   * accounted for. */
  r.meta.signature = applySignature(P, st, spec, quality, r);

  /* ---- lamps ------------------------------------------------------------
   * LAST, on purpose. Every structure that could stand in front of a lamp —
   * fender flare, roof rack, roll cage, light bar, splitter — is already in
   * the bag by now, so the lamp module can push each lens out past whatever it
   * finds. Running it earlier would put half the lights inside the bodywork. */
  const lay = buildLamps(P, st, spec);
  r.meta.lamps = {
    head: { z: (lay.head.z0 + lay.head.z1) * 0.5 },
    tail: { z: (lay.tail.z0 + lay.tail.z1) * 0.5 },
    archF: lay.archF,
    open: !!spec.exposedWheels,
  };

  return r;
}

/* ========================================================================== *
 *  12 NEW WHEEL SETS + 8 NEW RIM FINISHES
 * ========================================================================== */

const wh = (id, name, rim, spokes, o = {}) => ({
  id, name, rim, spokes, rimR: 0.715, shoulder: 0.82, grooves: 3, tyre: 'block',
  finish: 'chrome', cap: 'flat', concave: 0.3, caliper: true, anim: { kind: 'none' }, ...o,
});

export const ULTRA_WHEELS = [
  wh('monsterclaw', 'Monster Claw', 'cage', 6, { finish: 'matte', tyre: 'rally', shoulder: 0.92, grooves: 2, rimR: 0.56, rim: 'cage', tagline: 'Six-bolt beadlock for 46" tyres.' }),
  wh('bogger', 'Bogger', 'cross', 8, { finish: 'rust', tyre: 'v', shoulder: 0.94, grooves: 1, rimR: 0.58, tagline: 'Paddle tread, digs for traction.' }),
  wh('studiq', 'Studiq', 'pin', 14, { finish: 'ice', tyre: 'rally', shoulder: 0.80, grooves: 4, tagline: 'Studded rally ice tyre.' }),
  wh('sawblade', 'Sawblade', 'blade', 9, { finish: 'chrome', rimR: 0.76, tagline: 'Nine knife blades, zero subtlety.' }),
  wh('formula', 'Formula', 'mesh', 10, { finish: 'gunmetal', tyre: 'slick', grooves: 0, shoulder: 0.76, rimR: 0.74, tagline: 'Single-seater mag, slick rubber.' }),
  wh('turbofanx', 'Turbofan X', 'turbine', 12, { finish: 'brushed', rimR: 0.78, anim: { kind: 'blades', count: 15 }, tagline: 'Fifteen blades, spin-up idle.' }),
  wh('neondrift', 'Neon Drift', 'spiral', 7, { finish: 'plasma', glow: '#ff2fd0', glowPart: 'ring', anim: { kind: 'holo', speed: 1.3 }, tagline: 'Hue-cycling halo ring.' }),
  wh('goldcrown', 'Gold Crown', 'star', 7, { finish: 'gold', cap: 'spinner', tagline: 'Seven spokes, spinner centre.' }),
  wh('carbonweb', 'Carbon Web', 'web', 11, { finish: 'carbon', rimR: 0.755, tagline: 'Woven carbon lattice.' }),
  wh('thunderroll', 'Thunderroll', 'honeycomb', 8, { finish: 'bronze', glow: '#ffd166', glowPart: 'cap', anim: { kind: 'pulse', speed: 2.8 }, tagline: 'Pulsing hub, bronze face.' }),
  /* `glacier` used to sit here too. It was re-authored with a real ice texture
   * recipe in the COLD section of wheels.js, and the plain copy was left behind
   * — so allWheels() carried two entries with the same id, the gallery drew two
   * identical "Glacier" cards, and findWheel('glacier') could not round-trip the
   * second one. The textured definition is the canonical one; this is a pointer
   * to it so the omission is not mistaken for an oversight. */
  wh('voidcore', 'Void Core', 'y', 6, { finish: 'obsidian', glow: '#7b5cff', glowPart: 'spokes', anim: { kind: 'counter', teeth: 12 }, tagline: 'Counter-rotating void cage.' }),
];

/* The eleven above are the "sensible" sets. The sixty-five below are the ones
 * with fire, ice, a heartbeat, a donut and a fox tail in them — see wheels.js.
 * `glacier` is one of those: its id lives in WHEELS_EXTRA, not here. */
export const ULTRA_WHEELS_ALL = [...ULTRA_WHEELS, ...WHEELS_EXTRA];

export const ULTRA_WHEEL_BY_ID = new Map(ULTRA_WHEELS_ALL.map(w => [w.id, w]));

/** Extra rim finishes so the new sets do not all fall back to silver. */
export const ULTRA_RIM_FINISHES = {
  matte:    { color: '#26282d', metal: 0.5, rough: 0.62, cc: 0.1 },
  rust:     { color: '#7d4a26', metal: 0.6, rough: 0.78, cc: 0.05 },
  plasma:   { color: '#2b2f45', metal: 0.9, rough: 0.16, cc: 1.0 },
  ice:      { color: '#d8ecf7', metal: 1.0, rough: 0.09, cc: 0.9 },
  obsidian: { color: '#101216', metal: 0.85, rough: 0.28, cc: 1.0 },
  neon:     { color: '#e8ff3a', metal: 0.8, rough: 0.2, cc: 0.8 },
  sakura:   { color: '#f0a0c0', metal: 0.85, rough: 0.18, cc: 0.8 },
  sand:     { color: '#c8b184', metal: 0.7, rough: 0.55, cc: 0.2 },
};

/* ---- combined registries ------------------------------------------------- */

export function allCars() { return [...CARS, ...ULTRA_CARS]; }
export function allWheels() { return [...WHEELS, ...ULTRA_WHEELS_ALL]; }
export function findCar(id) { return CAR_BY_ID.get(id) || ULTRA_CAR_BY_ID.get(id); }
export function findWheel(id) { return WHEEL_BY_ID.get(id) || ULTRA_WHEEL_BY_ID.get(id); }

export const BODY_STATS = {
  base: CARS.length, ultra: ULTRA_CARS.length, total: ULTRA_CARS.length,
  wheelsBase: WHEELS.length, wheelsUltra: ULTRA_WHEELS_ALL.length,
  wheelsTotal: ULTRA_WHEELS_ALL.length,
  wheelsShaped: WHEELS_EXTRA.length,
};
