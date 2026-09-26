// @ts-nocheck
/* =============================================================================
 *  ai.js — Overdrive Strikers · Bot Brain
 *  ---------------------------------------------------------------------------
 *  A complete, ground-up bot AI with FIVE difficulty tiers.
 *
 *  Engine conventions (measured against the real physics, not assumed):
 *    +Z = car forward, +X = car LEFT, +Y = up.
 *    input.steer = +1   ->  car yaws toward -X   (screen right)
 *    input.throttle=+1  ->  drives along car forward
 *    input.boost        ->  accelerates along car forward (13.5 m/s^2, cap 28)
 *    input.pitch = +1   ->  local ang-vel X = +5.5 rad/s   (NOSE DOWN)
 *    input.yaw   = +1   ->  local ang-vel Y = -4.7 rad/s   (nose toward -X)
 *    input.rollLeft     ->  local ang-vel Z = -6.5 rad/s
 *    A dodge/flip reads (dz = throttle, dx = -steer) in LOCAL space; pitch,
 *    yaw and roll must be zero on that tick or they override the direction.
 *    Car rest height (body centre) ~= 0.01-0.28 m.  Ball radius = 2.334 m.
 *    Ball contact normal == direction from the car hull to the ball centre,
 *    so a car whose nose points at the goal sends the ball at the goal.
 *
 *    IMPORTANT, measured: the ball is LARGER than the car is tall, so every
 *    car/ball contact also pops the CAR several metres into the air. Bots are
 *    therefore off the floor ~30% of the time whether they like it or not -
 *    `runAirControl()` exists purely to deal with that (steer toward the play,
 *    thrust back down, or strike the ball from mid-air).
 *
 *    Also measured: a real cross-pitch approach averages ~12-14 m/s, not the
 *    28 m/s top speed. Every arrival estimate here uses `effSpeed()`, because
 *    budgeting at the top speed made bots commit to intercepts they always
 *    missed (and made the faster tiers play WORSE than the slow ones).
 *
 *    Boost is 100 units at 33.3/s, i.e. only three seconds of thrust, so it is
 *    spent on acceleration only - never held at the speed cap.
 *
 *  Tier progression (indices are 0-based; `CFG.ai.skill` / `startMatch()`):
 *    0 Rookie     drives at the ball, sloppy aim, hoards boost, never leaves
 *                 the floor. Still scores simple goals.
 *    1 Amateur    boost management, shadowing, clears, first flips.
 *    2 Pro        real rotations, shooting angles, aerials, passing, demos.
 *    3 All-Star   air dribbles, fakes, demolition hunts, sharp team play.
 *    4 Legendary  full toolkit at max rate: fast aerials, carries, pinpoint
 *                 aim, punishing and well-timed demolitions.
 * =========================================================================== */

import { PI, TAU, clamp, lerp, V3, Quat, RNG, tv, tc } from './math.js';
import { CFG, TEAM } from './config.js';

/* ------------------------------------------------------------------ tuning */
var ARENA_HZ = CFG.arena.hz;
var ARENA_HX = CFG.arena.hx;
var GOAL_W = CFG.arena.goalHalfW;
var GOAL_H = CFG.arena.goalHeight;
var BALL_R = CFG.ball.radius;
var MAX_SPD = CFG.physics.maxCarSpeed || 28.0;
var REST_Y = CFG.vehicle.wheel.radius + CFG.vehicle.wheel.rest - CFG.vehicle.wheel.attachY;
var UP_OFFSET = (CFG.vehicle.carScale - 1.0) * REST_Y;

/** Car-centre distance to the ball centre at the instant the hull touches it. */
var APPROACH = 4.15;
/** Airborne contact standoff along the shot axis (nose length + ball radius). */
var AIR_STANDOFF = 3.15;

var AIR_MAX_W = CFG.vehicle.air.maxAirAngSpeed || 5.5;
var PITCH_RATE = AIR_MAX_W * 1.0;
var YAW_RATE = AIR_MAX_W * 0.85;
var ROLL_RATE = AIR_MAX_W * 1.18;

/* ================================================================== SKILLS  */
export var AI_LEVELS = [
  /* 0 ── ROOKIE ─────────────────────────────────────────────────────────── */
  {
    id: 0, key: 'ROOKIE', name: 'Rookie', nameFa: 'تازه‌کار',
    react: 0.34, ctrl: 0.085, horizon: 1.2,
    steerK: 1.15, speedFrac: 0.62, boost: 0.10, boostFloor: 58, boostDuty: 0.20,
    aimErr: 6.5, posErr: 5.0,
    flip: 0.0, shotFlip: 0.0, aerial: 0.0, airDribble: 0.0,
    pass: 0.0, demo: 0.0, fake: 0.0,
    defend: 0.25, rotation: 0.25, recover: 0.35, kickoff: 0.0
  },
  /* 1 ── AMATEUR ────────────────────────────────────────────────────────── */
  {
    id: 1, key: 'AMATEUR', name: 'Amateur', nameFa: 'نیمه‌حرفه‌ای',
    react: 0.2307, ctrl: 0.05, horizon: 1.9,
    steerK: 1.5914, speedFrac: 0.7491, boost: 0.34, boostFloor: 49.8187, boostDuty: 0.3519,
    aimErr: 3.9114, posErr: 2.6625,
    flip: 0.2346, shotFlip: 0.1208, aerial: 0.0833, airDribble: 0.0,
    pass: 0.18, demo: 0.0, fake: 0.0607,
    defend: 0.4957, rotation: 0.4733, recover: 0.5096, kickoff: 0.55
  },
  /* 2 ── PRO ────────────────────────────────────────────────────────────── */
  {
    id: 2, key: 'PRO', name: 'Pro', nameFa: 'حرفه‌ای',
    react: 0.1943, ctrl: 0.033, horizon: 2.6,
    steerK: 1.8464, speedFrac: 0.72, boost: 0.62, boostFloor: 38, boostDuty: 0.5265,
    aimErr: 2.203, posErr: 2.13,
    flip: 0.45, shotFlip: 0.1919, aerial: 0.3445, airDribble: 0.06,
    pass: 0.4152, demo: 0.18, fake: 0.1746,
    defend: 0.6017, rotation: 0.72, recover: 0.8353, kickoff: 0.80
  },
  /* 3 ── ALL-STAR ───────────────────────────────────────────────────────── */
  {
    id: 3, key: 'ALLSTAR', name: 'All-Star', nameFa: 'ستاره',
    react: 0.1636, ctrl: 0.020, horizon: 3.2328,
    steerK: 2.2, speedFrac: 0.75, boost: 0.85, boostFloor: 38, boostDuty: 0.50,
    aimErr: 1.6545, posErr: 1.79,
    flip: 0.4949, shotFlip: 0.2546, aerial: 0.60, airDribble: 0.30,
    pass: 0.48, demo: 0.3039, fake: 0.3164,
    defend: 0.8654, rotation: 0.86, recover: 1.0, kickoff: 1.0
  },
  /* 4 ── LEGENDARY ──────────────────────────────────────────────────────── */
  {
    id: 4, key: 'LEGEND', name: 'Legendary', nameFa: 'افسانه‌ای',
    react: 0.15, ctrl: 0.0134, horizon: 4.0039,
    steerK: 2.4766, speedFrac: 0.755, boost: 0.7675, boostFloor: 44.7193, boostDuty: 0.5261,
    aimErr: 1.5977, posErr: 2.6135,
    flip: 0.4534, shotFlip: 0.292, aerial: 0.70, airDribble: 0.3356,
    pass: 0.7831, demo: 0.3062, fake: 0.4395,
    defend: 0.8787, rotation: 1.0, recover: 1.0, kickoff: 1.0
  }
];

export function skillForLevel(n) {
  return AI_LEVELS[clamp(Math.round(n === undefined ? 2 : n), 0, AI_LEVELS.length - 1)];
}
export function levelCount() { return AI_LEVELS.length; }
export var SKILL = AI_LEVELS;

export var AI_STATES = [
  'KICKOFF', 'ATTACK', 'SHOOT', 'PASS', 'RECEIVE', 'FAKE', 'SHADOW', 'GOALKEEP',
  'ROTATE', 'COLLECT_BOOST', 'DEMO', 'RECOVER', 'AIR_DRIBBLE'
];

/* ============================================================== BALL PATH  */
export function BallPath(cap) {
  this.cap = cap || 280;
  this.px = new Float32Array(this.cap);
  this.py = new Float32Array(this.cap);
  this.pz = new Float32Array(this.cap);
  this.vx = new Float32Array(this.cap);
  this.vy = new Float32Array(this.cap);
  this.vz = new Float32Array(this.cap);
  this.t = new Float32Array(this.cap);
  this.n = 0;
  this.step = CFG.ai.brainStep || (1 / 45);
  this.goalT = [-1, -1];
  this.goalX = [0, 0];
  this.wallT = -1;
  this.apexY = 0;
  this.apexT = 0;
  this._p = new V3();
  this._v = new V3();
  this._n = new V3();
}

BallPath.prototype.build = function (ball, arena, horizon) {
  var step = this.step;
  var C = CFG.ball, g = CFG.physics.gravity, R = ball.radius;
  var p = this._p.copy(ball.body.pos);
  var v = this._v.copy(ball.body.vel);
  var n = this._n;
  var maxN = Math.min(this.cap, Math.ceil(horizon / step));
  this.n = 0;
  this.goalT[0] = -1; this.goalT[1] = -1;
  this.wallT = -1;
  this.apexY = p.y; this.apexT = 0;
  var t = 0;
  for (var i = 0; i < maxN; i++) {
    v.y -= g * step;
    var damp = Math.exp(-C.drag * step * 6);
    v.x *= damp; v.y *= damp; v.z *= damp;
    p.x += v.x * step; p.y += v.y * step; p.z += v.z * step;

    var d = arena.dist(p);
    if (d < R) {
      arena.normal(p, n);
      p.x += n.x * (R - d); p.y += n.y * (R - d); p.z += n.z * (R - d);
      var vn = v.dot(n);
      if (vn < 0) {
        var e = CFG.arena.wallRestitution + C.restitution * 0.55;
        v.x += n.x * -(1 + e) * vn;
        v.y += n.y * -(1 + e) * vn;
        v.z += n.z * -(1 + e) * vn;
        v.x *= 0.985; v.y *= 0.985; v.z *= 0.985;
        if (this.wallT < 0) this.wallT = t;
      }
    }
    var line = ARENA_HZ + R * 0.92;
    if (this.goalT[1] < 0 && p.z > line && Math.abs(p.x) < GOAL_W && p.y < GOAL_H) { this.goalT[1] = t; this.goalX[1] = p.x; }
    if (this.goalT[0] < 0 && p.z < -line && Math.abs(p.x) < GOAL_W && p.y < GOAL_H) { this.goalT[0] = t; this.goalX[0] = p.x; }

    var idx = this.n++;
    this.px[idx] = p.x; this.py[idx] = p.y; this.pz[idx] = p.z;
    this.vx[idx] = v.x; this.vy[idx] = v.y; this.vz[idx] = v.z;
    this.t[idx] = t;
    if (p.y > this.apexY) { this.apexY = p.y; this.apexT = t; }
    t += step;
  }
  return this;
};

