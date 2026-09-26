// @ts-nocheck
/* ===========================================================================
 * carModels.js — parametric vehicle bodies and wheels
 * ---------------------------------------------------------------------------
 * The original car was built from ~30 axis-aligned boxes, so every surface was
 * flat and every silhouette was a rectangle. This module builds bodies the way
 * the OVERDRIVE reference does — by lofting ROUNDED CROSS-SECTIONS along the
 * car's length — and then bolts hard-edged detail (wings, splitters, cages)
 * onto that smooth shell.
 *
 * Coordinate frame (same as the rest of the project):
 *   +Z = forward,  +X = left,  +Y = up.  Origin = the physics body centre.
 *
 * Wheels are solved from the physics rather than guessed. `Vehicle.castWheels`
 * places each wheel at
 *
 *     center = rotate(local) + body.pos - up * (rest - compression)
 *
 * and `drawVehicle` renders the wheel at `carDrawPos + (center - body.pos)*S`
 * while the body is rendered at `carDrawPos` scaled by the same `S`. So the
 * wheel's position in BODY-LOCAL space is exactly `center - body.pos`, i.e.
 *
 *     wheelLocal = (attachX, attachY - (rest - compression), attachZ)
 *
 * Everything below is expressed in that space, which is why WHEEL_Y is derived
 * from CFG instead of being a magic number.
 * =========================================================================== */

import { TAU, PI, clamp, V3, Quat } from './math.js';
import { Builder } from './renderer.js';
import { CFG, COSMETICS_LIBRARY } from './config.js';
import { isUltraCar, buildUltraCarMesh, isUltraWheel, buildUltraWheelMesh, isUltraTopper, buildUltraTopperMesh, isUltraAntenna, buildUltraAntennaMesh } from './ultraCarAdapter.js';

/* ------------------------------------------------------------------ *
 * wheel placement, derived from the live config
 * ------------------------------------------------------------------ */

function wheelAnchor() {
  var W = CFG.vehicle.wheel;
  // The suspension settles somewhere between fully compressed (rest) and fully
  // extended (0). A resting car sits near the top of its travel, so use a small
  // residual compression; the fenders are drawn with enough clearance that the
  // exact value is not critical.
  var restComp = W.rest * 0.25;
  return {
    x: W.attachX,
    y: W.attachY - (W.rest - restComp),
    z: W.attachZ,
    r: W.radius,
    // `wheelCyl` width is expressed in units of the wheel radius.
    w: 0.64
  };
}

/* ------------------------------------------------------------------ *
 * generic mesh helpers
 * ------------------------------------------------------------------ */

/** Shortest angular distance between two ring parameters, wrapped to [0, PI]. */
function angDist(a, b) {
  var d = Math.abs(((a - b) % TAU + TAU) % TAU);
  return d > PI ? TAU - d : d;
}

/** One closed cross-section in the XY plane at depth `z`.
 *  `n` shapes the superellipse: 2 = ellipse, 4 = squircle, 8+ = near-rectangle
 *  with softly rounded corners. Even point spacing comes free, which is what
 *  makes the lofted surface shade smoothly.
 *
 *  `creases` pulls the ring in along one or more angular lines. That is what
 *  puts a character line down the flank of the car: a large painted area with
 *  no crease in it reads as a raw blob no matter how good the silhouette is.
 *  Each entry is `{ t, k, w }` — angle, inset fraction, angular width. */
function ringXY(z, cy, hw, hh, n, seg, creases) {
  var pts = [];
  var e = 2 / n;
  for (var i = 0; i < seg; i++) {
    var t = i / seg * TAU;
    var ct = Math.cos(t), st = Math.sin(t);
    var x = (ct < 0 ? -1 : 1) * Math.pow(Math.abs(ct), e) * hw;
    var y = (st < 0 ? -1 : 1) * Math.pow(Math.abs(st), e) * hh;
    if (creases) {
      var inset = 0;
      for (var c = 0; c < creases.length; c++) {
        var cr = creases[c];
        var d = angDist(t, cr.t) / cr.w;
        inset += cr.k * Math.exp(-d * d);
      }
      if (inset > 0.5) inset = 0.5;
      x *= 1 - inset;
      y *= 1 - inset;
    }
    pts.push({ x: x, y: cy + y, z: z });
  }
  return pts;
}

/** Loft equal-length rings along +Z. Returns the first vertex index emitted so
 *  the caller can smooth-shade exactly this span. */
function loftZ(B, rings, uScale) {
  uScale = uScale || 1;
  var seg = rings[0].length;
  var base = B.n;
  for (var r = 0; r < rings.length; r++) {
    for (var i = 0; i < seg; i++) {
      var p = rings[r][i];
      B.vert(p.x, p.y, p.z, 0, 1, 0, (i / seg) * uScale, r / (rings.length - 1));
    }
  }
  for (var rr = 0; rr < rings.length - 1; rr++) {
    for (var ii = 0; ii < seg; ii++) {
      var jj = (ii + 1) % seg;
      var a = base + rr * seg + ii;
      var b = base + rr * seg + jj;
      var c = base + (rr + 1) * seg + jj;
      var d = base + (rr + 1) * seg + ii;
      B.quad(a, b, c, d);
    }
  }
  return base;
}

/** Area-weighted vertex normals for every vertex from `from` onward.
 *  Turns the faceted loft into a smooth shell. Hard-edged detail added after
 *  this call keeps its own flat normals, so creases stay crisp. */
function smoothNormals(B, from) {
  var v = B.v, idx = B.i;
  for (var t = 0; t < idx.length; t += 3) {
    var a = idx[t], b = idx[t + 1], c = idx[t + 2];
    if (a < from && b < from && c < from) continue;
    var ax = v[a * 8], ay = v[a * 8 + 1], az = v[a * 8 + 2];
    var e1x = v[b * 8] - ax, e1y = v[b * 8 + 1] - ay, e1z = v[b * 8 + 2] - az;
    var e2x = v[c * 8] - ax, e2y = v[c * 8 + 1] - ay, e2z = v[c * 8 + 2] - az;
    var nx = e1y * e2z - e1z * e2y;
    var ny = e1z * e2x - e1x * e2z;
    var nz = e1x * e2y - e1y * e2x;
    if (a >= from) { var oa = a * 8 + 3; v[oa] += nx; v[oa + 1] += ny; v[oa + 2] += nz; }
    if (b >= from) { var ob = b * 8 + 3; v[ob] += nx; v[ob + 1] += ny; v[ob + 2] += nz; }
    if (c >= from) { var oc = c * 8 + 3; v[oc] += nx; v[oc + 1] += ny; v[oc + 2] += nz; }
  }
  for (var k = from; k < B.n; k++) {
    var o = k * 8 + 3;
    var l = Math.sqrt(v[o] * v[o] + v[o + 1] * v[o + 1] + v[o + 2] * v[o + 2]) || 1;
    v[o] /= l; v[o + 1] /= l; v[o + 2] /= l;
  }
}

/** Close a lofted tube with a flat fan. The ring is duplicated so the cap keeps
 *  a crisp normal instead of being smoothed into the shell. */
function capZ(B, ring, z, dir) {
  var seg = ring.length;
  var c = B.vert(0, 0, z, 0, 0, dir, 0.5, 0.5);
  var ids = [];
  for (var i = 0; i < seg; i++) {
    var p = ring[i];
    ids.push(B.vert(p.x, p.y, z, 0, 0, dir, 0.5 + (p.x / (Math.abs(p.x) + 1)) * 0.5, 0.5 + (p.y / (Math.abs(p.y) + 1)) * 0.5));
  }
  for (var t = 0; t < seg; t++) {
    if (dir > 0) B.tri(c, ids[t], ids[(t + 1) % seg]);
    else B.tri(c, ids[(t + 1) % seg], ids[t]);
  }
}

/** A lofted rounded shell from a station table. Each station is
 *  [z, centreY, halfWidth, halfHeight, squareness]. */
function shellZ(B, stations, seg, uScale, creases) {
  var rings = [];
  for (var i = 0; i < stations.length; i++) {
    var s = stations[i];
    rings.push(ringXY(s[0], s[1], s[2], s[3], s[4], seg, creases));
  }
  var from = loftZ(B, rings, uScale);
  smoothNormals(B, from);
  capZ(B, rings[0], stations[0][0], -1);
  capZ(B, rings[rings.length - 1], stations[stations.length - 1][0], 1);
  return from;
}

/** Linear interpolation of the station table at an arbitrary z. Lets a seam or
 *  a decal be placed anywhere without hand-typing the ring it lands on. */
function stationAt(stations, z) {
  for (var i = 0; i < stations.length - 1; i++) {
    var a = stations[i], b = stations[i + 1];
    if (z >= a[0] && z <= b[0]) {
      var span = b[0] - a[0];
      var t = span > 1e-9 ? (z - a[0]) / span : 0;
      return [
        z,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
        a[3] + (b[3] - a[3]) * t,
        a[4] + (b[4] - a[4]) * t
      ];
    }
  }
  return null;
}

/** Insert a V-groove at each seam z: a narrow inset band that shades as a shut
 *  line. Panel gaps are the cheapest, highest-impact way to stop a body shell
 *  from reading as one undifferentiated lump. */
function withSeams(stations, seams) {
  if (!seams || !seams.length) return stations;
  var out = stations.slice();
  for (var s = 0; s < seams.length; s++) {
    var st = stationAt(stations, seams[s]);
    if (!st) continue;
    var hw = 0.0055;
    out.push([st[0] - hw, st[1], st[2] * 0.990, st[3] * 0.990, st[4]]);
    out.push([st[0], st[1], st[2] * 0.970, st[3] * 0.970, st[4]]);
    out.push([st[0] + hw, st[1], st[2] * 0.990, st[3] * 0.990, st[4]]);
  }
  out.sort(function (a, b) { return a[0] - b[0]; });
  return out;
}

/** Lay a dark band right around the shell inside each V-groove that `withSeams`
 *  cuts.
 *
 *  A groove in body colour only reads as a shut line when something shades it.
 *  From a chase camera there is no shadow to do that, so the gap collapses into
 *  a faint gradient and the panel line effectively disappears. Putting real dark
 *  geometry in the bottom of the groove is what makes the line legible, and it
 *  costs one narrow ring per seam.
 *
 *  `scale` sits the band between the groove floor (0.978) and the shoulders
 *  (0.992), so it fills the gap without poking back through the paint. */
function seamLines(B, stations, seams, seg) {
  if (!seams || !seams.length) return;
  for (var s = 0; s < seams.length; s++) {
    var st = stationAt(stations, seams[s]);
    if (!st) continue;
    var hw = 0.0038;
    var scale = 0.980;
    var rings = [];
    for (var k = 0; k < 3; k++) {
      var zz = st[0] + (k - 1) * hw;
      // Narrowest in the middle so the band has a V of its own and catches a
      // little light on each flank instead of reading as a flat stripe.
      var sc = k === 1 ? scale : scale + 0.004;
      rings.push(ringXY(zz, st[1], st[2] * sc, st[3] * sc, st[4], seg, null));
    }
    var from = B.n;
    var segN = rings[0].length;
    for (var r = 0; r < rings.length; r++) {
      for (var i = 0; i < segN; i++) {
        var p = rings[r][i];
        B.vert(p.x, p.y, p.z, 0, 1, 0, i / segN, r / (rings.length - 1));
      }
    }
    for (var q = 0; q < rings.length - 1; q++) {
      for (var w = 0; w < segN; w++) {
        var w2 = (w + 1) % segN;
        B.quad(from + q * segN + w, from + q * segN + w2,
               from + (q + 1) * segN + w2, from + (q + 1) * segN + w);
      }
    }
    smoothNormals(B, from);
  }
}

/** Solve the superellipse for the upper-half y at a given x. Inverse of the
 *  ring's own parametrisation, so decals land exactly on the surface. */
function crownY(x, cy, hw, hh, n) {
  var a = Math.min(1, Math.abs(x) / hw);
  var ct = Math.pow(a, n * 0.5);
  var st = Math.sqrt(Math.max(0, 1 - ct * ct));
  return cy + Math.pow(st, 2 / n) * hh;
}

/** Solve for the +X-half x at a given y. */
function flankX(y, cy, hw, hh, n) {
  var a = Math.min(1, Math.abs(y - cy) / hh);
  var st = Math.pow(a, n * 0.5);
  var ct = Math.sqrt(Math.max(0, 1 - st * st));
  return Math.pow(ct, 2 / n) * hw;
}

/** A livery band lying ON the crown of the shell, between x0 and x1.
 *
 *  Sampling the *same* superellipse the shell uses is the whole trick: the
 *  stripe hugs the bodywork exactly, instead of floating over the curvature at
 *  the edges or sinking into it in the middle. `lift` is a few millimetres so
 *  it reads as paint sitting on the surface rather than z-fighting with it. */
function crownBand(B, stations, spec, seg) {
  var zs = [];
  for (var i = 0; i < stations.length; i++) {
    var z = stations[i][0];
    if (z >= spec.z0 && z <= spec.z1) zs.push(z);
  }
  if (zs.length < 2) return;
  var lift = spec.lift !== undefined ? spec.lift : 0.0035;
  var n = seg || 5;
  var base = B.n;
  for (var s = 0; s < zs.length; s++) {
    var st = stationAt(stations, zs[s]);
    for (var k = 0; k <= n; k++) {
      var x = spec.x0 + (spec.x1 - spec.x0) * (k / n);
      var y = crownY(x, st[1], st[2], st[3], st[4]);
      B.vert(x, y + lift, zs[s], 0, 1, 0, k / n, s / (zs.length - 1));
    }
  }
  for (var q = 0; q < zs.length - 1; q++) {
    for (var w = 0; w < n; w++) {
      B.quad(base + q * (n + 1) + w, base + q * (n + 1) + w + 1,
        base + (q + 1) * (n + 1) + w + 1, base + (q + 1) * (n + 1) + w);
    }
  }
}

/** A livery band running along the flank, between two heights. Same idea as
 *  `crownBand` but solved for x at a given y. `side` is +1 or -1, because
 *  `flankX` only ever solves the +X half. */
function flankBand(B, stations, spec, seg) {
  var zs = [];
  for (var i = 0; i < stations.length; i++) {
    var z = stations[i][0];
    if (z >= spec.z0 && z <= spec.z1) zs.push(z);
  }
  if (zs.length < 2) return;
  var lift = spec.lift !== undefined ? spec.lift : 0.0032;
  var side = spec.side || 1;
  var n = seg || 4;
  var base = B.n;
  for (var s = 0; s < zs.length; s++) {
    var st = stationAt(stations, zs[s]);
    for (var k = 0; k <= n; k++) {
      var y = spec.y0 + (spec.y1 - spec.y0) * (k / n);
      var x = flankX(y, st[1], st[2], st[3], st[4]);
      B.vert(side * (x + lift), y, zs[s], side, 0, 0, k / n, s / (zs.length - 1));
    }
  }
  for (var q = 0; q < zs.length - 1; q++) {
    for (var w = 0; w < n; w++) {
      B.quad(base + q * (n + 1) + w, base + q * (n + 1) + w + 1,
        base + (q + 1) * (n + 1) + w + 1, base + (q + 1) * (n + 1) + w);
    }
  }
}

/** A run of transverse vent slots cut into the crown — hood louvres, engine vents.
 *
 *  These are PLATES, not boxes. The first version placed a small box straddling
 *  the surface, which stuck ~13 mm proud and rendered as a row of dark lumps
 *  stapled to the bonnet — the same trap as building tyre tread out of boxes.
 *
 *  Instead each slot is a flat strip laid ON the crown and offset along the true
 *  surface normal, so it hugs the curvature and reads as a vent cut into the
 *  panel. The strip is sampled in columns, and each column takes the crown
 *  height and normal at its own x, which is what keeps it glued to a curved
 *  hood instead of cutting through it at the edges. */
function louvres(B, stations, spec) {
  var count = spec.count || 4;
  var lift = spec.lift !== undefined ? spec.lift : 0.0014;
  var cols = 5;
  for (var i = 0; i < count; i++) {
    var t = count > 1 ? i / (count - 1) : 0.5;
    var z = spec.z0 + (spec.z1 - spec.z0) * t;
    var st = stationAt(stations, z);
    if (!st) continue;
    var cy = st[1], hw = st[2], hh = st[3], n = st[4];
    var w = spec.halfW * (spec.taper ? 1 - spec.taper * t : 1);
    // A slot that tapers along its run gets shorter as well as narrower, the way
    // a real vent closes toward the trailing edge.
    var hl = spec.halfL * (spec.taper ? 1 - spec.taper * 0.6 * t : 1);
    var from = B.n;
    for (var c = 0; c <= cols; c++) {
      var x = spec.x + (c / cols * 2 - 1) * w;
      // Never let the plate hang off the side of the body.
      var lim = hw * 0.985;
      if (x > lim) x = lim;
      if (x < -lim) x = -lim;
      // Surface height and normal from a central difference on the superellipse,
      // so the offset is along the normal rather than straight up.
      var e = 0.005;
      var yl = crownY(x - e, cy, hw, hh, n);
      var yr = crownY(x + e, cy, hw, hh, n);
      var nx = -(yr - yl), ny = 2 * e;
      var nl = Math.sqrt(nx * nx + ny * ny) || 1;
      nx /= nl; ny /= nl;
      var y = crownY(x, cy, hw, hh, n);
      for (var r = 0; r < 2; r++) {
        var zz = z + (r ? hl : -hl);
        B.vert(x + nx * lift, y + ny * lift, zz, nx, ny, 0, c / cols, r);
      }
    }
    for (var c2 = 0; c2 < cols; c2++) {
      B.quad(from + c2 * 2, from + c2 * 2 + 1,
             from + (c2 + 1) * 2 + 1, from + (c2 + 1) * 2);
    }
  }
}

/** A fender arch: a rounded beam swept over a wheel. Sweeping a small
 *  cross-section along an arc is what gives the fender a real curved profile
 *  instead of the four chamfered boxes the original car used. */
function arch(B, wheelX, wheelZ, wheelY, r, span, thick, wide, seg) {
  var rings = [];
  for (var i = 0; i <= seg; i++) {
    var a = -span + (2 * span) * (i / seg);
    var cz = wheelZ + Math.sin(a) * r;
    var cy = wheelY + Math.cos(a) * r;
    // Cross-section: a rounded rectangle in the plane normal to the sweep.
    var rr = [];
    for (var k = 0; k < 8; k++) {
      var t = k / 8 * TAU;
      var ct = Math.cos(t), st = Math.sin(t);
      var e = 2 / 3.4;
      rr.push({
        x: wheelX + (ct < 0 ? -1 : 1) * Math.pow(Math.abs(ct), e) * wide,
        y: cy + (st < 0 ? -1 : 1) * Math.pow(Math.abs(st), e) * thick,
        z: cz
      });
    }
    rings.push(rr);
  }
  var from = B.n;
  var seg8 = rings[0].length;
  for (var r2 = 0; r2 < rings.length; r2++) {
    for (var i2 = 0; i2 < seg8; i2++) {
      var p = rings[r2][i2];
      B.vert(p.x, p.y, p.z, 0, 1, 0, i2 / seg8, r2 / (rings.length - 1));
    }
  }
  for (var q = 0; q < rings.length - 1; q++) {
    for (var w = 0; w < seg8; w++) {
      var w2 = (w + 1) % seg8;
      B.quad(from + q * seg8 + w, from + q * seg8 + w2, from + (q + 1) * seg8 + w2, from + (q + 1) * seg8 + w);
    }
  }
  smoothNormals(B, from);
  return from;
}

