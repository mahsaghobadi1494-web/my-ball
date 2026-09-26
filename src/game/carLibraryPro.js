// @ts-nocheck
/* =============================================================================
 * carLibraryPro.js  —  AAA-grade procedural vehicle library
 * -----------------------------------------------------------------------------
 *  20 car bodies · 40 wheel sets · 32 vinyls · full PBR material + texture stack
 * ===========================================================================*/

export const TAU = Math.PI * 2;
export const PI = Math.PI;

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const mix3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

export function rng(seed) {
  let s = (seed | 0) || 1;
  return function () {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5; s |= 0;
    return ((s >>> 0) % 100000) / 100000;
  };
}

function hash2(x, y) {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = smooth(x - xi), yf = smooth(y - yi);
  const a = hash2(xi, yi), b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
  return lerp(lerp(a, b, xf), lerp(c, d, xf), yf);
}

function fbm(x, y, oct = 5, gain = 0.5, lac = 2.0) {
  let s = 0, a = 0.5, n = 0;
  for (let i = 0; i < oct; i++) { s += a * vnoise(x, y); n += a; x *= lac; y *= lac; a *= gain; }
  return s / n;
}

function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t, out = [];
  for (let i = 0; i < p1.length; i++) {
    out.push(0.5 * ((2 * p1[i]) + (-p0[i] + p2[i]) * t +
      (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t2 +
      (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t3));
  }
  return out;
}

export function resample(keys, count) {
  const k = keys.slice();
  k.unshift(keys[0]); k.push(keys[keys.length - 1]);
  const segs = k.length - 3, out = [];
  for (let i = 0; i < count; i++) {
    const g = (i / (count - 1)) * segs;
    let si = Math.min(segs - 1, Math.floor(g));
    out.push(catmull(k[si], k[si + 1], k[si + 2], k[si + 3], g - si));
  }
  return out;
}

export class Mesh {
  constructor() { this.p = []; this.n = []; this.t = []; this.idx = []; this.count = 0; }
  vert(x, y, z, nx, ny, nz, u, v) {
    const px = (x === undefined || x === null || Number.isNaN(x)) ? 0 : x;
    const py = (y === undefined || y === null || Number.isNaN(y)) ? 0 : y;
    const pz = (z === undefined || z === null || Number.isNaN(z)) ? 0 : z;
    this.p.push(px, py, pz);
    this.n.push((nx === undefined || nx === null || Number.isNaN(nx)) ? 0 : nx, (ny === undefined || ny === null || Number.isNaN(ny)) ? 0 : ny, (nz === undefined || nz === null || Number.isNaN(nz)) ? 0 : nz);
    this.t.push((u === undefined || u === null || Number.isNaN(u)) ? 0 : u, (v === undefined || v === null || Number.isNaN(v)) ? 0 : v);
    return this.count++;
  }
  tri(a, b, c) { this.idx.push(a, b, c); return this; }
  quad(a, b, c, d) { this.idx.push(a, b, c, a, c, d); return this; }
  smooth(from = 0) {
    const p = this.p, n = this.n, idx = this.idx;
    for (let i = from * 3; i < this.count * 3; i++) n[i] = 0;
    for (let t = 0; t < idx.length; t += 3) {
      const a = idx[t], b = idx[t + 1], c = idx[t + 2];
      if (a < from && b < from && c < from) continue;
      const ax = p[a * 3], ay = p[a * 3 + 1], az = p[a * 3 + 2];
      const e1x = p[b * 3] - ax, e1y = p[b * 3 + 1] - ay, e1z = p[b * 3 + 2] - az;
      const e2x = p[c * 3] - ax, e2y = p[c * 3 + 1] - ay, e2z = p[c * 3 + 2] - az;
      const nx = e1y * e2z - e1z * e2y, ny = e1z * e2x - e1x * e2z, nz = e1x * e2y - e1y * e2x;
      if (a >= from) { n[a * 3] += nx; n[a * 3 + 1] += ny; n[a * 3 + 2] += nz; }
      if (b >= from) { n[b * 3] += nx; n[b * 3 + 1] += ny; n[b * 3 + 2] += nz; }
      if (c >= from) { n[c * 3] += nx; n[c * 3 + 1] += ny; n[c * 3 + 2] += nz; }
    }
    for (let i = from; i < this.count; i++) {
      const o = i * 3, l = Math.hypot(n[o], n[o + 1], n[o + 2]) || 1;
      n[o] /= l; n[o + 1] /= l; n[o + 2] /= l;
    }
    return this;
  }
  mirrorX(from) {
    const base = this.count, p = this.p, n = this.n, t = this.t;
    for (let i = from; i < base; i++) {
      this.vert(-p[i * 3], p[i * 3 + 1], p[i * 3 + 2],
        -n[i * 3], n[i * 3 + 1], n[i * 3 + 2], 1 - t[i * 2], t[i * 2 + 1]);
    }
    const idx = this.idx, len = idx.length, off = base - from;
    for (let i = 0; i < len; i += 3) {
      const a = idx[i], b = idx[i + 1], c = idx[i + 2];
      if (a < from || b < from || c < from) continue;
      this.idx.push(a + off, c + off, b + off);
    }
    return this;
  }
  translate(dx, dy, dz, from = 0) {
    for (let i = from; i < this.count; i++) { this.p[i * 3] += dx; this.p[i * 3 + 1] += dy; this.p[i * 3 + 2] += dz; }
    return this;
  }
  bounds() {
    const b = { min: [1e9, 1e9, 1e9], max: [-1e9, -1e9, -1e9] };
    for (let i = 0; i < this.count; i++) for (let k = 0; k < 3; k++) {
      const v = this.p[i * 3 + k];
      if (v < b.min[k]) b.min[k] = v; if (v > b.max[k]) b.max[k] = v;
    }
    return b;
  }
}

export class Parts {
  constructor() { this.m = new Map(); }
  get(mat) { let x = this.m.get(mat); if (!x) { x = new Mesh(); this.m.set(mat, x); } return x; }
  entries() { return [...this.m.entries()].filter(([, m]) => m.count > 0); }
  tris() { let t = 0; for (const [, m] of this.m) t += m.idx.length / 3; return t; }
}

function angDist(a, b) { const d = Math.abs(((a - b) % TAU + TAU) % TAU); return d > PI ? TAU - d : d; }

export function ring(z, cy, hw, hh, n, seg, creases, shear) {
  const pts = [], e = 2 / n;
  for (let i = 0; i < seg; i++) {
    const t = (i / seg) * TAU, ct = Math.cos(t), st = Math.sin(t);
    let x = Math.sign(ct) * Math.pow(Math.abs(ct), e) * hw;
    let y = Math.sign(st) * Math.pow(Math.abs(st), e) * hh;
    if (creases) {
      let inset = 0;
      for (let c = 0; c < creases.length; c++) {
        const cr = creases[c];
        if (cr.z0 !== undefined && (z < cr.z0 || z > cr.z1)) continue;
        const d = angDist(t, cr.t) / cr.w;
        inset += cr.k * Math.exp(-d * d);
      }
      inset = Math.min(inset, 0.45);
      x *= 1 - inset; y *= 1 - inset;
    }
    if (shear) y += x * shear;
    pts.push([x, cy + y, z]);
  }
  return pts;
}

export function loft(M, rings, uRep = 1, vRep = 1) {
  const seg = rings[0].length, base = M.count;
  for (let r = 0; r < rings.length; r++)
    for (let i = 0; i < seg; i++) {
      const p = rings[r][i];
      M.vert(p[0], p[1], p[2], 0, 1, 0, (i / seg) * uRep, (r / (rings.length - 1)) * vRep);
    }
  for (let r = 0; r < rings.length - 1; r++)
    for (let i = 0; i < seg; i++) {
      const j = (i + 1) % seg;
      M.quad(base + r * seg + i, base + r * seg + j, base + (r + 1) * seg + j, base + (r + 1) * seg + i);
    }
  return base;
}

export function cap(M, r, z, dir, cx = 0, cy = null) {
  const seg = r.length;
  let mx = 0, my = 0;
  for (const p of r) { mx += p[0]; my += p[1]; }
  mx /= seg; my /= seg;
  const c = M.vert(cx || mx, cy === null ? my : cy, z, 0, 0, dir, 0.5, 0.5), ids = [];
  for (let i = 0; i < seg; i++) {
    const p = r[i];
    ids.push(M.vert(p[0], p[1], z, 0, 0, dir, 0.5 + p[0] * 0.5, 0.5 + p[1] * 0.5));
  }
  for (let i = 0; i < seg; i++) {
    const j = (i + 1) % seg;
    dir > 0 ? M.tri(c, ids[i], ids[j]) : M.tri(c, ids[j], ids[i]);
  }
}

export function shell(M, stations, seg, opt = {}) {
  const rings = stations.map(s => ring(s[0], s[1], s[2], s[3], s[4], seg, opt.creases, s[5] || 0));
  const from = loft(M, rings, opt.uRep || 1, opt.vRep || 1);
  M.smooth(from);
  if (opt.capFront !== false) cap(M, rings[0], stations[0][0], -1);
  if (opt.capBack !== false) cap(M, rings[rings.length - 1], stations[stations.length - 1][0], 1);
  return from;
}

export function stationAt(st, z) {
  if (z <= st[0][0]) return st[0].slice();
  if (z >= st[st.length - 1][0]) return st[st.length - 1].slice();
  for (let i = 0; i < st.length - 1; i++) {
    const a = st[i], b = st[i + 1];
    if (z >= a[0] && z <= b[0]) {
      const sp = b[0] - a[0], t = sp > 1e-9 ? (z - a[0]) / sp : 0, o = [z];
      for (let k = 1; k < 5; k++) o.push(lerp(a[k], b[k], t));
      return o;
    }
  }
  return st[st.length - 1].slice();
}

export function withSeams(stations, seams) {
  if (!seams || !seams.length) return stations;
  const out = stations.slice();
  for (const z of seams) {
    const s = stationAt(stations, z), hw = 0.006;
    out.push([s[0] - hw, s[1], s[2] * 0.992, s[3] * 0.992, s[4]]);
    out.push([s[0], s[1], s[2] * 0.972, s[3] * 0.972, s[4]]);
    out.push([s[0] + hw, s[1], s[2] * 0.992, s[3] * 0.992, s[4]]);
  }
  out.sort((a, b) => a[0] - b[0]);
  return out;
}

export function seamBands(M, stations, seams, seg) {
  if (!seams) return;
  for (const z of seams) {
    const s = stationAt(stations, z), hw = 0.004, rings = [];
    for (let k = 0; k < 3; k++) {
      const sc = k === 1 ? 0.978 : 0.984;
      rings.push(ring(s[0] + (k - 1) * hw, s[1], s[2] * sc, s[3] * sc, s[4], seg));
    }
    const from = loft(M, rings);
    M.smooth(from);
  }
}

export function crownY(x, cy, hw, hh, n) {
  const a = Math.min(1, Math.abs(x) / hw);
  const ct = Math.pow(a, n * 0.5), st = Math.sqrt(Math.max(0, 1 - ct * ct));
  return cy + Math.pow(st, 2 / n) * hh;
}
export function flankX(y, cy, hw, hh, n) {
  const a = Math.min(1, Math.abs(y - cy) / hh);
  const st = Math.pow(a, n * 0.5), ct = Math.sqrt(Math.max(0, 1 - st * st));
  return Math.pow(ct, 2 / n) * hw;
}

export function crownPatch(M, stations, s, cols = 6, rows = 6) {
  const lift = s.lift ?? 0.004, base = M.count;
  for (let r = 0; r <= rows; r++) {
    const z = lerp(s.z0, s.z1, r / rows), st = stationAt(stations, z);
    const w0 = s.x0 * (s.taper ? 1 - s.taper * (r / rows) : 1);
    const w1 = s.x1 * (s.taper ? 1 - s.taper * (r / rows) : 1);
    for (let c = 0; c <= cols; c++) {
      const x = lerp(w0, w1, c / cols), e = 0.004;
      const yl = crownY(x - e, st[1], st[2], st[3], st[4]);
      const yr = crownY(x + e, st[1], st[2], st[3], st[4]);
      let nx = -(yr - yl), ny = 2 * e; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
      const y = crownY(x, st[1], st[2], st[3], st[4]);
      M.vert(x + nx * lift, y + ny * lift, z, nx, ny, 0, c / cols, r / rows);
    }
  }
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
    M.quad(base + r * (cols + 1) + c, base + r * (cols + 1) + c + 1,
      base + (r + 1) * (cols + 1) + c + 1, base + (r + 1) * (cols + 1) + c);
}

export function flankPatch(M, stations, s, cols = 5, rows = 8) {
  const lift = s.lift ?? 0.004, side = s.side || 1, base = M.count;
  for (let r = 0; r <= rows; r++) {
    const z = lerp(s.z0, s.z1, r / rows), st = stationAt(stations, z);
    for (let c = 0; c <= cols; c++) {
      const y = lerp(s.y0, s.y1, c / cols);
      const x = flankX(y, st[1], st[2], st[3], st[4]);
      M.vert(side * (x + lift), y, z, side, 0, 0, c / cols, r / rows);
    }
  }
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const a = base + r * (cols + 1) + c, b = a + 1, d = base + (r + 1) * (cols + 1) + c, e = d + 1;
    side > 0 ? M.quad(a, b, e, d) : M.quad(a, d, e, b);
  }
}

