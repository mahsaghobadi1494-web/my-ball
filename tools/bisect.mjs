/* tools/bisect.mjs — which skill parameter is making the higher tier worse?
 *
 * Plays tier HI against tier LO over several seeds, then repeats with each
 * differing field of HI individually downgraded to LO's value. Whichever
 * downgrade improves HI's goal difference is the parameter that is hurting.
 *
 *   node tools/bisect.mjs [HI] [LO] [seeds] [minutes]
 */
import { World } from '../src/game/world.js';
import { CFG } from '../src/game/config.js';
import { AI_LEVELS } from '../src/game/ai.js';
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

function run(levelA, levelB, teamSize, minutes, seed, patchA) {
  seedRandom(seed);
  var cfg = JSON.parse(JSON.stringify(CFG));
  var w = new World(cfg, null, null, null);
  w.initMatch(teamSize, -1, 2);
  for (var i = 0; i < w.ai.length; i++) {
    var lv = (w.ai[i].car.team === TEAM.PULSE) ? levelA : levelB;
    w.ai[i].forcedLevel = lv;
    w.ai[i].refreshSkill();
    if (patchA && w.ai[i].car.team === TEAM.PULSE) {
      w.ai[i].sk = Object.assign({}, AI_LEVELS[levelA], patchA);
      w.ai[i]._patched = true;
      // keep the patch from being clobbered by refreshSkill()
      w.ai[i].refreshSkill = function () { this.sk = Object.assign({}, AI_LEVELS[levelA], patchA); };
    }
  }
  // DO NOT force w.state = 'PLAYING' here. initMatch() puts the world into its
  // kickoff state, and forcing PLAYING makes matchTime tick down from frame 0,
  // so the match expires before anything happens and every seed reads 0-0.
  // (Found the hard way: bisect reported "baseline 0.00, W0/L0" while the same
  // seeds in ladder.mjs produced 2-4 scorelines.)
  w.matchTime = minutes * 60; cfg.match.duration = minutes * 60;
  var dt = 1 / 60, frames = Math.round(minutes * 60 * 60);
  for (var f = 0; f < frames; f++) {
    w.step(dt);
    if (w.state === 'GAMEOVER') break;
  }
  var r = { diff: w.score[0] - w.score[1], score: [w.score[0], w.score[1]] };
  Math.random = ORIG;
  return r;
}

function suite(levelA, levelB, seeds, minutes, patch) {
  var d = 0, w = 0, l = 0;
  for (var s = 0; s < seeds; s++) {
    var r = run(levelA, levelB, 2, minutes, 5000 + s * 131, patch);
    d += r.diff;
    if (r.diff > 0) w++; else if (r.diff < 0) l++;
  }
  return { diff: d / seeds, w: w, l: l };
}

var HI = parseInt(process.argv[2] || '3', 10);
var LO = parseInt(process.argv[3] || '2', 10);
var SEEDS = parseInt(process.argv[4] || '5', 10);
var MINS = parseFloat(process.argv[5] || '3');

var base = suite(HI, LO, SEEDS, MINS, null);
console.log('baseline  L' + HI + ' vs L' + LO + '   goalDiff ' + base.diff.toFixed(2) +
  '   W' + base.w + '/L' + base.l);

var keys = Object.keys(AI_LEVELS[HI]);
var rows = [];
for (var k = 0; k < keys.length; k++) {
  var key = keys[k];
  if (AI_LEVELS[HI][key] === AI_LEVELS[LO][key]) continue;
  if (typeof AI_LEVELS[HI][key] !== 'number') continue;
  var patch = {}; patch[key] = AI_LEVELS[LO][key];
  var r = suite(HI, LO, SEEDS, MINS, patch);
  rows.push({ key: key, from: AI_LEVELS[HI][key], to: AI_LEVELS[LO][key], diff: r.diff, w: r.w, l: r.l, gain: r.diff - base.diff });
}
rows.sort(function (a, b) { return b.gain - a.gain; });
console.log('');
console.log('downgrade one L' + HI + ' field to L' + LO + "'s value  ->  change in goalDiff");
for (var q = 0; q < rows.length; q++) {
  var rw = rows[q];
  console.log('  ' + (rw.key + '            ').slice(0, 14) +
    String(rw.from).padStart(6) + ' -> ' + String(rw.to).padStart(6) +
    '   diff ' + (rw.diff >= 0 ? '+' : '') + rw.diff.toFixed(2) +
    '   W' + rw.w + '/L' + rw.l +
    '   ' + (rw.gain >= 0 ? 'BETTER by ' : 'worse by ') + Math.abs(rw.gain).toFixed(2));
}
