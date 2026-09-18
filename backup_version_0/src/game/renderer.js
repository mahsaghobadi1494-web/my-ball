// @ts-nocheck
import { TAU, PI, rad, clamp, lerp, V3, Quat, M4, m4perspective, m4lookAt, m4mul, m4compose, m3fromM4, tv, tc } from './math.js';
import { CFG, TEAM_COLOR } from './config.js';

export function makeCanvas(size) {
  var c = document.createElement("canvas");
  c.width = c.height = size;
  return c;
}

export function texField(A) {
  var S = 1024, c = makeCanvas(S), g = c.getContext("2d");
  var W = A.hx * 2, L = A.hz * 2;
  var px = S / W, pz = S / L;
  g.fillStyle = "#20222c"; g.fillRect(0, 0, S, S);
  for (var i = 0; i < 16; i++) {
    g.fillStyle = (i % 2) ? "#232634" : "#1d2029";
    g.fillRect(0, i * S / 16, S, S / 16);
  }
  for (var k = 0; k < 5200; k++) {
    g.fillStyle = "rgba(255,255,255," + (0.006 + Math.random() * 0.02).toFixed(3) + ")";
    g.fillRect(Math.random() * S, Math.random() * S, 2, 2);
  }
  g.lineCap = "butt";
  function line(x1, z1, x2, z2, w, col) {
    g.strokeStyle = col; g.lineWidth = w * px;
    g.beginPath(); g.moveTo((x1 + A.hx) * px, (z1 + A.hz) * pz); g.lineTo((x2 + A.hx) * px, (z2 + A.hz) * pz); g.stroke();
  }
  function circle(x, z, r, w, col) {
    g.strokeStyle = col; g.lineWidth = w * px;
    g.beginPath(); g.arc((x + A.hx) * px, (z + A.hz) * pz, r * px, 0, TAU); g.stroke();
  }
  var white = "rgba(236,240,248,0.72)";
  line(-A.hx, 0, A.hx, 0, 0.34, white);
  circle(0, 0, 9.2, 0.34, white);
  circle(0, 0, 0.7, 0.7, white);
  var grd = g.createLinearGradient(0, 0, 0, S);
  grd.addColorStop(0, "rgba(255,51,133,0.16)");
  grd.addColorStop(0.42, "rgba(255,51,133,0)");
  grd.addColorStop(0.58, "rgba(153,250,71,0)");
  grd.addColorStop(1, "rgba(153,250,71,0.16)");
  g.fillStyle = grd; g.fillRect(0, 0, S, S);
  var gw = A.goalHalfW + 3.2, gd = 11.5;
  line(-gw, A.hz - gd, gw, A.hz - gd, 0.3, white);
  line(-gw, -A.hz + gd, gw, -A.hz + gd, 0.3, white);
  line(-gw, A.hz - gd, -gw, A.hz, 0.3, white);
  line(gw, A.hz - gd, gw, A.hz, 0.3, white);
  line(-gw, -A.hz + gd, -gw, -A.hz, 0.3, white);
  line(gw, -A.hz + gd, gw, -A.hz, 0.3, white);
  g.strokeStyle = white; g.lineWidth = 0.3 * px;
  var cr = 3.0;
  var corners = [[-A.hx, -A.hz, 0, 0.5], [A.hx, -A.hz, 0.5, 1], [A.hx, A.hz, 1, 1.5], [-A.hx, A.hz, 1.5, 2]];
  for (var ci = 0; ci < 4; ci++) {
    var q = corners[ci];
    g.beginPath();
    g.arc((q[0] + A.hx) * px, (q[1] + A.hz) * pz, cr * px, q[2] * PI, q[3] * PI);
    g.stroke();
  }
  return c;
}

export function texPanel() {
  var S = 256, c = makeCanvas(S), g = c.getContext("2d");
  g.fillStyle = "#191b24"; g.fillRect(0, 0, S, S);
  g.strokeStyle = "rgba(255,255,255,0.055)"; g.lineWidth = 2;
  for (var i = 0; i <= 4; i++) {
    g.beginPath(); g.moveTo(i * S / 4, 0); g.lineTo(i * S / 4, S); g.stroke();
    g.beginPath(); g.moveTo(0, i * S / 4); g.lineTo(S, i * S / 4); g.stroke();
  }
  g.fillStyle = "rgba(255,255,255,0.028)";
  for (var y = 0; y < 4; y++) for (var x = 0; x < 4; x++) if ((x + y) % 2 === 0) g.fillRect(x * S / 4 + 3, y * S / 4 + 3, S / 4 - 6, S / 4 - 6);
  return c;
}

export function texNet() {
  var S = 128, c = makeCanvas(S), g = c.getContext("2d");
  g.clearRect(0, 0, S, S);
  g.strokeStyle = "rgba(226,232,244,0.85)"; g.lineWidth = 2.2;
  for (var i = 0; i <= 8; i++) {
    g.beginPath(); g.moveTo(i * S / 8, 0); g.lineTo(i * S / 8, S); g.stroke();
    g.beginPath(); g.moveTo(0, i * S / 8); g.lineTo(S, i * S / 8); g.stroke();
  }
  return c;
}

export function texBall() {
  var S = 512, c = makeCanvas(S), g = c.getContext("2d");
  g.fillStyle = "#dfe4ee"; g.fillRect(0, 0, S, S);
  g.fillStyle = "#f4f7fd";
  var r = 34;
  for (var row = -1; row < 9; row++) {
    for (var col = -1; col < 13; col++) {
      var x = col * r * 1.5 + (row % 2 ? r * 0.75 : 0), y = row * r * 1.28;
      g.beginPath();
      for (var s = 0; s < 6; s++) {
        var a = s * TAU / 6 + PI / 6;
        var vx = x + Math.cos(a) * r * 0.92, vy = y + Math.sin(a) * r * 0.92;
        if (s === 0) g.moveTo(vx, vy); else g.lineTo(vx, vy);
      }
      g.closePath(); g.fill();
      g.strokeStyle = "rgba(40,44,58,0.35)"; g.lineWidth = 3; g.stroke();
    }
  }
  g.strokeStyle = "rgba(255,60,140,0.55)"; g.lineWidth = 12;
  g.beginPath(); g.arc(S * 0.5, S * 0.5, S * 0.22, 0.2, 2.2); g.stroke();
  g.strokeStyle = "rgba(150,250,70,0.5)";
  g.beginPath(); g.arc(S * 0.5, S * 0.5, S * 0.34, 3.4, 5.4); g.stroke();
  return c;
}

export function texBlob() {
  var S = 128, c = makeCanvas(S), g = c.getContext("2d");
  var gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  gr.addColorStop(0, "rgba(0,0,0,0.72)");
  gr.addColorStop(0.55, "rgba(0,0,0,0.34)");
  gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr; g.fillRect(0, 0, S, S);
  return c;
}

export function texSpark() {
  var S = 64, c = makeCanvas(S), g = c.getContext("2d");
  var gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.25, "rgba(255,255,255,0.72)");
  gr.addColorStop(0.65, "rgba(255,255,255,0.16)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, S, S);
  return c;
}

export function texCrowd() {
  var S = 256, c = makeCanvas(S), g = c.getContext("2d");
  g.fillStyle = "#0f1017"; g.fillRect(0, 0, S, S);
  for (var i = 0; i < 2600; i++) {
    var x = Math.random() * S, y = Math.random() * S;
    var l = 0.12 + Math.random() * 0.5;
    g.fillStyle = "rgba(" + Math.floor(190 * l + 40) + "," + Math.floor(200 * l + 30) + "," + Math.floor(240 * l + 50) + ",0.85)";
    g.fillRect(x, y, 2.4, 2.0);
  }
  g.fillStyle = "rgba(120,140,220,0.10)";
  for (var r = 0; r < 8; r++) g.fillRect(0, r * S / 8, S, 2);
  return c;
}