BallPath.prototype.at = function (t, out) {
  out = out || new V3();
  if (this.n < 2) return null;
  if (t <= 0) { out.set(this.px[0], this.py[0], this.pz[0]); return out; }
  var idx = t / this.step;
  if (idx >= this.n - 1) { var k = this.n - 1; out.set(this.px[k], this.py[k], this.pz[k]); return out; }
  var i0 = Math.floor(idx), f = idx - i0, i1 = i0 + 1;
  out.set(
    this.px[i0] + (this.px[i1] - this.px[i0]) * f,
    this.py[i0] + (this.py[i1] - this.py[i0]) * f,
    this.pz[i0] + (this.pz[i1] - this.pz[i0]) * f
  );
  return out;
};

BallPath.prototype.velAt = function (t, out) {
  out = out || new V3();
  if (this.n < 1) return out.set(0, 0, 0);
  var i = clamp(Math.round(t / this.step), 0, this.n - 1);
  return out.set(this.vx[i], this.vy[i], this.vz[i]);
};

BallPath.prototype.endT = function () { return this.n > 0 ? this.t[this.n - 1] : 0; };

/* ================================================================ SCRATCH  */
var _q1 = new Quat(), _q2 = new Quat(), _q3 = new Quat();
var _v1 = new V3(), _v2 = new V3(), _v3 = new V3(), _v4 = new V3(), _v5 = new V3(), _v6 = new V3();
var _pb = new V3(), _pa = new V3();

function flatLen(x, z) { return Math.sqrt(x * x + z * z); }
function horizDist(a, b) { var dx = a.x - b.x, dz = a.z - b.z; return Math.sqrt(dx * dx + dz * dz); }

/* ====================================================== AIR ORIENTATION   */
function airAim(B, fwdTarget, upTarget, out, gain, damp) {
  var f = _v1.copy(fwdTarget);
  if (f.lenSq() < 1e-8) f.copy(B.fwd);
  f.norm();
  var u = _v2.copy(upTarget);
  if (u.lenSq() < 1e-8) u.set(0, 1, 0);
  u.norm();

  _q1.look(f, u);
  _q2.set(-B.quat.x, -B.quat.y, -B.quat.z, B.quat.w);
  _q3.mul(_q1, _q2);
  if (_q3.w < 0) { _q3.x = -_q3.x; _q3.y = -_q3.y; _q3.z = -_q3.z; _q3.w = -_q3.w; }

  var sinHalf = Math.sqrt(Math.max(0, 1 - _q3.w * _q3.w));
  var ang = 2 * Math.acos(clamp(_q3.w, -1, 1));
  var wx = 0, wy = 0, wz = 0;
  if (sinHalf > 1e-5) {
    var s = ang / sinHalf;
    wx = _q3.x * s; wy = _q3.y * s; wz = _q3.z * s;
  }
  B.quat.rotateInv(_v3.set(wx, wy, wz), _v4);
  B.quat.rotateInv(B.angVel, _v5);
  gain = gain === undefined ? 9.0 : gain;
  damp = damp === undefined ? 3.2 : damp;
  out.x = _v4.x * gain - _v5.x * damp;
  out.y = _v4.y * gain - _v5.y * damp;
  out.z = _v4.z * gain - _v5.z * damp;
  out.err = ang;
  return out;
}

var _aimOut = { x: 0, y: 0, z: 0, err: 0 };
function applyAirAim(car, fwdTarget, upTarget, gain, damp) {
  var B = car.body, vin = car.input;
  airAim(B, fwdTarget, upTarget, _aimOut, gain, damp);
  vin.pitch = clamp(_aimOut.x / PITCH_RATE, -1, 1);
  vin.yaw = clamp(-_aimOut.y / YAW_RATE, -1, 1);
  vin.roll = clamp(-_aimOut.z / ROLL_RATE, -1, 1);
  vin.rollLeft = false;
  vin.rollRight = false;
  return _aimOut.err;
}

/* ============================================================ TEAM PLAN    */
function TeamPlan(team) {
  this.team = team;
  this.roles = {};
  this.padClaim = {};
  this.passTo = -1;
  this.passFrom = -1;
  this.passUntil = -1;
  this.passPoint = new V3();
  this.demoCall = -1;
  this.attackDir = 1;
  this.assigned = 0;
}

export function teamPlans(world) {
  if (!world._aiTeams || world._aiTeams.length !== 2) {
    world._aiTeams = [new TeamPlan(0), new TeamPlan(1)];
  }
  return world._aiTeams;
}

/* =========================================================== AICONTROLLER */
export function AIController(car, world) {
  this.car = car;
  this.world = world;
  this.state = 'KICKOFF';
  this.role = 2;
  this.kickoffT = 0;
  this.kickoffFlip = 0;
  this.sk = AI_LEVELS[2];
  this.forcedLevel = null;
  this.rng = new RNG(1000 + car.index * 977);
  this.persona = this.rng.range(-1, 1);

  this.timer = 0;
  this.ctrlTimer = 0;

  this.target = new V3();
  this.aimDir = new V3(0, 0, 1);
  this.aimMode = 'SHOOT';
  this.solution = null;
  this.airSol = null;
  this.mode = 'NONE';

  this.jitter = new V3();
  this.jitterTimer = 0;

  this.padTarget = null;
  this.demoCooldown = 0;
  this.demoTarget = null;
  this.demoPoint = new V3();
  this.demoRun = 0;

  this.wantFlip = false;
  this.flipStage = 0;
  this.flipStageT = 0;
  this.flipDelay = 0;
  this.flipDir = new V3();
  this.flipSpeedCool = 0;
  this.shotFlipCool = 0;
  this.airCool = 0;

  this.boostPulse = 0;
  this.boostOn = false;

  this.stateTime = 0;
  this.lastTouchAt = -99;
  this.airTime = 0;
  this.airMode = 0;
  this.airTimer = 0;
  this.airT = 0;
  this.airTarget = new V3();
  this.jumpHold = 0;
  this.doubleAt = 999;

  this.dribbleTime = 0;
  this.dribblePhase = 0;
  this.dribbleTimer = 0;
  this.dribbleCool = 0;
  this.fakeTimer = 0;
  this.fakeCool = 0;

  this.stuck = 0;
  this.lastPos = new V3();
  this.reverseTimer = 0;
  this.passPoint = new V3();
}

AIController.prototype.refreshSkill = function () {
  if (this.forcedLevel !== null && this.forcedLevel !== undefined) {
    this.sk = skillForLevel(this.forcedLevel);
    return;
  }
  var cfg = (this.world && this.world.cfg) ? this.world.cfg : CFG;
  this.sk = skillForLevel(cfg.ai.skill);
};
AIController.prototype.ownGoal = function () { return this.car.team === TEAM.PULSE ? -ARENA_HZ : ARENA_HZ; };
AIController.prototype.oppGoal = function () { return this.car.team === TEAM.PULSE ? ARENA_HZ : -ARENA_HZ; };
AIController.prototype.attackSign = function () { return this.oppGoal() > 0 ? 1 : -1; };
AIController.prototype.ownSign = function () { return this.ownGoal() < 0 ? 1 : -1; };
AIController.prototype.depthFromOwn = function (z) { return (z - this.ownGoal()) * this.ownSign(); };

/* ------------------------------------------------------------ perception  */
AIController.prototype.path = function () {
  var p = this.world._aiPath;
  return p && p.n > 1 ? p : null;
};

AIController.prototype.chance = function (p) {
  if (p <= 0) return false;
  var scale = clamp(this.sk.react / 0.15, 0.25, 2.0);
  return this.rng.next() < p * scale;
};

AIController.prototype.effSpeed = function () {
  return MAX_SPD * (0.38 + 0.12 * this.sk.speedFrac);
};

AIController.prototype.travelTime = function (pt, maxSpd) {
  var B = this.car.body;
  var dx = pt.x - B.pos.x, dz = pt.z - B.pos.z;
  var dist = Math.sqrt(dx * dx + dz * dz);
  if (dist < 0.4) return 0;
  var ux = dx / dist, uz = dz / dist;
  var fwdLen = flatLen(B.fwd.x, B.fwd.z);
  var fx = fwdLen > 1e-4 ? B.fwd.x / fwdLen : 0, fz = fwdLen > 1e-4 ? B.fwd.z / fwdLen : 1;
  var dot = clamp(fx * ux + fz * uz, -1, 1);
  var align = 0.34 + 0.66 * Math.max(0, dot);
  var base = this.effSpeed();
  if (dist < 9) base *= 0.72 + 0.028 * dist;
  var spd = Math.max(3.5, base * align);
  var penalty = (dot < -0.3 && dist < 12) ? 0.55 : 0;
  return dist / spd + penalty;
};

