// @ts-nocheck
import { PI, clamp, V3, Quat, RNG, tv, tc } from './math.js';
import { CFG, TEAM } from './config.js';

export var AI_STATES = ["SEARCH_BALL", "CHASE", "ATTACK", "DEFEND", "ROTATE", "RECOVER", "COLLECT_BOOST", "RETURN_TO_GOAL"];
export var SKILL = [
  { react: 0.24, steerK: 1.5, boost: 0.35, aerial: 0.0, flip: 0.25, error: 3.2, speed: 0.72 },
  { react: 0.17, steerK: 2.0, boost: 0.55, aerial: 0.25, flip: 0.5, error: 1.9, speed: 0.85 },
  { react: 0.11, steerK: 2.6, boost: 0.75, aerial: 0.5, flip: 0.7, error: 1.0, speed: 0.95 },
  { react: 0.07, steerK: 3.2, boost: 0.92, aerial: 0.8, flip: 0.9, error: 0.45, speed: 1.0 }
];

export function AIController(car, world) {
  this.car = car;
  this.world = world;
  this.state = "SEARCH_BALL";
  this.timer = 0;
  this.role = 2;
  this.target = new V3();
  this.rng = new RNG(1000 + car.index * 977);
  this.jitter = new V3();
  this.jitterTimer = 0;
  this.aerial = false;
  this.aerialTimer = 0;
  this.padTarget = null;
  this.lastJump = 0;
  this.driftFix = 0;
}
AIController.prototype.skill = function () { return SKILL[clamp(Math.round(CFG.ai.skill), 0, 3)]; };
AIController.prototype.ownGoal = function () { return this.car.team === TEAM.PULSE ? -CFG.arena.hz : CFG.arena.hz; };
AIController.prototype.oppGoal = function () { return this.car.team === TEAM.PULSE ? CFG.arena.hz : -CFG.arena.hz; };
AIController.prototype.intercept = function () {
  var pred = this.world.prediction, car = this.car;
  var best = null, bestScore = 1e9;
  var sk = this.skill();
  var maxSpeed = CFG.physics.maxCarSpeed * sk.speed;
  for (var i = 0; i < pred.length; i += 2) {
    var p = pred[i];
    var d = Math.sqrt((p.x - car.body.pos.x) * (p.x - car.body.pos.x) + (p.z - car.body.pos.z) * (p.z - car.body.pos.z));
    var reach = d / Math.max(6, maxSpeed * 0.8);
    var heightPenalty = Math.max(0, p.y - 2.2) * (1.6 - sk.aerial);
    var score = Math.abs(reach - p.t) + heightPenalty;
    if (score < bestScore) { bestScore = score; best = p; }
  }
  return best;
};
AIController.prototype.decide = function (dt) {
  var car = this.car, world = this.world, ball = world.ball, sk = this.skill();
  var B = car.body;
  var toBall = B.pos.dist(ball.body.pos);
  var own = this.ownGoal(), opp = this.oppGoal();
  var side = own < 0 ? -1 : 1;
  var ballBehind = (ball.body.pos.z - B.pos.z) * (opp > 0 ? 1 : -1) < -3;
  if (!car.grounded && (B.up.y < 0.35 || car.airTime > 0.45) && !this.aerial) {
    this.state = "RECOVER";
  } else if (world.state === "KICKOFF") {
    this.state = this.role === 0 ? "CHASE" : "COLLECT_BOOST";
  } else if (this.role === 0) {
    var ballInOwnHalf = (ball.body.pos.z - own) * -side < CFG.arena.hz * 0.55;
    this.state = ballInOwnHalf && ballBehind ? "DEFEND" : (toBall < 26 ? "ATTACK" : "CHASE");
  } else if (this.role === 1) {
    if (toBall < 19 && car.boost > 10 && !ballBehind) this.state = "CHASE";
    else if (car.boost < CFG.ai.boostThreshold) this.state = "COLLECT_BOOST";
    else this.state = ballBehind ? "DEFEND" : "ROTATE";
  } else {
    var ballThreat = (ball.body.pos.z - own) * -side < CFG.arena.hz * 0.5;
    if (ballThreat) this.state = "DEFEND";
    else if (car.boost < 42) this.state = "COLLECT_BOOST";
    else this.state = "RETURN_TO_GOAL";
  }
  var hit = this.intercept();
  this.aerial = false;
  if (hit && (this.state === "ATTACK" || this.state === "CHASE") && sk.aerial > 0.2) {
    var high = hit.y > 3.4 && hit.y < 12;
    var close = Math.abs(hit.x - B.pos.x) + Math.abs(hit.z - B.pos.z) < 9;
    if (high && close && car.boost > 25 && this.rng.next() < sk.aerial) { this.aerial = true; this.aerialTimer = 1.4; }
  }
  this.hit = hit;
};
AIController.prototype.chooseBoostPad = function () {
  var car = this.car, best = null, bestD = 1e9;
  var pads = this.world.pads;
  var goalDir = this.oppGoal() > 0 ? 1 : -1;
  for (var i = 0; i < pads.length; i++) {
    var p = pads[i];
    if (!p.active) continue;
    var d = Math.sqrt((p.pos.x - car.body.pos.x) * (p.pos.x - car.body.pos.x) + (p.pos.z - car.body.pos.z) * (p.pos.z - car.body.pos.z));
    if (!p.big) d *= 2.1;
    if (d < 4) d += 34;
    if ((p.pos.z - car.body.pos.z) * goalDir < -14) d *= 1.6;
    if (d < bestD) { bestD = d; best = p; }
  }
  return best;
};
AIController.prototype.attackPoint = function (ballPos, out) {
  out = out || tv();
  var opp = this.oppGoal(), R = this.world.ball.radius;
  var gx = clamp(ballPos.x * 0.35, -CFG.arena.goalHalfW * 0.55, CFG.arena.goalHalfW * 0.55);
  var dir = tv(gx - ballPos.x, 0, opp - ballPos.z);
  if (dir.lenSq() < 1e-6) dir.set(0, 0, opp > 0 ? 1 : -1);
  dir.norm();
  var carPos = this.car.body.pos;
  var toBall = tv(ballPos.x - carPos.x, 0, ballPos.z - carPos.z);
  var dist = toBall.len();
  if (dist > 1e-4) toBall.scale(1 / dist);
  var align = toBall.dot(dir);
  if (align > 0.2 || dist < 3.2) {
    out.set(ballPos.x + dir.x * 0.9, ballPos.y * 0.4 + 0.3, ballPos.z + dir.z * 0.9);
  } else {
    var arc = 1.4 + (1 - Math.max(-1, align)) * 1.8;
    out.set(ballPos.x - dir.x * (R + arc), ballPos.y * 0.35 + 0.3, ballPos.z - dir.z * (R + arc));
  }
  return out;
};
AIController.prototype.driveTo = function (target, dt, allowBoost, coast) {
  var car = this.car, B = car.body, sk = this.skill(), vin = car.input;
  var to = tv(target.x - B.pos.x, target.y - B.pos.y, target.z - B.pos.z);
  var flat = tv(to.x, 0, to.z);
  var dist = flat.len();
  var fwdFlat = tv(B.fwd.x, 0, B.fwd.z);
  if (fwdFlat.lenSq() < 1e-5) fwdFlat.set(0, 0, 1);
  fwdFlat.norm();
  if (dist > 1e-4) flat.scale(1 / dist);
  var dot = clamp(fwdFlat.dot(flat), -1, 1);
  var cross = fwdFlat.x * flat.z - fwdFlat.z * flat.x;
  var ang = Math.atan2(-cross, dot);
  var vin_steer = clamp(ang * sk.steerK, -1, 1);
  var speed = car.speed();
  var reverse = false;
  this.reverseTimer = Math.max(0, (this.reverseTimer || 0) - dt);
  if (Math.abs(ang) > 2.35 && speed < 4.5 && dist < 7.5) this.reverseTimer = 0.5;
  if (this.reverseTimer > 0) reverse = true;
  vin.steer = reverse ? -vin_steer : vin_steer;
  vin.throttle = reverse ? -1 : 1;
  if (coast && !reverse && dist < 2.4 && speed > 9) vin.throttle = 0.1;
  vin.slide = !reverse && Math.abs(ang) > 1.15 && speed > 9;
  vin.boost = false;
  if (allowBoost && !reverse && Math.abs(ang) < 0.35 && speed < CFG.physics.maxCarSpeed * sk.speed - 1.5) {
    vin.boost = car.boost > (this.state === "ATTACK" ? 4 : 22) && this.rng.next() < sk.boost;
  }
  if (!reverse && car.grounded && dist > 26 && speed > 11 && car.boost < 12 && Math.abs(ang) < 0.2 && this.rng.next() < sk.flip * 0.02) {
    vin.jumpEdge = true;
    this.flipQueue = 0.09;
  }
  return { dist: dist, ang: ang };
};