export function Builder() { this.v = []; this.i = []; this.n = 0; }
Builder.prototype.vert = function (x, y, z, nx, ny, nz, u, vv) {
  this.v.push(x, y, z, nx, ny, nz, u, vv);
  return this.n++;
};
Builder.prototype.quad = function (a, b, c, d) { this.i.push(a, b, c, a, c, d); return this; };
Builder.prototype.tri = function (a, b, c) { this.i.push(a, b, c); return this; };
Builder.prototype.box = function (hx, hy, hz, p, q, uvs) {
  uvs = uvs || 1;
  var self = this;
  var P = new V3(), N = new V3();
  function put(x, y, z, nx, ny, nz, u, vv) {
    P.set(x, y, z); N.set(nx, ny, nz);
    if (q) { q.rotate(P, P); q.rotate(N, N); }
    if (p) P.add(p);
    return self.vert(P.x, P.y, P.z, N.x, N.y, N.z, u * uvs, vv * uvs);
  }
  var faces = [
    [[hx, -hy, -hz], [hx, -hy, hz], [hx, hy, hz], [hx, hy, -hz], [1, 0, 0]],
    [[-hx, -hy, hz], [-hx, -hy, -hz], [-hx, hy, -hz], [-hx, hy, hz], [-1, 0, 0]],
    [[-hx, hy, -hz], [hx, hy, -hz], [hx, hy, hz], [-hx, hy, hz], [0, 1, 0]],
    [[-hx, -hy, hz], [hx, -hy, hz], [hx, -hy, -hz], [-hx, -hy, -hz], [0, -1, 0]],
    [[-hx, -hy, hz], [-hx, hy, hz], [hx, hy, hz], [hx, -hy, hz], [0, 0, 1]],
    [[hx, -hy, -hz], [hx, hy, -hz], [-hx, hy, -hz], [-hx, -hy, -hz], [0, 0, -1]]
  ];
  for (var f = 0; f < 6; f++) {
    var F = faces[f], nn = F[4];
    var a = put(F[0][0], F[0][1], F[0][2], nn[0], nn[1], nn[2], 0, 0);
    var b = put(F[1][0], F[1][1], F[1][2], nn[0], nn[1], nn[2], 1, 0);
    var c = put(F[2][0], F[2][1], F[2][2], nn[0], nn[1], nn[2], 1, 1);
    var d = put(F[3][0], F[3][1], F[3][2], nn[0], nn[1], nn[2], 0, 1);
    this.quad(a, b, c, d);
  }
  return this;
};
Builder.prototype.sphere = function (r, seg, rings, p) {
  var base = this.n;
  for (var y = 0; y <= rings; y++) {
    var v = y / rings, phi = v * PI;
    for (var x = 0; x <= seg; x++) {
      var u = x / seg, th = u * TAU;
      var nx = Math.sin(phi) * Math.cos(th), ny = Math.cos(phi), nz = Math.sin(phi) * Math.sin(th);
      this.vert(nx * r + (p ? p.x : 0), ny * r + (p ? p.y : 0), nz * r + (p ? p.z : 0), nx, ny, nz, u * 2, v);
    }
  }
  for (var yy = 0; yy < rings; yy++) {
    for (var xx = 0; xx < seg; xx++) {
      var i0 = base + yy * (seg + 1) + xx, i1 = i0 + 1, i2 = i0 + seg + 1, i3 = i2 + 1;
      this.quad(i0, i2, i3, i1);
    }
  }
  return this;
};
Builder.prototype.wheelCyl = function (r, w, seg) {
  var base = this.n, hw = w * 0.5, s;
  for (var i = 0; i <= seg; i++) {
    var a = i / seg * TAU, cy = Math.cos(a), sz = Math.sin(a);
    this.vert(-hw, cy * r, sz * r, 0, cy, sz, i / seg * 3, 0);
    this.vert(hw, cy * r, sz * r, 0, cy, sz, i / seg * 3, 1);
  }
  for (s = 0; s < seg; s++) this.quad(base + s * 2, base + s * 2 + 2, base + s * 2 + 3, base + s * 2 + 1);
  for (var side = 0; side < 2; side++) {
    var sx = side ? hw : -hw, ndir = side ? 1 : -1;
    var cIdx = this.vert(sx, 0, 0, ndir, 0, 0, 0.5, 0.5);
    var ring = [];
    for (var j = 0; j <= seg; j++) {
      var b = j / seg * TAU;
      ring.push(this.vert(sx, Math.cos(b) * r, Math.sin(b) * r, ndir, 0, 0, 0.5 + Math.cos(b) * 0.5, 0.5 + Math.sin(b) * 0.5));
    }
    for (var t = 0; t < seg; t++) {
      if (side) this.tri(cIdx, ring[t], ring[t + 1]); else this.tri(cIdx, ring[t + 1], ring[t]);
    }
  }
  return this;
};
Builder.prototype.polyDisc = function (r, seg, y, up, uvScale) {
  uvScale = uvScale || 1;
  var c = this.vert(0, y, 0, 0, up, 0, 0.5, 0.5), ring = [];
  for (var i = 0; i <= seg; i++) {
    var a = i / seg * TAU, x = Math.cos(a) * r, z = Math.sin(a) * r;
    ring.push(this.vert(x, y, z, 0, up, 0, 0.5 + x / (2 * r) * uvScale, 0.5 + z / (2 * r) * uvScale));
  }
  for (var t = 0; t < seg; t++) {
    if (up > 0) this.tri(c, ring[t + 1], ring[t]); else this.tri(c, ring[t], ring[t + 1]);
  }
  return this;
};
Builder.prototype.face = function (a, b, c, d, n, uvScale) {
  uvScale = uvScale === undefined ? 1 : uvScale;
  var ia = this.vert(a.x, a.y, a.z, n.x, n.y, n.z, 0, 0);
  var ib = this.vert(b.x, b.y, b.z, n.x, n.y, n.z, b.dist(a) * uvScale, 0);
  var ic = this.vert(c.x, c.y, c.z, n.x, n.y, n.z, b.dist(a) * uvScale, c.dist(b) * uvScale);
  var id = this.vert(d.x, d.y, d.z, n.x, n.y, n.z, 0, c.dist(b) * uvScale);
  return this.quad(ia, ib, ic, id);
};
Builder.prototype.quadN = function (a, b, c, d) {
  var v = this.v;
  var ax = v[a * 8], ay = v[a * 8 + 1], az = v[a * 8 + 2];
  var e1x = v[b * 8] - ax, e1y = v[b * 8 + 1] - ay, e1z = v[b * 8 + 2] - az;
  var e2x = v[c * 8] - ax, e2y = v[c * 8 + 1] - ay, e2z = v[c * 8 + 2] - az;
  var gx = e1y * e2z - e1z * e2y, gy = e1z * e2x - e1x * e2z, gz = e1x * e2y - e1y * e2x;
  var dot = gx * v[a * 8 + 3] + gy * v[a * 8 + 4] + gz * v[a * 8 + 5];
  if (dot >= 0) this.quad(a, b, c, d); else this.quad(a, d, c, b);
  return this;
};
Builder.prototype.faceTo = function (a, b, c, d, inside, uvScale) {
  uvScale = uvScale === undefined ? 0.25 : uvScale;
  var e1 = tv(b.x - a.x, b.y - a.y, b.z - a.z), e2 = tv(c.x - a.x, c.y - a.y, c.z - a.z);
  var n = tv().cross(e1, e2).norm();
  if (n.dot(tv(inside.x - a.x, inside.y - a.y, inside.z - a.z)) < 0) {
    n.negate();
    var t = b; b = d; d = t;
    e1.set(b.x - a.x, b.y - a.y, b.z - a.z);
  }
  var w = a.dist(b), h = b.dist(c);
  var i0 = this.vert(a.x, a.y, a.z, n.x, n.y, n.z, 0, 0);
  var i1 = this.vert(b.x, b.y, b.z, n.x, n.y, n.z, w * uvScale, 0);
  var i2 = this.vert(c.x, c.y, c.z, n.x, n.y, n.z, w * uvScale, h * uvScale);
  var i3 = this.vert(d.x, d.y, d.z, n.x, n.y, n.z, 0, h * uvScale);
  return this.quad(i0, i1, i2, i3);
};
Builder.prototype.boxRot = function (hx, hy, hz, p, rxDeg, ryDeg, rzDeg, uvs) {
  var q = null;
  if (rxDeg || ryDeg || rzDeg) {
    q = new Quat();
    var qx = new Quat().fromAxisAngle(1, 0, 0, rad(rxDeg || 0));
    var qy = new Quat().fromAxisAngle(0, 1, 0, rad(ryDeg || 0));
    var qz = new Quat().fromAxisAngle(0, 0, 1, rad(rzDeg || 0));
    q.mul(qy, qx).mul(q, qz);
  }
  return this.box(hx, hy, hz, p, q, uvs);
};
Builder.prototype.cylinder = function (rBottom, rTop, length, seg, p, q, capBottom, capTop) {
  seg = seg || 12;
  if (capBottom === undefined) capBottom = true;
  if (capTop === undefined) capTop = true;
  var base = this.n;
  var hl = length * 0.5;
  var self = this;
  var P = new V3(), N = new V3();
  function put(x, y, z, nx, ny, nz, u, vv) {
    P.set(x, y, z); N.set(nx, ny, nz);
    if (q) { q.rotate(P, P); q.rotate(N, N); }
    if (p) P.add(p);
    return self.vert(P.x, P.y, P.z, N.x, N.y, N.z, u, vv);
  }

  var dr = rBottom - rTop;
  var slopeLen = Math.sqrt(dr * dr + length * length);
  var nzNorm = slopeLen > 1e-6 ? dr / slopeLen : 0;
  var nrNorm = slopeLen > 1e-6 ? length / slopeLen : 1;

  for (var i = 0; i <= seg; i++) {
    var a = i / seg * TAU;
    var cosA = Math.cos(a), sinA = Math.sin(a);
    var nx = cosA * nrNorm, ny = sinA * nrNorm, nz = nzNorm;
    put(cosA * rBottom, sinA * rBottom, -hl, nx, ny, nz, i / seg, 0);
    put(cosA * rTop, sinA * rTop, hl, nx, ny, nz, i / seg, 1);
  }

  for (var s = 0; s < seg; s++) {
    this.quad(base + s * 2, base + s * 2 + 2, base + s * 2 + 3, base + s * 2 + 1);
  }

  if (capBottom && rBottom > 0.001) {
    var cBot = put(0, 0, -hl, 0, 0, -1, 0.5, 0.5);
    var ringB = [];
    for (var j = 0; j <= seg; j++) {
      var b = j / seg * TAU;
      ringB.push(put(Math.cos(b) * rBottom, Math.sin(b) * rBottom, -hl, 0, 0, -1, 0.5 + Math.cos(b) * 0.5, 0.5 + Math.sin(b) * 0.5));
    }
    for (var t = 0; t < seg; t++) {
      this.tri(cBot, ringB[t + 1], ringB[t]);
    }
  }

  if (capTop && rTop > 0.001) {
    var cTop = put(0, 0, hl, 0, 0, 1, 0.5, 0.5);
    var ringT = [];
    for (var j2 = 0; j2 <= seg; j2++) {
      var b2 = j2 / seg * TAU;
      ringT.push(put(Math.cos(b2) * rTop, Math.sin(b2) * rTop, hl, 0, 0, 1, 0.5 + Math.cos(b2) * 0.5, 0.5 + Math.sin(b2) * 0.5));
    }
    for (var t2 = 0; t2 < seg; t2++) {
      this.tri(cTop, ringT[t2], ringT[t2 + 1]);
    }
  }
  return this;
};
Builder.prototype.tube = function (p1, p2, radius, seg) {
  seg = seg || 8;
  var dir = new V3().subV(p2, p1);
  var len = dir.len();
  if (len < 1e-4) return this;
  dir.norm();
  var mid = new V3().addV(p1, p2).scale(0.5);
  var zAxis = new V3(0, 0, 1);
  var q = new Quat();
  var dot = zAxis.dot(dir);
  if (dot > 0.9999) {
    q.identity();
  } else if (dot < -0.9999) {
    q.fromAxisAngle(1, 0, 0, PI);
  } else {
    var axis = new V3().cross(zAxis, dir).norm();
    var angle = Math.acos(clamp(dot, -1, 1));
    q.fromAxisAngle(axis.x, axis.y, axis.z, angle);
  }
  return this.cylinder(radius, radius, len, seg, mid, q, true, true);
};
Builder.prototype.count = function () { return this.i.length; };

