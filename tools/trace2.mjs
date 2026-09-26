/* tools/trace2.mjs — frame trace of a single bot in a 1v1. */
import { World } from '../src/game/world.js';
import { CFG } from '../src/game/config.js';

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

var level = parseInt(process.argv[2] || '2', 10);
var ts = parseInt(process.argv[3] || '1', 10);
var mins = parseFloat(process.argv[4] || '1');
var watch = parseInt(process.argv[5] || '1', 10);

seedRandom(777);
var cfg = JSON.parse(JSON.stringify(CFG));
var w = new World(cfg, null, null, null);
w.initMatch(ts, -1, level);
w.state = 'PLAYING'; w.stateTimer = 0;
w.matchTime = mins * 60; cfg.match.duration = mins * 60;

var ai = w.ai.find(function (a) { return a.car.index === watch; }) || w.ai[0];
var frames = Math.round(mins * 60 * 60);
var dt = 1 / 60;
var last = -1;
var f2 = function (v) { return (v === undefined || v === null || isNaN(v)) ? '-' : v.toFixed(1); };

console.log('t     car(x,z,y)      gnd spd  st      mode        solT  appr(x,z)      ball(x,z,y)     ballSpd  aim(x,z)');
for (var f = 0; f < frames; f++) {
  w.step(dt);
  if (w.state === 'GAMEOVER') break;
  var t = f / 60;
  if (t - last < 0.25) continue;
  last = t;
  var car = ai.car, B = car.body, bp = w.ball.body.pos;
  var sol = ai.solution;
  var appr = sol ? '(' + f2(sol.approachX) + ',' + f2(sol.approachZ) + ')' : '-';
  console.log(
    t.toFixed(2).padStart(5) + ' ' +
    ('(' + f2(B.pos.x) + ',' + f2(B.pos.z) + ',' + f2(B.pos.y) + ')').padEnd(20) +
    (car.grounded ? ' G ' : ' A ') +
    f2(car.speed()).padStart(4) + ' ' +
    (ai.state || '?').padEnd(14) +
    (ai.mode || '-').padEnd(11) +
    (sol ? f2(sol.t).padStart(5) : '    -') + ' ' +
    appr.padEnd(14) +
    ('(' + f2(bp.x) + ',' + f2(bp.z) + ',' + f2(bp.y) + ')').padEnd(20) +
    f2(w.ball.body.vel.len()).padStart(6) + '  ' +
    '(' + f2(ai.aimDir.x) + ',' + f2(ai.aimDir.z) + ')'
  );
}
console.log('FINAL score', w.score[0] + '-' + w.score[1], ' state', w.state);
Math.random = ORIG;
