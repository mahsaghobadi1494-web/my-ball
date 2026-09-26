/* =============================================================================
 *  tools/sim.mjs — headless match simulator / AI regression harness
 *
 *  Runs full bot-vs-bot matches against the REAL physics + REAL AI modules
 *  (no rendering, no audio) and prints a quality report.
 *
 *  Usage:
 *    node tools/sim.mjs                 # every level, 2v2, 3 min each
 *    node tools/sim.mjs 4 3 4           # level 4, 3v3, 4 minutes
 *    node tools/sim.mjs --matrix        # full level x team-size sweep
 * ============================================================================= */
import { World } from '../src/game/world.js';
import { CFG } from '../src/game/config.js';
import { AI_LEVELS } from '../src/game/ai.js';

var ORIG_RANDOM = Math.random;
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

export function runMatch(level, teamSize, minutes, seed, opts) {
  opts = opts || {};
  seedRandom(seed === undefined ? 12345 : seed);
  var cfg = JSON.parse(JSON.stringify(CFG));
  var w = new World(cfg, null, null, null);
  var playerTeam = opts.player ? 0 : -1;
  w.initMatch(teamSize, playerTeam, level);
  w.state = 'PLAYING';
  w.stateTimer = 0;
  w.matchTime = minutes * 60;
  cfg.match.duration = minutes * 60;

  // --- instrumentation ------------------------------------------------------
  var st = {
    level: level, teamSize: teamSize, minutes: minutes,
    score: [0, 0],
    ownGoals: [0, 0],
    touches: [0, 0],
    aerialHits: [0, 0],
    flipHits: [0, 0],
    demos: [0, 0],
    demosTaken: [0, 0],
    passes: [0, 0],
    passFail: [0, 0],
    possession: [0, 0],
    shots: [0, 0],
    ballSpeedSum: 0, ballSpeedN: 0,
    ballAirFrames: 0, frames: 0,
    ballZSum: 0,
    teammateMinDistSum: 0, teammateMinDistN: 0,
    goalMouthCampFrames: 0,
    playerHits: 0,
    playerDemos: 0,
    ceilingFrames: 0,
    stuckFrames: 0,
    maxBallSpeed: 0,
    lastTouch: -1,
    lastTouchPos: null,
    touchChain: []
  };

  var origHandle = w.handleContacts.bind(w);
  w.handleContacts = function () {
    for (var i = 0; i < this.contacts.length; i++) {
      var c = this.contacts[i];
      if (!c) continue;
      if (c.type === 'ballCar') {
        var car = this.cars[c.car];
        if (!car) continue;
        if (!car.grounded && c.pos && c.pos.y > 2.6) st.aerialHits[car.team]++;
        if (car.dodgeTimer > 0) st.flipHits[car.team]++;
        if (car.isPlayer) { /* player touch, ignore */ }
      } else if (c.type === 'demo') {
        var atk = this.cars[c.car], vic = this.cars[c.other];
        if (atk && vic) {
          st.demos[atk.team]++;
          st.demosTaken[vic.team]++;
          if (vic.isPlayer) st.playerDemos++;
        }
      } else if (c.type === 'carCar') {
        var a = this.cars[c.car], b = this.cars[c.other];
        if (a && a.isPlayer) st.playerHits++;
        if (b && b.isPlayer) st.playerHits++;
      }
    }
    origHandle();
  };

  var dt = 1 / 60;
  var frames = Math.round(minutes * 60 * 60);
  var prevScore = [0, 0];

  for (var f = 0; f < frames; f++) {
    var before = [w.score[0], w.score[1]];
    var beforeTouch = w.ball.lastTouch;
    w.step(dt);
    if (w.state === 'GAMEOVER') break;

    // goals
    if (w.score[0] !== before[0] || w.score[1] !== before[1]) {
      var scoring = w.score[0] !== before[0] ? 0 : 1;
      var lt = w.ball.lastTouchTeam;
      if (lt >= 0 && lt !== scoring) st.ownGoals[scoring]++;
      st.shots[scoring]++;
      if (w.state === 'GOAL' || w.state === 'REPLAY') { /* state machine handles it */ }
    }

    // touches / possession
    if (w.ball.lastTouch !== beforeTouch) {
      var c = w.cars[w.ball.lastTouch];
      if (c) {
        st.touchChanges = (st.touchChanges||0)+1;
        if (st.lastTouch >= 0 && st.lastTouch !== c.index) {
          var prevCar = w.cars[st.lastTouch];
          if (prevCar && prevCar.team === c.team) {
            // A pass = same-team ball ownership handed over while the two cars
            // are physically apart (i.e. the ball actually travelled).
            var d = Math.hypot(prevCar.body.pos.x - c.body.pos.x,
                               prevCar.body.pos.z - c.body.pos.z);
            if (d > 9.0) {
              st.passes[c.team]++;
              st.passLen = (st.passLen || 0) + d;
            } else st.passFail[c.team]++;
          }
        }
        st.lastTouch = c.index;
      }
    }
    if (w.ball.lastTouchTeam >= 0) st.possession[w.ball.lastTouchTeam]++;

    // ball stats
    var bs = w.ball.body.vel.len();
    st.ballSpeedSum += bs; st.ballSpeedN++;
    if (bs > st.maxBallSpeed) st.maxBallSpeed = bs;
    if (w.ball.body.pos.y > CFG.ball.radius + 1.2) st.ballAirFrames++;
    if (w.ball.body.pos.y > CFG.arena.height - 4) st.ceilingFrames++;
    st.ballZSum += w.ball.body.pos.z;

    // teammate spacing
    for (var t = 0; t < 2; t++) {
      var best = 1e9, n = 0;
      var list = [];
      for (var i = 0; i < w.cars.length; i++) if (w.cars[i].team === t && !w.cars[i].demolished) list.push(w.cars[i]);
      for (var a2 = 0; a2 < list.length; a2++) for (var b2 = a2 + 1; b2 < list.length; b2++) {
        var dd = Math.hypot(list[a2].body.pos.x - list[b2].body.pos.x, list[a2].body.pos.z - list[b2].body.pos.z);
        if (dd < best) best = dd;
      }
      if (list.length > 1) { st.teammateMinDistSum += best; st.teammateMinDistN++; }
    }

    // keeper camping inside the net
    for (var k = 0; k < w.cars.length; k++) {
      var cc = w.cars[k];
      if (cc.demolished) continue;
      if (Math.abs(cc.body.pos.z) > CFG.arena.hz - 1.0 && Math.abs(cc.body.pos.x) < CFG.arena.goalHalfW) st.goalMouthCampFrames++;
      if (Math.abs(cc.body.pos.y) > CFG.arena.height - 2.5) st.stuckFrames++;
    }
    st.frames++;
  }

  for (var ci = 0; ci < w.cars.length; ci++) {
    st.touches[w.cars[ci].team] += w.cars[ci].stats.touches;
  }
  st.score = [w.score[0], w.score[1]];
  st.duration = st.frames / 60;
  Math.random = ORIG_RANDOM;
  return st;
}

