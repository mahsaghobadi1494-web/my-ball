/* =============================================================================
 * ultra/bodies2.js — 10 Formula cars + 10 monster trucks
 * -----------------------------------------------------------------------------
 * WHY THESE ARE GENERATED RATHER THAN TYPED OUT
 * The first 20 bodies were written one station table at a time, and the result
 * was 20 cars that all read as the same shape at thumbnail size: same 2.6 m
 * footprint, same roof height, same taper front and back. Typing 20 more tables
 * would have produced 20 more of the same.
 *
 * So each family here is a small set of hand-tuned station tables plus a
 * parameter set — length, width, height, wheelbase, wheel size, nose drop,
 * cabin position — and every member stretches one of those profiles along those
 * axes. Two things fall out of doing it this way:
 *
 *   - the members are recognisably one marque, which is what a car pack wants,
 *     while each still has its own silhouette
 *   - "are these actually different?" becomes a measurable question instead of
 *     an opinion. tools/verify.mjs samples each built body at twelve stations
 *     along its length and rejects any pair whose height/width profile is
 *     closer than a threshold, so a future edit that accidentally makes two
 *     cars identical fails the build.
 *
 * ONE PROFILE IS NOT ENOUGH. The first version of this file had a single
 * F1_PROFILE and a single MT_PROFILE, so two cars with similar (wM, hM) were
 * the same shape scaled — vortex and talon measured 0.016 apart on the
 * silhouette signature, which is the same car twice. Scaling cannot change
 * where a body is fat and where it is thin; only a different table can. There
 * are five profiles per family below and no two members of a pair share both a
 * profile and a similar scale.
 *
 * The profiles are not invented from nothing: F1_PROFILES[0] is the station
 * table the existing `needle` formula car uses and MT_PROFILES[0] is
 * `leviathan`'s, both of which already loft cleanly through buildBody. The
 * variants are perturbations of those, authored at the same z keys so every
 * downstream pass — nose drop, wheelbase, cabin, wings — keeps working.
 * ===========================================================================*/

const lerp = (a, b, t) => a + (b - a) * t;

/* ========================================================================== *
 *  FORMULA CARS
 * ========================================================================== */

/**
 * Five monocoques, each normalised to z = -1.34 .. +1.40 so the per-car scalars
 * apply to all of them. Section format is the library's usual
 * `[z, centreY, halfWidth, halfHeight, squareness]`.
 *
 *   ref     needle's tub. Low nose, full mid, gentle taper. The baseline.
 *   flat    ground-effect era: wide flat floor, very shallow sections, a tail
 *           that stays tall instead of falling away.
 *   high    the blunt high nose. The centre section is the tallest of the five
 *           and the nose RISES over the last two stations.
 *   needle  extreme taper. Slimmest mid and a nose that is a spike.
 *   bulb    fat bulbous shoulders over a short floor, blunt tail.
 *   wedge   low drag: a wide tall tail tapering the whole way to a slim low
 *           nose, the mirror image of 'high'.
 */
