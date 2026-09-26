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
  if (this.rng.next() > amount * 16 * dt * CFG.gfx.particles) return;
  var p = this.spawn();
  if (!p) return;
  p.pos.copy(wheel.contact);
  p.pos.y += 0.05;
  p.vel.set(car.body.vel.x * 0.15 + this.rng.range(-0.5, 0.5), this.rng.range(0.4, 1.2), car.body.vel.z * 0.15 + this.rng.range(-0.5, 0.5));
  p.col[0] = 0.95; p.col[1] = 0.98; p.col[2] = 1.0;
  p.size = this.rng.range(0.08, 0.18);
  p.max = this.rng.range(0.15, 0.35);
  p.life = 0; p.grav = -0.6; p.drag = 2.8; p.fade = 0.25; p.grow = 0.4; p.stretch = 1;
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
