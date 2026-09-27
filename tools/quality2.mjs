/* tools/quality2.mjs — VALIDATE the shot-accuracy instrument.
 *
 * quality.mjs classifies "on target" with a NO-DRAG straight-line projection:
 *     tt = (goalZ - z) / vz ;  px = x + vx*tt ;  py = y + vy*tt - 0.5*g*tt*tt
 * But the real ball decays: physics.js Ball.applyForces does
 *     vel.y -= gravity*dt ;  vel.scale(exp(-drag*dt*6))
 * so goalward speed dies exponentially (k = drag*6 = 0.183/s) and a ball's
 * maximum z travel is only vz/k. A no-drag projection therefore OVERSTATES
 * on-target, and some "shots" can never reach the goal line at all.
 *
 * The analysis is anchored on GOALS, not on tracking individual balls: an
 * earlier version tracked one pending shot per team and was biased toward the
 * FIRST shot of each attacking sequence (the long-range attempt) — it saw 122
 * shots and zero goals while the bot scored 2.25/match.
 *
 * For every goal it asks: was there a counted shot by that team shortly before?
 * and did the classifier call that shot on target? That is the instrument's
 * real predictive value.
 *
 *   node tools/quality2.mjs [tier] [matches] [minutes] [oppTier]
 */
import { World } from '../src/game/world.js';
import { CFG, TEAM } from '../src/game/config.js';
import { V3 } from '../src/game/math.js';

var HZ = CFG.arena.hz, GHW = CFG.arena.goalHalfW, GH = CFG.arena.goalHeight;
var R = CFG.ball.radius;
var G = CFG.physics.gravity;
var K = CFG.ball.drag * 6;              // the real exponential decay rate
var SHOT_V = 12;                        // m/s goalward to count as a shot
var COOLDOWN = 1.2;                     // s between counted shots per team
var WINDOW = 8;                         // s before a goal to look for its shot
var DT = 1 / 60;