const F1_PROFILES = {
  ref: [
    [-1.34, 0.050, 0.300, 0.115, 4.0], [-1.10, 0.055, 0.360, 0.135, 4.0],
    [-0.50, 0.030, 0.400, 0.150, 4.2], [ 0.10, 0.000, 0.360, 0.135, 4.0],
    [ 0.70,-0.030, 0.300, 0.105, 3.6], [ 1.20,-0.055, 0.230, 0.075, 3.0],
    [ 1.40,-0.065, 0.150, 0.050, 2.6],
  ],
  flat: [
    [-1.34, 0.045, 0.290, 0.132, 4.4], [-1.10, 0.038, 0.355, 0.120, 4.6],
    [-0.50, 0.018, 0.425, 0.112, 4.8], [ 0.10,-0.012, 0.385, 0.098, 4.4],
    [ 0.70,-0.036, 0.310, 0.076, 3.8], [ 1.20,-0.058, 0.235, 0.054, 3.0],
    [ 1.40,-0.068, 0.155, 0.035, 2.6],
  ],
  high: [
    [-1.34, 0.072, 0.312, 0.104, 3.8], [-1.10, 0.078, 0.372, 0.140, 4.0],
    [-0.50, 0.048, 0.398, 0.172, 4.2], [ 0.10, 0.012, 0.348, 0.156, 4.0],
    [ 0.70,-0.018, 0.288, 0.118, 3.4], [ 1.20,-0.004, 0.218, 0.092, 2.8],
    [ 1.40, 0.018, 0.142, 0.072, 2.4],
  ],
  needle: [
    [-1.34, 0.060, 0.245, 0.100, 4.2], [-1.10, 0.060, 0.300, 0.126, 4.2],
    [-0.50, 0.035, 0.342, 0.142, 4.4], [ 0.10, 0.000, 0.286, 0.114, 4.0],
    [ 0.70,-0.036, 0.205, 0.078, 3.4], [ 1.20,-0.060, 0.128, 0.048, 2.8],
    [ 1.40,-0.070, 0.072, 0.030, 2.4],
  ],
  bulb: [
    [-1.34, 0.046, 0.348, 0.142, 4.6], [-1.10, 0.050, 0.408, 0.162, 4.8],
    [-0.50, 0.024, 0.442, 0.172, 5.0], [ 0.10,-0.006, 0.402, 0.150, 4.6],
    [ 0.70,-0.036, 0.332, 0.108, 3.8], [ 1.20,-0.060, 0.256, 0.074, 3.0],
    [ 1.40,-0.070, 0.170, 0.046, 2.6],
  ],
  wedge: [
    [-1.34, 0.062, 0.340, 0.152, 4.6], [-1.10, 0.062, 0.392, 0.162, 4.6],
    [-0.50, 0.036, 0.404, 0.156, 4.4], [ 0.10, 0.000, 0.340, 0.122, 4.0],
    [ 0.70,-0.040, 0.248, 0.084, 3.4], [ 1.20,-0.066, 0.168, 0.054, 2.8],
    [ 1.40,-0.076, 0.102, 0.033, 2.4],
  ],
};

/** The half-section the front-wing scale factor is measured against. */
const F1_REF_HW = 0.400;

/** Widen or narrow a section by a fraction without touching its roundness. */
function scaleProfile(prof, wM, hM, dy, dropNose) {
  return prof.map(([z, y, a, b, n]) => {
    // the nose drop ramps in over the front half only, so stretching the car
    // lowers the tip instead of tilting the whole monocoque
    const f = z > 0 ? z / 1.40 : 0;
    return [z, y + dy - dropNose * f * f, a * wM, b * hM, n];
  });
}

/**
 * One Formula car.
 *
 * @param o.prof     key into F1_PROFILES (default 'ref')
 * @param o.len      nose z (authoring frame; 1.34 .. 1.56)
 * @param o.back     tail z (-1.24 .. -1.52)
 * @param o.wM       width multiplier against the reference (0.66 .. 1.26)
 * @param o.hM       height multiplier (0.70 .. 1.34)
 * @param o.dy       monocoque ride height offset
 * @param o.drop     extra nose drop (negative raises the nose)
 * @param o.track    wheel centre x
 * @param o.r        wheel radius
 * @param o.wb       [front z, rear z]
 * @param o.wingSpan HALF span of the rear wing — aerofoil() runs x from -span to
 *                   +span, so 0.62 on a 0.85 m car is a wing half again as wide
 *                   as the car. Real Formula wings are about half the body
 *                   width, which is what the values below are.
 * @param o.f1       geometry options read by buildBodyUltra's open-wheel pass
 */