var VS_MAIN = [
  "#version 300 es",
  "layout(location = 0) in vec3 aPos;",
  "layout(location = 1) in vec3 aNormal;",
  "layout(location = 2) in vec2 aUV;",
  "uniform mat4 uVP; uniform mat4 uModel; uniform mat3 uNM;",
  "out vec3 vN; out vec3 vW; out vec2 vUV;",
  "void main(){ vec4 w = uModel * vec4(aPos,1.0); vW = w.xyz; vN = uNM * aNormal; vUV = aUV;",
  "  gl_Position = uVP * w; }"
].join("\n");
var FS_MAIN = [
  "#version 300 es",
  "precision highp float;",
  "in vec3 vN; in vec3 vW; in vec2 vUV;",
  "uniform vec3 uColor; uniform vec3 uEmissive; uniform vec3 uCam; uniform vec3 uFogCol;",
  "uniform float uOpacity; uniform float uSpec; uniform float uUseTex; uniform float uFog;",
  "uniform float uAlphaTest; uniform float uRim;",
  "uniform sampler2D uTex;",
  "out vec4 outColor;",
  "const vec3 L1 = vec3(-0.32, 0.88, 0.35);",
  "const vec3 L2 = vec3(0.55, 0.62, -0.55);",
  "void main(){",
  "  vec4 tex = vec4(1.0);",
  "  if (uUseTex > 0.5) tex = texture(uTex, vUV);",
  "  if (uAlphaTest > 0.5 && tex.a < 0.35) discard;",
  "  vec3 base = uColor * tex.rgb;",
  "  vec3 N = normalize(vN);",
  "  vec3 V = normalize(uCam - vW);",
  "  if (dot(N, V) < 0.0) N = -N;",
  "  float d1 = max(dot(N, normalize(L1)), 0.0);",
  "  float d2 = max(dot(N, normalize(L2)), 0.0);",
  "  float hemi = 0.5 + 0.5 * N.y;",
  "  vec3 amb = mix(vec3(0.10,0.10,0.14), vec3(0.30,0.31,0.38), hemi);",
  "  vec3 lit = base * (amb + vec3(1.00,0.96,0.92) * d1 * 0.82 + vec3(0.42,0.50,0.72) * d2 * 0.40);",
  "  vec3 H = normalize(normalize(L1) + V);",
  "  float spec = pow(max(dot(N, H), 0.0), 42.0) * uSpec;",
  "  float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0) * uRim;",
  "  vec3 col = lit + vec3(spec) + uEmissive + uEmissive * rim * 2.0 + rim * 0.06;",
  "  float dist = length(uCam - vW);",
  "  float fog = 1.0 - exp(-dist * uFog);",
  "  col = mix(col, uFogCol, clamp(fog, 0.0, 1.0));",
  "  outColor = vec4(col, uOpacity * tex.a);",
  "}"
].join("\n");
var VS_PART = [
  "#version 300 es",
  "layout(location = 0) in vec2 aCorner;",
  "layout(location = 1) in vec3 iPos;",
  "layout(location = 2) in vec4 iCol;",
  "layout(location = 3) in vec2 iSize;",
  "uniform mat4 uVP; uniform vec3 uRight; uniform vec3 uUp;",
  "out vec2 vUV; out vec4 vCol;",
  "void main(){",
  "  vec3 w = iPos + uRight * aCorner.x * iSize.x + uUp * aCorner.y * iSize.y;",
  "  vUV = aCorner * 0.5 + 0.5; vCol = iCol;",
  "  gl_Position = uVP * vec4(w, 1.0);",
  "}"
].join("\n");
var FS_PART = [
  "#version 300 es",
  "precision highp float;",
  "in vec2 vUV; in vec4 vCol;",
  "uniform sampler2D uTex;",
  "out vec4 outColor;",
  "void main(){ vec4 t = texture(uTex, vUV); outColor = vec4(vCol.rgb * t.rgb, vCol.a * t.a); }"
].join("\n");
var VS_LINE = [
  "#version 300 es",
  "layout(location = 0) in vec3 aPos;",
  "layout(location = 1) in vec3 aCol;",
  "uniform mat4 uVP;",
  "out vec3 vCol;",
  "void main(){ vCol = aCol; gl_Position = uVP * vec4(aPos,1.0); }"
].join("\n");
var FS_LINE = [
  "#version 300 es",
  "precision highp float;",
  "in vec3 vCol; out vec4 outColor;",
  "void main(){ outColor = vec4(vCol, 1.0); }"
].join("\n");

