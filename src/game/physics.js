// @ts-nocheck
import { PI, TAU, clamp, lerp, sgn, smooth, num, V3, Quat, tv, tc } from './math.js';
import { CFG, TEAM } from './config.js';
import { Builder } from './renderer.js';

export function Arena(cfg) {
  this.cfg = cfg;
  this.hx = cfg.hx; this.hz = cfg.hz; this.h = cfg.height;
  this.fillet = cfg.fillet; this.R = cfg.cornerFillet;
  this.goalHalfW = cfg.goalHalfW; this.goalHeight = cfg.goalHeight; this.goalDepth = cfg.goalDepth;
  this.mouthInset = cfg.fillet;
  this.gradEps = 0.012;
}
Arena.prototype.sd2 = function (x, z, d) {
  var ex = Math.max(this.hx - d, 0.05), ez = Math.max(this.hz - d, 0.05);
  var r = Math.max(this.R - d, 0.001);
  var qx = Math.abs(x) - (ex - r), qz = Math.abs(z) - (ez - r);
  var mx = Math.max(qx, 0), mz = Math.max(qz, 0);
  return Math.sqrt(mx * mx + mz * mz) + Math.min(Math.max(qx, qz), 0) - r;
};
Arena.prototype.sdShell = function (p) {
  var f = this.fillet;
  var d2 = this.sd2(p.x, p.z, f);
  var dy = Math.abs(p.y - this.h * 0.5) - (this.h * 0.5 - f);
  var ax = Math.max(d2, 0), ay = Math.max(dy, 0);
  return Math.min(Math.max(d2, dy), 0) + Math.sqrt(ax * ax + ay * ay) - f;
};
Arena.prototype.region = function (p) {
  if (Math.abs(p.x) < this.goalHalfW && p.y < this.goalHeight + 0.8) {
    if (p.z > this.hz - this.mouthInset) return 1;
    if (p.z < -(this.hz - this.mouthInset)) return -1;
  }
  return 0;
};
Arena.prototype.dist = function (p, forCar) {
  var d_shell = -this.sdShell(p);

  var s = p.z >= 0 ? 1 : -1;
  var absZ = s * p.z;
  var absX = Math.abs(p.x);
  var gw = this.goalHalfW, gh = this.goalHeight, gd = this.goalDepth, hz = this.hz;
  var Rg = 2.0;

  if (absZ > hz - 3.5) {
    var d_floor = p.y;
    var d_ceil = gh - p.y;
    var d_back = (hz + gd) - absZ;
    var d_side = gw - absX;

    if (forCar) {
      // 1. Goal posts and crossbar complete pass-through for car
      if (Math.abs(absZ - hz) < 3.5) {
        if (absX <= gw + 2.5 && p.y <= gh + 2.5) {
          // Open air between pitch and goal
          var d_open = Math.min(p.y, Math.min(this.h - p.y, (hz + gd) - absZ));
          return d_open;
        }
      }

      // 2. Goal roof driving surface: if car is driving on top of the goal net
      if (absZ >= hz && absZ <= hz + gd + 0.6 && absX <= gw + 0.6 && p.y >= gh - 0.2) {
        var d_roof_floor = p.y - gh;
        var d_roof_ceil = this.h - p.y;
        var d_roof_side = this.hx - absX;
        return Math.min(d_roof_floor, Math.min(d_roof_ceil, d_roof_side));
      }

      // 3. Inside goal cavity
      if (absZ >= hz) {
        if (absX <= gw + 2.5 && p.y <= gh + 2.5) {
          var d_fb = (d_floor < Rg && d_back < Rg) ? Rg - Math.hypot(Rg - d_floor, Rg - d_back) : Math.min(d_floor, d_back);
          var d_cb = (d_ceil < Rg && d_back < Rg) ? Rg - Math.hypot(Rg - d_ceil, Rg - d_back) : Math.min(d_ceil, d_back);
          var d_cs = (d_ceil < Rg && d_side < Rg) ? Rg - Math.hypot(Rg - d_ceil, Rg - d_side) : Math.min(d_ceil, d_side);
          var d_fs = (d_floor < Rg && d_side < Rg) ? Rg - Math.hypot(Rg - d_floor, Rg - d_side) : Math.min(d_floor, d_side);

          return Math.min(d_fb, Math.min(d_cb, Math.min(d_cs, d_fs)));
        } else {
          return d_shell;
        }
      } else {
        // Pitch side entering mouth
        if (absX <= gw + 2.5 && p.y <= gh + 2.5) {
          var d_pitch_open = Math.min(p.y, Math.min(this.h - p.y, this.hx - absX));
          return d_pitch_open;
        } else {
          return d_shell;
        }
      }
    }

    // Ball physics: tubular posts and crossbar with pipe radius 0.22
    var pipeR = 0.22;
    var d_post = Math.hypot(absX - gw, absZ - hz) - pipeR;
    var d_bar = Math.hypot(p.y - gh, absZ - hz) - pipeR;

    if (absZ >= hz) {
      if (absX <= gw && p.y <= gh) {
        var d_fb_b = (d_floor < Rg && d_back < Rg) ? Rg - Math.hypot(Rg - d_floor, Rg - d_back) : Math.min(d_floor, d_back);
        var d_cb_b = (d_ceil < Rg && d_back < Rg) ? Rg - Math.hypot(Rg - d_ceil, Rg - d_back) : Math.min(d_ceil, d_back);
        var d_cs_b = (d_ceil < Rg && d_side < Rg) ? Rg - Math.hypot(Rg - d_ceil, Rg - d_side) : Math.min(d_ceil, d_side);
        var d_fs_b = (d_floor < Rg && d_side < Rg) ? Rg - Math.hypot(Rg - d_floor, Rg - d_side) : Math.min(d_floor, d_side);

        return Math.min(d_fb_b, Math.min(d_cb_b, Math.min(d_cs_b, d_fs_b)));
      } else {
        if (p.y <= gh && Math.abs(absZ - hz) < pipeR * 2.0 && Math.abs(absX - gw) < pipeR * 2.0) {
          return d_post;
        }
        if (absX <= gw && Math.abs(absZ - hz) < pipeR * 2.0 && Math.abs(p.y - gh) < pipeR * 2.0) {
          return d_bar;
        }
        return d_shell;
      }
    } else {
      if (absX <= gw && p.y <= gh) {
        if (Math.abs(p.y - gh) < pipeR * 2.0 && Math.abs(absZ - hz) < pipeR * 2.0) {
          return d_bar;
        }
        if (Math.abs(absX - gw) < pipeR * 2.0 && Math.abs(absZ - hz) < pipeR * 2.0) {
          return d_post;
        }
        var d_pitch_open_b = Math.min(p.y, Math.min(this.h - p.y, this.hx - absX));
        return d_pitch_open_b;
      } else {
        if (p.y <= gh && Math.abs(absZ - hz) < pipeR * 2.0 && Math.abs(absX - gw) < pipeR * 2.0) {
          return d_post;
        }
        if (absX <= gw && Math.abs(absZ - hz) < pipeR * 2.0 && Math.abs(p.y - gh) < pipeR * 2.0) {
          return d_bar;
        }
        return d_shell;
      }
    }
  }

  return d_shell;
};
Arena.prototype.normal = function (p, out, forCar) {
  out = out || tv();
  var e = this.gradEps, a = tv();
  a.set(p.x + e, p.y, p.z); var dx1 = this.dist(a, forCar);
  a.set(p.x - e, p.y, p.z); var dx2 = this.dist(a, forCar);
  a.set(p.x, p.y + e, p.z); var dy1 = this.dist(a, forCar);
  a.set(p.x, p.y - e, p.z); var dy2 = this.dist(a, forCar);
  a.set(p.x, p.y, p.z + e); var dz1 = this.dist(a, forCar);
  a.set(p.x, p.y, p.z - e); var dz2 = this.dist(a, forCar);

  var nx = dx1 - dx2;
  var ny = dy1 - dy2;
  var nz = dz1 - dz2;

  if (num(nx) && num(ny) && num(nz)) {
    out.set(nx, ny, nz);
    if (out.lenSq() > 1e-12) {
      out.norm();
      return out;
    }
  }
  out.set(0, 1, 0);
  return out;
};
Arena.prototype.ray = function (origin, dir, maxDist, out, forCar) {
  var t = 0, p = tv(), d = 0;
  for (var i = 0; i < 28; i++) {
    p.set(origin.x + dir.x * t, origin.y + dir.y * t, origin.z + dir.z * t);
    d = this.dist(p, forCar);
    if (d < 0.006) {
      if (out) {
        if (out.point && typeof out.point.set === "function") out.point.set(p.x, p.y, p.z);
        if (out.normal) this.normal(p, out.normal, forCar);
        out.dist = t;
      }
      return t;
    }
    t += Math.min(Math.max(d * 0.85, 0.01), 0.22);
    if (t > maxDist) return -1;
  }
  return -1;
};
Arena.prototype.goalTest = function (p, radius) {
  if (Math.abs(p.x) > this.goalHalfW || p.y > this.goalHeight) return 0;
  var line = this.hz + radius * 0.92;
  if (p.z > line) return 1;
  if (p.z < -line) return -1;
  return 0;
};
Arena.prototype.inPlayableBounds = function (p) {
  return Math.abs(p.x) < this.hx + 12 && Math.abs(p.z) < this.hz + this.goalDepth + 8 && p.y > -6 && p.y < this.h + 12;
};
Arena.prototype.outline = function (d, extraX) {
  var pts = [];
  var ex = this.hx - d, ez = this.hz - d, r = Math.max(this.R - d, 0.001);
  var sx = ex - r, sz = ez - r;
  function push(x, z, nx, nz) { pts.push({ x: x, z: z, nx: nx, nz: nz }); }
  function edgeX(z, nz, dir) {
    var xs = [];
    var lo = -sx, hi = sx;
    var step = (hi - lo) / Math.max(2, Math.round((hi - lo) / 2.4));
    for (var x = lo; x < hi - 1e-6; x += step) xs.push(x);
    xs.push(hi);
    if (extraX) for (var i = 0; i < extraX.length; i++) if (Math.abs(extraX[i]) < sx) xs.push(extraX[i]);
    xs.sort(function (a, b) { return dir > 0 ? a - b : b - a; });
    for (var k = 0; k < xs.length; k++) push(xs[k], z, 0, nz);
  }
  function edgeZ(x, nx, dir) {
    var zs = [], lo = -sz, hi = sz;
    var step = (hi - lo) / Math.max(2, Math.round((hi - lo) / 2.6));
    for (var z = lo; z < hi - 1e-6; z += step) zs.push(z);
    zs.push(hi);
    zs.sort(function (a, b) { return dir > 0 ? a - b : b - a; });
    for (var k2 = 0; k2 < zs.length; k2++) push(x, zs[k2], nx, 0);
  }
  function arc(cx, cz, a0, a1) {
    var N = 9;
    for (var i = 1; i < N; i++) {
      var a = lerp(a0, a1, i / N);
      var nx = -Math.cos(a), nz = -Math.sin(a);
      push(cx + Math.cos(a) * r, cz + Math.sin(a) * r, nx, nz);
    }
  }
  edgeX(ez, -1, -1);
  arc(-sx, sz, PI * 0.5, PI);
  edgeZ(-ex, 1, -1);
  arc(-sx, -sz, PI, PI * 1.5);
  edgeX(-ez, 1, 1);
  arc(sx, -sz, PI * 1.5, TAU);
  edgeZ(ex, -1, 1);
  arc(sx, sz, 0, PI * 0.5);
  return pts;
};
Arena.prototype.inMouth = function (x, y, z) {
  return Math.abs(x) < this.goalHalfW - 1e-6 && y < this.goalHeight - 1e-6 && Math.abs(z) > this.hz - this.fillet - 1e-6;
};
Arena.prototype.build = function (R) {
  var f = this.fillet, h = this.h, self = this;
  var mouthX = [this.goalHalfW, -this.goalHalfW, this.goalHalfW + 0.001, -this.goalHalfW - 0.001];

  var profile = [];
  var K = 4;
  for (var i = 0; i <= K; i++) {
    var a = (1 - i / K) * PI * 0.5;
    profile.push({ d: f - f * Math.cos(a), y: f - f * Math.sin(a), ca: Math.cos(a), sa: Math.sin(a) });
  }
  var wallYs = [];
  var yLo = f, yHi = h - f;
  var stepY = (yHi - yLo) / Math.max(3, Math.round((yHi - yLo) / 2.4));
  for (var y = yLo + stepY; y < yHi - 1e-6; y += stepY) wallYs.push(y);
  wallYs.push(this.goalHeight);
  wallYs.push(7.2);
  wallYs.push(yHi);
  wallYs.sort(function (p, q) { return p - q; });
  for (var w = 0; w < wallYs.length; w++) profile.push({ d: 0, y: wallYs[w], ca: 1, sa: 0 });
  for (var t = 1; t <= K; t++) {
    var b = t / K * PI * 0.5;
    profile.push({ d: f - f * Math.cos(b), y: h - f + f * Math.sin(b), ca: Math.cos(b), sa: -Math.sin(b) });
  }

  var rings = [];
  for (var pr = 0; pr < profile.length; pr++) rings.push(this.outline(profile[pr].d, mouthX));
  var nPts = rings[0].length;

  var bShell = new Builder();
  var perim = [0];
  for (var q = 1; q < nPts; q++) {
    var pa = rings[0][q - 1], pb = rings[0][q];
    perim.push(perim[q - 1] + Math.sqrt((pa.x - pb.x) * (pa.x - pb.x) + (pa.z - pb.z) * (pa.z - pb.z)));
  }
  for (var r0 = 0; r0 < profile.length - 1; r0++) {
    var P0 = profile[r0], P1 = profile[r0 + 1];
    var uvs = 0.18;
    for (var s0 = 0; s0 < nPts; s0++) {
      var s1 = (s0 + 1) % nPts;
      var A0 = rings[r0][s0], A1 = rings[r0][s1], B0 = rings[r0 + 1][s0], B1 = rings[r0 + 1][s1];
      var cx = (A0.x + A1.x + B0.x + B1.x) * 0.25, cz = (A0.z + A1.z + B0.z + B1.z) * 0.25;
      var cy = (P0.y + P1.y) * 0.5;
      if (self.inMouth(cx, cy, cz)) continue;
      var n0 = tv(A0.nx * P0.ca, P0.sa, A0.nz * P0.ca).norm();
      var n1 = tv(A1.nx * P0.ca, P0.sa, A1.nz * P0.ca).norm();
      var n2 = tv(B1.nx * P1.ca, P1.sa, B1.nz * P1.ca).norm();
      var n3 = tv(B0.nx * P1.ca, P1.sa, B0.nz * P1.ca).norm();
      var u0 = perim[s0] * uvs, u1 = (s1 === 0 ? perim[nPts - 1] + 2 : perim[s1]) * uvs;
      var v0 = P0.y * uvs, v1 = P1.y * uvs;
      var i0 = bShell.vert(A0.x, P0.y, A0.z, n0.x, n0.y, n0.z, u0, v0);
      var i1 = bShell.vert(A1.x, P0.y, A1.z, n1.x, n1.y, n1.z, u1, v0);
      var i2 = bShell.vert(B1.x, P1.y, B1.z, n2.x, n2.y, n2.z, u1, v1);
      var i3 = bShell.vert(B0.x, P1.y, B0.z, n3.x, n3.y, n3.z, u0, v1);
      bShell.quadN(i0, i1, i2, i3);
    }
  }

  var bFloor = new Builder();
  var floorRing = rings[0];
  var ctr = bFloor.vert(0, 0, 0, 0, 1, 0, 0.5, 0.5);
  var idx = [];
  for (var fi = 0; fi < nPts; fi++) {
    var pt = floorRing[fi];
    idx.push(bFloor.vert(pt.x, 0, pt.z, 0, 1, 0, (pt.x + this.hx) / (2 * this.hx), (pt.z + this.hz) / (2 * this.hz)));
  }
  for (var fj = 0; fj < nPts; fj++) bFloor.quadN(ctr, idx[fj], idx[(fj + 1) % nPts], ctr);

  // Extend lush pitch grass all the way to the foot of the spectator stadium retaining wall (d = 20.0)
  var standBaseDist = 20.0;
  var apronIdx = [];
  for (var api = 0; api < nPts; api++) {
    var apt = floorRing[api];
    var apx = apt.x - apt.nx * standBaseDist;
    var apz = apt.z - apt.nz * standBaseDist;
    apronIdx.push(bFloor.vert(apx, 0, apz, 0, 1, 0, (apx + this.hx) / (2 * this.hx), (apz + this.hz) / (2 * this.hz)));
  }
  for (var apj = 0; apj < nPts; apj++) {
    var apjNext = (apj + 1) % nPts;
    bFloor.quadN(idx[apj], apronIdx[apj], apronIdx[apjNext], idx[apjNext]);
  }

  for (var gs = -1; gs <= 1; gs += 2) {
    var zIn = gs * (this.hz - f), zOut = gs * this.hz;
    var gw = this.goalHalfW;
    var a1 = bFloor.vert(-gw, 0, zIn, 0, 1, 0, (-gw + this.hx) / (2 * this.hx), (zIn + this.hz) / (2 * this.hz));
    var a2 = bFloor.vert(gw, 0, zIn, 0, 1, 0, (gw + this.hx) / (2 * this.hx), (zIn + this.hz) / (2 * this.hz));
    var a3 = bFloor.vert(gw, 0, zOut, 0, 1, 0, (gw + this.hx) / (2 * this.hx), (zOut + this.hz) / (2 * this.hz));
    var a4 = bFloor.vert(-gw, 0, zOut, 0, 1, 0, (-gw + this.hx) / (2 * this.hx), (zOut + this.hz) / (2 * this.hz));
    bFloor.quadN(a1, a2, a3, a4);
  }

  var bCeil = new Builder();
  var ceilRing = rings[rings.length - 1];
  var cc = bCeil.vert(0, h, 0, 0, -1, 0, 0.5, 0.5);
  var cidx = [];
  for (var ci = 0; ci < nPts; ci++) {
    var cp = ceilRing[ci];
    cidx.push(bCeil.vert(cp.x, h, cp.z, 0, -1, 0, cp.x * 0.18, cp.z * 0.18));
  }
  for (var cj = 0; cj < nPts; cj++) bCeil.quadN(cc, cidx[cj], cidx[(cj + 1) % nPts], cc);

  // =========================================================================
  // OUTSIDE SPECTATOR GRANDSTANDS (Elevated tiers rising above the perimeter wall)
  // =========================================================================
  var bGrandstands = new Builder();
  var gTiers = [
    // 1. Concrete Retaining Wall perimeter (vertical wall at d=20.0 from ground y=0 to walkway y=4.2)
    { d0: 20.0, y0: 0.0, d1: 20.0, y1: 4.2, v0: 0.00, v1: 0.08 },
    // 2. Lower Concourse Promenade Walkway (d=20.0 to d=22.5 at y=4.2)
    { d0: 20.0, y0: 4.2, d1: 22.5, y1: 4.2, v0: 0.08, v1: 0.12 },
    // 3. Tier 1 - Lower Seating Bowl (Raking from y=4.2 to y=15.2 filled with cheering fans)
    { d0: 22.5, y0: 4.2, d1: 36.0, y1: 15.2, v0: 0.12, v1: 0.42 },
    // 4. Middle Concourse Walkway (d=36.0 to d=38.5 at y=15.2)
    { d0: 36.0, y0: 15.2, d1: 38.5, y1: 15.2, v0: 0.42, v1: 0.46 },
    // 5. Tier 2 - Middle Seating Bowl (Raking from y=16.2 to y=27.2)
    { d0: 38.5, y0: 16.2, d1: 54.0, y1: 27.2, v0: 0.46, v1: 0.72 },
    // 6. Upper Balcony Concourse Walkway (d=54.0 to d=56.5 at y=27.2)
    { d0: 54.0, y0: 27.2, d1: 56.5, y1: 27.2, v0: 0.72, v1: 0.76 },
    // 7. Tier 3 - Upper Deck (Raking from y=28.2 to y=39.2)
    { d0: 56.5, y0: 28.2, d1: 71.0, y1: 39.2, v0: 0.76, v1: 0.96 },
    // 8. Majestic Stadium Canopy Overhang
    { d0: 71.0, y0: 39.5, d1: 40.0, y1: 46.0, v0: 0.96, v1: 1.00 }
  ];

  for (var ti = 0; ti < gTiers.length; ti++) {
    var T = gTiers[ti];
    for (var gs0 = 0; gs0 < nPts; gs0++) {
      var gs1 = (gs0 + 1) % nPts;
      var gA0 = rings[0][gs0], gA1 = rings[0][gs1];
      // Outward unit normal vectors pointing away from arena
      var o0x = -gA0.nx, o0z = -gA0.nz;
      var o1x = -gA1.nx, o1z = -gA1.nz;

      var p0x = gA0.x + o0x * T.d0, p0z = gA0.z + o0z * T.d0, p0y = T.y0;
      var p1x = gA1.x + o1x * T.d0, p1z = gA1.z + o1z * T.d0, p1y = T.y0;
      var p2x = gA1.x + o1x * T.d1, p2z = gA1.z + o1z * T.d1, p2y = T.y1;
      var p3x = gA0.x + o0x * T.d1, p3z = gA0.z + o0z * T.d1, p3y = T.y1;

      var gu0 = perim[gs0] * 0.08, gu1 = (gs1 === 0 ? perim[nPts - 1] + 2 : perim[gs1]) * 0.08;
      var gvi0 = bGrandstands.vert(p0x, p0y, p0z, -o0x, 0.45, -o0z, gu0, T.v0);
      var gvi1 = bGrandstands.vert(p1x, p1y, p1z, -o1x, 0.45, -o1z, gu1, T.v0);
      var gvi2 = bGrandstands.vert(p2x, p2y, p2z, -o1x, 0.45, -o1z, gu1, T.v1);
      var gvi3 = bGrandstands.vert(p3x, p3y, p3z, -o0x, 0.45, -o0z, gu0, T.v1);
      bGrandstands.quadN(gvi0, gvi1, gvi2, gvi3);
    }
  }

  // =========================================================================
  // SKY DOME (Majestic panorama with sunset horizon and illuminated clouds)
  // =========================================================================
  var bSkyDome = new Builder();
  var skyR = 280.0, skySegs = 32, skyRings = 12;
  for (var sy = 0; sy <= skyRings; sy++) {
    var sv = sy / skyRings;
    var skyY = -12.0 + sv * 175.0;
    var curR = skyR * Math.cos(sv * 0.62);
    for (var sx = 0; sx <= skySegs; sx++) {
      var su = sx / skySegs;
      var sAngle = su * TAU;
      var spx = Math.cos(sAngle) * curR;
      var spz = Math.sin(sAngle) * curR;
      bSkyDome.vert(spx, skyY, spz, -Math.cos(sAngle), 0, -Math.sin(sAngle), su, 1 - sv);
    }
  }
  for (var skyRow = 0; skyRow < skyRings; skyRow++) {
    for (var skyCol = 0; skyCol < skySegs; skyCol++) {
      var sk0 = skyRow * (skySegs + 1) + skyCol;
      var sk1 = sk0 + 1;
      var sk2 = (skyRow + 1) * (skySegs + 1) + skyCol;
      var sk3 = sk2 + 1;
      bSkyDome.quadN(sk0, sk2, sk3, sk1);
    }
  }

  // =========================================================================
  // 6 STADIUM FLOODLIGHT TOWERS (4 Corners + 2 Middle Long-Sides)
  // =========================================================================
  var bTrusses = new Builder();
  var bLights = new Builder();
  var bBeams = new Builder();

  var floodlightTowers = [
    // 4 Corner Towers
    {
      x: -this.hx - 14.0, z: -this.hz - 14.0,
      targetX: -this.hx * 0.42, targetZ: -this.hz * 0.52,
      inwardX: 1, inwardZ: 1
    },
    {
      x: this.hx + 14.0, z: -this.hz - 14.0,
      targetX: this.hx * 0.42, targetZ: -this.hz * 0.52,
      inwardX: -1, inwardZ: 1
    },
    {
      x: -this.hx - 14.0, z: this.hz + 14.0,
      targetX: -this.hx * 0.42, targetZ: this.hz * 0.52,
      inwardX: 1, inwardZ: -1
    },
    {
      x: this.hx + 14.0, z: this.hz + 14.0,
      targetX: this.hx * 0.42, targetZ: this.hz * 0.52,
      inwardX: -1, inwardZ: -1
    },
    // 2 Middle Long-Side Towers
    {
      x: -this.hx - 16.0, z: 0,
      targetX: 0, targetZ: 0,
      inwardX: 1, inwardZ: 0
    },
    {
      x: this.hx + 16.0, z: 0,
      targetX: 0, targetZ: 0,
      inwardX: -1, inwardZ: 0
    }
  ];

  var towerHeight = 28.5;
  for (var fti = 0; fti < floodlightTowers.length; fti++) {
    var FT = floodlightTowers[fti];
    var tx = FT.x, tz = FT.z;
    var inX = FT.inwardX, inZ = FT.inwardZ;

    // 4 Main Heavy Steel Lattice Pylon Columns
    var legSpread = 1.35;
    bTrusses.box(0.28, towerHeight * 0.5, 0.28, new V3(tx - legSpread, towerHeight * 0.5, tz - legSpread), null, 0.4);
    bTrusses.box(0.28, towerHeight * 0.5, 0.28, new V3(tx + legSpread, towerHeight * 0.5, tz - legSpread), null, 0.4);
    bTrusses.box(0.28, towerHeight * 0.5, 0.28, new V3(tx - legSpread, towerHeight * 0.5, tz + legSpread), null, 0.4);
    bTrusses.box(0.28, towerHeight * 0.5, 0.28, new V3(tx + legSpread, towerHeight * 0.5, tz + legSpread), null, 0.4);

    // Cross Braces along tower height
    for (var hy = 3.5; hy < towerHeight - 1; hy += 3.8) {
      bTrusses.box(legSpread * 2.2, 0.16, 0.16, new V3(tx, hy, tz - legSpread), null, 0.3);
      bTrusses.box(legSpread * 2.2, 0.16, 0.16, new V3(tx, hy, tz + legSpread), null, 0.3);
      bTrusses.box(0.16, 0.16, legSpread * 2.2, new V3(tx - legSpread, hy, tz), null, 0.3);
      bTrusses.box(0.16, 0.16, legSpread * 2.2, new V3(tx + legSpread, hy, tz), null, 0.3);
    }

    // Mid-level service catwalk at y = 16
    bTrusses.box(legSpread * 2.6, 0.22, legSpread * 2.6, new V3(tx, 16.2, tz), null, 0.5);

    // Top Cantilever Gantry Platform extending inward toward pitch at y = 27.5
    var gantryX = tx + inX * 2.6, gantryZ = tz + inZ * 2.6, gantryY = 27.6;
    bTrusses.box(2.8, 0.35, 2.2, new V3(gantryX, gantryY, gantryZ), null, 0.5);
    // Cantilever support struts
    bTrusses.box(0.2, 1.4, 0.2, new V3(tx + inX * 1.3, gantryY - 1.2, tz + inZ * 1.3), null, 0.3);

    // High-Intensity Floodlight Headbank (18 Lamps per tower in a 3x6 grid)
    for (var row = -1; row <= 1; row += 1) {
      for (var col = -2.5; col <= 2.5; col += 1.0) {
        var lampOffX = inZ === 0 ? inX * 0.4 : (col * 0.55 * inZ);
        var lampOffZ = inZ === 0 ? col * 0.55 : (inZ * 0.4);
        var lampPos = new V3(gantryX + lampOffX, gantryY + row * 0.65 - 0.2, gantryZ + lampOffZ);
        bLights.box(0.42, 0.36, 0.32, lampPos, null, 1.0);
      }
    }

    // Volumetric Spotlight Beam Cone (Atmospheric light shaft to pitch)
    var topX = gantryX, topY = gantryY - 0.4, topZ = gantryZ;
    var botX = FT.targetX, botY = 0.2, botZ = FT.targetZ;
    var rTop = 0.9, rBot = 16.5;
    var beamSides = 10;
    for (var bs = 0; bs < beamSides; bs++) {
      var a0 = (bs / beamSides) * Math.PI * 2;
      var a1 = ((bs + 1) / beamSides) * Math.PI * 2;
      var c0 = Math.cos(a0), s0 = Math.sin(a0);
      var c1 = Math.cos(a1), s1 = Math.sin(a1);

      var bp0 = new V3(topX + c0 * rTop, topY, topZ + s0 * rTop);
      var bp1 = new V3(topX + c1 * rTop, topY, topZ + s1 * rTop);
      var bp2 = new V3(botX + c1 * rBot, botY, botZ + s1 * rBot);
      var bp3 = new V3(botX + c0 * rBot, botY, botZ + s0 * rBot);

      var bnx = (c0 + c1) * 0.5;
      var bnz = (s0 + s1) * 0.5;
      var bvi0 = bBeams.vert(bp0.x, bp0.y, bp0.z, bnx, 0.2, bnz, bs / beamSides, 0);
      var bvi1 = bBeams.vert(bp1.x, bp1.y, bp1.z, bnx, 0.2, bnz, (bs + 1) / beamSides, 0);
      var bvi2 = bBeams.vert(bp2.x, bp2.y, bp2.z, bnx, 0.2, bnz, (bs + 1) / beamSides, 1);
      var bvi3 = bBeams.vert(bp3.x, bp3.y, bp3.z, bnx, 0.2, bnz, bs / beamSides, 1);
      bBeams.quadN(bvi0, bvi1, bvi2, bvi3);
    }
  }

  // Structural Net Cage Support Arches
  for (var cArch = 0; cArch < 4; cArch++) {
    var cSignX = (cArch % 2 === 0 ? -1 : 1);
    var cSignZ = (cArch < 2 ? -1 : 1);
    bTrusses.box(0.35, h * 0.5, 0.35, new V3(cSignX * (this.hx - 1.2), h * 0.5, cSignZ * (this.hz - 1.2)), null, 0.5);
    bTrusses.box(0.28, 0.28, 4.5, new V3(cSignX * (this.hx - 1.2), h - 0.2, cSignZ * (this.hz - 3.5)), null, 0.5);
  }

  // Transverse ceiling arches every 16m
  for (var cxz = -this.hz + 16; cxz <= this.hz - 16; cxz += 16) {
    bTrusses.box(this.hx * 0.96, 0.22, 0.22, new V3(0, h - 0.15, cxz), null, 0.5);
  }

  // Perimeter Ad Boards (LED Sponsor Panels) attached to spectator retaining wall facing inward
  var bAdBoards = new Builder();
  var adH0 = 0.20, adH1 = 2.80;
  var adDist = 19.92;
  for (var s0 = 0; s0 < nPts; s0++) {
    var s1 = (s0 + 1) % nPts;
    var A0 = rings[0][s0], A1 = rings[0][s1];
    var p0x = A0.x - A0.nx * adDist, p0z = A0.z - A0.nz * adDist;
    var p1x = A1.x - A1.nx * adDist, p1z = A1.z - A1.nz * adDist;

    // Check if directly behind the goal net
    var midX = (p0x + p1x) * 0.5, midZ = (p0z + p1z) * 0.5;
    if (Math.abs(midX) < this.goalHalfW + 0.2 && Math.abs(midZ) > this.hz - 0.2) continue;

    var u0 = perim[s0] * 0.12, u1 = (s1 === 0 ? perim[nPts - 1] + 2 : perim[s1]) * 0.12;
    var i0 = bAdBoards.vert(p0x, adH0, p0z, A0.nx, 0, A0.nz, u0, 1);
    var i1 = bAdBoards.vert(p1x, adH0, p1z, A1.nx, 0, A1.nz, u1, 1);
    var i2 = bAdBoards.vert(p1x, adH1, p1z, A1.nx, 0, A1.nz, u1, 0);
    var i3 = bAdBoards.vert(p0x, adH1, p0z, A0.nx, 0, A0.nz, u0, 0);
    bAdBoards.quadN(i0, i1, i2, i3);
  }

  // Upper Tier LED Ribbons attached along the middle concourse
  var bRibbons = new Builder();
  var ribH0 = 15.2, ribH1 = 16.2;
  var ribDist = 38.4;
  for (var r0 = 0; r0 < nPts; r0++) {
    var r1 = (r0 + 1) % nPts;
    var rA0 = rings[0][r0], rA1 = rings[0][r1];
    var rp0x = rA0.x - rA0.nx * ribDist, rp0z = rA0.z - rA0.nz * ribDist;
    var rp1x = rA1.x - rA1.nx * ribDist, rp1z = rA1.z - rA1.nz * ribDist;

    var ru0 = perim[r0] * 0.08, ru1 = (r1 === 0 ? perim[nPts - 1] + 2 : perim[r1]) * 0.08;
    var ri0 = bRibbons.vert(rp0x, ribH0, rp0z, rA0.nx, 0, rA0.nz, ru0, 1);
    var ri1 = bRibbons.vert(rp1x, ribH0, rp1z, rA1.nx, 0, rA1.nz, ru1, 1);
    var ri2 = bRibbons.vert(rp1x, ribH1, rp1z, rA1.nx, 0, rA1.nz, ru1, 0);
    var ri3 = bRibbons.vert(rp0x, ribH1, rp0z, rA0.nx, 0, rA0.nz, ru0, 0);
    bRibbons.quadN(ri0, ri1, ri2, ri3);
  }

  // Big Scoreboard Screens behind goals
  var bScreens = new Builder();
  for (var sg = -1; sg <= 1; sg += 2) {
    var sz = sg * (this.hz - 0.2);
    var i0 = bScreens.vert(-12, h * 0.52, sz, 0, 0, -sg, 0, 1);
    var i1 = bScreens.vert(12, h * 0.52, sz, 0, 0, -sg, 1, 1);
    var i2 = bScreens.vert(12, h * 0.78, sz, 0, 0, -sg, 1, 0);
    var i3 = bScreens.vert(-12, h * 0.78, sz, 0, 0, -sg, 0, 0);
    if (sg > 0) bScreens.quadN(i0, i1, i2, i3);
    else bScreens.quadN(i0, i3, i2, i1);
  }

  // =========================================================================
  // SUSPENDED 4-SIDED CENTER 3D HALO JUMBOTRON & HOLOGRAPHIC SCOREBOARD
  // =========================================================================
  var bJumbotronTruss = new Builder();
  var bJumbotronScreens = new Builder();
  var jCenterY = h - 2.8; // Hanging just below ceiling trusses
  var jHalfW = 4.8, jHalfD = 4.8, jH = 2.8;

  // 1. Heavy Suspended Steel Frame & Gantry Catwalk
  bJumbotronTruss.box(jHalfW * 1.05, 0.22, jHalfD * 1.05, new V3(0, jCenterY + jH * 0.52, 0), null, 0.5);
  bJumbotronTruss.box(jHalfW * 0.95, 0.22, jHalfD * 0.95, new V3(0, jCenterY - jH * 0.52, 0), null, 0.5);
  // 4 Corner Truss Columns
  for (var jcx = -1; jcx <= 1; jcx += 2) {
    for (var jcz = -1; jcz <= 1; jcz += 2) {
      bJumbotronTruss.box(0.25, jH * 0.52, 0.25, new V3(jcx * jHalfW, jCenterY, jcz * jHalfD), null, 0.3);
      // Suspension Steel Cables connecting to roof trusses
      bJumbotronTruss.tube(
        new V3(jcx * jHalfW, jCenterY + jH * 0.52, jcz * jHalfD),
        new V3(jcx * (this.hx * 0.45), h - 0.1, jcz * (this.hz * 0.35)),
        0.06, 6
      );
    }
  }
  // Undercarriage Central Glowing Hologram Emitter Ring
  for (var jhr = 0; jhr < 12; jhr++) {
    var ja0 = (jhr / 12) * TAU, ja1 = ((jhr + 1) / 12) * TAU;
    var jr = 2.2;
    bJumbotronTruss.tube(
      new V3(Math.cos(ja0) * jr, jCenterY - jH * 0.56, Math.sin(ja0) * jr),
      new V3(Math.cos(ja1) * jr, jCenterY - jH * 0.56, Math.sin(ja1) * jr),
      0.12, 6
    );
  }

  // 2. 4 Angled High-Def LED Screens (Facing North, South, East, West)
  // North Screen (facing -Z)
  var jn0 = bJumbotronScreens.vert(-jHalfW * 0.92, jCenterY - jH * 0.45, -jHalfD * 0.96, 0, 0, -1, 0, 1);
  var jn1 = bJumbotronScreens.vert( jHalfW * 0.92, jCenterY - jH * 0.45, -jHalfD * 0.96, 0, 0, -1, 1, 1);
  var jn2 = bJumbotronScreens.vert( jHalfW * 0.92, jCenterY + jH * 0.45, -jHalfD * 0.96, 0, 0, -1, 1, 0);
  var jn3 = bJumbotronScreens.vert(-jHalfW * 0.92, jCenterY + jH * 0.45, -jHalfD * 0.96, 0, 0, -1, 0, 0);
  bJumbotronScreens.quadN(jn0, jn3, jn2, jn1);

  // South Screen (facing +Z)
  var js0 = bJumbotronScreens.vert( jHalfW * 0.92, jCenterY - jH * 0.45,  jHalfD * 0.96, 0, 0, 1, 0, 1);
  var js1 = bJumbotronScreens.vert(-jHalfW * 0.92, jCenterY - jH * 0.45,  jHalfD * 0.96, 0, 0, 1, 1, 1);
  var js2 = bJumbotronScreens.vert(-jHalfW * 0.92, jCenterY + jH * 0.45,  jHalfD * 0.96, 0, 0, 1, 1, 0);
  var js3 = bJumbotronScreens.vert( jHalfW * 0.92, jCenterY + jH * 0.45,  jHalfD * 0.96, 0, 0, 1, 0, 0);
  bJumbotronScreens.quadN(js0, js3, js2, js1);

  // East Screen (facing +X)
  var je0 = bJumbotronScreens.vert( jHalfW * 0.96, jCenterY - jH * 0.45, -jHalfD * 0.92, 1, 0, 0, 0, 1);
  var je1 = bJumbotronScreens.vert( jHalfW * 0.96, jCenterY - jH * 0.45,  jHalfD * 0.92, 1, 0, 0, 1, 1);
  var je2 = bJumbotronScreens.vert( jHalfW * 0.96, jCenterY + jH * 0.45,  jHalfD * 0.92, 1, 0, 0, 1, 0);
  var je3 = bJumbotronScreens.vert( jHalfW * 0.96, jCenterY + jH * 0.45, -jHalfD * 0.92, 1, 0, 0, 0, 0);
  bJumbotronScreens.quadN(je0, je3, je2, je1);

  // West Screen (facing -X)
  var jw0 = bJumbotronScreens.vert(-jHalfW * 0.96, jCenterY - jH * 0.45,  jHalfD * 0.92, -1, 0, 0, 0, 1);
  var jw1 = bJumbotronScreens.vert(-jHalfW * 0.96, jCenterY - jH * 0.45, -jHalfD * 0.92, -1, 0, 0, 1, 1);
  var jw2 = bJumbotronScreens.vert(-jHalfW * 0.96, jCenterY + jH * 0.45, -jHalfD * 0.92, -1, 0, 0, 1, 0);
  var jw3 = bJumbotronScreens.vert(-jHalfW * 0.96, jCenterY + jH * 0.45,  jHalfD * 0.92, -1, 0, 0, 0, 0);
  bJumbotronScreens.quadN(jw0, jw3, jw2, jw1);

  // =========================================================================
  // CORNER PITCH FLAG POLES WITH WAVING PENNANTS
  // =========================================================================
  var bCornerFlags = new Builder();
  var cMarginX = 3.6, cMarginZ = 4.2;
  var cCorners = [
    { x: -this.hx + cMarginX, z: -this.hz + cMarginZ, dir: 1, team: 0 },
    { x:  this.hx - cMarginX, z: -this.hz + cMarginZ, dir: -1, team: 0 },
    { x:  this.hx - cMarginX, z:  this.hz - cMarginZ, dir: -1, team: 1 },
    { x: -this.hx + cMarginX, z:  this.hz - cMarginZ, dir: 1, team: 1 }
  ];
  for (var cfi = 0; cfi < cCorners.length; cfi++) {
    var CF = cCorners[cfi];
    // Flagpole vertical shaft
    bCornerFlags.tube(new V3(CF.x, 0, CF.z), new V3(CF.x, 1.85, CF.z), 0.035, 8);
    // Gold finial ball on top
    bCornerFlags.sphere(0.065, 8, 8, new V3(CF.x, 1.88, CF.z));
    // Triangular waving pennant flag
    var fTop = 1.82, fBot = 1.35, fLen = 0.55 * CF.dir;
    var f0 = bCornerFlags.vert(CF.x, fTop, CF.z, 0, 0, 1, 0, 0);
    var f1 = bCornerFlags.vert(CF.x + fLen, (fTop + fBot) * 0.5, CF.z + 0.08, 0, 0, 1, 1, 0.5);
    var f2 = bCornerFlags.vert(CF.x, fBot, CF.z, 0, 0, 1, 0, 1);
    bCornerFlags.tri(f0, f1, f2);
    bCornerFlags.tri(f0, f2, f1); // Double-sided
  }

  // =========================================================================
  // ARENA PERIMETER NEON ENERGY RUNNERS
  // =========================================================================
  var bNeonPerimeter = new Builder();
  var rimH = h - 0.15;
  for (var rpi = 0; rpi < nPts; rpi++) {
    var rpiNext = (rpi + 1) % nPts;
    var pA_rim = rings[rings.length - 1][rpi];
    var pB_rim = rings[rings.length - 1][rpiNext];
    // Upper roof neon perimeter tube
    bNeonPerimeter.tube(new V3(pA_rim.x, rimH, pA_rim.z), new V3(pB_rim.x, rimH, pB_rim.z), 0.08, 6);
  }

  // =========================================================================
  // MAJESTIC 3D STADIUM ROOF SPACE-TRUSS ARCHITECTURE & CANOPY DOME
  // =========================================================================
  var bRoofTruss = new Builder();
  var bRoofNeon = new Builder();
  var roofPeakY = h + 4.5;
  var roofBaseY = h + 0.2;

  // 1. Longitudinal Arched Spine Girders (Center keel + 2 lateral arched spines)
  var spineXs = [-this.hx * 0.55, 0, this.hx * 0.55];
  for (var spi = 0; spi < spineXs.length; spi++) {
    var spX = spineXs[spi];
    var isCenterSpine = (spX === 0);
    var spSegs = 20;
    for (var seg = 0; seg < spSegs; seg++) {
      var sz0 = -this.hz + (seg / spSegs) * (2 * this.hz);
      var sz1 = -this.hz + ((seg + 1) / spSegs) * (2 * this.hz);
      var sNorm0 = sz0 / this.hz, sNorm1 = sz1 / this.hz;
      var sy0 = roofBaseY + (1.0 - sNorm0 * sNorm0) * (isCenterSpine ? 3.8 : 2.5);
      var sy1 = roofBaseY + (1.0 - sNorm1 * sNorm1) * (isCenterSpine ? 3.8 : 2.5);

      // Heavy upper tubular cord
      bRoofTruss.tube(new V3(spX, sy0 + 0.6, sz0), new V3(spX, sy1 + 0.6, sz1), 0.18, 8);
      // Lower tension cord
      bRoofTruss.tube(new V3(spX, sy0, sz0), new V3(spX, sy1, sz1), 0.14, 8);
      // Vertical and diagonal truss web braces
      bRoofTruss.tube(new V3(spX, sy0, sz0), new V3(spX, sy0 + 0.6, sz0), 0.09, 6);
      bRoofTruss.tube(new V3(spX, sy0, sz0), new V3(spX, sy1 + 0.6, sz1), 0.08, 6);
    }
  }

  // 2. Transverse Cantilever Arch Ribs (Curving across the stadium width every 16m)
  for (var rz = -this.hz + 12; rz <= this.hz - 12; rz += 16) {
    var zRatio = rz / this.hz;
    var archH = roofBaseY + (1.0 - zRatio * zRatio) * 3.8;
    var nRibSegs = 18;
    for (var rbi = 0; rbi < nRibSegs; rbi++) {
      var ru0 = (rbi / nRibSegs) * 2.0 - 1.0;
      var ru1 = ((rbi + 1) / nRibSegs) * 2.0 - 1.0;
      var rx0 = ru0 * (this.hx * 0.98), rx1 = ru1 * (this.hx * 0.98);
      var ry0 = archH - (ru0 * ru0) * 2.2;
      var ry1 = archH - (ru1 * ru1) * 2.2;

      // Heavy Structural Arch Rib Tube
      bRoofTruss.tube(new V3(rx0, ry0, rz), new V3(rx1, ry1, rz), 0.15, 8);
      bRoofTruss.tube(new V3(rx0, ry0 - 0.45, rz), new V3(rx1, ry1 - 0.45, rz), 0.10, 6);
      // Cross truss web
      bRoofTruss.tube(new V3(rx0, ry0, rz), new V3(rx1, ry1 - 0.45, rz), 0.07, 6);

      // Team-colored Glowing Neon Light Strips along the underside of each rib!
      // Blue neon on North side (rz < -4), Red neon on South side (rz > 4), Gold in center
      if (Math.abs(ru0) < 0.92) {
        bRoofNeon.tube(new V3(rx0, ry0 - 0.48, rz), new V3(rx1, ry1 - 0.48, rz), 0.08, 6);
      }
    }
  }

  // 3. Giant Suspended Celestial Energy Halo Ring above Center Field
  var haloRadius = 15.5;
  var haloY = roofBaseY + 3.2;
  var haloSegs = 24;
  for (var hsi = 0; hsi < haloSegs; hsi++) {
    var ha0 = (hsi / haloSegs) * TAU, ha1 = ((hsi + 1) / haloSegs) * TAU;
    var hx0 = Math.cos(ha0) * haloRadius, hz0 = Math.sin(ha0) * haloRadius;
    var hx1 = Math.cos(ha1) * haloRadius, hz1 = Math.sin(ha1) * haloRadius;

    // Outer structural ring
    bRoofTruss.tube(new V3(hx0, haloY, hz0), new V3(hx1, haloY, hz1), 0.22, 8);
    // Inner glowing neon crown ring
    bRoofNeon.tube(new V3(hx0 * 0.94, haloY - 0.15, hz0 * 0.94), new V3(hx1 * 0.94, haloY - 0.15, hz1 * 0.94), 0.12, 6);

    // Radial suspension cables to arena perimeter towers
    if (hsi % 4 === 0) {
      var towerX = (hx0 > 0 ? 1 : -1) * (this.hx * 0.92);
      var towerZ = (hz0 > 0 ? 1 : -1) * (this.hz * 0.88);
      bRoofTruss.tube(new V3(hx0, haloY + 0.1, hz0), new V3(towerX, h + 0.5, towerZ), 0.07, 6);
    }
  }

  var goals = [];
  for (var g = 0; g < 2; g++) {
    var s = g === 0 ? -1 : 1;
    var bg = new Builder(), bn = new Builder(), bf = new Builder(), bgn = new Builder();
    var gw2 = this.goalHalfW, gh = this.goalHeight, gd = this.goalDepth;
    var z0 = s * this.hz;
    var z1 = s * (this.hz + gd);

    // Rocket League Goal Interior Ramps & See-Through Net Mesh Construction
    var Rg = 2.4;
    var K = 6;
    var zRamp = s * (this.hz + gd - Rg);

    var profile = [];
    var pDist = 0;

    // 1. Mouth floor to ramp start
    profile.push({ y: 0, z: z0, ny: 1, nz: 0, dist: 0 });
    var lenFloor = Math.abs(zRamp - z0);
    pDist += lenFloor;
    profile.push({ y: 0, z: zRamp, ny: 1, nz: 0, dist: pDist });

    // 2. Bottom Ramp Arc
    for (var i = 1; i <= K; i++) {
      var a = (i / K) * (PI * 0.5);
      var ry = Rg * (1 - Math.cos(a));
      var rz = zRamp + s * Rg * Math.sin(a);
      var rny = Math.cos(a);
      var rnz = -s * Math.sin(a);
      pDist += (Rg * (PI * 0.5) / K);
      profile.push({ y: ry, z: rz, ny: rny, nz: rnz, dist: pDist });
    }

    // 3. Vertical Back Wall
    var backMidY = gh - Rg;
    var lenBack = Math.max(0, backMidY - Rg);
    pDist += lenBack;
    profile.push({ y: backMidY, z: z1, ny: 0, nz: -s, dist: pDist });

    // 4. Top Ramp Arc
    for (var j = 1; j <= K; j++) {
      var b = (1 - j / K) * (PI * 0.5);
      var ry_t = gh - Rg * (1 - Math.cos(b));
      var rz_t = zRamp + s * Rg * Math.sin(b);
      var rny_t = -Math.cos(b);
      var rnz_t = -s * Math.sin(b);
      pDist += (Rg * (PI * 0.5) / K);
      profile.push({ y: ry_t, z: rz_t, ny: rny_t, nz: rnz_t, dist: pDist });
    }

    // 5. Ceiling back to mouth
    pDist += lenFloor;
    profile.push({ y: gh, z: z0, ny: -1, nz: 0, dist: pDist });

    // Build main net surface quads along goal width
    var numX = 10;
    var xCoords = [];
    for (var xi = 0; xi <= numX; xi++) {
      var tx = xi / numX;
      xCoords.push(-gw2 + tx * (gw2 * 2));
    }

    for (var xi = 0; xi < numX; xi++) {
      var xA = xCoords[xi], xB = xCoords[xi + 1];
      var uA = (xA + gw2) * 0.35, uB = (xB + gw2) * 0.35;

      for (var pi = 0; pi < profile.length - 1; pi++) {
        var pA = profile[pi], pB = profile[pi + 1];
        var vA = pA.dist * 0.35, vB = pB.dist * 0.35;

        var i0 = bn.vert(xA, pA.y, pA.z, 0, pA.ny, pA.nz, uA, vA);
        var i1 = bn.vert(xB, pA.y, pA.z, 0, pA.ny, pA.nz, uB, vA);
        var i2 = bn.vert(xB, pB.y, pB.z, 0, pB.ny, pB.nz, uB, vB);
        var i3 = bn.vert(xA, pB.y, pB.z, 0, pB.ny, pB.nz, uA, vB);

        if (s > 0) bn.quadN(i0, i1, i2, i3);
        else bn.quadN(i0, i3, i2, i1);
      }
    }

    // Left and Right Net Side Walls (Transparent see-through net)
    for (var sideSign = -1; sideSign <= 1; sideSign += 2) {
      var sx = sideSign * gw2;
      var snx = -sideSign;
      for (var pi = 0; pi < profile.length - 1; pi++) {
        var pA = profile[pi], pB = profile[pi + 1];
        var vA = pA.dist * 0.35, vB = pB.dist * 0.35;

        var i0 = bn.vert(sx, pA.y, pA.z, snx, 0, 0, 0, vA);
        var i1 = bn.vert(sx, pB.y, pB.z, snx, 0, 0, 0, vB);
        var i2 = bn.vert(sx, pB.y, z0, snx, 0, 0, 1.2, vB);
        var i3 = bn.vert(sx, pA.y, z0, snx, 0, 0, 1.2, vA);

        if (sideSign * s > 0) bn.quadN(i0, i1, i2, i3);
        else bn.quadN(i0, i3, i2, i1);
      }
    }

    // Goal Posts and Crossbar Frame - Smooth Rounded Tubular Metallic Cylinders
    var pipeR = 0.22;
    var postZ = s * this.hz;

    // Left Post (Vertical Tube)
    bf.tube(new V3(-gw2, 0, postZ), new V3(-gw2, gh, postZ), pipeR, 12);
    // Right Post (Vertical Tube)
    bf.tube(new V3(gw2, 0, postZ), new V3(gw2, gh, postZ), pipeR, 12);
    // Top Crossbar (Horizontal Tube)
    bf.tube(new V3(-gw2, gh, postZ), new V3(gw2, gh, postZ), pipeR, 12);

    // Rounded Elbow Corner Spheres (Top-Left & Top-Right Joints)
    bf.sphere(pipeR * 1.12, 12, 12, new V3(-gw2, gh, postZ));
    bf.sphere(pipeR * 1.12, 12, 12, new V3(gw2, gh, postZ));

    // Bottom Post Ground Base Spheres
    bf.sphere(pipeR * 1.22, 12, 12, new V3(-gw2, 0, postZ));
    bf.sphere(pipeR * 1.22, 12, 12, new V3(gw2, 0, postZ));

    // Rear Support Strut Tubes
    bf.tube(new V3(-gw2, gh, z1), new V3(-gw2, 0, z1), pipeR * 0.8, 10);
    bf.tube(new V3(gw2, gh, z1), new V3(gw2, 0, z1), pipeR * 0.8, 10);
    // Top Depth Connecting Strut Tubes
    bf.tube(new V3(-gw2, gh, postZ), new V3(-gw2, gh, z1), pipeR * 0.7, 10);
    bf.tube(new V3(gw2, gh, postZ), new V3(gw2, gh, z1), pipeR * 0.7, 10);
    // Ground Base Depth Strut Tubes
    bf.tube(new V3(-gw2, 0, postZ), new V3(-gw2, 0, z1), pipeR * 0.7, 10);
    bf.tube(new V3(gw2, 0, postZ), new V3(gw2, 0, z1), pipeR * 0.7, 10);

    // =======================================================================
    // GLOWING 3D NEON GOAL POST TRIMS & OVERHEAD HALO CROWN ARCH
    // =======================================================================
    var neonOffset = 0.09;
    var nZ = postZ - s * neonOffset;
    // Left & Right Outer Neon Accent Strips
    bgn.tube(new V3(-gw2 - neonOffset, 0, nZ), new V3(-gw2 - neonOffset, gh + 0.1, nZ), 0.07, 6);
    bgn.tube(new V3(gw2 + neonOffset, 0, nZ), new V3(gw2 + neonOffset, gh + 0.1, nZ), 0.07, 6);
    // Top Glowing Neon Crossbar Strip
    bgn.tube(new V3(-gw2 - neonOffset, gh + neonOffset, nZ), new V3(gw2 + neonOffset, gh + neonOffset, nZ), 0.07, 6);

    // Overhead Glowing Crown Team Halo Arch above Goal
    var archR = gw2 * 0.85, archCY = gh + 0.45;
    var nArchSegs = 12;
    for (var ai = 0; ai < nArchSegs; ai++) {
      var aa0 = (ai / nArchSegs) * PI, aa1 = ((ai + 1) / nArchSegs) * PI;
      var ax0 = Math.cos(aa0) * archR, ay0 = archCY + Math.sin(aa0) * 1.35;
      var ax1 = Math.cos(aa1) * archR, ay1 = archCY + Math.sin(aa1) * 1.35;
      bgn.tube(new V3(ax0, ay0, nZ), new V3(ax1, ay1, nZ), 0.08, 6);
    }
    // Glowing Goal Corner Flare Nodes
    bgn.sphere(0.18, 8, 8, new V3(-gw2, gh, nZ));
    bgn.sphere(0.18, 8, 8, new V3(gw2, gh, nZ));

    goals.push({
      team: g, side: s, cavity: R.mesh(bg), net: R.mesh(bn), frame: R.mesh(bf),
      neon: R.mesh(bgn),
      center: new V3(0, gh * 0.35, s * (this.hz + gd * 0.5)),
      mouth: new V3(0, gh * 0.4, s * this.hz)
    });
  }

  var meshGrandstands = R.mesh(bGrandstands);
  return {
    floor: R.mesh(bFloor), shell: R.mesh(bShell), crowd: meshGrandstands, grandstands: meshGrandstands,
    ceiling: R.mesh(bCeil), skyDome: R.mesh(bSkyDome), lights: R.mesh(bLights), goals: goals,
    adBoards: R.mesh(bAdBoards), ribbons: R.mesh(bRibbons),
    trusses: R.mesh(bTrusses), screens: R.mesh(bScreens),
    jumbotron: R.mesh(bJumbotronTruss), jumbotronScreens: R.mesh(bJumbotronScreens),
    neonPerimeter: R.mesh(bNeonPerimeter), cornerFlags: R.mesh(bCornerFlags),
    roofTruss: R.mesh(bRoofTruss), roofNeon: R.mesh(bRoofNeon),
    beams: R.mesh(bBeams)
  };
};

