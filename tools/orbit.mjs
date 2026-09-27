/* tools/orbit.mjs — measure the two reported symptoms directly.
 *
 *  1. "when the ball just sits somewhere, the cars circle it a lot and never
 *     strike it"
 *  2. "teammates keep bumping into each other and don't notice their partner"
 *
 * Method: park the ball AT REST at a spot, then let the match run FREE for
 * FREE_SECONDS (no pinning - a pinned ball would let the bots rack up grazes
 * against an immovable object and hide the very problem we are measuring).
 *
 *   tMove     time until the ball is actually STRUCK (|v| > 2.5 m/s). A bot
 *             that circles the ball never produces this; a bot that commits
 *             does, within a couple of seconds.
 *   travel    how far the ball ends up from where it was parked.
 *   ORBIT%    while in the 4..11 m band, the share of a bot's speed that is
 *             TANGENTIAL (around the ball) rather than RADIAL (toward it).
 *             ~40% is a normal approach curve; high values mean circling.
 *             (Raw "radians swept" is unusable - it grows merely from staying
 *             near the ball, so it rewards the stall we want to remove.)
 *   mateHit   hard same-team car-vs-car contacts, and mateClose = number of
 *             times a teammate pair comes inside 4.6 m.
 *
 *   node tools/orbit.mjs [level] [teamSize] [seeds]
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
var NSEED = parseInt(process.argv[4] || '3', 10);

var SPOTS = [
  [0, -30], [-16, -14], [14, 18], [0, 26], [-22, 30], [20, -26],
  [-30, 4], [30, -6], [8, 34], [-9, -36]
];

var R = CFG.ball.radius;
var dt = 1 / 60;
var FREE_SECONDS = 12;
var BAND_LO = 4.0, BAND_HI = 11.0;
var MATE_CLOSE = 4.6;
var STRIKE = 2.5;

function trial(spot, seed) {
  seedRandom(seed);

  var cfg = JSON.parse(JSON.stringify(CFG));
  cfg.match.duration = 600;
  var w = new World(cfg, null, null, null);
  w.initMatch(TS, -1, LV);

  var teamBumps = 0;
  var origHandle = w.handleContacts;
  w.handleContacts = function () {
    for (var i = 0; i < w.contacts.length; i++) {
      var c = w.contacts[i];
      if (!c || c.type !== 'carCar') continue;
      var a = w.cars[c.car], b = w.cars[c.other];
      if (a && b && a.team === b.team) teamBumps++;
    }
    origHandle.call(w);
  };

  var guard = 0;
  while (w.state !== 'PLAYING' && guard++ < 600) w.step(dt);
  if (w.state !== 'PLAYING') return null;
  for (var f = 0; f < 90; f++) w.step(dt);

  var bx = spot[0], bz = spot[1];
  w.ball.body.pos.set(bx, R, bz);
  w.ball.body.vel.zero();
  w.ball.body.angVel.zero();
  w.ball.lastTouch = -1;
  w.ball.lastTouchTeam = -1;

  var bots = w.ai.slice();
  var n = bots.length;
  var vrSum = new Array(n), vtSum = new Array(n);
  for (var i = 0; i < n; i++) { vrSum[i] = 0; vtSum[i] = 0; }

  var tMove = -1, touches = 0, mateClose = 0, contactT = -1, bandEntries = 0;
  var prevClose = {};
  var prevLT = w.ball.lastTouch;
  var wasInBand = new Array(n);
  for (var wi = 0; wi < n; wi++) wasInBand[wi] = false;

  for (var g = 0; g < Math.round(FREE_SECONDS * 60); g++) {
    w.step(dt);
    if (w.state !== 'PLAYING') break;

    if (tMove < 0 && w.ball.body.vel.len() > STRIKE) tMove = g / 60;
    if (w.ball.lastTouch !== prevLT) { prevLT = w.ball.lastTouch; touches++; }

    for (var j = 0; j < n; j++) {
      var B = bots[j].car.body;
      var dx = B.pos.x - bx, dz = B.pos.z - bz;
      var d = Math.sqrt(dx * dx + dz * dz);

      /* time until a bot actually reaches the ball (hull contact distance) */
      if (contactT < 0 && d < 4.15) contactT = g / 60;

      /* how many separate times a bot re-enters the strike band: a bot that
       * commits enters once, a bot that circles enters over and over */
      var inBand = d <= BAND_HI;
      if (inBand && !wasInBand[j]) bandEntries++;
      wasInBand[j] = inBand;

      if (d >= BAND_LO && d <= BAND_HI && d > 1e-4) {
        var rx = dx / d, rz = dz / d;
        vrSum[j] += Math.abs(B.vel.x * rx + B.vel.z * rz);
        vtSum[j] += Math.abs(B.vel.x * -rz + B.vel.z * rx);
      }
    }

    for (var p = 0; p < n; p++) {
      for (var q = p + 1; q < n; q++) {
        if (bots[p].car.team !== bots[q].car.team) continue;
        var ddx = bots[p].car.body.pos.x - bots[q].car.body.pos.x;
        var ddz = bots[p].car.body.pos.z - bots[q].car.body.pos.z;
        var dd = Math.sqrt(ddx * ddx + ddz * ddz);
        var key = p + '_' + q;
        if (dd < MATE_CLOSE) { if (!prevClose[key]) { mateClose++; prevClose[key] = true; } }
        else prevClose[key] = false;
      }
    }
  }

  var bdx = w.ball.body.pos.x - bx, bdz = w.ball.body.pos.z - bz;
  var vrT = vrSum.reduce(function (a, b) { return a + b; }, 0);
  var vtT = vtSum.reduce(function (a, b) { return a + b; }, 0);
  return {
    tMove: tMove, travel: Math.sqrt(bdx * bdx + bdz * bdz), touches: touches,
    contactT: contactT, bandEntries: bandEntries,
    orbit: (vrT + vtT) > 0 ? 100 * vtT / (vrT + vtT) : 0,
    teamBumps: teamBumps, mateClose: mateClose, goals: w.score[0] + w.score[1]
  };
}

