/* tools/sweep.mjs — find the OPTIMUM of a single skill parameter.
 *
 * The tiers were originally built on the assumption "higher/tighter = better".
 * Round-robin proved that false (Pro beat All-Star and Legend). This sweeps one
 * field across a list of candidate values against a FIXED sparring opponent and
 * reports goal difference per match for each value, so the real optimum is
 * visible instead of guessed.
 *
 *   node tools/sweep.mjs <param> <v1,v2,v3,...> [baseTier] [oppTier] [seeds] [mins]
 *   e.g. node tools/sweep.mjs speedFrac 0.70,0.76,0.82,0.88 4 1 14 4
 */
import { World } from '../src/game/world.js';
import { CFG } from '../src/game/config.js';
import { TEAM } from '../src/game/config.js';
import { AI_LEVELS } from '../src/game/ai.js';

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

function runMatch(patchA, levelB, teamSize, minutes, seed, baseTier) {
  seedRandom(seed);
  var cfg = JSON.parse(JSON.stringify(CFG));
  var w = new World(cfg, null, null, null);
  w.initMatch(teamSize, -1, 2);
  for (var i = 0; i < w.ai.length; i++) {
    if (w.ai[i].car.team === TEAM.PULSE) {
      var base = Object.assign({}, AI_LEVELS[baseTier], patchA);
      w.ai[i].sk = base;
      w.ai[i].refreshSkill = function () {};   // keep the patched skill
    } else {
      w.ai[i].forcedLevel = levelB;
      w.ai[i].refreshSkill();
    }
  }
  w.matchTime = minutes * 60; cfg.match.duration = minutes * 60;
  var frames = Math.round(minutes * 60 * 60);
  for (var f = 0; f < frames; f++) {
    w.step(1 / 60);
    if (w.state === 'GAMEOVER') break;
  }
  var r = { a: w.score[0], b: w.score[1] };
  Math.random = ORIG;
  return r;
}

var param = process.argv[2] || 'speedFrac';
var vals = (process.argv[3] || '0.7,0.76,0.82,0.88').split(',').map(Number);
var baseTier = parseInt(process.argv[4] || '4', 10);
var opp = parseInt(process.argv[5] || '1', 10);
var SEEDS = parseInt(process.argv[6] || '14', 10);
var MINS = parseFloat(process.argv[7] || '4');

function evaluate(v) {
  var patch = {}; patch[param] = v;
  var gd = 0, gf = 0, ga = 0;
  for (var s = 0; s < SEEDS; s++) {
    var r = runMatch(patch, opp, 2, MINS, 5000 + s * 131, baseTier);
    gd += r.a - r.b; gf += r.a; ga += r.b;
  }
  return { v: v, diff: gd / SEEDS, gf: gf / SEEDS, ga: ga / SEEDS };
}

console.log('SWEEP ' + param + '   base tier ' + baseTier + ' vs sparring tier ' + opp +
  '   ' + SEEDS + ' seeds x ' + MINS + ' min');
console.log('   value     goalDiff     for     against');
var best = null;
vals.forEach(function (v) {
  var r = evaluate(v);
  console.log('   ' + String(v).padStart(6) + '    ' +
    (r.diff >= 0 ? '+' : '') + r.diff.toFixed(2).padStart(6) + '     ' +
    r.gf.toFixed(2) + '    ' + r.ga.toFixed(2));
  if (!best || r.diff > best.diff) best = r;
});
console.log('   --> best ' + param + ' = ' + best.v + '  (diff ' + best.diff.toFixed(2) + ')');