export function Renderer(canvas) {
  this.canvas = canvas;
  var opts = { antialias: true, alpha: false, powerPreference: "high-performance", depth: true, stencil: false };
  var gl = canvas.getContext("webgl2", opts);
  if (!gl) throw new Error("WebGL2 is not available in this browser.");
  this.gl = gl;
  this.vpDirty = true;
  this.proj = M4(); this.view = M4(); this.vp = M4();
  this.model = M4(); this.nm = new Float32Array(9);
  this.camPos = new V3(0, 3, -12);
  this.fogColor = [0.055, 0.058, 0.078];
  this.fogDensity = 0.0055;
  this.drawCalls = 0;
  this.dpr = 1;
  this.progMain = this.program(VS_MAIN, FS_MAIN);
  this.progPart = this.program(VS_PART, FS_PART);
  this.progLine = this.program(VS_LINE, FS_LINE);
  this.uMain = this.uniforms(this.progMain, ["uVP", "uModel", "uNM", "uColor", "uEmissive", "uCam", "uOpacity", "uSpec", "uUseTex", "uFog", "uFogCol", "uTex", "uAlphaTest", "uRim"]);
  this.uPart = this.uniforms(this.progPart, ["uVP", "uRight", "uUp", "uTex"]);
  this.uLine = this.uniforms(this.progLine, ["uVP"]);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.clearColor(this.fogColor[0], this.fogColor[1], this.fogColor[2], 1);
  var white = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, white);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  this.whiteTex = white;
  this.initParticles(4096);
  this.initLines(24000);
  this.texCache = {};
}
Renderer.prototype.program = function (vsrc, fsrc) {
  var gl = this.gl;
  function sh(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error("Shader: " + gl.getShaderInfoLog(s));
    return s;
  }
  var p = gl.createProgram();
  gl.attachShader(p, sh(gl.VERTEX_SHADER, vsrc));
  gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fsrc));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error("Link: " + gl.getProgramInfoLog(p));
  return p;
};
Renderer.prototype.uniforms = function (p, names) {
  var o = {}, gl = this.gl;
  for (var i = 0; i < names.length; i++) o[names[i]] = gl.getUniformLocation(p, names[i]);
  return o;
};
Renderer.prototype.mesh = function (builder) {
  var gl = this.gl;
  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  var vb = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vb);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(builder.v), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 32, 0);
  gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 32, 12);
  gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 32, 24);
  var ib = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
  var big = builder.n > 65535;
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, big ? new Uint32Array(builder.i) : new Uint16Array(builder.i), gl.STATIC_DRAW);
  gl.bindVertexArray(null);
  return { vao: vao, count: builder.i.length, type: big ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT };
};
Renderer.prototype.texture = function (canvas, repeat, mips) {
  var gl = this.gl, t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mips === false ? gl.LINEAR : gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  if (mips !== false) gl.generateMipmap(gl.TEXTURE_2D);
  return t;
};
Renderer.prototype.resize = function (scale) {
  var gl = this.gl, c = this.canvas;
  this.dpr = Math.min(Math.min(window.devicePixelRatio || 1, 2) * (scale || 1), 2.2);
  var w = Math.max(320, Math.floor(c.clientWidth * this.dpr));
  var h = Math.max(240, Math.floor(c.clientHeight * this.dpr));
  if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
  gl.viewport(0, 0, c.width, c.height);
  this.aspect = c.width / c.height;
};
Renderer.prototype.beginFrame = function (camPos, camTarget, camUp, fovDeg) {
  var gl = this.gl;
  this.camPos.copy(camPos);
  m4perspective(this.proj, rad(fovDeg), this.aspect || 1.6, 0.12, 480);
  m4lookAt(this.view, camPos, camTarget, camUp);
  m4mul(this.vp, this.proj, this.view);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.depthMask(true);
  gl.disable(gl.BLEND);
  gl.useProgram(this.progMain);
  gl.uniformMatrix4fv(this.uMain.uVP, false, this.vp);
  gl.uniform3f(this.uMain.uCam, camPos.x, camPos.y, camPos.z);
  gl.uniform3f(this.uMain.uFogCol, this.fogColor[0], this.fogColor[1], this.fogColor[2]);
  gl.uniform1f(this.uMain.uFog, this.fogDensity);
  gl.uniform1i(this.uMain.uTex, 0);
  this.drawCalls = 0;
  this.blendMode = "none";
  this.camRight = tv(this.view[0], this.view[4], this.view[8]).clone();
  this.camUp = tv(this.view[1], this.view[5], this.view[9]).clone();
};
Renderer.prototype.setBlend = function (mode) {
  if (this.blendMode === mode) return;
  var gl = this.gl;
  this.blendMode = mode;
  if (mode === "none") { gl.disable(gl.BLEND); gl.depthMask(true); return; }
  gl.enable(gl.BLEND);
  if (mode === "alpha") { gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false); }
  else if (mode === "add") { gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.depthMask(false); }
  else if (mode === "shadow") { gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false); }
};
var MAT_DEFAULT = { color: [0.8, 0.8, 0.85], emissive: [0, 0, 0], opacity: 1, spec: 0.35, tex: null, blend: "none", cull: true, rim: 0.25, alphaTest: false };
Renderer.prototype.draw = function (mesh, pos, quat, scale, mat) {
  var gl = this.gl, u = this.uMain;
  mat = mat || MAT_DEFAULT;
  var sx = scale ? scale.x : 1, sy = scale ? scale.y : 1, sz = scale ? scale.z : 1;
  m4compose(this.model, pos, quat, sx, sy, sz);
  m3fromM4(this.nm, this.model);
  if (sx !== sy || sy !== sz) {
    this.nm[0] /= sx * sx; this.nm[1] /= sx * sx; this.nm[2] /= sx * sx;
    this.nm[3] /= sy * sy; this.nm[4] /= sy * sy; this.nm[5] /= sy * sy;
    this.nm[6] /= sz * sz; this.nm[7] /= sz * sz; this.nm[8] /= sz * sz;
  }
  gl.useProgram(this.progMain);
  gl.uniformMatrix4fv(u.uModel, false, this.model);
  gl.uniformMatrix3fv(u.uNM, false, this.nm);
  var c = mat.color || MAT_DEFAULT.color, e = mat.emissive || MAT_DEFAULT.emissive;
  gl.uniform3f(u.uColor, c[0], c[1], c[2]);
  gl.uniform3f(u.uEmissive, e[0], e[1], e[2]);
  gl.uniform1f(u.uOpacity, mat.opacity === undefined ? 1 : mat.opacity);
  gl.uniform1f(u.uSpec, mat.spec === undefined ? 0.35 : mat.spec);
  gl.uniform1f(u.uRim, mat.rim === undefined ? 0.25 : mat.rim);
  gl.uniform1f(u.uAlphaTest, mat.alphaTest ? 1 : 0);
  gl.uniform1f(u.uUseTex, mat.tex ? 1 : 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, mat.tex || this.whiteTex);
  this.setBlend(mat.blend || "none");
  if (mat.cull === false) gl.disable(gl.CULL_FACE); else gl.enable(gl.CULL_FACE);
  gl.bindVertexArray(mesh.vao);
  gl.drawElements(gl.TRIANGLES, mesh.count, mesh.type, 0);
  this.drawCalls++;
};
Renderer.prototype.initParticles = function (max) {
  var gl = this.gl;
  this.partMax = max;
  this.partData = new Float32Array(max * 9);
  this.partCount = 0;
  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  var quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);
  this.partBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.partBuf);
  gl.bufferData(gl.ARRAY_BUFFER, this.partData.byteLength, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 36, 0); gl.vertexAttribDivisor(1, 1);
  gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 36, 12); gl.vertexAttribDivisor(2, 1);
  gl.enableVertexAttribArray(3); gl.vertexAttribPointer(3, 2, gl.FLOAT, false, 36, 28); gl.vertexAttribDivisor(3, 1);
  gl.bindVertexArray(null);
  this.partVAO = vao;
};
Renderer.prototype.drawParticles = function (list, count, tex) {
  if (!count) return;
  var gl = this.gl, n = Math.min(count, this.partMax), d = this.partData, k = 0;
  for (var i = 0; i < n; i++) {
    var p = list[i];
    d[k] = p.pos.x; d[k + 1] = p.pos.y; d[k + 2] = p.pos.z;
    d[k + 3] = p.col[0]; d[k + 4] = p.col[1]; d[k + 5] = p.col[2]; d[k + 6] = p.alpha;
    d[k + 7] = p.size; d[k + 8] = p.size * (p.stretch || 1);
    k += 9;
  }
  gl.useProgram(this.progPart);
  gl.uniformMatrix4fv(this.uPart.uVP, false, this.vp);
  gl.uniform3f(this.uPart.uRight, this.camRight.x, this.camRight.y, this.camRight.z);
  gl.uniform3f(this.uPart.uUp, this.camUp.x, this.camUp.y, this.camUp.z);
  gl.uniform1i(this.uPart.uTex, 0);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.depthMask(false);
  this.blendMode = "add";
  gl.bindVertexArray(this.partVAO);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.partBuf);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, d, 0, n * 9);
  gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, n);
  gl.bindVertexArray(null);
  this.drawCalls++;
};
Renderer.prototype.initLines = function (maxVerts) {
  var gl = this.gl;
  this.lineMax = maxVerts;
  this.lineData = new Float32Array(maxVerts * 6);
  this.lineCount = 0;
  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  this.lineBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuf);
  gl.bufferData(gl.ARRAY_BUFFER, this.lineData.byteLength, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
  gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
  gl.bindVertexArray(null);
  this.lineVAO = vao;
};
Renderer.prototype.line = function (a, b, col) {
  if (this.lineCount + 2 > this.lineMax) return;
  var d = this.lineData, k = this.lineCount * 6;
  d[k] = a.x; d[k + 1] = a.y; d[k + 2] = a.z; d[k + 3] = col[0]; d[k + 4] = col[1]; d[k + 5] = col[2];
  d[k + 6] = b.x; d[k + 7] = b.y; d[k + 8] = b.z; d[k + 9] = col[0]; d[k + 10] = col[1]; d[k + 11] = col[2];
  this.lineCount += 2;
};
Renderer.prototype.flushLines = function () {
  if (!this.lineCount) return;
  var gl = this.gl;
  gl.useProgram(this.progLine);
  gl.uniformMatrix4fv(this.uLine.uVP, false, this.vp);
  gl.disable(gl.BLEND); gl.depthMask(true); this.blendMode = "none";
  gl.bindVertexArray(this.lineVAO);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuf);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.lineData, 0, this.lineCount * 6);
  gl.drawArrays(gl.LINES, 0, this.lineCount);
  gl.bindVertexArray(null);
  this.lineCount = 0;
  this.drawCalls++;
};

