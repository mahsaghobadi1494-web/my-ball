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

var HZ = CFG.arena.hz, GHW = CFG.arena.goalHalfW, GH = CFG.arena.goalHeight;
var G = (CFG.physics && CFG.physics.gravity) ? CFG.physics.gravity : 9.8;
var SHOT_V = 12;          // m/s goalward to count as a shot
var COOLDOWN = 1.2;       // s between counted shots per team

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

var agg = { 0: { shots: 0, on: 0, goals: 0, ko: 0, own: 0 }, 1: { shots: 0, on: 0, goals: 0, ko: 0, own: 0 } };
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
      if (tt <= 0) continue;
      var px = b.pos.x + b.vel.x * tt;
      var pyRaw = b.pos.y + b.vel.y * tt - 0.5 * G * tt * tt;
      // Clamp to the ground: a rolling ball cannot sink below its radius.
      // Without this, every ground ball projected a second or two ahead reads
      // as y = -17 and is filed as a miss, which understated the on-target
      // rate by a factor of three (21.8% instead of 67.8%).
      var py = Math.max(pyRaw, CFG.ball.radius);
      if (Math.abs(px) < GHW && py <= GH) agg[s].on++;
    }
    if (w.state === 'GAMEOVER') break;
  }
}
Math.random = ORIG;

var tot = { shots: 0, on: 0, goals: 0, ko: 0, own: 0 };
for (var k = 0; k < 2; k++) { tot.shots += agg[k].shots; tot.on += agg[k].on; tot.goals += agg[k].goals; tot.ko += agg[k].ko; tot.own += agg[k].own; }
var per = function (v) { return (v / MATCHES).toFixed(2); };
console.log('SHOT QUALITY  tier ' + TIER + (OPP !== TIER ? ' vs tier ' + OPP : ' (mirror)') +
  '   ' + MATCHES + ' matches x ' + MINS + ' min   (both teams, per match)');
console.log('   shots        ' + per(tot.shots));
console.log('   on target    ' + per(tot.on));
console.log('   goals        ' + per(tot.goals));
console.log('   kickoff goals' + per(tot.ko));
console.log('   OWN GOALS    ' + per(tot.own));
console.log('   accuracy     ' + (tot.shots ? (100 * tot.on / tot.shots).toFixed(1) : '0') + '%');
console.log('   conversion   ' + (tot.on ? (100 * tot.goals / tot.on).toFixed(1) : '0') + '%  (goals / on-target)');
console.log('   territory    ' + (terr / terrN).toFixed(2));
