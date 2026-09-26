/* tools/ladder.mjs — high-sample head-to-head tier ladder.
 *
 * The normal bench ladder uses 6 seeds x 4 min, which is far too noisy to
 * separate adjacent tiers (matches are often 0-0 draws). This one runs many
 * more seeds so that a tier gap of even half a goal per match is significant.
 *
 *   node tools/ladder.mjs [seeds] [minutes] [teamSize]
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
  var terrSum = 0;
  for (var f = 0; f < frames; f++) {
    w.step(1 / 60);
    terrSum += w.ball.body.pos.z;   // PULSE attacks +Z, so higher = PULSE territory
  }
  Math.random = ORIG;
  return { a: w.score[0], b: w.score[1], terr: terrSum / frames };
}

var SEEDS = parseInt(process.argv[2] || '20', 10);
var MINS = parseFloat(process.argv[3] || '4');
var TS = parseInt(process.argv[4] || '2', 10);

function suite(hi, lo) {
  var gd = 0, w = 0, d = 0, l = 0, terr = 0, gf = 0, ga = 0;
  for (var s = 0; s < SEEDS; s++) {
    var r = runMatch(hi, lo, TS, MINS, 5000 + s * 131);
    var diff = r.a - r.b;
    gd += diff; gf += r.a; ga += r.b; terr += r.terr;
    if (diff > 0) w++; else if (diff < 0) l++; else d++;
  }
  return {
    hi: hi, lo: lo,
    diff: gd / SEEDS, gf: gf / SEEDS, ga: ga / SEEDS,
    terr: terr / SEEDS, w: w, d: d, l: l
  };
}

var NAMES = ['Rookie', 'Amateur', 'Pro', 'All-Star', 'Legend'];
console.log('LADDER  ' + TS + 'v' + TS + '  ' + SEEDS + ' seeds x ' + MINS + ' min');
console.log('matchup                     goalDiff   for   against  territory   W-D-L');
var prev = null;
for (var hi = 1; hi <= 4; hi++) {
  var r = suite(hi, hi - 1);
  var pad = (NAMES[r.hi] + ' vs ' + NAMES[r.lo]);
  while (pad.length < 26) pad += ' ';
  console.log(pad +
    (r.diff >= 0 ? '+' : '') + r.diff.toFixed(2) + '     ' +
    r.gf.toFixed(2) + '   ' + r.ga.toFixed(2) + '     ' +
    r.terr.toFixed(2) + '      ' + r.w + '-' + r.d + '-' + r.l);
}
var top = suite(4, 0);
console.log('');
console.log('Legend vs Rookie            ' +
  (top.diff >= 0 ? '+' : '') + top.diff.toFixed(2) + '     ' +
  top.gf.toFixed(2) + '   ' + top.ga.toFixed(2) + '     ' +
  top.terr.toFixed(2) + '      ' + top.w + '-' + top.d + '-' + top.l);
