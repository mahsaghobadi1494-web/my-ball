/* tools/roundrobin.mjs — every tier against every other tier.
 *
 * The adjacent-only ladder can hide a non-monotonic ordering (e.g. All-Star
 * losing to Pro while still beating Rookie). This plays all 10 pairs so the
 * true strength ordering is visible, then ranks tiers by total goal
 * difference.
 *
 *   node tools/roundrobin.mjs [seeds] [minutes] [teamSize]
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

function runMatch(levelA, levelB, teamSize, minutes, seed) {
  seedRandom(seed);
  var cfg = JSON.parse(JSON.stringify(CFG));
  var w = new World(cfg, null, null, null);
  w.initMatch(teamSize, -1, 2);
  for (var i = 0; i < w.ai.length; i++) {
    var lv = (w.ai[i].car.team === TEAM.PULSE) ? levelA : levelB;
    w.ai[i].forcedLevel = lv;
    w.ai[i].refreshSkill();
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

var SEEDS = parseInt(process.argv[2] || '16', 10);
var MINS = parseFloat(process.argv[3] || '4');
var TS = parseInt(process.argv[4] || '2', 10);

function suite(hi, lo) {
  var gd = 0, w = 0, d = 0, l = 0, gf = 0, ga = 0;
  for (var s = 0; s < SEEDS; s++) {
    var r = runMatch(hi, lo, TS, MINS, 5000 + s * 131);
    gd += r.a - r.b; gf += r.a; ga += r.b;
    if (r.a > r.b) w++; else if (r.a < r.b) l++; else d++;
  }
  return { diff: gd / SEEDS, gf: gf / SEEDS, ga: ga / SEEDS, w: w, d: d, l: l };
}

var NAMES = ['Rookie', 'Amateur', 'Pro', 'AllStar', 'Legend'];
var N = 5;
var total = new Array(N).fill(0);
console.log('ROUND ROBIN  ' + TS + 'v' + TS + '  ' + SEEDS + ' seeds x ' + MINS + ' min');
console.log('cell = row tier vs col tier: goalDiff per match (W-D-L)');
process.stdout.write('            ');
for (var j = 0; j < N; j++) process.stdout.write((NAMES[j] + '       ').slice(0, 10));
console.log('');
for (var i = 0; i < N; i++) {
  process.stdout.write((NAMES[i] + '            ').slice(0, 12));
  for (var k = 0; k < N; k++) {
    if (i === k) { process.stdout.write('     --       '); continue; }
    var r = suite(i, k);
    total[i] += r.diff;
    var cell = ((r.diff >= 0 ? '+' : '') + r.diff.toFixed(1) + ' (' + r.w + '-' + r.d + '-' + r.l + ')');
    process.stdout.write((cell + '             ').slice(0, 14));
  }
  console.log('');
}
console.log('');
var order = [];
for (var q = 0; q < N; q++) order.push({ n: NAMES[q], t: total[q] });
order.sort(function (a, b) { return b.t - a.t; });
console.log('total goal difference across all opponents (higher = stronger):');
order.forEach(function (o, idx) {
  console.log('  ' + (idx + 1) + '. ' + (o.n + '        ').slice(0, 10) + (o.t >= 0 ? '+' : '') + o.t.toFixed(2));
});