function f1(o) {
  const {
    id, name, tagline, prof = 'ref', len = 1.40, back = -1.34,
    wM = 1.0, hM = 1.0, dy = 0.0, drop = 0.0,
    track = 0.620, r = 0.300, wb = [1.00, -1.04],
    f1: opt = {}, wing = 'gt', wingSpan = 0.30, wingChord = 0.21, wingTilt = 0.30,
    screen = false, exhaust = 'jet', accent = true, rings = 30, seg = 28,
  } = o;

  const base = F1_PROFILES[prof] || F1_PROFILES.ref;
  const keys = scaleProfile(base, wM, hM, dy, drop);
  const noseZ = keys[keys.length - 1][0], tailZ = keys[0][0], L = noseZ - tailZ;
  const wheelY = -(r * 0.52);

  return {
    id, name, cls: 'Formula', tagline,
    rings, seg,
    // `clearance` is what makes an open-wheel car read as one: the tyre sits
    // proud of the tub rather than inside it. See the anchor() comment in
    // carLibraryPro. `track` is then only a hint — the real x is solved from the
    // body half-width at each axle, so a fat sidepod pushes its rear wheel out
    // further than a needle nose pushes its front one.
    wheel: { x: track, zf: wb[0], zr: wb[1], r, y: wheelY, clearance: 0.022 },
    keys,
    creases: [{ t: 0, k: 0.06, w: 0.30 }, { t: Math.PI, k: 0.06, w: 0.30 }],
    seams: [tailZ + L * 0.35, noseZ - L * 0.78],
    exposedWheels: true,
    cockpit: {
      z0: tailZ + L * 0.30, z1: tailZ + L * 0.52,
      hw: 0.220 * wM, depth: 0.130, fairing: true, screen,
    },
    rollhoop: true,
    fenders: { flareF: 0.000, flareR: 0.000, span: 0.80, thick: 0.012 },
    splitter: { w: 0.40 * wM, len: 0.06, drop: 0.010, lip: false },
    diffuser: { fins: 5, w: 0.42 * wM, h: 0.120 },
    // The rear wing rides at roughly airbox height. `wheelY + 0.50` put it a
    // clear head above the engine cover and the pylons started reading as a
    // table; 0.42 lands its top level with the airbox, which is where a real
    // one sits.
    wing: { type: wing, z: tailZ + 0.04, y: wheelY + 0.42, span: wingSpan, chord: wingChord, tilt: wingTilt, endplates: true, pylons: 2 },
    exhaust: { count: 1, x: 0.0, y: 0.06 + dy, z: tailZ - 0.02, r: 0.060, style: exhaust },
    badge: false,
    f1: opt,
    accentDecal: accent,
  };
}