/** The dark sill that wraps the bottom of the shell.
 *
 *  The reference car uses this band to pin the body to the ground; without it a
 *  lofted shell reads as one soft blob with no waistline. It is built from the
 *  same station table as the shell, so it always follows the body's plan shape. */
function sillZ(B, stations, drop, thick) {
  var rings = [];
  for (var i = 1; i < stations.length - 1; i++) {
    var s = stations[i];
    rings.push(ringXY(s[0], s[1] - s[3] * drop, s[2], thick, 4.5, 20));
  }
  var from = loftZ(B, rings, 2.0);
  smoothNormals(B, from);
  capZ(B, rings[0], stations[1][0], -1);
  capZ(B, rings[rings.length - 2][0], 1);
  return from;
}

/* ------------------------------------------------------------------ *
 * wheels — built at unit radius, since drawVehicle scales by radius
 * ------------------------------------------------------------------ */

/** A flat annulus (washer) revolved about the wheel's X axis.
 *
 *  The polished outer lip has to be a RING, not a capped cylinder: a cap puts a
 *  solid disc straight across the rim face and hides every spoke behind it,
 *  which is exactly what the first pass looked like. */
function washer(B, xc, halfW, rInner, rOuter, seg) {
  var rings = [];
  for (var i = 0; i < seg; i++) {
    var a = i / seg * TAU;
    var cy = Math.cos(a), cz = Math.sin(a);
    var corners = [
      [xc - halfW, rInner], [xc + halfW, rInner],
      [xc + halfW, rOuter], [xc - halfW, rOuter]
    ];
    var rr = [];
    for (var k = 0; k < 4; k++) {
      rr.push({ x: corners[k][0], y: cy * corners[k][1], z: cz * corners[k][1] });
    }
    rings.push(rr);
  }
  var from = B.n;
  for (var i2 = 0; i2 < seg; i2++) {
    for (var k2 = 0; k2 < 4; k2++) {
      var p = rings[i2][k2];
      B.vert(p.x, p.y, p.z, 0, p.y, p.z, k2 / 4, i2 / seg);
    }
  }
  // same around-then-along winding as `loftZ`, so the normals face outward
  for (var i3 = 0; i3 < seg; i3++) {
    var i4 = (i3 + 1) % seg;
    for (var k3 = 0; k3 < 4; k3++) {
      var k4 = (k3 + 1) % 4;
      B.quad(from + i3 * 4 + k3, from + i3 * 4 + k4, from + i4 * 4 + k4, from + i4 * 4 + k3);
    }
  }
  smoothNormals(B, from);
}

/** Rounded tyre barrel + sidewalls + rim barrel + brake disc.
 *  Everything here spins with the wheel, which is correct for a disc. */
function tyreAndRim(B, style) {
  var W = 0.32;                        // half width, in wheel radii
  var shoulder = style.shoulder;       // 0.78 low-profile .. 0.86 balloon
  var rimR = style.rimR;

  // --- tread barrel: rounded shoulders, flat crown at exactly r = 1 ---
  // The circumferential grooves are stations in the loft itself rather than
  // little boxes laid on top: modulating the radius gives a real groove, and
  // smooth shading turns it into a soft crease instead of a row of lumps.
  var crownA = -W * 0.45, crownB = W * 0.45;
  var prof = [[-W, shoulder], [-W * 0.78, 0.955], [crownA, 1.0]];
  var grooves = style.grooves || 3;
  var grooveW = Math.min(0.034, (crownB - crownA) / (grooves * 2.4));
  for (var g = 0; g < grooves; g++) {
    var gc = crownA + (crownB - crownA) * ((g + 0.5) / grooves);
    prof.push([gc - grooveW, 1.0]);
    prof.push([gc - grooveW * 0.34, 0.948]);
    prof.push([gc + grooveW * 0.34, 0.948]);
    prof.push([gc + grooveW, 1.0]);
  }
  prof.push([crownB, 1.0], [W * 0.78, 0.955], [W, shoulder]);

  var rings = [];
  for (var i = 0; i < prof.length; i++) {
    var r = prof[i][1], x = prof[i][0], rr = [];
    for (var k = 0; k < 28; k++) {
      var a = k / 28 * TAU;
      rr.push({ x: x, y: Math.cos(a) * r, z: Math.sin(a) * r });
    }
    rings.push(rr);
  }
  var from = B.n, seg = 28;
  for (var ri = 0; ri < rings.length; ri++) {
    for (var kk = 0; kk < seg; kk++) {
      var p = rings[ri][kk];
      B.vert(p.x, p.y, p.z, 0, p.y, p.z, kk / seg * 4, ri / (rings.length - 1));
    }
  }
  for (var q = 0; q < rings.length - 1; q++) {
    for (var w = 0; w < seg; w++) {
      var w2 = (w + 1) % seg;
      B.quad(from + q * seg + w, from + q * seg + w2, from + (q + 1) * seg + w2, from + (q + 1) * seg + w);
    }
  }
  smoothNormals(B, from);

  // --- sidewalls: bulge out from the shoulder down to the rim seat ---
  for (var side = 0; side < 2; side++) {
    var sx = side ? 1 : -1;
    var sw = [
      [W * sx, shoulder], [W * sx * 1.06, (shoulder + rimR) * 0.5], [W * sx * 1.02, rimR]
    ];
    var srings = [];
    for (var j = 0; j < sw.length; j++) {
      var rr2 = [];
      for (var k2 = 0; k2 < 28; k2++) {
        var a3 = k2 / 28 * TAU;
        rr2.push({ x: sw[j][0], y: Math.cos(a3) * sw[j][1], z: Math.sin(a3) * sw[j][1] });
      }
      srings.push(rr2);
    }
    var f2 = B.n;
    for (var r3 = 0; r3 < srings.length; r3++) {
      for (var k3 = 0; k3 < 28; k3++) {
        var p3 = srings[r3][k3];
        B.vert(p3.x, p3.y, p3.z, sx, 0, 0, k3 / 28 * 2, r3 / 2);
      }
    }
    for (var q3 = 0; q3 < srings.length - 1; q3++) {
      for (var w3 = 0; w3 < 28; w3++) {
        var w4 = (w3 + 1) % 28;
        if (side) B.quad(f2 + q3 * 28 + w3, f2 + q3 * 28 + w4, f2 + (q3 + 1) * 28 + w4, f2 + (q3 + 1) * 28 + w3);
        else B.quad(f2 + q3 * 28 + w3, f2 + (q3 + 1) * 28 + w3, f2 + (q3 + 1) * 28 + w4, f2 + q3 * 28 + w4);
      }
    }
    smoothNormals(B, f2);
  }

  // --- rim barrel + brake disc (both spin, both read as bare metal) ---
  B.cylinder(rimR, rimR, W * 2.0, 22, new V3(0, 0, 0), new Quat().fromAxisAngle(0, 1, 0, PI * 0.5), false, false);
  var discR = rimR * 0.78;
  B.cylinder(discR, discR, W * 0.5, 22, new V3(0, 0, 0), new Quat().fromAxisAngle(0, 1, 0, PI * 0.5), true, true);
  // drilled vent holes around the disc
  for (var d = 0; d < 12; d++) {
    var da = d / 12 * TAU;
    B.cylinder(0.028, 0.028, W * 0.54, 6,
      new V3(0, Math.cos(da) * discR * 0.74, Math.sin(da) * discR * 0.74),
      new Quat().fromAxisAngle(0, 1, 0, PI * 0.5), true, true);
  }
}

/** One tapered spoke blade, swept radially outward from the hub to the rim.
 *
 *  The blade is a small rounded cross-section lofted along the radius, which is
 *  what gives it a real taper and a soft highlight instead of the flat slab the
 *  first pass produced. `side` mirrors it onto the opposite face of the wheel.
 *
 *  Orientation matters: the sweep direction is (0, cos a, sin a) and a rotation
 *  about +X by `t` maps local +Z to (0, -sin t, cos t), so the correct angle is
 *  `a - PI/2`. Getting this wrong rotates every spoke 90 degrees and buries it
 *  inside the rim barrel, where it is invisible. */
function spokeBlade(B, a, side, style) {
  var rimR = style.rimR;
  var r0 = rimR * style.spokeMid - rimR * style.spokeLen * 0.5;
  var r1 = rimR * style.spokeMid + rimR * style.spokeLen * 0.5;
  var x0 = side * style.dish;
  var steps = 6;
  // Local frame at angle `a`: the axle runs along +X, `rad` points outward and
  // `tan` runs across the blade. The cross-section lives in the (axle, tan)
  // plane, so no rotation matrix is needed — just the two basis vectors.
  var radY = Math.cos(a), radZ = Math.sin(a);
  var tanY = -Math.sin(a), tanZ = Math.cos(a);

  var rings = [];
  for (var s = 0; s <= steps; s++) {
    var t = s / steps;
    var r = r0 + (r1 - r0) * t;
    // wide and thick at the hub, tapering toward the rim
    var hw = style.bladeW * (1.45 - 0.75 * t);
    var ht = style.bladeT * (1.30 - 0.45 * t);
    // the blade leans back slightly toward the centre of the wheel
    var xo = x0 - style.dishSweep * t;
    var ring = [];
    for (var k = 0; k < 8; k++) {
      var th = k / 8 * TAU;
      var ct = Math.cos(th), st = Math.sin(th);
      var e = 2 / 3.2;
      var lx = (ct < 0 ? -1 : 1) * Math.pow(Math.abs(ct), e) * ht;
      var ly = (st < 0 ? -1 : 1) * Math.pow(Math.abs(st), e) * hw;
      ring.push({
        x: xo + lx,
        y: radY * r + tanY * ly,
        z: radZ * r + tanZ * ly
      });
    }
    rings.push(ring);
  }
  var from = B.n;
  for (var i = 0; i < rings.length; i++) {
    for (var j = 0; j < 8; j++) {
      var p = rings[i][j];
      B.vert(p.x, p.y, p.z, 0, 1, 0, j / 8, i / steps);
    }
  }
  for (var i2 = 0; i2 < rings.length - 1; i2++) {
    for (var j2 = 0; j2 < 8; j2++) {
      var j3 = (j2 + 1) % 8;
      B.quad(from + i2 * 8 + j2, from + i2 * 8 + j3, from + (i2 + 1) * 8 + j3, from + (i2 + 1) * 8 + j2);
    }
  }
  smoothNormals(B, from);
}

/** Spokes + face + centre cap. Team-tinted metal, so this is what gives each
 *  rim design its identity. */
function rimFace(B, style, anchor) {
  var rimR = style.rimR;
  var spokes = style.spokes;

  // --- outer lip: a polished ring on both faces ---
  for (var side = 0; side < 2; side++) {
    var sx = side ? style.lip : -style.lip;
    washer(B, sx, 0.020, rimR * 0.90, rimR, 24);
  }

  // --- spokes ---
  for (var s = 0; s < spokes; s++) {
    var a = s / spokes * TAU + (style.spokePhase || 0);
    for (var sd = 0; sd < 2; sd++) {
      spokeBlade(B, a, sd ? 1 : -1, style);
    }
  }

  // --- solid aero cover: a disc with cut-outs, so no spokes at all ---
  if (style.cover) {
    for (var cside = 0; cside < 2; cside++) {
      var cs = cside ? 1 : -1;
      B.cylinder(rimR * 0.90, rimR * 0.86, 0.03, 22,
        new V3(cs * (style.dish - 0.045), 0, 0),
        new Quat().fromAxisAngle(0, 1, 0, PI * 0.5), false, true);
    }
    for (var sl = 0; sl < (style.slots || 5); sl++) {
      var sa = sl / (style.slots || 5) * TAU + 0.3;
      for (var ssd = 0; ssd < 2; ssd++) {
        var ss = ssd ? 1 : -1;
        B.box(0.020, 0.030, rimR * 0.34,
          new V3(ss * (style.dish - 0.030), Math.cos(sa) * rimR * 0.62, Math.sin(sa) * rimR * 0.62),
          new Quat().fromAxisAngle(1, 0, 0, sa - PI * 0.5), 1.0);
      }
    }
  }

  // --- hub boss + centre lock nut ---
  B.cylinder(rimR * 0.30, rimR * 0.26, 0.34, 18, new V3(0, 0, 0), new Quat().fromAxisAngle(0, 1, 0, PI * 0.5), true, true);
  B.cylinder(rimR * 0.17, rimR * 0.14, 0.40, 6, new V3(0, 0, 0), new Quat().fromAxisAngle(0, 1, 0, PI * 0.5), true, true);

  // --- lug nuts ---
  if (style.lugs) {
    for (var l = 0; l < style.lugs; l++) {
      var la = l / style.lugs * TAU;
      B.cylinder(0.026, 0.022, 0.36, 6,
        new V3(0, Math.cos(la) * rimR * 0.34, Math.sin(la) * rimR * 0.34),
        new Quat().fromAxisAngle(0, 1, 0, PI * 0.5), true, true);
    }
  }
  void anchor;
}

/* ------------------------------------------------------------------ *
 * body stations
 * ------------------------------------------------------------------ */

// A compact, rounded buggy — the reference Octane's proportions, but lofted.
var OCTANE = {
  id: 'OCTANE',
  name: 'Octane',
  sub: 'کلاسیک باگى',
  stations: [
    [-0.615, 0.020, 0.105, 0.045, 2.6],
    [-0.585, 0.040, 0.175, 0.070, 3.0],
    [-0.500, 0.055, 0.245, 0.098, 3.4],
    [-0.360, 0.070, 0.290, 0.118, 3.6],
    [-0.180, 0.078, 0.305, 0.130, 3.8],
    [0.020, 0.078, 0.300, 0.130, 3.8],
    [0.200, 0.072, 0.285, 0.115, 3.6],
    [0.360, 0.058, 0.250, 0.092, 3.4],
    [0.500, 0.042, 0.190, 0.068, 3.0],
    [0.590, 0.030, 0.120, 0.045, 2.8],
    [0.630, 0.024, 0.055, 0.022, 2.4]
  ],
  arch: { r: 0.196, span: 1.34, thick: 0.036, wide: 0.088 },
  narrow: 0.90,
  glassZ: [0.100, 0.280],
  glassH: 0.115,
  glassY: 0.112,
  roof: { z: -0.045, hw: 0.185, hl: 0.150 },
  scoop: { z: -0.055, hw: 0.072, hl: 0.105 },
  creases: [{ t: 0.46, k: 0.046, w: 0.15 }, { t: PI - 0.46, k: 0.046, w: 0.15 },
            { t: -0.52, k: 0.034, w: 0.13 }, { t: PI + 0.52, k: 0.034, w: 0.13 }],
  seams: [0.500, 0.200, -0.360, -0.585],
  stripes: [{ c: 0.062, w: 0.026, z0: -0.520, z1: 0.620, seg: 4 }],
  louvres: [{ c: 0.098, z0: 0.300, z1: 0.480, count: 4, halfW: 0.026, halfL: 0.012, lift: 0.0016, taper: 0.25 }],
  mirrors: { z: 0.300 },
  wing: { z: -0.560, hw: 0.335, y: 0.268, thick: 0.014, chord: 0.088 },
  splitter: { z: 0.615, hw: 0.285, y: -0.052, thick: 0.011, chord: 0.060 },
  exhaust: { z: -0.612, x: 0.112, y: 0.055, r: 0.048 }
};

// A low, wide GT: long nose, fastback cabin, deep side intakes.
var VORTEX = {
  id: 'VORTEX',
  name: 'Vortex',
  sub: 'GT اسپرت',
  stations: [
    [-0.660, -0.010, 0.115, 0.035, 2.6],
    [-0.620, 0.008, 0.205, 0.052, 3.0],
    [-0.520, 0.020, 0.300, 0.068, 3.6],
    [-0.360, 0.026, 0.360, 0.078, 4.0],
    [-0.140, 0.030, 0.385, 0.084, 4.2],
    [0.090, 0.028, 0.380, 0.082, 4.2],
    [0.280, 0.022, 0.340, 0.070, 4.0],
    [0.440, 0.010, 0.280, 0.055, 3.6],
    [0.580, -0.004, 0.205, 0.038, 3.2],
    [0.680, -0.014, 0.115, 0.022, 2.8]
  ],
  arch: { r: 0.194, span: 1.40, thick: 0.032, wide: 0.094 },
  narrow: 0.90,
  glassZ: [0.070, 0.34],
  glassH: 0.070,
  roof: { z: -0.060, hw: 0.215, hl: 0.185 },
  scoop: null,
  creases: [{ t: 0.40, k: 0.053, w: 0.13 }, { t: PI - 0.40, k: 0.053, w: 0.13 },
            { t: -0.58, k: 0.037, w: 0.137 }, { t: PI + 0.58, k: 0.037, w: 0.137 }],
  seams: [0.580, 0.280, -0.140, -0.520],
  stripes: [{ c: 0.072, w: 0.030, z0: -0.600, z1: 0.660, seg: 4 }],
  flank: { y0: -0.022, y1: 0.014, z0: -0.480, z1: 0.500 },
  louvres: [{ c: 0.140, z0: 0.360, z1: 0.500, count: 3, halfW: 0.030, halfL: 0.013, lift: 0.0016 }],
  mirrors: { z: 0.320 },
  wing: { z: -0.615, hw: 0.360, y: 0.205, thick: 0.013, chord: 0.105 },
  splitter: { z: 0.690, hw: 0.330, y: -0.062, thick: 0.012, chord: 0.075 },
  exhaust: { z: -0.655, x: 0.150, y: 0.010, r: 0.042 },
  quad: true
};