export function fmt(st) {
  var mins = st.duration / 60;
  var lv = AI_LEVELS[Math.max(0, Math.min(AI_LEVELS.length - 1, st.level))];
  var per = function (v, arr) { return (arr ? v / mins : v).toFixed(2); };
  var L = [];
  L.push('L' + st.level + ' ' + (lv ? lv.name : '?') + '  ' + st.teamSize + 'v' + st.teamSize +
    '   score ' + st.score[0] + '-' + st.score[1] +
    '  (' + (st.score[0] + st.score[1]) / mins + ' goals/min)');
  L.push('   touches   ' + st.touches[0] + ' / ' + st.touches[1] +
    '   aerial ' + st.aerialHits[0] + '/' + st.aerialHits[1] +
    '   flipHits ' + st.flipHits[0] + '/' + st.flipHits[1]);
  L.push('   passes    ' + st.passes[0] + ' / ' + st.passes[1] +
    '   demos ' + st.demos[0] + '/' + st.demos[1] +
    '   ownGoals ' + st.ownGoals[0] + '/' + st.ownGoals[1]);
  L.push('   possession ' + (100 * st.possession[0] / Math.max(1, st.frames)).toFixed(0) + '% / ' +
    (100 * st.possession[1] / Math.max(1, st.frames)).toFixed(0) + '%' +
    '   avgBallSpd ' + (st.ballSpeedSum / Math.max(1, st.ballSpeedN)).toFixed(1) +
    '   maxBallSpd ' + st.maxBallSpeed.toFixed(1));
  L.push('   ballAir ' + (100 * st.ballAirFrames / Math.max(1, st.frames)).toFixed(0) + '%' +
    '   avgBallZ ' + (st.ballZSum / Math.max(1, st.frames)).toFixed(1) +
    '   teammateGap ' + (st.teammateMinDistSum / Math.max(1, st.teammateMinDistN)).toFixed(1) +
    '   netCamp ' + (100 * st.goalMouthCampFrames / Math.max(1, st.frames * Math.max(1, st.teamSize * 2))).toFixed(1) + '%' +
    '   ceilStuck ' + (100 * st.stuckFrames / Math.max(1, st.frames * Math.max(1, st.teamSize * 2))).toFixed(1) + '%');
  if (st.playerHits !== undefined && st.playerHits > 0) L.push('   playerBumps ' + st.playerHits + '  playerDemos ' + st.playerDemos);
  return L.join('\n');
}

/* ------------------------------------------------------------------ runner */
if (process.argv[1] && process.argv[1].indexOf('sim.mjs') >= 0) {
  var args = process.argv.slice(2);
  if (args[0] === '--matrix') {
    var mins = parseFloat(args[1] || '2');
    for (var lv = 0; lv < AI_LEVELS.length; lv++) {
      for (var ts = 1; ts <= 3; ts++) {
        var r = runMatch(lv, ts, mins, 1000 + ts * 17);
        console.log(fmt(r));
      }
      console.log('');
    }
  } else {
    var level = args[0] !== undefined ? parseInt(args[0], 10) : 2;
    var teamSize = args[1] !== undefined ? parseInt(args[1], 10) : 2;
    var minutes = args[2] !== undefined ? parseFloat(args[2]) : 3;
    var seed = args[3] !== undefined ? parseInt(args[3], 10) : 777;
    console.log(fmt(runMatch(level, teamSize, minutes, seed)));
  }
}