AIController.prototype.solveIntercept = function (aimPoint, opts) {
  var path = this.path();
  if (!path) return null;
  opts = opts || {};
  var maxSpd = MAX_SPD * this.sk.speedFrac;
  var tolScale = 1.0;
  var airTol = (opts.air ? 0.55 : 0.32) * tolScale;
  var stride = opts.air ? 2 : 3;
  var bp = _pb, ap = _pa;

  var clean = null;
  var late = null;
  var chase = null;

  var stick = opts.air ? null : this.solution;

  for (var i = 0; i < path.n; i += stride) {
    var t = path.t[i];
    bp.set(path.px[i], path.py[i], path.pz[i]);
    if (!opts.air && bp.y > 2.7) continue;
    if (opts.air && (bp.y < 2.5 || bp.y > 16.5)) continue;

    var ax = aimPoint.x - bp.x, az = aimPoint.z - bp.z;
    var al = flatLen(ax, az);
    if (al < 1e-3) { ax = 0; az = this.attackSign(); al = 1; }
    ax /= al; az /= al;
    ap.set(bp.x - ax * APPROACH, REST_Y, bp.z - az * APPROACH);
    var tt = this.travelTime(ap, maxSpd);
    var slack = t - tt;

    var cand = {
      score: 0, t: t, idx: i,
      bx: bp.x, by: bp.y, bz: bp.z,
      ax: ax, az: az,
      approachX: ap.x, approachZ: ap.z,
      slack: slack, tt: tt, chase: false
    };
    cand.score = t + Math.max(0, slack) * 0.35;
    if (opts.air) cand.score += Math.abs(bp.y - 4.5) * 0.08;
    if (stick && stick.t !== undefined) {
      var sd = flatLen(bp.x - stick.bx, bp.z - stick.bz);
      if (sd < 6.5) cand.score -= 0.40 * (1 - sd / 6.5);
    }

    if (slack < -airTol) {
      var lateBy = -slack;
      if (!chase || lateBy < chase.lateBy) { cand.chase = true; cand.lateBy = lateBy; chase = cand; }
      continue;
    }

    if (t <= this.sk.horizon) {
      if (!clean || cand.score < clean.score) clean = cand;
      if (clean && slack > 0.40) break;
    } else if (!late || cand.score < late.score) {
      late = cand;
    }
  }
  return clean || late || chase;
};

/* --------------------------------------------------------------- shooting */
AIController.prototype.chooseAim = function (ballPos, out) {
  var opp = this.oppGoal();
  var sgn = this.attackSign();
  var world = this.world;
  var sk = this.sk;

  var keeperX = 0, keeperD = 1e9, haveKeeper = false;
  for (var i = 0; i < world.cars.length; i++) {
    var c = world.cars[i];
    if (c.team === this.car.team || c.demolished) continue;
    var d = Math.abs(c.body.pos.z - opp);
    if (d < keeperD) { keeperD = d; keeperX = c.body.pos.x; haveKeeper = true; }
  }

  var depth = this.depthFromOwn(ballPos.z);
  var goalDist = Math.abs(opp - ballPos.z);

  if (depth < ARENA_HZ * 0.85 && goalDist > 34) {
    var clearX = (Math.abs(ballPos.x) > ARENA_HX * 0.45)
      ? clamp(ballPos.x * 0.85, -ARENA_HX * 0.85, ARENA_HX * 0.85)
      : (this.rng.next() < 0.5 ? -1 : 1) * ARENA_HX * 0.42;
    out.set(clearX - ballPos.x, 0, opp * 0.6 - ballPos.z);
    if (out.lenSq() < 1e-4) out.set(0, 0, sgn);
    out.norm();
    return 'CLEAR';
  }

  var tx;
  if (haveKeeper && keeperD < 28) tx = (keeperX > 0 ? -1 : 1) * GOAL_W * 0.60;
  else tx = clamp(-ballPos.x * 0.25, -GOAL_W * 0.7, GOAL_W * 0.7);
  if (sk.id === 0) tx *= 0.2;

  out.set(tx - ballPos.x, 0, (opp + sgn * 1.5) - ballPos.z);
  if (out.lenSq() < 1e-4) out.set(0, 0, sgn);
  out.norm();
  if (out.z * sgn < 0.3) { out.set(out.x, 0, sgn * 0.95); out.norm(); }
  return 'SHOOT';
};

/* --------------------------------------------------------------- passing  */
AIController.prototype.findPass = function (ballPos) {
  var sk = this.sk;
  if (sk.pass <= 0) return null;
  var world = this.world, team = this.car.team;
  var sgn = this.attackSign();
  var best = null;
  for (var i = 0; i < world.cars.length; i++) {
    var c = world.cars[i];
    if (c.team !== team || c === this.car || c.demolished) continue;
    var lead = 0.4;
    var px = c.body.pos.x + c.body.vel.x * lead;
    var pz = c.body.pos.z + c.body.vel.z * lead;
    var forwardGain = (pz - ballPos.z) * sgn;
    if (forwardGain < 3) continue;
    var d = Math.sqrt((px - ballPos.x) * (px - ballPos.x) + (pz - ballPos.z) * (pz - ballPos.z));
    if (d < 7 || d > 55) continue;
    var dirx = (px - ballPos.x) / d, dirz = (pz - ballPos.z) / d;
    var laneClear = 1.0;
    for (var j = 0; j < world.cars.length; j++) {
      var o = world.cars[j];
      if (o.team === team || o.demolished) continue;
      var ox = o.body.pos.x - ballPos.x, oz = o.body.pos.z - ballPos.z;
      var along = ox * dirx + oz * dirz;
      if (along < 0 || along > d) continue;
      var perp = Math.abs(ox * -dirz + oz * dirx);
      if (perp < 4.5) laneClear -= (4.5 - perp) / 4.5 * 0.7;
    }
    if (laneClear < 0.2) continue;
    var score = forwardGain * 0.55 + laneClear * 7 + d * 0.05;
    if (!best || score > best.score) best = { car: c, x: px, z: pz, score: score };
  }
  if (!best) return null;
  if (this.rng.next() > sk.pass) return null;
  return best;
};

/* --------------------------------------------------------------- driving  */
AIController.prototype.driveTo = function (target, dt, opts) {
  opts = opts || {};
  var car = this.car, B = car.body, vin = car.input, sk = this.sk;
  var dx = target.x - B.pos.x, dz = target.z - B.pos.z;
  var dist = Math.sqrt(dx * dx + dz * dz);

  var fwdLen = flatLen(B.fwd.x, B.fwd.z);
  var fx = fwdLen > 1e-4 ? B.fwd.x / fwdLen : 0;
  var fz = fwdLen > 1e-4 ? B.fwd.z / fwdLen : 1;
  var ux = dist > 1e-4 ? dx / dist : fx;
  var uz = dist > 1e-4 ? dz / dist : fz;

  if (opts.faceX !== undefined) {
    var fl = flatLen(opts.faceX, opts.faceZ);
    if (fl > 1e-4) { ux = opts.faceX / fl; uz = opts.faceZ / fl; }
  }

  var dot = clamp(fx * ux + fz * uz, -1, 1);
  var cross = fx * uz - fz * ux;
  var ang = Math.atan2(cross, dot);
  var speed = car.speed();
  var steer = clamp(ang * sk.steerK, -1, 1);

  var reverse = false;
  if (opts.reverse !== false) {
    this.reverseTimer = Math.max(0, this.reverseTimer - dt);
    if (Math.abs(ang) > 2.35 && speed < 5.0 && dist < 9.0) this.reverseTimer = 0.5;
    if (this.reverseTimer > 0) reverse = true;
  }

  vin.steer = reverse ? -steer : steer;
  vin.throttle = reverse ? -1 : 1;

  var cap = opts.speedCap !== undefined ? opts.speedCap : MAX_SPD * sk.speedFrac;
  if (opts.coast && !reverse && dist < 3.4 && speed > cap * 0.5) vin.throttle = 0.12;
  if (!reverse && dist < 1.2 && speed > 6 && !opts.hard) vin.throttle = 0;

  vin.slide = !reverse && Math.abs(ang) > 0.95 && speed > 9.5 && sk.id >= 1;

  vin.boost = false;
  if (!reverse && opts.boost !== false && car.boost > 2) {
    var floor = opts.priority ? 8 : sk.boostFloor;
    var mayBoost = opts.boostForce || (this.boostPulse > 0 && car.boost > floor);
    if (mayBoost && Math.abs(ang) < 0.45 && (dist > 5.5 || opts.priority)) {
      if (speed < cap - 0.4 || opts.boostForce) vin.boost = true;
    }
  }

  this.flipSpeedCool = Math.max(0, this.flipSpeedCool - dt);
  if (!opts.noFlip && !reverse && sk.flip > 0 && this.flipSpeedCool <= 0 && car.grounded &&
      dist > 26 && speed > 7 && speed < cap * 0.86 && Math.abs(ang) < 0.12 &&
      car.boost < sk.boostFloor + 12 && this.rng.next() < sk.flip * 0.35) {
    this.queueFlip(ux, uz);
    this.flipSpeedCool = 2.6 + this.rng.range(0, 3.0);
  }

  return { dist: dist, ang: ang, speed: speed };
};

AIController.prototype.queueFlip = function (dx, dz) {
  if (this.wantFlip) return;
  var l = Math.sqrt(dx * dx + dz * dz);
  if (l < 1e-4) return;
  this.flipDir.set(dx / l, 0, dz / l);
  this.wantFlip = true;
  this.flipStage = 0;
  this.flipStageT = 0;
};

AIController.prototype.serviceFlip = function () {
  if (!this.wantFlip) return false;
  var car = this.car, vin = car.input, B = car.body;

  if (this.flipStage === 0) {
    if (car.grounded && car.jumpCooldown <= 0) {
      vin.jumpEdge = true;
      vin.jump = true;
      this.flipStage = 1;
      this.flipStageT = 0;
      return true;
    }
    if (!car.grounded && car.jumpsUsed === 1 && car.canDodge) { this.flipStage = 1; this.flipStageT = 0; }
    else return false;
  }

  this.flipStageT += 1;
  if (!car.grounded && car.jumpsUsed === 1 && car.canDodge && car.airTime < 1.5) {
    var local = B.quat.rotateInv(this.flipDir, tv());
    vin.jumpEdge = true;
    vin.jump = false;
    vin.pitch = 0; vin.yaw = 0; vin.roll = 0;
    vin.rollLeft = false; vin.rollRight = false;
    vin.throttle = clamp(local.z, -1, 1);
    vin.steer = clamp(-local.x, -1, 1);
    this.wantFlip = false;
    this.flipStage = 0;
    return true;
  }
  if (car.grounded || car.airTime > 1.0 || this.flipStageT > 90) {
    this.wantFlip = false;
    this.flipStage = 0;
  }
  return false;
};

/* --------------------------------------------------------- air control    */
AIController.prototype.landTarget = function (out) {
  var sol = this.solution;
  if (sol && !sol.chase) { out.set(sol.approachX, 0, sol.approachZ); return out; }
  var path = this.path();
  if (path && path.n > 1) { path.at(Math.min(0.8, path.endT()), out); out.y = 0; return out; }
  out.copy(this.world.ball.body.pos);
  out.y = 0;
  return out;
};

