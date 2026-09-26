/* tools/final.mjs — high-sample, bias-free test of the CONTESTED pairs.
 *
 * sym.mjs showed Rookie is clearly weaker and Amateur clearly below the rest,
 * but Pro / All-Star / Legend were inside the noise at 12 seeds. This runs
 * only those pairs with many more seeds, plays each pair in BOTH directions
 * (which cancels the PULSE-side asymmetry), and reports a self-play noise
 * floor so every number can be judged against an actual error bar instead of
 * a guess.
 *
 *   node tools/final.mjs [seeds] [minutes]
 */
import { World } from '../src/game/world.js';
import { CFG } from '../src/game/config.js';
import { TEAM } from '../src/game/config.js';

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

/* One direction: `pulse` tier on the PULSE side. Returns per-seed samples so
 * we can compute a real standard error instead of just a mean. */
function dirSamples(pulse, volt, seeds, mins) {
  var g = [], t = [];
  for (var s = 0; s < seeds; s++) {
    seedRandom(5000 + s * 131);
    var cfg = JSON.parse(JSON.stringify(CFG));
    var w = new World(cfg, null, null, null);
    w.initMatch(2, -1, 2);
    for (var i = 0; i < w.ai.length; i++) {
      w.ai[i].forcedLevel = (w.ai[i].car.team === TEAM.PULSE) ? pulse : volt;
      w.ai[i].refreshSkill();
    }
    w.matchTime = mins * 60; cfg.match.duration = mins * 60;
    var frames = Math.round(mins * 60 * 60), terr = 0, n = 0;
    for (var f = 0; f < frames; f++) {
      w.step(1 / 60);
      terr += w.ball.body.pos.z; n++;
      if (w.state === 'GAMEOVER') break;
    }
    g.push(w.score[0] - w.score[1]);
    t.push(terr / n);
    Math.random = ORIG;
  }
  return { g: g, t: t };
}

function mean(a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s / a.length; }
function sd(a) { var m = mean(a), s = 0; for (var i = 0; i < a.length; i++) s += (a[i] - m) * (a[i] - m); return Math.sqrt(s / (a.length - 1)); }

var SEEDS = parseInt(process.argv[2] || '32', 10);
var MINS = parseFloat(process.argv[3] || '4');
var NAMES = ['Rookie', 'Amateur', 'Pro', 'AllStar', 'Legend'];

/* ---- noise floor: how big is a difference that means nothing? ---- */
console.log('NOISE FLOOR  (same tier both sides; the true value is 0)');
var noiseG = [], noiseT = [];
[2, 3].forEach(function (lv) {
  var r = dirSamples(lv, lv, SEEDS, MINS);
  var mg = mean(r.g), mt = mean(r.t);
  noiseG.push(Math.abs(mg)); noiseT.push(Math.abs(mt));
  console.log('   tier ' + lv + ' vs ' + lv + '   goals ' + (mg >= 0 ? '+' : '') + mg.toFixed(2) +
    ' +/- ' + (sd(r.g) / Math.sqrt(SEEDS)).toFixed(2) +
    '   territory ' + (mt >= 0 ? '+' : '') + mt.toFixed(2) +
    ' +/- ' + (sd(r.t) / Math.sqrt(SEEDS)).toFixed(2));
});

console.log('');
console.log('CONTESTED PAIRS  ' + SEEDS + ' seeds x ' + MINS + ' min, both directions');
console.log('   matchup                goals +/- se        territory +/- se');
[[2, 1], [3, 2], [4, 3]].forEach(function (p) {
  var hi = p[0], lo = p[1];
  var a = dirSamples(hi, lo, SEEDS, MINS);   // hi on PULSE
  var b = dirSamples(lo, hi, SEEDS, MINS);   // lo on PULSE
  // Paired: same seed in both directions. D = (a - b)/2 cancels side bias.
  var dg = [], dt = [];
  for (var i = 0; i < SEEDS; i++) { dg.push((a.g[i] - b.g[i]) / 2); dt.push((a.t[i] - b.t[i]) / 2); }
  var mg = mean(dg), eg = sd(dg) / Math.sqrt(SEEDS);
  var mt = mean(dt), et = sd(dt) / Math.sqrt(SEEDS);
  var verdict = Math.abs(mg) > 2 * eg ? 'RESOLVED' : 'inside noise';
  console.log('   ' + (NAMES[hi] + ' vs ' + NAMES[lo] + '         ').slice(0, 22) +
    '  ' + (mg >= 0 ? '+' : '') + mg.toFixed(2) + ' +/- ' + eg.toFixed(2) +
    '      ' + (mt >= 0 ? '+' : '') + mt.toFixed(2) + ' +/- ' + et.toFixed(2) +
    '   ' + verdict);
});
