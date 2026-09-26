/* tools/events.mjs — how often do the "skill" behaviours actually fire?
 *
 * The tiers differ by design in air dribbles, fakes, demos, aerials and
 * passes. But self-play showed Pro/All-Star/Legend scoring almost the same,
 * which is suspicious: if the high-tier-only behaviours never trigger, the
 * tiers cannot separate no matter how the numbers are tuned.
 *
 * This counts, per match, how many times each bot ENTERS each state (a
 * transition of `ai.state`), so we can see whether the gates are so tight
 * that the behaviour is effectively unreachable.
 *
 *   node tools/events.mjs [level] [matches] [minutes]
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

var LEVEL = parseInt(process.argv[2] || '4', 10);
var MATCHES = parseInt(process.argv[3] || '6', 10);
var MINS = parseFloat(process.argv[4] || '4');

var totals = {};
var botCount = 0;

for (var m = 0; m < MATCHES; m++) {
  seedRandom(5000 + m * 131);
  var cfg = JSON.parse(JSON.stringify(CFG));
  var w = new World(cfg, null, null, null);
  w.initMatch(2, -1, 2);
  for (var i = 0; i < w.ai.length; i++) {
    w.ai[i].forcedLevel = LEVEL;
    w.ai[i].refreshSkill();
  }
  w.matchTime = MINS * 60; cfg.match.duration = MINS * 60;
  var prev = w.ai.map(function () { return ''; });
  botCount = w.ai.length;
  var frames = Math.round(MINS * 60 * 60);
  for (var f = 0; f < frames; f++) {
    w.step(1 / 60);
    for (var b = 0; b < w.ai.length; b++) {
      var st = w.ai[b].state || '';
      if (st !== prev[b]) {
        if (st) totals[st] = (totals[st] || 0) + 1;
        prev[b] = st;
      }
    }
    if (w.state === 'GAMEOVER') break;
  }
}
Math.random = ORIG;

var keys = Object.keys(totals).sort(function (a, b) { return totals[b] - totals[a]; });
console.log('STATE ENTRIES  tier ' + LEVEL + '  ' + MATCHES + ' matches x ' + MINS +
  ' min, ' + botCount + ' bots  (per match, all bots)');
keys.forEach(function (k) {
  console.log('   ' + (k + '              ').slice(0, 16) +
    (totals[k] / MATCHES).toFixed(2));
});