// A tall, rugged utility van with a high roof and big flares.
var TITAN = {
  id: 'TITAN',
  name: 'Titan',
  sub: 'ون آفرود',
  stations: [
    [-0.600, 0.075, 0.150, 0.140, 3.6],
    [-0.560, 0.095, 0.255, 0.185, 4.4],
    [-0.420, 0.105, 0.320, 0.215, 5.0],
    [-0.180, 0.108, 0.345, 0.225, 5.2],
    [0.060, 0.105, 0.345, 0.225, 5.2],
    [0.240, 0.098, 0.335, 0.212, 5.0],
    [0.400, 0.090, 0.324, 0.180, 5.2],
    [0.520, 0.078, 0.318, 0.150, 5.2],
    [0.610, 0.062, 0.305, 0.114, 5.0],
    [0.665, 0.052, 0.284, 0.078, 4.6]
  ],
  arch: { r: 0.242, span: 1.28, thick: 0.046, wide: 0.104 },
  narrow: 0.90,
  glassZ: [0.04, 0.34],
  glassH: 0.082,
  glassY: 0.300,
  creases: [{ t: 0.50, k: 0.04, w: 0.17 }, { t: PI - 0.50, k: 0.04, w: 0.17 },
            { t: -0.58, k: 0.029, w: 0.178 }, { t: PI + 0.58, k: 0.029, w: 0.178 }],
  seams: [0.520, 0.240, -0.180, -0.420],
  stripes: [{ c: 0.000, w: 0.070, z0: -0.580, z1: 0.640, seg: 5 }],
  flank: { y0: -0.030, y1: 0.022, z0: -0.540, z1: 0.600 },
  mirrors: { z: 0.330, h: 0.10 },
  roof: { z: -0.230, hw: 0.290, hl: 0.300 },
  scoop: null,
  wing: null,
  splitter: { z: 0.690, hw: 0.250, y: -0.070, thick: 0.014, chord: 0.055 },
  exhaust: { z: -0.612, x: 0.120, y: 0.010, r: 0.040 },
  lightBar: { z: -0.020 }
};

// An open-wheel formula car: a narrow monocoque with the wheels fully exposed.
var PHANTOM = {
  id: 'PHANTOM',
  name: 'Phantom',
  sub: 'فرمول',
  stations: [
    [-0.560, 0.010, 0.085, 0.048, 3.0],
    [-0.470, 0.030, 0.140, 0.075, 3.4],
    [-0.300, 0.045, 0.175, 0.095, 3.8],
    [-0.080, 0.052, 0.190, 0.105, 4.0],
    [0.140, 0.050, 0.185, 0.100, 4.0],
    [0.340, 0.040, 0.160, 0.085, 3.6],
    [0.520, 0.026, 0.120, 0.060, 3.2],
    [0.650, 0.014, 0.070, 0.032, 2.8]
  ],
  arch: null,
  narrow: 0.94,
  glassZ: [0.115, 0.235],
  creases: [{ t: 0.52, k: 0.046, w: 0.15 }, { t: PI - 0.52, k: 0.046, w: 0.15 },
            { t: -0.58, k: 0.034, w: 0.158 }, { t: PI + 0.58, k: 0.034, w: 0.158 }],
  seams: [0.340, -0.080, -0.300, -0.470],
  stripes: [{ c: 0.000, w: 0.052, z0: -0.480, z1: 0.640, seg: 5 }],
  louvres: [{ c: 0.090, z0: 0.320, z1: 0.470, count: 3, halfW: 0.020, halfL: 0.010, lift: 0.0016 }],
  glassH: 0.062,
  roof: null,
  scoop: null,
  wing: { z: -0.560, hw: 0.330, y: 0.300, thick: 0.012, chord: 0.115 },
  splitter: { z: 0.640, hw: 0.230, y: -0.048, thick: 0.011, chord: 0.070 },
  exhaust: { z: -0.520, x: 0.070, y: 0.115, r: 0.030 },
  frontWing: true,
  sidepods: true,
  halo: true
};

// A long-hood muscle car: the cabin is shoved back behind a very long bonnet,
// with wide haunches and a ducktail spoiler instead of a tall wing.
var STRIKER = {
  id: 'STRIKER',
  name: 'Striker',
  sub: 'ماسل',
  stations: [
    [-0.640, 0.028, 0.130, 0.050, 2.8],
    [-0.600, 0.048, 0.235, 0.074, 3.4],
    [-0.470, 0.060, 0.330, 0.098, 4.0],
    [-0.290, 0.066, 0.372, 0.110, 4.4],
    [-0.050, 0.062, 0.360, 0.102, 4.4],
    [0.130, 0.058, 0.340, 0.092, 4.2],
    [0.310, 0.054, 0.320, 0.084, 4.0],
    [0.470, 0.048, 0.296, 0.076, 3.8],
    [0.600, 0.038, 0.250, 0.060, 3.4],
    [0.690, 0.028, 0.165, 0.040, 3.0]
  ],
  arch: { r: 0.198, span: 1.40, thick: 0.034, wide: 0.098 },
  narrow: 0.90,
  glassZ: [-0.030, 0.270],
  glassH: 0.084,
  roof: { z: -0.115, hw: 0.232, hl: 0.145 },
  scoop: { z: 0.300, hw: 0.092, hl: 0.120 },
  creases: [{ t: 0.42, k: 0.05, w: 0.14 }, { t: PI - 0.42, k: 0.05, w: 0.14 },
            { t: -0.50, k: 0.037, w: 0.12 }, { t: PI + 0.50, k: 0.037, w: 0.12 }],
  seams: [0.600, 0.310, -0.050, -0.470],
  stripes: [{ c: 0.070, w: 0.034, z0: -0.560, z1: 0.680, seg: 4 }],
  louvres: [{ c: 0.115, z0: 0.400, z1: 0.590, count: 5, halfW: 0.034, halfL: 0.011, lift: 0.0016, taper: 0.30 }],
  mirrors: { z: 0.290 },
  wing: { z: -0.600, hw: 0.350, y: 0.186, thick: 0.013, chord: 0.098 },
  splitter: { z: 0.672, hw: 0.300, y: -0.056, thick: 0.012, chord: 0.070 },
  exhaust: { z: -0.626, x: 0.150, y: 0.004, r: 0.048 },
  quad: true
};

// A trophy truck: boxy tail, an open cargo bed behind the cab and a roof bar.
var RAPTOR = {
  id: 'RAPTOR',
  name: 'Raptor',
  sub: 'پیکاپ',
  stations: [
    [-0.700, 0.078, 0.298, 0.090, 5.2],
    [-0.660, 0.080, 0.302, 0.092, 5.2],
    [-0.480, 0.082, 0.308, 0.094, 5.2],
    [-0.280, 0.086, 0.312, 0.096, 5.2],
    [-0.100, 0.104, 0.322, 0.108, 5.2],
    [0.080, 0.120, 0.330, 0.106, 5.0],
    [0.250, 0.112, 0.322, 0.098, 4.8],
    [0.420, 0.098, 0.312, 0.108, 5.0],
    [0.560, 0.082, 0.300, 0.092, 4.8],
    [0.660, 0.068, 0.284, 0.072, 4.4],
    [0.700, 0.060, 0.244, 0.052, 3.8]
  ],
  arch: { r: 0.250, span: 1.26, thick: 0.050, wide: 0.112 },
  narrow: 0.90,
  glassZ: [0.055, 0.345],
  glassH: 0.074,
  glassY: 0.248,
  creases: [{ t: 0.46, k: 0.043, w: 0.15 }, { t: PI - 0.46, k: 0.043, w: 0.15 },
            { t: -0.58, k: 0.031, w: 0.158 }, { t: PI + 0.58, k: 0.031, w: 0.158 }],
  seams: [0.560, 0.250, -0.100, -0.480],
  stripes: [{ c: 0.086, w: 0.036, z0: -0.660, z1: 0.680, seg: 4 }],
  louvres: [{ c: 0.150, z0: 0.470, z1: 0.610, count: 4, halfW: 0.038, halfL: 0.012, lift: 0.0016 }],
  mirrors: { z: 0.360, h: 0.14 },
  roof: { z: 0.150, hw: 0.270, hl: 0.150 },
  scoop: null,
  wing: null,
  splitter: { z: 0.700, hw: 0.270, y: -0.072, thick: 0.015, chord: 0.060 },
  exhaust: { z: -0.660, x: 0.135, y: 0.030, r: 0.044 },
  bed: { z0: -0.690, z1: -0.190, hw: 0.278, y: 0.190, wallH: 0.085, wallT: 0.020 },
  lightBar: { z: 0.300 }
};

// A monster truck: the body rides high on a narrow shell so the huge arches are
// fully outside it, which is what gives the silhouette its stilts-on-wheels read.
var MONSTER = {
  id: 'MONSTER',
  name: 'Monster',
  sub: 'مانستر تراک',
  mat: { gloss: 0.66, clearcoat: 0.30, metallic: 0.24, flakes: 0.30, ao: 0.88, rim: 0.24 },
  stations: [
    [-0.620, 0.120, 0.150, 0.075, 3.6],
    [-0.580, 0.130, 0.230, 0.100, 4.0],
    [-0.430, 0.145, 0.268, 0.115, 4.2],
    [-0.220, 0.150, 0.272, 0.118, 4.2],
    [0.010, 0.148, 0.270, 0.116, 4.2],
    [0.220, 0.142, 0.262, 0.112, 4.0],
    [0.400, 0.136, 0.240, 0.104, 3.8],
    [0.560, 0.130, 0.190, 0.086, 3.6],
    [0.660, 0.126, 0.110, 0.058, 3.4]
  ],
  narrow: 1.0,
  glassZ: [0.060, 0.300],
  glassH: 0.098,
  windows: { y0: 0.172, y1: 0.238, z0: -0.380, z1: 0.190, cols: 4, rows: 2, panes: 2, pillar: 0.22, taper: 0.28 },
  glassY: 0.132,
  roof: { z: -0.020, hw: 0.200, hl: 0.150 },
  scoop: null,
  arch: { r: 0.285, span: 1.18, thick: 0.055, wide: 0.138 },
  archX: 0.175,
  creases: [{ t: 0.44, k: 0.048, w: 0.15 }, { t: PI - 0.44, k: 0.048, w: 0.15 },
            { t: -0.60, k: 0.036, w: 0.16 }, { t: PI + 0.60, k: 0.036, w: 0.16 }],
  seams: [0.520, 0.240, -0.160, -0.430],
  stripes: [{ c: 0.000, w: 0.062, z0: -0.480, z1: 0.560, seg: 5 }],
  louvres: [{ c: 0.104, z0: 0.340, z1: 0.500, count: 4, halfW: 0.028, halfL: 0.012, lift: 0.0016 }],
  mirrors: { z: 0.330, h: 0.12 },
  wing: null,
  splitter: { z: 0.648, hw: 0.250, y: -0.030, thick: 0.014, chord: 0.062 },
  exhaust: { z: -0.630, x: 0.120, y: 0.110, r: 0.046 },
  plow: { z: 0.690, y: -0.020, h: 0.130, d: 0.055, x: 0.280 },
  lightBar: { z: 0.290 }
};

// A go-kart: no canopy, no cage, almost no bodywork. The shell is a thin pan
// that sits BELOW the wheel tops, so the tyres stick up either side of it.
var KART = {
  id: 'KART',
  name: 'Kart',
  sub: 'کارتینگ',
  mat: { gloss: 0.92, clearcoat: 0.80, metallic: 0.34, flakes: 0.44, ao: 0.80, rim: 0.38 },
  stations: [
    [-0.420, -0.048, 0.070, 0.026, 3.0],
    [-0.380, -0.050, 0.110, 0.036, 3.2],
    [-0.240, -0.056, 0.138, 0.048, 3.4],
    [-0.040, -0.058, 0.142, 0.050, 3.4],
    [0.160, -0.056, 0.136, 0.048, 3.2],
    [0.330, -0.052, 0.108, 0.038, 3.0],
    [0.460, -0.048, 0.058, 0.024, 2.8]
  ],
  narrow: 1.0,
  noGlass: true,
  noCage: true,
  glassZ: [-0.100, 0.060],
  glassH: 0.040,
  glassY: -0.030,
  roof: null,
  scoop: null,
  arch: { r: 0.200, span: 0.92, thick: 0.020, wide: 0.075 },
  archX: 0.175,
  creases: [{ t: 0.50, k: 0.040, w: 0.14 }, { t: PI - 0.50, k: 0.040, w: 0.14 },
            { t: -0.62, k: 0.030, w: 0.15 }, { t: PI + 0.62, k: 0.030, w: 0.15 }],
  seams: [0.260, -0.260],
  stripes: [{ c: 0.000, w: 0.038, z0: -0.360, z1: 0.420, seg: 4 }],
  mirrors: null,
  wing: { z: -0.430, hw: 0.250, y: 0.105, thick: 0.010, chord: 0.062 },
  splitter: { z: 0.480, hw: 0.170, y: -0.078, thick: 0.010, chord: 0.048 },
  exhaust: { z: -0.300, x: 0.090, y: 0.030, r: 0.028 },
  engine: { z: -0.270, y: -0.010, hw: 0.082, hh: 0.046, hl: 0.072 }
};

// A dragster: the longest and narrowest body here. The cabin is pushed right to
// the back so the whole nose is one uninterrupted wedge.
var DRAGSTER = {
  id: 'DRAGSTER',
  name: 'Dragster',
  sub: 'درگستر',
  mat: { gloss: 1.0, clearcoat: 0.98, metallic: 0.82, flakes: 0.72, ao: 0.74, rim: 0.60 },
  stations: [
    [-0.720, -0.030, 0.100, 0.048, 2.8],
    [-0.660, -0.032, 0.132, 0.058, 3.0],
    [-0.500, -0.036, 0.148, 0.062, 3.0],
    [-0.300, -0.040, 0.140, 0.058, 2.9],
    [-0.060, -0.046, 0.120, 0.050, 2.8],
    [0.180, -0.050, 0.104, 0.044, 2.7],
    [0.440, -0.054, 0.086, 0.036, 2.6],
    [0.640, -0.056, 0.062, 0.026, 2.5],
    [0.740, -0.056, 0.034, 0.016, 2.4]
  ],
  narrow: 1.0,
  glassZ: [-0.520, -0.240],
  glassH: 0.058,
  glassY: -0.0181,
  roof: { z: -0.380, hw: 0.132, hl: 0.086 },
  scoop: null,
  arch: { r: 0.192, span: 1.50, thick: 0.026, wide: 0.086 },
  archX: 0.192,
  creases: [{ t: 0.42, k: 0.046, w: 0.14 }, { t: PI - 0.42, k: 0.046, w: 0.14 },
            { t: -0.58, k: 0.034, w: 0.15 }, { t: PI + 0.58, k: 0.034, w: 0.15 }],
  seams: [0.520, 0.180, -0.300, -0.600],
  stripes: [{ c: 0.000, w: 0.030, z0: -0.560, z1: 0.700, seg: 5 }],
  mirrors: null,
  wing: { z: -0.700, hw: 0.430, y: 0.250, thick: 0.014, chord: 0.110 },
  splitter: { z: 0.726, hw: 0.140, y: -0.076, thick: 0.010, chord: 0.070 },
  exhaust: { z: -0.690, x: 0.090, y: 0.010, r: 0.034 },
  stack: { x: 0.150, y: 0.070, z: -0.230, h: 0.200, r: 0.018 },
  engine: { z: 0.300, y: -0.020, hw: 0.096, hh: 0.048, hl: 0.150 }
};

// A hypercar: the widest and flattest shell of the fourteen, with the wing
// mounted on pylons above the tail rather than on the deck.
var HYPER = {
  id: 'HYPER',
  name: 'Hyper',
  sub: 'هایپرکار',
  mat: { gloss: 1.0, clearcoat: 1.0, metallic: 0.88, flakes: 0.78, ao: 0.72, rim: 0.62 },
  stations: [
    [-0.680, -0.036, 0.190, 0.044, 3.4],
    [-0.640, -0.036, 0.288, 0.058, 3.6],
    [-0.480, -0.036, 0.368, 0.066, 3.6],
    [-0.240, -0.034, 0.400, 0.068, 3.6],
    [0.040, -0.032, 0.398, 0.068, 3.5],
    [0.260, -0.032, 0.372, 0.064, 3.4],
    [0.460, -0.034, 0.330, 0.058, 3.2],
    [0.620, -0.038, 0.256, 0.046, 3.0],
    [0.720, -0.042, 0.150, 0.030, 2.8]
  ],
  narrow: 1.0,
  glassZ: [0.140, 0.440],
  glassH: 0.076,
  glassY: -0.0176,
  roof: { z: 0.040, hw: 0.196, hl: 0.130 },
  scoop: null,
  arch: { r: 0.216, span: 1.56, thick: 0.038, wide: 0.116 },
  creases: [{ t: 0.40, k: 0.050, w: 0.13 }, { t: PI - 0.40, k: 0.050, w: 0.13 },
            { t: -0.56, k: 0.038, w: 0.15 }, { t: PI + 0.56, k: 0.038, w: 0.15 }],
  seams: [0.580, 0.300, -0.180, -0.540],
  stripes: [{ c: 0.078, w: 0.032, z0: -0.600, z1: 0.680, seg: 4 }],
  flank: { y0: -0.038, y1: -0.002, z0: -0.520, z1: 0.540 },
  louvres: [{ c: 0.140, z0: 0.420, z1: 0.560, count: 3, halfW: 0.030, halfL: 0.012, lift: 0.0016 }],
  mirrors: { z: 0.340 },
  wing: { z: -0.672, hw: 0.430, y: 0.208, thick: 0.013, chord: 0.104 },
  splitter: { z: 0.700, hw: 0.360, y: -0.070, thick: 0.012, chord: 0.082 },
  exhaust: { z: -0.690, x: 0.160, y: -0.010, r: 0.040 },
  quad: true,
  sidepods: true
};

// A coach: the longest, tallest and boxiest body. Squareness 7.5 keeps the sides
// nearly flat, and the glass band runs almost the whole length.
var COACH = {
  id: 'COACH',
  name: 'Coach',
  sub: 'اتوبوس',
  mat: { gloss: 0.70, clearcoat: 0.42, metallic: 0.12, flakes: 0.16, ao: 0.86, rim: 0.22, tint: [0.96, 0.98, 1.0] },
  stations: [
    [-0.700, 0.098, 0.240, 0.150, 7.5],
    [-0.660, 0.104, 0.300, 0.182, 7.5],
    [-0.500, 0.108, 0.314, 0.192, 7.5],
    [-0.240, 0.110, 0.316, 0.194, 7.5],
    [0.060, 0.110, 0.316, 0.194, 7.5],
    [0.340, 0.108, 0.314, 0.192, 7.5],
    [0.540, 0.106, 0.308, 0.188, 7.5],
    [0.660, 0.104, 0.288, 0.176, 7.0],
    [0.720, 0.100, 0.230, 0.146, 6.5]
  ],
  narrow: 1.0,
  glassZ: [0.580, -0.320],
  windows: { y0: 0.150, y1: 0.262, z0: -0.540, z1: 0.520, cols: 4, rows: 3, panes: 4, pillar: 0.13, taper: 0.08 },
  glassH: 0.132,
  glassY: 0.148,
  roof: { z: 0.100, hw: 0.280, hl: 0.240 },
  scoop: null,
  arch: { r: 0.228, span: 1.16, thick: 0.036, wide: 0.096 },
  creases: [{ t: 0.30, k: 0.030, w: 0.18 }, { t: PI - 0.30, k: 0.030, w: 0.18 },
            { t: -0.50, k: 0.028, w: 0.18 }, { t: PI + 0.50, k: 0.028, w: 0.18 }],
  seams: [0.600, 0.240, -0.140, -0.480],
  stripes: [{ c: 0.000, w: 0.058, z0: -0.620, z1: 0.660, seg: 5 }],
  flank: { y0: -0.040, y1: 0.006, z0: -0.600, z1: 0.620 },
  mirrors: { z: 0.560, h: 0.18 },
  wing: null,
  splitter: { z: 0.706, hw: 0.230, y: -0.062, thick: 0.013, chord: 0.052 },
  exhaust: { z: -0.690, x: 0.150, y: -0.020, r: 0.040 },
  lightBar: { z: 0.620 },
  rack: { z: 0.100, hw: 0.240, hl: 0.220, bars: 4 }
};