var _quatScratch = [], _qi = 0;
for (var _q = 0; _q < 8; _q++) _quatScratch.push(new Quat());
function tvQuat(x, y, z, w) { var q = _quatScratch[_qi++ & 7]; q.set(x, y, z, w); return q; }
var _alignOut = { pitch: 0, yaw: 0, roll: 0, error: 0 };

export function alignInputs(B, fwdTarget, upTarget, out, kp, kd) {
  var desired = new Quat().look(fwdTarget, upTarget);
  var inv = tvQuat(-B.quat.x, -B.quat.y, -B.quat.z, B.quat.w);
  var err = new Quat().mul(desired, inv);
  if (err.w < 0) { err.x = -err.x; err.y = -err.y; err.z = -err.z; err.w = -err.w; }
  var sinHalf = Math.sqrt(Math.max(0, 1 - err.w * err.w));
  var angle = 2 * Math.acos(clamp(err.w, -1, 1));
  var errW = tv();
  if (sinHalf > 1e-5) errW.set(err.x / sinHalf * angle, err.y / sinHalf * angle, err.z / sinHalf * angle);
  var errL = B.quat.rotateInv(errW, tv());
  var wL = B.quat.rotateInv(B.angVel, tv());
  kp = kp || 3.4; kd = kd || 0.65;
  out.pitch = clamp(errL.x * kp - wL.x * kd, -1, 1);
  out.yaw = clamp(errL.y * kp - wL.y * kd, -1, 1);
  out.roll = clamp(errL.z * kp * 1.2 - wL.z * kd * 1.4, -1, 1);
  out.error = angle;
  return out;
}

