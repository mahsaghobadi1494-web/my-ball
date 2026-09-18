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
  if (Math.abs(p.x) < this.goalHalfW && p.y < this.goalHeight) {
    if (p.z > this.hz - this.mouthInset) return 1;
    if (p.z < -(this.hz - this.mouthInset)) return -1;
  }
  return 0;
};
Arena.prototype.dist = function (p) {
  var s = this.region(p);
  if (s !== 0) {
    var back = (this.hz + this.goalDepth) - s * p.z;
    var dx = this.goalHalfW - Math.abs(p.x);
    return Math.min(dx, p.y, this.goalHeight - p.y, back);
  }
  return -this.sdShell(p);
};
Arena.prototype.normal = function (p, out) {
  out = out || tv();
  var e = this.gradEps, a = tv();
  a.set(p.x + e, p.y, p.z); var dx1 = this.dist(a);
  a.set(p.x - e, p.y, p.z); var dx2 = this.dist(a);
  a.set(p.x, p.y + e, p.z); var dy1 = this.dist(a);
  a.set(p.x, p.y - e, p.z); var dy2 = this.dist(a);
  a.set(p.x, p.y, p.z + e); var dz1 = this.dist(a);
  a.set(p.x, p.y, p.z - e); var dz2 = this.dist(a);
  out.set(dx1 - dx2, dy1 - dy2, dz1 - dz2);
  if (out.lenSq() < 1e-14) out.set(0, 1, 0); else out.norm();
  return out;
};
Arena.prototype.ray = function (origin, dir, maxDist, out) {
  var t = 0, p = tv(), d = 0;
  for (var i = 0; i < 28; i++) {
    p.set(origin.x + dir.x * t, origin.y + dir.y * t, origin.z + dir.z * t);
    d = this.dist(p);
    if (d < 0.006) {
      if (out) {
        if (out.point && typeof out.point.set === "function") out.point.set(p.x, p.y, p.z);
        if (out.normal) this.normal(p, out.normal);
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

  var bShell = new Builder(), bCrowd = new Builder();
  var perim = [0];
  for (var q = 1; q < nPts; q++) {
    var pa = rings[0][q - 1], pb = rings[0][q];
    perim.push(perim[q - 1] + Math.sqrt((pa.x - pb.x) * (pa.x - pb.x) + (pa.z - pb.z) * (pa.z - pb.z)));
  }
  for (var r0 = 0; r0 < profile.length - 1; r0++) {
    var P0 = profile[r0], P1 = profile[r0 + 1];
    var crowdRow = (P0.y >= 7.15 && P1.d === 0);
    var B = crowdRow ? bCrowd : bShell;
    var uvs = crowdRow ? 0.11 : 0.25;
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
      var i0 = B.vert(A0.x, P0.y, A0.z, n0.x, n0.y, n0.z, u0, v0);
      var i1 = B.vert(A1.x, P0.y, A1.z, n1.x, n1.y, n1.z, u1, v0);
      var i2 = B.vert(B1.x, P1.y, B1.z, n2.x, n2.y, n2.z, u1, v1);
      var i3 = B.vert(B0.x, P1.y, B0.z, n3.x, n3.y, n3.z, u0, v1);
      B.quadN(i0, i1, i2, i3);
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
    cidx.push(bCeil.vert(cp.x, h, cp.z, 0, -1, 0, cp.x * 0.06, cp.z * 0.06));
  }
  for (var cj = 0; cj < nPts; cj++) bCeil.quadN(cc, cidx[cj], cidx[(cj + 1) % nPts], cc);

  var bLights = new Builder();
  for (var lx = -1; lx <= 1; lx++) {
    for (var lz = -1; lz <= 1; lz += 1) {
      if (lz === 0 && lx === 0) continue;
      bLights.box(5.2, 0.12, 7.0, new V3(lx * 22, h - 0.35, lz * 26), null, 0.2);
    }
  }

  var goals = [];
  for (var g = 0; g < 2; g++) {
    var s = g === 0 ? -1 : 1;
    var bg = new Builder(), bn = new Builder(), bf = new Builder();
    var gw2 = this.goalHalfW, gh = this.goalHeight;
    var z0 = s * (this.hz - f), z1 = s * (this.hz + this.goalDepth);
    var inside = new V3(0, gh * 0.5, s * (this.hz + this.goalDepth * 0.4));
    bg.faceTo(new V3(-gw2, 0, z0), new V3(gw2, 0, z0), new V3(gw2, 0, z1), new V3(-gw2, 0, z1), inside, 0.25);
    bg.faceTo(new V3(-gw2, gh, z0), new V3(gw2, gh, z0), new V3(gw2, gh, z1), new V3(-gw2, gh, z1), inside, 0.25);
    bg.faceTo(new V3(-gw2, 0, z0), new V3(-gw2, gh, z0), new V3(-gw2, gh, z1), new V3(-gw2, 0, z1), inside, 0.25);
    bg.faceTo(new V3(gw2, 0, z0), new V3(gw2, gh, z0), new V3(gw2, gh, z1), new V3(gw2, 0, z1), inside, 0.25);
    bn.faceTo(new V3(-gw2, 0, z1), new V3(gw2, 0, z1), new V3(gw2, gh, z1), new V3(-gw2, gh, z1), inside, 0.55);
    var fo = 0.13;
    bf.box(fo, gh * 0.5 + fo, fo, new V3(-(gw2 + fo), gh * 0.5, s * this.hz), null, 1);
    bf.box(fo, gh * 0.5 + fo, fo, new V3(gw2 + fo, gh * 0.5, s * this.hz), null, 1);
    bf.box(gw2 + fo * 2, fo, fo, new V3(0, gh + fo, s * this.hz), null, 1);
    goals.push({
      team: g, side: s, cavity: R.mesh(bg), net: R.mesh(bn), frame: R.mesh(bf),
      center: new V3(0, gh * 0.35, s * (this.hz + this.goalDepth * 0.5)),
      mouth: new V3(0, gh * 0.4, s * this.hz)
    });
  }

  return {
    floor: R.mesh(bFloor), shell: R.mesh(bShell), crowd: R.mesh(bCrowd),
    ceiling: R.mesh(bCeil), lights: R.mesh(bLights), goals: goals
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
    this.lastGood.p.copy(this.pos); this.lastGood.q.copy(this.quat);
    return true;
  }
  this.pos.copy(this.lastGood.p); this.quat.copy(this.lastGood.q);
  this.vel.zero(); this.angVel.zero();
  this.force.zero(); this.torque.zero();
  this.updateBasis();
  return false;
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
    body.pos.addS(n, (penetration - CFG.physics.contactSlop) * CFG.physics.posCorrect);
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
Ball.prototype.collideArena = function (arena, world) {
  var B = this.body;
  var d = arena.dist(B.pos);
  if (d >= this.radius) { this.grounded = false; return; }
  var n = arena.normal(B.pos, tv());
  var pen = this.radius - d;
  var contact = tv(B.pos.x - n.x * this.radius, B.pos.y - n.y * this.radius, B.pos.z - n.z * this.radius);
  var pre = B.pointVel(contact, tv()).dot(n);
  var j = resolveStatic(B, contact, n, pen, CFG.arena.wallRestitution + this.cfg.restitution * 0.55, this.cfg.wallFriction, true);
  this.grounded = n.y > 0.7;
  if (j > 0.6 && -pre > 1.6 && world) {
    world.contacts.push({ type: "ballWall", pos: contact.clone(), normal: n.clone(), impulse: j, speed: -pre });
  }
};
Ball.prototype.step = function (dt, arena, cars, world) {
  var B = this.body;
  this.applyForces(dt);
  var speed = B.vel.len();
  var sub = clamp(Math.ceil(speed * dt / (this.radius * 0.3)), 1, 8);
  var h = dt / sub;
  for (var s = 0; s < sub; s++) {
    B.pos.addS(B.vel, h);
    B.quat.integrate(B.angVel, h);
    this.collideArena(arena, world);
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
  this.jumpHeld = 0; this.jumpsUsed = 0; this.jumpCooldown = 0;
  this.canDodge = false; this.dodgeTimer = 0; this.dodgeAxis = new V3();
  this.dodgeDir = new V3(); this.flipping = false;
  this.slideAmount = 0;
  this.boostActive = false; this.boostUsed = 0;
  this.chassisContact = 0; this.upsideTime = 0;
  this.ballCooldown = 0;
  this.lastImpact = 0; this.landImpact = 0;
  this.respawnTimer = 0;
  this.surfaceNormal = new V3(0, 1, 0);
  this.stats = { goals: 0, touches: 0, boostUsed: 0, saves: 0 };
  this.debug = { contact: null, normal: null, impulse: 0, relVel: 0, surface: "-" };
}
Vehicle.prototype.speed = function () { return this.body.vel.len(); };
Vehicle.prototype.forwardSpeed = function () { return this.body.vel.dot(this.body.fwd); };
Vehicle.prototype.resetState = function (pos, quat, boost) {
  this.body.teleport(pos, quat);
  this.boost = boost === undefined ? 33 : boost;
  this.grounded = false; this.wheelsDown = 0;
  this.airTime = 0; this.groundTime = 0;
  this.jumpHeld = 0; this.jumpsUsed = 0; this.jumpCooldown = 0;
  this.canDodge = false; this.dodgeTimer = 0; this.flipping = false;
  this.slideAmount = 0; this.boostActive = false;
  this.chassisContact = 0; this.upsideTime = 0; this.ballCooldown = 0;
  this.respawnTimer = 0; this.landImpact = 0;
  for (var i = 0; i < 4; i++) {
    var w = this.wheels[i];
    w.compression = 0; w.prevCompression = 0; w.grounded = false; w.steer = 0; w.spin = 0; w.load = 0; w.slip = 0; w.contactTime = 0;
  }
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
    var t = arena.ray(attach, down, W.maxRay, hit);
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
  var slideF = this.slideAmount * 0.45, slideR = this.slideAmount;

  for (var i = 0; i < 4; i++) {
    var w = this.wheels[i];
    w.steer = smooth(w.steer, w.front ? steerTarget : 0, V.steerRate, dt);
    if (!w.grounded) { w.load = 0; w.slip = 0; w.spin *= Math.exp(-1.5 * dt); continue; }
    w.contactTime += dt;
    var slide = w.front ? slideF : slideR;
    var latMu = V.frictionCircle * lerp(1, 0.34, slide);
    var gripK = lerp(V.grip, V.gripSlide, slide);
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
    B.addForceAt(F, w.contact);
    var lift = tv(B.pos.x - w.contact.x, B.pos.y - w.contact.y, B.pos.z - w.contact.z).dot(n) * 0.92;
    var latPoint = tv(w.contact.x + n.x * lift, w.contact.y + n.y * lift, w.contact.z + n.z * lift);
    B.addForceAt(tv(s.x * fs, s.y * fs, s.z * fs), latPoint);
    var stick = V.stickAccel * clamp(this.speed() / V.stickSpeedRef, 0.28, 1.35);
    B.addForceAt(tv(-n.x, -n.y, -n.z).scale(stick * B.mass * 0.25), w.contact);
  }
  if (this.wheelsDown >= 2) {
    var yl = B.quat.rotateInv(B.angVel, tv());
    var excess = Math.abs(yl.y) - 2.6;
    if (excess > 0) {
      var damp = tv(0, -sgn(yl.y) * excess * 3.4, 0);
      B.addAngAccel(B.quat.rotate(damp, tv()), dt);
    }
  }
  if (this.wheelsDown >= 2) {
    var axis = tv().cross(B.up, this.surfaceNormal);
    var align = tv(axis.x * 9.5, axis.y * 9.5, axis.z * 9.5);
    var wLocalUpComp = tv(B.angVel.x, B.angVel.y, B.angVel.z);
    var upComp = wLocalUpComp.dot(B.up);
    align.addS(tv(B.angVel.x - B.up.x * upComp, B.angVel.y - B.up.y * upComp, B.angVel.z - B.up.z * upComp), -4.2);
    B.addAngAccel(align, dt);
  }
};
Vehicle.prototype.applyAirControl = function (dt) {
  var B = this.body, A = CFG.vehicle.air, sens = CFG.input.airSens;
  var roll = this.input.roll + (this.input.rollLeft ? 1 : 0) + (this.input.rollRight ? -1 : 0);
  var yaw = this.input.yaw, pitch = this.input.pitch;
  if (this.input.rollLeft || this.input.rollRight) { roll = clamp(roll, -1, 1); }
  else if (Math.abs(this.input.roll) > 0.02) roll = clamp(this.input.roll, -1, 1);
  var accel = tv(pitch * A.pitch * sens, -yaw * A.yaw * sens, -roll * A.roll * sens);
  var world = B.quat.rotate(accel, tv());
  B.addAngAccel(world, dt);
  var local = B.quat.rotateInv(B.angVel, tv());
  if (Math.abs(pitch) < 0.06) local.x *= Math.exp(-A.damp * dt);
  if (Math.abs(yaw) < 0.06) local.y *= Math.exp(-A.damp * dt);
  if (Math.abs(roll) < 0.06) local.z *= Math.exp(-A.rollDamp * dt);
  B.quat.rotate(local, B.angVel);
  B.angVel.clampLen(CFG.physics.maxAngSpeed);
};
Vehicle.prototype.jump = function (up) {
  var B = this.body, J = CFG.vehicle.jump;
  B.vel.addS(up, J.impulse);
  this.jumpHeld = J.holdTime;
  this.jumpCooldown = J.cooldown;
  this.airTime = 0;
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
    B.vel.addS(B.up, D.upSpeed * 0.4);
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
Vehicle.prototype.updateJumpState = function (dt, world) {
  var J = CFG.vehicle.jump, D = CFG.vehicle.dodge, B = this.body;
  this.jumpCooldown = Math.max(0, this.jumpCooldown - dt);
  if (this.grounded) {
    this.groundTime += dt;
    if (this.airTime > 0.12 && world) {
      var impact = Math.abs(this.landImpact);
      world.contacts.push({ type: "land", pos: this.body.pos.clone(), impulse: impact, car: this.index });
    }
    this.airTime = 0;
    if (this.jumpCooldown <= 0) { this.jumpsUsed = 0; this.canDodge = true; this.flipping = false; }
  } else {
    this.airTime += dt;
    this.groundTime = 0;
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
  if (this.input.jumpEdge) {
    this.input.jumpEdge = false;
    if (this.grounded && this.jumpCooldown <= 0 && this.jumpsUsed === 0) {
      this.jump(this.surfaceNormal.y > 0.2 ? this.body.up : this.surfaceNormal);
      this.jumpsUsed = 1;
      this.canDodge = true;
      if (world) world.contacts.push({ type: "jump", pos: this.body.pos.clone(), car: this.index });
    } else if (!this.grounded && this.jumpsUsed >= 1 && this.jumpsUsed < 2 && this.airTime < J.doubleWindow) {
      var dx = -this.input.steer;
      var dz = this.input.throttle;
      if (Math.abs(this.input.pitch) > 0.1) dz = this.input.pitch;
      if (Math.abs(this.input.yaw) > 0.1) dx = -this.input.yaw;
      if (this.input.rollLeft) dx = 1;
      if (this.input.rollRight) dx = -1;
      var mag = Math.sqrt(dx * dx + dz * dz);
      this.jumpsUsed = 2;
      if (mag > D.deadzone && this.canDodge) {
        var d = tv(dx / mag, 0, dz / mag);
        this.startDodge(d);
        this.canDodge = false;
        if (world) world.contacts.push({ type: "dodge", pos: this.body.pos.clone(), car: this.index });
      } else {
        this.jump(this.body.up);
        if (world) world.contacts.push({ type: "jump", pos: this.body.pos.clone(), car: this.index });
      }
    }
  }
  if (this.input.jump && this.jumpHeld > 0 && !this.grounded) {
    this.jumpHeld -= dt;
    this.body.vel.addS(this.body.up, J.holdAccel * dt);
  } else if (!this.input.jump) this.jumpHeld = 0;
  if (this.airTime > J.dodgeWindow) this.canDodge = false;
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
  var B = this.body;
  if (!this.grounded && this.chassisContact > 0 && B.up.y < -0.15 && this.speed() < 4.5) {
    this.upsideTime += dt;
    if (this.upsideTime > 0.85) {
      this.upsideTime = 0;
      B.vel.addS(LY, 2.6);
      var axis = tv().cross(B.up, LY);
      if (axis.lenSq() < 1e-6) axis.copy(B.fwd);
      axis.norm();
      B.angVel.addS(axis, 4.6);
      B.angVel.clampLen(CFG.physics.maxAngSpeed);
      if (world) world.contacts.push({ type: "jump", pos: B.pos.clone(), car: this.index });
    }
  } else this.upsideTime = Math.max(0, this.upsideTime - dt * 2);
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
  B.addAccel(tv(0, -CFG.physics.gravity, 0));
  this.updateJumpState(dt, world);
  this.recover(dt, world);
  this.ballCooldown = Math.max(0, this.ballCooldown - dt);
  this.chassisContact = Math.max(0, this.chassisContact - dt);
  var preVel = tc(B.vel);
  B.integrate(dt, CFG.physics.maxCarSpeed, CFG.physics.maxAngSpeed);
  if (!wasGrounded) this.landImpact = preVel.dot(this.surfaceNormal);
  if (!B.sanitize()) this.needsRespawn = true;
};

var HULL_PTS = null;
export function hullPoints(V, scale) {
  var s = scale || 2.75;
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
  var CAR_SCALE = 2.75;
  var groundRestHeight = V.wheel.radius + V.wheel.rest - V.wheel.attachY;
  var upOffset = (CAR_SCALE - 1.0) * groundRestHeight;
  var carCenter = tv(B.pos.x + B.up.x * upOffset, B.pos.y + B.up.y * upOffset, B.pos.z + B.up.z * upOffset);
  var pts = hullPoints(V, CAR_SCALE);
  var maxPen = 0, deepest = null, deepN = null, hits = 0;
  for (var i = 0; i < pts.length; i++) {
    var p = B.quat.rotate(pts[i], tv());
    p.add(carCenter);
    var d = arena.dist(p);
    if (d >= 0) continue;
    var n = arena.normal(p, tv());
    var pen = -d;
    hits++;
    var pre = B.pointVel(p, tv()).dot(n);
    var j = resolveStatic(B, p, n, pen, CFG.arena.wallRestitution * 0.7, CFG.arena.wallFriction, true);
    if (pen > maxPen) { maxPen = pen; deepest = p.clone(); deepN = n.clone(); }
    if (j > 55 && -pre > 3.2 && world) {
      world.contacts.push({ type: "carWall", pos: p.clone(), normal: n.clone(), impulse: j, speed: -pre, car: car.index });
    }
  }
  if (hits) car.chassisContact = 0.12;
  return maxPen;
}

export function collideCarBall(car, ball, dt, world) {
  var B = car.body, S = ball.body, V = CFG.vehicle, BC = CFG.ball;
  var CAR_SCALE = 2.75;
  var scaleX = (V.ballHitboxScaleX || 1.25);
  var scaleY = (V.ballHitboxScaleY || 1.20);
  var scaleZ = (V.ballHitboxScaleZ || 1.25);

  var groundRestHeight = V.wheel.radius + V.wheel.rest - V.wheel.attachY;
  var upOffset = (CAR_SCALE - 1.0) * groundRestHeight;
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

  if (pen > 0.001) {
    S.pos.addS(n, pen * 0.86);
    B.pos.addS(n, -pen * 0.14);
  }
  var impulse = 0;
  if (vn < 0) {
    var effA = B.effInvMass(contact, n), effB = S.effInvMass(contact, n);
    var eff = effA * BC.carReaction + effB;
    if (eff > 1e-9) {
      var e = BC.restitutionCar;
      var j = -(1 + e) * vn / eff;
      impulse = j;
      S.applyImpulse(tv(n.x * j, n.y * j, n.z * j), contact);
      B.applyImpulse(tv(-n.x * j * BC.carReaction, -n.y * j * BC.carReaction, -n.z * j * BC.carReaction), contact);
      var vt = tv(rv.x - n.x * vn, rv.y - n.y * vn, rv.z - n.z * vn);
      var tl = vt.len();
      if (tl > 1e-4) {
        var t = tv(-vt.x / tl, -vt.y / tl, -vt.z / tl);
        var effT = S.effInvMass(contact, t) + B.effInvMass(contact, t) * BC.carReaction;
        var jt = Math.min(tl / effT, BC.friction * j);
        S.applyImpulse(tv(t.x * jt, t.y * jt, t.z * jt), contact);
        B.applyImpulse(tv(-t.x * jt * BC.carReaction, -t.y * jt * BC.carReaction, -t.z * jt * BC.carReaction), contact);
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
