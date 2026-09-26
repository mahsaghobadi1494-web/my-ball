// @ts-nocheck
import { TAU, clamp, lerp, V3, RNG, tv } from './math.js';
import { CFG, TEAM_COLOR } from './config.js';

export function Particle() {
  this.pos = new V3(); this.vel = new V3();
  this.col = [1, 1, 1]; this.alpha = 0; this.size = 0.2;
  this.life = 0; this.max = 1; this.grav = 0; this.drag = 1.2; this.stretch = 1;
  this.fade = 1; this.grow = 0;
  this.active = false;
}

export function Effects(max) {
  this.pool = [];
  this.live = [];
  for (var i = 0; i < max; i++) this.pool.push(new Particle());
  this.count = 0;
  this.rng = new RNG(4242);
}
Effects.prototype.spawn = function () {
  if (!this.pool.length) return null;
  if (CFG.gfx.particles <= 0.001) return null;
  var p = this.pool.pop();
  p.active = true;
  this.live.push(p);
  return p;
};
Effects.prototype.clear = function () {
  while (this.live.length) { var p = this.live.pop(); p.active = false; this.pool.push(p); }
};
Effects.prototype.update = function (dt) {
  for (var i = this.live.length - 1; i >= 0; i--) {
    var p = this.live[i];
    p.life += dt;
    if (p.life >= p.max) {
      p.active = false;
      this.live.splice(i, 1);
      this.pool.push(p);
      continue;
    }
    p.vel.y -= p.grav * dt;
    p.vel.scale(Math.exp(-p.drag * dt));
    p.pos.addS(p.vel, dt);
    var k = 1 - p.life / p.max;
    p.alpha = p.fade * k * k;
    if (p.grow) p.size += p.grow * dt;
  }
  this.count = this.live.length;
};
Effects.prototype.boostFlame = function (car, dt) {
  var rate = 90 * CFG.gfx.particles;
  var n = Math.floor(rate * dt) + (this.rng.next() < rate * dt % 1 ? 1 : 0);
  var B = car.body;
  var teamCol = TEAM_COLOR[car.team];
  var CAR_SCALE = 2.75;
  var V = CFG.vehicle;
  var upOffset = (CAR_SCALE - 1.0) * (V.wheel.radius + V.wheel.rest - V.wheel.attachY);
  for (var i = 0; i < n; i++) {
    var p = this.spawn();
    if (!p) return;
    var back = tv(
      B.pos.x + B.up.x * upOffset - B.fwd.x * (0.60 * CAR_SCALE),
      B.pos.y + B.up.y * upOffset - B.fwd.y * (0.60 * CAR_SCALE) + 0.08,
      B.pos.z + B.up.z * upOffset - B.fwd.z * (0.60 * CAR_SCALE)
    );
    p.pos.set(back.x + this.rng.range(-0.2, 0.2), back.y + this.rng.range(-0.15, 0.15), back.z + this.rng.range(-0.2, 0.2));
    p.vel.set(B.vel.x - B.fwd.x * this.rng.range(8, 16), B.vel.y - B.fwd.y * this.rng.range(8, 16), B.vel.z - B.fwd.z * this.rng.range(8, 16));
    var hot = this.rng.next();
    p.col[0] = lerp(1.0, teamCol[0], hot * 0.75);
    p.col[1] = lerp(0.82, teamCol[1], hot * 0.75);
    p.col[2] = lerp(0.36, teamCol[2], hot * 0.75);
    p.size = this.rng.range(0.35, 0.75);
    p.max = this.rng.range(0.25, 0.50);
    p.life = 0; p.grav = -1.2; p.drag = 3.4; p.fade = 1.0; p.stretch = 1.3; p.grow = 0.8;
  }
};
Effects.prototype.tyreDust = function (car, wheel, amount, dt) {
  var gfxP = (CFG.gfx && CFG.gfx.particles !== undefined) ? CFG.gfx.particles : 1.0;
  if (gfxP <= 0.001) return;
  var speed = car.speed ? car.speed() : 0;
  if (speed < 1.0) return;

  var slip = wheel.slip || (amount * 8.0);
  var intensity = clamp(slip * 0.35 + amount * 1.5, 0.2, 3.5);
  var spawnRate = Math.floor(intensity * 38 * dt * gfxP) + (this.rng.next() < (intensity * 38 * dt * gfxP) % 1 ? 1 : 0);

  for (var k = 0; k < spawnRate; k++) {
    var p = this.spawn();
    if (!p) return;

    var B = car.body;
    p.pos.copy(wheel.contact);
    p.pos.y += 0.08;
    p.pos.x += this.rng.range(-0.15, 0.15);
    p.pos.z += this.rng.range(-0.15, 0.15);

    // Ballistic spray vector: flung backward and out tangentially from spinning wheels
    var spraySpeed = this.rng.range(3.5, 9.5) * (0.6 + amount * 0.8);
    var flingDirX = -B.fwd.x * 0.45 + (this.rng.range(-1, 1) * 0.85);
    var flingDirZ = -B.fwd.z * 0.45 + (this.rng.range(-1, 1) * 0.85);

    var type = this.rng.next();
    if (type < 0.40) {
      // 1. Dark Stadium Mud & Turf Earth Chunks (قهوه ای و خاک)
      p.col[0] = this.rng.range(0.18, 0.28);
      p.col[1] = this.rng.range(0.12, 0.18);
      p.col[2] = this.rng.range(0.06, 0.10);
      p.size = this.rng.range(0.14, 0.34);
      p.max = this.rng.range(0.35, 0.65);
      p.grav = 7.5; // Arcs and falls quickly under gravity
      p.drag = 1.2;
      p.fade = 1.0;
      p.stretch = 1.4;
      p.grow = 0.05;
      p.vel.set(
        B.vel.x * 0.2 + flingDirX * spraySpeed,
        this.rng.range(2.0, 5.5),
        B.vel.z * 0.2 + flingDirZ * spraySpeed
      );
    } else if (type < 0.70) {
      // 2. Sheared Lush Grass Turf Clippings (پرتاب تکه های چمن سبز)
      p.col[0] = this.rng.range(0.12, 0.22);
      p.col[1] = this.rng.range(0.55, 0.75);
      p.col[2] = this.rng.range(0.16, 0.28);
      p.size = this.rng.range(0.12, 0.26);
      p.max = this.rng.range(0.30, 0.55);
      p.grav = 5.0;
      p.drag = 1.8;
      p.fade = 0.95;
      p.stretch = 1.8;
      p.grow = 0.02;
      p.vel.set(
        B.vel.x * 0.15 + flingDirX * (spraySpeed * 0.8),
        this.rng.range(2.5, 6.0),
        B.vel.z * 0.15 + flingDirZ * (spraySpeed * 0.8)
      );
    } else {
      // 3. Hot Powerslide Tire Smoke Billows (دود لاستیک در دریفت)
      p.col[0] = 0.88; p.col[1] = 0.92; p.col[2] = 0.96;
      p.size = this.rng.range(0.20, 0.45);
      p.max = this.rng.range(0.40, 0.85);
      p.grav = -0.4; // Billows softly upward
      p.drag = 2.4;
      p.fade = 0.40;
      p.stretch = 1.0;
      p.grow = 0.95;
      p.vel.set(
        B.vel.x * 0.1 + this.rng.range(-0.6, 0.6),
        this.rng.range(0.8, 2.2),
        B.vel.z * 0.1 + this.rng.range(-0.6, 0.6)
      );
    }
    p.life = 0;
  }
};
Effects.prototype.sparks = function (pos, normal, strength, col) {
  var n = Math.floor(clamp(strength, 2, 26) * CFG.gfx.particles);
  for (var i = 0; i < n; i++) {
    var p = this.spawn();
    if (!p) return;
    p.pos.copy(pos);
    p.vel.set(normal.x * this.rng.range(1, 5) + this.rng.range(-3, 3),
              normal.y * this.rng.range(1, 5) + this.rng.range(-3, 3),
              normal.z * this.rng.range(1, 5) + this.rng.range(-3, 3));
    p.col[0] = col ? col[0] : 1.0; p.col[1] = col ? col[1] : 0.85; p.col[2] = col ? col[2] : 0.45;
    p.size = this.rng.range(0.05, 0.14);
    p.max = this.rng.range(0.18, 0.42);
    p.life = 0; p.grav = 5.5; p.drag = 1.1; p.fade = 1; p.stretch = 2.2; p.grow = 0;
  }
};
Effects.prototype.impactRing = function (pos, normal, strength) {
  var n = Math.floor(clamp(strength * 0.7, 3, 18) * CFG.gfx.particles);
  for (var i = 0; i < n; i++) {
    var p = this.spawn();
    if (!p) return;
    var a = i / n * TAU;
    var t1 = tv(normal.y, normal.z, normal.x);
    var t2 = tv().cross(normal, t1).norm();
    var t3 = tv().cross(normal, t2).norm();
    p.pos.copy(pos);
    var sp = this.rng.range(2.5, 6.5);
    p.vel.set((t2.x * Math.cos(a) + t3.x * Math.sin(a)) * sp, (t2.y * Math.cos(a) + t3.y * Math.sin(a)) * sp, (t2.z * Math.cos(a) + t3.z * Math.sin(a)) * sp);
    p.col[0] = 0.95; p.col[1] = 0.95; p.col[2] = 1.0;
    p.size = this.rng.range(0.1, 0.24);
    p.max = this.rng.range(0.16, 0.3);
    p.life = 0; p.grav = 0.5; p.drag = 4.5; p.fade = 0.8; p.stretch = 1.6; p.grow = 0.4;
  }
};
Effects.prototype.goalBurst = function (pos, team) {
  var col = TEAM_COLOR[team];
  var n = Math.floor(170 * CFG.gfx.particles);
  for (var i = 0; i < n; i++) {
    var p = this.spawn();
    if (!p) return;
    p.pos.set(pos.x + this.rng.range(-1.6, 1.6), pos.y + this.rng.range(-0.6, 2.4), pos.z + this.rng.range(-1.2, 1.2));
    var sp2 = this.rng.range(3, 18);
    var dx = this.rng.range(-1, 1), dy = this.rng.range(-0.2, 1.4), dz = this.rng.range(-1, 1);
    var l = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
    p.vel.set(dx / l * sp2, dy / l * sp2, dz / l * sp2);
    var mix = this.rng.next();
    p.col[0] = lerp(col[0], 1, mix * 0.7); p.col[1] = lerp(col[1], 1, mix * 0.7); p.col[2] = lerp(col[2], 1, mix * 0.7);
    p.size = this.rng.range(0.12, 0.5);
    p.max = this.rng.range(0.5, 1.5);
    p.life = 0; p.grav = 4.0; p.drag = 1.0; p.fade = 1; p.stretch = 1.4; p.grow = 0.1;
  }
};