export function Body(mass) {
  this.pos = new V3(); this.quat = new Quat();
  this.vel = new V3(); this.angVel = new V3();
  this.force = new V3(); this.torque = new V3();
  this.mass = mass; this.invMass = mass > 0 ? 1 / mass : 0;
  this.inertia = new V3(1, 1, 1); this.invInertia = new V3(1, 1, 1);
  this.right = new V3(1, 0, 0); this.up = new V3(0, 1, 0); this.fwd = new V3(0, 0, 1);
  this.lastGood = { p: new V3(), q: new Quat() };
}
var LX = new V3(1, 0, 0), LY = new V3(0, 1, 0), LZ = new V3(0, 0, 1);
Body.prototype.setBoxInertia = function (hx, hy, hz, scale) {
  var m = this.mass * (scale || 1), w = hx * 2, h = hy * 2, d = hz * 2;
  this.inertia.set(m * (h * h + d * d) / 12, m * (w * w + d * d) / 12, m * (w * w + h * h) / 12);
  this.invInertia.set(1 / this.inertia.x, 1 / this.inertia.y, 1 / this.inertia.z);
  return this;
};
Body.prototype.setSphereInertia = function (r) {
  var i = 0.4 * this.mass * r * r;
  this.inertia.set(i, i, i);
  this.invInertia.set(1 / i, 1 / i, 1 / i);
  return this;
};
Body.prototype.updateBasis = function () {
  this.quat.rotate(LX, this.right);
  this.quat.rotate(LY, this.up);
  this.quat.rotate(LZ, this.fwd);
  return this;
};
Body.prototype.iinv = function (v, out) {
  var l = this.quat.rotateInv(v, tv());
  l.x *= this.invInertia.x; l.y *= this.invInertia.y; l.z *= this.invInertia.z;
  return this.quat.rotate(l, out);
};
Body.prototype.pointVel = function (p, out) {
  var r = tv(p.x - this.pos.x, p.y - this.pos.y, p.z - this.pos.z);
  out.cross(this.angVel, r);
  out.add(this.vel);
  return out;
};
Body.prototype.effInvMass = function (p, n) {
  var r = tv(p.x - this.pos.x, p.y - this.pos.y, p.z - this.pos.z);
  var rn = tv().cross(r, n);
  var i = this.iinv(rn, tv());
  var c = tv().cross(i, r);
  return this.invMass + c.dot(n);
};
Body.prototype.applyImpulse = function (imp, p) {
  this.vel.addS(imp, this.invMass);
  var r = tv(p.x - this.pos.x, p.y - this.pos.y, p.z - this.pos.z);
  var t = tv().cross(r, imp);
  var dw = this.iinv(t, tv());
  this.angVel.add(dw);
};
Body.prototype.applyImpulseCentral = function (imp) { this.vel.addS(imp, this.invMass); };
Body.prototype.addForce = function (f) { this.force.add(f); };
Body.prototype.addForceAt = function (f, p) {
  this.force.add(f);
  var r = tv(p.x - this.pos.x, p.y - this.pos.y, p.z - this.pos.z);
  this.torque.add(tv().cross(r, f));
};
Body.prototype.addAccel = function (a) { this.force.addS(a, this.mass); };
Body.prototype.addAngAccel = function (a, dt) { this.angVel.addS(a, dt); };
Body.prototype.integrate = function (dt, maxSpeed, maxAng) {
  this.vel.addS(this.force, this.invMass * dt);
  var dw = this.iinv(this.torque, tv());
  this.angVel.addS(dw, dt);
  this.force.zero(); this.torque.zero();
  if (maxSpeed) this.vel.clampLen(maxSpeed);
  if (maxAng) this.angVel.clampLen(maxAng);
  this.pos.addS(this.vel, dt);
  this.quat.integrate(this.angVel, dt);
  this.updateBasis();
};
Body.prototype.sanitize = function () {
  if (this.pos.ok() && this.quat.ok() && this.vel.ok() && this.angVel.ok()) {
    if (Math.abs(this.pos.x) < 300 && Math.abs(this.pos.z) < 300 && this.pos.y > -20 && this.pos.y < 120) {
      this.lastGood.p.copy(this.pos); this.lastGood.q.copy(this.quat);
      return true;
    }
  }
  this.pos.copy(this.lastGood.p); this.quat.copy(this.lastGood.q);
  this.vel.clampLen(10); this.angVel.clampLen(5);
  this.force.zero(); this.torque.zero();
  this.updateBasis();
  return true;
};
Body.prototype.teleport = function (p, q) {
  this.pos.copy(p); this.quat.copy(q).norm();
  this.vel.zero(); this.angVel.zero();
  this.force.zero(); this.torque.zero();
  this.updateBasis();
  this.lastGood.p.copy(p); this.lastGood.q.copy(q);
};