AIController.prototype.airTo = function (dirTarget, dt, boostOk) {
  var car = this.car, B = car.body, vin = car.input;
  var up = tv(0, 1, 0);
  alignInputs(B, dirTarget, up, _alignOut, 3.6, 0.8);
  vin.pitch = _alignOut.pitch;
  vin.yaw = _alignOut.yaw;
  vin.roll = 0;
  vin.rollLeft = _alignOut.roll > 0.35;
  vin.rollRight = _alignOut.roll < -0.35;
  vin.throttle = 0;
  vin.steer = 0;
  vin.slide = false;
  vin.boost = !!boostOk && _alignOut.error < 0.45 && car.boost > 2;
  return _alignOut.error;
};

AIController.prototype.update = function (dt) {
  var car = this.car, world = this.world, ball = world.ball, B = car.body, vin = car.input, sk = this.skill();
  this.timer -= dt;
  if (this.timer <= 0) { this.timer = Math.max(0.03, sk.react + this.rng.range(-0.02, 0.03)); this.decide(dt); }
  if (this.flipQueue) {
    this.flipQueue -= dt;
    if (this.flipQueue <= 0) { this.flipQueue = 0; vin.jumpEdge = true; vin.throttle = 1; }
  }
  var own = this.ownGoal(), opp = this.oppGoal();
  var hit = this.hit;
  var st = this.state;
  vin.rollLeft = false; vin.rollRight = false; vin.pitch = 0; vin.yaw = 0; vin.roll = 0;
  if (st === "RECOVER") {
    if (car.grounded) { this.state = "CHASE"; }
    else {
      // If AI bot is stuck upside down on roof on the ground, press jump
      if (car.roofContact > 0 || (car.chassisContact > 0 && B.up.y < -0.15 && B.pos.y < 1.45)) {
        if (car.turtleState === 0 && car.jumpCooldown <= 0) {
          vin.jumpEdge = true;
        }
      }
      var dirv = tv(B.vel.x, 0, B.vel.z);
      if (dirv.lenSq() < 1) dirv.set(0, 0, opp > 0 ? 1 : -1);
      dirv.norm();
      this.airTo(dirv, dt, false);
      return;
    }
  }
  if (this.aerial && !car.grounded && hit) {
    this.aerialTimer -= dt;
    var toHit = tv(hit.x - B.pos.x, hit.y - B.pos.y, hit.z - B.pos.z);
    if (toHit.lenSq() > 0.2) toHit.norm();
    var err = this.airTo(toHit, dt, true);
    if (this.aerialTimer <= 0) this.aerial = false;
    if (car.jumpsUsed < 2 && B.pos.dist(ball.body.pos) < 4.2 && ball.body.pos.y - B.pos.y > 0.6) vin.jumpEdge = true;
    return;
  }
  if (this.aerial && car.grounded && hit) {
    var toHit2 = tv(hit.x, 0.2, hit.z);
    var r = this.driveTo(toHit2, dt, true);
    var horiz = Math.sqrt((hit.x - B.pos.x) * (hit.x - B.pos.x) + (hit.z - B.pos.z) * (hit.z - B.pos.z));
    var tHit = hit.t;
    if (Math.abs(r.ang) < 0.28 && horiz < Math.max(4, car.speed() * tHit + 2.5) && tHit < 1.3 && tHit > 0.25) {
      vin.jumpEdge = true;
      vin.boost = true;
    }
    return;
  }
  var target = this.target;
  if (st === "CHASE" || st === "ATTACK") {
    if (hit) this.attackPoint(tv(hit.x, hit.y, hit.z), target);
    else this.attackPoint(ball.body.pos, target);
    this.jitterTimer -= dt;
    if (this.jitterTimer <= 0) { this.jitterTimer = 0.8; this.jitter.set(this.rng.range(-1, 1) * sk.error, 0, this.rng.range(-1, 1) * sk.error); }
    target.add(this.jitter);
    var res = this.driveTo(target, dt, true);
    var dBall = B.pos.dist(ball.body.pos);
    if (dBall < CFG.ai.dodgeRange && car.grounded && Math.abs(res.ang) < 0.5 && this.rng.next() < sk.flip * 0.35) {
      vin.jumpEdge = true;
      this.flipQueue = 0.075;
    } else if (ball.body.pos.y > 1.9 && dBall < 3.2 && car.grounded && this.rng.next() < 0.5) {
      vin.jumpEdge = true;
    }
  } else if (st === "DEFEND") {
    var gx = clamp(ball.body.pos.x * 0.55, -CFG.arena.goalHalfW * 0.8, CFG.arena.goalHalfW * 0.8);
    var post = tv(gx, 0.3, own + (own < 0 ? 8.5 : -8.5));
    var ballToGoal = Math.abs(ball.body.pos.z - own);
    if (ballToGoal < 26) {
      if (hit) this.attackPoint(tv(hit.x, hit.y, hit.z), target); else this.attackPoint(ball.body.pos, target);
      this.driveTo(target, dt, true);
    } else {
      this.driveTo(post, dt, car.boost > 55, true);
      if (B.pos.dist(post) < 3.5) { vin.throttle = 0; vin.slide = false; }
    }
  } else if (st === "ROTATE") {
    var backX = clamp(ball.body.pos.x * -0.8, -CFG.arena.hx * 0.75, CFG.arena.hx * 0.75);
    var backZ = ball.body.pos.z + (own < 0 ? -18 : 18);
    backZ = clamp(backZ, -CFG.arena.hz + 6, CFG.arena.hz - 6);
    this.driveTo(tv(backX, 0.3, backZ), dt, car.boost > 70, true);
  } else if (st === "COLLECT_BOOST") {
    if (!this.padTarget || !this.padTarget.active || this.rng.next() < 0.01) this.padTarget = this.chooseBoostPad();
    if (this.padTarget) {
      this.driveTo(this.padTarget.pos, dt, false);
      if (car.boost > (this.role === 2 ? 70 : 88)) { this.state = "ROTATE"; this.padTarget = null; }
    } else this.state = "ROTATE";
  } else if (st === "RETURN_TO_GOAL") {
    this.driveTo(tv(clamp(ball.body.pos.x * 0.4, -14, 14), 0.3, own + (own < 0 ? 11 : -11)), dt, false, true);
  } else {
    this.driveTo(ball.body.pos, dt, false);
  }
  if (car.boost <= 0.5) vin.boost = false;
  if (car.speed() < 3) vin.slide = false;
};

export function assignRoles(world) {
  var ball = world.ball.body.pos;
  for (var t = 0; t < 2; t++) {
    var cars = [];
    for (var i = 0; i < world.cars.length; i++) if (world.cars[i].team === t) cars.push(world.cars[i]);
    cars.sort(function (a, b) { return a.body.pos.distSq(ball) - b.body.pos.distSq(ball); });
    var rank = {};
    for (var k = 0; k < cars.length; k++) rank[cars[k].index] = k;
    for (var a = 0; a < world.ai.length; a++) {
      var ai = world.ai[a];
      if (ai.car.team !== t) continue;
      ai.role = Math.min(2, rank[ai.car.index] === undefined ? 2 : rank[ai.car.index]);
    }
  }
}