export const F1_CARS = [

  /* 1 — the reference modern car: long low nose, tall airbox, halo ---------- */
  f1({
    id: 'apex', name: 'Apex', tagline: 'Long low nose, tall airbox, halo. The house car.',
    prof: 'ref',
    len: 1.44, back: -1.36, wM: 1.18, hM: 1.16, drop: 0.020,
    track: 0.640, r: 0.300, wb: [1.02, -1.08],
    wing: 'gt', wingSpan: 0.30, wingChord: 0.21, wingTilt: 0.30,
    f1: { pod: [0.155, 0.098, 0.360], podZ: 0.30, airbox: 'snorkel', halo: true, layers: 3 },
  }),

  /* 2 — tall blunt nose, no airbox, halo over an open cockpit ---------------
   * This used to be the pack's other "minimal" car: no halo, no airbox, one
   * wing plane — which is precisely the recipe talon below already had. The two
   * measured 0.016 apart on the silhouette signature, i.e. the same car twice.
   * It now carries the only tall-and-blunt nose here (the 'high' profile, whose
   * nose RISES over its last two stations) and is the only car with a halo AND
   * no airbox at all, so the two cannot converge again. */
  f1({
    id: 'vortex', name: 'Vortex', tagline: 'Blunt high nose, no airbox, halo over an open cockpit.',
    prof: 'high',
    len: 1.30, back: -1.24, wM: 0.98, hM: 1.10, dy: 0.030, drop: -0.055,
    track: 0.620, r: 0.292, wb: [0.90, -0.98],
    wing: 'swan', wingSpan: 0.28, wingChord: 0.20, wingTilt: 0.24,
    f1: { pod: [0.170, 0.120, 0.290], podZ: 0.22, airbox: 'none', halo: true, layers: 2 },
  }),

  /* 3 — wide track, three-layer front wing, low and flat ------------------- */
  f1({
    id: 'aurora', name: 'Aurora', tagline: 'Wide track, three wing planes, ground effect everything.',
    prof: 'flat',
    len: 1.50, back: -1.38, wM: 1.30, hM: 0.92, dy: -0.020, drop: 0.030,
    track: 0.700, r: 0.304, wb: [1.06, -1.10],
    wing: 'dual', wingSpan: 0.29, wingChord: 0.22, wingTilt: 0.34,
    f1: { pod: [0.200, 0.088, 0.400], podZ: 0.34, airbox: 'blade', halo: true, layers: 3 },
  }),

  /* 4 — short and tall: the tight-circuit car ----------------------------- */
  f1({
    id: 'kestrel', name: 'Kestrel', tagline: 'Short wheelbase, tall sidepods. Built for tight corners.',
    prof: 'bulb',
    len: 1.22, back: -1.12, wM: 0.94, hM: 1.42, dy: 0.030, drop: -0.010,
    track: 0.610, r: 0.296, wb: [0.86, -0.90],
    wing: 'gt', wingSpan: 0.27, wingChord: 0.25, wingTilt: 0.40,
    f1: { pod: [0.180, 0.150, 0.280], podZ: 0.20, airbox: 'snorkel', halo: true, layers: 2 },
  }),

  /* 5 — very long, very low, needle nose --------------------------------- */
  f1({
    id: 'rapier', name: 'Rapier', tagline: 'A needle on four slicks. The longest nose in the pack.',
    prof: 'needle',
    len: 1.62, back: -1.32, wM: 0.80, hM: 0.88, dy: -0.020, drop: 0.075,
    track: 0.545, r: 0.288, wb: [1.04, -1.06],
    wing: 'swan', wingSpan: 0.24, wingChord: 0.17, wingTilt: 0.24,
    f1: { pod: [0.110, 0.070, 0.330], podZ: 0.28, airbox: 'blade', halo: true, layers: 2 },
  }),

  /* 6 — big airbox, fat sidepods, no halo --------------------------------- */
  f1({
    id: 'seraph', name: 'Seraph', tagline: 'Fat sidepods and an airbox you could post a letter in.',
    prof: 'wedge',
    len: 1.46, back: -1.30, wM: 1.20, hM: 1.34, dy: 0.025, drop: 0.0,
    track: 0.665, r: 0.308, wb: [0.98, -1.04],
    wing: 'gt', wingSpan: 0.29, wingChord: 0.23, wingTilt: 0.34,
    f1: { pod: [0.215, 0.160, 0.390], podZ: 0.32, airbox: 'snorkel', halo: false, layers: 3 },
  }),

  /* 7 — the smallest thing here: narrow tub, dorsal fin, one wing plane ----- */
  f1({
    id: 'talon', name: 'Talon', tagline: 'The smallest car in the pack. Narrow tub, dorsal fin, one wing plane.',
    prof: 'bulb',
    len: 1.14, back: -1.06, wM: 0.78, hM: 0.76, dy: -0.010, drop: 0.020,
    track: 0.505, r: 0.272, wb: [0.84, -0.86],
    wing: 'swan', wingSpan: 0.22, wingChord: 0.14, wingTilt: 0.16,
    f1: { pod: [0.095, 0.066, 0.230], podZ: 0.18, airbox: 'fin', halo: false, layers: 1 },
  }),

  /* 8 — high-riding, raked, big rear wing --------------------------------- */
  f1({
    id: 'halcyon', name: 'Halcyon', tagline: 'Raked stance, huge rear wing, front wing almost on the floor.',
    prof: 'high',
    len: 1.54, back: -1.42, wM: 1.36, hM: 1.44, dy: 0.100, drop: 0.0,
    track: 0.690, r: 0.310, wb: [1.02, -1.12],
    wing: 'dual', wingSpan: 0.31, wingChord: 0.26, wingTilt: 0.44,
    f1: { pod: [0.190, 0.112, 0.380], podZ: 0.30, airbox: 'snorkel', halo: true, layers: 3 },
  }),

  /* 9 — mid-length, tall roll hoop, no halo ------------------------------- */
  f1({
    id: 'vandal', name: 'Vandal', tagline: 'Tall roll hoop, open cockpit, no halo at all.',
    prof: 'wedge',
    len: 1.36, back: -1.24, wM: 0.94, hM: 1.20, dy: 0.030, drop: 0.015,
    track: 0.595, r: 0.294, wb: [0.94, -1.00],
    wing: 'gt', wingSpan: 0.27, wingChord: 0.2, wingTilt: 0.30,
    screen: true,
    f1: { pod: [0.140, 0.125, 0.300], podZ: 0.24, airbox: 'fin', halo: false, layers: 2 },
  }),

  /* 10 — longest of the lot, lowest of the lot ---------------------------- */
  f1({
    id: 'zenith', name: 'Zenith', tagline: 'The longest and lowest thing here. Skirts almost touching.',
    prof: 'flat',
    len: 1.60, back: -1.46, wM: 1.02, hM: 0.72, dy: -0.050, drop: 0.055,
    track: 0.670, r: 0.298, wb: [1.08, -1.16],
    wing: 'dual', wingSpan: 0.29, wingChord: 0.19, wingTilt: 0.26,
    f1: { pod: [0.170, 0.080, 0.440], podZ: 0.36, airbox: 'blade', halo: true, layers: 3 },
  }),
];

