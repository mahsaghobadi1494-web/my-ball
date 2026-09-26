/* tools/duel.mjs — does the bot actually bump / demolish a human-shaped car?
 *
 * Puts an idle player car right where the bot wants to go (in front of the
 * ball) and counts bumps and demolitions per tier.
 *
 *   node tools/duel.mjs [minutes]
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
var R = CFG.ball.radius;

function duel(level, minutes, seed) {
  seedRandom(seed);
  var cfg = JSON.parse(JSON.stringify(CFG));
  var w = new World(cfg, null, null, null);
  w.initMatch(1, 0, level);            // player = PULSE car 0, bot = VOLT car 1
  w.state = 'PLAYING'; w.stateTimer = 0;
  w.matchTime = minutes * 60 + 30; cfg.match.duration = minutes * 60 + 30;

  var bot = w.cars[1], player = w.cars[0];

  // Park the player directly between the bot and the ball.
  var q = new Quat().fromAxisAngle(0, 1, 0, Math.PI);
  bot.resetState(new V3(0, 0.02, 26), q, 100);
  bot.body.vel.zero(); bot.body.angVel.zero(); bot.castWheels(w.arena);
  player.resetState(new V3(0, 0.02, 8), new Quat(), 100);
  player.body.vel.zero(); player.body.angVel.zero(); player.castWheels(w.arena);
  w.ball.body.pos.set(0, R, 0);
  w.ball.body.vel.zero(); w.ball.body.angVel.zero();
  w.ball.lastTouch = -1; w.ball.lastTouchTeam = -1;

  var playerDemos = 0, playerBumps = 0, botTouches = 0;
  var prevTouch = -1;
  var origHandle = w.handleContacts.bind(w);
  w.handleContacts = function () {
    for (var i = 0; i < this.contacts.length; i++) {
      var c = this.contacts[i];
      if (!c) continue;
      if (c.type === 'carCar') {
        var a = this.cars[c.car], b = this.cars[c.other];
        if ((a && a.isPlayer) || (b && b.isPlayer)) playerBumps++;
      } else if (c.type === 'demo') {
        var v = this.cars[c.other];
        if (v && v.isPlayer) playerDemos++;
      }
    }
    origHandle();
  };

  var dt = 1 / 60, frames = Math.round(minutes * 60 * 60);
  for (var f = 0; f < frames; f++) {
    w.step(dt);
    if (w.state === 'GAMEOVER') break;
    if (w.ball.lastTouch === bot.index && prevTouch !== bot.index) botTouches++;
    prevTouch = w.ball.lastTouch;
  }
  Math.random = ORIG;
  return { playerBumps: playerBumps, playerDemos: playerDemos, botTouches: botTouches, score: w.score.slice() };
}

var mins = parseFloat(process.argv[2] || '1');
console.log('idle player parked in front of the ball; bot charges (' + mins + ' min each)');
for (var lv = 0; lv < AI_LEVELS.length; lv++) {
  var pb = 0, pd = 0, bt = 0;
  for (var s = 0; s < 3; s++) {
    var r = duel(lv, mins, 7000 + s * 91);
    pb += r.playerBumps; pd += r.playerDemos; bt += r.botTouches;
  }
  console.log('  L' + lv + ' ' + (AI_LEVELS[lv].name + '        ').slice(0, 11) +
    ' bumps ' + String(pb).padStart(3) +
    '   demos ' + String(pd).padStart(3) +
    '   botTouches ' + String(bt).padStart(3));
}
