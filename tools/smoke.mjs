/* tools/smoke.mjs — end-to-end smoke test with a HUMAN-shaped car in the match.
 * Runs every tier in 1v1/2v2/3v3 with a player car present, and asserts that
 * nothing throws, nothing goes NaN, and the match actually progresses.
 */
import { World } from '../src/game/world.js';
import { CFG } from '../src/game/config.js';
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

var fails = 0, checks = 0;
function check(cond, msg) {
  checks++;
  if (!cond) { fails++; console.log('   FAIL: ' + msg); }
}

console.log('smoke: player present, all tiers x 1v1/2v2/3v3');
for (var lv = 0; lv < AI_LEVELS.length; lv++) {
  for (var ts = 1; ts <= 3; ts++) {
    seedRandom(9000 + lv * 31 + ts);
    var cfg = JSON.parse(JSON.stringify(CFG));
    var w = new World(cfg, null, null, null);
    w.initMatch(ts, 0, lv);              // player on team PULSE
    w.state = 'PLAYING'; w.stateTimer = 0;
    w.matchTime = 90; cfg.match.duration = 90;

    var dt = 1 / 60, frames = 60 * 90;
    var err = null, nan = false, demos = 0, touches = 0, prevTouch = -1;
    try {
      for (var f = 0; f < frames; f++) {
        w.step(dt);
        if (w.state === 'GAMEOVER') break;
        var p = w.ball.body.pos, v = w.ball.body.vel;
        if (!isFinite(p.x) || !isFinite(p.y) || !isFinite(p.z) || !isFinite(v.y)) { nan = true; break; }
        for (var c = 0; c < w.cars.length; c++) {
          var cp = w.cars[c].body.pos;
          if (!isFinite(cp.x) || !isFinite(cp.y) || !isFinite(cp.z)) { nan = true; break; }
        }
        if (nan) break;
      }
    } catch (e) { err = e; }
    demos = w.demos || 0;
    // Count every car/ball contact, not just changes of "who touched last"
    for (var cc = 0; cc < w.cars.length; cc++) touches += w.cars[cc].stats.touches;

    var tag = 'L' + lv + ' ' + ts + 'v' + ts;
    var ok = !err && !nan && touches > 0;
    console.log('  ' + tag + '  ' + (ok ? 'ok  ' : 'BAD ') +
      'score ' + w.score[0] + '-' + w.score[1] +
      '  touches ' + touches + '  demos ' + demos +
      '  playerTouches ' + (w.cars[0].stats ? w.cars[0].stats.touches : 0));
    check(!err, tag + ' threw ' + (err && err.message));
    check(!nan, tag + ' produced NaN');
    check(touches > 3, tag + ' ball was never played (touches=' + touches + ')');
  }
}
console.log('');
console.log((fails === 0 ? 'PASS' : 'FAIL') + ': ' + (checks - fails) + '/' + checks + ' checks');
Math.random = ORIG;
process.exit(fails ? 1 : 0);