/* ========================================================================== *
 *  MONSTER TRUCKS
 * ========================================================================== */

/**
 * Five truck bodies, each normalised to z = -1.26 .. +1.26 like the Formula set.
 *
 *   ref     leviathan's body. Rounded shoulders, gentle taper both ends.
 *   box     the panel van / short bus. Near-constant section, blunt at both
 *           ends, the squarest sections in the pack.
 *   wedge   drag stance: tall tail, low nose, the roof falling the whole way
 *           forward.
 *   taper   wide front and a distinctly narrow tail — a pickup with a stepped
 *           rear rather than a slab.
 *   high    tall narrow shoulders on a short body.
 */
const MT_PROFILES = {
  ref: [
    [-1.26, 0.220, 0.520, 0.260, 6.0], [-1.02, 0.235, 0.680, 0.285, 6.6],
    [-0.46, 0.225, 0.710, 0.295, 7.0], [ 0.12, 0.210, 0.705, 0.285, 6.6],
    [ 0.68, 0.180, 0.680, 0.250, 5.8], [ 1.06, 0.140, 0.610, 0.195, 5.0],
    [ 1.26, 0.115, 0.500, 0.150, 4.2],
  ],
  box: [
    [-1.26, 0.215, 0.640, 0.300, 8.0], [-1.02, 0.220, 0.690, 0.312, 8.4],
    [-0.46, 0.220, 0.700, 0.312, 8.6], [ 0.12, 0.215, 0.695, 0.305, 8.4],
    [ 0.68, 0.200, 0.670, 0.280, 7.6], [ 1.06, 0.170, 0.630, 0.230, 6.4],
    [ 1.26, 0.150, 0.578, 0.190, 5.2],
  ],
  wedge: [
    [-1.26, 0.252, 0.560, 0.292, 6.4], [-1.02, 0.256, 0.660, 0.292, 6.8],
    [-0.46, 0.236, 0.690, 0.274, 7.0], [ 0.12, 0.204, 0.680, 0.238, 6.4],
    [ 0.68, 0.152, 0.648, 0.186, 5.4], [ 1.06, 0.100, 0.578, 0.126, 4.4],
    [ 1.26, 0.070, 0.478, 0.092, 3.6],
  ],
  taper: [
    [-1.26, 0.230, 0.428, 0.214, 5.2], [-1.02, 0.236, 0.560, 0.246, 5.8],
    [-0.46, 0.226, 0.662, 0.276, 6.4], [ 0.12, 0.210, 0.710, 0.290, 6.8],
    [ 0.68, 0.180, 0.700, 0.254, 6.0], [ 1.06, 0.140, 0.620, 0.198, 5.0],
    [ 1.26, 0.115, 0.500, 0.150, 4.2],
  ],
  high: [
    [-1.26, 0.262, 0.470, 0.238, 6.0], [-1.02, 0.276, 0.580, 0.266, 6.4],
    [-0.46, 0.272, 0.620, 0.280, 6.8], [ 0.12, 0.256, 0.616, 0.270, 6.4],
    [ 0.68, 0.224, 0.586, 0.234, 5.6], [ 1.06, 0.184, 0.520, 0.184, 4.8],
    [ 1.26, 0.158, 0.430, 0.144, 4.0],
  ],
};

