/* tools/quality.mjs — why aren't the strong tiers scoring more?
 *
 * Goal difference saturated, so "stronger" has to be measured at the level
 * BELOW goals: how many shots a tier creates, how many are actually on target,
 * and what fraction goes in. A bot that shoots a lot but never hits the mouth
 * has a shot-placement problem, not a speed problem.
 *
 * Counts, per team, per match:
 *   shots        ball driven goalward above a speed threshold in the
 *                attacking half (deduplicated with a cooldown)
 *   onTarget     straight-line projection of that shot crosses the goal line
 *                inside the mouth (|x| < goalHalfW) and under the bar
 *   goals        scoreboard delta
 *   conversion   goals / onTarget
 *   kickoffGoals goals scored within 6 s of a kickoff (state COUNTDOWN->PLAYING)
 *
 *   node tools/quality.mjs [tier] [matches] [minutes] [oppTier]
 */
import { World } from '../src/game/world.js';
import { CFG } from '../src/game/config.js';
import { TEAM } from '../src/game/config.js';
import { V3 } from '../src/game/math.js';

var HZ = CFG.arena.hz, GHW = CFG.arena.goalHalfW, GH = CFG.arena.goalHeight;
var G = (CFG.physics && CFG.physics.gravity) ? CFG.physics.gravity : 9.8;
var K = CFG.ball.drag * 6;      // the real exponential decay rate (physics.js)
var SHOT_V = 12;          // m/s goalward to count as a shot
var COOLDOWN = 1.2;       // s between counted shots per team
var arena = null;

/* Drag-aware on-target test.
 *
 * The old test was a NO-DRAG straight-line projection, but the real ball decays
 * exponentially: physics.js Ball.applyForces does
 *     vel.y -= gravity*dt ;  vel.scale(exp(-drag*dt*6))
 * so a ball's maximum z travel is only vz/k (k = drag*6 = 0.183/s) and it may
 * never reach the goal line at all. Measured on the L4 mirror: the no-drag
 * projection called 29.1% of shots on target where the drag-aware model says
 * 26.1%, and 20% of counted "shots" cannot reach the goal plane at all.
 * This integrator mirrors Ball.applyForces and the arena's own wall response.
 */
var _n = new V3(), _p = new V3();
function dragOnTarget(b, sgn) {
  var dt = 1 / 120, damp = Math.exp(-K * dt);
  _p.set(b.pos.x, b.pos.y, b.pos.z);
  var vx = b.vel.x, vy = b.vel.y, vz = b.vel.z;
  for (var t = 0; t < 8; t += dt) {
    vy -= G * dt;
    vx *= damp; vy *= damp; vz *= damp;
    _p.x += vx * dt; _p.y += vy * dt; _p.z += vz * dt;
    var d = arena.dist(_p);
    if (d < CFG.ball.radius) {
      arena.normal(_p, _n);
      var R = CFG.ball.radius;
      _p.x += _n.x * (R - d); _p.y += _n.y * (R - d); _p.z += _n.z * (R - d);
      var vn = vx * _n.x + vy * _n.y + vz * _n.z;
      if (vn < 0) {
        var e = CFG.arena.wallRestitution + CFG.ball.restitution * 0.55;
        vx += _n.x * -(1 + e) * vn; vy += _n.y * -(1 + e) * vn; vz += _n.z * -(1 + e) * vn;
        vx *= 0.985; vy *= 0.985; vz *= 0.985;
      }
    }
    if (_p.z * sgn >= HZ) return Math.abs(_p.x) < GHW && _p.y <= GH && _p.y > -CFG.ball.radius;
    if (vx * vx + vy * vy + vz * vz < 0.16) return false;   // died short
  }
  return false;
}

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

var agg = { 0: { shots: 0, on: 0, onOld: 0, unreach: 0, goals: 0, ko: 0, own: 0 },
            1: { shots: 0, on: 0, onOld: 0, unreach: 0, goals: 0, ko: 0, own: 0 } };