export function buildProps(R) {
  var V = CFG.vehicle;

  // ==========================================
  // 1. OCTANE PAINTED BODYWORK (Team Color)
  // ==========================================
  var b = new Builder();

  // A. Lower Chassis Tub & Main Floor
  b.boxRot(0.30, 0.035, 0.52, new V3(0, -0.015, 0.02), 0, 0, 0);

  // B. Main Mid-Section & Cockpit Base
  b.boxRot(0.28, 0.05, 0.30, new V3(0, 0.055, 0.03), 0, 0, 0);
  // Side pods / door panel flares
  b.boxRot(0.045, 0.05, 0.26, new V3(-0.30, 0.065, 0.02), 0, 0, -4);
  b.boxRot(0.045, 0.05, 0.26, new V3(0.30, 0.065, 0.02), 0, 0, 4);

  // C. Sloping Front Hood (Octane Buggy Nose)
  // Main hood slope
  b.boxRot(0.23, 0.030, 0.20, new V3(0, 0.075, 0.35), -14, 0, 0);
  // Front nose bridge & lower cowl
  b.boxRot(0.21, 0.028, 0.07, new V3(0, 0.03, 0.52), -6, 0, 0);
  // Octane Center Hood Power Bulge / Scoop
  b.boxRot(0.085, 0.018, 0.16, new V3(0, 0.10, 0.36), -14, 0, 0);
  // Left & right hood aero ribs
  b.boxRot(0.018, 0.012, 0.13, new V3(-0.15, 0.09, 0.36), -14, 0, 0);
  b.boxRot(0.018, 0.012, 0.13, new V3(0.15, 0.09, 0.36), -14, 0, 0);

  // D. Front Mudguards / Fender Arches (Octane signature trophy-truck open arches)
  b.boxRot(0.05, 0.032, 0.14, new V3(-0.34, 0.07, 0.40), -8, 6, -6);
  b.boxRot(0.05, 0.032, 0.14, new V3(0.34, 0.07, 0.40), -8, -6, 6);

  // E. Muscular Rear Fender Flares
  b.boxRot(0.06, 0.06, 0.18, new V3(-0.34, 0.085, -0.38), 6, -4, -6);
  b.boxRot(0.06, 0.06, 0.18, new V3(0.34, 0.085, -0.38), 6, 4, 6);

  // F. Driver Cockpit Roof & Iconic Overhead Air Intake Scoop
  b.boxRot(0.19, 0.018, 0.15, new V3(0, 0.22, -0.06), 4, 0, 0);
  // Overhead air intake scoop
  b.boxRot(0.07, 0.022, 0.11, new V3(0, 0.25, -0.05), -14, 0, 0);
  b.boxRot(0.075, 0.020, 0.02, new V3(0, 0.255, 0.04), 0, 0, 0);

  // G. Rear Engine Deck Cowling
  b.boxRot(0.23, 0.032, 0.14, new V3(0, 0.11, -0.35), 8, 0, 0);

  // H. Iconic High-Downforce Rear Wing / Spoiler
  // Main horizontal aerofoil blade
  b.boxRot(0.36, 0.016, 0.085, new V3(0, 0.265, -0.48), -10, 0, 0);
  // Left & Right vertical aerodynamic endplates
  b.boxRot(0.012, 0.055, 0.10, new V3(-0.36, 0.265, -0.48), 0, 0, 0);
  b.boxRot(0.012, 0.055, 0.10, new V3(0.36, 0.265, -0.48), 0, 0, 0);

  var bodyMesh = R.mesh(b);


  // ==========================================
  // 2. DARK TITANIUM CHASSIS, TUBULAR CAGE & ENGINE
  // ==========================================
  var a = new Builder();

  // A. Octane Outer Tubular Steel Roll Cage
  // Left A-Pillar
  a.tube(new V3(-0.24, 0.08, 0.22), new V3(-0.20, 0.225, 0.02), 0.016);
  // Right A-Pillar
  a.tube(new V3(0.24, 0.08, 0.22), new V3(0.20, 0.225, 0.02), 0.016);
  // Roof side rails
  a.tube(new V3(-0.20, 0.225, 0.02), new V3(-0.20, 0.225, -0.16), 0.016);
  a.tube(new V3(0.20, 0.225, 0.02), new V3(0.20, 0.225, -0.16), 0.016);
  // Roof crossbars (front & rear)
  a.tube(new V3(-0.20, 0.225, 0.02), new V3(0.20, 0.225, 0.02), 0.015);
  a.tube(new V3(-0.20, 0.225, -0.16), new V3(0.20, 0.225, -0.16), 0.015);
  // C-Pillar rear down-tubes (connecting to rear deck)
  a.tube(new V3(-0.20, 0.225, -0.16), new V3(-0.24, 0.09, -0.44), 0.016);
  a.tube(new V3(0.20, 0.225, -0.16), new V3(0.24, 0.09, -0.44), 0.016);

  // Side Rocker / Nerf Protection Bars
  a.tube(new V3(-0.36, 0.02, 0.26), new V3(-0.36, 0.02, -0.24), 0.017);
  a.tube(new V3(0.36, 0.02, 0.26), new V3(0.36, 0.02, -0.24), 0.017);
  // Mounts to chassis
  a.tube(new V3(-0.36, 0.02, 0.26), new V3(-0.28, 0.02, 0.30), 0.013);
  a.tube(new V3(-0.36, 0.02, -0.24), new V3(-0.28, 0.02, -0.28), 0.013);
  a.tube(new V3(0.36, 0.02, 0.26), new V3(0.28, 0.02, 0.30), 0.013);
  a.tube(new V3(0.36, 0.02, -0.24), new V3(0.28, 0.02, -0.28), 0.013);

  // B. Aggressive Front Bumper, Splitter & Grill
  a.boxRot(0.31, 0.030, 0.035, new V3(0, -0.015, 0.58), 0, 0, 0);
  a.boxRot(0.34, 0.012, 0.06, new V3(0, -0.048, 0.59), 0, 0, 0);
  a.boxRot(0.18, 0.024, 0.02, new V3(0, 0.02, 0.57), 0, 0, 0);
  // Front tow brackets
  a.boxRot(0.012, 0.02, 0.025, new V3(-0.16, -0.035, 0.605), 0, 0, 0);
  a.boxRot(0.012, 0.02, 0.025, new V3(0.16, -0.035, 0.605), 0, 0, 0);

  // C. Rear Aerodynamic Diffuser & Lower Bumper
  a.boxRot(0.30, 0.028, 0.04, new V3(0, -0.01, -0.56), 0, 0, 0);
  a.boxRot(0.33, 0.012, 0.07, new V3(0, -0.045, -0.57), -8, 0, 0);
  // Diffuser vertical strakes
  [-0.20, -0.07, 0.07, 0.20].forEach(function (x) {
    a.boxRot(0.008, 0.025, 0.06, new V3(x, -0.035, -0.57), -8, 0, 0);
  });

  // D. Spoiler Pylons (Twin Aerodynamic Struts)
  a.boxRot(0.016, 0.09, 0.024, new V3(-0.15, 0.19, -0.45), 24, 0, 0);
  a.boxRot(0.016, 0.09, 0.024, new V3(0.15, 0.19, -0.45), 24, 0, 0);

  // E. Exposed Supercharged V8 Engine & Machinery
  a.boxRot(0.15, 0.055, 0.12, new V3(0, 0.08, -0.30), 0, 0, 0);
  a.boxRot(0.10, 0.032, 0.09, new V3(0, 0.135, -0.29), 0, 0, 0);
  // Supercharger pulley
  a.cylinder(0.022, 0.022, 0.04, 8, new V3(0, 0.14, -0.23), null, true, true);

  // F. Dual Massive Rocket/Nitro Exhaust Thruster Bells
  a.cylinder(0.052, 0.042, 0.12, 12, new V3(-0.11, 0.075, -0.58), null, true, true);
  a.cylinder(0.052, 0.042, 0.12, 12, new V3(0.11, 0.075, -0.58), null, true, true);

  var accentMesh = R.mesh(a);


  // ==========================================
  // 3. TINTED RACING CANOPY GLASS
  // ==========================================
  var g = new Builder();
  // Raked Windshield
  g.boxRot(0.185, 0.014, 0.15, new V3(0, 0.155, 0.10), -40, 0, 0);
  // Side Windows
  g.boxRot(0.010, 0.042, 0.14, new V3(-0.19, 0.16, -0.06), 0, 0, -4);
  g.boxRot(0.010, 0.042, 0.14, new V3(0.19, 0.16, -0.06), 0, 0, 4);
  // Rear Window
  g.boxRot(0.175, 0.014, 0.12, new V3(0, 0.16, -0.19), 36, 0, 0);
  var glassMesh = R.mesh(g);


  // ==========================================
  // 4. GLOWING HEADLIGHTS & TAILLIGHTS
  // ==========================================
  var l = new Builder();
  // Front LED Headlights
  l.boxRot(0.05, 0.018, 0.018, new V3(-0.18, 0.065, 0.54), -14, -8, 0);
  l.boxRot(0.05, 0.018, 0.018, new V3(0.18, 0.065, 0.54), -14, 8, 0);
  // Rear Taillights
  l.boxRot(0.045, 0.016, 0.014, new V3(-0.21, 0.10, -0.54), 8, 0, 0);
  l.boxRot(0.045, 0.016, 0.014, new V3(0.21, 0.10, -0.54), 8, 0, 0);
  // Rear center high neon brake light bar
  l.boxRot(0.13, 0.010, 0.012, new V3(0, 0.135, -0.48), 0, 0, 0);
  var lightsMesh = R.mesh(l);


  // ==========================================
  // 5. ROCKET BOOST THRUSTER INNER CORES
  // ==========================================
  var t = new Builder();
  t.cylinder(0.036, 0.010, 0.06, 10, new V3(-0.11, 0.075, -0.63), null, true, true);
  t.cylinder(0.036, 0.010, 0.06, 10, new V3(0.11, 0.075, -0.63), null, true, true);
  var thrusterMesh = R.mesh(t);


  // ==========================================
  // 6. WHEELS & 5-SPOKE ALLOY RIMS
  // ==========================================
  var w = new Builder();
  w.wheelCyl(1.0, 0.64, 16);
  w.wheelCyl(0.92, 0.66, 16);
  var wheelMesh = R.mesh(w);

  var hub = new Builder();
  hub.wheelCyl(0.70, 0.68, 14);
  hub.wheelCyl(0.24, 0.72, 10);
  for (var k = 0; k < 5; k++) {
    var ang = k / 5 * TAU;
    var qSpoke = new Quat().fromAxisAngle(1, 0, 0, ang);
    hub.box(0.33, 0.045, 0.22, new V3(0, Math.cos(ang) * 0.40, Math.sin(ang) * 0.40), qSpoke, 1);
  }
  var hubMesh = R.mesh(hub);

  // ==========================================
  // BALL & ARENA PROPS
  // ==========================================
  var ballB = new Builder();
  ballB.sphere(1, 32, 20);
  var ballMesh = R.mesh(ballB);

  var s = new Builder();
  var i0 = s.vert(-1, 0, -1, 0, 1, 0, 0, 0);
  var i1 = s.vert(1, 0, -1, 0, 1, 0, 1, 0);
  var i2 = s.vert(1, 0, 1, 0, 1, 0, 1, 1);
  var i3 = s.vert(-1, 0, 1, 0, 1, 0, 0, 1);
  s.quadN(i0, i1, i2, i3);
  var shadowMesh = R.mesh(s);

  var ps = new Builder();
  ps.polyDisc(0.92, 6, 0.015, 1, 1);
  ps.box(0.1, 0.1, 0.1, new V3(0, 0.3, 0), new Quat().fromAxisAngle(0.4, 1, 0.2, 0.9), 1);
  var padSmall = R.mesh(ps);

  var pb = new Builder();
  pb.polyDisc(1.85, 6, 0.015, 1, 1);
  for (var k2 = 0; k2 < 6; k2++) {
    var ang2 = k2 / 6 * TAU;
    pb.box(0.09, 0.55, 0.09, new V3(Math.cos(ang2) * 1.6, 0.55, Math.sin(ang2) * 1.6), null, 1);
  }
  pb.box(0.16, 0.16, 0.16, new V3(0, 0.95, 0), new Quat().fromAxisAngle(0.5, 1, 0.3, 0.7), 1);
  var padBig = R.mesh(pb);

  var kb = new Builder();
  kb.polyDisc(0.9, 24, 0.008, 1, 1);
  var ring = R.mesh(kb);

  return {
    body: bodyMesh, accent: accentMesh, glass: glassMesh, lights: lightsMesh, thruster: thrusterMesh,
    wheel: wheelMesh, hub: hubMesh,
    ball: ballMesh, shadow: shadowMesh, padSmall: padSmall, padBig: padBig, ring: ring
  };
}