AIController.prototype.runAirControl = function (dt) {
  var car = this.car, B = car.body, vin = car.input, sk = this.sk;
  var ball = this.world.ball.body.pos;
  var carY = B.pos.y + UP_OFFSET;

  vin.jump = false;

  var dx = ball.x - B.pos.x, dy = ball.y - carY, dz = ball.z - B.pos.z;
  var d3 = Math.sqrt(dx * dx + dy * dy + dz * dz);
  var reachable = ball.y > 2.5 && ball.y < carY + 7.5;
  if (sk.id >= 2 && d3 < 8.0 && reachable && car.boost > 10) {
    var cx = ball.x - this.aimDir.x * 2.7;
    var cz = ball.z - this.aimDir.z * 2.7;
    var cy = ball.y - 0.25;
    var to = _v4.set(cx - B.pos.x, cy - carY, cz - B.pos.z);
    if (to.lenSq() > 1e-6) to.norm(); else to.set(this.aimDir.x, 0, this.aimDir.z);
    var e1 = applyAirAim(car, to, _v2.set(0, 1, 0), 8.5, 3.0);
    vin.boost = car.boost > 5 && e1 < 1.15;
    this.state = 'AIR_DRIBBLE';
    this.mode = 'AIR_STRIKE';
    return true;
  }

  var land = this.landTarget(_v6);
  var lx = land.x - B.pos.x, lz = land.z - B.pos.z;
  var dl = flatLen(lx, lz);
  var fwd = _v3;
  if (dl > 1e-3) fwd.set(lx / dl, 0, lz / dl);
  else fwd.set(0, 0, this.attackSign());
  if (B.pos.y > 2.0) fwd.y = -clamp((B.pos.y - 1.4) * 0.32, 0, 0.85);
  fwd.norm();
  var e2 = applyAirAim(car, fwd, _v2.set(0, 1, 0), 7.0, 3.4);
  vin.boost = car.boost > 12 && sk.recover > 0.4 && B.pos.y > 2.3 && e2 < 0.95 &&
              (dl > 3.0 || B.pos.y > 4.5);
  this.mode = 'AIR_GLIDE';
  return true;
};

AIController.prototype.findBlocker = function (bp, distToBall) {
  var world = this.world, B = this.car.body, car = this.car;
  if (distToBall > 26) return null;
  var toBx = bp.x - B.pos.x, toBz = bp.z - B.pos.z;
  var len = flatLen(toBx, toBz);
  if (len < 1e-3) return null;
  var ux = toBx / len, uz = toBz / len;
  var best = null, bestAlong = 1e9;
  for (var i = 0; i < world.cars.length; i++) {
    var e = world.cars[i];
    if (e.team === car.team || e.demolished || e.demoImmune > 0) continue;
    var ex = e.body.pos.x - B.pos.x, ez = e.body.pos.z - B.pos.z;
    var along = ex * ux + ez * uz;
    if (along < 0.4 || along > Math.min(len, distToBall + 2.0)) continue;
    if (flatLen(e.body.pos.x - bp.x, e.body.pos.z - bp.z) > 9.5 && along > 9.0) continue;
    var perp = Math.abs(ex * -uz + ez * ux);
    if (perp > 3.2) continue;
    if (e.body.pos.y > 6.0) continue;
    if (along < bestAlong) {
      bestAlong = along;
      var lead = Math.min(along / Math.max(9, car.speed()), 0.55);
      best = { car: e, x: e.body.pos.x + e.body.vel.x * lead, z: e.body.pos.z + e.body.vel.z * lead };
    }
  }
  return best;
};

/* ====================================================== BEHAVIOUR PIECES  */
AIController.prototype.headingError = function (pt) {
  var B = this.car.body;
  var dx = pt.x - B.pos.x, dz = pt.z - B.pos.z;
  var l = Math.sqrt(dx * dx + dz * dz);
  if (l < 1e-4) return 0;
  var fwdLen = flatLen(B.fwd.x, B.fwd.z);
  var fx = fwdLen > 1e-4 ? B.fwd.x / fwdLen : 0, fz = fwdLen > 1e-4 ? B.fwd.z / fwdLen : 1;
  var dot = clamp(fx * dx / l + fz * dz / l, -1, 1);
  var cross = fx * (dz / l) - fz * (dx / l);
  return Math.atan2(cross, dot);
};

/* ------------------------------------------------------------- kickoff    */
AIController.prototype.runKickoff = function (dt) {
  var car = this.car, B = car.body, sk = this.sk, world = this.world;
  var ball = world.ball.body.pos;
  var sign = this.attackSign();
  var commit = clamp(sk.kickoff, 0, 1);
  this.kickoffT += dt;

  if (this.role === 0) {
    this.target.set(ball.x, 0, ball.z);
    var r = this.driveTo(this.target, dt, {
      boost: true, hard: true, priority: true,
      boostForce: commit > 0.7,
      speedCap: MAX_SPD * (0.80 + 0.18 * commit)
    });
    this.kickoffFlip = Math.max(0, this.kickoffFlip - dt);
    if (commit > 0.7 && sk.flip > 0.3 && this.kickoffFlip <= 0 && car.grounded &&
        car.dodgeTimer <= 0 && !this.wantFlip && Math.abs(r.ang) < 0.10 &&
        r.dist > 9 && r.dist < 20 && r.speed > 12 && this.rng.next() < sk.flip * 0.5) {
      this.queueFlip(ball.x - B.pos.x, ball.z - B.pos.z);
      this.kickoffFlip = 3.0;
    }
    this.state = 'KICKOFF';
    this.mode = 'KICKOFF_HIT';
    return;
  }

  this.target.set(0, 0, sign * -26.9);
  var pr = this.driveTo(this.target, dt, { boost: car.boost > 62, speedCap: MAX_SPD * 0.72 });
  this.state = 'KICKOFF';
  this.mode = 'KICKOFF_SUPPORT';
};

AIController.prototype.attackBall = function (dt) {
  var car = this.car, B = car.body, vin = car.input, sk = this.sk, world = this.world;
  var ball = world.ball.body.pos;
  var sol = this.solution;
  var aim = this.aimDir;

  if (!sol) {
    var fut = _v6.set(ball.x, 0, ball.z);
    if (car.grounded && ball.y > 3.1 && horizDist(B.pos, ball) < 4.8) {
      var bx = B.pos.x - ball.x, bz = B.pos.z - ball.z;
      var bl = Math.max(horizDist(B.pos, ball), 1e-3);
      fut.set(ball.x + bx / bl * 7.0, 0, ball.z + bz / bl * 7.0);
    }
    this.driveTo(fut, dt, { boost: true, hard: true });
    this.state = 'ATTACK';
    this.mode = 'RUSH';
    return;
  }

  var ballNow = world.ball.body.pos;
  if (car.grounded && ballNow.y > 3.1) {
    var dXZ = horizDist(B.pos, ballNow);
    if (dXZ < 4.8) {
      var ax = B.pos.x - ballNow.x, az = B.pos.z - ballNow.z;
      var al = Math.max(dXZ, 1e-3);
      this.target.set(ballNow.x + ax / al * 7.0, 0, ballNow.z + az / al * 7.0);
      this.driveTo(this.target, dt, { boost: false, speedCap: MAX_SPD * 0.55 });
      this.state = 'ATTACK';
      this.mode = 'DUCK_OUT';
      return;
    }
  }

  if (sol.chase) {
    this.mode = 'CUT_OFF';
    var cx = sol.approachX, cz = sol.approachZ;
    this.target.set(cx, 0, cz);
    var cang = this.headingError(this.target);
    this.driveTo(this.target, dt, {
      boost: true,
      hard: Math.abs(cang) < 0.5,
      speedCap: MAX_SPD * Math.max(0.8, this.sk.speedFrac)
    });
    this.state = 'ATTACK';
    return;
  }

  var bp = _v6.set(sol.bx, sol.by, sol.bz);
  var distToBall = horizDist(B.pos, bp);
  var angToBall = this.headingError(bp);
  var aligned = Math.abs(angToBall) < 0.42;

  var behindBall = ((B.pos.x - bp.x) * aim.x + (B.pos.z - bp.z) * aim.z) < -0.9;
  var goalward = aim.z * this.attackSign() > 0.35;

  var blocker = (sk.id >= 1 && Math.abs(angToBall) < 0.7) ? this.findBlocker(bp, distToBall) : null;
  if (blocker && !behindBall) blocker = null;
  if (blocker) {
      this.mode = 'BUMP';
      var bdx = blocker.x - B.pos.x, bdz = blocker.z - B.pos.z;
      var bdl = flatLen(bdx, bdz) || 1;
      this.boostPulse = Math.max(this.boostPulse, 0.5);
      this.target.set(blocker.x + bdx / bdl * 1.6, 0, blocker.z + bdz / bdl * 1.6);
      this.driveTo(this.target, dt, {
        boost: true, hard: true, priority: true, boostForce: car.boost > 6,
        speedCap: MAX_SPD * Math.max(sk.speedFrac, 0.92)
      });
      this.shotFlipCool = Math.max(0, this.shotFlipCool - dt);
      if (sk.demo > 0.2 && this.shotFlipCool <= 0 && car.grounded && car.dodgeTimer <= 0 &&
          car.speed() > 12 && bdl < 9.0 && bdl > 2.2 && !this.wantFlip) {
        this.queueFlip(bdx, bdz);
        this.shotFlipCool = 2.0 + this.rng.range(0, 1.5);
      }
    this.state = distToBall < 18 ? 'SHOOT' : 'ATTACK';
    return;
  }

  if (distToBall < APPROACH + 2.6 && aligned && behindBall && goalward) {
    this.mode = 'CHARGE';
    var punch = 2.4 + car.speed() * 0.12;
    this.target.set(bp.x + aim.x * punch, 0, bp.z + aim.z * punch);
    this.driveTo(this.target, dt, { boost: true, hard: true, speedCap: MAX_SPD * sk.speedFrac });
    this.shotFlipCool = Math.max(0, this.shotFlipCool - dt);
    if (sk.shotFlip > 0 && this.shotFlipCool <= 0 && car.grounded && car.dodgeTimer <= 0 &&
        distToBall < APPROACH + 2.2 && distToBall > 1.6 && car.speed() > 9 && !this.wantFlip &&
        this.rng.next() < sk.shotFlip * 0.02) {
      this.queueFlip(aim.x, aim.z);
      this.shotFlipCool = 2.2 + this.rng.range(0, 2.5);
    }
  } else {
    this.mode = 'LINE_UP';
    var dist = Math.max(distToBall, APPROACH);
    var R = clamp(dist * 0.72, APPROACH, 24);
    var tx = bp.x - aim.x * R;
    var tz = bp.z - aim.z * R;

    var side = (B.pos.x - bp.x) * -aim.z + (B.pos.z - bp.z) * aim.x;
    var ahead = (B.pos.x - bp.x) * aim.x + (B.pos.z - bp.z) * aim.z;
    if (ahead > 1.5 && distToBall < 18) {
      var sideSgn = side > 0 ? 1 : -1;
      var swing = Math.min(distToBall * 0.8, 14);
      tx += -aim.z * sideSgn * swing;
      tz += aim.x * sideSgn * swing;
    }
    this.target.set(tx, 0, tz);
    this.driveTo(this.target, dt, { boost: true, speedCap: MAX_SPD * sk.speedFrac });
  }
  this.state = distToBall < 18 ? 'SHOOT' : 'ATTACK';
};