var rows = [];
for (var s = 0; s < SPOTS.length; s++) {
  for (var sd = 0; sd < NSEED; sd++) {
    var r = trial(SPOTS[s], 900 + sd * 137 + s * 31);
    if (r) rows.push(r);
  }
}

function stat(arr) {
  var v = arr.filter(function (x) { return x !== null && !isNaN(x); });
  if (!v.length) return { m: NaN, e: NaN };
  var m = v.reduce(function (a, b) { return a + b; }, 0) / v.length;
  if (v.length < 2) return { m: m, e: 0 };
  var ss = 0;
  for (var i = 0; i < v.length; i++) ss += (v[i] - m) * (v[i] - m);
  return { m: m, e: Math.sqrt(ss / (v.length - 1) / v.length) };
}

var never = rows.filter(function (r) { return r.tMove < 0; }).length;
var tm = stat(rows.map(function (r) { return r.tMove < 0 ? null : r.tMove; }));
var ct = stat(rows.map(function (r) { return r.contactT < 0 ? null : r.contactT; }));
var be = stat(rows.map(function (r) { return r.bandEntries; }));
var tr = stat(rows.map(function (r) { return r.travel; }));
var tb = stat(rows.map(function (r) { return r.teamBumps; }));
var mc = stat(rows.map(function (r) { return r.mateClose; }));
var ob = stat(rows.map(function (r) { return r.orbit; }));
var to = stat(rows.map(function (r) { return r.touches; }));

function pad(v, n, d) {
  return (isNaN(v) ? '  n/a' : v.toFixed(d === undefined ? 2 : d)).padStart(n);
}
console.log('=== L' + LV + '  ' + TS + 'v' + TS + '  ' + rows.length + ' trials ('
  + SPOTS.length + ' spots x ' + NSEED + ' seeds), ball parked at rest, '
  + FREE_SECONDS + 's free play ===');
console.log('  contactT  ' + pad(ct.m, 6) + ' +/- ' + pad(ct.e, 5) + ' s      (time for a bot to reach the ball)');
console.log('  tMove     ' + pad(tm.m, 6) + ' +/- ' + pad(tm.e, 5) + ' s      (never struck in ' + never + '/' + rows.length + ')');
console.log('  travel    ' + pad(tr.m, 6, 1) + ' +/- ' + pad(tr.e, 5, 1) + ' m');
console.log('  touches   ' + pad(to.m, 6, 2) + ' +/- ' + pad(to.e, 5, 2));
console.log('  bandEntry ' + pad(be.m, 6, 2) + ' +/- ' + pad(be.e, 5, 2) + '   (re-approaches = circling)');
console.log('  ORBIT%    ' + pad(ob.m, 6, 1) + ' +/- ' + pad(ob.e, 5, 1));
console.log('  teamBumps ' + pad(tb.m, 6, 2) + ' +/- ' + pad(tb.e, 5, 2));
console.log('  mateClose ' + pad(mc.m, 6, 2) + ' +/- ' + pad(mc.e, 5, 2) + '   (mate pair entering 4.6 m)');
Math.random = ORIG;
