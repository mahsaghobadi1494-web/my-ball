/* tools/goalshape.mjs — how do goals ACTUALLY happen?
 *
 * quality.mjs counts a "shot" as any ball driven goalward above 12 m/s while
 * past 40% of the field. quality2.mjs showed 19.5% of those can never reach the
 * goal (drag: max z travel = vz/k, k = drag*6 = 0.183/s). This tool looks at
 * GOALS instead, event-based (no ring-buffer scanning, which is unreliable
 * across the kickoff reset).
 *
 * Two event streams are maintained while the match runs:
 *   lastInFront — the most recent ball state with |z| < goal line (the shot)
 *   kick        — the most recent ball state right after a car touched it
 * At each goal it reports the geometry of the scoring event and whether the
 * 12 m/s classifier would have counted it.
 *
 *   node tools/goalshape.mjs [tier] [matches] [minutes] [oppTier]
 */
import { World } from '../src/game/world.js';
import { CFG, TEAM } from '../src/game/config.js';

var HZ = CFG.arena.hz, R = CFG.ball.radius;
var SHOT_V = 12;

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

var goals = [];
function pct(a, p) { if (!a.length) return 0; var b = a.slice().sort(function (x, y) { return x - y; }); return b[Math.min(b.length - 1, Math.floor(p * b.length))]; }
function mean(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : 0; }
function snap(b, t) { return { t: t, x: b.pos.x, y: b.pos.y, z: b.pos.z, vx: b.vel.x, vy: b.vel.y, vz: b.vel.z }; }
function spd(s) { return Math.sqrt(s.vx * s.vx + s.vy * s.vy + s.vz * s.vz); }

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

  var last = [0, 0], prevTt = -1;
  var lastInFront = null, kick = null, kickTt = -1, kickMode = '?', kickState = '?';
  var frames = Math.round(MINS * 60 * 60);

  for (var f = 0; f < frames; f++) {
    w.step(1 / 60);
    var b = w.ball.body;

    if (Math.abs(b.pos.z) < HZ) lastInFront = snap(b, w.time);
    if (w.ball.lastTouchTime !== prevTt) {
      kick = snap(b, w.time); kickTt = w.ball.lastTouchTime;
      /* WHICH aim logic made this touch? chooseAim returns 'CLEAR' while
       * goalDist > 34 and 'SHOOT' inside that. If most goals come from CLEAR
       * touches, the SHOOT aim is engaging too late. */
      kickMode = '?'; kickState = '?';
      for (var q = 0; q < w.ai.length; q++) {
        if (w.ai[q].car.index === w.ball.lastTouch) {
          kickMode = w.ai[q].aimMode || '?';
          kickState = w.ai[q].state || '?';
          break;
        }
      }
    }
    prevTt = w.ball.lastTouchTime;

    for (var g = 0; g < 2; g++) {
      if (w.score[g] === last[g]) continue;
      last[g] = w.score[g];
      var sgn = (g === TEAM.PULSE) ? 1 : -1;
      var shot = lastInFront;
      var k = kick;
      if (!shot || !k) continue;
      if (shot.z * sgn <= 0) continue;                 // stale: shot was not on this side
      if (w.time - k.t > 8) continue;                  // no recent touch: not a shot
      goals.push({
        sp: spd(shot), vz: shot.vz * sgn,
        x: Math.abs(shot.x), y: shot.y,
        airborne: shot.y > R * 1.5,
        ttg: w.time - k.t,
        distKick: Math.abs(HZ - k.z),
        spKick: spd(k),
        kickVz: k.vz * sgn,
        kickDepth: k.z * sgn,
        counted: (k.vz * sgn >= SHOT_V) && (k.z * sgn >= -0.6 * HZ),
        mode: kickMode, state: kickState
      });
    }
    if (w.state === 'GAMEOVER') break;
  }
}
Math.random = ORIG;

var N = goals.length;
console.log('GOAL SHAPE  tier ' + TIER + (OPP !== TIER ? ' vs tier ' + OPP : ' (mirror)') +
  '   ' + MATCHES + ' matches x ' + MINS + ' min   ->   ' + N + ' goals (' + (N / MATCHES).toFixed(2) + '/match)');
if (!N) process.exit(0);
function col(label, a, dec) {
  dec = dec === undefined ? 1 : dec;
  console.log('   ' + label + '  mean ' + mean(a).toFixed(dec) + '  p25 ' + pct(a, 0.25).toFixed(dec) +
    '  med ' + pct(a, 0.5).toFixed(dec) + '  p75 ' + pct(a, 0.75).toFixed(dec) +
    '  p95 ' + pct(a, 0.95).toFixed(dec) + '  max ' + pct(a, 0.999).toFixed(dec));
}
col('speed at the line       (m/s)', goals.map(function (o) { return o.sp; }));
col('goalward speed at line  (m/s)', goals.map(function (o) { return o.vz; }));
col('mouth offset |x|        (m)', goals.map(function (o) { return o.x; }), 2);
col('height y at the line    (m)', goals.map(function (o) { return o.y; }), 2);
col('last touch -> line time (s)', goals.map(function (o) { return o.ttg; }), 2);
col('distance from goal at touch (m)', goals.map(function (o) { return o.distKick; }));
col('speed at the touch      (m/s)', goals.map(function (o) { return o.spKick; }));
col('goalward speed at touch (m/s)', goals.map(function (o) { return o.kickVz; }));
var nAir = goals.filter(function (o) { return o.airborne; }).length;
var nCounted = goals.filter(function (o) { return o.counted; }).length;
var nSlow = goals.filter(function (o) { return o.kickVz < SHOT_V; }).length;
var nNear = goals.filter(function (o) { return o.kickDepth < -0.6 * HZ; }).length;
console.log('   airborne at the line: ' + nAir + '/' + N + '  (' + (100 * nAir / N).toFixed(0) + '%)');
console.log('   the 12 m/s classifier would count: ' + nCounted + '/' + N + '  (' + (100 * nCounted / N).toFixed(0) + '%)');
console.log('   missed because touch speed < 12 m/s : ' + nSlow + '/' + N);
console.log('   missed because touched in our own 40%: ' + nNear + '/' + N);
/* which aim logic produced the scoring touch? */
var modes = {}, states = {};
goals.forEach(function (o) { modes[o.mode] = (modes[o.mode] || 0) + 1; states[o.state] = (states[o.state] || 0) + 1; });
console.log('   aim mode at the scoring touch:');
Object.keys(modes).sort(function (a, b) { return modes[b] - modes[a]; })
  .forEach(function (k) { console.log('      ' + k.padEnd(8) + ' ' + modes[k] + '  (' + (100 * modes[k] / N).toFixed(0) + '%)'); });
console.log('   bot state at the scoring touch:');
Object.keys(states).sort(function (a, b) { return states[b] - states[a]; }).slice(0, 6)
  .forEach(function (k) { console.log('      ' + k.padEnd(8) + ' ' + states[k] + '  (' + (100 * states[k] / N).toFixed(0) + '%)'); });
