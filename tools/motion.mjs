/* tools/motion.mjs — is the bot actually FAST, and does it use boost?
 *
 * The physics make this the dominant question, and no existing tool measured it:
 *
 *   CFG.vehicle.driveSpeedCap = 18.5   top speed WITHOUT boost
 *   CFG.vehicle.boost.speedCap = 28    top speed WITH boost
 *   CFG.vehicle.boost.consume  = 33.3  boost units per second -> a full tank
 *                                      lasts only 3.0 s
 *
 * So a bot that does not collect pads is permanently capped at 66% of top speed,
 * and a bot that does not spend boost cannot cross the field quickly. "The AI is
 * slow" and "the AI ignores boost pads" are therefore the same complaint, and
 * both are measurable.
 *
 * Reports, per match, over every car of the tier under test:
 *   speed      mean / p95 / max body speed (m/s)
 *   fastFrac   % of frames at >= 90% of maxCarSpeed
 *   cappedFrac % of frames at or below the unboosted cap (i.e. not boosting)
 *   boostLvl   mean boost in the tank, and % of frames with an empty tank
 *   boostHeld  % of frames the boost is actually firing
 *   padPicks   big / small pads collected per match (the refill rate)
 *   dist       metres travelled per match
 *   touches    ball touches per match
 *   attackFrac % of frames spent in ATTACK or SHOOT (vs shadow/rotate/boost)
 *   firstTouch mean seconds from kickoff to the team's first touch
 *
 *   node tools/motion.mjs [tier] [teamSize] [matches] [minutes]
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

var LV = parseInt(process.argv[2] || '4', 10);
var TS = parseInt(process.argv[3] || '3', 10);
var NSEED = parseInt(process.argv[4] || '6', 10);
var MINUTES = parseFloat(process.argv[5] || '3');
var dt = 1 / 60;

var MAXSPD = CFG.physics.maxCarSpeed || 28;
var CAP = CFG.vehicle.driveSpeedCap;
var TANK = CFG.vehicle.boost.max;
var CONSUME = CFG.vehicle.boost.consume;

function match(seed) {
  seedRandom(seed);
  var cfg = JSON.parse(JSON.stringify(CFG));
  cfg.match.duration = MINUTES * 60;
  var w = new World(cfg, null, null, null);
  w.initMatch(TS, -1, LV);

  /* Count pad pickups by wrapping each pad's check(). */
  var bigPicks = 0, smallPicks = 0;
  for (var pi = 0; pi < w.pads.length; pi++) {
    (function (pad) {
      var orig = pad.check.bind(pad);
      pad.check = function (car) {
        var got = orig(car);
        if (got) { if (pad.big) bigPicks++; else smallPicks++; }
        return got;
      };
    })(w.pads[pi]);
  }

  var frames = 0;
  var sumSpd = 0, maxSpd = 0, nFast = 0, nCapped = 0;
  var sumBoost = 0, nEmpty = 0, nHeld = 0, nCars = 0;
  var sumDist = 0, nAttack = 0, nThrottle = 0;
  var nHe = 0, nHard = 0, nAligned = 0;
  /* steering-stability accumulators: is the hard turning an OSCILLATION (the
   * bot fighting itself) or genuine tracking of a fast-moving target? */
  var prevSteer = [], prevHe = [], prevState = [];
  var nSteerFrames = 0, nSat = 0, nFlip = 0, nDSteer = 0, nStateSw = 0;
  var sumDSteer = 0, sumDHe = 0, nDHe = 0;
  var speeds = [];
  var prevPos = null;
  var firstTouch = -1;
  var startedAt = -1;

  var total = Math.round((MINUTES * 60 + 25) * 60);
  for (var f = 0; f < total; f++) {
    w.step(dt);
    if (w.state === 'GAMEOVER') break;
    if (startedAt < 0 && w.state === 'PLAYING') startedAt = w.time;
    if (w.state !== 'PLAYING') { prevPos = null; prevSteer = []; prevHe = []; prevState = []; continue; }

    frames++;
    var cars = w.cars;
    for (var ci = 0; ci < cars.length; ci++) {
      var c = cars[ci];
      if (c.demolished) continue;
      var sp = c.speed();
      sumSpd += sp; nCars++;
      if (sp > maxSpd) maxSpd = sp;
      speeds.push(sp);
      if (sp >= MAXSPD * 0.9) nFast++;
      if (sp <= CAP + 0.6) nCapped++;
      sumBoost += c.boost;
      if (c.boost <= 0.01) nEmpty++;
      if (c.boostActive) nHeld++;
      if (c.input && c.input.throttle > 0.95) nThrottle++;

      /* How hard is the bot yanking the wheel? A car in a large heading error
       * cannot build speed, so this is the metric that explains a low mean speed
       * when full throttle is already ~96%. */
      var ai = null;
      for (var a = 0; a < w.ai.length; a++) if (w.ai[a].car === c) { ai = w.ai[a]; break; }
      if (ai) {
        if (ai.state === 'ATTACK' || ai.state === 'SHOOT') nAttack++;
        var he = Math.abs(ai.headingError(ai.target));
        nHe++;
        if (he > 0.9) nHard++;
        if (he < 0.1) nAligned++;

        var st = c.input ? c.input.steer : 0;
        var heS = ai.headingError(ai.target);
        nSteerFrames++;
        if (Math.abs(st) >= 0.99) nSat++;
        if (prevSteer[ci] !== undefined) {
          sumDSteer += Math.abs(st - prevSteer[ci]); nDSteer++;
          if (Math.abs(st) > 0.05 && Math.abs(prevSteer[ci]) > 0.05 &&
              (st > 0) !== (prevSteer[ci] > 0)) nFlip++;
        }
        if (prevHe[ci] !== undefined) {
          var dh = heS - prevHe[ci];
          while (dh > Math.PI) dh -= 2 * Math.PI;
          while (dh < -Math.PI) dh += 2 * Math.PI;
          sumDHe += Math.abs(dh); nDHe++;
        }
        if (prevState[ci] !== undefined && prevState[ci] !== ai.state) nStateSw++;
        prevSteer[ci] = st; prevHe[ci] = heS; prevState[ci] = ai.state;
      }
    }

    /* distance: sum of per-car horizontal displacement between frames */
    if (prevPos) {
      for (var dj = 0; dj < cars.length; dj++) {
        var p0 = prevPos[dj], p1 = cars[dj].body.pos;
        if (!p0) continue;
        var dx = p1.x - p0.x, dz = p1.z - p0.z;
        sumDist += Math.sqrt(dx * dx + dz * dz);
      }
    }
    prevPos = cars.map(function (c) { return { x: c.body.pos.x, z: c.body.pos.z }; });

    if (firstTouch < 0 && w.ball.lastTouch >= 0 && startedAt >= 0) {
      firstTouch = w.ball.lastTouchTime - startedAt;
    }
  }

  speeds.sort(function (a, b) { return a - b; });
  var p95 = speeds.length ? speeds[Math.floor(speeds.length * 0.95)] : 0;

  return {
    meanSpd: nCars ? sumSpd / nCars : 0,
    p95: p95, maxSpd: maxSpd,
    fastFrac: nCars ? 100 * nFast / nCars : 0,
    cappedFrac: nCars ? 100 * nCapped / nCars : 0,
    boostLvl: nCars ? sumBoost / nCars : 0,
    emptyFrac: nCars ? 100 * nEmpty / nCars : 0,
    heldFrac: nCars ? 100 * nHeld / nCars : 0,
    bigPicks: bigPicks, smallPicks: smallPicks,
    dist: sumDist, touches: w.ball.touchCount !== undefined ? w.ball.touchCount : -1,
    attackFrac: nCars ? 100 * nAttack / nCars : 0,
    turnFrac: nHe ? 100 * nHard / nHe : 0,
    alignFrac: nHe ? 100 * nAligned / nHe : 0,
    throttleFrac: nCars ? 100 * nThrottle / nCars : 0,
    steerSat: nSteerFrames ? 100 * nSat / nSteerFrames : 0,
    steerFlip: nDSteer ? nFlip / (nDSteer / 60) : 0,
    steerRate: nDSteer ? 60 * sumDSteer / nDSteer : 0,
    heRate: nDHe ? 60 * sumDHe / nDHe : 0,
    stateSw: nSteerFrames ? nStateSw / (nSteerFrames / 60) : 0,
    firstTouch: firstTouch
  };
}