/* ------------------------------------------------------------- aerials    */
AIController.prototype.tryAerial = function () {
  var sk = this.sk, car = this.car, B = car.body;
  if (sk.aerial <= 0) return false;
  if (this.airTimer > 0) return true;
  if (this.airCool > 0) return false;

  var sol = this.airSol;
  if (!sol || sol.chase) return false;
  if (sol.by < 3.2 || sol.by > 13.5) return false;
  if (sol.t > 1.9) return false;

  var dHoriz = horizDist(B.pos, _v6.set(sol.bx, sol.by, sol.bz));
  if (dHoriz > 20) return false;

  if (sol.t > 0.05 && dHoriz / sol.t > MAX_SPD * 0.95) return false;

  var climb = sol.by - (REST_Y + UP_OFFSET) - 0.9;
  if (climb > 0.3) {
    var g = CFG.physics.gravity || 6.5;
    var bAcc = (CFG.vehicle && CFG.vehicle.boost && CFG.vehicle.boost.accel) || 13.5;
    var aMax = Math.max(1.5, bAcc - g);
    var v0 = (CFG.vehicle && CFG.vehicle.jump && CFG.vehicle.jump.impulse) || 5.2;
    var t = Math.max(0.08, sol.t);
    var aReq = 2 * (climb - v0 * t) / (t * t);
    if (aReq > aMax) return false;
    if (car.boost < 24 + Math.min(24, Math.max(0, aReq) * 3)) return false;
  } else if (car.boost < 20) return false;

  if (this.depthFromOwn(this.world.ball.body.pos.z) < ARENA_HZ * 0.45) return false;
  if (sol.slack !== undefined && sol.slack < -0.10) return false;

  if (!this.chance(sk.aerial * 0.22)) return false;

  this.airCool = 1.6 + this.rng.range(0, 2.0);
  this.airTimer = 1.7;
  this.airMode = 1;
  this.airTarget.set(sol.bx, sol.by, sol.bz);
  this.airT = sol.t;
  this.airTime = 0;
  return true;
};

AIController.prototype.runAerial = function (dt) {
  var car = this.car, B = car.body, vin = car.input, sk = this.sk;
  var path = this.path();
  var aim = this.aimDir;
  if (this.airTimer <= 0) return false;

  this.airTimer -= dt;
  if (this.airTimer <= 0 || this.world.state !== 'PLAYING') {
    this.airTimer = 0; this.airMode = 0;
    return false;
  }

  var lead = 0.05 + (1 - sk.aerial) * 0.16;
  var ball = _v6;
  if (path) {
    var tt = clamp(this.airT - this.airTime, 0, path.endT());
    path.at(tt, ball);
    path.velAt(tt, _v5);
    ball.x += _v5.x * lead; ball.y += _v5.y * lead; ball.z += _v5.z * lead;
  } else {
    ball.copy(this.airTarget);
  }

  var carY = B.pos.y + UP_OFFSET;

  if (car.grounded && this.airMode === 1) {
    var stand = AIR_STANDOFF + 0.35;
    var gx = ball.x - aim.x * stand;
    var gz = ball.z - aim.z * stand;
    var tgt = _v3.set(gx, 0, gz);
    var d = horizDist(B.pos, tgt);
    var timeToArrive = this.travelTime(tgt, MAX_SPD * sk.speedFrac);
    this.boostPulse = 0.7;
    this.driveTo(tgt, dt, { boost: true, hard: true, speedCap: MAX_SPD * sk.speedFrac });
    var headingOk = Math.abs(this.headingError(_v4.set(ball.x, 0, ball.z))) < 0.75;
    if (d < 5.0 && headingOk && (timeToArrive < 0.30 || d < 2.6)) {
      vin.jumpEdge = true;
      vin.jump = true;
      this.airMode = 2;
      this.airTime = 0;
      this.jumpHold = 0.18;
      var needClimb = Math.max(0, ball.y - 2.6);
      this.doubleAt = clamp(0.34 - needClimb * 0.02, 0.05, 0.34);
    }
    return true;
  }

  if (!car.grounded) {
    this.airTime += dt;
    this.airMode = 2;

    var contactX = ball.x - aim.x * AIR_STANDOFF;
    var contactY = ball.y - 0.25;
    var contactZ = ball.z - aim.z * AIR_STANDOFF;
    var toTarget = _v4.set(contactX - B.pos.x, contactY - carY, contactZ - B.pos.z);
    var dist = toTarget.len();

    var under = (ball.y - carY) > 2.3;
    var desired = _v3;
    if (under && dist < 4.0) {
      desired.set(aim.x * 0.25, 1.0, aim.z * 0.25).norm();
    } else if (dist > 1e-3) {
      toTarget.scale(1 / dist);
      var w = clamp(1 - dist / 7.0, 0.10, 0.85);
      desired.set(
        aim.x * w + toTarget.x * (1 - w),
        toTarget.y * (1 - w) + 0.05 * w,
        aim.z * w + toTarget.z * (1 - w)
      );
      if (desired.lenSq() < 1e-6) desired.set(aim.x, 0, aim.z);
      desired.norm();
    } else desired.set(aim.x, 0, aim.z);

    var upTarget = _v2.set(0, 1, 0);
    if (dist < 9) upTarget.set(-aim.x * 0.22, 1, -aim.z * 0.22).norm();
    var err = applyAirAim(car, desired, upTarget, 9.0, 3.1);

    var needHeight = ball.y - carY;
    var closing = needHeight > -0.8 || dist > 2.6;
    vin.boost = car.boost > 2 && closing && err < 1.25;

    vin.jump = false;
    if (this.jumpHold > 0) { this.jumpHold -= dt; vin.jump = true; }
    if (car.airTime > this.doubleAt && car.jumpsUsed === 1 && needHeight > 0.6) {
      vin.jumpEdge = true;
      vin.jump = true;
      this.jumpHold = 0.14;
      this.doubleAt = 999;
    }
    if (sk.shotFlip > 0.35 && !under && dist < 6.0 && dist > 2.4 && car.jumpsUsed === 1 &&
        car.canDodge && err < 0.5 && !this.wantFlip) {
      this.queueFlip(aim.x, aim.z);
    }
    if (dist < 2.6 && !under) this.airTimer = Math.min(this.airTimer, 0.18);
    return true;
  }
  return false;
};

/* -------------------------------------------------------- air dribble     */
AIController.prototype.tryAirDribble = function () {
  var sk = this.sk, car = this.car, B = car.body;
  if (sk.airDribble <= 0 || this.dribbleTime > 0) return false;
  if (this.dribbleCool > 0) return false;
  if (!car.grounded) return false;
  if (car.boost < 52) return false;

  var ball = this.world.ball.body;
  var d = horizDist(B.pos, ball.pos);
  if (d > 9.5 || d < 1.6) return false;
  if (ball.pos.y > 5.2) return false;
  if (Math.abs(ball.vel.y) > 3.5) return false;
  if (flatLen(ball.vel.x, ball.vel.z) > 15.0) return false;

  var sgn = this.attackSign();
  if ((ball.pos.z - B.pos.z) * sgn < 2.5) return false;
  if (this.headingError(ball.pos) > 0.7) return false;

  var ballDepth = this.depthFromOwn(ball.pos.z);
  if (ballDepth < ARENA_HZ * 0.5) return false;

  if (!this.chance(sk.airDribble * 0.16)) return false;
  this.dribbleTime = 2.6;
  this.dribblePhase = 0;
  return true;
};

AIController.prototype.runAirDribble = function (dt) {
  var car = this.car, B = car.body, vin = car.input, sk = this.sk;
  if (this.dribbleTime <= 0) return false;
  var ball = this.world.ball.body;
  this.dribbleTime -= dt;
  if (this.dribbleTime <= 0 || car.boost < 3) {
    this.dribbleTime = 0;
    this.dribbleCool = 3.5;
    return false;
  }

  if (this.dribblePhase === 0) {
    var under = _v6.set(ball.pos.x, 0, ball.pos.z);
    this.driveTo(under, dt, { boost: true, hard: true, speedCap: MAX_SPD * 0.7 });
    this.state = 'AIR_DRIBBLE';
    if (horizDist(B.pos, under) < 4.8 && car.grounded) {
      vin.jumpEdge = true;
      vin.jump = true;
      this.dribblePhase = 1;
      this.dribbleTimer = 0.5;
      this.jumpHold = 0.16;
    }
    return true;
  }

  this.state = 'AIR_DRIBBLE';
  this.dribbleTimer = (this.dribbleTimer || 0) - dt;
  if (!car.grounded) {
    var carryX = ball.pos.x - this.aimDir.x * 2.2;
    var carryZ = ball.pos.z - this.aimDir.z * 2.2;
    var carryY = Math.max(ball.pos.y - 1.6, 2.3);
    var to = _v4.set(carryX - B.pos.x, carryY - (B.pos.y + UP_OFFSET), carryZ - B.pos.z);
    var dist = to.len();
    var desired = _v3.copy(to);
    if (dist > 1e-3) desired.norm();
    var err = applyAirAim(car, desired, _v2.set(0, 1, 0), 7.5, 3.0);
    vin.boost = car.boost > 4 && err < 0.95 && (dist > 1.2 || ball.pos.y > B.pos.y + 1.3);
    vin.jump = false;
    if (this.dribbleTimer <= 0 && car.jumpsUsed === 1 && car.canDodge && dist < 4.6 && !this.wantFlip) {
      this.queueFlip(ball.pos.x - B.pos.x, ball.pos.z - B.pos.z);
      this.dribbleTimer = 0.8;
    }
    return true;
  }
  if (this.dribblePhase === 1) { this.dribblePhase = 2; this.dribbleTimer = 0.8; }
  else this.driveTo(ball.pos, dt, { boost: true });
  return true;
};