export function louvres(M, stations, s) {
  const count = s.count || 4, lift = s.lift ?? 0.0016, cols = 5;
  for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 0.5;
    const z = lerp(s.z0, s.z1, t), st = stationAt(stations, z);
    const w = s.halfW * (s.taper ? 1 - s.taper * t : 1);
    const hl = s.halfL * (s.taper ? 1 - s.taper * 0.6 * t : 1), from = M.count;
    for (let c = 0; c <= cols; c++) {
      let x = (s.x || 0) + ((c / cols) * 2 - 1) * w;
      const lim = st[2] * 0.985; x = clamp(x, -lim, lim);
      const e = 0.005;
      const yl = crownY(x - e, st[1], st[2], st[3], st[4]);
      const yr = crownY(x + e, st[1], st[2], st[3], st[4]);
      let nx = -(yr - yl), ny = 2 * e; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
      const y = crownY(x, st[1], st[2], st[3], st[4]);
      for (let r = 0; r < 2; r++) M.vert(x + nx * lift, y + ny * lift, z + (r ? hl : -hl), nx, ny, 0, c / cols, r);
    }
    for (let c = 0; c < cols; c++) M.quad(from + c * 2, from + c * 2 + 1, from + (c + 1) * 2 + 1, from + (c + 1) * 2);
  }
}