Renderer.prototype.initTextures = function (arena) {
  if (this.initializedTextures) return;
  this.texField = this.texture(texField(arena), false, true);
  this.texPanel = this.texture(texPanel(), true, true);
  this.texNet = this.texture(texNet(), true, true);
  this.texBall = this.texture(texBall(), false, true);
  this.texBlob = this.texture(texBlob(), false, true);
  this.texSpark = this.texture(texSpark(), false, true);
  this.texCrowd = this.texture(texCrowd(), true, true);
  this.initializedTextures = true;
};

var _qIdentity = new Quat();
var _vOne = new V3(1, 1, 1);
var _vPos = new V3();
var _vScale = new V3();
var _qTemp = new Quat();

Renderer.prototype.drawArena = function (meshes, arena) {
  this.initTextures(arena);

  // Floor
  this.draw(meshes.floor, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
    tex: this.texField,
    spec: 0.45,
    rim: 0.15
  });

  // Shell / Walls
  this.draw(meshes.shell, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
    tex: this.texPanel,
    color: [0.38, 0.42, 0.52],
    spec: 0.3,
    rim: 0.3
  });

  // Crowd stands
  this.draw(meshes.crowd, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
    tex: this.texCrowd,
    emissive: [0.15, 0.18, 0.28],
    spec: 0.1
  });

  // Ceiling
  this.draw(meshes.ceiling, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
    tex: this.texPanel,
    color: [0.16, 0.18, 0.22]
  });

  // Stadium Floodlights
  this.draw(meshes.lights, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
    color: [1, 1, 1],
    emissive: [1.8, 1.8, 1.9],
    spec: 1.0
  });

  // Goals
  for (var g = 0; g < meshes.goals.length; g++) {
    var goal = meshes.goals[g];
    var teamCol = TEAM_COLOR[goal.team];

    this.draw(goal.cavity, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      color: [0.12, 0.13, 0.16],
      spec: 0.2
    });

    this.draw(goal.net, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      tex: this.texNet,
      color: [0.85, 0.9, 1.0],
      alphaTest: true,
      cull: false,
      spec: 0.3
    });

    this.draw(goal.frame, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      color: teamCol,
      emissive: [teamCol[0] * 0.85, teamCol[1] * 0.85, teamCol[2] * 0.85],
      spec: 0.9,
      rim: 0.6
    });
  }
};