// Grand celebratory goal effects launcher
Effects.prototype.playCelebration = function (effectId, pos, team) {
  var eff = String(effectId || 'donutstorm').toLowerCase();
  var teamCol = TEAM_COLOR[team] || [0.2, 0.8, 1.0];
  var px = pos ? pos.x : 0;
  var py = pos ? pos.y : 2.0;
  var pz = pos ? pos.z : 0;

  // Base goal burst & confetti for all
  this.goalBurst({ x: px, y: py, z: pz }, team);
  this.confettiBurst({ x: px, y: py, z: pz }, team);

  var n = Math.floor(280 * CFG.gfx.particles);

  if (eff.includes('donut') || eff.includes('cookie') || eff.includes('pastry')) {
    var donutColors = [[1.0, 0.45, 0.70], [0.45, 0.25, 0.15], [1.0, 0.85, 0.20], [0.20, 0.85, 1.0], [0.95, 0.95, 0.95]];
    for (var di = 0; di < n; di++) {
      var pd = this.spawn();
      if (!pd) break;
      pd.pos.set(px + this.rng.range(-2, 2), py + this.rng.range(0.5, 4), pz + this.rng.range(-2, 2));
      var spd = this.rng.range(8, 26);
      var angD = this.rng.next() * TAU;
      pd.vel.set(Math.cos(angD) * spd, this.rng.range(6, 22), Math.sin(angD) * spd);
      var cD = donutColors[di % donutColors.length];
      pd.col[0] = cD[0]; pd.col[1] = cD[1]; pd.col[2] = cD[2];
      pd.size = this.rng.range(0.35, 0.95);
      pd.max = this.rng.range(1.6, 3.5);
      pd.life = 0; pd.grav = 3.5; pd.drag = 0.85; pd.fade = 0.95; pd.grow = 0.2;
    }
  } else if (eff.includes('dragon') || eff.includes('hellfire') || eff.includes('inferno') || eff.includes('meteor') || eff.includes('fire') || eff.includes('flame')) {
    for (var k = 0; k < n; k++) {
      var p3 = this.spawn();
      if (!p3) break;
      p3.pos.set(px + this.rng.range(-2.5, 2.5), py + this.rng.range(0.5, 5), pz + this.rng.range(-2.5, 2.5));
      p3.vel.set(this.rng.range(-22, 22), this.rng.range(12, 32), this.rng.range(-22, 22));
      p3.col[0] = 1.0; p3.col[1] = this.rng.range(0.15, 0.85); p3.col[2] = 0.02;
      p3.size = this.rng.range(0.4, 1.3);
      p3.max = this.rng.range(1.2, 2.8);
      p3.life = 0; p3.grav = -2.0; p3.drag = 1.1; p3.fade = 1.0; p3.grow = 0.7;
    }
  } else if (eff.includes('gravity') || eff.includes('vortex') || eff.includes('void') || eff.includes('blackhole') || eff.includes('abyss')) {
    for (var j = 0; j < n; j++) {
      var p2 = this.spawn();
      if (!p2) break;
      var r = this.rng.range(3, 16);
      var ang = this.rng.next() * TAU;
      p2.pos.set(px + Math.cos(ang) * r, py + this.rng.range(1, 10), pz + Math.sin(ang) * r);
      p2.vel.set(-Math.cos(ang) * (r * 2.5), -1.8, -Math.sin(ang) * (r * 2.5));
      p2.col[0] = 0.45; p2.col[1] = 0.05; p2.col[2] = 0.85;
      p2.size = this.rng.range(0.3, 0.9);
      p2.max = this.rng.range(1.5, 2.8);
      p2.life = 0; p2.grav = -0.4; p2.drag = 0.6; p2.fade = 1.0; p2.grow = 0.2;
    }
  } else if (eff.includes('snow') || eff.includes('subzero') || eff.includes('crystal') || eff.includes('ice') || eff.includes('frost')) {
    for (var l = 0; l < n; l++) {
      var p4 = this.spawn();
      if (!p4) break;
      p4.pos.set(px + this.rng.range(-3, 3), py + this.rng.range(1, 8), pz + this.rng.range(-3, 3));
      p4.vel.set(this.rng.range(-16, 16), this.rng.range(4, 20), this.rng.range(-16, 16));
      p4.col[0] = 0.75; p4.col[1] = 0.95; p4.col[2] = 1.0;
      p4.size = this.rng.range(0.25, 0.65);
      p4.max = this.rng.range(1.8, 3.5);
      p4.life = 0; p4.grav = 4.0; p4.drag = 0.9; p4.fade = 0.9; p4.stretch = 2.2;
    }
  } else if (eff.includes('electro') || eff.includes('lightning') || eff.includes('atomizer') || eff.includes('plasma') || eff.includes('pulse')) {
    for (var ei = 0; ei < n; ei++) {
      var pe = this.spawn();
      if (!pe) break;
      pe.pos.set(px + this.rng.range(-2, 2), py + this.rng.range(1, 9), pz + this.rng.range(-2, 2));
      var eAng = this.rng.next() * TAU;
      var eSp = this.rng.range(16, 36);
      pe.vel.set(Math.cos(eAng) * eSp, this.rng.range(-6, 16), Math.sin(eAng) * eSp);
      pe.col[0] = 0.1; pe.col[1] = 0.9; pe.col[2] = 1.0;
      pe.size = this.rng.range(0.25, 0.7);
      pe.max = this.rng.range(0.9, 2.0);
      pe.life = 0; pe.grav = 0.5; pe.drag = 1.2; pe.fade = 1.0; pe.stretch = 4.0;
    }
  } else if (eff.includes('gold') || eff.includes('treasure') || eff.includes('coin') || eff.includes('rich')) {
    for (var gi = 0; gi < n; gi++) {
      var pg = this.spawn();
      if (!pg) break;
      pg.pos.set(px + this.rng.range(-2, 2), py + this.rng.range(2, 8), pz + this.rng.range(-2, 2));
      pg.vel.set(this.rng.range(-12, 12), this.rng.range(8, 24), this.rng.range(-12, 12));
      pg.col[0] = 1.0; pg.col[1] = 0.85; pg.col[2] = 0.15;
      pg.size = this.rng.range(0.3, 0.75);
      pg.max = this.rng.range(2.0, 4.0);
      pg.life = 0; pg.grav = 4.5; pg.drag = 0.9; pg.fade = 0.95; pg.grow = 0.1;
    }
  } else if (eff.includes('sakura') || eff.includes('flower') || eff.includes('petal')) {
    for (var si = 0; si < n; si++) {
      var ps = this.spawn();
      if (!ps) break;
      ps.pos.set(px + this.rng.range(-4, 4), py + this.rng.range(3, 12), pz + this.rng.range(-4, 4));
      ps.vel.set(this.rng.range(-8, 8), this.rng.range(2, 10), this.rng.range(-8, 8));
      ps.col[0] = 1.0; ps.col[1] = 0.60; ps.col[2] = 0.78;
      ps.size = this.rng.range(0.2, 0.5);
      ps.max = this.rng.range(2.5, 5.0);
      ps.life = 0; ps.grav = 1.2; ps.drag = 1.5; ps.fade = 0.9;
    }
  } else if (eff.includes('skull') || eff.includes('acid') || eff.includes('nuclear') || eff.includes('toxic')) {
    for (var m = 0; m < n; m++) {
      var p5 = this.spawn();
      if (!p5) break;
      p5.pos.set(px + this.rng.range(-2, 2), py + 1.5, pz + this.rng.range(-2, 2));
      var ang2 = this.rng.next() * TAU;
      var sp2 = this.rng.range(10, 28);
      p5.vel.set(Math.cos(ang2) * sp2, this.rng.range(4, 16), Math.sin(ang2) * sp2);
      p5.col[0] = 0.15; p5.col[1] = 0.98; p5.col[2] = 0.2;
      p5.size = this.rng.range(0.35, 0.9);
      p5.max = this.rng.range(1.2, 2.5);
      p5.life = 0; p5.grav = 1.2; p5.drag = 1.4; p5.fade = 1.0; p5.grow = 0.5;
    }
  } else {
    var rainbow = [[1, 0, 0], [1, 0.5, 0], [1, 1, 0], [0, 1, 0], [0, 0.8, 1], [0.8, 0, 1], [1, 0.85, 0.1]];
    for (var rIdx = 0; rIdx < n; rIdx++) {
      var p6 = this.spawn();
      if (!p6) break;
      p6.pos.set(px + this.rng.range(-2.5, 2.5), py + this.rng.range(2, 9), pz + this.rng.range(-2.5, 2.5));
      p6.vel.set(this.rng.range(-15, 15), this.rng.range(6, 22), this.rng.range(-15, 15));
      var rc = rainbow[rIdx % rainbow.length];
      p6.col[0] = rc[0]; p6.col[1] = rc[1]; p6.col[2] = rc[2];
      p6.size = this.rng.range(0.25, 0.75);
      p6.max = this.rng.range(1.8, 3.6);
      p6.life = 0; p6.grav = 2.5; p6.drag = 1.0; p6.fade = 1.0; p6.grow = 0.15;
    }
  }
};

