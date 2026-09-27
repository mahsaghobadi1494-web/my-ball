/* tools/mates.mjs — teammate awareness in a FULL match (the user's scenario).
 *
 * The parked-ball orbit test measures "can a bot work a resting ball". This
 * tool measures the other complaint: "teammates keep bumping into each other
 * and don't notice what their partner is doing" during ordinary play.
 *
 * Counts per match:
 *   teamHit   hard same-team car-vs-car contacts
 *   oppHit    hard contacts against the opposition (should stay healthy -
 *             challenging and bumping opponents is part of the game)
 *   matePass  times a teammate pair comes inside 4.6 m
 *   teamStay  frames a teammate pair spends inside 4.6 m (how long they shove)
 *
 *   node tools/mates.mjs [level] [teamSize] [seeds] [minutes]
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
var NSEED = parseInt(process.argv[4] || '8', 10);
var MINUTES = parseFloat(process.argv[5] || '3');
var dt = 1 / 60;

function match(seed) {
  seedRandom(seed);
  var cfg = JSON.parse(JSON.stringify(CFG));
  cfg.match.duration = MINUTES * 60;
  var w = new World(cfg, null, null, null);
  w.initMatch(TS, -1, LV);

  var teamHit = 0, oppHit = 0;
  var origHandle = w.handleContacts;
  w.handleContacts = function () {
    for (var i = 0; i < w.contacts.length; i++) {
      var c = w.contacts[i];
      if (!c || c.type !== 'carCar') continue;
      var a = w.cars[c.car], b = w.cars[c.other];
      if (!a || !b) continue;
      if (a.team === b.team) teamHit++; else oppHit++;
    }
    origHandle.call(w);
  };

  var matePass = 0, teamStay = 0;
  var prevClose = {};
  var frames = Math.round((MINUTES * 60 + 20) * 60);

  for (var f = 0; f < frames; f++) {
    w.step(dt);
    if (w.state === 'GAMEOVER') break;

    for (var p = 0; p < w.ai.length; p++) {
      for (var q = p + 1; q < w.ai.length; q++) {
        var ba = w.ai[p], bb = w.ai[q];
        if (ba.car.team !== bb.car.team) continue;
        var ddx = ba.car.body.pos.x - bb.car.body.pos.x;
        var ddz = ba.car.body.pos.z - bb.car.body.pos.z;
        var dd = Math.sqrt(ddx * ddx + ddz * ddz);
        var key = p + '_' + q;
        if (dd < 4.6) {
          teamStay++;
          if (!prevClose[key]) { matePass++; prevClose[key] = true; }
        } else prevClose[key] = false;
      }
    }
  }

  return { teamHit: teamHit, oppHit: oppHit, matePass: matePass, teamStay: teamStay, goals: w.score[0] + w.score[1] };
}

var rows = [];
for (var s = 0; s < NSEED; s++) rows.push(match(3000 + s * 97));

function stat(k) {
  var v = rows.map(function (r) { return r[k]; });
  var m = v.reduce(function (a, b) { return a + b; }, 0) / v.length;
  var ss = 0;
  for (var i = 0; i < v.length; i++) ss += (v[i] - m) * (v[i] - m);
  return { m: m, e: v.length > 1 ? Math.sqrt(ss / (v.length - 1) / v.length) : 0 };
}
function pad(v, n, d) { return v.toFixed(d === undefined ? 2 : d).padStart(n); }

var th = stat('teamHit'), oh = stat('oppHit'), mp = stat('matePass'),
    st = stat('teamStay'), gl = stat('goals');
console.log('=== L' + LV + '  ' + TS + 'v' + TS + '  ' + NSEED + ' matches x ' + MINUTES + ' min ===');
console.log('  teamHit   ' + pad(th.m, 6) + ' +/- ' + pad(th.e, 5) + '   (same-team contacts per match)');
console.log('  oppHit    ' + pad(oh.m, 6) + ' +/- ' + pad(oh.e, 5) + '   (contacts vs opponents)');
console.log('  matePass  ' + pad(mp.m, 6) + ' +/- ' + pad(mp.e, 5) + '   (mate pair entering 4.6 m)');
console.log('  teamStay  ' + pad(st.m, 6) + ' +/- ' + pad(st.e, 5) + '   (frames inside 4.6 m)');
console.log('  goals     ' + pad(gl.m, 6) + ' +/- ' + pad(gl.e, 5));
Math.random = ORIG;