/**
 * One monster truck.
 *
 * The brief was explicit that these must not be oversized — a monster truck
 * reads as one because of the ratio between the wheel and the body, not because
 * the whole vehicle is huge. So the wheels stay in the 0.35..0.44 band and the
 * body is kept short and narrow over them; what makes them monster trucks is
 * 1.35 m of wheel against 1.40 m of body width, not sheer size.
 *
 * WIDTH IS THE THING TO WATCH. The first pass ran `clearance: 0.120` and the
 * trucks came out 2.3-2.6 m across on a 2.6-2.9 m body — a 0.9 width-to-length
 * ratio, i.e. nearly square, which is what "too hulking" looks like in numbers.
 * The whole family now sits between 0.66 and 0.85, still by a clear margin the
 * widest cars in the pack (the widest handmade body is 0.68) without reading as
 * a box. `clearance` is the main lever; see anchor() in carLibraryPro.
 *
 * @param o.prof  key into MT_PROFILES (default 'ref')
 * @param o.r     wheel radius. Above ~0.46 and it stops reading as a truck.
 * @param o.lift  how far the body is carried above the axles
 * @param o.cab   [z0, z1] cabin span
 * @param o.bed   null for no bed, else [z0, z1, wallHeight]
 */
function mt(o) {
  const {
    id, name, tagline, prof = 'ref', len = 1.26, back = -1.26,
    wM = 1.0, hM = 1.0, lift = 0.0, nose = 0.0,
    track = 0.700, r = 0.420, wb = [0.86, -0.88], clearance = 0.058,
    cab = [-0.40, 0.34], cabHw = 0.520, cabHh = 0.170, cabCy = 0.440,
    bed = null, cage = true, ladder = true, stacks = 2,
    bar = 0, scoop = null, louvres = null, rivets = false,
    wing = 'none', exhaust = 'stack', rings = 28, seg = 30,
  } = o;

  const base = MT_PROFILES[prof] || MT_PROFILES.ref;
  const keys = base.map(([z, y, a, b, n]) => {
    const f = z > 0 ? z / 1.26 : 0;
    return [z, y + lift - nose * f * f, a * wM, b * hM, n];
  });
  const noseZ = keys[keys.length - 1][0], tailZ = keys[0][0], L = noseZ - tailZ;
  const wheelY = -(r * 0.72);
  const cy = cabCy + lift;

  /* A rear wing needs a full description. The base library's wing pass reads
   * w.y / w.z / w.span / w.chord / w.tilt unconditionally for every type except
   * 'ducktail', so `{ type: 'roof' }` on its own puts NaN into every wing
   * vertex — and a NaN in a position is a silent total failure, not an error. */
  const wingSpec = wing === 'roof'
    ? { type: 'roof', z: tailZ + L * 0.74, y: cy + cabHh * 1.10 + 0.17, span: 0.32 * wM, chord: 0.18, tilt: 0.16, endplates: true }
    : { type: 'none' };

  const spec = {
    id, name, cls: 'Monster', tagline,
    rings, seg,
    // A monster truck is a normal-width body on axles wider than the body, and
    // `clearance` is what produces that: the default anchor tucks the tyre under
    // a flank that is already wider than the track, hiding it. See anchor().
    wheel: { x: track, zf: wb[0], zr: wb[1], r, y: wheelY, clearance },
    keys,
    creases: [{ t: 0, k: 0.05, w: 0.22 }, { t: Math.PI, k: 0.05, w: 0.22 }],
    seams: [tailZ + L * 0.30, tailZ + L * 0.72, noseZ - L * 0.16],
    cabin: { z0: cab[0], z1: cab[1], hw: cabHw, hh: cabHh, cy, n: 6.0, taper: 0.12, rake: 0.06, glass: true },
    fenders: { flareF: 0.090, flareR: 0.095, span: 1.05, thick: 0.055 },
    splitter: { w: 0.72 * wM, len: 0.12, drop: 0.020, lip: false, bullbar: true },
    diffuser: { fins: 3, w: 0.58 * wM, h: 0.080 },
    skirts: { h: 0.080, out: 0.030 },
    wing: wingSpec,
    exhaust: { count: stacks, x: 0.52 * wM, y: 0.10 + lift, z: tailZ + L * 0.26, r: 0.055, style: exhaust },
    badge: true, mirrors: true,
  };
  if (bed) spec.bed = { z0: bed[0], z1: bed[1], h: bed[2], wall: 0.030, ribs: 4 };
  if (cage) spec.cage = true;
  if (ladder) spec.ladder = true;
  if (bar) spec.lightbar = { y: cy + cabHh * 1.30, z: lerp(cab[0], cab[1], 0.30), count: bar };
  if (scoop) spec.scoop = scoop;
  if (louvres) spec.louvres = louvres;
  if (rivets) spec.rivets = true;
  return spec;
}