// Grand celebratory stadium confetti cannons showering across the pitch
Effects.prototype.confettiBurst = function (pos, team) {
  var col = TEAM_COLOR[team] || [0.2, 0.8, 1.0];
  var confettiPalette = [
    [col[0], col[1], col[2]],
    [1.0, 0.85, 0.1], // Gold
    [1.0, 0.2, 0.6],  // Magenta
    [0.1, 1.0, 0.8],  // Cyan
    [1.0, 1.0, 1.0],  // White
    [0.4, 0.9, 0.2]   // Lime
  ];
  var n = Math.floor(120 * CFG.gfx.particles);
  for (var i = 0; i < n; i++) {
    var p = this.spawn();
    if (!p) return;
    p.pos.set(
      pos.x + this.rng.range(-6.0, 6.0),
      pos.y + this.rng.range(4.0, 14.0),
      pos.z + this.rng.range(-6.0, 6.0)
    );
    p.vel.set(
      this.rng.range(-8.0, 8.0),
      this.rng.range(2.0, 12.0),
      this.rng.range(-8.0, 8.0)
    );
    var cIdx = Math.floor(this.rng.next() * confettiPalette.length);
    var cp = confettiPalette[cIdx];
    p.col[0] = cp[0]; p.col[1] = cp[1]; p.col[2] = cp[2];
    p.size = this.rng.range(0.18, 0.42);
    p.max = this.rng.range(2.0, 4.0);
    p.life = 0;
    p.grav = 1.4; // Soft fluttering fall
    p.drag = 1.8;
    p.fade = 1.0;
    p.stretch = 1.2;
    p.grow = 0.0;
  }
};