/* --------------------------------------------------------------- defense  */
AIController.prototype.runShadow = function (dt) {
  var sk = this.sk, car = this.car, B = car.body, world = this.world;
  var own = this.ownGoal(), sgn = this.ownSign();
  var path = this.path();
  var ball = world.ball.body.pos;
  var goalIdx = car.team === TEAM.PULSE ? 0 : 1;

  var bp = _v6.copy(ball);
  if (path) path.at(Math.min(1.6, path.endT()), bp);

  var ballFromGoal = this.depthFromOwn(ball.z);
  var threat = path && path.goalT[goalIdx] >= 0 ? path.goalT[goalIdx] : -1;

  var depth = clamp(6.5 + ballFromGoal * 0.28, 5.5, 20.0);
  var tx = clamp(ball.x * 0.55 + bp.x * 0.45, -GOAL_W * 1.05, GOAL_W * 1.05);
  var tz = own + sgn * depth;

  if (threat >= 0 && threat < 2.2) {
    var cross = path.at(Math.max(0, threat - 0.18), _v5);
    tx = clamp(cross.x * 0.9, -GOAL_W * 0.98, GOAL_W * 0.98);
    tz = own + sgn * clamp(3.5 + threat * 9, 3.0, 13.0);
  }

  this.jitterTimer -= dt;
  if (this.jitterTimer <= 0) {
    this.jitterTimer = 0.9;
    this.jitter.set(this.rng.range(-1, 1) * sk.posErr, 0, this.rng.range(-1, 1) * sk.posErr);
  }
  tx += this.jitter.x; tz += this.jitter.z;

  this.target.set(tx, 0, tz);
  var r = this.driveTo(this.target, dt, { boost: car.boost > 62, coast: true, speedCap: MAX_SPD * 0.8 });

  if (r.dist < 3.4) {
    var vin = car.input;
    vin.throttle = 0;
    vin.slide = false;
    var want = this.headingError(_v5.set(ball.x, 0, ball.z));
    if (Math.abs(want) > 0.4) { vin.throttle = 0.5; vin.steer = clamp(want * sk.steerK * 0.6, -1, 1); }
  }
  this.state = (threat >= 0 && threat < 2.2) ? 'GOALKEEP' : 'SHADOW';
  return r;
};

AIController.prototype.canChallenge = function () {
  var sk = this.sk;
  var world = this.world, B = this.car.body;
  var sol = this.solution;
  if (!sol) return false;
  var myT = sol.t;
  var bestOpp = 1e9;
  for (var i = 0; i < world.cars.length; i++) {
    var c = world.cars[i];
    if (c.team === this.car.team || c.demolished) continue;
    var d = horizDist(c.body.pos, _v6.set(sol.bx, sol.by, sol.bz));
    bestOpp = Math.min(bestOpp, d / (MAX_SPD * 0.48));
  }
  var margin = bestOpp - myT;
  var lastMan = this.role === 2;
  if (lastMan && sk.defend < 0.85) return false;
  var ballDeep = this.depthFromOwn(world.ball.body.pos.z) < ARENA_HZ * 0.38;
  if (lastMan && ballDeep && sk.defend < 0.98) return false;
  return margin > (0.35 - sk.defend * 0.32);
};

/* ------------------------------------------------------------ demolitions */
AIController.prototype.considerDemo = function () {
  var sk = this.sk, car = this.car, B = car.body, world = this.world;
  if (sk.demo <= 0 || !CFG.demo || !CFG.demo.enabled) return null;
  if (this.demoCooldown > 0 || this.role === 2 || car.demolished) return null;
  var mySpd = car.speed();
  if (mySpd < 8) return null;
  if (car.boost < 8 && mySpd < 15) return null;
  if (!this.chance(sk.demo * 0.30)) return null;

  var fwdLen = flatLen(B.fwd.x, B.fwd.z);
  var fx = fwdLen > 1e-4 ? B.fwd.x / fwdLen : 0, fz = fwdLen > 1e-4 ? B.fwd.z / fwdLen : 1;
  var best = null;
  for (var i = 0; i < world.cars.length; i++) {
    var e = world.cars[i];
    if (e.team === car.team || e.demolished) continue;
    if (e.demoImmune > 0) continue;
    var dx = e.body.pos.x - B.pos.x, dz = e.body.pos.z - B.pos.z;
    var d = Math.sqrt(dx * dx + dz * dz);
    if (d < 2.5 || d > 30) continue;
    var align = (fx * dx + fz * dz) / d;
    if (align < 0.55) continue;
    var lead = Math.min(d / Math.max(11, mySpd), 0.8);
    var tx = e.body.pos.x + e.body.vel.x * lead;
    var tz = e.body.pos.z + e.body.vel.z * lead;
    var score = align * 2.0 + (1 - d / 30) * 1.6;
    if (world.ball.lastTouch === e.index && world.time - world.ball.lastTouchTime < 2.0) score += 1.2;
    if (e.isPlayer) score += 0.6;
    if (this.depthFromOwn(e.body.pos.z) < 34) score += 0.4;
    if (e.body.pos.y > 2.2) score -= 1.5;
    if (!best || score > best.score) best = { car: e, x: tx, z: tz, score: score };
  }
  return best;
};

/* ------------------------------------------------------------ boost pads  */
AIController.prototype.chooseBoostPad = function (plan) {
  var car = this.car, B = car.body, world = this.world;
  var sgn = this.attackSign();
  var best = null, bestScore = 1e9;
  for (var i = 0; i < world.pads.length; i++) {
    var p = world.pads[i];
    if (!p.active) continue;
    if (plan && plan.padClaim[p.index] !== undefined && plan.padClaim[p.index] !== car.index) continue;
    var dx = p.pos.x - B.pos.x, dz = p.pos.z - B.pos.z;
    var d = Math.sqrt(dx * dx + dz * dz);
    if (!p.big) d *= 1.5;
    if (d < 3.0) d += 40;
    var toward = ((p.pos.z - B.pos.z) * sgn) / Math.max(d, 1);
    d -= toward * 6;
    if (d < bestScore) { bestScore = d; best = p; }
  }
  return best;
};

/* -------------------------------------------------------------- recovery  */
AIController.prototype.runRecover = function (dt) {
  var car = this.car, B = car.body, vin = car.input;
  var opp = this.oppGoal();
  if (car.grounded) { this.state = 'ROTATE'; return false; }

  if (car.roofContact > 0 || (B.up.y < -0.15 && B.pos.y < 1.5 && car.chassisContact > 0)) {
    if (car.turtleState === 0 && car.jumpCooldown <= 0) { vin.jumpEdge = true; vin.jump = true; }
    return true;
  }
  var fwdTarget = _v3.set(B.vel.x, 0, B.vel.z);
  if (fwdTarget.lenSq() < 2) fwdTarget.set(0, 0, opp > 0 ? 1 : -1);
  fwdTarget.norm();
  applyAirAim(car, fwdTarget, _v2.set(0, 1, 0), 8.0, 3.0);
  vin.boost = car.boost > 6 && B.vel.y < 1.0 && this.sk.recover > 0.6 && B.pos.y > 4;
  vin.jump = false;
  return true;
};

/* ============================================================== MAIN LOOP */
AIController.prototype.update = function (dt) {
  var car = this.car, world = this.world, B = car.body, vin = car.input, sk = this.sk;

  this.stateTime += dt;
  this.demoCooldown = Math.max(0, this.demoCooldown - dt);
  this.boostPulse = Math.max(0, this.boostPulse - dt);
  this.airCool = Math.max(0, this.airCool - dt);
  this.shotFlipCool = Math.max(0, this.shotFlipCool - dt);
  this.dribbleCool = Math.max(0, this.dribbleCool - dt);
  this.fakeCool = Math.max(0, this.fakeCool - dt);
  this.ctrlTimer -= dt;

  var moved = horizDist(B.pos, this.lastPos);
  if (moved < 0.02 && !car.grounded) this.stuck += dt; else this.stuck = Math.max(0, this.stuck - dt * 2);
  this.lastPos.copy(B.pos);
  if (this.stuck > 2.2) { this.wantFlip = false; this.flipStage = 0; this.stuck = 0; }

  vin.pitch = 0; vin.yaw = 0; vin.roll = 0;
  vin.rollLeft = false; vin.rollRight = false;
  vin.slide = false;
  vin.jump = false;
  vin.boost = false;
  vin.throttle = 0; vin.steer = 0;

  if (car.demolished) return;

  this.timer -= dt;
  if (this.timer <= 0) {
    this.timer = sk.react + this.rng.range(-0.02, 0.035);
    this.decide(dt);
  }
  if (this.ctrlTimer <= 0) {
    this.ctrlTimer = sk.ctrl;
    this.refreshControl();
  }

  if (this.serviceFlip()) { this.afterControl(); return; }

  if (this.runAerial(dt)) { this.afterControl(); return; }
  if (this.runAirDribble(dt)) { this.afterControl(); return; }

  var flipping = car.dodgeTimer > 0 || car.flipping;
  if (!car.grounded && !flipping && this.airTimer <= 0 && this.dribbleTime <= 0) {
    var tilted = B.up.y < 0.45;
    var spinning = B.angVel.len() > 9.0 && car.airTime > 0.30;
    var adrift = car.airTime > 1.15 && B.up.y < 0.9;
    if ((tilted || spinning || adrift) && this.sk.recover > 0.3) {
      if (this.runRecover(dt)) { this.afterControl(); return; }
    } else {
      this.runAirControl(dt);
      this.afterControl();
      return;
    }
  }

  switch (this.state) {
    case 'KICKOFF': this.runKickoff(dt); break;
    case 'DEMO': this.runDemo(dt); break;
    case 'SHADOW':
    case 'GOALKEEP': this.runShadow(dt); break;
    case 'PASS': this.runPass(dt); break;
    case 'RECEIVE': this.runReceive(dt); break;
    case 'FAKE': this.runFake(dt); break;
    case 'ROTATE': this.runRotate(dt); break;
    case 'COLLECT_BOOST': this.runCollectBoost(dt); break;
    case 'RECOVER': if (!this.runRecover(dt)) this.attackBall(dt); break;
    case 'AIR_DRIBBLE': if (!this.runAirDribble(dt)) this.attackBall(dt); break;
    default: this.attackBall(dt); break;
  }
  this.afterControl();
};