Renderer.prototype.drawBoostPads = function (props, pads) {
  for (var i = 0; i < pads.length; i++) {
    var p = pads[i];
    var isBig = p.big;
    var active = p.active;

    var mesh = isBig ? props.padBig : props.padSmall;
    var emissiveVal = active ? (isBig ? [0.9, 0.75, 0.15] : [0.85, 0.65, 0.05]) : [0.08, 0.08, 0.08];
    var colVal = active ? [1.0, 0.9, 0.3] : [0.22, 0.22, 0.25];

    _qTemp.fromAxisAngle(0, 1, 0, p.anim);
    this.draw(mesh, p.pos, _qTemp, _vOne, {
      color: colVal,
      emissive: emissiveVal,
      spec: active ? 0.8 : 0.1,
      rim: active ? 0.6 : 0.0
    });

    // Outer glow ring on floor
    if (active) {
      var rScale = isBig ? 2.2 : 1.35;
      _vScale.set(rScale, 1, rScale);
      this.draw(props.ring, _vPos.set(p.pos.x, 0.015, p.pos.z), _qIdentity, _vScale, {
        color: [1.0, 0.8, 0.2],
        emissive: [0.8, 0.6, 0.1],
        blend: "add",
        opacity: 0.6 + Math.sin(p.anim * 2) * 0.2
      });
    }
  }
};

Renderer.prototype.drawVehicle = function (props, car, team) {
  var B = car.body;
  var col = TEAM_COLOR[team];
  var boostActive = car.boostActive;
  var CAR_SCALE = 2.75;
  var V = CFG.vehicle;
  var groundRestHeight = V.wheel.radius + V.wheel.rest - V.wheel.attachY;
  var upOffset = (CAR_SCALE - 1.0) * groundRestHeight;
  var carDrawPos = tv(B.pos.x + B.up.x * upOffset, B.pos.y + B.up.y * upOffset, B.pos.z + B.up.z * upOffset);

  // 1. Shadow beneath chassis
  var groundDist = Math.max(0, carDrawPos.y - 0.2);
  var shadowAlpha = clamp(1.0 - groundDist * 0.18, 0.08, 0.75);
  var shadowSpread = 1.0 + groundDist * 0.15;
  _vScale.set(0.65 * CAR_SCALE * shadowSpread, 1, 0.85 * CAR_SCALE * shadowSpread);
  this.draw(props.shadow, _vPos.set(carDrawPos.x, 0.01, carDrawPos.z), _qIdentity, _vScale, {
    tex: this.texBlob,
    blend: "shadow",
    opacity: shadowAlpha
  });

  _vScale.set(CAR_SCALE, CAR_SCALE, CAR_SCALE);

  // 2. Main Body Shell (Glossy Team Paint)
  this.draw(props.body, carDrawPos, B.quat, _vScale, {
    color: col,
    spec: 0.85,
    rim: 0.45
  });

  // 3. Trim / Accent & Roll Cage & Engine (Titanium/Carbon)
  var trimEmissive = boostActive ? [col[0] * 0.9, col[1] * 0.9, col[2] * 0.9] : [0.08, 0.08, 0.10];
  this.draw(props.accent, carDrawPos, B.quat, _vScale, {
    color: [0.15, 0.16, 0.19],
    emissive: trimEmissive,
    spec: 0.88,
    rim: 0.25
  });

  // 4. Glass cockpit (Dark tinted racing canopy)
  this.draw(props.glass, carDrawPos, B.quat, _vScale, {
    color: [0.05, 0.08, 0.12],
    emissive: [0.02, 0.03, 0.05],
    spec: 0.98,
    rim: 0.85
  });

  // 5. Glowing Headlights & Taillights
  if (props.lights) {
    this.draw(props.lights, carDrawPos, B.quat, _vScale, {
      color: [1.0, 1.0, 1.0],
      emissive: [1.8, 1.9, 2.1],
      spec: 1.0
    });
  }

  // 6. Rocket Thruster Exhaust Core (Intense glow on Boost!)
  if (props.thruster) {
    var thrusterEmissive = boostActive
      ? [2.8, 1.4, 0.3]
      : [0.35, 0.18, 0.04];
    this.draw(props.thruster, carDrawPos, B.quat, _vScale, {
      color: boostActive ? [1.0, 0.8, 0.2] : [0.4, 0.2, 0.1],
      emissive: thrusterEmissive,
      spec: 1.0
    });
  }

  // 7. Four Wheels & Rims
  var _wheelScale = new V3();
  for (var w = 0; w < 4; w++) {
    var wheel = car.wheels[w];
    var curR = (wheel && wheel.radius) ? wheel.radius : V.wheel.radius;
    _wheelScale.set(CAR_SCALE * curR, CAR_SCALE * curR, CAR_SCALE * curR);
    var relX = (wheel.center.x - B.pos.x) * CAR_SCALE;
    var relY = (wheel.center.y - B.pos.y) * CAR_SCALE;
    var relZ = (wheel.center.z - B.pos.z) * CAR_SCALE;
    var wPos = tv(carDrawPos.x + relX, carDrawPos.y + relY, carDrawPos.z + relZ);
    var wQuat = new Quat();

    // Rotate wheel around steer (Y) and rolling spin (X)
    var steerQ = new Quat().fromAxisAngle(0, 1, 0, wheel.steer);
    var rollQ = new Quat().fromAxisAngle(1, 0, 0, wheel.spin);
    wQuat.mul(B.quat, steerQ).mul(wQuat, rollQ);

    this.draw(props.wheel, wPos, wQuat, _wheelScale, {
      color: [0.10, 0.10, 0.12],
      spec: 0.35
    });

    this.draw(props.hub, wPos, wQuat, _wheelScale, {
      color: col,
      emissive: [col[0] * 0.25, col[1] * 0.25, col[2] * 0.25],
      spec: 0.90
    });
  }
};

Renderer.prototype.drawBall = function (props, ball) {
  var B = ball.body;
  var r = ball.radius;

  // Ball Ground Shadow & Indicator Ring
  var h = Math.max(0, B.pos.y);
  var shadowAlpha = clamp(1.0 - h * 0.04, 0.15, 0.85);
  var ringSize = r * (1.08 + h * 0.05);

  _vScale.set(ringSize, 1, ringSize);
  this.draw(props.shadow, _vPos.set(B.pos.x, 0.015, B.pos.z), _qIdentity, _vScale, {
    tex: this.texBlob,
    blend: "shadow",
    opacity: shadowAlpha
  });

  // Ball Landing Spot Ring
  var teamCol = ball.lastTouchTeam >= 0 ? TEAM_COLOR[ball.lastTouchTeam] : [1, 1, 1];
  this.draw(props.ring, _vPos.set(B.pos.x, 0.02, B.pos.z), _qIdentity, _vScale, {
    color: teamCol,
    emissive: [teamCol[0] * 0.6, teamCol[1] * 0.6, teamCol[2] * 0.6],
    blend: "add",
    opacity: clamp(0.9 - h * 0.03, 0.25, 0.9)
  });

  // Ball Mesh (exact physics radius r)
  _vScale.set(r, r, r);
  var flash = ball.hitFlash > 0 ? ball.hitFlash * 0.6 : 0;
  this.draw(props.ball, B.pos, B.quat, _vScale, {
    tex: this.texBall,
    spec: 0.7,
    rim: 0.5,
    emissive: [flash, flash, flash]
  });
};

