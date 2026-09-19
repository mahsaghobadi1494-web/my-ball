// @ts-nocheck
import { lerp, Quat } from './math.js';

var _quatScratch = [], _qi = 0;
for (var _q = 0; _q < 8; _q++) _quatScratch.push(new Quat());
function tvQuat(x, y, z, w) { var q = _quatScratch[_qi++ & 7]; q.set(x, y, z, w); return q; }

export function ReplayManager(nCars, seconds, hz) {
  this.hz = hz || 60;
  this.stride = 1 + nCars * 8 + 7;
  this.frames = Math.ceil(seconds * this.hz);
  this.buf = new Float32Array(this.frames * this.stride);
  this.nCars = nCars;
  this.head = 0;
  this.filled = 0;
  this.acc = 0;
  this.playing = false;
  this.playT = 0;
  this.playFrom = 0;
  this.playSpan = 0;
  this.speed = 1;
}
ReplayManager.prototype.reset = function () { this.head = 0; this.filled = 0; this.acc = 0; this.playing = false; };
ReplayManager.prototype.record = function (dt, cars, ball, time) {
  this.acc += dt;
  var step = 1 / this.hz;
  if (this.acc < step) return;
  this.acc = Math.min(this.acc - step, step);
  var b = this.buf, k = this.head * this.stride;
  b[k++] = time;
  for (var i = 0; i < cars.length; i++) {
    var c = cars[i].body;
    b[k++] = c.pos.x; b[k++] = c.pos.y; b[k++] = c.pos.z;
    b[k++] = c.quat.x; b[k++] = c.quat.y; b[k++] = c.quat.z; b[k++] = c.quat.w;
    b[k++] = cars[i].boostActive ? 1 : 0;
  }
  b[k++] = ball.body.pos.x; b[k++] = ball.body.pos.y; b[k++] = ball.body.pos.z;
  b[k++] = ball.body.quat.x; b[k++] = ball.body.quat.y; b[k++] = ball.body.quat.z; b[k++] = ball.body.quat.w;
  this.head = (this.head + 1) % this.frames;
  this.filled = Math.min(this.filled + 1, this.frames);
};
ReplayManager.prototype.start = function (seconds, speed) {
  if (this.filled < 8) return false;
  var n = Math.min(this.filled, Math.ceil(seconds * this.hz));
  this.playSpan = n;
  this.playFrom = (this.head - n + this.frames) % this.frames;
  this.playT = 0;
  this.speed = speed || 1;
  this.playing = true;
  return true;
};
ReplayManager.prototype.stop = function () { this.playing = false; };
ReplayManager.prototype.sample = function (dt, cars, ball) {
  if (!this.playing) return false;
  this.playT += dt * this.speed * this.hz;
  if (this.playT >= this.playSpan - 1) { this.playing = false; return false; }
  var i0 = Math.floor(this.playT), f = this.playT - i0;
  var a = (this.playFrom + i0) % this.frames, bIdx = (this.playFrom + i0 + 1) % this.frames;
  var A = a * this.stride, Bo = bIdx * this.stride, buf = this.buf;
  if (cars) {
    for (var i = 0; i < cars.length; i++) {
      var o = 1 + i * 8;
      var car = cars[i];
      if (!car) continue;
      var body = car.body;
      if (body && body.pos && body.quat) {
        body.pos.set(lerp(buf[A + o], buf[Bo + o], f), lerp(buf[A + o + 1], buf[Bo + o + 1], f), lerp(buf[A + o + 2], buf[Bo + o + 2], f));
        body.quat.set(buf[A + o + 3], buf[A + o + 4], buf[A + o + 5], buf[A + o + 6]);
        body.quat.slerpTo(tvQuat(buf[Bo + o + 3], buf[Bo + o + 4], buf[Bo + o + 5], buf[Bo + o + 6]), f);
        if (typeof body.updateBasis === "function") body.updateBasis();
        car.boostActive = buf[A + o + 7] > 0.5;
        car.rpos = body.pos;
        car.rquat = body.quat;
        car.rboost = car.boostActive;
      }
    }
  }
  var bo = 1 + (cars ? cars.length : 0) * 8;
  if (ball && ball.body && ball.body.pos && ball.body.quat) {
    var bBody = ball.body;
    bBody.pos.set(lerp(buf[A + bo], buf[Bo + bo], f), lerp(buf[A + bo + 1], buf[Bo + bo + 1], f), lerp(buf[A + bo + 2], buf[Bo + bo + 2], f));
    bBody.quat.set(buf[A + bo + 3], buf[A + bo + 4], buf[A + bo + 5], buf[A + bo + 6]);
    bBody.quat.slerpTo(tvQuat(buf[Bo + bo + 3], buf[Bo + bo + 4], buf[Bo + bo + 5], buf[Bo + bo + 6]), f);
    if (typeof bBody.updateBasis === "function") bBody.updateBasis();
    ball.rpos = bBody.pos;
    ball.rquat = bBody.quat;
  }
  return true;
};