AIController.prototype.afterControl = function () {
  var car = this.car, vin = car.input;
  if (car.boost <= 0.5) vin.boost = false;
  if (!car.grounded) vin.slide = false;
  if (car.speed() < 3.0) vin.slide = false;
};

/* -------------------------------------------------- decisions (slow path) */
AIController.prototype.decide = function (dt) {
  var car = this.car, world = this.world, sk = this.sk, B = car.body;
  var ball = world.ball.body;
  var plan = teamPlans(world)[car.team];
  var path = this.path();

  this.role = plan.roles[car.index] !== undefined ? plan.roles[car.index] : 1;
  this.demoRun = Math.max(0, this.demoRun - sk.react);

  var aimBase = ball.pos;
  if (path) aimBase = path.at(Math.min(0.45, path.endT()), _v5) || ball.pos;
  this.aimMode = this.chooseAim(aimBase, this.aimDir);

  this.jitterTimer -= sk.react;
  if (this.jitterTimer <= 0) {
    this.jitterTimer = 0.85;
    this.jitter.set(this.rng.range(-1, 1) * sk.aimErr, 0, this.rng.range(-1, 1) * sk.aimErr);
  }
  var aimPoint = _v5.set(aimBase.x + this.aimDir.x * 40 + this.jitter.x, 0,
                         aimBase.z + this.aimDir.z * 40 + this.jitter.z);

  var highBall = ball.pos.y > 2.9;
  this.solution = this.solveIntercept(aimPoint, { air: false });
  this.airSol = (sk.aerial > 0 && (highBall || (path && path.apexY > 3.2)))
    ? this.solveIntercept(aimPoint, { air: true }) : null;
  if (this.airSol && this.solution && this.airSol.t > this.solution.t + 0.6) this.airSol = null;

  var own = this.ownGoal();
  var ballDepth = this.depthFromOwn(ball.pos.z);
  var lastMan = this.role === 2;
  var touchedRecently = (world.time - this.lastTouchAt) < (0.8 + sk.rotation * 0.8);
  var ballOwnHalf = ballDepth < ARENA_HZ * 0.52;
  var threat = path ? path.goalT[car.team === TEAM.PULSE ? 0 : 1] : -1;

  var wantBoost = false;
  var tank = car.boost;
  var dBallNow = horizDist(B.pos, ball.pos);
  if (tank > sk.boostFloor) {
    if (tank > 78) {
      wantBoost = this.chance(sk.boostDuty * 0.75);
    } else if (this.role !== 2) {
      if (dBallNow > 20) wantBoost = this.chance(sk.boostDuty);
      else if (dBallNow > 9) wantBoost = this.chance(sk.boostDuty * 0.35);
      else wantBoost = this.chance(sk.boostDuty * 0.12);
    } else if (ballDepth < 26) {
      wantBoost = this.chance(sk.boostDuty * 0.30);
    }
  }
  if (this.role === 2 && ballDepth > ARENA_HZ * 0.9) wantBoost = false;
  this.boostPulse = wantBoost ? Math.max(this.boostPulse, 0.45) : this.boostPulse;

  if (sk.kickoff > 0 && this.kickoffT < 8 && world.ball.lastTouch < 0 &&
      Math.abs(ball.pos.x) < 0.8 && Math.abs(ball.pos.z) < 0.8) {
    if (this.state !== 'KICKOFF') this.kickoffT = 0;
    this.state = 'KICKOFF';
    return;
  }
  if (world.ball.lastTouch >= 0) this.kickoffT = 0;

  var demoOk = sk.demo > 0 && this.demoCooldown <= 0 && plan.demoCall === car.index && car.grounded;
  if (demoOk) {
    var dB = horizDist(B.pos, ball.pos);
    if (dB < 24) demoOk = false;
    if (this.depthFromOwn(ball.pos.z) < ARENA_HZ * 0.52) demoOk = false;
    if (threat >= 0 && threat < 2.5) demoOk = false;
    if (this.solution && this.solution.t < 1.7) demoOk = false;
    if (car.boost < 22 && dB < 34) demoOk = false;
    if (this.teamBots() > 1 && !this.teammateMuchCloser()) demoOk = false;
  }
  if (demoOk) {
    var demo = this.considerDemo();
    if (demo) {
      this.demoTarget = demo.car;
      this.demoPoint.set(demo.x, 0, demo.z);
      this.demoRun = 1.1;
      this.state = 'DEMO';
      return;
    }
  }
  if (this.state === 'DEMO') {
    if (this.demoRun > 0 && this.demoTarget && !this.demoTarget.demolished) {
      this.demoPoint.set(this.demoTarget.body.pos.x + this.demoTarget.body.vel.x * 0.25, 0,
                         this.demoTarget.body.pos.z + this.demoTarget.body.vel.z * 0.25);
      return;
    }
    this.state = 'ROTATE';
  }

  if (this.airSol && !lastMan && this.tryAerial()) return;
  if (!lastMan && this.tryAirDribble()) return;

  if (plan.passTo === car.index) {
    if (world.time < plan.passUntil && plan.passFrom === car.index) { this.state = 'PASS'; this.passPoint.set(plan.passPoint.x, 0, plan.passPoint.z); return; }
    if (world.time < plan.passUntil) { this.state = 'RECEIVE'; this.passPoint.set(plan.passPoint.x, 0, plan.passPoint.z); return; }
  }

  var mustDefend = false;
  if (threat >= 0 && threat < 1.6) mustDefend = true;
  if (lastMan && ballOwnHalf) mustDefend = true;
  if (lastMan && ballDepth < 34 && sk.defend > 0.6) mustDefend = true;
  if (mustDefend && !this.canChallenge()) { this.state = 'SHADOW'; return; }

  if (this.role === 0) {
    if (touchedRecently && sk.rotation > 0.3 && this.teammateCanTakeOver()) { this.state = 'ROTATE'; return; }

    var dBall = horizDist(B.pos, ball.pos);
    var oppNear = this.nearestOpponentDist();
    if (dBall < 10 && this.solution && Math.abs(this.headingError(_v6.set(this.solution.bx, 0, this.solution.bz))) < 0.7) {
      if (sk.pass > 0 && this.chance(sk.pass * 0.6)) {
        var pass = this.findPass(ball.pos);
        if (pass) {
          plan.passTo = pass.car.index;
          plan.passFrom = car.index;
          plan.passPoint.set(pass.x, 0, pass.z);
          plan.passUntil = world.time + 0.85;
          this.passPoint.set(pass.x, 0, pass.z);
          this.state = 'PASS';
          return;
        }
      }
      if (sk.fake > 0 && this.fakeCool <= 0 && oppNear < 12 && this.chance(sk.fake * 0.22)) {
        this.fakeTimer = 0.55;
        this.state = 'FAKE';
        return;
      }
    }
    this.state = this.solution && this.solution.t < 0.9 ? 'SHOOT' : 'ATTACK';
    return;
  }

  if (this.role === 1) {
    if (this.solution && this.solution.t < 0.8 && car.boost > 12 && sk.rotation > 0.4) {
      this.state = 'ATTACK';
      return;
    }
    if (car.boost < 20 && ballDepth > ARENA_HZ * 0.55) { this.state = 'COLLECT_BOOST'; return; }
    if (ballOwnHalf) { this.state = 'SHADOW'; return; }
    this.state = 'ROTATE';
    return;
  }

  this.state = 'SHADOW';
};

AIController.prototype.teamBots = function () {
  var n = 0;
  for (var i = 0; i < this.world.cars.length; i++) {
    if (this.world.cars[i].team === this.car.team) n++;
  }
  return n;
};

AIController.prototype.teammateMuchCloser = function () {
  var world = this.world, B = this.car.body;
  var ball = world.ball.body.pos;
  var myD = horizDist(B.pos, ball);
  for (var i = 0; i < world.cars.length; i++) {
    var c = world.cars[i];
    if (c.team !== this.car.team || c === this.car || c.demolished) continue;
    if (horizDist(c.body.pos, ball) < myD * 0.6) return true;
  }
  return false;
};

AIController.prototype.teammateCanTakeOver = function () {
  var world = this.world, B = this.car.body;
  var ball = world.ball.body.pos;
  var myD = horizDist(B.pos, ball);
  for (var i = 0; i < world.cars.length; i++) {
    var c = world.cars[i];
    if (c.team !== this.car.team || c === this.car || c.demolished) continue;
    if (horizDist(c.body.pos, ball) < myD + 4) return true;
  }
  return false;
};

AIController.prototype.refreshControl = function () {
  var world = this.world, car = this.car, plan = teamPlans(world)[car.team];
  var claims = {};
  for (var i = 0; i < world.ai.length; i++) {
    var ai = world.ai[i];
    if (ai.car.team !== car.team) continue;
    if (ai.padTarget && !ai.padTarget.active) claims[ai.padTarget.index] = ai.car.index;
  }
  plan.padClaim = claims;
};

AIController.prototype.nearestOpponentDist = function () {
  var world = this.world, B = this.car.body, best = 1e9;
  for (var i = 0; i < world.cars.length; i++) {
    var c = world.cars[i];
    if (c.team === this.car.team || c.demolished) continue;
    var d = horizDist(B.pos, c.body.pos);
    if (d < best) best = d;
  }
  return best;
};

/* ---------------------------------------------------------- behaviour impl */
AIController.prototype.runDemo = function (dt) {
  var car = this.car, B = car.body, vin = car.input, sk = this.sk;
  var target = this.demoTarget;
  if (!target || target.demolished) { this.state = 'ROTATE'; this.demoRun = 0; return; }
  var tp = target.body.pos;
  if (horizDist(B.pos, tp) > 26 || this.demoRun <= 0) {
    this.demoTarget = null; this.demoRun = 0; this.state = 'ROTATE'; return;
  }
  var lead = Math.min(horizDist(B.pos, tp) / Math.max(12, car.speed()), 0.7);
  var tx = tp.x + target.body.vel.x * lead;
  var tz = tp.z + target.body.vel.z * lead;
  this.target.set(tx, 0, tz);
  this.boostPulse = Math.max(this.boostPulse, 0.6);
  var r = this.driveTo(this.target, dt, { boost: true, hard: true, priority: true, boostForce: car.boost > 8, speedCap: MAX_SPD });
  this.state = 'DEMO';
  if (r.dist < 9 && r.dist > 3.2 && car.grounded && Math.abs(r.ang) < 0.35 &&
      sk.demo > 0.4 && !this.wantFlip) {
    this.queueFlip(tx - B.pos.x, tz - B.pos.z);
  }
};