// A SUV: upright and boxy, high beltline, roof rack. Sits between the van and
// the coach in size but is squarer than either.
var SUV = {
  id: 'SUV',
  name: 'SUV',
  sub: 'شاسی‌بلند',
  mat: { gloss: 0.76, clearcoat: 0.50, metallic: 0.26, flakes: 0.30, ao: 0.86, rim: 0.28 },
  stations: [
    [-0.660, 0.070, 0.200, 0.100, 5.6],
    [-0.620, 0.074, 0.266, 0.140, 5.8],
    [-0.460, 0.078, 0.294, 0.160, 5.8],
    [-0.220, 0.080, 0.300, 0.164, 5.8],
    [0.060, 0.078, 0.298, 0.162, 5.8],
    [0.300, 0.076, 0.288, 0.156, 5.6],
    [0.480, 0.072, 0.268, 0.142, 5.4],
    [0.610, 0.068, 0.230, 0.118, 5.2],
    [0.680, 0.066, 0.150, 0.080, 5.0]
  ],
  narrow: 1.0,
  glassZ: [0.420, -0.240],
  windows: { y0: 0.108, y1: 0.206, z0: -0.470, z1: 0.350, cols: 4, rows: 3, panes: 3, pillar: 0.17, taper: 0.22 },
  glassH: 0.116,
  glassY: 0.112,
  roof: { z: 0.060, hw: 0.262, hl: 0.200 },
  scoop: null,
  arch: { r: 0.256, span: 1.26, thick: 0.048, wide: 0.116 },
  creases: [{ t: 0.34, k: 0.042, w: 0.16 }, { t: PI - 0.34, k: 0.042, w: 0.16 },
            { t: -0.54, k: 0.032, w: 0.17 }, { t: PI + 0.54, k: 0.032, w: 0.17 }],
  seams: [0.520, 0.180, -0.180, -0.520],
  stripes: [{ c: 0.086, w: 0.036, z0: -0.560, z1: 0.620, seg: 4 }],
  flank: { y0: -0.036, y1: 0.012, z0: -0.540, z1: 0.560 },
  louvres: [{ c: 0.128, z0: 0.380, z1: 0.520, count: 3, halfW: 0.032, halfL: 0.012, lift: 0.0016 }],
  mirrors: { z: 0.400, h: 0.16 },
  wing: null,
  splitter: { z: 0.666, hw: 0.260, y: -0.058, thick: 0.013, chord: 0.058 },
  exhaust: { z: -0.650, x: 0.140, y: 0.010, r: 0.042 },
  lightBar: { z: 0.400 },
  rack: { z: 0.060, hw: 0.222, hl: 0.188, bars: 3 }
};

// A hot rod: narrow, low, with the cabin chopped and pushed back and the motor
// sitting out in the open on the nose.
var HOTROD = {
  id: 'HOTROD',
  name: 'Hot Rod',
  sub: 'هات‌راد',
  mat: { gloss: 0.58, clearcoat: 0.26, metallic: 0.42, flakes: 0.38, ao: 0.86, rim: 0.30 },
  stations: [
    [-0.660, -0.028, 0.110, 0.048, 2.9],
    [-0.620, -0.026, 0.164, 0.060, 3.0],
    [-0.440, -0.022, 0.182, 0.066, 3.0],
    [-0.220, -0.020, 0.176, 0.064, 2.9],
    [0.020, -0.022, 0.152, 0.054, 2.8],
    [0.260, -0.026, 0.134, 0.046, 2.7],
    [0.480, -0.030, 0.116, 0.038, 2.6],
    [0.640, -0.032, 0.086, 0.028, 2.5],
    [0.720, -0.034, 0.050, 0.018, 2.4]
  ],
  narrow: 1.0,
  glassZ: [-0.300, -0.060],
  glassH: 0.064,
  glassY: -0.0054,
  roof: { z: -0.180, hw: 0.158, hl: 0.100 },
  scoop: null,
  arch: { r: 0.206, span: 1.32, thick: 0.030, wide: 0.102 },
  archX: 0.216,
  creases: [{ t: 0.44, k: 0.048, w: 0.14 }, { t: PI - 0.44, k: 0.048, w: 0.14 },
            { t: -0.60, k: 0.036, w: 0.15 }, { t: PI + 0.60, k: 0.036, w: 0.15 }],
  seams: [0.480, 0.060, -0.360, -0.600],
  stripes: [{ c: 0.000, w: 0.030, z0: -0.400, z1: 0.640, seg: 4 }],
  louvres: [{ c: 0.084, z0: 0.380, z1: 0.520, count: 4, halfW: 0.024, halfL: 0.010, lift: 0.0016 }],
  mirrors: null,
  wing: null,
  splitter: { z: 0.708, hw: 0.130, y: -0.060, thick: 0.011, chord: 0.054 },
  exhaust: { z: -0.640, x: 0.096, y: 0.010, r: 0.032 },
  stack: { x: 0.132, y: 0.088, z: -0.070, h: 0.230, r: 0.020 },
  engine: { z: 0.300, y: 0.004, hw: 0.104, hh: 0.054, hl: 0.132 }
};

// A limousine: the longest and lowest of the formal bodies, with a tall rear
// greenhouse so it reads as a chauffeur car rather than another van.
var LIMO = {
  id: 'LIMO',
  name: 'Limo',
  sub: 'لیموزین',
  mat: { gloss: 0.96, clearcoat: 0.92, metallic: 0.58, flakes: 0.48, ao: 0.78, rim: 0.48 },
  stations: [
    [-0.740, 0.046, 0.170, 0.078, 4.6],
    [-0.700, 0.048, 0.238, 0.112, 4.8],
    [-0.520, 0.052, 0.276, 0.132, 5.0],
    [-0.260, 0.056, 0.286, 0.138, 5.0],
    [0.020, 0.056, 0.286, 0.138, 5.0],
    [0.300, 0.054, 0.280, 0.134, 4.8],
    [0.500, 0.050, 0.266, 0.126, 4.6],
    [0.660, 0.046, 0.226, 0.106, 4.4],
    [0.760, 0.042, 0.140, 0.066, 4.2]
  ],
  narrow: 1.0,
  glassZ: [0.460, -0.320],
  windows: { y0: 0.098, y1: 0.190, z0: -0.520, z1: 0.470, cols: 4, rows: 3, panes: 3, pillar: 0.16, taper: 0.20 },
  glassH: 0.106,
  glassY: 0.118,
  roof: { z: 0.020, hw: 0.248, hl: 0.260 },
  scoop: null,
  arch: { r: 0.226, span: 1.30, thick: 0.038, wide: 0.098 },
  creases: [{ t: 0.36, k: 0.040, w: 0.16 }, { t: PI - 0.36, k: 0.040, w: 0.16 },
            { t: -0.56, k: 0.030, w: 0.17 }, { t: PI + 0.56, k: 0.030, w: 0.17 }],
  seams: [0.600, 0.260, -0.140, -0.540],
  stripes: [{ c: 0.000, w: 0.028, z0: -0.660, z1: 0.700, seg: 5 }],
  flank: { y0: -0.030, y1: 0.010, z0: -0.620, z1: 0.620 },
  mirrors: { z: 0.440, h: 0.12 },
  wing: null,
  splitter: { z: 0.746, hw: 0.240, y: -0.064, thick: 0.012, chord: 0.050 },
  exhaust: { z: -0.730, x: 0.130, y: -0.010, r: 0.038 },
  quad: true
};

var DOMINUS = {
  id: 'DOMINUS', name: 'Dominator GT', sub: 'وج سوپراسپرت',
  mat: { gloss: 0.95, clearcoat: 0.90, metallic: 0.65, flakes: 0.40, ao: 0.85, rim: 0.35 },
  stations: [
    [-0.720, -0.010, 0.190, 0.052, 4.2],
    [-0.680, -0.005, 0.260, 0.080, 4.5],
    [-0.480, 0.000, 0.285, 0.098, 4.8],
    [-0.240, 0.005, 0.292, 0.104, 4.8],
    [0.040, 0.005, 0.288, 0.098, 4.6],
    [0.280, 0.000, 0.270, 0.086, 4.2],
    [0.480, -0.010, 0.235, 0.070, 3.8],
    [0.640, -0.020, 0.180, 0.050, 3.4],
    [0.720, -0.028, 0.120, 0.032, 3.0]
  ],
  narrow: 0.96,
  glassZ: [0.180, -0.280], glassH: 0.078, glassY: 0.042,
  roof: { z: -0.040, hw: 0.220, hl: 0.150 },
  arch: { r: 0.218, span: 1.45, thick: 0.036, wide: 0.110 },
  creases: [{ t: 0.42, k: 0.048, w: 0.14 }, { t: PI - 0.42, k: 0.048, w: 0.14 }],
  seams: [0.520, 0.220, -0.180, -0.520],
  stripes: [{ c: 0.065, w: 0.032, z0: -0.650, z1: 0.680, seg: 4 }],
  flank: { y0: -0.032, y1: 0.008, z0: -0.580, z1: 0.580 },
  mirrors: { z: 0.220 },
  wing: { z: -0.680, hw: 0.380, y: 0.185, thick: 0.014, chord: 0.110 },
  splitter: { z: 0.710, hw: 0.320, y: -0.055, thick: 0.012, chord: 0.075 },
  exhaust: { z: -0.710, x: 0.140, y: -0.012, r: 0.038 }
};

var FENNEC = {
  id: 'FENNEC', name: 'Fennec Cyber', sub: 'بدنه جعبه‌ای عضلانی',
  mat: { gloss: 0.88, clearcoat: 0.82, metallic: 0.55, flakes: 0.35, ao: 0.88, rim: 0.30 },
  stations: [
    [-0.660, 0.042, 0.210, 0.090, 5.8],
    [-0.620, 0.046, 0.270, 0.125, 6.0],
    [-0.440, 0.050, 0.292, 0.142, 6.2],
    [-0.200, 0.052, 0.298, 0.146, 6.2],
    [0.080, 0.050, 0.294, 0.142, 6.0],
    [0.320, 0.046, 0.280, 0.130, 5.6],
    [0.500, 0.040, 0.252, 0.110, 5.2],
    [0.620, 0.032, 0.200, 0.082, 4.8],
    [0.680, 0.026, 0.130, 0.052, 4.4]
  ],
  narrow: 1.0,
  glassZ: [0.360, -0.280], glassH: 0.102, glassY: 0.088,
  roof: { z: 0.020, hw: 0.245, hl: 0.180 },
  arch: { r: 0.228, span: 1.35, thick: 0.042, wide: 0.118 },
  creases: [{ t: 0.35, k: 0.042, w: 0.16 }, { t: PI - 0.35, k: 0.042, w: 0.16 }],
  seams: [0.480, 0.180, -0.220, -0.540],
  stripes: [{ c: 0.000, w: 0.045, z0: -0.580, z1: 0.620, seg: 4 }],
  flank: { y0: -0.028, y1: 0.015, z0: -0.550, z1: 0.550 },
  mirrors: { z: 0.320 },
  wing: { z: -0.620, hw: 0.320, y: 0.220, thick: 0.015, chord: 0.090 },
  splitter: { z: 0.670, hw: 0.280, y: -0.052, thick: 0.014, chord: 0.065 },
  exhaust: { z: -0.650, x: 0.120, y: -0.010, r: 0.042 }
};

var TAKUMI = {
  id: 'TAKUMI', name: 'Samurai Drift', sub: 'کوپه دریفت JDM',
  mat: { gloss: 0.92, clearcoat: 0.88, metallic: 0.58, flakes: 0.45, ao: 0.82, rim: 0.38 },
  stations: [
    [-0.680, 0.010, 0.180, 0.060, 4.0],
    [-0.640, 0.015, 0.250, 0.092, 4.2],
    [-0.440, 0.020, 0.278, 0.112, 4.5],
    [-0.200, 0.022, 0.284, 0.118, 4.5],
    [0.060, 0.020, 0.276, 0.110, 4.2],
    [0.300, 0.015, 0.258, 0.095, 3.8],
    [0.500, 0.005, 0.222, 0.075, 3.5],
    [0.630, -0.005, 0.165, 0.052, 3.0],
    [0.700, -0.015, 0.100, 0.032, 2.6]
  ],
  narrow: 0.95,
  glassZ: [0.220, -0.240], glassH: 0.088, glassY: 0.062,
  roof: { z: -0.020, hw: 0.210, hl: 0.140 },
  arch: { r: 0.225, span: 1.50, thick: 0.046, wide: 0.125 },
  creases: [{ t: 0.40, k: 0.045, w: 0.14 }, { t: PI - 0.40, k: 0.045, w: 0.14 }],
  seams: [0.480, 0.200, -0.160, -0.500],
  louvres: [{ c: 0.090, z0: 0.280, z1: 0.450, count: 3, halfW: 0.028, halfL: 0.010, lift: 0.002 }],
  flank: { y0: -0.030, y1: 0.010, z0: -0.520, z1: 0.520 },
  mirrors: { z: 0.240 },
  wing: { z: -0.650, hw: 0.360, y: 0.210, thick: 0.013, chord: 0.098 },
  splitter: { z: 0.680, hw: 0.290, y: -0.058, thick: 0.012, chord: 0.070 },
  exhaust: { z: -0.670, x: 0.130, y: -0.015, r: 0.048 }
};

var BREAKOUT = {
  id: 'BREAKOUT', name: 'Apex Hyper R', sub: 'هایپرکار موتور وسط',
  mat: { gloss: 0.98, clearcoat: 0.95, metallic: 0.70, flakes: 0.50, ao: 0.80, rim: 0.40 },
  stations: [
    [-0.740, -0.020, 0.180, 0.042, 3.8],
    [-0.700, -0.015, 0.260, 0.068, 4.0],
    [-0.500, -0.010, 0.290, 0.082, 4.2],
    [-0.260, -0.005, 0.298, 0.088, 4.2],
    [0.020, -0.005, 0.292, 0.082, 4.0],
    [0.260, -0.010, 0.272, 0.070, 3.6],
    [0.480, -0.020, 0.230, 0.052, 3.2],
    [0.650, -0.030, 0.170, 0.038, 2.8],
    [0.740, -0.038, 0.110, 0.024, 2.5]
  ],
  narrow: 0.94,
  glassZ: [0.140, -0.320], glassH: 0.068, glassY: 0.030,
  roof: { z: -0.080, hw: 0.210, hl: 0.160 },
  arch: { r: 0.212, span: 1.40, thick: 0.032, wide: 0.108 },
  creases: [{ t: 0.45, k: 0.052, w: 0.12 }, { t: PI - 0.45, k: 0.052, w: 0.12 }],
  seams: [0.540, 0.240, -0.200, -0.560],
  flank: { y0: -0.035, y1: 0.005, z0: -0.600, z1: 0.600 },
  mirrors: { z: 0.180 },
  wing: { z: -0.710, hw: 0.410, y: 0.175, thick: 0.012, chord: 0.120 },
  splitter: { z: 0.730, hw: 0.340, y: -0.060, thick: 0.011, chord: 0.085 },
  exhaust: { z: -0.730, x: 0.150, y: -0.008, r: 0.035 }
};

var MANTIS = {
  id: 'MANTIS', name: 'Mantis Proto', sub: 'سوپر اسپرت خوابیده',
  mat: { gloss: 0.96, clearcoat: 0.92, metallic: 0.62, flakes: 0.42, ao: 0.82, rim: 0.36 },
  stations: [
    [-0.720, -0.030, 0.170, 0.038, 3.5],
    [-0.680, -0.022, 0.240, 0.060, 3.8],
    [-0.480, -0.015, 0.275, 0.075, 4.0],
    [-0.240, -0.010, 0.282, 0.080, 4.0],
    [0.040, -0.010, 0.278, 0.075, 3.8],
    [0.280, -0.018, 0.258, 0.062, 3.5],
    [0.480, -0.028, 0.218, 0.048, 3.2],
    [0.640, -0.038, 0.160, 0.032, 2.8],
    [0.720, -0.045, 0.100, 0.020, 2.4]
  ],
  narrow: 0.93,
  glassZ: [0.120, -0.340], glassH: 0.062, glassY: 0.022,
  roof: { z: -0.100, hw: 0.190, hl: 0.160 },
  arch: { r: 0.208, span: 1.42, thick: 0.030, wide: 0.102 },
  creases: [{ t: 0.48, k: 0.055, w: 0.11 }, { t: PI - 0.48, k: 0.055, w: 0.11 }],
  seams: [0.520, 0.220, -0.220, -0.580],
  flank: { y0: -0.038, y1: 0.002, z0: -0.620, z1: 0.620 },
  mirrors: { z: 0.160 },
  wing: { z: -0.700, hw: 0.390, y: 0.160, thick: 0.012, chord: 0.115 },
  splitter: { z: 0.710, hw: 0.330, y: -0.065, thick: 0.010, chord: 0.080 },
  exhaust: { z: -0.710, x: 0.120, y: -0.005, r: 0.036 }
};

var MERC = {
  id: 'MERC', name: 'Bastion Titan', sub: 'سنگین‌وزن زره‌پوش',
  mat: { gloss: 0.72, clearcoat: 0.48, metallic: 0.35, flakes: 0.20, ao: 0.92, rim: 0.20 },
  stations: [
    [-0.680, 0.080, 0.230, 0.160, 7.2],
    [-0.640, 0.088, 0.295, 0.195, 7.5],
    [-0.460, 0.092, 0.312, 0.208, 7.5],
    [-0.220, 0.095, 0.318, 0.210, 7.5],
    [0.060, 0.092, 0.312, 0.205, 7.2],
    [0.320, 0.085, 0.298, 0.190, 6.8],
    [0.520, 0.075, 0.270, 0.168, 6.2],
    [0.650, 0.062, 0.215, 0.132, 5.5],
    [0.700, 0.052, 0.145, 0.085, 5.0]
  ],
  narrow: 1.0,
  glassZ: [0.420, -0.220], glassH: 0.125, glassY: 0.138,
  roof: { z: 0.080, hw: 0.270, hl: 0.210 },
  arch: { r: 0.260, span: 1.22, thick: 0.052, wide: 0.122 },
  creases: [{ t: 0.28, k: 0.032, w: 0.20 }, { t: PI - 0.28, k: 0.032, w: 0.20 }],
  seams: [0.550, 0.200, -0.200, -0.520],
  flank: { y0: -0.040, y1: 0.020, z0: -0.580, z1: 0.580 },
  mirrors: { z: 0.420, h: 0.16 },
  splitter: { z: 0.690, hw: 0.290, y: -0.058, thick: 0.018, chord: 0.060 },
  exhaust: { z: -0.660, x: 0.210, y: 0.220, r: 0.050, stack: true }
};