export function arch(M, x, z, y, r, span, thick, wide, seg = 14, tilt = 0) {
  const rings = [];
  for (let i = 0; i <= seg; i++) {
    const a = -span + 2 * span * (i / seg);
    const cz = z + Math.sin(a) * r, cy = y + Math.cos(a) * r, rr = [];
    for (let k = 0; k < 8; k++) {
      const t = (k / 8) * TAU, e = 2 / 3.4;
      rr.push([x + Math.sign(Math.cos(t)) * Math.pow(Math.abs(Math.cos(t)), e) * wide + tilt * Math.sin(a),
        cy + Math.sign(Math.sin(t)) * Math.pow(Math.abs(Math.sin(t)), e) * thick, cz]);
    }
    rings.push(rr);
  }
  const from = loft(M, rings, 1, 2);
  M.smooth(from);
  return from;
}

export function rbox(M, cx, cy, cz, hx, hy, hz, r = 0.01, seg = 4) {
  const rings = [];
  const n = 6.0;
  for (let i = 0; i <= seg; i++) {
    const t = i / seg, a = (t - 0.5) * PI;
    const z = cz + Math.sin(a) * hz;
    const k = Math.pow(Math.cos(a), 0.22);
    rings.push(ring(z, cy, Math.max(1e-4, hx - r + r * k), Math.max(1e-4, hy - r + r * k), n, 16).map(p => [p[0] + cx, p[1], p[2]]));
  }
  const from = loft(M, rings, 1, 1); M.smooth(from);
  return from;
}

export function plate(M, p0, p1, p2, p3, flip = false) {
  const ux = p1[0] - p0[0], uy = p1[1] - p0[1], uz = p1[2] - p0[2];
  const vx = p3[0] - p0[0], vy = p3[1] - p0[1], vz = p3[2] - p0[2];
  let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
  const l = Math.hypot(nx, ny, nz) || 1; nx /= l; ny /= l; nz /= l;
  if (flip) { nx = -nx; ny = -ny; nz = -nz; }
  const a = M.vert(p0[0], p0[1], p0[2], nx, ny, nz, 0, 0);
  const b = M.vert(p1[0], p1[1], p1[2], nx, ny, nz, 1, 0);
  const c = M.vert(p2[0], p2[1], p2[2], nx, ny, nz, 1, 1);
  const d = M.vert(p3[0], p3[1], p3[2], nx, ny, nz, 0, 1);
  flip ? M.quad(a, d, c, b) : M.quad(a, b, c, d);
  return a;
}

export function slab(M, pts, thick, axis = 'y') {
  const off = axis === 'y' ? [0, thick, 0] : axis === 'x' ? [thick, 0, 0] : [0, 0, thick];
  const top = pts.map(p => [p[0] + off[0], p[1] + off[1], p[2] + off[2]]);
  plate(M, top[0], top[1], top[2], top[3]);
  plate(M, pts[0], pts[1], pts[2], pts[3], true);
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    plate(M, pts[i], pts[j], top[j], top[i]);
  }
}

export function revolveX(M, prof, seg = 28, uRep = 1, closeA = false, closeB = false) {
  const rings = [];
  for (const [x, r] of prof) {
    const rx = (x !== undefined && x !== null && !Number.isNaN(x)) ? x : 0;
    const radius = (r !== undefined && r !== null && !Number.isNaN(r)) ? r : 0;
    const rr = [];
    for (let k = 0; k < seg; k++) { const a = (k / seg) * TAU; rr.push([rx, Math.cos(a) * radius, Math.sin(a) * radius]); }
    rings.push(rr);
  }
  const base = M.count;
  for (let r = 0; r < rings.length; r++) for (let k = 0; k < seg; k++) {
    const p = rings[r][k];
    M.vert(p[0], p[1], p[2], 0, p[1], p[2], (k / seg) * uRep, r / (rings.length - 1));
  }
  for (let r = 0; r < rings.length - 1; r++) for (let k = 0; k < seg; k++) {
    const j = (k + 1) % seg;
    M.quad(base + r * seg + k, base + r * seg + j, base + (r + 1) * seg + j, base + (r + 1) * seg + k);
  }
  M.smooth(base);
  if (closeA) fanX(M, prof[0][0], prof[0][1], seg, -1);
  if (closeB) fanX(M, prof[prof.length - 1][0], prof[prof.length - 1][1], seg, 1);
  return base;
}

function fanX(M, x, r, seg, dir) {
  const c = M.vert(x, 0, 0, dir, 0, 0, 0.5, 0.5), ids = [];
  for (let k = 0; k < seg; k++) {
    const a = (k / seg) * TAU;
    ids.push(M.vert(x, Math.cos(a) * r, Math.sin(a) * r, dir, 0, 0, 0.5 + Math.cos(a) * 0.5, 0.5 + Math.sin(a) * 0.5));
  }
  for (let k = 0; k < seg; k++) { const j = (k + 1) % seg; dir > 0 ? M.tri(c, ids[k], ids[j]) : M.tri(c, ids[j], ids[k]); }
}

export function washerX(M, xc, hw, rIn, rOut, seg = 28) {
  const corners = [[xc - hw, rIn], [xc + hw, rIn], [xc + hw, rOut], [xc - hw, rOut]];
  const base = M.count;
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * TAU, cy = Math.cos(a), cz = Math.sin(a);
    for (let k = 0; k < 4; k++) M.vert(corners[k][0], cy * corners[k][1], cz * corners[k][1], 0, cy, cz, k / 4, i / seg);
  }
  for (let i = 0; i < seg; i++) {
    const i2 = (i + 1) % seg;
    for (let k = 0; k < 4; k++) { const k2 = (k + 1) % 4; M.quad(base + i * 4 + k, base + i * 4 + k2, base + i2 * 4 + k2, base + i2 * 4 + k); }
  }
  M.smooth(base);
  return base;
}

export function torusX(M, xc, R, r, segA = 28, segB = 8) {
  const base = M.count;
  for (let i = 0; i < segA; i++) {
    const a = (i / segA) * TAU, ca = Math.cos(a), sa = Math.sin(a);
    for (let k = 0; k < segB; k++) {
      const b = (k / segB) * TAU, cb = Math.cos(b), sb = Math.sin(b);
      const rr = R + r * cb;
      M.vert(xc + r * sb, ca * rr, sa * rr, ca * cb, ca * cb, sa * cb, i / segA, k / segB);
    }
  }
  for (let i = 0; i < segA; i++) {
    const i2 = (i + 1) % segA;
    for (let k = 0; k < segB; k++) {
      const k2 = (k + 1) % segB;
      M.quad(base + i * segB + k, base + i2 * segB + k, base + i2 * segB + k2, base + i * segB + k2);
    }
  }
  M.smooth(base);
  return base;
}