export function resolveStatic(body, contact, n, penetration, restitution, friction, correct) {
  var vc = body.pointVel(contact, tv());
  var vn = vc.dot(n);
  var impulse = 0;
  if (vn < 0) {
    var e = -vn > 1.1 ? restitution : 0;
    var effN = body.effInvMass(contact, n);
    if (effN > 1e-9) {
      var j = -(1 + e) * vn / effN;
      impulse = j;
      body.applyImpulse(tv(n.x * j, n.y * j, n.z * j), contact);
      var vt = tv(vc.x - n.x * vn, vc.y - n.y * vn, vc.z - n.z * vn);
      var tl = vt.len();
      if (tl > 1e-4 && friction > 0) {
        var t = tv(-vt.x / tl, -vt.y / tl, -vt.z / tl);
        var effT = body.effInvMass(contact, t);
        if (effT > 1e-9) {
          var jt = Math.min(tl / effT, friction * j);
          body.applyImpulse(tv(t.x * jt, t.y * jt, t.z * jt), contact);
        }
      }
    }
  }
  if (correct && penetration > CFG.physics.contactSlop) {
    var maxCorrPen = Math.min(penetration, 0.6);
    body.pos.addS(n, (maxCorrPen - CFG.physics.contactSlop) * CFG.physics.posCorrect);
  }
  return impulse;
}

