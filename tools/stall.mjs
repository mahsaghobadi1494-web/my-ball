/* tools/stall.mjs — reproduce and inspect a stalled match. */
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

var lv = parseInt(process.argv[2] || '2', 10);
var ts = parseInt(process.argv[3] || '1', 10);
var seed = parseInt(process.argv[4] || '9063', 10);

seedRandom(seed);
var cfg = JSON.parse(JSON.stringify(CFG));
var w = new World(cfg, null, null, null);
w.initMatch(ts, 0, lv);
w.state = 'PLAYING'; w.stateTimer = 0;
w.matchTime = 90; cfg.match.duration = 90;

var dt = 1 / 60;
var f2 = function (v) { return (v === undefined || isNaN(v)) ? '-' : v.toFixed(1); };
console.log('t      ball(x,y,z)          ballSpd  bot(x,z,y)          gnd spd  state    mode       solT  grounded?');
for (var f = 0; f < 60 * 40; f++) {
  w.step(dt);
  if (w.state === 'GAMEOVER') break;
  if (f % 20 !== 0) continue;
  var b = w.ball.body.pos;
  var bot = w.ai[w.ai.length - 1];
  var car = bot.car, B = car.body;
  console.log(
    (f / 60).toFixed(1).padStart(5) + '  ' +
    ('(' + f2(b.x) + ',' + f2(b.y) + ',' + f2(b.z) + ')').padEnd(24) +
    f2(w.ball.body.vel.len()).padStart(6) + '  ' +
    ('(' + f2(B.pos.x) + ',' + f2(B.pos.z) + ',' + f2(B.pos.y) + ')').padEnd(20) +
    (car.grounded ? 'G ' : 'A ') + f2(car.speed()).padStart(5) + '  ' +
    (bot.state || '?').padEnd(9) + (bot.mode || '-').padEnd(11) +
    (bot.solution ? f2(bot.solution.t).padStart(5) : '    -')
  );
}
console.log('score', w.score[0] + '-' + w.score[1], 'state', w.state);
Math.random = ORIG;