export const MONSTER_CARS = [

  /* 1 — the reference pickup ------------------------------------------------ */
  mt({
    id: 'titan', name: 'Titan', tagline: 'Short-bed pickup on 1.35 m wheels. The yardstick.',
    prof: 'ref',
    len: 1.26, back: -1.30, wM: 0.92, hM: 0.94, lift: 0.030,
    r: 0.420, track: 0.710, wb: [0.86, -0.88],
    cab: [-0.40, 0.34], bed: [-1.26, -0.16, 0.150], bar: 5,
  }),

  /* 2 — van-bodied, tall and narrow ---------------------------------------- */
  mt({
    id: 'rampage', name: 'Rampage', tagline: 'Panel van shell, no bed, all of the glass blacked out.',
    prof: 'box',
    len: 1.14, back: -1.36, wM: 0.83, hM: 1.24, lift: 0.060,
    r: 0.390, track: 0.635, wb: [0.80, -0.94],
    cab: [-0.52, 0.42], cabHw: 0.545, cabHh: 0.140, cabCy: 0.540,
    bar: 6, stacks: 1, exhaust: 'single',
  }),

  /* 3 — long nose, big blower, riveted ------------------------------------- */
  mt({
    id: 'bison', name: 'Bison', tagline: 'Long nose, exposed blower, riveted panels, no subtlety.',
    prof: 'wedge',
    len: 1.52, back: -1.34, wM: 0.95, hM: 0.92, lift: -0.020, nose: 0.055,
    r: 0.400, track: 0.730, wb: [0.94, -0.82],
    cab: [-0.26, 0.28], cabHw: 0.490, cabHh: 0.175,
    bed: [-1.16, -0.06, 0.130],
    scoop: { type: 'blower', z: 0.92, w: 0.240, h: 0.220, l: 0.300 },
    rivets: true, bar: 4, exhaust: 'zoomie', stacks: 4,
  }),

  /* 4 — short and very wide, cab pushed back ------------------------------- */
  mt({
    id: 'mastodon', name: 'Mastodon', tagline: 'Short and very wide with the cab pushed right back.',
    prof: 'box',
    len: 1.10, back: -1.12, wM: 1.03, hM: 0.98, lift: 0.010,
    r: 0.430, track: 0.748, wb: [0.78, -0.78],
    cab: [-0.60, 0.04], cabHw: 0.545, cabHh: 0.150, cabCy: 0.395,
    bed: [-1.02, -0.36, 0.140],
    bar: 5, louvres: { z0: 0.60, z1: 0.86, halfW: 0.22, halfL: 0.026, count: 4, taper: 0.2 },
  }),

  /* 5 — tall body, narrow track ------------------------------------------- */
  mt({
    id: 'colossus', name: 'Colossus', tagline: 'Tall body, narrow track. Looks like it might fall over.',
    prof: 'taper',
    len: 1.20, back: -1.28, wM: 0.79, hM: 1.28, lift: 0.055,
    r: 0.370, track: 0.618, wb: [0.84, -0.88],
    cab: [-0.56, 0.40], cabHw: 0.478, cabHh: 0.185, cabCy: 0.560,
    bar: 5, wing: 'roof',
  }),

  /* 6 — the lightest one: small wheels, short body ------------------------- */
  mt({
    id: 'anvil', name: 'Anvil', tagline: 'The small one. Same cage, less of everything else.',
    prof: 'wedge',
    len: 1.02, back: -1.04, wM: 0.79, hM: 0.92, lift: 0.000,
    r: 0.350, track: 0.612, wb: [0.74, -0.74],
    cab: [-0.34, 0.26], cabHw: 0.470, cabHh: 0.150, cabCy: 0.390,
    bed: [-1.00, -0.10, 0.125],
    bar: 4, stacks: 1, exhaust: 'single',
  }),

  /* 7 — long bed, ladder bars, drag stance --------------------------------- */
  mt({
    id: 'bruiser', name: 'Bruiser', tagline: 'Long bed, ladder bars, and a very obvious drag stance.',
    prof: 'ref',
    len: 1.30, back: -1.58, wM: 1.01, hM: 0.96, lift: 0.030, nose: 0.035,
    r: 0.425, track: 0.745, wb: [0.90, -1.10],
    cab: [-0.20, 0.34], cabHw: 0.525, cabHh: 0.165,
    bed: [-1.54, -0.02, 0.160], bar: 6,
  }),

  /* 8 — stubby, huge arch flares, blacked out ------------------------------- */
  mt({
    id: 'warthog', name: 'Warthog', tagline: 'Stubby nose, huge arches, matte everything.',
    prof: 'high',
    len: 1.06, back: -1.18, wM: 1.04, hM: 1.04, lift: 0.035, nose: -0.010,
    r: 0.410, track: 0.752, wb: [0.76, -0.82],
    cab: [-0.30, 0.30], cabHw: 0.552, cabHh: 0.182, cabCy: 0.470,
    bar: 5, rivets: true,
  }),

  /* 9 — bus-bodied, huge glass, roof wing --------------------------------- */
  mt({
    id: 'grizzly', name: 'Grizzly', tagline: 'Short bus shell, panoramic glass, roof wing.',
    prof: 'high',
    len: 1.22, back: -1.48, wM: 0.92, hM: 1.22, lift: 0.050,
    r: 0.390, track: 0.670, wb: [0.88, -1.00],
    cab: [-0.72, 0.48], cabHw: 0.545, cabHh: 0.130, cabCy: 0.545,
    bar: 6, wing: 'roof', stacks: 2,
  }),

  /* 10 — the biggest wheels and widest arches ------------------------------
   * Deliberately the longest truck as well as the widest: with both at once the
   * ratio stays near titan's rather than climbing towards square, and length is
   * what tells the two apart on the silhouette signature. */
  mt({
    id: 'bulwark', name: 'Bulwark', tagline: 'Widest arches and the biggest wheels here. Slow and unbothered.',
    prof: 'taper',
    len: 1.40, back: -1.52, wM: 1.06, hM: 1.10, lift: 0.030,
    r: 0.435, track: 0.772, wb: [0.94, -1.04],
    cab: [-0.46, 0.32], cabHw: 0.565, cabHh: 0.185, cabCy: 0.470,
    bed: [-1.46, -0.14, 0.150],
    bar: 6, rivets: true,
  }),
];

export const BODIES2_STATS = { f1: F1_CARS.length, monster: MONSTER_CARS.length };