export function Ball(cfg) {
  this.cfg = cfg;
  this.radius = cfg.radius;
  this.body = new Body(cfg.mass);
  this.body.setSphereInertia(cfg.radius);
  this.body.pos.set(0, cfg.radius, 0);
  this.grounded = false;
  this.lastTouch = -1;
  this.lastTouchTeam = -1;
  this.lastTouchTime = 0;
  this.hitFlash = 0;
}
Ball.prototype.reset = function (pos, vel) {
  var q = new Quat();
  this.body.teleport(pos || tv(0, this.radius + 0.001, 0), q);
  if (vel) this.body.vel.copy(vel);
  this.lastTouch = -1; this.lastTouchTeam = -1; this.hitFlash = 0;
};
Ball.prototype.applyForces = function (dt) {
  var B = this.body, C = this.cfg, P = CFG.physics;
  B.vel.y -= P.gravity * dt;
  var damp = Math.exp(-C.drag * dt * 6);
  B.vel.scale(damp);
  B.angVel.scale(Math.exp(-C.angDrag * dt * 6));
  var sp = B.vel.len();
  if (sp > 1.5) {
    var m = tv().cross(B.angVel, B.vel).scale(C.magnus * dt);
    B.vel.add(m);
  }
  if (this.grounded) {
    var tangential = tc(B.vel); tangential.y = 0;
    B.vel.addS(tangential, -Math.min(1, C.rollResist * dt * 0.35));
  }
};
Ball.prototype.collideArena = function (arena, world, h) {
  var B = this.body;
  var d = arena.dist(B.pos);
  if (d >= this.radius) { this.grounded = false; return; }
  var n = arena.normal(B.pos, tv());
  var pen = this.radius - d;
  var contact = tv(B.pos.x - n.x * this.radius, B.pos.y - n.y * this.radius, B.pos.z - n.z * this.radius);
  var pre = B.pointVel(contact, tv()).dot(n);
  var j = resolveStatic(B, contact, n, pen, CFG.arena.wallRestitution + this.cfg.restitution * 0.55, this.cfg.wallFriction, true);
  this.grounded = n.y > 0.7;

  // Real-time Rolling Traction & No-Slip Angular Velocity Coupling
  // Contact point offset from center of sphere
  var rVec = tv(-n.x * this.radius, -n.y * this.radius, -n.z * this.radius);
  var v_surf = tv().cross(B.angVel, rVec).add(B.vel);
  var vn_surf = v_surf.dot(n);
  var v_slip = tv(v_surf.x - n.x * vn_surf, v_surf.y - n.y * vn_surf, v_surf.z - n.z * vn_surf);
  var slipSpeed = v_slip.len();

  var dtStep = (h !== undefined && h > 0) ? h : 0.016;
  if (slipSpeed > 1e-4) {
    var gripRate = clamp(dtStep * (this.cfg.wallFriction || 1.8) * 22.0, 0.0, 1.0);
    // Linear velocity adjustment from rolling grip
    B.vel.addS(v_slip, -gripRate * (2.0 / 7.0));
    // Angular velocity correction to achieve pure rolling (v = omega x R)
    var angCorrection = tv().cross(n, v_slip).scale(gripRate * (5.0 / (7.0 * this.radius)));
    B.angVel.add(angCorrection);
  }

  // Damp unnatural spin around surface contact normal (prevents spinning like a top on turf)
  var normalSpin = B.angVel.dot(n);
  if (Math.abs(normalSpin) > 1e-3) {
    var spinDamp = clamp(dtStep * 16.0, 0.0, 1.0);
    B.angVel.addS(n, -normalSpin * spinDamp);
  }

  if (j > 0.6 && -pre > 1.6 && world) {
    world.contacts.push({ type: "ballWall", pos: contact.clone(), normal: n.clone(), impulse: j, speed: -pre });
  }
};
Ball.prototype.step = function (dt, arena, cars, world) {
  if (CFG.ball && CFG.ball.radius && Math.abs(this.radius - CFG.ball.radius) > 1e-4) {
    this.radius = CFG.ball.radius;
    this.body.setSphereInertia(this.radius);
  }
  var B = this.body;
  this.applyForces(dt);
  var speed = B.vel.len();
  var sub = clamp(Math.ceil(speed * dt / (this.radius * 0.3)), 1, 8);
  var h = dt / sub;
  for (var s = 0; s < sub; s++) {
    B.pos.addS(B.vel, h);
    B.quat.integrate(B.angVel, h);
    this.collideArena(arena, world, h);
    for (var i = 0; i < cars.length; i++) collideCarBall(cars[i], this, h, world);
    B.vel.clampLen(CFG.physics.maxBallSpeed);
    B.angVel.clampLen(28);
  }
  if (!B.sanitize()) this.reset();
  if (this.hitFlash > 0) this.hitFlash = Math.max(0, this.hitFlash - dt * 3.2);
};