// Atmospheric floating stadium dust motes & light sparkles
Effects.prototype.stadiumAtmosphere = function (arena, dt) {
  if (this.rng.next() > 18 * dt * CFG.gfx.particles) return;
  var p = this.spawn();
  if (!p) return;
  var hx = arena ? arena.hx * 0.75 : 30;
  var hz = arena ? arena.hz * 0.75 : 40;
  p.pos.set(
    this.rng.range(-hx, hx),
    this.rng.range(1.5, 14.0),
    this.rng.range(-hz, hz)
  );
  p.vel.set(
    this.rng.range(-0.4, 0.4),
    this.rng.range(-0.2, 0.5),
    this.rng.range(-0.4, 0.4)
  );
  p.col[0] = 0.85; p.col[1] = 0.95; p.col[2] = 1.0;
  p.size = this.rng.range(0.06, 0.16);
  p.max = this.rng.range(2.0, 4.5);
  p.life = 0;
  p.grav = -0.05;
  p.drag = 0.4;
  p.fade = 0.65;
  p.stretch = 1.0;
  p.grow = 0.02;
};

Effects.prototype.ballTrail = function (ball, dt) {
  var sp = ball.body.vel.len();
  if (sp < 17) return;
  var rate = clamp((sp - 17) * 3.2, 0, 60) * CFG.gfx.particles;
  if (this.rng.next() > rate * dt) return;
  var p = this.spawn();
  if (!p) return;
  p.pos.copy(ball.body.pos);
  p.pos.x += this.rng.range(-0.4, 0.4); p.pos.y += this.rng.range(-0.4, 0.4); p.pos.z += this.rng.range(-0.4, 0.4);
  p.vel.set(ball.body.vel.x * -0.06, ball.body.vel.y * -0.06, ball.body.vel.z * -0.06);
  var c = ball.lastTouchTeam >= 0 ? TEAM_COLOR[ball.lastTouchTeam] : [0.9, 0.9, 1];
  p.col[0] = c[0]; p.col[1] = c[1]; p.col[2] = c[2];
  p.size = this.rng.range(0.25, 0.55);
  p.max = 0.3;
  p.life = 0; p.grav = 0; p.drag = 2.4; p.fade = 0.5; p.stretch = 1; p.grow = 0.6;
};