var BATCAR = {
  id: 'BATCAR', name: 'Phantom Stealth', sub: 'موشک زاویه‌دار',
  mat: { gloss: 0.65, clearcoat: 0.40, metallic: 0.85, flakes: 0.15, ao: 0.95, rim: 0.45 },
  stations: [
    [-0.760, -0.025, 0.160, 0.035, 3.2],
    [-0.700, -0.018, 0.230, 0.055, 3.5],
    [-0.500, -0.010, 0.270, 0.070, 3.8],
    [-0.260, -0.005, 0.280, 0.076, 3.8],
    [0.020, -0.005, 0.272, 0.070, 3.5],
    [0.260, -0.012, 0.250, 0.058, 3.2],
    [0.480, -0.022, 0.210, 0.042, 2.8],
    [0.650, -0.032, 0.150, 0.028, 2.4],
    [0.740, -0.040, 0.090, 0.018, 2.0]
  ],
  narrow: 0.92,
  glassZ: [0.100, -0.360], glassH: 0.058, glassY: 0.018,
  roof: { z: -0.120, hw: 0.180, hl: 0.150 },
  arch: { r: 0.205, span: 1.48, thick: 0.028, wide: 0.100 },
  creases: [{ t: 0.52, k: 0.060, w: 0.10 }, { t: PI - 0.52, k: 0.060, w: 0.10 }],
  seams: [0.520, 0.220, -0.220, -0.580],
  flank: { y0: -0.040, y1: 0.000, z0: -0.640, z1: 0.640 },
  mirrors: { z: 0.140 },
  wing: { z: -0.730, hw: 0.440, y: 0.190, thick: 0.011, chord: 0.125 },
  splitter: { z: 0.750, hw: 0.350, y: -0.068, thick: 0.009, chord: 0.090 },
  exhaust: { z: -0.740, x: 0.000, y: 0.020, r: 0.065 }
};

var VANGUARD = {
  id: 'VANGUARD', name: 'Vanguard Van', sub: 'ون مسابقه‌ای مرتفع',
  mat: { gloss: 0.82, clearcoat: 0.65, metallic: 0.40, flakes: 0.25, ao: 0.88, rim: 0.25 },
  stations: [
    [-0.670, 0.075, 0.220, 0.150, 6.8],
    [-0.630, 0.082, 0.285, 0.182, 7.0],
    [-0.450, 0.086, 0.305, 0.195, 7.0],
    [-0.210, 0.088, 0.310, 0.198, 7.0],
    [0.070, 0.085, 0.302, 0.192, 6.8],
    [0.320, 0.078, 0.288, 0.178, 6.4],
    [0.510, 0.068, 0.260, 0.155, 5.8],
    [0.640, 0.055, 0.205, 0.122, 5.2],
    [0.690, 0.046, 0.138, 0.078, 4.6]
  ],
  narrow: 1.0,
  glassZ: [0.450, -0.250], glassH: 0.128, glassY: 0.130,
  roof: { z: 0.080, hw: 0.265, hl: 0.210 },
  arch: { r: 0.245, span: 1.25, thick: 0.045, wide: 0.115 },
  creases: [{ t: 0.30, k: 0.035, w: 0.18 }, { t: PI - 0.30, k: 0.035, w: 0.18 }],
  seams: [0.540, 0.200, -0.200, -0.500],
  flank: { y0: -0.038, y1: 0.015, z0: -0.560, z1: 0.560 },
  mirrors: { z: 0.440, h: 0.15 },
  wing: { z: -0.640, hw: 0.310, y: 0.250, thick: 0.016, chord: 0.080 },
  splitter: { z: 0.680, hw: 0.270, y: -0.055, thick: 0.015, chord: 0.058 },
  exhaust: { z: -0.650, x: 0.140, y: -0.012, r: 0.040 }
};

var NOCTURNE = {
  id: 'NOCTURNE', name: 'Nocturne Exotic', sub: 'کانوپی جتی',
  mat: { gloss: 0.94, clearcoat: 0.90, metallic: 0.68, flakes: 0.45, ao: 0.82, rim: 0.38 },
  stations: [
    [-0.720, -0.015, 0.180, 0.048, 4.0],
    [-0.680, -0.008, 0.250, 0.072, 4.2],
    [-0.480, -0.002, 0.280, 0.090, 4.5],
    [-0.240, 0.002, 0.288, 0.095, 4.5],
    [0.040, 0.002, 0.282, 0.090, 4.2],
    [0.280, -0.005, 0.262, 0.078, 3.8],
    [0.480, -0.015, 0.225, 0.060, 3.4],
    [0.640, -0.025, 0.170, 0.042, 3.0],
    [0.720, -0.032, 0.110, 0.026, 2.6]
  ],
  narrow: 0.95,
  glassZ: [0.160, -0.300], glassH: 0.074, glassY: 0.038,
  roof: { z: -0.060, hw: 0.200, hl: 0.150 },
  arch: { r: 0.215, span: 1.42, thick: 0.034, wide: 0.106 },
  creases: [{ t: 0.44, k: 0.050, w: 0.13 }, { t: PI - 0.44, k: 0.050, w: 0.13 }],
  seams: [0.520, 0.220, -0.180, -0.540],
  flank: { y0: -0.034, y1: 0.006, z0: -0.580, z1: 0.580 },
  mirrors: { z: 0.200 },
  wing: { z: -0.690, hw: 0.390, y: 0.180, thick: 0.013, chord: 0.112 },
  splitter: { z: 0.710, hw: 0.320, y: -0.058, thick: 0.011, chord: 0.078 },
  exhaust: { z: -0.710, x: 0.000, y: 0.040, r: 0.055 }
};

var BRAWLER = {
  id: 'BRAWLER', name: 'Brawler V8 Muscle', sub: 'ماسل کار کلاسیک',
  mat: { gloss: 0.90, clearcoat: 0.84, metallic: 0.52, flakes: 0.38, ao: 0.86, rim: 0.32 },
  stations: [
    [-0.700, 0.005, 0.200, 0.068, 4.8],
    [-0.660, 0.010, 0.270, 0.098, 5.0],
    [-0.460, 0.015, 0.295, 0.118, 5.2],
    [-0.220, 0.018, 0.302, 0.122, 5.2],
    [0.060, 0.015, 0.296, 0.116, 5.0],
    [0.300, 0.008, 0.278, 0.100, 4.6],
    [0.500, -0.002, 0.240, 0.080, 4.2],
    [0.630, -0.012, 0.180, 0.058, 3.8],
    [0.700, -0.020, 0.115, 0.038, 3.4]
  ],
  narrow: 0.97,
  glassZ: [0.200, -0.260], glassH: 0.084, glassY: 0.055,
  roof: { z: -0.030, hw: 0.230, hl: 0.150 },
  scoop: { z: 0.320, hw: 0.075, hl: 0.110, h: 0.065 },
  arch: { r: 0.232, span: 1.40, thick: 0.044, wide: 0.120 },
  creases: [{ t: 0.38, k: 0.042, w: 0.15 }, { t: PI - 0.38, k: 0.042, w: 0.15 }],
  seams: [0.500, 0.200, -0.180, -0.520],
  stripes: [{ c: 0.000, w: 0.052, z0: -0.620, z1: 0.650, seg: 4 }],
  flank: { y0: -0.032, y1: 0.010, z0: -0.550, z1: 0.550 },
  mirrors: { z: 0.240 },
  wing: { z: -0.660, hw: 0.350, y: 0.170, thick: 0.014, chord: 0.085 },
  splitter: { z: 0.690, hw: 0.300, y: -0.056, thick: 0.013, chord: 0.068 },
  exhaust: { z: -0.680, x: 0.160, y: -0.012, r: 0.045 }
};

var PALADIN = {
  id: 'PALADIN', name: 'Paladin Heavy', sub: 'شاسی‌بلند آفرود',
  mat: { gloss: 0.78, clearcoat: 0.55, metallic: 0.42, flakes: 0.28, ao: 0.90, rim: 0.22 },
  stations: [
    [-0.670, 0.065, 0.210, 0.130, 6.2],
    [-0.630, 0.072, 0.275, 0.162, 6.5],
    [-0.450, 0.076, 0.298, 0.178, 6.5],
    [-0.210, 0.078, 0.304, 0.182, 6.5],
    [0.070, 0.075, 0.298, 0.176, 6.2],
    [0.310, 0.068, 0.282, 0.160, 5.8],
    [0.500, 0.058, 0.252, 0.138, 5.2],
    [0.630, 0.046, 0.198, 0.108, 4.6],
    [0.690, 0.038, 0.132, 0.070, 4.0]
  ],
  narrow: 1.0,
  glassZ: [0.400, -0.240], glassH: 0.118, glassY: 0.118,
  roof: { z: 0.060, hw: 0.258, hl: 0.195 },
  arch: { r: 0.255, span: 1.28, thick: 0.050, wide: 0.125 },
  creases: [{ t: 0.32, k: 0.038, w: 0.17 }, { t: PI - 0.32, k: 0.038, w: 0.17 }],
  seams: [0.520, 0.180, -0.180, -0.500],
  flank: { y0: -0.036, y1: 0.012, z0: -0.540, z1: 0.540 },
  mirrors: { z: 0.380, h: 0.15 },
  lightBar: { z: 0.440 },
  splitter: { z: 0.680, hw: 0.280, y: -0.058, thick: 0.016, chord: 0.062 },
  exhaust: { z: -0.660, x: 0.150, y: -0.010, r: 0.042 }
};

var BREAKER = {
  id: 'BREAKER', name: 'Breaker Wedge', sub: 'تیغه شیرجه‌ای',
  mat: { gloss: 0.94, clearcoat: 0.88, metallic: 0.62, flakes: 0.42, ao: 0.84, rim: 0.35 },
  stations: [
    [-0.730, -0.020, 0.180, 0.045, 4.0],
    [-0.690, -0.012, 0.250, 0.070, 4.2],
    [-0.490, -0.006, 0.280, 0.088, 4.5],
    [-0.250, 0.000, 0.288, 0.092, 4.5],
    [0.030, 0.000, 0.282, 0.088, 4.2],
    [0.270, -0.008, 0.262, 0.075, 3.8],
    [0.470, -0.018, 0.225, 0.058, 3.4],
    [0.640, -0.028, 0.170, 0.040, 3.0],
    [0.720, -0.035, 0.110, 0.025, 2.6]
  ],
  narrow: 0.95,
  glassZ: [0.160, -0.300], glassH: 0.072, glassY: 0.035,
  roof: { z: -0.060, hw: 0.210, hl: 0.150 },
  arch: { r: 0.216, span: 1.44, thick: 0.035, wide: 0.108 },
  creases: [{ t: 0.42, k: 0.048, w: 0.13 }, { t: PI - 0.42, k: 0.048, w: 0.13 }],
  seams: [0.520, 0.220, -0.180, -0.540],
  flank: { y0: -0.034, y1: 0.006, z0: -0.580, z1: 0.580 },
  mirrors: { z: 0.200 },
  wing: { z: -0.690, hw: 0.380, y: 0.180, thick: 0.013, chord: 0.108 },
  splitter: { z: 0.720, hw: 0.330, y: -0.060, thick: 0.011, chord: 0.080 },
  exhaust: { z: -0.710, x: 0.130, y: -0.010, r: 0.038 }
};

var RALLYHAWK = {
  id: 'RALLYHAWK', name: 'Rally Hawk', sub: 'هاشبک رالی شن',
  mat: { gloss: 0.86, clearcoat: 0.78, metallic: 0.48, flakes: 0.32, ao: 0.86, rim: 0.28 },
  stations: [
    [-0.660, 0.035, 0.200, 0.082, 5.2],
    [-0.620, 0.040, 0.260, 0.115, 5.5],
    [-0.440, 0.044, 0.285, 0.132, 5.8],
    [-0.200, 0.046, 0.290, 0.136, 5.8],
    [0.080, 0.044, 0.285, 0.132, 5.5],
    [0.320, 0.038, 0.270, 0.120, 5.2],
    [0.500, 0.030, 0.242, 0.100, 4.6],
    [0.620, 0.022, 0.190, 0.075, 4.2],
    [0.680, 0.015, 0.125, 0.048, 3.8]
  ],
  narrow: 0.98,
  glassZ: [0.320, -0.260], glassH: 0.096, glassY: 0.078,
  roof: { z: 0.010, hw: 0.235, hl: 0.170 },
  arch: { r: 0.235, span: 1.38, thick: 0.045, wide: 0.120 },
  creases: [{ t: 0.36, k: 0.040, w: 0.15 }, { t: PI - 0.36, k: 0.040, w: 0.15 }],
  seams: [0.480, 0.180, -0.200, -0.520],
  flank: { y0: -0.030, y1: 0.012, z0: -0.540, z1: 0.540 },
  mirrors: { z: 0.300 },
  wing: { z: -0.610, hw: 0.310, y: 0.205, thick: 0.014, chord: 0.085 },
  splitter: { z: 0.660, hw: 0.270, y: -0.050, thick: 0.013, chord: 0.060 },
  exhaust: { z: -0.640, x: 0.110, y: -0.010, r: 0.040 }
};

var ZEPHYR = {
  id: 'ZEPHYR', name: 'Zephyr Speedster', sub: 'کابین روباز اسپرت',
  mat: { gloss: 0.96, clearcoat: 0.92, metallic: 0.65, flakes: 0.45, ao: 0.80, rim: 0.38 },
  stations: [
    [-0.700, -0.005, 0.180, 0.055, 3.8],
    [-0.660, 0.000, 0.250, 0.082, 4.0],
    [-0.460, 0.005, 0.280, 0.100, 4.2],
    [-0.220, 0.008, 0.288, 0.105, 4.2],
    [0.060, 0.005, 0.280, 0.098, 4.0],
    [0.300, -0.002, 0.260, 0.082, 3.6],
    [0.500, -0.010, 0.220, 0.062, 3.2],
    [0.630, -0.020, 0.160, 0.042, 2.8],
    [0.700, -0.028, 0.100, 0.026, 2.4]
  ],
  narrow: 0.94,
  glassZ: [0.200, 0.020], glassH: 0.052, glassY: 0.045,
  roof: { z: -0.040, hw: 0.200, hl: 0.120 },
  arch: { r: 0.220, span: 1.46, thick: 0.038, wide: 0.112 },
  creases: [{ t: 0.42, k: 0.046, w: 0.13 }, { t: PI - 0.42, k: 0.046, w: 0.13 }],
  seams: [0.480, 0.200, -0.160, -0.500],
  flank: { y0: -0.032, y1: 0.008, z0: -0.540, z1: 0.540 },
  mirrors: { z: 0.220 },
  splitter: { z: 0.690, hw: 0.300, y: -0.058, thick: 0.011, chord: 0.072 },
  exhaust: { z: -0.680, x: 0.130, y: -0.012, r: 0.040 }
};

var CENTAUR = {
  id: 'CENTAUR', name: 'Centaur GT', sub: 'گرند تورر سنگین',
  mat: { gloss: 0.92, clearcoat: 0.86, metallic: 0.60, flakes: 0.40, ao: 0.84, rim: 0.34 },
  stations: [
    [-0.720, 0.000, 0.190, 0.062, 4.2],
    [-0.680, 0.005, 0.260, 0.092, 4.5],
    [-0.480, 0.010, 0.288, 0.112, 4.8],
    [-0.240, 0.012, 0.295, 0.118, 4.8],
    [0.040, 0.010, 0.288, 0.112, 4.5],
    [0.280, 0.002, 0.268, 0.095, 4.0],
    [0.480, -0.008, 0.230, 0.075, 3.6],
    [0.640, -0.018, 0.175, 0.052, 3.2],
    [0.720, -0.025, 0.115, 0.032, 2.8]
  ],
  narrow: 0.96,
  glassZ: [0.180, -0.260], glassH: 0.082, glassY: 0.050,
  roof: { z: -0.040, hw: 0.220, hl: 0.150 },
  arch: { r: 0.225, span: 1.42, thick: 0.040, wide: 0.115 },
  creases: [{ t: 0.40, k: 0.044, w: 0.14 }, { t: PI - 0.40, k: 0.044, w: 0.14 }],
  seams: [0.520, 0.220, -0.180, -0.520],
  flank: { y0: -0.032, y1: 0.008, z0: -0.560, z1: 0.560 },
  mirrors: { z: 0.220 },
  wing: { z: -0.680, hw: 0.360, y: 0.175, thick: 0.013, chord: 0.095 },
  splitter: { z: 0.710, hw: 0.310, y: -0.056, thick: 0.012, chord: 0.072 },
  exhaust: { z: -0.700, x: 0.150, y: -0.012, r: 0.042 }
};

var HORNET = {
  id: 'HORNET', name: 'Hornet Kei Racer', sub: 'کوچک و فوق‌العاده سریع',
  mat: { gloss: 0.90, clearcoat: 0.82, metallic: 0.50, flakes: 0.35, ao: 0.86, rim: 0.30 },
  stations: [
    [-0.620, 0.030, 0.180, 0.075, 4.8],
    [-0.580, 0.035, 0.240, 0.105, 5.0],
    [-0.400, 0.038, 0.265, 0.122, 5.2],
    [-0.180, 0.040, 0.270, 0.125, 5.2],
    [0.060, 0.038, 0.265, 0.120, 5.0],
    [0.280, 0.032, 0.250, 0.108, 4.6],
    [0.440, 0.024, 0.220, 0.088, 4.2],
    [0.560, 0.016, 0.170, 0.065, 3.8],
    [0.620, 0.010, 0.110, 0.042, 3.4]
  ],
  narrow: 0.98,
  glassZ: [0.280, -0.220], glassH: 0.092, glassY: 0.072,
  roof: { z: 0.000, hw: 0.220, hl: 0.150 },
  arch: { r: 0.220, span: 1.32, thick: 0.040, wide: 0.110 },
  creases: [{ t: 0.38, k: 0.040, w: 0.15 }, { t: PI - 0.38, k: 0.040, w: 0.15 }],
  seams: [0.440, 0.160, -0.180, -0.480],
  flank: { y0: -0.028, y1: 0.010, z0: -0.500, z1: 0.500 },
  mirrors: { z: 0.260 },
  wing: { z: -0.580, hw: 0.320, y: 0.200, thick: 0.013, chord: 0.088 },
  splitter: { z: 0.620, hw: 0.250, y: -0.048, thick: 0.012, chord: 0.055 },
  exhaust: { z: -0.600, x: 0.110, y: -0.010, r: 0.038 }
};