AIController.prototype.runRotate = function (dt) {
  var car = this.car, B = car.body, sk = this.sk;
  var world = this.world;
  var own = this.ownGoal(), sgn = this.ownSign();
  var ball = world.ball.body.pos;
  var sgnAtk = this.attackSign();

  var tx = clamp(ball.x * -0.45, -ARENA_HX * 0.7, ARENA_HX * 0.7);
  var tz = ball.z - sgnAtk * (13 + this.persona * 3);
  tz = clamp(tz, -ARENA_HZ + 8, ARENA_HZ - 8);
  if (this.depthFromOwn(tz) < 10) tz = own + sgn * 13;

  this.target.set(tx, 0, tz);
  var r = this.driveTo(this.target, dt, { boost: car.boost > 55, coast: true });
  this.state = 'ROTATE';
  if (r.dist < 3.2) {
    var vin = car.input;
    vin.throttle = 0;
    vin.slide = false;
    var faceBall = this.headingError(_v6.set(ball.x, 0, ball.z));
    if (Math.abs(faceBall) > 0.5) { vin.throttle = 0.5; vin.steer = clamp(faceBall * sk.steerK * 0.5, -1, 1); }
  }
};

AIController.prototype.runCollectBoost = function (dt) {
  var car = this.car, world = this.world, sk = this.sk;
  var plan = teamPlans(world)[car.team];
  if (!this.padTarget || !this.padTarget.active || this.rng.next() < 0.006) {
    this.padTarget = this.chooseBoostPad(plan);
  }
  if (!this.padTarget) { this.state = 'ROTATE'; return; }
  var r = this.driveTo(this.padTarget.pos, dt, { boost: car.boost > 60 });
  this.state = 'COLLECT_BOOST';
  if (car.boost > 92 || (r.dist < 3.0 && car.boost > sk.boostFloor + 22)) {
    this.padTarget = null;
    this.state = 'ROTATE';
  }
};

AIController.prototype.runPass = function (dt) {
  var car = this.car;
  var world = this.world;
  var pp = this.passPoint;
  this.aimDir.set(pp.x - world.ball.body.pos.x, 0, pp.z - world.ball.body.pos.z);
  if (this.aimDir.lenSq() < 1e-4) this.aimDir.set(0, 0, this.attackSign());
  this.aimDir.norm();
  var aimPoint = _v5.set(world.ball.body.pos.x + this.aimDir.x * 40, 0, world.ball.body.pos.z + this.aimDir.z * 40);
  this.solution = this.solveIntercept(aimPoint, { air: false }) || this.solution;
  this.boostPulse = 0.7;
  this.attackBall(dt);
  this.state = 'PASS';
};

AIController.prototype.runReceive = function (dt) {
  var car = this.car, B = car.body;
  var world = this.world;
  var path = this.path();
  var ball = world.ball.body.pos;
  var pt = _v6.copy(ball);
  if (path) path.at(Math.min(1.1, path.endT()), pt);
  var tx = pt.x - this.aimDir.x * 3.2;
  var tz = pt.z - this.aimDir.z * 3.2;
  this.target.set(tx, 0, tz);
  this.driveTo(this.target, dt, { boost: true, speedCap: MAX_SPD * this.sk.speedFrac });
  this.state = 'RECEIVE';
  if (horizDist(B.pos, ball) < APPROACH + 2.0) this.state = 'SHOOT';
};

AIController.prototype.runFake = function (dt) {
  var car = this.car, vin = car.input;
  var ball = this.world.ball.body.pos;
  this.fakeTimer -= dt;
  this.state = 'FAKE';
  this.mode = 'HESITATE';

  if (this.fakeTimer > 0.30) {
    this.boostPulse = 0.6;
    this.driveTo(ball, dt, { boost: true, hard: true });
    return;
  }
  if (this.fakeTimer > 0.10) {
    var side = this.persona > 0 ? 1 : -1;
    var swerve = 4.2;
    this.target.set(ball.x - this.aimDir.z * side * swerve + this.aimDir.x * 2.0, 0,
                    ball.z + this.aimDir.x * side * swerve + this.aimDir.z * 2.0);
    this.driveTo(this.target, dt, { boost: false, speedCap: MAX_SPD * 0.7, reverse: false });
    vin.slide = car.grounded && car.speed() > 9;
    return;
  }
  this.fakeCool = 4.5;
  this.state = 'ATTACK';
  this.attackBall(dt);
};

/* ======================================================== TEAM COORDINATION */
export function assignRoles(world) {
  var now = world.time || 0;
  var plans = teamPlans(world);

  if (!world._aiPath) world._aiPath = new BallPath(280);
  var rate = CFG.ai.brainRate || 30;
  if (!world._aiPathT || now - world._aiPathT > 1 / rate) {
    world._aiPathT = now;
    world._aiPath.build(world.ball, world.arena, CFG.ai.brainHorizon || 4.2);
  }

  var planRate = CFG.ai.planRate || 24;
  var doPlan = !world._aiPlanT || now - world._aiPlanT > 1 / planRate;
  if (doPlan) world._aiPlanT = now;

  for (var t = 0; t < 2; t++) {
    var plan = plans[t];
    plan.attackDir = (t === TEAM.PULSE) ? 1 : -1;
    if (!doPlan) continue;

    var ball = world.ball.body.pos;
    var sgn = plan.attackDir;
    var ownGoal = t === TEAM.PULSE ? -ARENA_HZ : ARENA_HZ;

    var members = [];
    for (var i = 0; i < world.cars.length; i++) {
      var c = world.cars[i];
      if (c.team !== t || c.demolished) continue;
      members.push(c);
    }
    if (members.length === 0) { plan.roles = {}; plan.demoCall = -1; continue; }

    var scored = [];
    for (var m = 0; m < members.length; m++) {
      var c2 = members[m];
      var ai = null;
      for (var a = 0; a < world.ai.length; a++) if (world.ai[a].car === c2) { ai = world.ai[a]; break; }
      var d = horizDist(c2.body.pos, ball);
      var timeToBall = d / Math.max(6, MAX_SPD * 0.46);
      var touchAge = ai ? (now - ai.lastTouchAt) : 99;
      var cool = touchAge < 0.9 ? (1.35 - touchAge) : 0;
      var behind = ((c2.body.pos.z - ball.z) * sgn) < -1.5 ? 1.7 : 0;
      var boostPenalty = c2.boost < 12 ? 0.9 : 0;
      var keepRole = (plan.roles[c2.index] === 0) ? -0.35 : 0;
      scored.push({
        car: c2, ai: ai, timeToBall: timeToBall,
        score: timeToBall + cool + behind + boostPenalty + keepRole
      });
    }
    scored.sort(function (a, b) { return a.score - b.score; });

    var newRoles = {};
    for (var s = 0; s < scored.length; s++) {
      newRoles[scored[s].car.index] = s === 0 ? 0 : (s === 1 ? 1 : 2);
    }

    var ballInOwnHalf = (ball.z - ownGoal) * (ownGoal < 0 ? 1 : -1) < ARENA_HZ * 0.45;
    if (ballInOwnHalf && scored.length >= 2) {
      var bestKeep = null, bestKeepD = 1e9;
      for (var q = 0; q < scored.length; q++) {
        if (newRoles[scored[q].car.index] === 0) continue;
        var dd = Math.abs(scored[q].car.body.pos.z - ownGoal);
        if (dd < bestKeepD) { bestKeepD = dd; bestKeep = scored[q]; }
      }
      if (bestKeep) {
        for (var w = 0; w < scored.length; w++) if (newRoles[scored[w].car.index] === 2) newRoles[scored[w].car.index] = 1;
        newRoles[bestKeep.car.index] = 2;
      }
    }

    for (var pk in plan.roles) {
      if (plan.roles[pk] !== 0 || newRoles[pk] === undefined) continue;
      if (newRoles[pk] === 0) continue;
      var prev = null, next = null;
      for (var z = 0; z < scored.length; z++) {
        if (String(scored[z].car.index) === String(pk)) prev = scored[z];
        if (newRoles[scored[z].car.index] === 0) next = scored[z];
      }
      if (prev && next && (next.score - prev.score) < 0.45) {
        newRoles[next.car.index] = plan.roles[next.car.index] === 2 ? 2 : 1;
        newRoles[pk] = 0;
      }
    }

    var lt = world.ball.lastTouch;
    if (lt >= 0 && newRoles[lt] === 0 && scored.length >= 2 && (now - world.ball.lastTouchTime) < 0.9) {
      var partner = null;
      for (var f = 0; f < scored.length; f++) {
        if (scored[f].car.index === lt) continue;
        if (scored.length > 2 && newRoles[scored[f].car.index] === 2) continue;
        partner = scored[f];
        break;
      }
      if (partner) {
        var oldPartnerRole = newRoles[partner.car.index];
        newRoles[partner.car.index] = 0;
        newRoles[lt] = oldPartnerRole === 2 ? 2 : 1;
      }
    }

    plan.roles = newRoles;
    plan.assigned = members.length;

    plan.demoCall = -1;
    var demoBest = -1, demoScore = 0;
    for (var dq = 0; dq < scored.length; dq++) {
      var e2 = scored[dq];
      if (!e2.ai) continue;
      if (plan.roles[e2.car.index] === 2) continue;
      if (e2.ai.sk.demo <= 0) continue;
      var sc = e2.ai.sk.demo * 1.6 + e2.timeToBall * 0.55 + (e2.ai.persona + 1) * 0.25;
      if (e2.ai.demoCooldown > 0) sc -= 5;
      if (e2.car.boost < 18) sc -= 1.5;
      if (sc > demoScore) { demoScore = sc; demoBest = e2.car.index; }
    }
    if (demoScore > 1.7) plan.demoCall = demoBest;

    if (plan.passTo >= 0 && now > plan.passUntil) { plan.passTo = -1; plan.passFrom = -1; }
  }

  for (var ai2 = 0; ai2 < world.ai.length; ai2++) {
    var bot = world.ai[ai2];
    if (!bot.refreshSkill) continue;
    bot.refreshSkill();
    var pl = plans[bot.car.team];
    bot.role = pl.roles[bot.car.index] !== undefined ? pl.roles[bot.car.index] : 1;
    if (world.ball.lastTouch === bot.car.index) bot.lastTouchAt = world.ball.lastTouchTime;
  }
  return plans;
}

export function teamBots(world, team) {
  var n = 0;
  for (var i = 0; i < world.ai.length; i++) if (world.ai[i].car.team === team) n++;
  return n;
}