export var SURFACE = ["front", "rear", "roof", "underbody", "left", "right"];
export function surfaceOf(local, V, scale, scaleFactors) {
  var s = scale || 1;
  var sx = s * (scaleFactors ? scaleFactors.x : 1);
  var sy = s * (scaleFactors ? scaleFactors.y : 1);
  var sz = s * (scaleFactors ? scaleFactors.z : 1);
  var ax = Math.abs(local.x) / (V.hx * sx), ay = Math.abs(local.y) / (V.hy * sy), az = Math.abs(local.z) / (V.hz * sz);
  var m = Math.max(ax, ay, az);
  var many = (ax > m * 0.82 ? 1 : 0) + (ay > m * 0.82 ? 1 : 0) + (az > m * 0.82 ? 1 : 0);
  var name;
  if (m === az) name = local.z > 0 ? "front" : "rear";
  else if (m === ay) name = local.y > 0 ? "roof" : "underbody";
  else name = local.x > 0 ? "right" : "left";
  if (many > 1) name = "corner-" + name;
  return name;
}
export var SURFACE_KICK = { front: 1.0, rear: 0.88, roof: 0.9, underbody: 0.82, left: 0.85, right: 0.85 };
export function surfaceKick(name) {
  var key = name.indexOf("corner-") === 0 ? name.slice(7) : name;
  var v = SURFACE_KICK[key];
  return (v === undefined ? 0.9 : v) * (name.indexOf("corner") === 0 ? 0.94 : 1);
}

export function Wheel(x, y, z, front) {
  var W = CFG.vehicle.wheel;
  this.local = new V3(x, y, z);
  this.front = front;
  this.radius = W.radius;
  this.compression = 0; this.prevCompression = 0;
  this.grounded = false;
  this.contact = new V3(); this.normal = new V3(0, 1, 0);
  this.center = new V3();
  this.steer = 0; this.spin = 0; this.load = 0; this.slip = 0;
  this.contactTime = 0;
}