var DRAGLINE = {
  id: 'DRAGLINE', name: 'Dragline Rocket', sub: 'درگستر چرخ عقب غول‌پیکر',
  mat: { gloss: 0.94, clearcoat: 0.88, metallic: 0.65, flakes: 0.45, ao: 0.82, rim: 0.38 },
  stations: [
    [-0.820, -0.015, 0.160, 0.040, 3.5],
    [-0.760, -0.008, 0.220, 0.060, 3.8],
    [-0.520, 0.000, 0.250, 0.078, 4.0],
    [-0.260, 0.005, 0.260, 0.082, 4.0],
    [0.040, 0.002, 0.250, 0.076, 3.8],
    [0.300, -0.005, 0.230, 0.062, 3.4],
    [0.520, -0.015, 0.190, 0.045, 3.0],
    [0.700, -0.025, 0.130, 0.028, 2.6],
    [0.800, -0.032, 0.080, 0.016, 2.2]
  ],
  narrow: 0.92,
  glassZ: [0.120, -0.280], glassH: 0.065, glassY: 0.032,
  roof: { z: -0.080, hw: 0.180, hl: 0.140 },
  scoop: { z: 0.280, hw: 0.070, hl: 0.100, h: 0.060 },
  arch: { r: 0.205, span: 1.55, thick: 0.032, wide: 0.105 },
  creases: [{ t: 0.46, k: 0.050, w: 0.12 }, { t: PI - 0.46, k: 0.050, w: 0.12 }],
  seams: [0.560, 0.240, -0.200, -0.600],
  flank: { y0: -0.036, y1: 0.005, z0: -0.640, z1: 0.640 },
  mirrors: { z: 0.160 },
  wing: { z: -0.780, hw: 0.420, y: 0.220, thick: 0.015, chord: 0.130 },
  splitter: { z: 0.790, hw: 0.310, y: -0.062, thick: 0.010, chord: 0.082 },
  exhaust: { z: -0.790, x: 0.140, y: 0.080, r: 0.052 }
};

var AEROWING = {
  id: 'AEROWING', name: 'Aerowing LMP', sub: 'استقامت لمانز',
  mat: { gloss: 0.98, clearcoat: 0.95, metallic: 0.72, flakes: 0.52, ao: 0.80, rim: 0.42 },
  stations: [
    [-0.760, -0.025, 0.180, 0.040, 3.6],
    [-0.700, -0.018, 0.260, 0.062, 3.8],
    [-0.500, -0.010, 0.290, 0.078, 4.0],
    [-0.260, -0.005, 0.298, 0.082, 4.0],
    [0.020, -0.005, 0.290, 0.078, 3.8],
    [0.260, -0.012, 0.270, 0.065, 3.5],
    [0.480, -0.022, 0.228, 0.048, 3.1],
    [0.650, -0.032, 0.168, 0.032, 2.6],
    [0.750, -0.040, 0.105, 0.020, 2.2]
  ],
  narrow: 0.93,
  glassZ: [0.120, -0.320], glassH: 0.064, glassY: 0.025,
  roof: { z: -0.090, hw: 0.190, hl: 0.160 },
  arch: { r: 0.210, span: 1.44, thick: 0.030, wide: 0.106 },
  creases: [{ t: 0.48, k: 0.054, w: 0.11 }, { t: PI - 0.48, k: 0.054, w: 0.11 }],
  seams: [0.540, 0.240, -0.220, -0.580],
  flank: { y0: -0.036, y1: 0.004, z0: -0.620, z1: 0.620 },
  mirrors: { z: 0.160 },
  wing: { z: -0.730, hw: 0.430, y: 0.185, thick: 0.012, chord: 0.122 },
  splitter: { z: 0.740, hw: 0.360, y: -0.064, thick: 0.010, chord: 0.090 },
  exhaust: { z: -0.740, x: 0.120, y: -0.005, r: 0.036 }
};

var VOLTAIC = {
  id: 'VOLTAIC', name: 'Voltaic EV One', sub: 'مفهومی نئونی الکتریکی',
  mat: { gloss: 0.98, clearcoat: 0.96, metallic: 0.75, flakes: 0.55, ao: 0.78, rim: 0.45 },
  stations: [
    [-0.720, -0.015, 0.185, 0.048, 4.2],
    [-0.680, -0.008, 0.255, 0.072, 4.5],
    [-0.480, -0.002, 0.285, 0.090, 4.8],
    [-0.240, 0.002, 0.292, 0.095, 4.8],
    [0.040, 0.002, 0.285, 0.090, 4.5],
    [0.280, -0.005, 0.265, 0.075, 4.0],
    [0.480, -0.015, 0.225, 0.058, 3.6],
    [0.640, -0.025, 0.170, 0.040, 3.2],
    [0.720, -0.032, 0.110, 0.025, 2.8]
  ],
  narrow: 0.95,
  glassZ: [0.160, -0.300], glassH: 0.072, glassY: 0.035,
  roof: { z: -0.060, hw: 0.210, hl: 0.150 },
  arch: { r: 0.218, span: 1.42, thick: 0.035, wide: 0.110 },
  creases: [{ t: 0.42, k: 0.050, w: 0.13 }, { t: PI - 0.42, k: 0.050, w: 0.13 }],
  seams: [0.520, 0.220, -0.180, -0.540],
  stripes: [{ c: 0.000, w: 0.038, z0: -0.650, z1: 0.680, seg: 5 }],
  flank: { y0: -0.032, y1: 0.008, z0: -0.580, z1: 0.580 },
  mirrors: { z: 0.200 },
  wing: { z: -0.680, hw: 0.380, y: 0.180, thick: 0.012, chord: 0.100 },
  splitter: { z: 0.710, hw: 0.330, y: -0.058, thick: 0.011, chord: 0.080 },
  exhaust: { z: -0.710, x: 0.120, y: -0.008, r: 0.035 }
};

var BODIES = [OCTANE, DOMINUS, FENNEC, TAKUMI, BREAKOUT, MANTIS, MERC, BATCAR, VANGUARD, NOCTURNE, BRAWLER, PALADIN, BREAKER, RALLYHAWK, ZEPHYR, CENTAUR, HORNET, DRAGLINE, AEROWING, VOLTAIC, VORTEX, STRIKER, TITAN, RAPTOR, PHANTOM, MONSTER, KART, DRAGSTER, HYPER, COACH, SUV, HOTROD, LIMO];

/* ------------------------------------------------------------------ *
 * body assembly
 * ------------------------------------------------------------------ */

function buildBody(def, anchor) {
  var body = new Builder();
  var accent = new Builder();
  var glass = new Builder();
  var lights = new Builder();
  var headlights = new Builder();
  var taillights = new Builder();
  var thruster = new Builder();
  // A second paint slot. The accent slot is fixed charcoal, so a bright racing
  // stripe needs its own mesh; `drawVehicle` renders this one off-white.
  var trim = new Builder();

  /* --- 1. the lofted painted shell ---
   * `narrow` squeezes the shell inboard of the fenders. Without it the body is
   * so wide that the arches are swallowed and the car reads as one smooth blob;
   * with it the fenders stand proud the way they do on the reference car.
   * `seams` then cuts the panel shut lines into the same loft. */
  var st = def.stations;
  if (def.narrow && def.narrow !== 1) {
    st = [];
    for (var si = 0; si < def.stations.length; si++) {
      var so = def.stations[si];
      st.push([so[0], so[1], so[2] * def.narrow, so[3], so[4]]);
    }
  }
  // Keep the pre-groove table: the dark panel-line bands below have to be
  // measured against the undented shell, or they inherit the groove's inset and
  // sink out of sight.
  var stPanel = st;
  st = withSeams(st, def.seams);
  var creases = def.creases;
  shellZ(body, st, 26, 2.0, creases);

  /* --- 1a. dark shut lines sitting inside those grooves --- */
  seamLines(accent, stPanel, def.seams, 26);

  /* --- 1b. dark sill wrapped around the bottom of the shell --- */
  sillZ(accent, st, 0.66, 0.072);

  /* --- 2. fender arches over each wheel --- */
  var hideFlaps = !!(CFG.vehicle && CFG.vehicle.hideWheelFlaps);
  if (def.arch && !hideFlaps) {
    var A = def.arch;
    var flapScale = (CFG.vehicle && CFG.vehicle.flapScale !== undefined) ? CFG.vehicle.flapScale : 1.0;
    var flapOffsetY = (CFG.vehicle && CFG.vehicle.flapOffsetY !== undefined) ? CFG.vehicle.flapOffsetY : 0.0;
    var flapWidthScale = (CFG.vehicle && CFG.vehicle.flapWidthScale !== undefined) ? CFG.vehicle.flapWidthScale : 1.0;
    var flapThickScale = (CFG.vehicle && CFG.vehicle.flapThickScale !== undefined) ? CFG.vehicle.flapThickScale : 1.0;
    var archR = A.r * flapScale;
    var archThick = A.thick * flapScale * flapThickScale;
    var archWide = A.wide * flapScale * flapWidthScale;
    var archY = anchor.y + flapOffsetY;

    // pulled inboard of the axle so the fender bridges the shell and the tyre
    var ax = def.archX !== undefined ? def.archX : (anchor.x - 0.025);
    for (var s = 0; s < 4; s++) {
      var sx = (s % 2) ? 1 : -1;
      var sz = (s < 2) ? 1 : -1;
      arch(body, sx * ax, sz * anchor.z, archY, archR, A.span, archThick, archWide, 14);
      // dark lip capping the arch's outer edge — reads as a fender flare
      arch(accent, sx * ax, sz * anchor.z, archY,
        archR + archThick * 0.62, A.span, archThick * 0.34, archWide * 1.10, 14);
    }
  }

  /* --- 3. glazed canopy, lofted so it reads as glass rather than a slab --- */
  var gz0 = def.glassZ[0], gz1 = def.glassZ[1];
  var glassStations = [];
  var gsteps = 6;
  var gw = def.narrow || 1;
  // `glassY` lets the tall bodies lift the greenhouse clear of the shell; on a
  // van the default height would bury the windows inside the bodywork.
  var gy = def.glassY !== undefined ? def.glassY : 0.098;
  for (var gi = 0; gi <= gsteps; gi++) {
    var t = gi / gsteps;
    var z = gz1 + (gz0 - gz1) * t;
    // widest over the cabin, tapering to the windscreen and rear screen
    var bulge = Math.sin(Math.pow(t, 0.85) * PI);
    var hw = (0.118 + 0.074 * bulge) * gw;
    var hh = def.glassH * (0.55 + 0.45 * bulge);
    var cy = gy + hh * 0.35;
    glassStations.push([z, cy, hw, hh, 3.0]);
  }
  shellZ(glass, glassStations, 18, 1.0);

  /* --- 4. painted roof / engine cover panel ---
   * The roof height is DERIVED from the canopy, not hand-typed. `glassTop` is
   * the canopy's highest point (centre + half-height at its widest ring), and
   * the roof is dropped 4mm into it. Typing the height by hand is how dark glass
   * ends up poking through the roof on the taller bodies. */
  var glassTop = gy + def.glassH * 1.35;
  var roofY = glassTop - 0.004;
  if (def.roof) {
    var R = def.roof;
    shellZ(body, [
      [R.z - R.hl, roofY - 0.020, R.hw * 0.72 * gw, 0.020, 3.4],
      [R.z - R.hl * 0.45, roofY, R.hw * gw, 0.026, 3.8],
      [R.z + R.hl * 0.45, roofY, R.hw * gw, 0.026, 3.8],
      [R.z + R.hl, roofY - 0.024, R.hw * 0.70 * gw, 0.018, 3.4]
    ], 18, 1.0);
  }

  /* --- 5. roof scoop / airbox --- */
  if (def.scoop) {
    var S = def.scoop;
    // sits on the roof, so it inherits the derived roof height
    var sy = roofY + 0.018;
    shellZ(accent, [
      [S.z - S.hl, sy - 0.012, S.hw * 0.80, 0.016, 3.4],
      [S.z - S.hl * 0.3, sy, S.hw, 0.024, 3.8],
      [S.z + S.hl, sy - 0.026, S.hw * 0.62, 0.020, 3.0]
    ], 14, 1.0);
  }

  /* --- 6. front splitter --- */
  if (def.splitter) {
    var SP = def.splitter;
    shellZ(accent, [
      [SP.z - SP.chord, SP.y + 0.010, SP.hw * 0.90, 0.008, 3.0],
      [SP.z - SP.chord * 0.25, SP.y, SP.hw, 0.011, 3.6],
      [SP.z + SP.chord * 0.30, SP.y + 0.008, SP.hw * 0.78, 0.008, 3.0]
    ], 14, 1.0);
  }

  /* --- 7. rear wing: aerofoil + endplates + pylons --- */
  if (def.wing) {
    var WG = def.wing;
    var wingStations = [];
    var wsteps = 5;
    for (var wi = 0; wi <= wsteps; wi++) {
      var wt = wi / wsteps;
      var wz = WG.z - WG.chord * 0.5 + WG.chord * wt;
      // cambered section: thicker in the middle, thin trailing edge
      var th = WG.thick * (0.45 + 0.55 * Math.sin(wt * PI));
      var wy = WG.y + (wt - 0.5) * WG.chord * 0.22;
      wingStations.push([wz, wy, WG.hw, th, 3.2]);
    }
    // the wing is a spanwise loft, so build it along X instead of Z
    // NOTE: this local must NOT be called `st` — `var` is function-scoped, so it
    // would silently clobber buildBody's narrowed station table and every later
    // section (stripes, louvres, mirrors) would read wing sections instead.
    var wingRings = [];
    for (var ws = 0; ws < wingStations.length; ws++) {
      var wsec = wingStations[ws];
      var rr = [];
      for (var k = 0; k < 16; k++) {
        var a = k / 16 * TAU;
        var ct = Math.cos(a), stn = Math.sin(a);
        var e = 2 / 3.2;
        rr.push({
          x: (ct < 0 ? -1 : 1) * Math.pow(Math.abs(ct), e) * wsec[2],
          y: wsec[1] + (stn < 0 ? -1 : 1) * Math.pow(Math.abs(stn), e) * wsec[3],
          z: wsec[0]
        });
      }
      wingRings.push(rr);
    }
    // rebuild as an X-span loft: swap so the loft runs along the span
    var fw = body.n;
    var spanRings = [];
    for (var sr = 0; sr < 2; sr++) {
      var xs = sr ? WG.hw : -WG.hw;
      var rr2 = [];
      for (var k2 = 0; k2 < wingStations.length; k2++) {
        var s2 = wingStations[k2];
        rr2.push({ x: xs, y: s2[1], z: s2[0] });
      }
      // close the section with a mirrored return pass
      for (var k3 = wingStations.length - 1; k3 >= 0; k3--) {
        var s3 = wingStations[k3];
        rr2.push({ x: xs, y: s3[1] - s3[3] * 2, z: s3[0] });
      }
      spanRings.push(rr2);
    }
    var n2 = spanRings[0].length;
    for (var r4 = 0; r4 < 2; r4++) {
      for (var k4 = 0; k4 < n2; k4++) {
        var p4 = spanRings[r4][k4];
        body.vert(p4.x, p4.y, p4.z, 0, 1, 0, k4 / n2, r4);
      }
    }
    for (var k5 = 0; k5 < n2 - 1; k5++) {
      body.quad(fw + k5, fw + k5 + 1, fw + n2 + k5 + 1, fw + n2 + k5);
    }
    smoothNormals(body, fw);

    // endplates
    for (var ep = 0; ep < 2; ep++) {
      var ex = ep ? WG.hw - 0.010 : -WG.hw + 0.010;
      accent.box(0.010, 0.062, WG.chord * 0.62, new V3(ex, WG.y - 0.010, WG.z), null, 1.0);
    }
    // pylons
    for (var py = 0; py < 2; py++) {
      var px = py ? 0.135 : -0.135;
      accent.box(0.014, 0.085, 0.020, new V3(px, WG.y - 0.098, WG.z + 0.010), new Quat().fromAxisAngle(1, 0, 0, 0.22), 1.0);
    }
    void wingRings;
  }

  /* --- 8. open-wheel front wing --- */
  if (def.frontWing) {
    var FWZ = 0.700;
    for (var fwp = 0; fwp < 2; fwp++) {
      var fx = fwp ? 1 : -1;
      // multi-element wing planes
      for (var el = 0; el < 3; el++) {
        var ez = FWZ - el * 0.052;
        var ey = -0.062 + el * 0.020;
        accent.box(0.245, 0.009, 0.036, new V3(0, ey, ez), null, 1.0);
      }
      // endplate
      accent.box(0.012, 0.070, 0.105, new V3(fx * 0.245, -0.038, FWZ - 0.055), null, 1.0);
    }
    // nose cone connector
    accent.box(0.030, 0.022, 0.090, new V3(0, -0.030, FWZ - 0.115), null, 1.0);
  }

  /* --- 9. sidepods for the open-wheeler --- */
  if (def.sidepods) {
    for (var sp = 0; sp < 2; sp++) {
      var spx = sp ? 1 : -1;
      shellZ(body, [
        [-0.300, 0.020, 0.085, 0.045, 3.4],
        [-0.180, 0.028, 0.135, 0.062, 3.8],
        [0.020, 0.030, 0.140, 0.065, 3.8],
        [0.200, 0.024, 0.115, 0.050, 3.6],
        [0.300, 0.016, 0.070, 0.032, 3.0]
      ], 16, 1.0);
    }
  }

  /* --- 10. halo --- */
  if (def.halo) {
    accent.tube(new V3(-0.115, 0.115, 0.130), new V3(0, 0.190, 0.010), 0.017, 8);
    accent.tube(new V3(0.115, 0.115, 0.130), new V3(0, 0.190, 0.010), 0.017, 8);
    accent.tube(new V3(-0.115, 0.115, 0.130), new V3(0.115, 0.115, 0.130), 0.015, 8);
  }

  /* --- 11. roll cage (visible through the glass) --- */
  if (def.arch) {
    var cz0 = def.glassZ[1], cz1 = def.glassZ[0];
    accent.tube(new V3(-0.150, 0.055, cz0), new V3(-0.150, 0.150, cz1 + 0.06), 0.013, 7);
    accent.tube(new V3(0.150, 0.055, cz0), new V3(0.150, 0.150, cz1 + 0.06), 0.013, 7);
    accent.tube(new V3(-0.150, 0.150, cz1 + 0.06), new V3(0.150, 0.150, cz1 + 0.06), 0.012, 7);
    accent.tube(new V3(-0.150, 0.150, cz1 + 0.06), new V3(-0.185, 0.075, cz1 - 0.14), 0.013, 7);
    accent.tube(new V3(0.150, 0.150, cz1 + 0.06), new V3(0.185, 0.075, cz1 - 0.14), 0.013, 7);
  }

  /* --- 12. side impact bars --- */
  if (def.arch) {
    for (var sb = 0; sb < 2; sb++) {
      var sbx = sb ? 1 : -1;
      accent.tube(new V3(sbx * (anchor.x + 0.010), -0.048, 0.300), new V3(sbx * (anchor.x + 0.010), -0.048, -0.260), 0.015, 7);
    }
  }

  /* --- 13. exhausts --- */
  if (def.exhaust) {
    var E = def.exhaust;
    var exs = def.quad ? [-1.55, -0.55, 0.55, 1.55] : [-1, 1];
    for (var ei = 0; ei < exs.length; ei++) {
      accent.cylinder(E.r, E.r * 0.88, 0.10, 12, new V3(E.x * exs[ei], E.y, E.z), new Quat().fromAxisAngle(1, 0, 0, PI * 0.5), true, false);
      thruster.cylinder(E.r * 0.62, E.r * 0.20, 0.075, 10, new V3(E.x * exs[ei], E.y, E.z - 0.045), new Quat().fromAxisAngle(1, 0, 0, PI * 0.5), true, true);
    }
  }

  /* --- 14. headlights --- */
  var frontZ = def.stations[def.stations.length - 1][0] - 0.055;
  var rearZ = def.stations[0][0] + 0.055;
  for (var li = 0; li < 2; li++) {
    var lx = li ? 1 : -1;
    // Front Projector Headlights & LED DRL Eyebrows
    headlights.box(0.056, 0.018, 0.022, new V3(lx * 0.155, 0.032, frontZ), new Quat().fromAxisAngle(1, 0, 0, -0.20), 1.0);
    headlights.box(0.042, 0.008, 0.016, new V3(lx * 0.165, 0.044, frontZ - 0.008), new Quat().fromAxisAngle(1, 0, 0, -0.20), 1.0);

    // Combined lights (front only)
    lights.box(0.052, 0.015, 0.020, new V3(lx * 0.155, 0.030, frontZ), new Quat().fromAxisAngle(1, 0, 0, -0.20), 1.0);
  }

  if (def.lightBar) {
    var LB = def.lightBar;
    // rides on top of the roof, wherever the derivation put it
    var lby = LB.y !== undefined ? LB.y : roofY + 0.030;
    // a dark housing sitting on the roof, with the lamps set into its front face
    accent.box(0.205, 0.021, 0.030, new V3(0, lby, LB.z), null, 1.0);
    for (var lb = 0; lb < 4; lb++) {
      headlights.box(0.036, 0.015, 0.009, new V3(-0.150 + lb * 0.100, lby + 0.002, LB.z + 0.035), null, 1.0);
      lights.box(0.036, 0.015, 0.009, new V3(-0.150 + lb * 0.100, lby + 0.002, LB.z + 0.035), null, 1.0);
    }
  }

  /* --- 14b. open cargo bed, for the trucks --- */
  if (def.bed) {
    var BD = def.bed;
    var bz0 = BD.z0, bz1 = BD.z1;
    // ribbed floor
    shellZ(accent, [
      [bz0, BD.y, BD.hw * 0.97, 0.014, 5.0],
      [bz1, BD.y, BD.hw * 0.97, 0.014, 5.0]
    ], 14, 1.0);
    for (var bw = 0; bw < 2; bw++) {
      var bwx = bw ? 1 : -1;
      // side wall
      body.box(BD.wallT, BD.wallH * 0.5, (bz1 - bz0) * 0.5,
        new V3(bwx * BD.hw, BD.y + BD.wallH * 0.5, (bz0 + bz1) * 0.5), null, 1.0);
      // top rail, so the wall does not end in a raw edge
      accent.box(BD.wallT * 1.3, 0.010, (bz1 - bz0) * 0.5,
        new V3(bwx * BD.hw, BD.y + BD.wallH + 0.010, (bz0 + bz1) * 0.5), null, 1.0);
    }
    // tailgate
    body.box(BD.hw, BD.wallH * 0.5, BD.wallT,
      new V3(0, BD.y + BD.wallH * 0.5, bz0 - BD.wallT), null, 1.0);
    // two spare-wheel style fuel cans, purely for silhouette interest
    for (var fc = 0; fc < 2; fc++) {
      accent.box(0.045, BD.wallH * 0.32, 0.030,
        new V3((fc ? 1 : -1) * (BD.hw - 0.075), BD.y + BD.wallH * 0.62, bz1 - 0.09), null, 1.0);
    }
  }

  /* --- 14c. snow plow (MONSTER) --- */
  if (def.plow) {
    var P = def.plow;
    accent.box(P.x, P.h, P.d, new V3(0, P.y, P.z), null, 1.0);
  }

  /* --- 14d. roof rack (COACH, SUV) --- */
  if (def.rack) {
    var RK = def.rack;
    var rky = roofY + 0.010;
    accent.box(RK.hw, 0.010, RK.hl, new V3(0, rky, RK.z), null, 1.0);
    var bars = RK.bars || 3;
    for (var b = 0; b < bars; b++) {
      var bz = RK.z - RK.hl + (RK.hl * 2) * (b / (bars - 1));
      accent.box(RK.hw, 0.008, 0.008, new V3(0, rky + 0.008, bz), null, 1.0);
    }
  }

  /* --- 14e. exhaust stack (DRAGSTER, HOTROD) --- */
  if (def.stack) {
    var ST = def.stack;
    for (var s = 0; s < 2; s++) {
      var sx = s ? 1 : -1;
      accent.cylinder(ST.r, ST.r, ST.h, 8, new V3(ST.x * sx, ST.y, ST.z), new Quat().fromAxisAngle(1, 0, 0, -0.15), true, true);
    }
  }

  /* --- 14f. exposed engine (DRAGSTER, HOTROD, KART) --- */
  if (def.engine) {
    var EG = def.engine;
    accent.box(EG.hw, EG.hh, EG.hl, new V3(0, EG.y, EG.z), null, 1.0);
  }

  /* --- 15. brake calipers: static, so they belong on the body, not the wheel --- */
  for (var ci = 0; ci < 4; ci++) {
    var cx = (ci % 2) ? 1 : -1;
    var cz = (ci < 2) ? 1 : -1;
    accent.box(0.026, 0.070, 0.048,
      new V3(cx * anchor.x, anchor.y + 0.030, cz * anchor.z - 0.075), null, 1.0);
  }

  /* --- 16. livery: racing stripes lying on the crown --- */
  if (def.stripes) {
    for (var sb = 0; sb < def.stripes.length; sb++) {
      var S = def.stripes[sb];
      var target = S.dark ? accent : trim;
      var offs = S.c !== undefined ? [-S.c, S.c] : [0];
      for (var oi = 0; oi < offs.length; oi++) {
        crownBand(target, st, {
          x0: offs[oi] - S.w, x1: offs[oi] + S.w,
          z0: S.z0, z1: S.z1,
          lift: S.lift
        }, S.seg);
      }
    }
  }

  /* --- 17. a flank stripe, to break up the big flat side --- */
  if (def.flank) {
    var FL = def.flank;
    var target2 = FL.dark ? accent : trim;
    for (var fs = 0; fs < 2; fs++) {
      flankBand(target2, st, {
        y0: FL.y0, y1: FL.y1, z0: FL.z0, z1: FL.z1,
        lift: FL.lift, side: fs ? 1 : -1
      }, FL.seg);
    }
  }

  /* --- 18. hood louvres --- */
  if (def.louvres) {
    for (var lv = 0; lv < def.louvres.length; lv++) {
      var LV = def.louvres[lv];
      var offs2 = LV.c !== undefined ? [-LV.c, LV.c] : [0];
      for (var o2 = 0; o2 < offs2.length; o2++) {
        louvres(accent, stPanel, {
          x: offs2[o2], z0: LV.z0, z1: LV.z1, count: LV.count,
          halfW: LV.halfW, halfL: LV.halfL, lift: LV.lift,
          taper: LV.taper
        });
      }
    }
  }

  /* --- 19. door mirrors. A car with no mirrors reads as a toy. --- */
  if (def.mirrors) {
    var MZ = def.mirrors.z;
    var mst = stationAt(st, MZ);
    if (mst) {
      var mhx = mst[2];
      var mhy = mst[1] + mst[3] * (def.mirrors.h !== undefined ? def.mirrors.h : 0.30);
      for (var mi = 0; mi < 2; mi++) {
        var mmx = (mi ? 1 : -1) * mhx;
        var outX = mmx * 1.16;
        accent.tube(new V3(mmx * 0.96, mhy, MZ), new V3(outX, mhy + 0.040, MZ + 0.010), 0.007, 6);
        accent.box(0.024, 0.014, 0.011, new V3(outX, mhy + 0.046, MZ + 0.012), null, 1.0);
      }
    }
  }

  return {
    id: def.id,
    name: def.name,
    sub: def.sub,
    body: body,
    accent: accent,
    glass: glass,
    lights: lights,
    headlights: headlights,
    taillights: taillights,
    thruster: thruster,
    trim: trim,
    frontZ: frontZ,
    rearZ: rearZ
  };
}