var terr = 0, terrN = 0;

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

  var last = [0, 0], cool = [0, 0], prevState = w.state, kickoffAt = -99;
  var frames = Math.round(MINS * 60 * 60);
  for (var f = 0; f < frames; f++) {
    var dt = 1 / 60;
    w.step(dt);
    if (w.state === 'PLAYING' && prevState !== 'PLAYING') kickoffAt = w.time;
    prevState = w.state;

    var b = w.ball.body;
    terr += b.pos.z; terrN++;

    // goals. An "own" goal is one credited to team s whose last touch came
    // from team s itself - it costs TWO goals of differential, so it is the
    // single most expensive mistake the AI can make.
    for (var g = 0; g < 2; g++) {
      if (w.score[g] === last[g]) continue;
      var delta = w.score[g] - last[g];
      agg[g].goals += delta;
      if (w.time - kickoffAt < 8) agg[g].ko += delta;
      var lt = w.ball.lastTouch;
      if (lt >= 0 && w.cars[lt] && w.cars[lt].team !== g) agg[w.cars[lt].team].own += delta;
      last[g] = w.score[g];
    }

    cool[0] -= dt; cool[1] -= dt;
    for (var s = 0; s < 2; s++) {
      var sgn = (s === TEAM.PULSE) ? 1 : -1;         // attack direction
      var goalZ = sgn * HZ;
      if (cool[s] > 0) continue;
      if (b.vel.z * sgn < SHOT_V) continue;          // not driven goalward
      if ((b.pos.z - (-sgn * HZ)) * sgn < HZ * 0.4) continue;   // not in attacking half
      cool[s] = COOLDOWN;
      agg[s].shots++;
      var tt = (goalZ - b.pos.z) / b.vel.z;
      if (tt > 0) {
        var px = b.pos.x + b.vel.x * tt;
        var pyRaw = b.pos.y + b.vel.y * tt - 0.5 * G * tt * tt;
        // Clamp to the ground: a rolling ball cannot sink below its radius.
        // Without this, every ground ball projected a second or two ahead reads
        // as y = -17 and is filed as a miss, which understated the on-target
        // rate by a factor of three (21.8% instead of 67.8%).
        var py = Math.max(pyRaw, CFG.ball.radius);
        if (Math.abs(px) < GHW && py <= GH) agg[s].onOld++;
      }
      // The reported figure is the drag-aware one. See dragOnTarget() above.
      if (dragOnTarget(b, sgn)) agg[s].on++;
      // A shot whose asymptotic z travel cannot reach the goal line is not a
      // shot at all - it dies in midfield. Worth knowing how many of those the
      // 12 m/s gate lets in.
      if ((b.vel.z * sgn) / K < (sgn * HZ - b.pos.z) * sgn) agg[s].unreach++;
    }
    if (w.state === 'GAMEOVER') break;
  }
}
Math.random = ORIG;

var tot = { shots: 0, on: 0, onOld: 0, unreach: 0, goals: 0, ko: 0, own: 0 };
for (var k = 0; k < 2; k++) {
  tot.shots += agg[k].shots; tot.on += agg[k].on; tot.onOld += agg[k].onOld;
  tot.unreach += agg[k].unreach; tot.goals += agg[k].goals; tot.ko += agg[k].ko; tot.own += agg[k].own;
}
var per = function (v) { return (v / MATCHES).toFixed(2); };
console.log('SHOT QUALITY  tier ' + TIER + (OPP !== TIER ? ' vs tier ' + OPP : ' (mirror)') +
  '   ' + MATCHES + ' matches x ' + MINS + ' min   (both teams, per match)');
console.log('   shots        ' + per(tot.shots));
console.log('   on target    ' + per(tot.on) + '   [drag-aware, the reported figure]');
console.log('   on target    ' + per(tot.onOld) + '   [old no-drag projection, for continuity]');
console.log('   unreachable  ' + per(tot.unreach) + '   [shots that die before the goal line]');
console.log('   goals        ' + per(tot.goals));
console.log('   kickoff goals' + per(tot.ko));
console.log('   OWN GOALS    ' + per(tot.own));
console.log('   accuracy     ' + (tot.shots ? (100 * tot.on / tot.shots).toFixed(1) : '0') + '%');
console.log('   accuracy     ' + (tot.shots - tot.unreach ? (100 * tot.on / (tot.shots - tot.unreach)).toFixed(1) : '0') +
  '%  (reachable shots only - excludes the ' + per(tot.unreach) + '/match that die short)');
console.log('   conversion   ' + (tot.on ? (100 * tot.goals / tot.on).toFixed(1) : '0') + '%  (goals / on-target)');
console.log('   territory    ' + (terr / terrN).toFixed(2));