export function Vehicle(index, team, isPlayer, name) {
  var V = CFG.vehicle;
  this.index = index; this.team = team; this.isPlayer = !!isPlayer;
  this.name = name || (isPlayer ? "You" : "Bot " + index);
  this.body = new Body(V.mass);
  this.body.setBoxInertia(V.hx, V.hy, V.hz, V.inertiaScale);
  var W = V.wheel;
  this.wheels = [
    new Wheel(-W.attachX, W.attachY, W.attachZ, true),
    new Wheel(W.attachX, W.attachY, W.attachZ, true),
    new Wheel(-W.attachX, W.attachY, -W.attachZ, false),
    new Wheel(W.attachX, W.attachY, -W.attachZ, false)
  ];
  this.input = { throttle: 0, steer: 0, pitch: 0, yaw: 0, roll: 0, jump: false, jumpEdge: false, boost: false, slide: false, rollLeft: false, rollRight: false };
  this.boost = 33;
  this.grounded = false; this.wheelsDown = 0;
  this.airTime = 0; this.groundTime = 0;
  this.jumpHeld = 0; this.jumpsUsed = 0; this.jumpCooldown = 0; this.jumpBuffer = 0;
  this.canDodge = false; this.dodgeTimer = 0; this.dodgeAxis = new V3();
  this.dodgeDir = new V3(); this.flipping = false;
  this.slideAmount = 0;
  this.boostActive = false; this.boostUsed = 0;
  this.chassisContact = 0; this.roofContact = 0; this.upsideTime = 0;
  this.turtleState = 0; this.rightingTimer = 0;
  this.ballCooldown = 0;
  this.lastImpact = 0; this.landImpact = 0;
  this.respawnTimer = 0;
  this.surfaceNormal = new V3(0, 1, 0);
  this.stats = { goals: 0, touches: 0, boostUsed: 0, saves: 0 };
  this.debug = { contact: null, normal: null, impulse: 0, relVel: 0, surface: "-" };
  this.updateWheelCenters();
}
Vehicle.prototype.speed = function () { return this.body.vel.len(); };
Vehicle.prototype.forwardSpeed = function () { return this.body.vel.dot(this.body.fwd); };
Vehicle.prototype.updateWheelCenters = function () {
  var B = this.body, V = CFG.vehicle, W = V.wheel;
  var down = tv(-B.up.x, -B.up.y, -B.up.z);
  for (var i = 0; i < 4; i++) {
    var w = this.wheels[i];
    var attach = B.quat.rotate(w.local, tv());
    attach.add(B.pos);
    var restTravel = W.rest - (w.compression || 0);
    w.center.copy(attach).addS(down, Math.max(0.01, restTravel));
  }
};
Vehicle.prototype.resetState = function (pos, quat, boost) {
  this.body.teleport(pos, quat);
  this.boost = boost === undefined ? 33 : boost;
  this.grounded = false; this.wheelsDown = 0;
  this.airTime = 0; this.groundTime = 0;
  this.jumpHeld = 0; this.jumpsUsed = 0; this.jumpCooldown = 0; this.jumpBuffer = 0;
  this.canDodge = false; this.dodgeTimer = 0; this.flipping = false;
  this.slideAmount = 0; this.boostActive = false;
  this.chassisContact = 0; this.roofContact = 0; this.upsideTime = 0;
  this.turtleState = 0; this.rightingTimer = 0; this.ballCooldown = 0;
  this.respawnTimer = 0; this.landImpact = 0;
  for (var i = 0; i < 4; i++) {
    var w = this.wheels[i];
    w.compression = 0; w.prevCompression = 0; w.grounded = false; w.steer = 0; w.spin = 0; w.load = 0; w.slip = 0; w.contactTime = 0;
  }
  this.updateWheelCenters();
  this.input.throttle = 0; this.input.steer = 0; this.input.pitch = 0; this.input.yaw = 0; this.input.roll = 0;
  this.input.jump = false; this.input.jumpEdge = false; this.input.boost = false; this.input.slide = false;
  this.input.rollLeft = false; this.input.rollRight = false;
};
Vehicle.prototype.castWheels = function (arena) {
  var B = this.body, V = CFG.vehicle, W = V.wheel;
  var down = tv(-B.up.x, -B.up.y, -B.up.z);
  this.wheelsDown = 0;
  var nAvg = tv();
  for (var i = 0; i < 4; i++) {
    var w = this.wheels[i];
    var attach = B.quat.rotate(w.local, tv());
    attach.add(B.pos);
    var hit = { point: new V3(), normal: new V3(), dist: 0 };
    var t = arena.ray(attach, down, W.maxRay, hit, true);
    w.prevCompression = w.compression;
    if (t < 0) {
      w.grounded = false;
      w.compression = Math.max(0, w.compression - 12 * 0.004);
      var airTravel = Math.min(W.travel * 0.25, 0.03);
      w.center.copy(attach).addS(down, W.rest + airTravel);
      w.contactTime = 0;
      continue;
    }
    var comp = (W.rest + w.radius) - t;
    if (comp <= 0) {
      w.grounded = false;
      w.compression = 0;
      w.center.copy(attach).addS(down, W.rest);
      w.contactTime = 0;
      continue;
    }
    w.grounded = true;
    w.compression = Math.min(comp, W.rest + W.travel);
    w.contact.copy(hit.point);
    w.normal.copy(hit.normal);
    w.center.copy(attach).addS(down, Math.max(0.01, W.rest - w.compression));
    this.wheelsDown++;
    nAvg.add(w.normal);
  }
  this.grounded = this.wheelsDown > 0;
  if (this.grounded) { this.surfaceNormal.copy(nAvg).norm(); }
  else this.surfaceNormal.set(0, 1, 0);
};
Vehicle.prototype.applyWheelForces = function (dt) {
  var B = this.body, V = CFG.vehicle, W = V.wheel;
  var fwdSpeed = this.forwardSpeed();
  var steerTarget = 0;
  var speedT = clamp(Math.abs(fwdSpeed) / V.driveSpeedCap, 0, 1);
  var maxSteer = lerp(V.steerMax, V.steerMin, speedT * speedT * 0.85 + speedT * 0.15);
  steerTarget = -this.input.steer * maxSteer * CFG.input.steerSens;
  this.slideAmount = this.input.slide
    ? Math.min(1, this.slideAmount + dt * 8)
    : Math.max(0, this.slideAmount - dt * V.slideRecover);
  var slideF = this.slideAmount * 0.35, slideR = this.slideAmount * 0.85;

  for (var i = 0; i < 4; i++) {
    var w = this.wheels[i];
    w.steer = smooth(w.steer, w.front ? steerTarget : 0, V.steerRate, dt);
    if (!w.grounded) { w.load = 0; w.slip = 0; w.spin *= Math.exp(-1.5 * dt); continue; }
    w.contactTime += dt;
    var slide = w.front ? slideF : slideR;
    var latMu = V.frictionCircle * lerp(1, 0.44, slide);
    var gripK = lerp(V.grip, Math.max(V.gripSlide, 10.5), slide);
    var n = w.normal;
    var vc = B.pointVel(w.contact, tv());
    var vn = vc.dot(n);
    var accel = W.stiffness * w.compression - W.damping * vn;
    var fn = Math.max(0, accel) * B.mass * 0.25;
    w.load = fn;
    var f = tv(B.fwd.x * Math.cos(w.steer) + B.right.x * Math.sin(w.steer),
               B.fwd.y * Math.cos(w.steer) + B.right.y * Math.sin(w.steer),
               B.fwd.z * Math.cos(w.steer) + B.right.z * Math.sin(w.steer));
    f.projectPlane(n);
    if (f.lenSq() < 1e-6) f.copy(B.fwd).projectPlane(n);
    f.norm();
    var s = tv().cross(n, f).norm();
    var vt = tv(vc.x - n.x * vn, vc.y - n.y * vn, vc.z - n.z * vn);
    var vf = vt.dot(f), vs = vt.dot(s);
    w.spin = vf / w.radius;
    w.slip = Math.abs(vs);
    var th = this.input.throttle, longA = 0;
    if (th > 0.02) {
      if (vf < -0.6) longA = V.brakeAccel * th;
      else longA = V.driveAccel * th * Math.max(0, 1 - Math.max(0, vf) / V.driveSpeedCap);
    } else if (th < -0.02) {
      if (vf > 0.6) longA = -V.brakeAccel * (-th);
      else longA = -V.reverseAccel * (-th) * Math.max(0, 1 - Math.max(0, -vf) / V.reverseSpeedCap);
    } else {
      longA = -sgn(vf) * Math.min(V.coastDecel, Math.abs(vf) / Math.max(dt, 1e-4) * 0.25);
    }
    var fl = longA * B.mass * 0.25;
    var maxLong = latMu * fn * 1.35 + 40;
    fl = clamp(fl, -maxLong, maxLong);
    var fs = -vs * gripK * B.mass * 0.25;
    var maxLat = latMu * fn + 24;
    fs = clamp(fs, -maxLat, maxLat);
    var F = tv(n.x * fn + f.x * fl, n.y * fn + f.y * fl, n.z * fn + f.z * fl);

    // Ceiling release: Never allow driving throttle force to stick car upwards into ceiling
    var isCeiling = (n.y < -0.15 || (B.pos.y > (CFG.arena.height || 20) - 3.2 && B.up.y < -0.15));
    if (isCeiling) {
      if (F.y > 0) F.y = 0;
      F.x *= 0.35;
      F.z *= 0.35;
    }

    B.addForceAt(F, w.contact);
    var lift = tv(B.pos.x - w.contact.x, B.pos.y - w.contact.y, B.pos.z - w.contact.z).dot(n) * 0.92;
    var latPoint = tv(w.contact.x + n.x * lift, w.contact.y + n.y * lift, w.contact.z + n.z * lift);
    if (isCeiling) fs *= 0.2;
    B.addForceAt(tv(s.x * fs, s.y * fs, s.z * fs), latPoint);
    var stick = V.stickAccel * clamp(this.speed() / V.stickSpeedRef, 0.28, 1.35);
    if (n.y < -0.15 || isCeiling) {
      stick = 0; // On ceiling: do not force wheels into ceiling, allow gravity to pull car down
    }
    if (stick > 0) {
      B.addForceAt(tv(-n.x, -n.y, -n.z).scale(stick * B.mass * 0.25), w.contact);
    }
  }

  // Aerodynamic downforce: applies downward force to keep the car planted, distributed front-heavy (55/45) to prevent front wheel lifting/wheelies during hard acceleration
  if (this.grounded && W.downforce && W.downforce > 0) {
    var speedScale = clamp(this.speed() / 15.0, 0.25, 1.50);
    var totalDf = W.downforce * B.mass * speedScale;

    // Front downforce (55%)
    var frontPos = tv(B.pos.x + B.fwd.x * 0.3, B.pos.y + B.fwd.y * 0.3, B.pos.z + B.fwd.z * 0.3);
    B.addForceAt(tv(-B.up.x * totalDf * 0.55, -B.up.y * totalDf * 0.55, -B.up.z * totalDf * 0.55), frontPos);

    // Rear downforce (45%)
    var rearPos = tv(B.pos.x - B.fwd.x * 0.3, B.pos.y - B.fwd.y * 0.3, B.pos.z - B.fwd.z * 0.3);
    B.addForceAt(tv(-B.up.x * totalDf * 0.45, -B.up.y * totalDf * 0.45, -B.up.z * totalDf * 0.45), rearPos);
  }

  if (this.wheelsDown >= 2) {
    var yl = B.quat.rotateInv(B.angVel, tv());
    var driftDampScale = 1.0 + this.slideAmount * (V.driftYawDamp !== undefined ? V.driftYawDamp : 7.5);
    var maxYawRate = lerp(2.6, 1.85, this.slideAmount);
    var excess = Math.abs(yl.y) - maxYawRate;
    if (excess > 0) {
      var damp = tv(0, -sgn(yl.y) * excess * 3.4 * driftDampScale, 0);
      B.addAngAccel(B.quat.rotate(damp, tv()), dt);
    }
  }
  if (this.wheelsDown >= 2 && this.surfaceNormal.y > -0.2) {
    var axis = tv().cross(B.up, this.surfaceNormal);
    var align = tv(axis.x * 9.5, axis.y * 9.5, axis.z * 9.5);
    var wLocalUpComp = tv(B.angVel.x, B.angVel.y, B.angVel.z);
    var upComp = wLocalUpComp.dot(B.up);
    align.addS(tv(B.angVel.x - B.up.x * upComp, B.angVel.y - B.up.y * upComp, B.angVel.z - B.up.z * upComp), -4.2);
    B.addAngAccel(align, dt);
  }
};
Vehicle.prototype.applyAirControl = function (dt) {
  var B = this.body, A = CFG.vehicle.air, sens = (CFG.input && CFG.input.airSens) ? CFG.input.airSens : 1.0;
  var roll = this.input.roll + (this.input.rollLeft ? 1 : 0) + (this.input.rollRight ? -1 : 0);
  var yaw = this.input.yaw, pitch = this.input.pitch;
  if (this.input.rollLeft || this.input.rollRight) { roll = clamp(roll, -1, 1); }
  else if (Math.abs(this.input.roll) > 0.02) roll = clamp(this.input.roll, -1, 1);

  // Convert current angular velocity to local car frame
  var local = B.quat.rotateInv(B.angVel, tv());

  // Terminal angular velocities (Max Air Rotation Speed Cap)
  var maxAirSpeed = A.maxAirAngSpeed !== undefined ? A.maxAirAngSpeed : 5.5;
  var maxPitch = maxAirSpeed * 1.0;
  var maxYaw = maxAirSpeed * 0.85;
  var maxRoll = maxAirSpeed * 1.18;

  var targetX = pitch * maxPitch * sens;
  var targetY = -yaw * maxYaw * sens;
  var targetZ = -roll * maxRoll * sens;

  var damp = A.damp !== undefined ? A.damp : 6.5;
  var rollDamp = A.rollDamp !== undefined ? A.rollDamp : 8.5;

  // 1. PITCH (Local X - Nose Up/Down)
  if (Math.abs(pitch) > 0.04) {
    var sgnP = pitch > 0 ? 1 : -1;
    // Accelerate only if below the target cap in this direction
    if (local.x * sgnP < targetX * sgnP) {
      local.x += pitch * A.pitch * sens * dt;
      if (local.x * sgnP > targetX * sgnP) {
        local.x = targetX;
      }
    } else {
      // Natural aerodynamic resistance back towards target speed if exceeding
      local.x += (targetX - local.x) * Math.min(1, 9.0 * dt);
    }
  } else {
    // When pitch control is released, immediately damp rotation to 0 so it halts cleanly without spinning away!
    local.x *= Math.exp(-damp * dt);
    if (Math.abs(local.x) < 0.02) local.x = 0;
  }

  // 2. YAW (Local Y - Turn Left/Right in air)
  if (Math.abs(yaw) > 0.04) {
    var sgnY = targetY > 0 ? 1 : -1;
    if (local.y * sgnY < targetY * sgnY) {
      local.y += -yaw * A.yaw * sens * dt;
      if (local.y * sgnY > targetY * sgnY) {
        local.y = targetY;
      }
    } else {
      local.y += (targetY - local.y) * Math.min(1, 9.0 * dt);
    }
  } else {
    local.y *= Math.exp(-damp * dt);
    if (Math.abs(local.y) < 0.02) local.y = 0;
  }

  // 3. ROLL (Local Z - Barrel Roll / Air Roll)
  if (Math.abs(roll) > 0.04) {
    var sgnR = targetZ > 0 ? 1 : -1;
    if (local.z * sgnR < targetZ * sgnR) {
      local.z += -roll * A.roll * sens * dt;
      if (local.z * sgnR > targetZ * sgnR) {
        local.z = targetZ;
      }
    } else {
      local.z += (targetZ - local.z) * Math.min(1, 10.0 * dt);
    }
  } else {
    local.z *= Math.exp(-rollDamp * dt);
    if (Math.abs(local.z) < 0.02) local.z = 0;
  }

  // If not performing an explosive dodge flick, enforce strict cap on local angular rates
  if (!this.flipping) {
    local.x = clamp(local.x, -maxPitch, maxPitch);
    local.y = clamp(local.y, -maxYaw, maxYaw);
    local.z = clamp(local.z, -maxRoll, maxRoll);
  }

  // Rotate local angular velocity back into world frame
  B.quat.rotate(local, B.angVel);
  B.angVel.clampLen(CFG.physics.maxAngSpeed);
};
Vehicle.prototype.jump = function (up, isSecondJump) {
  var B = this.body, J = CFG.vehicle.jump;
  if (!isSecondJump) {
    B.vel.addS(up, J.impulse);
    this.jumpHeld = J.holdTime;
    this.jumpCooldown = J.cooldown || 0.05;
    this.airTime = 0.01;
    this.grounded = false;
    this.wheelsDown = 0;
    this.groundTime = 0;
    for (var w = 0; w < this.wheels.length; w++) {
      this.wheels[w].grounded = false;
      this.wheels[w].compression = 0;
    }
  } else {
    var impulse = J.secondImpulse || J.impulse;
    var curUpVy = B.vel.dot(up);
    if (curUpVy > 0) {
      var addedVy = Math.max(impulse * 0.45, Math.min(impulse, (J.maxJumpVel || 8.0) - curUpVy));
      B.vel.addS(up, addedVy);
    } else {
      var newUpVy = Math.max(0, curUpVy) + impulse;
      B.vel.addS(up, newUpVy - curUpVy);
    }
    this.jumpHeld = 0;
    this.jumpCooldown = 0.05;
  }
};
Vehicle.prototype.startDodge = function (dirLocal) {
  var B = this.body, D = CFG.vehicle.dodge;
  var world = B.quat.rotate(dirLocal, tv());
  var flat = tv(world.x, world.y, world.z).projectPlane(B.up);
  if (flat.lenSq() < 1e-6) flat.copy(B.fwd).projectPlane(B.up);
  flat.norm();
  var axis = tv().cross(B.up, flat).norm();
  var speed = B.vel.len();

  // Instant linear flick impulse (pop in the direction of the dodge)
  var surgeMultiplier = D.flickSurge || 1.35;
  B.vel.addS(flat, D.speed * surgeMultiplier);
  if (dirLocal.z < -0.3) {
    B.vel.addS(B.up, D.upSpeed * 1.2);
  } else if (dirLocal.z > 0.2) {
    // Dynamic upward clearance for low / early front-flips: ensures nose does not catch turf
    var lowFlipBoost = (this.airTime < 0.35) ? 1.05 : 0.75;
    B.vel.addS(B.up, D.upSpeed * lowFlipBoost);
  } else {
    B.vel.addS(B.up, D.upSpeed * 0.85);
  }
  B.vel.clampLen(Math.max(speed + D.speed * 0.4, CFG.physics.maxCarSpeed));

  this.dodgeAxis.copy(axis);
  this.dodgeDir.copy(dirLocal);
  this.dodgeDuration = D.duration || 0.52;
  this.dodgeTimer = this.dodgeDuration;
  this.flipping = true;

  // Explosive initial torque kick (the "flick" whip / tap impulse!)
  var flickMultiplier = D.flickTorque || 1.45;
  var targetKick = D.angRate * flickMultiplier;
  var w = tc(B.angVel);
  var along = w.dot(axis);
  B.angVel.addS(axis, targetKick - along);
  B.angVel.clampLen(CFG.physics.maxAngSpeed);
};
Vehicle.prototype.jumpRoofRighting = function (world) {
  var B = this.body;
  // 1. Pop car up off the ground with a generous impulse
  var curVy = B.vel.y;
  if (curVy < 0) B.vel.y = 0;
  B.vel.y += 4.8;

  // 2. Set torque to rotate 180 degrees onto wheels
  var axis = tv().cross(B.up, LY);
  if (axis.lenSq() < 1e-4) axis.copy(B.fwd);
  axis.norm();

  // Angular speed sufficient to smoothly roll 180 deg upright
  B.angVel.copy(axis.scale(5.5));

  this.turtleState = 1;
  this.rightingTimer = 0.65;
  this.jumpsUsed = 1;
  this.jumpCooldown = 0.25;
  this.chassisContact = 0;
  this.roofContact = 0;
  this.airTime = 0.05;
  this.upsideTime = 0;

  if (world) {
    world.contacts.push({ type: "jump", pos: B.pos.clone(), car: this.index });
  }
};
Vehicle.prototype.updateJumpState = function (dt, world) {
  var J = CFG.vehicle.jump, D = CFG.vehicle.dodge, B = this.body;
  this.jumpCooldown = Math.max(0, this.jumpCooldown - dt);
  if (this.jumpBuffer > 0) this.jumpBuffer = Math.max(0, this.jumpBuffer - dt);

  // Exact detection: Car is inverted on ground (roof touching surface)
  var isUpsideDown = (B.up.y < -0.15);
  var isTouchingGroundOnRoof = (!this.grounded && (this.roofContact > 0 || (this.chassisContact > 0 && isUpsideDown && B.pos.y < 1.45)));

  if (this.grounded) {
    this.groundTime += dt;
    if (this.airTime > 0.12 && world) {
      var impact = Math.abs(this.landImpact);
      world.contacts.push({ type: "land", pos: this.body.pos.clone(), impulse: impact, car: this.index });
    }
    this.airTime = 0;
    this.turtleState = 0;
    this.rightingTimer = 0;
    if (this.jumpCooldown <= 0) {
      this.jumpsUsed = 0;
      this.canDodge = true;
      this.flipping = false;
    }
  } else {
    this.airTime += dt;
    this.groundTime = 0;

    if (this.rightingTimer > 0) {
      this.rightingTimer -= dt;
      if (this.rightingTimer <= 0) this.rightingTimer = 0;
    }

    // If the car failed to land on wheels and fell back on its roof on the ground, allow repeating the roof jump!
    if (isTouchingGroundOnRoof && this.turtleState !== 0) {
      if (this.airTime > 0.15 || this.roofContact > 0) {
        this.turtleState = 0;
        this.rightingTimer = 0;
        this.jumpCooldown = 0;
        this.jumpsUsed = 0;
      }
    }
  }
  if (this.dodgeTimer > 0) {
    var totalD = this.dodgeDuration || D.duration || 0.52;
    var progress = 1.0 - (this.dodgeTimer / totalD); // 0.0 -> 1.0
    this.dodgeTimer -= dt;

    // Whip / Flick curve: Explosive initial torque, sustained rotation, easing into smooth finish
    var torqueProfile = 1.0;
    if (progress < 0.25) {
      torqueProfile = D.flickTorque || 1.45; // Sharp flick pop
    } else if (progress < 0.70) {
      torqueProfile = 1.15; // Sustained rotational drive
    } else {
      // Smooth deceleration curve so car doesn't freeze or hit an artificial brick wall
      torqueProfile = Math.max(0.20, (1.0 - progress) * 2.8);
    }

    var targetAng = D.angRate * torqueProfile;
    var curAlong = tc(B.angVel).dot(this.dodgeAxis);
    var torqueStep = (targetAng - curAlong) * Math.min(1.0, dt * 28.0);
    B.angVel.addS(this.dodgeAxis, torqueStep);

    // Forward flick acceleration surge in the initial phase (momentum carryover)
    if (progress < 0.35) {
      var worldDir = B.quat.rotate(this.dodgeDir, tv());
      worldDir.projectPlane(B.up).norm();
      B.vel.addS(worldDir, D.speed * dt * 2.5 * (1.0 - progress / 0.35));
    }

    if (this.dodgeTimer <= 0) {
      this.dodgeTimer = 0;
      this.flipping = false;
      // Natural momentum transfer: keep remaining rotational momentum with smooth air damping
      var postAlong = tc(B.angVel).dot(this.dodgeAxis);
      B.angVel.addS(this.dodgeAxis, -postAlong * 0.30);
    }
  }

  // Register jump button down event into responsive input buffer
  if (this.input.jumpEdge) {
    this.input.jumpEdge = false;
    this.jumpBuffer = 0.18;
  }

  // Process jump buffer
  if (this.jumpBuffer > 0) {
    // CASE 1: Car is physically upside-down / on roof on the ground -> Jump once to flip right side up
    if (isTouchingGroundOnRoof && this.turtleState === 0 && this.jumpCooldown <= 0) {
      this.jumpBuffer = 0;
      this.jumpRoofRighting(world);
    }
    // CASE 2: Normal jump from wheels on ground
    else if (this.grounded && this.jumpCooldown <= 0 && this.jumpsUsed === 0) {
      this.jumpBuffer = 0;
      this.jump(this.surfaceNormal.y > 0.2 ? this.body.up : this.surfaceNormal, false);
      this.jumpsUsed = 1;
      this.canDodge = true;
      if (world) world.contacts.push({ type: "jump", pos: this.body.pos.clone(), car: this.index });
    }
    // CASE 3: Mid-air double jump or dodge/flip
    // Works either after jump 1 (within doubleWindow) or when airborne/free-falling/off wall without jumping
    else if (!this.grounded && this.turtleState === 0 && ((this.jumpsUsed === 1 && this.airTime < (J.doubleWindow || 1.85)) || (this.jumpsUsed === 0 && this.airTime > 0.04))) {
      this.jumpBuffer = 0;
      var dx = -this.input.steer;
      var dz = this.input.throttle;
      if (Math.abs(this.input.pitch) > 0.1) dz = this.input.pitch;
      if (Math.abs(this.input.yaw) > 0.1) dx = -this.input.yaw;
      if (this.input.rollLeft) dx = 1;
      if (this.input.rollRight) dx = -1;
      var mag = Math.sqrt(dx * dx + dz * dz);
      this.jumpsUsed = 2;
      if (mag > (D.deadzone || 0.16) && this.canDodge) {
        var d = tv(dx / mag, 0, dz / mag);
        this.startDodge(d);
        this.canDodge = false;
        if (world) world.contacts.push({ type: "dodge", pos: this.body.pos.clone(), car: this.index });
      } else {
        this.jump(this.body.up, true);
        if (world) world.contacts.push({ type: "jump", pos: this.body.pos.clone(), car: this.index });
      }
    }
  }

  if (this.input.jump && this.jumpHeld > 0 && !this.grounded && this.turtleState === 0) {
    this.jumpHeld -= dt;
    this.body.vel.addS(this.body.up, J.holdAccel * dt);
  } else if (!this.input.jump) {
    this.jumpHeld = 0;
  }
};
Vehicle.prototype.applyBoost = function (dt, world) {
  var B = this.body, BO = CFG.vehicle.boost;
  this.boostActive = false;
  if (this.input.boost && this.boost > 0) {
    this.boost = Math.max(0, this.boost - BO.consume * dt);
    this.boostUsed += BO.consume * dt;
    this.stats.boostUsed += BO.consume * dt;
    this.boostActive = true;
    var sp = B.vel.len();
    if (sp < BO.speedCap - 0.01) B.addAccel(tv(B.fwd.x * BO.accel, B.fwd.y * BO.accel, B.fwd.z * BO.accel));
    else {
      var dir = tc(B.vel).norm();
      var a = tv(B.fwd.x * BO.accel, B.fwd.y * BO.accel, B.fwd.z * BO.accel);
      a.addS(dir, -Math.max(0, a.dot(dir)));
      B.addAccel(a);
    }
  }
};
Vehicle.prototype.recover = function (dt, world) {
  // Automatic slow flip disabled - player triggers recovery via manual jump when on roof
};
Vehicle.prototype.step = function (dt, arena, world) {
  var B = this.body, V = CFG.vehicle;
  B.updateBasis();
  this.castWheels(arena);
  var wasGrounded = this.grounded;
  if (this.grounded) {
    this.applyWheelForces(dt);
    B.vel.scale(Math.exp(-V.groundDrag * dt * 6));
  } else if (this.dodgeTimer <= 0) {
    this.applyAirControl(dt);
    B.vel.scale(Math.exp(-V.airDrag * dt * 6));
  } else {
    B.vel.scale(Math.exp(-V.airDrag * dt * 6));
  }
  this.applyBoost(dt, world);
  var gravY = -CFG.physics.gravity;
  var isCeilingActive = (this.surfaceNormal.y < -0.15 || (B.pos.y > (CFG.arena.height || 20) - 3.2 && B.up.y < -0.15));
  if (this.grounded) {
    if (this.surfaceNormal.y > 0 && this.surfaceNormal.y < 0.88 && this.input.throttle > 0) {
      // Slope / Wall climb: Compensate gravity drag on ramps so climbing ramps is fast and smooth
      var rampAssist = CFG.physics.gravity * 0.65 * (1 - Math.max(0, this.surfaceNormal.y));
      gravY += rampAssist;
    }
    if (isCeilingActive) {
      // On ceiling: Ensure strong downward gravity pulls car off ceiling even when throttle is held
      gravY = -CFG.physics.gravity * 1.35;
    }
  }
  B.addAccel(tv(0, gravY, 0));
  this.updateJumpState(dt, world);
  this.recover(dt, world);
  this.ballCooldown = Math.max(0, this.ballCooldown - dt);
  this.chassisContact = Math.max(0, this.chassisContact - dt);
  this.roofContact = Math.max(0, this.roofContact - dt);
  var preVel = tc(B.vel);
  B.integrate(dt, CFG.physics.maxCarSpeed, CFG.physics.maxAngSpeed);
  if (!wasGrounded) this.landImpact = preVel.dot(this.surfaceNormal);
  if (!B.sanitize()) this.needsRespawn = true;
};