/* ------------------------------------------------------------------ *
 * wheel designs
 * ------------------------------------------------------------------ */

/* Every rim shares this skeleton. `dish` is how far inboard the spokes sit
 * (measured in wheel radii from the wheel's centre plane), `lip` is where the
 * polished outer ring sits, and `dishSweep` is how much a spoke leans outward
 * on its way to the rim. */
var WHEEL_DEFAULTS = {
  shoulder: 0.80, rimR: 0.70, spokes: 5, spokeLen: 0.62, spokeMid: 0.68,
  bladeW: 0.060, bladeT: 0.028, dish: 0.225, lip: 0.300, dishSweep: 0.030,
  spokePhase: 0, grooves: 3, lugs: 0, cover: false, slots: 5
};

/** Merge a design over the defaults, so no design has to restate the basics
 *  (and a missing key can never become a NaN vertex). */
function wdef(style) {
  var out = {};
  for (var k in WHEEL_DEFAULTS) out[k] = WHEEL_DEFAULTS[k];
  for (var k2 in style) out[k2] = style[k2];
  return out;
}

var WHEELS = [
  { id: 'SPORT', name: 'Sport 5', sub: 'پنجپره اسپرت', spokes: 5, spokeLen: 0.60, spokeMid: 0.66, bladeW: 0.062, bladeT: 0.026, dish: 0.215, dishSweep: 0.050, rimR: 0.70, shoulder: 0.80, grooves: 3 },
  { id: 'VORTEX', name: 'Vortex Twist', sub: 'ورتکس ۶ پره', spokes: 6, spokeLen: 0.64, spokeMid: 0.68, bladeW: 0.045, bladeT: 0.022, dish: 0.200, dishSweep: 0.060, rimR: 0.71, shoulder: 0.81, grooves: 4 },
  { id: 'TURBINE', name: 'Turbina Jet', sub: 'توربینی جت', spokes: 12, spokeLen: 0.58, spokeMid: 0.68, bladeW: 0.028, bladeT: 0.020, dish: 0.230, dishSweep: 0.030, rimR: 0.70, shoulder: 0.82, grooves: 4 },
  { id: 'MESH', name: 'Mesh Lock', sub: 'مش قفلدار', spokes: 10, spokeLen: 0.62, spokeMid: 0.66, bladeW: 0.034, bladeT: 0.024, dish: 0.200, dishSweep: 0.040, rimR: 0.71, shoulder: 0.79, grooves: 3, lugs: 6 },
  { id: 'OFFROAD', name: 'Offroad King', sub: 'آفرود', spokes: 6, spokeLen: 0.52, spokeMid: 0.66, bladeW: 0.088, bladeT: 0.042, dish: 0.190, dishSweep: 0.035, rimR: 0.58, shoulder: 0.86, grooves: 5 },
  { id: 'DISH', name: 'Deep Dish', sub: 'دیپ‌دیش', spokes: 5, spokeLen: 0.58, spokeMid: 0.64, bladeW: 0.058, bladeT: 0.024, dish: 0.150, dishSweep: 0.090, lip: 0.305, rimR: 0.72, shoulder: 0.78, grooves: 3 },
  { id: 'AERO', name: 'Aero Cover', sub: 'کاور آیرو', spokes: 0, cover: true, slots: 5, dish: 0.270, dishSweep: 0, lip: 0.300, rimR: 0.72, shoulder: 0.80, grooves: 2 },
  { id: 'STEEL', name: 'Rally Steel', sub: 'استیل رالی', spokes: 8, spokeLen: 0.56, spokeMid: 0.64, bladeW: 0.028, bladeT: 0.036, dish: 0.285, dishSweep: 0.008, lip: 0.300, rimR: 0.62, shoulder: 0.84, grooves: 4 },
  { id: 'SPLIT_SIX', name: 'Split Six', sub: '۶ پره دوگانه', spokes: 12, spokeLen: 0.62, spokeMid: 0.66, bladeW: 0.025, bladeT: 0.022, dish: 0.210, dishSweep: 0.045, rimR: 0.71, shoulder: 0.80, grooves: 3 },
  { id: 'WISHBONE', name: 'Wishbone GT', sub: 'چنگالی Y', spokes: 10, spokeLen: 0.60, spokeMid: 0.65, bladeW: 0.030, bladeT: 0.024, dish: 0.200, dishSweep: 0.050, rimR: 0.72, shoulder: 0.79, grooves: 3 },
  { id: 'BLADERUNNER', name: 'Blade Runner', sub: 'تیغه‌ای', spokes: 5, spokeLen: 0.65, spokeMid: 0.70, bladeW: 0.070, bladeT: 0.018, dish: 0.180, dishSweep: 0.070, rimR: 0.73, shoulder: 0.77, grooves: 4 },
  { id: 'WEBLINE', name: 'Webline Pro', sub: 'تار عنکبوتی', spokes: 14, spokeLen: 0.58, spokeMid: 0.66, bladeW: 0.020, bladeT: 0.020, dish: 0.220, dishSweep: 0.035, rimR: 0.70, shoulder: 0.81, grooves: 3 },
  { id: 'WIREPIN', name: 'Wire Pin', sub: 'پره‌ای کلاسیک', spokes: 20, spokeLen: 0.55, spokeMid: 0.65, bladeW: 0.015, bladeT: 0.018, dish: 0.240, dishSweep: 0.025, rimR: 0.68, shoulder: 0.82, grooves: 4 },
  { id: 'FANBLADE', name: 'Fanblade Turbo', sub: 'پنکه‌ای ریسینگ', spokes: 8, spokeLen: 0.60, spokeMid: 0.68, bladeW: 0.050, bladeT: 0.022, dish: 0.190, dishSweep: 0.065, rimR: 0.71, shoulder: 0.80, grooves: 3 },
  { id: 'CROSSHAIR', name: 'Crosshair X', sub: '۴ پره متقاطع', spokes: 4, spokeLen: 0.62, spokeMid: 0.66, bladeW: 0.075, bladeT: 0.028, dish: 0.200, dishSweep: 0.055, rimR: 0.70, shoulder: 0.80, grooves: 3 },
  { id: 'HEXCORE', name: 'Hex Core', sub: 'شش‌ضلعی سایبر', spokes: 6, spokeLen: 0.58, spokeMid: 0.65, bladeW: 0.055, bladeT: 0.030, dish: 0.210, dishSweep: 0.040, rimR: 0.70, shoulder: 0.82, grooves: 4 },
  { id: 'SPIRALIS', name: 'Spiralis GT', sub: 'مارپیچ خورشیدی', spokes: 9, spokeLen: 0.61, spokeMid: 0.67, bladeW: 0.035, bladeT: 0.022, dish: 0.195, dishSweep: 0.060, rimR: 0.72, shoulder: 0.79, grooves: 3 },
  { id: 'MONOLITH', name: 'Monolith Solid', sub: 'یکپارچه عضلانی', spokes: 3, spokeLen: 0.55, spokeMid: 0.62, bladeW: 0.110, bladeT: 0.035, dish: 0.180, dishSweep: 0.050, rimR: 0.69, shoulder: 0.83, grooves: 5 },
  { id: 'GOLDLINE', name: 'Goldline VIP', sub: 'طلایی لوکس', spokes: 10, spokeLen: 0.60, spokeMid: 0.66, bladeW: 0.032, bladeT: 0.025, dish: 0.170, dishSweep: 0.075, rimR: 0.73, shoulder: 0.78, grooves: 3 },
  { id: 'OBSIDIAN', name: 'Obsidian Black', sub: 'مشکی فورج‌شده', spokes: 5, spokeLen: 0.62, spokeMid: 0.67, bladeW: 0.055, bladeT: 0.026, dish: 0.160, dishSweep: 0.080, rimR: 0.73, shoulder: 0.77, grooves: 3 },
  { id: 'CARBONITE', name: 'Carbonite Tech', sub: 'کربن سبک', spokes: 7, spokeLen: 0.63, spokeMid: 0.68, bladeW: 0.042, bladeT: 0.020, dish: 0.190, dishSweep: 0.055, rimR: 0.72, shoulder: 0.79, grooves: 3 },
  { id: 'TITANIX', name: 'Titanix Heavy', sub: 'تایتانیوم سخت', spokes: 6, spokeLen: 0.56, spokeMid: 0.64, bladeW: 0.072, bladeT: 0.038, dish: 0.200, dishSweep: 0.045, rimR: 0.68, shoulder: 0.84, grooves: 4 },
  { id: 'SLICKLINE', name: 'Slickline Zero', sub: 'اسلیک مسابقه‌ای', spokes: 5, spokeLen: 0.64, spokeMid: 0.68, bladeW: 0.048, bladeT: 0.022, dish: 0.220, dishSweep: 0.040, rimR: 0.72, shoulder: 0.78, grooves: 2 },
  { id: 'GRAVELKING', name: 'Gravel King', sub: 'رالی کویر', spokes: 8, spokeLen: 0.54, spokeMid: 0.62, bladeW: 0.052, bladeT: 0.035, dish: 0.210, dishSweep: 0.030, rimR: 0.64, shoulder: 0.85, grooves: 5 },
  { id: 'VGRIP', name: 'V-Grip Spec', sub: 'چسبندگی V', spokes: 10, spokeLen: 0.59, spokeMid: 0.66, bladeW: 0.030, bladeT: 0.025, dish: 0.200, dishSweep: 0.050, rimR: 0.71, shoulder: 0.80, grooves: 4 },
  { id: 'DRIFTLINE', name: 'Drift Line', sub: 'دریفت ژاپنی', spokes: 6, spokeLen: 0.62, spokeMid: 0.67, bladeW: 0.050, bladeT: 0.024, dish: 0.150, dishSweep: 0.085, rimR: 0.73, shoulder: 0.78, grooves: 3 },
  { id: 'NEON_HALO', name: 'Neon Halo', sub: 'نوارهای نئونی', spokes: 5, spokeLen: 0.60, spokeMid: 0.66, bladeW: 0.045, bladeT: 0.022, dish: 0.210, dishSweep: 0.050, rimR: 0.72, shoulder: 0.79, grooves: 3 },
  { id: 'EMBER_SPAG', name: 'Ember Spark', sub: 'شراره آتشین', spokes: 8, spokeLen: 0.61, spokeMid: 0.67, bladeW: 0.038, bladeT: 0.022, dish: 0.190, dishSweep: 0.060, rimR: 0.72, shoulder: 0.79, grooves: 3 },
  { id: 'PLASMA_RING', name: 'Plasma Ring', sub: 'حلقه پلاسما', spokes: 0, cover: true, slots: 6, dish: 0.250, dishSweep: 0, lip: 0.290, rimR: 0.73, shoulder: 0.78, grooves: 2 },
  { id: 'CHRONOS', name: 'Chronos Gear', sub: 'چرخدنده‌ای', spokes: 12, spokeLen: 0.56, spokeMid: 0.65, bladeW: 0.028, bladeT: 0.030, dish: 0.220, dishSweep: 0.035, rimR: 0.69, shoulder: 0.82, grooves: 4 },
  { id: 'GYROLOOP', name: 'Gyro Loop', sub: 'ژیروسکوپی', spokes: 6, spokeLen: 0.63, spokeMid: 0.68, bladeW: 0.042, bladeT: 0.020, dish: 0.180, dishSweep: 0.065, rimR: 0.72, shoulder: 0.79, grooves: 3 },
  { id: 'VOIDSTAR', name: 'Void Star', sub: 'ستاره سیاه', spokes: 5, spokeLen: 0.64, spokeMid: 0.69, bladeW: 0.055, bladeT: 0.020, dish: 0.150, dishSweep: 0.090, rimR: 0.74, shoulder: 0.76, grooves: 3 },
  { id: 'PULSAR', name: 'Pulsar Beam', sub: 'پلسار نوری', spokes: 10, spokeLen: 0.60, spokeMid: 0.66, bladeW: 0.028, bladeT: 0.022, dish: 0.200, dishSweep: 0.050, rimR: 0.71, shoulder: 0.80, grooves: 3 },
  { id: 'TURBOFAN', name: 'Turbofan Pro', sub: 'توربوفن خنک‌کننده', spokes: 15, spokeLen: 0.57, spokeMid: 0.66, bladeW: 0.022, bladeT: 0.020, dish: 0.240, dishSweep: 0.025, rimR: 0.70, shoulder: 0.81, grooves: 4 },
  { id: 'CYCLONE_X', name: 'Cyclone X', sub: 'سایکلون ۴ پره', spokes: 4, spokeLen: 0.62, spokeMid: 0.68, bladeW: 0.080, bladeT: 0.025, dish: 0.190, dishSweep: 0.060, rimR: 0.71, shoulder: 0.80, grooves: 3 },
  { id: 'STARLANCE', name: 'Starlance GT', sub: 'نیزه‌ای', spokes: 5, spokeLen: 0.65, spokeMid: 0.70, bladeW: 0.048, bladeT: 0.020, dish: 0.160, dishSweep: 0.080, rimR: 0.73, shoulder: 0.77, grooves: 3 },
  { id: 'NEBULA', name: 'Nebula Glow', sub: 'کهکشانی', spokes: 8, spokeLen: 0.60, spokeMid: 0.66, bladeW: 0.036, bladeT: 0.022, dish: 0.200, dishSweep: 0.055, rimR: 0.72, shoulder: 0.79, grooves: 3 },
  { id: 'FROSTBITE', name: 'Frostbite Diamond', sub: 'الماسی یخ‌زده', spokes: 10, spokeLen: 0.61, spokeMid: 0.67, bladeW: 0.030, bladeT: 0.024, dish: 0.180, dishSweep: 0.065, rimR: 0.72, shoulder: 0.78, grooves: 3 },
  { id: 'HELIXON', name: 'Helixon DNA', sub: 'مارپیچ دوگانه', spokes: 12, spokeLen: 0.59, spokeMid: 0.66, bladeW: 0.025, bladeT: 0.022, dish: 0.210, dishSweep: 0.045, rimR: 0.71, shoulder: 0.80, grooves: 3 },
  { id: 'VERTEX_R', name: 'Vertex Spec R', sub: 'مسابقه‌ای حرفه‌ای', spokes: 6, spokeLen: 0.63, spokeMid: 0.68, bladeW: 0.052, bladeT: 0.024, dish: 0.170, dishSweep: 0.070, rimR: 0.73, shoulder: 0.77, grooves: 3 },
  { id: 'QUANTUM', name: 'Quantum Core', sub: 'کوانتومی آینده‌نگر', spokes: 6, spokeLen: 0.60, spokeMid: 0.66, bladeW: 0.045, bladeT: 0.025, dish: 0.200, dishSweep: 0.050, rimR: 0.71, shoulder: 0.80, grooves: 3 },
  { id: 'ZENITH', name: 'Zenith Prime', sub: 'زنیت پرچمدار', spokes: 5, spokeLen: 0.64, spokeMid: 0.69, bladeW: 0.050, bladeT: 0.022, dish: 0.160, dishSweep: 0.080, rimR: 0.74, shoulder: 0.76, grooves: 3 }
];

