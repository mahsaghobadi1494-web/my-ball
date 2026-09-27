/* tools/orbit_trace.mjs — per-frame trace of one bot next to a stationary ball.
 *
 * Prints the bot's decision `mode` each sample so we can see WHY it is not
 * striking: is it stuck in CUT_OFF (chasing a point) instead of ever reaching
 * CHARGE (driving through the ball)?
 *
 *   node tools/orbit_trace.mjs [level] [spotX] [spotZ]
 */
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

var LV = parseInt(process.argv[2] || '3', 10);
var BX = parseFloat(process.argv[3] || '-16');
var BZ = parseFloat(process.argv[4] || '-14');

seedRandom(1000 + BX * 7 + BZ * 13);
var R = CFG.ball.radius, dt = 1 / 60;

var cfg = JSON.parse(JSON.stringify(CFG));
cfg.match.duration = 600;
var w = new World(cfg, null, null, null);
w.initMatch(2, -1, LV);

var guard = 0;
while (w.state !== 'PLAYING' && guard++ < 600) w.step(dt);
for (var f = 0; f < 90; f++) w.step(dt);

var bot = w.ai[0];
var car = bot.car;

console.log('bot = ' + car.name + ' (team ' + car.team + '), ball pinned at (' + BX + ',' + BZ + ')');
console.log('t      mode        state       distToBall  angToBall  solT   chase  behind  aligned  speed');
for (var g = 0; g < 60 * 14; g++) {
  w.ball.body.pos.set(BX, R, BZ);
  w.ball.body.vel.zero();
  w.ball.body.angVel.zero();
  w.step(dt);

  if (g % 30 !== 0) continue;
  var B = car.body;
  var dx = B.pos.x - BX, dz = B.pos.z - BZ;
  var dist = Math.sqrt(dx * dx + dz * dz);
  var sol = bot.solution;
  var f2 = function (v, n) { return (v === undefined || v === null || isNaN(v)) ? '  -  ' : v.toFixed(n === undefined ? 1 : n); };
  console.log(
    (g / 60).toFixed(1).padStart(5) + '  ' +
    String(bot.mode).padEnd(11) + ' ' +
    String(bot.state).padEnd(11) + ' ' +
    f2(dist).padStart(10) + '  ' +
    f2(bot.headingError(sol ? { x: sol.bx, y: 0, z: sol.bz } : { x: BX, y: 0, z: BZ }), 2).padStart(9) + '  ' +
    f2(sol ? sol.t : undefined, 2).padStart(5) + '  ' +
    String(sol ? !!sol.chase : '-').padStart(5) + '  ' +
    String(bot.mode === 'CHARGE').padStart(6) + '  ' +
    String(bot.mode === 'CHARGE' || bot.mode === 'CUT_OFF').padStart(7) + '  ' +
    f2(car.speed()).padStart(5)
  );
}
Math.random = ORIG;