Renderer.prototype.drawBallPrediction = function (props, points) {
  if (!points || points.length < 2) return;
  var col = [0.95, 0.85, 0.35];
  for (var i = 0; i < points.length - 1; i += 2) {
    var p0 = points[i];
    var p1 = points[Math.min(i + 1, points.length - 1)];
    var alpha = clamp(1.0 - (p0.t / 2.5), 0.1, 0.85);
    _vPos.set(p0.x, p0.y, p0.z);
    var pNext = tv(p1.x, p1.y, p1.z);
    this.line(_vPos, pNext, [col[0] * alpha, col[1] * alpha, col[2] * alpha]);
  }
  this.flushLines();
};

Renderer.prototype.drawEffectParticles = function (liveList) {
  if (!liveList || !liveList.length) return;
  this.drawParticles(liveList, liveList.length, this.texSpark || this.whiteTex);
};

Renderer.prototype.drawHitboxDebug = function (cars, ball) {
  var V = CFG.vehicle;
  var CAR_SCALE = 2.75;
  var scaleX = (V.ballHitboxScaleX || 1.25);
  var scaleY = (V.ballHitboxScaleY || 1.20);
  var scaleZ = (V.ballHitboxScaleZ || 1.25);

  var groundRestHeight = V.wheel.radius + V.wheel.rest - V.wheel.attachY;
  var upOffset = (CAR_SCALE - 1.0) * groundRestHeight;

  var self = this;
  function drawRoundedBoxWireframe(center, quat, hx, hy, hz, roundness, col) {
    var maxR = Math.min(hx, Math.min(hy, hz));
    var r = (roundness || 0) * maxR;
    if (r < 0.005) {
      var corners = [
        new V3(-hx, -hy, -hz), new V3(hx, -hy, -hz),
        new V3(hx, hy, -hz), new V3(-hx, hy, -hz),
        new V3(-hx, -hy, hz), new V3(hx, -hy, hz),
        new V3(hx, hy, hz), new V3(-hx, hy, hz)
      ];
      var worldPts = [];
      for (var i = 0; i < 8; i++) {
        var p = quat.rotate(corners[i], tv());
        p.add(center);
        worldPts.push(p);
      }
      // Bottom square
      self.line(worldPts[0], worldPts[1], col);
      self.line(worldPts[1], worldPts[2], col);
      self.line(worldPts[2], worldPts[3], col);
      self.line(worldPts[3], worldPts[0], col);
      // Top square
      self.line(worldPts[4], worldPts[5], col);
      self.line(worldPts[5], worldPts[6], col);
      self.line(worldPts[6], worldPts[7], col);
      self.line(worldPts[7], worldPts[4], col);
      // Vertical pillars
      self.line(worldPts[0], worldPts[4], col);
      self.line(worldPts[1], worldPts[5], col);
      self.line(worldPts[2], worldPts[6], col);
      self.line(worldPts[3], worldPts[7], col);
      return;
    }

    var ix = Math.max(0, hx - r), iy = Math.max(0, hy - r), iz = Math.max(0, hz - r);
    // Draw 12 edge lines for inner rounded box
    var edges = [
      // X edges
      [new V3(-ix, -hy, -iz), new V3(ix, -hy, -iz)],
      [new V3(-ix, hy, -iz), new V3(ix, hy, -iz)],
      [new V3(-ix, -hy, iz), new V3(ix, -hy, iz)],
      [new V3(-ix, hy, iz), new V3(ix, hy, iz)],
      // Y edges
      [new V3(-hx, -iy, -iz), new V3(-hx, iy, -iz)],
      [new V3(hx, -iy, -iz), new V3(hx, iy, -iz)],
      [new V3(-hx, -iy, iz), new V3(-hx, iy, iz)],
      [new V3(hx, -iy, iz), new V3(hx, iy, iz)],
      // Z edges
      [new V3(-hx, -hy, -iz), new V3(-hx, -hy, iz)],
      [new V3(hx, -hy, -iz), new V3(hx, -hy, iz)],
      [new V3(-hx, hy, -iz), new V3(-hx, hy, iz)],
      [new V3(hx, hy, -iz), new V3(hx, hy, iz)]
    ];
    for (var e = 0; e < edges.length; e++) {
      var p1 = quat.rotate(edges[e][0], tv()).add(center);
      var p2 = quat.rotate(edges[e][1], tv()).add(center);
      self.line(p1, p2, col);
    }

    // Corner arcs (8 corners)
    var SEGS = 3;
    var cornerSigns = [
      [-1,-1,-1], [1,-1,-1], [1,1,-1], [-1,1,-1],
      [-1,-1,1],  [1,-1,1],  [1,1,1],  [-1,1,1]
    ];
    for (var c = 0; c < 8; c++) {
      var cs = cornerSigns[c];
      var base = [cs[0] * ix, cs[1] * iy, cs[2] * iz];
      for (var axis = 0; axis < 3; axis++) {
        var a1 = (axis + 1) % 3, a2 = (axis + 2) % 3;
        var prevP = null;
        for (var s = 0; s <= SEGS; s++) {
          var ang = (s / SEGS) * (Math.PI * 0.5);
          var vec = [base[0], base[1], base[2]];
          vec[a1] += cs[a1] * Math.cos(ang) * r;
          vec[a2] += cs[a2] * Math.sin(ang) * r;
          var pt = quat.rotate(new V3(vec[0], vec[1], vec[2]), tv()).add(center);
          if (prevP) self.line(prevP, pt, col);
          prevP = pt;
        }
      }
    }
  }

  // Draw Vehicles
  if (cars) {
    for (var c = 0; c < cars.length; c++) {
      var car = cars[c];
      var B = car.body;
      var carCenter = tv(B.pos.x + B.up.x * upOffset, B.pos.y + B.up.y * upOffset, B.pos.z + B.up.z * upOffset);

      // 1. Physics Chassis Hitbox (wall/ground/car contact - Cyan/Green)
      var physCol = [0.2, 0.9, 0.9];
      drawRoundedBoxWireframe(carCenter, B.quat, V.hx * CAR_SCALE, V.hy * CAR_SCALE, V.hz * CAR_SCALE, V.chassisRoundness || 0.15, physCol);

      // 2. Ball-Hitbox (separate, enlarged striking box - Orange/Gold)
      var ballBoxCol = [1.0, 0.6, 0.1];
      drawRoundedBoxWireframe(carCenter, B.quat, V.hx * CAR_SCALE * scaleX, V.hy * CAR_SCALE * scaleY, V.hz * CAR_SCALE * scaleZ, V.ballBoxRoundness || 0.20, ballBoxCol);
    }
  }

  // Draw Ball Sphere wireframe circles (Red/Pink)
  if (ball) {
    var bPos = ball.body.pos;
    var bRad = ball.radius;
    var ballCol = [1.0, 0.2, 0.4];
    var segments = 24;
    // Circle in X-Z
    for (var k = 0; k < segments; k++) {
      var a1 = (k / segments) * TAU, a2 = ((k + 1) / segments) * TAU;
      self.line(
        tv(bPos.x + Math.cos(a1) * bRad, bPos.y, bPos.z + Math.sin(a1) * bRad),
        tv(bPos.x + Math.cos(a2) * bRad, bPos.y, bPos.z + Math.sin(a2) * bRad),
        ballCol
      );
    }
    // Circle in X-Y
    for (var k2 = 0; k2 < segments; k2++) {
      var b1 = (k2 / segments) * TAU, b2 = ((k2 + 1) / segments) * TAU;
      self.line(
        tv(bPos.x + Math.cos(b1) * bRad, bPos.y + Math.sin(b1) * bRad, bPos.z),
        tv(bPos.x + Math.cos(b2) * bRad, bPos.y + Math.sin(b2) * bRad, bPos.z),
        ballCol
      );
    }
    // Circle in Y-Z
    for (var k3 = 0; k3 < segments; k3++) {
      var c1 = (k3 / segments) * TAU, c2 = ((k3 + 1) / segments) * TAU;
      self.line(
        tv(bPos.x, bPos.y + Math.cos(c1) * bRad, bPos.z + Math.sin(c1) * bRad),
        tv(bPos.x, bPos.y + Math.cos(c2) * bRad, bPos.z + Math.sin(c2) * bRad),
        ballCol
      );
    }
  }

  this.flushLines();
};
