/* tools/sym.mjs — bias-free tier measurement.
 *
 * PROBLEM: playing a matchup once is contaminated by a PULSE-side effect. In
 * the round-robin, Amateur-as-PULSE lost by 0.7 to Pro AND Pro-as-PULSE lost
 * by 0.7 to Amateur — impossible unless the PULSE side itself is worse. Any
 * single-direction number conflates tier strength with that side bias.
 *
 * FIX: play every pair BOTH ways over the same seeds.
 *     obs1 = D - B      (A on PULSE)
 *     obs2 = -D - B     (B on PULSE)
 *   => D = (obs1 - obs2) / 2     true strength difference, bias cancels
 *      B = -(obs1 + obs2) / 2    the side bias itself, measured for free
 *
 *   node tools/sym.mjs [seeds] [minutes] [teamSize]
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

function runMatch(levelPulse, levelVolt, teamSize, minutes, seed) {
  seedRandom(seed);
  var cfg = JSON.parse(JSON.stringify(CFG));
  var w = new World(cfg, null, null, null);
  w.initMatch(teamSize, -1, 2);
  for (var i = 0; i < w.ai.length; i++) {
    var lv = (w.ai[i].car.team === TEAM.PULSE) ? levelPulse : levelVolt;
    w.ai[i].forcedLevel = lv;
    w.ai[i].refreshSkill();
  }
  w.matchTime = minutes * 60; cfg.match.duration = minutes * 60;
  var frames = Math.round(minutes * 60 * 60);
  var terr = 0, n = 0;
  for (var f = 0; f < frames; f++) {
    w.step(1 / 60);
    // Territory: mean ball z, positive = PULSE (who attack toward +z) pressing.
    // Averaged over every frame of the match, so it is ~5000x better sampled
    // than the goal count and has far lower variance.
    terr += w.ball.body.pos.z; n++;
    if (w.state === 'GAMEOVER') break;
  }
  var d = w.score[0] - w.score[1];          // PULSE minus VOLT
  Math.random = ORIG;
  return { d: d, terr: terr / n };
}

function dir(a, b, seeds, mins) {          // a on PULSE, averaged over seeds
  var td = 0, tt = 0;
  for (var s = 0; s < seeds; s++) {
    var r = runMatch(a, b, 2, mins, 5000 + s * 131);
    td += r.d; tt += r.terr;
  }
  return { d: td / seeds, terr: tt / seeds };
}

var SEEDS = parseInt(process.argv[2] || '12', 10);
var MINS = parseFloat(process.argv[3] || '4');

/* ---- 1. Is there actually a side bias? Self-play must average 0. ---- */
console.log('NOISE FLOOR  (identical tiers on both sides: goals must be ~0, territory ~0)');
[1, 2, 3].forEach(function (lv) {
  var r = dir(lv, lv, SEEDS, MINS);
  console.log('   tier ' + lv + ' vs ' + lv + '  ->  goals ' +
    (r.d >= 0 ? '+' : '') + r.d.toFixed(2) + '   territory ' +
    (r.terr >= 0 ? '+' : '') + r.terr.toFixed(2));
});

/* ---- 2. Bias-free ladder ---- */
var NAMES = ['Rookie', 'Amateur', 'Pro', 'AllStar', 'Legend'];
console.log('');
console.log('BIAS-FREE LADDER  ' + SEEDS + ' seeds x ' + MINS + ' min, both directions');
console.log('   matchup                  goals      territory   (bias B)');
var PAIRS = [[1, 0], [2, 1], [3, 2], [4, 3], [4, 0]];
PAIRS.forEach(function (p) {
  var hi = p[0], lo = p[1];
  var o1 = dir(hi, lo, SEEDS, MINS);       // hi on PULSE
  var o2 = dir(lo, hi, SEEDS, MINS);       // lo on PULSE
  var D = (o1.d - o2.d) / 2;               // true goal difference
  var T = (o1.terr - o2.terr) / 2;         // true territory difference
  var B = -(o1.d + o2.d) / 2;
  console.log('   ' + (NAMES[hi] + ' vs ' + NAMES[lo] + '            ').slice(0, 24) +
    '   ' + (D >= 0 ? '+' : '') + D.toFixed(2) +
    '      ' + (T >= 0 ? '+' : '') + T.toFixed(1) +
    '      ' + B.toFixed(2));
});