var rows = [];
for (var s = 0; s < NSEED; s++) rows.push(match(4200 + s * 137));

function stat(k, dec) {
  var v = rows.map(function (r) { return r[k]; }).filter(function (x) { return x !== null && x >= 0; });
  if (!v.length) return { m: 0, e: 0 };
  var m = v.reduce(function (a, b) { return a + b; }, 0) / v.length;
  var ss = 0;
  for (var i = 0; i < v.length; i++) ss += (v[i] - m) * (v[i] - m);
  return { m: m, e: v.length > 1 ? Math.sqrt(ss / (v.length - 1) / v.length) : 0 };
}
function pad(v, n, d) { return v.toFixed(d === undefined ? 1 : d).padStart(n); }

console.log('=== L' + LV + '  ' + TS + 'v' + TS + '  ' + NSEED + ' matches x ' + MINUTES + ' min ===');
console.log('    caps: unboosted ' + CAP + ' m/s, boosted ' + CFG.vehicle.boost.speedCap +
            ' m/s, tank ' + TANK + ' drains in ' + (TANK / CONSUME).toFixed(1) + ' s');
var ms = stat('meanSpd'), p9 = stat('p95'), mx = stat('maxSpd');
console.log('  speed      mean ' + pad(ms.m, 5) + '  p95 ' + pad(p9.m, 5) + '  max ' + pad(mx.m, 5) + ' m/s');
console.log('  fastFrac   ' + pad(stat('fastFrac').m, 5) + ' +/- ' + pad(stat('fastFrac').e, 4) + ' %   (>=90% of top speed)');
console.log('  cappedFrac ' + pad(stat('cappedFrac').m, 5) + ' +/- ' + pad(stat('cappedFrac').e, 4) + ' %   (at/below the UNBOOSTED cap)');
console.log('  boostLvl   ' + pad(stat('boostLvl').m, 5) + '   empty tank ' + pad(stat('emptyFrac').m, 5) + ' % of frames');
console.log('  boostHeld  ' + pad(stat('heldFrac').m, 5) + ' +/- ' + pad(stat('heldFrac').e, 4) + ' %   (boost actually firing)');
console.log('  padPicks   big ' + pad(stat('bigPicks').m, 4) + '  small ' + pad(stat('smallPicks').m, 5) + '   per match');
console.log('  dist       ' + pad(stat('dist').m, 7, 0) + ' m per match (all cars)');
console.log('  attackFrac ' + pad(stat('attackFrac').m, 5) + ' +/- ' + pad(stat('attackFrac').e, 4) + ' %   (state ATTACK/SHOOT)');
console.log('  turnFrac   ' + pad(stat('turnFrac').m, 5) + ' +/- ' + pad(stat('turnFrac').e, 4) + ' %   (|heading err| > 0.9 rad - cannot build speed)');
console.log('  alignFrac  ' + pad(stat('alignFrac').m, 5) + ' +/- ' + pad(stat('alignFrac').e, 4) + ' %   (|heading err| < 0.1 rad)');
console.log('  throttle   ' + pad(stat('throttleFrac').m, 5) + ' %   (full throttle)');
console.log('  steerSat   ' + pad(stat('steerSat').m, 5) + ' %   (|steer| at full lock)');
console.log('  steerFlip  ' + pad(stat('steerFlip').m, 5, 1) + ' /s  (steer sign reversals)');
console.log('  steerRate  ' + pad(stat('steerRate').m, 5, 2) + ' /s  (mean |d steer|/dt, full scale = 2)');
console.log('  heRate     ' + pad(stat('heRate').m, 5, 2) + ' rad/s (how fast the target direction swings)');
console.log('  stateSw    ' + pad(stat('stateSw').m, 5, 2) + ' /s  (state changes per car)');
console.log('  firstTouch ' + pad(stat('firstTouch').m, 5, 2) + ' +/- ' + pad(stat('firstTouch').e, 4) + ' s   (kickoff -> first touch)');
Math.random = ORIG;
