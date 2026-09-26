/* tools/diag.mjs — deep diagnostic on a single bot-vs-bot match.
 * Answers: do bots reach the ball? do they touch it? where does the ball sit?
 * what states do they spend time in? are they actually moving?
 */
import { World } from '../src/game/world.js';
import { CFG } from '../src/game/config.js';
import { AI_LEVELS } from '../src/game/ai.js';

var ORIG = Math.random;
function seedRandom(seed) {
  var s = seed >>> 0;
  Math.random = function () {
    s = (s + 0x6D2B79F5) >>> 0;
    var t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function run(level, teamSize, minutes, seed) {
  seedRandom(seed);
  var cfg = JSON.parse(JSON.stringify(CFG));
  var w = new World(cfg, null, null, null);
  w.initMatch(teamSize, -1, level);
  w.state = 'PLAYING'; w.stateTimer = 0;
  w.matchTime = minutes * 60; cfg.match.duration = minutes * 60;

  var frames = Math.round(minutes * 60 * 60);
  var dt = 1 / 60;

  var near = { '2': 0, '5': 0, '10': 0, '99': 0 };
  var carSpeedSum = 0, carSpeedN = 0;
  var zeroSpeedFrames = 0, carFrameN = 0;
  var ballStuckHigh = 0, ballStuckWall = 0;
  var stateCount = {};
  var boostSum = 0;
  var lastBall = { x: 0, y: 0, z: 0 };
  var ballMoveSum = 0;
  var touchChanges = 0, prevTouch = -1;
  var ballXSum = 0, ballYSum = 0, ballZSum = 0;
  var maxBallSpeed = 0, bigSpeed = 0;
  var airborneBots = 0, botFrameN = 0;
  var airWhy = { aerial: 0, dribble: 0, flip: 0, other: 0 };
  var launches = { aerial: 0, dribble: 0, flip: 0 };
  var prevAir = {}, prevFlip = {}, prevDrib = {};
  var airSamp = null;

  for (var f = 0; f < frames; f++) {
    w.step(dt);
    if (w.state === 'GAMEOVER') break;

    var bp = w.ball.body.pos;
    ballXSum += Math.abs(bp.x); ballYSum += bp.y; ballZSum += bp.z;
    var bs = w.ball.body.vel.len();
    if (bs > maxBallSpeed) maxBallSpeed = bs;
    if (bs > 34) bigSpeed++;
    ballMoveSum += Math.hypot(bp.x - lastBall.x, bp.y - lastBall.y, bp.z - lastBall.z);
    lastBall.x = bp.x; lastBall.y = bp.y; lastBall.z = bp.z;

    if (bp.y > CFG.arena.height - 5) ballStuckHigh++;
    if (Math.abs(bp.x) > CFG.arena.hx - 4) ballStuckWall++;

    var best = 1e9;
    for (var i = 0; i < w.cars.length; i++) {
      var car = w.cars[i];
      if (car.demolished) continue;
      var d = Math.hypot(car.body.pos.x - bp.x, car.body.pos.y - bp.y, car.body.pos.z - bp.z);
      if (d < best) best = d;
      var sp = car.body.vel.len();
      carSpeedSum += sp; carSpeedN++;
      if (sp < 0.6) zeroSpeedFrames++;
      carFrameN++;
      if (!car.grounded) airborneBots++;
      botFrameN++;
      boostSum += car.boost;
    }
    if (best < 2) near['2']++;
    else if (best < 5) near['5']++;
    else if (best < 10) near['10']++;
    else near['99']++;

    for (var a = 0; a < w.ai.length; a++) {
      var bot = w.ai[a];
      var s = bot.state || '?';
      stateCount[s] = (stateCount[s] || 0) + 1;
      var key = 'b' + a;
      if (bot.airTimer > 0 && prevAir[key] <= 0) launches.aerial++;
      if (bot.dribbleTime > 0 && prevDrib[key] <= 0) launches.dribble++;
      if (bot.wantFlip && prevFlip[key] !== true) launches.flip++;
      prevAir[key] = bot.airTimer; prevDrib[key] = bot.dribbleTime; prevFlip[key] = bot.wantFlip;
      var c2 = bot.car;
      if (!c2.grounded) {
        if (bot.airTimer > 0) airWhy.aerial++;
        else if (bot.dribbleTime > 0) airWhy.dribble++;
        else if (c2.dodgeTimer > 0 || c2.flipping) airWhy.flip++;
        else {
          airWhy.other++;
          if (!airSamp) airSamp = [];
          if (airSamp.length < 4000) {
            airSamp.push([c2.body.pos.x, c2.body.pos.y, c2.body.pos.z,
                          c2.body.vel.y, c2.airTime || 0,
                          Math.abs(c2.body.pos.x) / CFG.arena.hx,
                          Math.abs(c2.body.pos.z) / CFG.arena.hz]);
          }
        }
      }
    }

    if (w.ball.lastTouch !== prevTouch) { touchChanges++; prevTouch = w.ball.lastTouch; }
  }

  var n = Math.max(1, f);
  var out = [];
  out.push('=== L' + level + ' ' + AI_LEVELS[level].name + ' ' + teamSize + 'v' + teamSize +
    '  ' + minutes + 'min  seed ' + seed + ' ===');
  out.push('  score           ' + w.score[0] + '-' + w.score[1]);
  out.push('  touchChanges    ' + touchChanges);
  out.push('  nearestBotToBall  <2m ' + (100 * near['2'] / n).toFixed(0) + '%   <5m ' +
    (100 * near['5'] / n).toFixed(0) + '%   <10m ' + (100 * near['10'] / n).toFixed(0) +
    '%   >10m ' + (100 * near['99'] / n).toFixed(0) + '%');
  out.push('  avgCarSpeed     ' + (carSpeedSum / Math.max(1, carSpeedN)).toFixed(2) +
    '   idleFrames ' + (100 * zeroSpeedFrames / Math.max(1, carFrameN)).toFixed(0) + '%');
  out.push('  botAirborne     ' + (100 * airborneBots / Math.max(1, botFrameN)).toFixed(0) + '%' +
    '   avgBoost ' + (boostSum / Math.max(1, carFrameN)).toFixed(0));
  out.push('  ball |X| avg    ' + (ballXSum / n).toFixed(1) + '   Y avg ' + (ballYSum / n).toFixed(1) +
    '   Z avg ' + (ballZSum / n).toFixed(1));
  out.push('  ball move/frame ' + (ballMoveSum / n).toFixed(3) + '   maxBallSpd ' + maxBallSpeed.toFixed(1) +
    '   frames>34 ' + (100 * bigSpeed / n).toFixed(1) + '%');
  out.push('  ball highFrames ' + (100 * ballStuckHigh / n).toFixed(0) + '%   wallHugFrames ' +
    (100 * ballStuckWall / n).toFixed(0) + '%');
  out.push('  airFrames     aerial ' + (100 * airWhy.aerial / Math.max(1, botFrameN)).toFixed(0) +
    '%  dribble ' + (100 * airWhy.dribble / Math.max(1, botFrameN)).toFixed(0) +
    '%  flip ' + (100 * airWhy.flip / Math.max(1, botFrameN)).toFixed(0) +
    '%  other ' + (100 * airWhy.other / Math.max(1, botFrameN)).toFixed(0) + '%');
  if (airSamp && airSamp.length) {
    var nS = airSamp.length;
    var my = 0, mv = 0, mt = 0, mx = 0, mz = 0, hi = 0;
    for (var q = 0; q < nS; q++) { my += airSamp[q][1]; mv += airSamp[q][3]; mt += airSamp[q][4]; mx += airSamp[q][5]; mz += airSamp[q][6]; if (airSamp[q][1] > 4) hi++; }
    out.push('  "other" air: avgY ' + (my/nS).toFixed(2) + '  avgVelY ' + (mv/nS).toFixed(2) +
      '  avgAirTime ' + (mt/nS).toFixed(2) + 's  |x|/hx ' + (mx/nS).toFixed(2) +
      '  |z|/hz ' + (mz/nS).toFixed(2) + '  framesY>4 ' + (100*hi/nS).toFixed(0) + '%');
  }
  out.push('  launches/min  aerial ' + (launches.aerial / mins).toFixed(1) +
    '   dribble ' + (launches.dribble / mins).toFixed(1) +
    '   flip ' + (launches.flip / mins).toFixed(1));
  var states = Object.keys(stateCount).sort(function (a, b) { return stateCount[b] - stateCount[a]; });
  out.push('  states          ' + states.map(function (s) {
    return s + ' ' + (100 * stateCount[s] / Math.max(1, w.ai.length * n)).toFixed(0) + '%';
  }).join('  '));
  console.log(out.join('\n'));
  Math.random = ORIG;
}

var level = parseInt(process.argv[2] || '2', 10);
var ts = parseInt(process.argv[3] || '2', 10);
var mins = parseFloat(process.argv[4] || '2');
var seed = parseInt(process.argv[5] || '777', 10);
run(level, ts, mins, seed);
