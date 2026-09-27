/* tools/bumpdiag.mjs — WHERE do teammates actually collide?
 *
 * Logs the context of every same-team car-vs-car contact and of every close
 * approach (mate pair inside 4.6 m): each bot's state, role and mode at that
 * instant. This tells us whether the cause is a double commit on the ball, two
 * bots in the same support/rotate lane, or an airborne bot that is not being
 * steered by driveTo() at all.
 *
 *   node tools/bumpdiag.mjs [level] [teamSize] [seconds]
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
var TS = parseInt(process.argv[3] || '2', 10);
var SECS = parseInt(process.argv[4] || '12', 10);
var R = CFG.ball.radius, dt = 1 / 60;

var SPOTS = [[0, -30], [-16, -14], [14, 18], [0, 26], [-22, 30], [20, -26],
             [-30, 4], [30, -6], [8, 34], [-9, -36]];

var bumpCtx = {};
var closeCtx = {};
var bumpTotal = 0, closeTotal = 0;

function label(bot) {
  return bot.state + '/' + bot.mode + (bot.role !== undefined ? '/r' + bot.role : '');
}
function bump(o, k) { o[k] = (o[k] || 0) + 1; }

for (var s = 0; s < SPOTS.length; s++) {
  seedRandom(900 + s * 31);
  var cfg = JSON.parse(JSON.stringify(CFG));
  cfg.match.duration = 600;
  var w = new World(cfg, null, null, null);
  w.initMatch(TS, -1, LV);

  var aiOf = {};
  for (var a = 0; a < w.ai.length; a++) aiOf[w.ai[a].car.index] = w.ai[a];

  var origHandle = w.handleContacts;
  w.handleContacts = function () {
    for (var i = 0; i < w.contacts.length; i++) {
      var c = w.contacts[i];
      if (!c || c.type !== 'carCar') continue;
      var A = w.cars[c.car], Bc = w.cars[c.other];
      if (!A || !Bc || A.team !== Bc.team) continue;
      bumpTotal++;
      var la = aiOf[A.index] ? label(aiOf[A.index]) : A.name;
      var lb = aiOf[Bc.index] ? label(aiOf[Bc.index]) : Bc.name;
      var pair = [la, lb].sort().join('  +  ');
      bump(bumpCtx, pair);
      /* was either bot airborne (i.e. NOT steered by driveTo)? */
      if (!A.wheels[0].grounded || !Bc.wheels[0].grounded) bump(bumpCtx, '[AIRBORNE in ' + pair + ']');
    }
    origHandle.call(w);
  };

  var guard = 0;
  while (w.state !== 'PLAYING' && guard++ < 600) w.step(dt);
  if (w.state !== 'PLAYING') continue;
  for (var f = 0; f < 90; f++) w.step(dt);

  var bx = SPOTS[s][0], bz = SPOTS[s][1];
  w.ball.body.pos.set(bx, R, bz);
  w.ball.body.vel.zero();

  var prevClose = {};
  for (var g = 0; g < SECS * 60; g++) {
    w.step(dt);
    if (w.state !== 'PLAYING') break;
    for (var p = 0; p < w.ai.length; p++) {
      for (var q = p + 1; q < w.ai.length; q++) {
        var ba = w.ai[p], bb = w.ai[q];
        if (ba.car.team !== bb.car.team) continue;
        var ddx = ba.car.body.pos.x - bb.car.body.pos.x;
        var ddz = ba.car.body.pos.z - bb.car.body.pos.z;
        var dd = Math.sqrt(ddx * ddx + ddz * ddz);
        var key = p + '_' + q;
        if (dd < 4.6) {
          if (!prevClose[key]) {
            prevClose[key] = true;
            closeTotal++;
            var pair2 = [label(ba), label(bb)].sort().join('  +  ');
            bump(closeCtx, pair2);
            var air = (!ba.car.wheels[0].grounded ? 'A-air ' : '') + (!bb.car.wheels[0].grounded ? 'B-air' : '');
            if (air) bump(closeCtx, '[AIRBORNE ' + air.trim() + '] ' + pair2);
          }
        } else prevClose[key] = false;
      }
    }
  }
}

function dump(title, obj, total) {
  console.log('');
  console.log('=== ' + title + ' (n=' + total + ') ===');
  var keys = Object.keys(obj).sort(function (x, y) { return obj[y] - obj[x]; });
  for (var i = 0; i < keys.length && i < 18; i++) {
    var pct = total > 0 ? (100 * obj[keys[i]] / total).toFixed(0) : '0';
    console.log('  ' + String(obj[keys[i]]).padStart(4) + '  ' + String(pct).padStart(3) + '%  ' + keys[i]);
  }
}

dump('HARD teammate contacts: state/mode/role of both bots', bumpCtx, bumpTotal);
dump('CLOSE teammate approaches (<4.6 m)', closeCtx, closeTotal);
Math.random = ORIG;