var ORIG = Math.random;
function seedRandom(seed) {
  var s = seed >>> 0;
  Math.random = function () {
    s = (s + 0x6D2B79F5) >>> 0;
    var t = s; t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

var TIER = parseInt(process.argv[2] || '4', 10);
var MATCHES = parseInt(process.argv[3] || '8', 10);
var MINS = parseFloat(process.argv[4] || '4');
var OPP = process.argv[5] !== undefined ? parseInt(process.argv[5], 10) : TIER;

/* --- OLD: no-drag straight-line projection (quality.mjs verbatim) --- */
function oldOnTarget(b, sgn) {
  var goalZ = sgn * HZ;
  var tt = (goalZ - b.pos.z) / b.vel.z;
  if (tt <= 0) return false;
  var px = b.pos.x + b.vel.x * tt;
  var pyRaw = b.pos.y + b.vel.y * tt - 0.5 * G * tt * tt;
  var py = Math.max(pyRaw, R);
  return Math.abs(px) < GHW && py <= GH;
}

/* --- NEW: drag-aware integrator mirroring Ball.applyForces + the arena --- */
var _n = new V3(), _p = new V3();
function newOnTarget(b, sgn) {
  var dt = 1 / 120, damp = Math.exp(-K * dt);
  _p.set(b.pos.x, b.pos.y, b.pos.z);
  var vx = b.vel.x, vy = b.vel.y, vz = b.vel.z;
  for (var t = 0; t < 8; t += dt) {
    vy -= G * dt;
    vx *= damp; vy *= damp; vz *= damp;
    _p.x += vx * dt; _p.y += vy * dt; _p.z += vz * dt;
    var d = arena.dist(_p);
    if (d < R) {
      arena.normal(_p, _n);
      _p.x += _n.x * (R - d); _p.y += _n.y * (R - d); _p.z += _n.z * (R - d);
      var vn = vx * _n.x + vy * _n.y + vz * _n.z;
      if (vn < 0) {
        var e = CFG.arena.wallRestitution + CFG.ball.restitution * 0.55;
        vx += _n.x * -(1 + e) * vn; vy += _n.y * -(1 + e) * vn; vz += _n.z * -(1 + e) * vn;
        vx *= 0.985; vy *= 0.985; vz *= 0.985;
      }
    }
    if (_p.z * sgn >= HZ) return Math.abs(_p.x) < GHW && _p.y <= GH && _p.y > -R;
    if (vx * vx + vy * vy + vz * vz < 0.16) return false;   // died short
  }
  return false;                                             // never arrived
}

var arena = null;
var tally = { shots: 0, oldOn: 0, newOn: 0, unreachable: 0 };
var goals = 0, goalHadShot = 0, goalOldOn = 0, goalNewOn = 0, goalNoShot = 0;
var shotsPerGoal = [];

for (var m = 0; m < MATCHES; m++) {
  seedRandom(5000 + m * 131);
  var cfg = JSON.parse(JSON.stringify(CFG));
  var w = new World(cfg, null, null, null);
  w.initMatch(2, -1, 2);
  for (var i = 0; i < w.ai.length; i++) {
    var t = w.ai[i].car.team;
    w.ai[i].forcedLevel = (t === TEAM.PULSE) ? TIER : OPP;
    w.ai[i].refreshSkill();
  }
  w.matchTime = MINS * 60; cfg.match.duration = MINS * 60;
  arena = w.arena;

  var last = [0, 0], cool = [0, 0];
  var shots = [];                       // {s, t0, o, n}
  var frames = Math.round(MINS * 60 * 60);

  for (var f = 0; f < frames; f++) {
    w.step(1 / 60);
    var b = w.ball.body;

    for (var g = 0; g < 2; g++) {
      if (w.score[g] === last[g]) continue;
      last[g] = w.score[g];
      goals++;
      /* the most recent counted shot by the scoring team */
      var idx = -1;
      for (var q = shots.length - 1; q >= 0; q--) {
        if (shots[q].s !== g) continue;
        if (w.time - shots[q].t0 > WINDOW) break;
        idx = q; break;
      }
      if (idx < 0) { goalNoShot++; }
      else {
        goalHadShot++;
        if (shots[idx].o) goalOldOn++;
        if (shots[idx].n) goalNewOn++;
        var nIn = 0;
        for (var q2 = idx; q2 < shots.length; q2++) if (shots[q2].s === g) nIn++;
        shotsPerGoal.push(nIn);
      }
    }

    cool[0] -= DT; cool[1] -= DT;
    for (var s = 0; s < 2; s++) {
      var sgn = (s === TEAM.PULSE) ? 1 : -1;
      if (cool[s] > 0) continue;
      if (b.vel.z * sgn < SHOT_V) continue;
      if ((b.pos.z - (-sgn * HZ)) * sgn < HZ * 0.4) continue;
      cool[s] = COOLDOWN;
      tally.shots++;
      var o = oldOnTarget(b, sgn), nn = newOnTarget(b, sgn);
      if (o) tally.oldOn++;
      if (nn) tally.newOn++;
      if ((b.vel.z * sgn) / K < (sgn * HZ - b.pos.z) * sgn) tally.unreachable++;
      shots.push({ s: s, t0: w.time, o: o, n: nn });
    }
    if (w.state === 'GAMEOVER') break;
  }
}
Math.random = ORIG;

var pc = function (v, d) { return (100 * v / Math.max(1, d)).toFixed(1) + '%'; };
console.log('SHOT QUALITY v2  tier ' + TIER + (OPP !== TIER ? ' vs tier ' + OPP : ' (mirror)') +
  '   ' + MATCHES + ' matches x ' + MINS + ' min');
console.log('   counted shots        ' + tally.shots);
console.log('   OLD projection on    ' + tally.oldOn + '   (' + pc(tally.oldOn, tally.shots) + ')');
console.log('   NEW drag-aware on    ' + tally.newOn + '   (' + pc(tally.newOn, tally.shots) + ')');
console.log('   CANNOT REACH the goal plane: ' + tally.unreachable + '   (' + pc(tally.unreachable, tally.shots) + ')');
console.log('   decay k = drag*6 = ' + K.toFixed(4) + '/s   max z travel = vz/k');
console.log('');
console.log('   GOALS ' + goals + '  (' + (goals / MATCHES).toFixed(2) + '/match)');
console.log('      preceded by a counted shot within ' + WINDOW + ' s: ' + goalHadShot + '  (' + pc(goalHadShot, goals) + ')');
console.log('      no counted shot before them            : ' + goalNoShot + '  (' + pc(goalNoShot, goals) + ')');
console.log('      of those goals, the shot was OLD-on-target: ' + goalOldOn + '  (' + pc(goalOldOn, goalHadShot) + ')');
console.log('      of those goals, the shot was NEW-on-target: ' + goalNewOn + '  (' + pc(goalNewOn, goalHadShot) + ')');
if (shotsPerGoal.length) {
  var sp = shotsPerGoal.reduce(function (a, b) { return a + b; }, 0) / shotsPerGoal.length;
  console.log('      counted shots in the window, mean: ' + sp.toFixed(2));
}
console.log('   shots per goal: ' + (tally.shots / Math.max(1, goals)).toFixed(2));