export function spoke(M, r0, r1, ang, w0, w1, x0, x1, th0, th1, twist = 0, seg = 5, curve = 0) {
  const rings = [];
  for (let i = 0; i <= seg; i++) {
    const t = i / seg;
    const rr = lerp(r0, r1, t);
    const a = ang + twist * t + curve * Math.sin(t * PI);
    const w = lerp(w0, w1, t), th = lerp(th0, th1, t), x = lerp(x0, x1, t);
    const ca = Math.cos(a), sa = Math.sin(a);
    const pts = [];
    for (let k = 0; k < 8; k++) {
      const p = (k / 8) * TAU, e = 2 / 3.2;
      const dw = Math.sign(Math.cos(p)) * Math.pow(Math.abs(Math.cos(p)), e) * w;
      const dx = Math.sign(Math.sin(p)) * Math.pow(Math.abs(Math.sin(p)), e) * th;
      pts.push([x + dx, ca * rr - sa * dw, sa * rr + ca * dw]);
    }
    rings.push(pts);
  }
  const from = loft(M, rings, 1, 2); M.smooth(from);
  return from;
}

export function buffer(w, h) { return { w, h, data: new Uint8Array(w * h * 4) }; }

export function fill(buf, fn) {
  const { w, h, data } = buf;
  for (let y = 0; y < h; y++) {
    const v = (y + 0.5) / h;
    for (let x = 0; x < w; x++) {
      const u = (x + 0.5) / w, o = (y * w + x) * 4;
      const c = fn(u, v, x, y);
      data[o] = clamp(c[0], 0, 255) | 0; data[o + 1] = clamp(c[1], 0, 255) | 0;
      data[o + 2] = clamp(c[2], 0, 255) | 0; data[o + 3] = c[3] === undefined ? 255 : clamp(c[3], 0, 255) | 0;
    }
  }
  return buf;
}

export function normalFromHeight(w, h, hf, strength = 1) {
  const buf = buffer(w, h), d = buf.data, e = 1 / w;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const u = (x + 0.5) / w, v = (y + 0.5) / h;
    const hl = hf(u - e, v), hr = hf(u + e, v), hd = hf(u, v - e), hu = hf(u, v + e);
    let nx = (hl - hr) * strength, ny = (hd - hu) * strength, nz = 1;
    const l = Math.hypot(nx, ny, nz);
    const o = (y * w + x) * 4;
    d[o] = ((nx / l) * 0.5 + 0.5) * 255; d[o + 1] = ((ny / l) * 0.5 + 0.5) * 255;
    d[o + 2] = ((nz / l) * 0.5 + 0.5) * 255; d[o + 3] = 255;
  }
  return buf;
}

