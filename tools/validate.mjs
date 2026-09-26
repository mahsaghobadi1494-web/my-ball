/* tools/validate.mjs — does a learned genome survive INDEPENDENT seeds?
 *
 * train.mjs optimises on seeds 9000 + s*977. That is a small, fixed sample, so
 * a genome can look great purely by fitting those particular matches. This
 * re-tests on a completely different seed family (5000 + s*131, the one used
 * by final.mjs) with a paired, both-direction differential and real standard
 * errors. Only a result that clears ~2 standard errors is worth believing.
 *
 *   node tools/validate.mjs <genome.json> [seeds] [minutes] [refTier]
 */
import { World } from '../src/game/world.js';
import { CFG } from '../src/game/config.js';
import { TEAM } from '../src/game/config.js';
import { AI_LEVELS } from '../src/game/ai.js';
import fs from 'fs';

var HZ = CFG.arena.hz, GHW = CFG.arena.goalHalfW, GH = CFG.arena.goalHeight;
var GRAV = (CFG.physics && CFG.physics.gravity) ? CFG.physics.gravity : 9.8;
var BR = CFG.ball.radius;

var FILE = process.argv[2];
var SEEDS = parseInt(process.argv[3] || '32', 10);
var MINS = parseFloat(process.argv[4] || '4');
var REFTIER = parseInt(process.argv[5] || '4', 10);

var learned = JSON.parse(fs.readFileSync(FILE, 'utf8')).genome;
var REF = JSON.parse(JSON.stringify(AI_LEVELS[REFTIER]));
var BASE = JSON.parse(JSON.stringify(AI_LEVELS[REFTIER]));

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

function run(pulseSk, voltSk, seed) {
  seedRandom(seed);
  var cfg = JSON.parse(JSON.stringify(CFG));
  var w = new World(cfg, null, null, null);
  w.initMatch(2, -1, 2);
  for (var i = 0; i < w.ai.length; i++) {
    w.ai[i].sk = (w.ai[i].car.team === TEAM.PULSE) ? pulseSk : voltSk;
    w.ai[i].refreshSkill = function () {};
  }
  w.matchTime = MINS * 60; cfg.match.duration = MINS * 60;
  var frames = Math.round(MINS * 60 * 60), terr = 0, n = 0, onT = 0;
  var cool = [0, 0];
  for (var f = 0; f < frames; f++) {
    var dt = 1 / 60;
    w.step(dt);
    var b = w.ball.body;
    terr += b.pos.z; n++;
    cool[0] -= dt; cool[1] -= dt;
    for (var s = 0; s < 2; s++) {
      var sgn = (s === TEAM.PULSE) ? 1 : -1, goalZ = sgn * HZ;
      if (cool[s] > 0) continue;
      if (b.vel.z * sgn < 12) continue;
      if ((b.pos.z - (-sgn * HZ)) * sgn < HZ * 0.55) continue;
      cool[s] = 1.2;
      var tt = (goalZ - b.pos.z) / b.vel.z;
      if (tt <= 0 || tt > 4) continue;
      var px = b.pos.x + b.vel.x * tt;
      var py = Math.max(b.pos.y + b.vel.y * tt - 0.5 * GRAV * tt * tt, BR);
      if (Math.abs(px) < GHW && py <= GH) onT += (s === TEAM.PULSE ? 1 : -1);
    }
    if (w.state === 'GAMEOVER') break;
  }
  var r = { d: w.score[0] - w.score[1], terr: terr / n, onT: onT };
  Math.random = ORIG;
  return r;
}

var dg = [], dt = [], doT = [];
for (var s = 0; s < SEEDS; s++) {
  var seed = 5000 + s * 131;
  var a = run(learned, REF, seed);
  var b = run(REF, learned, seed);
  dg.push((a.d - b.d) / 2);
  dt.push((a.terr - b.terr) / 2);
  doT.push((a.onT - b.onT) / 2);
}
function mean(x) { var s = 0; for (var i = 0; i < x.length; i++) s += x[i]; return s / x.length; }
function se(x) { var m = mean(x), s = 0; for (var i = 0; i < x.length; i++) s += (x[i] - m) * (x[i] - m); return Math.sqrt(s / (x.length - 1) / x.length); }

console.log('VALIDATION  ' + FILE + '  vs tier ' + REFTIER + ' (' + AI_LEVELS[REFTIER].name + ')');
console.log('   ' + SEEDS + ' seeds x ' + MINS + ' min, independent seed family');
var mg = mean(dg), eg = se(dg), mt = mean(dt), et = se(dt), mo = mean(doT), eo = se(doT);
console.log('   goals       ' + (mg >= 0 ? '+' : '') + mg.toFixed(2) + ' +/- ' + eg.toFixed(2) +
  '   ' + (Math.abs(mg) > 2 * eg ? (mg > 0 ? 'LEARNED IS BETTER' : 'LEARNED IS WORSE') : 'inside noise'));
console.log('   territory   ' + (mt >= 0 ? '+' : '') + mt.toFixed(2) + ' +/- ' + et.toFixed(2) +
  '   ' + (Math.abs(mt) > 2 * et ? (mt > 0 ? 'LEARNED IS BETTER' : 'LEARNED IS WORSE') : 'inside noise'));
console.log('   on target   ' + (mo >= 0 ? '+' : '') + mo.toFixed(2) + ' +/- ' + eo.toFixed(2));

console.log('');
console.log('   genome changes vs the tier it was trained from:');
var changed = 0;
for (var k in BASE) {
  if (typeof BASE[k] !== 'number') continue;
  if (learned[k] === undefined) continue;
  var d = learned[k] - BASE[k];
  if (Math.abs(d) < 1e-9) continue;
  changed++;
  var pct = BASE[k] !== 0 ? (100 * d / BASE[k]).toFixed(0) + '%' : 'n/a';
  console.log('      ' + (k + '           ').slice(0, 13) + String(BASE[k]).padStart(7) + ' -> ' +
    String(Math.round(learned[k] * 1000) / 1000).padStart(8) + '   (' + (d > 0 ? '+' : '') + pct + ')');
}
console.log('   ' + changed + ' parameters changed');
