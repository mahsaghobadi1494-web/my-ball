/* tools/miss.mjs — HOW do shots miss?
 *
 * quality.mjs established the bottleneck: only ~22% of shots are on target,
 * but ~70% of on-target shots score. So the whole game is won or lost on
 * placement. This classifies every miss so the fix can be targeted instead of
 * guessed at:
 *
 *   ON      inside the mouth
 *   WIDE    |x| beyond the post
 *   HIGH    over the bar
 *   BLOCKED a defender is standing in the corridor (not really a miss)
 *
 * It also reports the distance the shot was taken from, because long-range
 * shots being hopeless is a different problem from close-range aim being bad.
 *
 *   node tools/miss.mjs [tier] [matches] [minutes]
 */
import { World } from '../src/game/world.js';
import { CFG } from '../src/game/config.js';
import { TEAM } from '../src/game/config.js';

var HZ = CFG.arena.hz, GHW = CFG.arena.goalHalfW, GH = CFG.arena.goalHeight;
var G = (CFG.physics && CFG.physics.gravity) ? CFG.physics.gravity : 9.8;
var SHOT_V = 12, COOLDOWN = 1.2;

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

var TIER = parseInt(process.argv[2] || '4', 10);
var MATCHES = parseInt(process.argv[3] || '12', 10);
var MINS = parseFloat(process.argv[4] || '4');

var cat = { ON: 0, WIDE: 0, HIGH: 0, LOW: 0, BLOCKED: 0 };
var attCat = { ON: 0, WIDE: 0, HIGH: 0, LOW: 0, BLOCKED: 0 };
var att = [0];
var pxErr = [], dists = [], buckets = { '0-25': [0, 0], '25-45': [0, 0], '45-65': [0, 0], '65+': [0, 0] };

for (var m = 0; m < MATCHES; m++) {
  seedRandom(5000 + m * 131);
  var cfg = JSON.parse(JSON.stringify(CFG));
  var w = new World(cfg, null, null, null);
  w.initMatch(2, -1, 2);
  for (var i = 0; i < w.ai.length; i++) { w.ai[i].forcedLevel = TIER; w.ai[i].refreshSkill(); }
  w.matchTime = MINS * 60; cfg.match.duration = MINS * 60;

  var cool = [0, 0];
  var frames = Math.round(MINS * 60 * 60);
  for (var f = 0; f < frames; f++) {
    var dt = 1 / 60;
    w.step(dt);
    var b = w.ball.body;
    cool[0] -= dt; cool[1] -= dt;
    for (var s = 0; s < 2; s++) {
      var sgn = (s === TEAM.PULSE) ? 1 : -1, goalZ = sgn * HZ;
      if (cool[s] > 0) continue;
      if (b.vel.z * sgn < SHOT_V) continue;
      if ((b.pos.z - (-sgn * HZ)) * sgn < HZ * 0.4) continue;
      cool[s] = COOLDOWN;

      var tt = (goalZ - b.pos.z) / b.vel.z;
      if (tt <= 0 || tt > 4.0) continue;
      var px = b.pos.x + b.vel.x * tt;
      var pyRaw = b.pos.y + b.vel.y * tt - 0.5 * G * tt * tt;
      // A rolling ball cannot sink below its own radius. Without this clamp a
      // ground ball projected 2 s ahead reads as y = -17 and gets filed as a
      // miss, when it is actually rolling straight at the mouth.
      var R = CFG.ball.radius;
      var py = Math.max(pyRaw, R);
      var dist = Math.abs(goalZ - b.pos.z);
      dists.push(dist);
      var key = dist < 25 ? '0-25' : dist < 45 ? '25-45' : dist < 65 ? '45-65' : '65+';
      // Real shooting only happens from the attacking half. Beyond ~55% depth
      // the "shots" are defensive hoofs, and a long ball down the middle
      // projects through the mouth by pure coincidence.
      var attacking = ((b.pos.z - (-sgn * HZ)) * sgn) > HZ * 0.55;
      if (attacking) att[0]++;

      // Corridor block: any opponent near the ball->goal line.
      var blocked = false;
      var ux = (0 - b.pos.x), uz = (goalZ - b.pos.z);
      var ul = Math.sqrt(ux * ux + uz * uz) || 1; ux /= ul; uz /= ul;
      for (var j = 0; j < w.cars.length; j++) {
        var o = w.cars[j];
        if (o.team === s || o.demolished) continue;
        var ox = o.body.pos.x - b.pos.x, oz = o.body.pos.z - b.pos.z;
        var along = ox * ux + oz * uz;
        if (along < 0 || along > ul) continue;
        if (Math.abs(ox * -uz + oz * ux) < 3.2) { blocked = true; break; }
      }

      var isOn = Math.abs(px) <= GHW && py <= GH && py > -1.5;
      var c;
      if (isOn) c = 'ON';
      else if (Math.abs(px) > GHW) { c = 'WIDE'; pxErr.push(Math.abs(px) - GHW); }
      else if (py > GH) c = 'HIGH';
      else c = 'LOW';
      if (!isOn && blocked) c = 'BLOCKED';
      cat[c]++;
      if (attacking) { attCat[c]++; if (isOn) att[1] = (att[1] || 0) + 1; }
      if (key) { buckets[key][0]++; if (isOn) buckets[key][1]++; }
    }
    if (w.state === 'GAMEOVER') break;
  }
}
Math.random = ORIG;

var total = 0; for (var k in cat) total += cat[k];
var pct = function (v) { return total ? (100 * v / total).toFixed(1) + '%' : '0%'; };
console.log('SHOT OUTCOMES  tier ' + TIER + '  ' + MATCHES + ' matches x ' + MINS + ' min   (' + total + ' shots)');
console.log('   ON       ' + String(cat.ON).padStart(5) + '   ' + pct(cat.ON));
console.log('   WIDE     ' + String(cat.WIDE).padStart(5) + '   ' + pct(cat.WIDE));
console.log('   HIGH     ' + String(cat.HIGH).padStart(5) + '   ' + pct(cat.HIGH));
console.log('   LOW      ' + String(cat.LOW).padStart(5) + '   ' + pct(cat.LOW));
console.log('   BLOCKED  ' + String(cat.BLOCKED).padStart(5) + '   ' + pct(cat.BLOCKED));
var mean = function (a) { if (!a.length) return 0; var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s / a.length; };
console.log('');
console.log('  --- attacking-half shots only (the ones that matter) ---');
var at = 0; for (var q in attCat) at += attCat[q];
for (var q2 in attCat) console.log('   ' + (q2 + '        ').slice(0, 9) + String(attCat[q2]).padStart(5) + '   ' + (at ? (100 * attCat[q2] / at).toFixed(1) + '%' : '0%'));
console.log('   attacking-half on-target rate: ' + (at ? (100 * attCat.ON / at).toFixed(1) + '%' : '-') + '  (' + attCat.ON + '/' + at + ')');
console.log('   mean |x| beyond post on WIDE shots: ' + mean(pxErr).toFixed(2) + ' m');
console.log('   mean shot distance: ' + mean(dists).toFixed(1) + ' m');
console.log('   on-target rate by shot distance:');
for (var bk in buckets) {
  var t2 = buckets[bk];
  console.log('      ' + (bk + '      ').slice(0, 7) + (t2[0] ? (100 * t2[1] / t2[0]).toFixed(1) + '%' : '-') + '   (' + t2[1] + '/' + t2[0] + ')');
}