var HULL_PTS = null;
export function hullPoints(V, scale) {
  var s = scale || (CFG.vehicle.carScale !== undefined ? CFG.vehicle.carScale : 2.75);
  var pts = [];
  var hx = V.hx * s, hy = V.hy * s, hz = V.hz * s;
  for (var sx = -1; sx <= 1; sx += 2)
    for (var sy = -1; sy <= 1; sy += 2)
      for (var sz = -1; sz <= 1; sz += 2)
        pts.push(new V3(sx * hx, sy * hy, sz * hz));
  pts.push(new V3(0, hy, 0), new V3(0, -hy, 0), new V3(hx, 0, 0), new V3(-hx, 0, 0),
           new V3(0, 0, hz), new V3(0, 0, -hz));
  return pts;
}

export function collideCarArena(car, arena, world) {
  var B = car.body, V = CFG.vehicle;
  var CAR_SCALE = (CFG.vehicle.carScale !== undefined ? CFG.vehicle.carScale : 2.75);
  var elevationOffset = (V.hitboxElevationOffset !== undefined ? V.hitboxElevationOffset : 0.0) * CAR_SCALE;
  var groundRestHeight = V.wheel.radius + V.wheel.rest - V.wheel.attachY;
  var upOffset = (CAR_SCALE - 1.0) * groundRestHeight + elevationOffset;
  var carCenter = tv(B.pos.x + B.up.x * upOffset, B.pos.y + B.up.y * upOffset, B.pos.z + B.up.z * upOffset);
  var pts = hullPoints(V, CAR_SCALE);
  var maxPen = 0, deepest = null, deepN = null, hits = 0;

  var isFlippingOrDodging = (car.flipping || car.dodgeTimer > 0 || (car.jumpsUsed > 0 && car.airTime < 0.40));
  var antiSnagFactor = (V.flipAntiSnag !== undefined ? V.flipAntiSnag : 0.90);

  for (var i = 0; i < pts.length; i++) {
    var p = B.quat.rotate(pts[i], tv());
    p.add(carCenter);

    // Goal posts and crossbar clearance: the car never collides with posts or crossbar
    var absZ = Math.abs(p.z);
    var absX = Math.abs(p.x);
    if (Math.abs(absZ - arena.hz) < 3.5) {
      if (absX <= arena.goalHalfW + 2.5 && p.y >= -0.2 && p.y <= arena.goalHeight + 2.5) {
        continue;
      }
    }

    var d = arena.dist(p, true);
    if (d >= 0) continue;
    var n = arena.normal(p, tv(), true);
    var pen = -d;
    hits++;
    var pre = B.pointVel(p, tv()).dot(n);

    var restitution = CFG.arena.wallRestitution * 0.7;
    var friction = CFG.arena.wallFriction;
    var resolvePoint = p;

    // Floor contact during flip or low double jump: Prevent turf snag and unnatural violent torque spin
    if (isFlippingOrDodging && n.y > 0.6) {
      friction *= Math.max(0.05, 1.0 - antiSnagFactor * 0.85);
      restitution *= 0.25;
      // Shift contact point towards car center of mass to damp aggressive torque jerk
      var toCenter = tv(carCenter.x - p.x, carCenter.y - p.y, carCenter.z - p.z);
      var blend = antiSnagFactor * 0.75;
      resolvePoint = tv(p.x + toCenter.x * blend, p.y, p.z + toCenter.z * blend);
      // Damp angular velocity along horizontal plane slightly to prevent cartwheeling into the turf
      if (antiSnagFactor > 0.1) {
        B.angVel.x *= (1.0 - antiSnagFactor * 0.08);
        B.angVel.z *= (1.0 - antiSnagFactor * 0.08);
      }
    }

    var j = resolveStatic(B, resolvePoint, n, pen, restitution, friction, true);
    if (pen > maxPen) { maxPen = pen; deepest = p.clone(); deepN = n.clone(); }
    if (pts[i].y > 0.05 && n.y > 0.3) {
      car.roofContact = 0.16;
    }
    if (j > 55 && -pre > 3.2 && world) {
      world.contacts.push({ type: "carWall", pos: p.clone(), normal: n.clone(), impulse: j, speed: -pre, car: car.index });
    }
  }
  if (hits) car.chassisContact = 0.12;
  return maxPen;
}