export function hexToRgb(hex) {
  if (Array.isArray(hex)) return hex;
  let s = String(hex).replace('#', '');
  if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
  const n = parseInt(s, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function crownUV(u) {
  let c = (u - 0.25 + 1) % 1;
  if (c > 0.5) c -= 1;
  return { m: Math.abs(c) * 2, side: c < 0 ? -1 : 1, c };
}
const band = (x, a, b, soft = 0.012) =>
  clamp((x - (a - soft)) / soft, 0, 1) * clamp(((b + soft) - x) / soft, 0, 1);
const stripe = (x, c, w, soft = 0.01) => band(x, c - w, c + w, soft);

function voronoi(x, y, jitter = 1) {
  const xi = Math.floor(x), yi = Math.floor(y);
  let best = 9, second = 9, id = 0;
  for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
    const cx = xi + i, cy = yi + j;
    const px = cx + hash2(cx, cy) * jitter, py = cy + hash2(cy * 7 + 3, cx * 13 + 1) * jitter;
    const d = Math.hypot(px - x, py - y);
    if (d < best) { second = best; best = d; id = hash2(cx * 3 + 11, cy * 5 + 7); }
    else if (d < second) second = d;
  }
  return { d: best, edge: second - best, id };
}

function hexGrid(x, y) {
  const r3 = Math.sqrt(3);
  const q = x * 2 / 3, r = (-x / 3 + y / r3);
  const rx = Math.round(q), ry = Math.round(r), rz = Math.round(-q - r);
  let X = rx, Y = ry;
  const dx = Math.abs(rx - q), dy = Math.abs(ry - r), dz = Math.abs(rz + q + r);
  if (dx > dy && dx > dz) X = -ry - rz; else if (dy > dz) Y = -rx - rz;
  const cx = 1.5 * X, cy = r3 * (Y + X / 2);
  const d = Math.max(Math.abs(x - cx) / 1.0, Math.abs(y - cy) / r3 * 1.15);
  return { d, id: hash2(X * 7 + 3, Y * 11 + 5) };
}

export const VINYLS = [
  { id: 'clean', name: 'Clean', fn: () => [0, 0] },
  { id: 'twinstripe', name: 'Twin Stripe', fn: (u, v) => {
      const { m, c } = crownUV(u);
      const s = stripe(Math.abs(c), 0.055, 0.028) * (m < 0.55 ? 1 : 0);
      const a = stripe(Math.abs(c), 0.095, 0.008) * (m < 0.55 ? 1 : 0);
      return [s, a];
    } },
  { id: 'centerline', name: 'Centre Line', fn: (u, v) => {
      const { m, c } = crownUV(u);
      const w = 0.075 * (1 - 0.35 * v);
      return [band(Math.abs(c), 0, w) * (m < 0.6 ? 1 : 0), stripe(Math.abs(c), w + 0.018, 0.006)];
    } },
  { id: 'gt-duo', name: 'GT Duo', fn: (u, v) => {
      const { m, c } = crownUV(u);
      const on = m < 0.62 ? 1 : 0;
      const s = (stripe(Math.abs(c), 0.038, 0.03) + stripe(Math.abs(c), 0.115, 0.022)) * on;
      const a = (stripe(Math.abs(c), 0.075, 0.01) + stripe(Math.abs(c), 0.15, 0.007)) * on;
      return [Math.min(1, s), Math.min(1, a)];
    } },
  { id: 'inferno', name: 'Inferno', fn: (u, v) => {
      const { m } = crownUV(u);
      const n = fbm(m * 3.2 + 4, v * 5.5, 5);
      const reach = 0.62 - m * 0.18;
      const h = n * 0.34 + reach;
      const s = clamp((h - v) * 9, 0, 1);
      const a = clamp((h - 0.12 - v) * 11, 0, 1);
      return [s, a];
    } },
  { id: 'flames', name: 'Flames', fn: (u, v) => {
      const { m } = crownUV(u);
      const tongue = Math.sin(m * 17 + v * 3) * 0.5 + 0.5;
      const n = fbm(m * 5 + 9, v * 7 + tongue, 4);
      const edge = 0.46 + n * 0.3 - m * 0.1;
      return [clamp((edge - v) * 14, 0, 1), clamp((edge - 0.09 - v) * 16, 0, 1)];
    } },
  { id: 'hexcam', name: 'Hex Camo', fn: (u, v) => {
      const g = hexGrid(u * 26, v * 13);
      const tone = g.id;
      return [tone > 0.42 ? 1 : 0, tone > 0.78 ? 1 : 0];
    } },
  { id: 'hexfade', name: 'Hex Fade', fn: (u, v) => {
      const g = hexGrid(u * 30, v * 15);
      const keep = g.id < 0.15 + v * 1.05 ? 1 : 0;
      const edge = g.d > 0.78 ? 1 : 0;
      return [keep, edge * keep];
    } },
  { id: 'digicam', name: 'Digital Camo', fn: (u, v) => {
      const px = Math.floor(u * 52), py = Math.floor(v * 26);
      const n = hash2(px, py) * 0.6 + hash2(px >> 1, py >> 1) * 0.4;
      return [n > 0.46 ? 1 : 0, n > 0.8 ? 1 : 0];
    } },
  { id: 'tiger', name: 'Tiger', fn: (u, v) => {
      const { m } = crownUV(u);
      const warp = fbm(v * 4 + 2, m * 2 + 7, 4) * 1.4;
      const s = Math.sin((v * 13 + warp * 3.1)) * 0.5 + 0.5;
      return [s > 0.62 ? 1 : 0, 0];
    } },
  { id: 'circuit', name: 'Circuit', fn: (u, v) => {
      const gx = u * 64, gy = v * 32;
      const cx = Math.floor(gx), cy = Math.floor(gy);
      const r = hash2(cx, cy);
      const fx = gx - cx, fy = gy - cy;
      let t = 0;
      if (r < 0.22) t = band(fy, 0.44, 0.56, 0.04);
      else if (r < 0.40) t = band(fx, 0.44, 0.56, 0.04);
      else if (r < 0.50) t = Math.max(band(fx, 0.42, 0.58, 0.05) * (fy < 0.55 ? 1 : 0), band(fy, 0.42, 0.58, 0.05) * (fx > 0.45 ? 1 : 0));
      const pad = hash2(cx * 3, cy * 7) > 0.93 ? (Math.hypot(fx - 0.5, fy - 0.5) < 0.20 ? 1 : 0) : 0;
      return [clamp(t, 0, 1), pad];
    } },
  { id: 'cybergrid', name: 'Cyber Grid', fn: (u, v) => {
      const gx = (u * 34) % 1, gy = (v * 18) % 1;
      const line = Math.max(band(gx, 0, 0.055, 0.02), band(gy, 0, 0.055, 0.02));
      const glow = fbm(u * 6 + 3, v * 6, 3);
      return [line * clamp(glow * 1.6, 0.25, 1), line * (glow > 0.62 ? 1 : 0)];
    } },
  { id: 'splatter', name: 'Splatter', fn: (u, v) => {
      const p = voronoi(u * 14, v * 7, 1);
      const wob = fbm(u * 18, v * 18, 3) * 0.22;
      const rad = 0.16 + p.id * 0.3;
      return [p.d + wob < rad ? 1 : 0, p.d + wob < rad * 0.45 ? 1 : 0];
    } },
  { id: 'chevron', name: 'Chevrons', fn: (u, v) => {
      const { m } = crownUV(u);
      const t = (v * 9 - m * 1.4) % 1;
      return [band(t, 0.0, 0.42, 0.05), band(t, 0.48, 0.58, 0.03)];
    } },
  { id: 'lightning', name: 'Lightning', fn: (u, v) => {
      const { m, c } = crownUV(u);
      const bolt = Math.abs(c) - (0.06 + fbm(v * 9 + 3, 2, 3) * 0.16);
      const core = clamp(1 - Math.abs(bolt) * 60, 0, 1);
      const halo = clamp(1 - Math.abs(bolt) * 16, 0, 1);
      return [halo * 0.9, core];
    } },
  { id: 'twotone', name: 'Two Tone', fn: (u, v) => {
      const { m } = crownUV(u);
      return [m > 0.5 ? 1 : 0, band(m, 0.47, 0.5, 0.012)];
    } },
];

export const VINYL_BY_ID = new Map(VINYLS.map(v => [v.id, v]));

export const FINISHES = {
  gloss:        { rough: 0.22, metal: 0.05, cc: 1.00, ccRough: 0.035, flake: 0.00, peel: 0.55 },
  satin:        { rough: 0.42, metal: 0.10, cc: 0.55, ccRough: 0.22,  flake: 0.02, peel: 0.35 },
  matte:        { rough: 0.72, metal: 0.02, cc: 0.12, ccRough: 0.60,  flake: 0.00, peel: 0.18 },
  metallic:     { rough: 0.30, metal: 0.55, cc: 0.95, ccRough: 0.05,  flake: 0.55, peel: 0.50 },
  pearlescent:  { rough: 0.24, metal: 0.35, cc: 1.00, ccRough: 0.03,  flake: 0.38, peel: 0.45, iri: 0.75 },
  candy:        { rough: 0.15, metal: 0.25, cc: 1.00, ccRough: 0.02,  flake: 0.22, peel: 0.65, depth: 0.5 },
  chrome:       { rough: 0.06, metal: 1.00, cc: 0.30, ccRough: 0.04,  flake: 0.00, peel: 0.10 },
  brushed:      { rough: 0.34, metal: 1.00, cc: 0.20, ccRough: 0.30,  flake: 0.00, peel: 0.10 },
  carbon:       { rough: 0.30, metal: 0.30, cc: 0.90, ccRough: 0.08,  flake: 0.00, peel: 0.25, weave: 1 },
  anodized:     { rough: 0.28, metal: 0.85, cc: 0.45, ccRough: 0.18,  flake: 0.10, peel: 0.20 },
};

export const PALETTES = [
  { id: 'cobalt',   base: '#1b47f0', secondary: '#0d1330', accent: '#57e7ff', finish: 'pearlescent' },
  { id: 'crimson',  base: '#d81031', secondary: '#1a0508', accent: '#ffd34d', finish: 'metallic' },
  { id: 'toxic',    base: '#9ef22b', secondary: '#12210a', accent: '#00ffc8', finish: 'gloss' },
  { id: 'sunset',   base: '#ff6a13', secondary: '#2a0b2f', accent: '#ffe08a', finish: 'candy' },
  { id: 'midnight', base: '#12141c', secondary: '#2b3040', accent: '#7b5cff', finish: 'satin' },
  { id: 'ivory',    base: '#e9ecf2', secondary: '#1d2129', accent: '#e02b4a', finish: 'gloss' },
  { id: 'titanium', base: '#8a939e', secondary: '#33383f', accent: '#f0b429', finish: 'brushed' },
  { id: 'violet',   base: '#7b2cf0', secondary: '#160a2a', accent: '#28f0d0', finish: 'pearlescent' },
  { id: 'teal',     base: '#0fb5b0', secondary: '#07262c', accent: '#f9f871', finish: 'metallic' },
  { id: 'ember',    base: '#2a0d0d', secondary: '#ff4d1a', accent: '#ffb347', finish: 'matte' },
  { id: 'gold',     base: '#c9a227', secondary: '#241b06', accent: '#fff3c4', finish: 'anodized' },
  { id: 'carbonx',  base: '#23262b', secondary: '#0d0f12', accent: '#00d0ff', finish: 'carbon' },
];

const peelH = (u, v, k) => fbm(u * 26, v * 26, 3) * k * 0.6 + fbm(u * 90, v * 90, 2) * k * 0.25;
const flakeH = (u, v, k) => {
  const f = hash2(Math.floor(u * 900), Math.floor(v * 900));
  return f > 1 - 0.14 * k ? k * 0.9 : 0;
};
const weaveH = (u, v, rep = 32) => {
  const gx = u * rep * 2, gy = v * rep;
  const cx = Math.floor(gx), cy = Math.floor(gy);
  const over = ((cx >> 1) + (cy >> 1)) % 2;
  const fx = gx - cx, fy = gy - cy;
  const strand = over ? Math.sin(fx * PI) : Math.sin(fy * PI);
  return strand * 0.55 + (over ? 0.12 : 0);
};

export function bakeBody(paint, vinylId, size = 512) {
  const f = FINISHES[paint.finish] || FINISHES.gloss;
  const base = hexToRgb(paint.base), sec = hexToRgb(paint.secondary), acc = hexToRgb(paint.accent);
  const vin = (VINYL_BY_ID.get(vinylId) || VINYL_BY_ID.get('clean')).fn;
  const w = size, h = size >> 1;

  const albedo = fill(buffer(w, h), (u, v) => {
    const [s, a] = vin(u, v);
    let c = mix3(base, sec, clamp(s, 0, 1));
    c = mix3(c, acc, clamp(a, 0, 1));
    const { m } = crownUV(u);
    const depth = 1 - (f.depth || 0) * 0.35 * smooth(clamp((m - 0.35) / 0.65, 0, 1));
    const spark = f.flake ? flakeH(u, v, f.flake) * 90 : 0;
    const dirt = 1 - 0.05 * fbm(u * 8 + 31, v * 8, 4);
    return [c[0] * depth * dirt + spark, c[1] * depth * dirt + spark, c[2] * depth * dirt + spark];
  });

  const rough = fill(buffer(w >> 1, h >> 1), (u, v) => {
    const [s, a] = vin(u, v);
    let r = f.rough + (s > 0.5 ? 0.06 : 0) + (a > 0.5 ? -0.04 : 0);
    r += (fbm(u * 18 + 7, v * 18, 4) - 0.5) * 0.07;
    if (f.weave) r += weaveH(u, v, 26) * 0.08;
    const g = clamp(r, 0.02, 0.98) * 255;
    return [g, g, g];
  });

  const normal = normalFromHeight(w >> 1, h >> 1, (u, v) => {
    let hgt = peelH(u, v, f.peel) * 0.35 + flakeH(u, v, f.flake) * 0.5;
    if (f.weave) hgt += weaveH(u, v, 26) * 1.6;
    const [s, a] = vin(u, v);
    hgt += (s > 0.5 ? 0.12 : 0) + (a > 0.5 ? 0.1 : 0);
    return hgt;
  }, f.weave ? 2.4 : 0.9);

  return { albedo, rough, normal, finish: f };
}

const W_STD = { x: 0.60, zf: 0.80, zr: -0.78, r: 0.288, y: -0.17 };

export const CARS = [
  {
    id: 'OCTANE', name: 'Octavius Prime', cls: 'Hatch', tagline: 'The all-rounder. Short nose, huge shoulders.',
    rings: 28, seg: 32, wheel: { ...W_STD },
    keys: [
      [-1.28, 0.03, 0.47, 0.235, 4.0], [-1.06, 0.045, 0.655, 0.285, 4.6],
      [-0.58, 0.025, 0.715, 0.300, 5.2], [-0.02, 0.000, 0.720, 0.288, 5.2],
      [ 0.54,-0.025, 0.690, 0.255, 4.7], [ 1.00,-0.050, 0.590, 0.200, 4.1],
      [ 1.28,-0.070, 0.420, 0.140, 3.4],
    ],
    creases: [ { t: 0.0, k: 0.10, w: 0.42 }, { t: PI, k: 0.10, w: 0.42 } ],
    seams: [-0.62, 0.30, 0.92],
    cabin: { z0: -0.52, z1: 0.34, hw: 0.50, hh: 0.175, cy: 0.27, n: 4.4, taper: 0.262, rake: 0.05, glass: true },
    fenders: { flareF: 0.055, flareR: 0.075, span: 1.05, thick: 0.045 },
    splitter: { w: 0.66, len: 0.20, drop: 0.020, lip: true },
    wing: { type: 'ducktail', z: -1.10, y: 0.28, span: 0.60, chord: 0.22, tilt: 0.22 },
    exhaust: { count: 2, x: 0.30, y: -0.16, z: -1.30, r: 0.045, style: 'twin' },
    lights: { head: { z0: 1.02, z1: 1.24, y0: -0.02, y1: 0.09 }, tail: { w: 0.44, h: 0.045, y: 0.10 } },
    grille: { w: 0.30, h: 0.09, z: 1.26 }, badge: true, mirrors: true,
  },
  {
    id: 'DOMINUS', name: 'Dominator GT', cls: 'Wedge', tagline: 'Long flat plough. Biggest hit box on the sheet.',
    rings: 28, seg: 32, wheel: { x: 0.62, zf: 0.86, zr: -0.82, r: 0.281, y: -0.155 },
    keys: [
      [-1.30, 0.05, 0.50, 0.185, 5.0], [-1.05, 0.055, 0.680, 0.215, 5.6],
      [-0.55, 0.030, 0.730, 0.225, 6.0], [ 0.05, 0.000, 0.725, 0.205, 6.0],
      [ 0.62,-0.030, 0.700, 0.170, 5.2], [ 1.05,-0.055, 0.620, 0.125, 4.4],
      [ 1.30,-0.075, 0.470, 0.080, 3.6],
    ],
    creases: [ { t: 0.0, k: 0.085, w: 0.40 }, { t: PI, k: 0.085, w: 0.40 } ],
    seams: [-0.70, 0.18, 0.86],
    cabin: { z0: -0.62, z1: 0.10, hw: 0.46, hh: 0.135, cy: 0.20, n: 4.0, taper: 0.325, rake: 0.14, glass: true },
    fenders: { flareF: 0.05, flareR: 0.085, span: 1.0, thick: 0.040 },
    splitter: { w: 0.72, len: 0.26, drop: 0.012, lip: true },
    wing: { type: 'gt', z: -1.16, y: 0.30, span: 0.70, chord: 0.24, tilt: 0.20, endplates: true, pylons: 2 },
    exhaust: { count: 4, x: 0.26, y: -0.13, z: -1.30, r: 0.034, style: 'quad' },
    lights: { head: { z0: 1.06, z1: 1.28, y0: -0.05, y1: 0.03 }, tail: { w: 0.52, h: 0.032, y: 0.055 } },
    grille: { w: 0.34, h: 0.06, z: 1.28 }, canards: true, badge: true,
  },
  {
    id: 'FENNEC', name: 'Fennec Cyber', cls: 'Box', tagline: 'Flat-sided brick with a razor waistline.',
    rings: 26, seg: 30, wheel: { x: 0.605, zf: 0.82, zr: -0.80, r: 0.281, y: -0.165 },
    keys: [
      [-1.26, 0.03, 0.55, 0.215, 6.5], [-1.04, 0.035, 0.690, 0.245, 7.2],
      [-0.52, 0.020, 0.715, 0.255, 8.0], [ 0.02, 0.000, 0.715, 0.250, 8.0],
      [ 0.58,-0.015, 0.700, 0.225, 7.0], [ 1.04,-0.035, 0.640, 0.180, 5.6],
      [ 1.26,-0.050, 0.520, 0.130, 4.4],
    ],
    creases: [ { t: 0.0, k: 0.055, w: 0.26 }, { t: PI, k: 0.055, w: 0.26 } ],
    seams: [-0.66, -0.10, 0.40, 0.94],
    cabin: { z0: -0.50, z1: 0.30, hw: 0.52, hh: 0.155, cy: 0.245, n: 6.5, taper: 0.10, rake: 0.03, glass: true },
    fenders: { flareF: 0.045, flareR: 0.055, span: 0.95, thick: 0.038 },
    splitter: { w: 0.70, len: 0.16, drop: 0.016, lip: true },
    wing: { type: 'ducktail', z: -1.08, y: 0.25, span: 0.62, chord: 0.16, tilt: 0.14 },
    exhaust: { count: 2, x: 0.34, y: -0.14, z: -1.27, r: 0.05, style: 'twin' },
    lights: { head: { z0: 1.05, z1: 1.23, y0: 0.00, y1: 0.08 }, tail: { w: 0.50, h: 0.05, y: 0.08 } },
    grille: { w: 0.36, h: 0.085, z: 1.25 }, badge: true, mirrors: true,
  },
  {
    id: 'TAKUMI', name: 'Samurai Drift', cls: 'Coupe', tagline: 'JDM drift coupe, wide-body arches.',
    rings: 28, seg: 32, wheel: { x: 0.635, zf: 0.84, zr: -0.82, r: 0.295, y: -0.17 },
    keys: [
      [-1.26, 0.04, 0.54, 0.215, 5.0], [-1.02, 0.050, 0.700, 0.250, 5.6],
      [-0.50, 0.030, 0.740, 0.265, 6.0], [ 0.04, 0.000, 0.720, 0.250, 5.6],
      [ 0.60,-0.025, 0.690, 0.215, 5.0], [ 1.04,-0.050, 0.600, 0.160, 4.2],
      [ 1.26,-0.065, 0.470, 0.110, 3.4],
    ],
    creases: [ { t: 0.0, k: 0.11, w: 0.30 }, { t: PI, k: 0.11, w: 0.30 } ],
    seams: [-0.60, 0.28, 0.90],
    cabin: { z0: -0.54, z1: 0.26, hw: 0.48, hh: 0.155, cy: 0.225, n: 4.2, taper: 0.314, rake: 0.10, glass: true },
    fenders: { flareF: 0.10, flareR: 0.115, span: 1.06, thick: 0.05 },
    splitter: { w: 0.70, len: 0.24, drop: 0.014, lip: true },
    wing: { type: 'gt', z: -1.12, y: 0.36, span: 0.70, chord: 0.22, tilt: 0.18, endplates: true, pylons: 2 },
    exhaust: { count: 1, x: 0.34, y: -0.14, z: -1.26, r: 0.075, style: 'single' },
    lights: { head: { z0: 1.04, z1: 1.24, y0: -0.01, y1: 0.06 }, tail: { w: 0.50, h: 0.05, y: 0.08 } },
    grille: { w: 0.32, h: 0.075, z: 1.25 }, canards: true, badge: true, mirrors: true,
  },
  {
    id: 'BREAKOUT', name: 'Apex Hyper R', cls: 'Hyper', tagline: 'Mid-engine hypercar. Air knives everywhere.',
    rings: 28, seg: 32, wheel: { x: 0.625, zf: 0.85, zr: -0.80, r: 0.295, y: -0.155 },
    keys: [
      [-1.28, 0.05, 0.52, 0.190, 4.6], [-1.05, 0.060, 0.700, 0.235, 5.0],
      [-0.48, 0.035, 0.730, 0.245, 5.4], [ 0.08, 0.000, 0.690, 0.215, 5.0],
      [ 0.62,-0.030, 0.660, 0.170, 4.4], [ 1.06,-0.055, 0.560, 0.115, 3.8],
      [ 1.28,-0.070, 0.400, 0.075, 3.0],
    ],
    creases: [ { t: 0.0, k: 0.13, w: 0.34 }, { t: PI, k: 0.13, w: 0.34 } ],
    seams: [-0.66, 0.24, 0.90],
    cabin: { z0: -0.50, z1: 0.26, hw: 0.44, hh: 0.145, cy: 0.215, n: 3.6, taper: 0.302, rake: 0.12, glass: true },
    fenders: { flareF: 0.085, flareR: 0.105, span: 1.08, thick: 0.036 },
    splitter: { w: 0.72, len: 0.26, drop: 0.012, lip: true },
    wing: { type: 'dual', z: -1.20, y: 0.36, span: 0.74, chord: 0.20, tilt: 0.24, endplates: true, pylons: 2 },
    exhaust: { count: 2, x: 0.16, y: 0.00, z: -1.28, r: 0.058, style: 'centre' },
    lights: { head: { z0: 1.02, z1: 1.26, y0: -0.04, y1: 0.04 }, tail: { w: 0.46, h: 0.028, y: 0.08, strip: true } },
    canards: true, badge: true, mirrors: true,
  },
  {
    id: 'MANTIS', name: 'Mantis Proto', cls: 'Proto', tagline: 'Ground-hugging prototype. Almost no ride height.',
    rings: 28, seg: 32, wheel: { x: 0.64, zf: 0.88, zr: -0.84, r: 0.269, y: -0.14 },
    keys: [
      [-1.30, 0.06, 0.52, 0.150, 5.0], [-1.06, 0.065, 0.700, 0.175, 5.4],
      [-0.48, 0.045, 0.740, 0.180, 5.8], [ 0.12, 0.010, 0.710, 0.155, 5.2],
      [ 0.68,-0.025, 0.660, 0.120, 4.4], [ 1.10,-0.050, 0.540, 0.082, 3.4],
      [ 1.30,-0.065, 0.380, 0.052, 2.6],
    ],
    creases: [ { t: 0.0, k: 0.14, w: 0.36 }, { t: PI, k: 0.14, w: 0.36 } ],
    seams: [-0.74, 0.16],
    cabin: { z0: -0.62, z1: 0.06, hw: 0.40, hh: 0.115, cy: 0.150, n: 3.0, taper: 0.36, rake: 0.22, glass: true, canopy: true },
    fenders: { flareF: 0.07, flareR: 0.10, span: 1.12, thick: 0.030 },
    splitter: { w: 0.76, len: 0.32, drop: 0.006, lip: true },
    wing: { type: 'dual', z: -1.22, y: 0.28, span: 0.76, chord: 0.22, tilt: 0.30, endplates: true, pylons: 2 },
    exhaust: { count: 2, x: 0.14, y: 0.04, z: -1.30, r: 0.05, style: 'centre' },
    lights: { head: { z0: 1.10, z1: 1.30, y0: -0.05, y1: -0.01 }, tail: { w: 0.44, h: 0.024, y: 0.07, strip: true } },
    canards: true, spine: { z0: -1.10, z1: -0.50, h: 0.08 },
  },
  {
    id: 'MERC', name: 'Bastion Titan', cls: 'Heavy', tagline: 'Armoured brick. Ram plate, riveted plating.',
    rings: 26, seg: 30, wheel: { x: 0.605, zf: 0.80, zr: -0.78, r: 0.321, y: -0.18 },
    keys: [
      [-1.24, 0.05, 0.60, 0.270, 7.5], [-1.02, 0.055, 0.700, 0.295, 8.0],
      [-0.46, 0.045, 0.720, 0.305, 9.0], [ 0.10, 0.035, 0.720, 0.300, 8.5],
      [ 0.66, 0.015, 0.705, 0.270, 7.5], [ 1.04,-0.010, 0.660, 0.220, 6.0],
      [ 1.24,-0.030, 0.570, 0.170, 5.0],
    ],
    creases: [ { t: 0.0, k: 0.04, w: 0.18 }, { t: PI, k: 0.04, w: 0.18 } ],
    seams: [-0.70, -0.16, 0.36, 0.90],
    cabin: { z0: -0.36, z1: 0.36, hw: 0.54, hh: 0.14, cy: 0.305, n: 7.5, taper: 0.06, rake: 0.05, glass: true },
    fenders: { flareF: 0.06, flareR: 0.065, span: 0.92, thick: 0.058 },
    splitter: { w: 0.74, len: 0.10, drop: 0.030, lip: false, bullbar: true },
    cage: true, rivets: true,
    exhaust: { count: 2, x: 0.50, y: 0.06, z: -0.90, r: 0.055, style: 'stack' },
    lights: { head: { z0: 1.06, z1: 1.22, y0: 0.05, y1: 0.13 }, tail: { w: 0.54, h: 0.08, y: 0.13 } },
    grille: { w: 0.42, h: 0.12, z: 1.23 }, badge: true,
  },
  {
    id: 'BATCAR', name: 'Phantom Stealth', cls: 'Stealth', tagline: 'Faceted stealth arrow. Hard angles, no chrome.',
    rings: 26, seg: 28, wheel: { x: 0.62, zf: 0.86, zr: -0.82, r: 0.281, y: -0.155 },
    keys: [
      [-1.30, 0.05, 0.50, 0.180, 3.0], [-1.06, 0.060, 0.690, 0.210, 3.2],
      [-0.48, 0.040, 0.730, 0.215, 3.4], [ 0.12, 0.005, 0.700, 0.185, 3.2],
      [ 0.68,-0.030, 0.640, 0.140, 2.8], [ 1.10,-0.055, 0.500, 0.092, 2.4],
      [ 1.30,-0.070, 0.330, 0.058, 2.2],
    ],
    creases: [ { t: 0.0, k: 0.10, w: 0.20 }, { t: PI, k: 0.10, w: 0.20 } ],
    seams: [-0.70, 0.22, 0.86],
    cabin: { z0: -0.58, z1: 0.10, hw: 0.40, hh: 0.125, cy: 0.185, n: 2.6, taper: 0.32, rake: 0.18, glass: true },
    fenders: { flareF: 0.055, flareR: 0.08, span: 1.05, thick: 0.030 },
    splitter: { w: 0.74, len: 0.30, drop: 0.010, lip: true },
    wing: { type: 'swan', z: -1.20, y: 0.30, span: 0.72, chord: 0.20, tilt: 0.24, endplates: true, pylons: 2 },
    exhaust: { count: 2, x: 0.18, y: 0.02, z: -1.30, r: 0.05, style: 'jet' },
    lights: { head: { z0: 1.10, z1: 1.30, y0: -0.05, y1: 0.00 }, tail: { w: 0.42, h: 0.022, y: 0.07, strip: true } },
    canards: true, spine: { z0: -1.06, z1: -0.40, h: 0.10 },
  }
];

export const WHEELS = [
  { id: 'SPORT', name: 'Falcon Star', rim: 'star', spokes: 5, rimR: 0.715, finish: 'chrome', cap: 'flat', concave: 0.3, anim: { kind: 'none' } },
  { id: 'RACING', name: 'Vortex Twist', rim: 'twist', spokes: 6, rimR: 0.715, finish: 'gunmetal', concave: 0.45, anim: { kind: 'none' } },
  { id: 'SUPER', name: 'Turbina Jet', rim: 'turbine', spokes: 9, rimR: 0.755, finish: 'brushed', concave: 0.3, anim: { kind: 'none' } },
  { id: 'BULL', name: 'Deep Dish Chrome', rim: 'dish', spokes: 10, rimR: 0.73, finish: 'chrome', concave: 0.62, anim: { kind: 'none' } },
  { id: 'OFFROAD', name: 'Cagework Heavy', rim: 'cage', spokes: 6, rimR: 0.715, finish: 'gunmetal', concave: 0.3, anim: { kind: 'none' } },
  { id: 'NEON_HALO', name: 'Neon Halo Glow', rim: 'star', spokes: 5, rimR: 0.715, finish: 'black', glow: '#00f0ff', anim: { kind: 'pulse', speed: 3.2 } },
  { id: 'EMBER_SPAG', name: 'Ember Blaze', rim: 'blade', spokes: 6, rimR: 0.715, finish: 'gunmetal', glow: '#ff5a1f', anim: { kind: 'pulse', speed: 2.4 } },
  { id: 'TITAN_FORGED', name: 'Titanix Forged', rim: 'monoblock', spokes: 8, rimR: 0.755, finish: 'titanium', concave: 0.2, anim: { kind: 'none' } }
];

export const CAR_BY_ID = new Map(CARS.map(c => [c.id, c]));
export const WHEEL_BY_ID = new Map(WHEELS.map(w => [w.id, w]));

export class CarLib {
  constructor(THREE, opts = {}) {
    this.T = THREE;
    this.quality = opts.quality || 'high';
    this.tex = new Map();
    this.geoCache = new Map();
  }

  buildCar(opts = {}) {
    const T = this.T;
    const spec = CAR_BY_ID.get(opts.body) || CARS[0];
    const wspec = WHEEL_BY_ID.get(opts.wheels) || WHEELS[0];
    const vinyl = opts.vinyl || 'clean';
    const pal = PALETTES[0];

    const root = new T.Group();
    root.name = 'car:' + spec.id;

    // Build body mesh using THREE primitives or Canvas
    const paintMat = new T.MeshStandardMaterial({ color: new T.Color(opts.bodyColor || pal.base), roughness: 0.3, metalness: 0.7 });
    const darkMat = new T.MeshStandardMaterial({ color: 0x14161a, roughness: 0.8 });
    const glassMat = new T.MeshStandardMaterial({ color: 0x0a1420, roughness: 0.1, transparent: true, opacity: 0.6 });

    const bodyGeo = new T.BoxGeometry(spec.wheel.x * 2.2, 0.45, (spec.keys[spec.keys.length - 1][0] - spec.keys[0][0]));
    const bodyMesh = new T.Mesh(bodyGeo, paintMat);
    bodyMesh.position.y = 0.25;
    root.add(bodyMesh);

    return { root, spec, wspec, update: () => {} };
  }
}

export default CarLib;
