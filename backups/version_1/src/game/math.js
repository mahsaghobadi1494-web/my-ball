// @ts-nocheck
export var PI = Math.PI, TAU = PI * 2;
export function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
export function lerp(a, b, t) { return a + (b - a) * t; }
export function sgn(v) { return v < 0 ? -1 : (v > 0 ? 1 : 0); }
export function smooth(a, b, rate, dt) { return b + (a - b) * Math.exp(-rate * dt); }
export function num(v) { return typeof v === "number" && isFinite(v); }
export function deg(r) { return r * 180 / PI; }
export function rad(d) { return d * PI / 180; }

export function RNG(seed) { this.s = seed >>> 0; }
RNG.prototype.next = function () {
  this.s = (this.s + 0x6D2B79F5) >>> 0;
  var t = this.s;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
RNG.prototype.range = function (a, b) { return a + (b - a) * this.next(); };

export function V3(x, y, z) { this.x = x || 0; this.y = y || 0; this.z = z || 0; }
V3.prototype.set = function (x, y, z) { this.x = x; this.y = y; this.z = z; return this; };
V3.prototype.copy = function (v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; };
V3.prototype.clone = function () { return new V3(this.x, this.y, this.z); };
V3.prototype.zero = function () { this.x = this.y = this.z = 0; return this; };
V3.prototype.add = function (v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; };
V3.prototype.sub = function (v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; };
V3.prototype.addS = function (v, s) { this.x += v.x * s; this.y += v.y * s; this.z += v.z * s; return this; };
V3.prototype.subV = function (a, b) { this.x = a.x - b.x; this.y = a.y - b.y; this.z = a.z - b.z; return this; };
V3.prototype.addV = function (a, b) { this.x = a.x + b.x; this.y = a.y + b.y; this.z = a.z + b.z; return this; };
V3.prototype.scale = function (s) { this.x *= s; this.y *= s; this.z *= s; return this; };
V3.prototype.negate = function () { this.x = -this.x; this.y = -this.y; this.z = -this.z; return this; };
V3.prototype.dot = function (v) { return this.x * v.x + this.y * v.y + this.z * v.z; };
V3.prototype.lenSq = function () { return this.x * this.x + this.y * this.y + this.z * this.z; };
V3.prototype.len = function () { return Math.sqrt(this.lenSq()); };
V3.prototype.dist = function (v) { var a = this.x - v.x, b = this.y - v.y, c = this.z - v.z; return Math.sqrt(a * a + b * b + c * c); };
V3.prototype.distSq = function (v) { var a = this.x - v.x, b = this.y - v.y, c = this.z - v.z; return a * a + b * b + c * c; };
V3.prototype.norm = function () {
  var l = this.len();
  if (l > 1e-12) { this.x /= l; this.y /= l; this.z /= l; } else { this.x = this.y = this.z = 0; }
  return this;
};
V3.prototype.setLen = function (s) { return this.norm().scale(s); };
V3.prototype.clampLen = function (m) { var l = this.len(); if (l > m && l > 1e-12) this.scale(m / l); return this; };
V3.prototype.cross = function (a, b) {
  var ax = a.x, ay = a.y, az = a.z, bx = b.x, by = b.y, bz = b.z;
  this.x = ay * bz - az * by; this.y = az * bx - ax * bz; this.z = ax * by - ay * bx; return this;
};
V3.prototype.lerpTo = function (v, t) { this.x = lerp(this.x, v.x, t); this.y = lerp(this.y, v.y, t); this.z = lerp(this.z, v.z, t); return this; };
V3.prototype.ok = function () { return num(this.x) && num(this.y) && num(this.z); };
V3.prototype.projectPlane = function (n) { var d = this.dot(n); this.x -= n.x * d; this.y -= n.y * d; this.z -= n.z * d; return this; };
V3.cross2 = function (a, b, out) { return out.cross(a, b); };

var _pool = [], _pi = 0;
for (var i = 0; i < 2048; i++) _pool.push(new V3());
export function tv(x, y, z) {
  var v = _pool[_pi++ & 2047];
  v.x = x || 0; v.y = y || 0; v.z = z || 0;
  return v;
}
export function tc(a) { var v = _pool[_pi++ & 2047]; v.x = a.x; v.y = a.y; v.z = a.z; return v; }

export function Quat(x, y, z, w) { this.x = x || 0; this.y = y || 0; this.z = z || 0; this.w = w === undefined ? 1 : w; }
Quat.prototype.set = function (x, y, z, w) { this.x = x; this.y = y; this.z = z; this.w = w; return this; };
Quat.prototype.copy = function (q) { this.x = q.x; this.y = q.y; this.z = q.z; this.w = q.w; return this; };
Quat.prototype.identity = function () { return this.set(0, 0, 0, 1); };
Quat.prototype.norm = function () {
  var l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  if (l > 1e-12) { this.x /= l; this.y /= l; this.z /= l; this.w /= l; } else this.identity();
  return this;
};
Quat.prototype.fromAxisAngle = function (ax, ay, az, a) {
  var l = Math.sqrt(ax * ax + ay * ay + az * az);
  if (l < 1e-12) return this.identity();
  var h = a * 0.5, s = Math.sin(h) / l;
  return this.set(ax * s, ay * s, az * s, Math.cos(h));
};
Quat.prototype.mul = function (a, b) {
  var ax = a.x, ay = a.y, az = a.z, aw = a.w, bx = b.x, by = b.y, bz = b.z, bw = b.w;
  this.x = aw * bx + ax * bw + ay * bz - az * by;
  this.y = aw * by - ax * bz + ay * bw + az * bx;
  this.z = aw * bz + ax * by - ay * bx + az * bw;
  this.w = aw * bw - ax * bx - ay * by - az * bz;
  return this;
};
Quat.prototype.rotate = function (v, out) {
  var x = this.x, y = this.y, z = this.z, w = this.w;
  var tx = 2 * (y * v.z - z * v.y), ty = 2 * (z * v.x - x * v.z), tz = 2 * (x * v.y - y * v.x);
  out.x = v.x + w * tx + (y * tz - z * ty);
  out.y = v.y + w * ty + (z * tx - x * tz);
  out.z = v.z + w * tz + (x * ty - y * tx);
  return out;
};
Quat.prototype.rotateInv = function (v, out) {
  var x = -this.x, y = -this.y, z = -this.z, w = this.w;
  var tx = 2 * (y * v.z - z * v.y), ty = 2 * (z * v.x - x * v.z), tz = 2 * (x * v.y - y * v.x);
  out.x = v.x + w * tx + (y * tz - z * ty);
  out.y = v.y + w * ty + (z * tx - x * tz);
  out.z = v.z + w * tz + (x * ty - y * tx);
  return out;
};
Quat.prototype.integrate = function (w, dt) {
  var qx = this.x, qy = this.y, qz = this.z, qw = this.w, h = dt * 0.5;
  var dx = h * (w.x * qw + w.y * qz - w.z * qy);
  var dy = h * (w.y * qw + w.z * qx - w.x * qz);
  var dz = h * (w.z * qw + w.x * qy - w.y * qx);
  var dw = h * (-w.x * qx - w.y * qy - w.z * qz);
  this.x = qx + dx; this.y = qy + dy; this.z = qz + dz; this.w = qw + dw;
  return this.norm();
};
Quat.prototype.slerpTo = function (q, t) {
  var ax = this.x, ay = this.y, az = this.z, aw = this.w;
  var d = ax * q.x + ay * q.y + az * q.z + aw * q.w;
  var bx = q.x, by = q.y, bz = q.z, bw = q.w;
  if (d < 0) { d = -d; bx = -bx; by = -by; bz = -bz; bw = -bw; }
  if (d > 0.9995) { this.x = lerp(ax, bx, t); this.y = lerp(ay, by, t); this.z = lerp(az, bz, t); this.w = lerp(aw, bw, t); return this.norm(); }
  var th = Math.acos(clamp(d, -1, 1)), s = Math.sin(th), s0 = Math.sin((1 - t) * th) / s, s1 = Math.sin(t * th) / s;
  return this.set(ax * s0 + bx * s1, ay * s0 + by * s1, az * s0 + bz * s1, aw * s0 + bw * s1).norm();
};
Quat.prototype.look = function (fwd, up) {
  var f = tc(fwd).norm();
  if (f.lenSq() < 0.5) f.set(0, 0, 1);
  var u = tc(up);
  var r = tv().cross(u, f);
  if (r.lenSq() < 1e-8) { u.set(Math.abs(f.y) > 0.9 ? 1 : 0, Math.abs(f.y) > 0.9 ? 0 : 1, 0); r.cross(u, f); }
  r.norm();
  u.cross(f, r).norm();
  var m00 = r.x, m01 = u.x, m02 = f.x, m10 = r.y, m11 = u.y, m12 = f.y, m20 = r.z, m21 = u.z, m22 = f.z;
  var tr = m00 + m11 + m22, s;
  if (tr > 0) { s = Math.sqrt(tr + 1) * 2; this.w = 0.25 * s; this.x = (m21 - m12) / s; this.y = (m02 - m20) / s; this.z = (m10 - m01) / s; }
  else if (m00 > m11 && m00 > m22) { s = Math.sqrt(1 + m00 - m11 - m22) * 2; this.w = (m21 - m12) / s; this.x = 0.25 * s; this.y = (m01 + m10) / s; this.z = (m02 + m20) / s; }
  else if (m11 > m22) { s = Math.sqrt(1 + m11 - m00 - m22) * 2; this.w = (m02 - m20) / s; this.x = (m01 + m10) / s; this.y = 0.25 * s; this.z = (m12 + m21) / s; }
  else { s = Math.sqrt(1 + m22 - m00 - m11) * 2; this.w = (m10 - m01) / s; this.x = (m02 + m20) / s; this.y = (m12 + m21) / s; this.z = 0.25 * s; }
  return this.norm();
};
Quat.prototype.ok = function () { return num(this.x) && num(this.y) && num(this.z) && num(this.w); };

export function M4() { return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); }
export function m4perspective(o, fovy, aspect, near, far) {
  var f = 1 / Math.tan(fovy * 0.5), nf = 1 / (near - far);
  o[0] = f / aspect; o[1] = 0; o[2] = 0; o[3] = 0;
  o[4] = 0; o[5] = f; o[6] = 0; o[7] = 0;
  o[8] = 0; o[9] = 0; o[10] = (far + near) * nf; o[11] = -1;
  o[12] = 0; o[13] = 0; o[14] = 2 * far * near * nf; o[15] = 0;
  return o;
}
export function m4lookAt(o, eye, target, up) {
  var zx = eye.x - target.x, zy = eye.y - target.y, zz = eye.z - target.z;
  var zl = Math.sqrt(zx * zx + zy * zy + zz * zz);
  if (zl < 1e-9) { zz = 1; zl = 1; }
  zx /= zl; zy /= zl; zz /= zl;
  var xx = up.y * zz - up.z * zy, xy = up.z * zx - up.x * zz, xz = up.x * zy - up.y * zx;
  var xl = Math.sqrt(xx * xx + xy * xy + xz * xz);
  if (xl < 1e-9) { xx = 1; xy = 0; xz = 0; xl = 1; }
  xx /= xl; xy /= xl; xz /= xl;
  var yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
  o[0] = xx; o[1] = yx; o[2] = zx; o[3] = 0;
  o[4] = xy; o[5] = yy; o[6] = zy; o[7] = 0;
  o[8] = xz; o[9] = yz; o[10] = zz; o[11] = 0;
  o[12] = -(xx * eye.x + xy * eye.y + xz * eye.z);
  o[13] = -(yx * eye.x + yy * eye.y + yz * eye.z);
  o[14] = -(zx * eye.x + zy * eye.y + zz * eye.z);
  o[15] = 1;
  return o;
}
export function m4mul(o, a, b) {
  for (var c = 0; c < 4; c++) {
    var b0 = b[c * 4], b1 = b[c * 4 + 1], b2 = b[c * 4 + 2], b3 = b[c * 4 + 3];
    o[c * 4] = a[0] * b0 + a[4] * b1 + a[8] * b2 + a[12] * b3;
    o[c * 4 + 1] = a[1] * b0 + a[5] * b1 + a[9] * b2 + a[13] * b3;
    o[c * 4 + 2] = a[2] * b0 + a[6] * b1 + a[10] * b2 + a[14] * b3;
    o[c * 4 + 3] = a[3] * b0 + a[7] * b1 + a[11] * b2 + a[15] * b3;
  }
  return o;
}
export function m4compose(o, p, q, sx, sy, sz) {
  var x = q.x, y = q.y, z = q.z, w = q.w;
  var x2 = x + x, y2 = y + y, z2 = z + z;
  var xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2;
  var wx = w * x2, wy = w * y2, wz = w * z2;
  o[0] = (1 - (yy + zz)) * sx; o[1] = (xy + wz) * sx; o[2] = (xz - wy) * sx; o[3] = 0;
  o[4] = (xy - wz) * sy; o[5] = (1 - (xx + zz)) * sy; o[6] = (yz + wx) * sy; o[7] = 0;
  o[8] = (xz + wy) * sz; o[9] = (yz - wx) * sz; o[10] = (1 - (xx + yy)) * sz; o[11] = 0;
  o[12] = p.x; o[13] = p.y; o[14] = p.z; o[15] = 1;
  return o;
}
export function m3fromM4(o, m) {
  o[0] = m[0]; o[1] = m[1]; o[2] = m[2];
  o[3] = m[4]; o[4] = m[5]; o[5] = m[6];
  o[6] = m[8]; o[7] = m[9]; o[8] = m[10];
  return o;
}