export function buildCosmeticItem(B, item) {
  var id = item ? item.id : '';
  var cat = item ? item.category : '';
  var p = new V3(), q = new Quat();

  if (cat === 'horns' || id.indexOf('HORN') !== -1 || id.indexOf('SPIKE') !== -1 || id.indexOf('CREST') !== -1 || id.indexOf('BOLT') !== -1) {
    // HORNS & HOOD SPIKES (Positioned on front hood / roof edge)
    var hy = 0.16, hz = 0.38;
    if (id === 'CLASSIC_HORN' || id === 'DEVIL_HORNS') {
      // Twin curved horns
      for (var s = -1; s <= 1; s += 2) {
        q.fromAxisAngle(0, 0, 1, s * 0.25);
        p.set(s * 0.18, hy, hz);
        B.cylinder(0.045, 0.005, 0.22, 10, p, q);
      }
    } else if (id === 'SPIKE_HORN' || id === 'ICE_SPIKE' || id === 'VOID_SPIKES') {
      // Blade / Spike standing tall
      p.set(0, hy + 0.12, hz);
      q.fromAxisAngle(1, 0, 0, -0.2);
      B.cylinder(0.065, 0.005, 0.32, 8, p, q);
      if (id === 'VOID_SPIKES') {
        for (var v = -1; v <= 1; v += 2) {
          p.set(v * 0.12, hy + 0.08, hz - 0.08);
          B.cylinder(0.045, 0.005, 0.22, 8, p, q);
        }
      }
    } else if (id === 'SPIRAL_HORN' || id === 'UNICORN_HORN') {
      // Single tall horn in center
      p.set(0, hy + 0.15, hz);
      q.fromAxisAngle(1, 0, 0, -0.3);
      B.cylinder(0.055, 0.005, 0.38, 12, p, q);
    } else if (id === 'LIGHTNING_BOLT') {
      p.set(0, hy + 0.18, hz);
      q.fromAxisAngle(0, 1, 0, 0);
      B.lightningBolt(0.22, 0.05, p, q);
    } else if (id === 'CROWN' || id === 'LEAF_CROWN') {
      // Ring crest
      p.set(0, hy + 0.08, hz);
      B.cylinder(0.16, 0.18, 0.12, 12, p, null, false, false);
      for (var k = 0; k < 6; k++) {
        var a = k / 6 * TAU;
        p.set(Math.cos(a) * 0.16, hy + 0.18, hz + Math.sin(a) * 0.16);
        B.cylinder(0.025, 0.002, 0.08, 6, p);
      }
    } else {
      // Default Horn / Spikes
      for (var d = -1; d <= 1; d += 2) {
        p.set(d * 0.16, hy + 0.10, hz);
        q.fromAxisAngle(1, 0, 0, -0.2);
        B.cylinder(0.05, 0.005, 0.25, 8, p, q);
      }
    }
  } else if (cat === 'hats' || id.indexOf('HAT') !== -1 || id.indexOf('HELM') !== -1 || id.indexOf('CAP') !== -1 || id.indexOf('CROWN') !== -1 || id.indexOf('HALO') !== -1 || id.indexOf('BALLS') !== -1) {
    // HATS & TOPPERS (Positioned on roof)
    var ry = 0.30, rz = 0.02;
    if (id === 'TOP_HAT' || id === 'BOWLER_HAT' || id === 'CHEF_HAT') {
      // Brim + Crown Cylinder
      p.set(0, ry, rz);
      q.fromAxisAngle(1, 0, 0, Math.PI / 2);
      B.cylinder(0.32, 0.32, 0.02, 16, p, q); // Brim
      var hH = id === 'TOP_HAT' ? 0.35 : (id === 'CHEF_HAT' ? 0.42 : 0.22);
      p.set(0, ry + hH * 0.5, rz);
      B.cylinder(0.22, id === 'BOWLER_HAT' ? 0.18 : 0.22, hH, 16, p, q); // Crown
    } else if (id === 'VIKING_HELM') {
      // Helmet dome + twin horns
      p.set(0, ry + 0.12, rz);
      q.fromAxisAngle(1, 0, 0, Math.PI / 2);
      B.cylinder(0.24, 0.12, 0.24, 16, p, q);
      for (var v2 = -1; v2 <= 1; v2 += 2) {
        var hq = new Quat().fromAxisAngle(0, 0, 1, v2 * 0.6);
        p.set(v2 * 0.22, ry + 0.22, rz);
        B.cylinder(0.05, 0.005, 0.28, 8, p, hq);
      }
    } else if (id === 'ROYAL_CROWN') {
      p.set(0, ry + 0.08, rz);
      q.fromAxisAngle(1, 0, 0, Math.PI / 2);
      B.cylinder(0.26, 0.28, 0.16, 16, p, q, false, false);
      for (var c2 = 0; c2 < 8; c2++) {
        var ca = c2 / 8 * TAU;
        p.set(Math.cos(ca) * 0.27, ry + 0.20, rz + Math.sin(ca) * 0.27);
        B.cylinder(0.03, 0.005, 0.10, 6, p, q);
      }
    } else if (id === 'HALO') {
      // Floating ring
      p.set(0, ry + 0.25, rz);
      q.fromAxisAngle(1, 0, 0, Math.PI / 2);
      B.cylinder(0.28, 0.28, 0.04, 20, p, q, false, false);
    } else if (id === 'ANTENNA_BALLS') {
      for (var ab = -1; ab <= 1; ab += 2) {
        p.set(ab * 0.15, ry + 0.20, rz);
        B.cylinder(0.012, 0.012, 0.40, 6, p, null); // stem
        p.set(ab * 0.15, ry + 0.42, rz);
        B.cylinder(0.07, 0.07, 0.14, 10, p, null); // ball
      }
    } else {
      // Default Hat / Beanie / Cap
      p.set(0, ry + 0.10, rz);
      q.fromAxisAngle(1, 0, 0, Math.PI / 2);
      B.cylinder(0.28, 0.28, 0.03, 16, p, q);
      p.set(0, ry + 0.20, rz);
      B.cylinder(0.22, 0.12, 0.20, 16, p, q);
    }
  } else if (cat === 'tools' || id.indexOf('WRENCH') !== -1 || id.indexOf('AXE') !== -1 || id.indexOf('SWORD') !== -1 || id.indexOf('HAMMER') !== -1 || id.indexOf('ROCKET') !== -1 || id.indexOf('SHIELD') !== -1 || id.indexOf('STAFF') !== -1 || id.indexOf('LANCE') !== -1 || id.indexOf('BLASTER') !== -1 || id.indexOf('GUITAR') !== -1) {
    // TOOLS & WEAPONS (Mounted on roof / side rack)
    var ty = 0.32, tz = -0.05;
    if (id === 'SWORD' || id === 'LANCE' || id === 'STAFF') {
      // Shaft / Blade
      p.set(0, ty + 0.12, tz);
      q.fromAxisAngle(1, 0, 0, -0.3);
      B.cylinder(0.025, 0.010, 0.85, 8, p, q);
      // Guard / Orb
      p.set(0, ty + 0.02, tz + 0.2);
      B.cylinder(0.08, 0.08, 0.04, 10, p, q);
    } else if (id === 'BATTLE_AXE' || id === 'SLEDGEHAMMER' || id === 'GIANT_WRENCH') {
      // Heavy tool / Axe head
      p.set(0, ty + 0.15, tz);
      q.fromAxisAngle(1, 0, 0, 0.2);
      B.cylinder(0.03, 0.03, 0.65, 8, p, q); // handle
      p.set(0, ty + 0.38, tz - 0.12);
      q.fromAxisAngle(0, 0, 1, Math.PI / 2);
      B.cylinder(0.12, 0.12, 0.32, 10, p, q); // head
    } else if (id === 'MINI_ROCKET' || id === 'BLASTER') {
      // Rocket body + nose cone
      p.set(0, ty + 0.12, tz);
      q.fromAxisAngle(1, 0, 0, -Math.PI / 2);
      B.cylinder(0.10, 0.10, 0.55, 12, p, q);
      p.set(0, ty + 0.12, tz + 0.35);
      B.cylinder(0.10, 0.01, 0.20, 12, p, q); // nose
    } else if (id === 'BATTLE_SHIELD') {
      p.set(0, ty + 0.18, tz);
      q.fromAxisAngle(0, 1, 0, Math.PI / 2);
      B.cylinder(0.28, 0.28, 0.04, 12, p, q);
    } else {
      // Default tool / guitar
      p.set(0, ty + 0.15, tz);
      q.fromAxisAngle(1, 0, 0, -0.2);
      B.cylinder(0.035, 0.020, 0.70, 8, p, q);
    }
  } else if (cat === 'wings' || id.indexOf('WING') !== -1 || id.indexOf('JET') !== -1 || id.indexOf('THRUST') !== -1 || id.indexOf('PACK') !== -1 || id.indexOf('SAIL') !== -1) {
    // WINGS & BOOSTERS (Mounted on rear sides)
    var wy = 0.22, wz = -0.52;
    if (id === 'ANGEL_WINGS' || id === 'DEMON_WINGS' || id === 'BUTTERFLY_WINGS' || id === 'DRAGON_WINGS' || id === 'VOID_WINGS' || id === 'NEON_WINGS') {
      for (var wSide = -1; wSide <= 1; wSide += 2) {
        var wq = new Quat().fromAxisAngle(0, 1, 0, wSide * 0.4);
        var wq2 = new Quat().fromAxisAngle(0, 0, 1, wSide * 0.2);
        wq.mul(wq, wq2);
        p.set(wSide * 0.48, wy + 0.15, wz);
        B.cylinder(0.025, 0.22, 0.65, 8, p, wq); // wing blade
      }
    } else if (id === 'JET_FLAMES' || id === 'ROCKET_THRUST' || id === 'HOVER_PACK') {
      for (var jSide = -1; jSide <= 1; jSide += 2) {
        p.set(jSide * 0.28, wy + 0.08, wz);
        q.fromAxisAngle(1, 0, 0, -Math.PI / 2);
        B.cylinder(0.12, 0.14, 0.38, 12, p, q); // thruster pod
      }
    } else {
      // Sail / Fin
      p.set(0, wy + 0.22, wz);
      q.fromAxisAngle(0, 1, 0, 0);
      B.cylinder(0.015, 0.015, 0.48, 6, p, q);
    }
  } else {
    // Default fallback cosmetic box
    p.set(0, 0.28, 0);
    B.cylinder(0.15, 0.05, 0.25, 8, p, null);
  }
}

/* ------------------------------------------------------------------ *
 * public entry point
 * ------------------------------------------------------------------ */

/** Build every body, wheel and cosmetic once, up front, so the user can switch between
 *  them instantly without a hitch. */
export function buildCarKit(R) {
  var anchor = wheelAnchor();
  var models = {};
  for (var i = 0; i < BODIES.length; i++) {
    var m = buildBody(BODIES[i], anchor);
    models[m.id] = {
      id: m.id,
      name: m.name,
      sub: m.sub,
      body: R.mesh(m.body),
      accent: R.mesh(m.accent),
      glass: R.mesh(m.glass),
      lights: R.mesh(m.lights),
      headlights: R.mesh(m.headlights),
      taillights: R.mesh(m.taillights),
      thruster: R.mesh(m.thruster),
      trim: R.mesh(m.trim),
      archX: BODIES[i].archX,
      frontZ: m.frontZ,
      rearZ: m.rearZ
    };
  }

  // Build active player Ultra car if selected
  var activeModel = CFG.customization && CFG.customization.model;
  if (activeModel && isUltraCar(activeModel)) {
    try {
      var uMesh = buildUltraCarMesh(R, activeModel);
      if (uMesh) {
        models[activeModel] = uMesh;
        models[String(activeModel).toLowerCase()] = uMesh;
        models[String(activeModel).toUpperCase()] = uMesh;
      }
    } catch (err) {
      console.warn("Failed to build active Ultra car in buildCarKit:", err);
    }
  }

  var wheels = {};
  for (var w = 0; w < WHEELS.length; w++) {
    var def = wdef(WHEELS[w]);
    var wb = new Builder();
    tyreAndRim(wb, def);
    var hb = new Builder();
    rimFace(hb, def, anchor);
    wheels[def.id] = {
      id: def.id,
      name: def.name,
      sub: def.sub,
      wheel: R.mesh(wb),
      hub: R.mesh(hb)
    };
  }

  var cosmetics = {};
  if (typeof COSMETICS_LIBRARY !== 'undefined' && Array.isArray(COSMETICS_LIBRARY)) {
    for (var c = 0; c < COSMETICS_LIBRARY.length; c++) {
      var cItem = COSMETICS_LIBRARY[c];
      var cb = new Builder();
      buildCosmeticItem(cb, cItem);
      cosmetics[cItem.id] = R.mesh(cb);
    }
  }

  // Prebuild active player Ultra wheel if equipped
  var activeWheel = CFG.customization && CFG.customization.wheel;
  if (activeWheel && isUltraWheel(activeWheel)) {
    try {
      var wMesh = buildUltraWheelMesh(R, activeWheel);
      if (wMesh) {
        wheels[activeWheel] = wMesh;
        wheels[String(activeWheel).toLowerCase()] = wMesh;
        wheels[String(activeWheel).toUpperCase()] = wMesh;
      }
    } catch (err) {
      console.warn("Failed to prebuild active Ultra wheel:", err);
    }
  }

  // Prebuild active player Ultra topper & antenna if equipped
  var activeHat = CFG.customization && CFG.customization.hat;
  if (activeHat && activeHat !== 'none' && isUltraTopper(activeHat)) {
    try {
      var topMesh = buildUltraTopperMesh(R, activeHat);
      if (topMesh) cosmetics[activeHat] = topMesh;
    } catch (err) {
      console.warn("Failed to prebuild active Ultra topper:", err);
    }
  }
  var activeAntenna = CFG.customization && CFG.customization.antenna;
  if (activeAntenna && activeAntenna !== 'none' && isUltraAntenna(activeAntenna)) {
    try {
      var antMesh = buildUltraAntennaMesh(R, activeAntenna);
      if (antMesh) cosmetics[activeAntenna] = antMesh;
    } catch (err) {
      console.warn("Failed to prebuild active Ultra antenna:", err);
    }
  }

  return {
    models: models,
    wheels: wheels,
    cosmetics: cosmetics,
    anchor: anchor,
    order: BODIES.map(function (b) { return b.id; }),
    wheelOrder: WHEELS.map(function (x) { return x.id; })
  };
}
