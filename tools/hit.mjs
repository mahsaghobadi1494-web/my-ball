/* tools/hit.mjs — isolated "can a bot actually strike the ball" scenarios.
 *
 * Drops a single bot into a controlled situation and measures how long it
 * takes to touch the ball, where the ball ends up, and whether the touch is
 * a clean shot toward the opponent goal.
 *
 *   node tools/hit.mjs [level]
 */
import { World } from '../src/game/world.js';
import { CFG } from '../src/game/config.js';
import { AI_LEVELS } from '../src/game/ai.js';
import { V3, Quat } from '../src/game/math.js';

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

var BALL_R = CFG.ball.radius;
var REST_Y = 0.28;

/* scenario: bot starts at botZ, ball at ballZ, bot faces +Z (attacking +Z) */
function scenario(level, name, botX, botZ, ballX, ballZ, ballY, ballVel, seconds) {
  seedRandom(4242);
  var cfg = JSON.parse(JSON.stringify(CFG));
  var w = new World(cfg, null, null, null);
  w.initMatch(1, -1, level);          // 1v1 -> cars[0]=PULSE, cars[1]=VOLT
  w.state = 'PLAYING'; w.stateTimer = 0;
  w.matchTime = seconds + 5; cfg.match.duration = seconds + 5;

  var car = w.cars[1];                // VOLT: attacks toward -Z
  var bot = null;
  for (var i = 0; i < w.ai.length; i++) if (w.ai[i].car === car) bot = w.ai[i];

  // park the other car far away on the ceiling so it cannot interfere
  var other = w.cars[0];
  other.body.pos.set(0, 200, 0);
  other.body.vel.zero();

  // Volt attacks -Z, so "forward" for the bot is -Z.
  // Place the bot so the target goal (-Z) is ahead of it.
  var q = new Quat().fromAxisAngle(0, 1, 0, Math.PI);  // facing -Z
  car.resetState(new V3(botX, REST_Y, botZ), q, 100);
  car.body.vel.zero();
  car.body.angVel.zero();
  car.castWheels(w.arena);

  w.ball.body.pos.set(ballX, ballY === undefined ? BALL_R : ballY, ballZ);
  w.ball.body.vel.set(ballVel ? ballVel.x : 0, ballVel ? ballVel.y : 0, ballVel ? ballVel.z : 0);
  w.ball.body.angVel.zero();
  w.ball.lastTouch = -1;
  w.ball.lastTouchTeam = -1;

  var dt = 1 / 60;
  var frames = Math.round(seconds * 60);
  var firstTouch = -1, touches = 0, prevTouch = -1;
  var minD = 1e9;
  var ballAfterVel = null;

  for (var f = 0; f < frames; f++) {
    w.step(dt);
    if (w.state !== 'PLAYING') break;
    var d = Math.hypot(car.body.pos.x - w.ball.body.pos.x,
                       car.body.pos.y - w.ball.body.pos.y,
                       car.body.pos.z - w.ball.body.pos.z);
    if (d < minD) minD = d;
    if (w.ball.lastTouch !== prevTouch) {
      prevTouch = w.ball.lastTouch;
      touches++;
      if (firstTouch < 0) {
        firstTouch = f / 60;
        ballAfterVel = { x: w.ball.body.vel.x, y: w.ball.body.vel.y, z: w.ball.body.vel.z };
      }
    }
  }

  var v = ballAfterVel;
  var tag = 'FAIL';
  if (firstTouch >= 0) tag = 'HIT';
  console.log(
    'L' + level + ' ' + name.padEnd(26) + tag +
    '  firstTouch ' + (firstTouch < 0 ? ' -- ' : firstTouch.toFixed(2) + 's').padStart(7) +
    '  touches ' + String(touches).padStart(2) +
    '  minDist ' + minD.toFixed(2).padStart(6) +
    (v ? ('  ballVel (' + v.x.toFixed(1) + ',' + v.y.toFixed(1) + ',' + v.z.toFixed(1) + ') spd ' +
          Math.hypot(v.x, v.y, v.z).toFixed(1)) : '')
  );
  Math.random = ORIG;
}

var lv = parseInt(process.argv[2] || '2', 10);
console.log('--- level ' + lv + ' (' + AI_LEVELS[lv].name + ') : bot = VOLT, it attacks -Z ---');
scenario(lv, 'static ball 12m ahead', 0, 0, 0, -12, BALL_R, null, 4);
scenario(lv, 'static ball 20m ahead', 0, 0, 0, -20, BALL_R, null, 5);
scenario(lv, 'static ball 35m ahead', 0, 0, 0, -35, BALL_R, null, 6);
scenario(lv, 'static ball 8m behind', 0, 0, 0, 8, BALL_R, null, 5);
scenario(lv, 'static ball off-axis', 0, 0, 12, -18, BALL_R, null, 5);
scenario(lv, 'ball rolling away 10m/s', 0, 0, 0, -10, BALL_R, { x: 0, y: 0, z: -10 }, 5);
scenario(lv, 'ball rolling toward 10m/s', 0, 0, 0, -30, BALL_R, { x: 0, y: 0, z: 10 }, 5);
scenario(lv, 'ball lofted y=8', 0, 0, 0, -14, 8.0, { x: 0, y: 0, z: -4 }, 5);