export function collideCarBall(car, ball, dt, world) {
  var B = car.body, S = ball.body, V = CFG.vehicle, BC = CFG.ball;
  var CAR_SCALE = (CFG.vehicle.carScale !== undefined ? CFG.vehicle.carScale : 2.75);
  var scaleX = (V.ballHitboxScaleX || 1.25);
  var scaleY = (V.ballHitboxScaleY || 1.20);
  var scaleZ = (V.ballHitboxScaleZ || 1.25);

  var elevationOffset = (V.hitboxElevationOffset !== undefined ? V.hitboxElevationOffset : 0.0) * CAR_SCALE;
  var groundRestHeight = V.wheel.radius + V.wheel.rest - V.wheel.attachY;
  var upOffset = (CAR_SCALE - 1.0) * groundRestHeight + elevationOffset;
  var carCenter = tv(B.pos.x + B.up.x * upOffset, B.pos.y + B.up.y * upOffset, B.pos.z + B.up.z * upOffset);

  var hx = V.hx * CAR_SCALE * scaleX;
  var hy = V.hy * CAR_SCALE * scaleY;
  var hz = V.hz * CAR_SCALE * scaleZ;

  var roundness = Math.min(1.0, Math.max(0.0, V.ballBoxRoundness !== undefined ? V.ballBoxRoundness : 0.20));
  var maxR = Math.min(hx, Math.min(hy, hz));
  var r = roundness * maxR;
  var hxInner = Math.max(0, hx - r), hyInner = Math.max(0, hy - r), hzInner = Math.max(0, hz - r);

  var rel = tv(S.pos.x - carCenter.x, S.pos.y - carCenter.y, S.pos.z - carCenter.z);
  var maxReach = Math.max(hx, Math.max(hy, hz)) + ball.radius + 1.5;
  if (rel.lenSq() > maxReach * maxReach) return null;

  var loc = B.quat.rotateInv(rel, tv());
  var cx = clamp(loc.x, -hxInner, hxInner);
  var cy = clamp(loc.y, -hyInner, hyInner);
  var cz = clamp(loc.z, -hzInner, hzInner);
  var dx = loc.x - cx, dy = loc.y - cy, dz = loc.z - cz;
  var d2 = dx * dx + dy * dy + dz * dz;
  var nLocal = tv(), dist;
  if (d2 < 1e-10) {
    var px = hx - Math.abs(loc.x), py = hy - Math.abs(loc.y), pz = hz - Math.abs(loc.z);
    if (px <= py && px <= pz) nLocal.set(sgn(loc.x) || 1, 0, 0);
    else if (py <= pz) nLocal.set(0, sgn(loc.y) || 1, 0);
    else nLocal.set(0, 0, sgn(loc.z) || 1);
    dist = -r;
  } else {
    var dLen = Math.sqrt(d2);
    dist = dLen - r;
    if (dist >= ball.radius) return null;
    nLocal.set(dx / dLen, dy / dLen, dz / dLen);
  }
  var contactLocal = tv(cx + nLocal.x * r, cy + nLocal.y * r, cz + nLocal.z * r);
  var surface = surfaceOf(contactLocal, V, CAR_SCALE, { x: scaleX, y: scaleY, z: scaleZ });
  var n = B.quat.rotate(nLocal, tv());
  var contact = B.quat.rotate(contactLocal, tv());
  contact.add(carCenter);
  var pen = ball.radius - dist;

  var vCar = B.pointVel(contact, tv());
  var vBall = S.pointVel(contact, tv());
  var rv = tv(vBall.x - vCar.x, vBall.y - vCar.y, vBall.z - vCar.z);
  var vn = rv.dot(n);

  var carPushBack = (BC.carPushBack !== undefined ? BC.carPushBack : 0.02);
  if (pen > 0.001) {
    S.pos.addS(n, pen * (1.0 - carPushBack));
    B.pos.addS(n, -pen * carPushBack);
  }
  var impulse = 0;
  if (vn < 0) {
    var carReaction = (BC.carReaction !== undefined ? BC.carReaction : 0.04);
    var carAngularReaction = (BC.carAngularReaction !== undefined ? BC.carAngularReaction : 0.02);
    var effA = B.effInvMass(contact, n), effB = S.effInvMass(contact, n);
    var eff = effA * carReaction + effB;
    if (eff > 1e-9) {
      var e = BC.restitutionCar;
      var j = -(1 + e) * vn / eff;
      impulse = j;
      S.applyImpulse(tv(n.x * j, n.y * j, n.z * j), contact);

      // Heavy vehicle simulation: car experiences minimal recoil velocity
      if (carReaction > 0) {
        B.vel.addS(tv(-n.x * j * carReaction, -n.y * j * carReaction, -n.z * j * carReaction), B.invMass);
      }

      // Attenuated angular deflection: prevents car from violently spinning/deflecting heading on ball hit
      if (carAngularReaction > 1e-6) {
        var rImp = tv(contact.x - B.pos.x, contact.y - B.pos.y, contact.z - B.pos.z);
        var tAng = tv().cross(rImp, tv(-n.x * j * carAngularReaction, -n.y * j * carAngularReaction, -n.z * j * carAngularReaction));
        var dw = B.iinv(tAng, tv());
        B.angVel.add(dw);
      }

      var vt = tv(rv.x - n.x * vn, rv.y - n.y * vn, rv.z - n.z * vn);
      var tl = vt.len();
      if (tl > 1e-4) {
        var t = tv(-vt.x / tl, -vt.y / tl, -vt.z / tl);
        var effT = S.effInvMass(contact, t) + B.effInvMass(contact, t) * carReaction;
        var jt = Math.min(tl / effT, BC.friction * j);
        S.applyImpulse(tv(t.x * jt, t.y * jt, t.z * jt), contact);
        if (carReaction > 0) {
          B.vel.addS(tv(-t.x * jt * carReaction, -t.y * jt * carReaction, -t.z * jt * carReaction), B.invMass);
        }
        if (carAngularReaction > 1e-6) {
          var rImpT = tv(contact.x - B.pos.x, contact.y - B.pos.y, contact.z - B.pos.z);
          var tAngT = tv().cross(rImpT, tv(-t.x * jt * carAngularReaction, -t.y * jt * carAngularReaction, -t.z * jt * carAngularReaction));
          var dwT = B.iinv(tAngT, tv());
          B.angVel.add(dwT);
        }
      }
      if (car.ballCooldown <= 0) {
        var approach = -vn;
        var mag = Math.min(BC.kickBase * 0.35 + BC.kickSlope * approach * 1.6, BC.kickMax);
        mag *= BC.kickScale * surfaceKick(surface);
        if (car.boostActive) mag *= 1.12;
        if (car.dodgeTimer > 0) mag *= 1.2;
        if (mag > 0.05) S.vel.addS(n, mag);
        car.ballCooldown = 0.055;
        car.stats.touches++;
        ball.lastTouch = car.index;
        ball.lastTouchTeam = car.team;
        ball.hitFlash = 1;
        if (world) {
          ball.lastTouchTime = world.time;
          world.contacts.push({ type: "ballCar", pos: contact.clone(), normal: n.clone(), impulse: j,
                                speed: approach, car: car.index, surface: surface });
        }
      }
      S.vel.clampLen(CFG.physics.maxBallSpeed);
      car.debug.contact = contact.clone();
      car.debug.normal = n.clone();
      car.debug.impulse = j;
      car.debug.relVel = rv.len();
      car.debug.surface = surface;
      car.lastImpact = 0.25;
    }
  }
  return impulse;
}

export function collideCarCar(a, b, world) {
  var V = CFG.vehicle, A = a.body, Bb = b.body;
  var CAR_SCALE = 2.75;
  var groundRestHeight = V.wheel.radius + V.wheel.rest - V.wheel.attachY;
  var upOffset = (CAR_SCALE - 1.0) * groundRestHeight;
  var aCenter = tv(A.pos.x + A.up.x * upOffset, A.pos.y + A.up.y * upOffset, A.pos.z + A.up.z * upOffset);
  var bCenter = tv(Bb.pos.x + Bb.up.x * upOffset, Bb.pos.y + Bb.up.y * upOffset, Bb.pos.z + Bb.up.z * upOffset);

  var hx = V.hx * CAR_SCALE, hy = V.hy * CAR_SCALE, hz = V.hz * CAR_SCALE;
  var maxDist = Math.max(hx, hz) * 2 + 1.0;
  if (aCenter.distSq(bCenter) > maxDist * maxDist) return;

  var pts = hullPoints(V, CAR_SCALE), any = 0;
  for (var i = 0; i < pts.length; i++) {
    var p = A.quat.rotate(pts[i], tv());
    p.add(aCenter);
    var loc = Bb.quat.rotateInv(tv(p.x - bCenter.x, p.y - bCenter.y, p.z - bCenter.z), tv());
    var px = hx - Math.abs(loc.x), py = hy - Math.abs(loc.y), pz = hz - Math.abs(loc.z);
    if (px <= 0 || py <= 0 || pz <= 0) continue;
    var nLocal = tv(), pen;
    if (px <= py && px <= pz) { nLocal.set(sgn(loc.x) || 1, 0, 0); pen = px; }
    else if (py <= pz) { nLocal.set(0, sgn(loc.y) || 1, 0); pen = py; }
    else { nLocal.set(0, 0, sgn(loc.z) || 1); pen = pz; }
    var n = Bb.quat.rotate(nLocal, tv());
    var va = A.pointVel(p, tv()), vb = Bb.pointVel(p, tv());
    var rv = tv(va.x - vb.x, va.y - vb.y, va.z - vb.z);
    var vn = rv.dot(n);
    A.pos.addS(n, pen * 0.5);
    Bb.pos.addS(n, -pen * 0.5);
    if (vn < 0) {
      var eff = A.effInvMass(p, n) + Bb.effInvMass(p, n);
      if (eff > 1e-9) {
        var j = -(1 + 0.16) * vn / eff;
        A.applyImpulse(tv(n.x * j, n.y * j, n.z * j), p);
        Bb.applyImpulse(tv(-n.x * j, -n.y * j, -n.z * j), p);
        if (j > 90 && world && !any) {
          world.contacts.push({ type: "carCar", pos: p.clone(), normal: n.clone(), impulse: j, car: a.index, other: b.index });
          a.lastImpact = 0.25; b.lastImpact = 0.25;
        }
        any = 1;
      }
    }
  }
}

export function predictBall(ball, arena, horizon, step, out) {
  var p = new V3().copy(ball.body.pos), v = new V3().copy(ball.body.vel);
  var C = CFG.ball, g = CFG.physics.gravity, R = ball.radius;
  var n = new V3(), t = 0, i = 0;
  out.length = 0;
  while (t < horizon && i < 200) {
    v.y -= g * step;
    v.scale(Math.exp(-C.drag * step * 6));
    p.addS(v, step);
    var d = arena.dist(p);
    if (d < R) {
      arena.normal(p, n);
      var vn = v.dot(n);
      p.addS(n, R - d);
      if (vn < 0) v.addS(n, -(1 + CFG.arena.wallRestitution + C.restitution * 0.55) * vn);
      v.scale(0.985);
    }
    out.push({ x: p.x, y: p.y, z: p.z, t: t, vy: v.y, sp: v.len() });
    t += step; i++;
  }
  return out;
}
