/* =============================================================================
 *  tools/bench.mjs — multi-seed AI benchmark.
 *
 *  Single matches are far too noisy to tune against, so this runs every level
 *  across several seeds and averages the result. It also plays tiers against
 *  each other head-to-head, which is the only real proof that "level N+1 is
 *  better than level N" actually holds.
 *
 *  Usage:
 *    node tools/bench.mjs              # full report
 *    node tools/bench.mjs --ladder     # only the head-to-head ladder
 * ============================================================================= */
import { World } from '../src/game/world.js';
import { CFG } from '../src/game/config.js';
import { AI_LEVELS } from '../src/game/ai.js';
import { TEAM } from '../src/game/config.js';

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

function runMatch(levelA, levelB, teamSize, minutes, seed) {
  seedRandom(seed);
  var cfg = JSON.parse(JSON.stringify(CFG));
  var w = new World(cfg, null, null, null);
  w.initMatch(teamSize, -1, 2);
  for (var i = 0; i < w.ai.length; i++) {
    w.ai[i].forcedLevel = (w.ai[i].car.team === TEAM.PULSE) ? levelA : levelB;
    w.ai[i].refreshSkill();
  }
  // NOTE: do not force w.state = 'PLAYING'. world.js only runs kickoff
  // placement during COUNTDOWN and only tests the goal line during PLAYING,
  // so forcing PLAYING from frame 0 yields an inert match (measured: same
  // seeds give 0-0 forced vs 0-3 natural). Leave the natural state flow.
  w.matchTime = minutes * 60; cfg.match.duration = minutes * 60;

  var st = {
    score: [0, 0], ownGoals: [0, 0], touches: [0, 0], passes: [0, 0],
    demos: [0, 0], aerial: [0, 0], flip: [0, 0], possession: [0, 0],
    ballSpd: 0, air: 0, frames: 0, gap: 0, gapN: 0, maxBallSpd: 0, terrA: 0, terrB: 0,
    lastTouch: -1
  };

  var origHandle = w.handleContacts.bind(w);
  w.handleContacts = function () {
    for (var i = 0; i < this.contacts.length; i++) {
      var c = this.contacts[i];
      if (!c) continue;
      if (c.type === 'ballCar') {
        var car = this.cars[c.car];
        if (!car) continue;
        if (!car.grounded && c.pos && c.pos.y > 2.6) st.aerial[car.team]++;
        if (car.dodgeTimer > 0) st.flip[car.team]++;
      } else if (c.type === 'demo') {
        var a = this.cars[c.car], v = this.cars[c.other];
        if (a && v) st.demos[a.team]++;
      }
    }
    origHandle();
  };

  var dt = 1 / 60;
  var frames = Math.round(minutes * 60 * 60);
  for (var f = 0; f < frames; f++) {
    var b0 = w.score[0], b1 = w.score[1];
    var prevTouch = w.ball.lastTouch;
    w.step(dt);
    if (w.state === 'GAMEOVER') break;
    if (w.score[0] !== b0 || w.score[1] !== b1) {
      var scorer = w.score[0] !== b0 ? 0 : 1;
      var lt = w.ball.lastTouchTeam;
      if (lt >= 0 && lt !== scorer) st.ownGoals[scorer]++;
    }
    if (w.ball.lastTouch !== prevTouch) {
      var car = w.cars[w.ball.lastTouch];
      if (car) {
        if (st.lastTouch >= 0 && st.lastTouch !== car.index) {
          var p = w.cars[st.lastTouch];
          if (p && p.team === car.team &&
              Math.hypot(p.body.pos.x - car.body.pos.x, p.body.pos.z - car.body.pos.z) > 9) {
            st.passes[car.team]++;
          }
        }
        st.lastTouch = car.index;
      }
    }
    if (w.ball.lastTouchTeam >= 0) st.possession[w.ball.lastTouchTeam]++;
    var bs = w.ball.body.vel.len();
    st.ballSpd += bs;
    if (bs > st.maxBallSpd) st.maxBallSpd = bs;
    if (w.ball.body.pos.y > CFG.ball.radius + 1.2) st.air++;
    st.terrA += w.ball.body.pos.z; st.terrB -= w.ball.body.pos.z;
    st.frames++;
    for (var t = 0; t < 2; t++) {
      var list = [];
      for (var k = 0; k < w.cars.length; k++) if (w.cars[k].team === t && !w.cars[k].demolished) list.push(w.cars[k]);
      if (list.length > 1) {
        var best = 1e9;
        for (var a2 = 0; a2 < list.length; a2++) for (var b2 = a2 + 1; b2 < list.length; b2++) {
          best = Math.min(best, Math.hypot(list[a2].body.pos.x - list[b2].body.pos.x,
                                           list[a2].body.pos.z - list[b2].body.pos.z));
        }
        st.gap += best; st.gapN++;
      }
    }
  }
  for (var ci = 0; ci < w.cars.length; ci++) st.touches[w.cars[ci].team] += w.cars[ci].stats.touches;
  st.score = [w.score[0], w.score[1]];
  st.mins = st.frames / 60;
  Math.random = ORIG;
  return st;
}

function avg(list, key) {
  var s = 0;
  for (var i = 0; i < list.length; i++) s += list[i][key];
  return s / Math.max(1, list.length);
}

function suite(levelA, levelB, teamSize, minutes, seeds) {
  var res = [];
  for (var s = 0; s < seeds; s++) res.push(runMatch(levelA, levelB, teamSize, minutes, 5000 + s * 131));
  var m = res.length;
  var per = function (k, i) { var v = 0; for (var q = 0; q < m; q++) v += res[q][k][i]; return v / (m * (res[0].mins / 60)); };
  return {
    levelA: levelA, levelB: levelB, teamSize: teamSize,
    goalsFor: per('score', 0), goalsAgainst: per('score', 1),
    touches: (per('touches', 0) + per('touches', 1)) / 2,
    passes: (per('passes', 0) + per('passes', 1)) / 2,
    demos: (per('demos', 0) + per('demos', 1)) / 2,
    aerial: (per('aerial', 0) + per('aerial', 1)) / 2,
    flip: (per('flip', 0) + per('flip', 1)) / 2,
    ownGoals: (per('ownGoals', 0) + per('ownGoals', 1)) / 2,
    possA: avg(res.map(function (r) { return 100 * r.possession[0] / Math.max(1, r.frames); }), 0) ||
           (function () { var v = 0; for (var q = 0; q < m; q++) v += 100 * res[q].possession[0] / Math.max(1, res[q].frames); return v / m; })(),
    ballSpd: (function () { var v = 0; for (var q = 0; q < m; q++) v += res[q].ballSpd / Math.max(1, res[q].frames); return v / m; })(),
    airPct: (function () { var v = 0; for (var q = 0; q < m; q++) v += 100 * res[q].air / Math.max(1, res[q].frames); return v / m; })(),
    gap: (function () { var v = 0; for (var q = 0; q < m; q++) v += res[q].gap / Math.max(1, res[q].gapN); return v / m; })(),
    terr: (function () { var v = 0; for (var q = 0; q < m; q++) v += (res[q].terrA - res[q].terrB) / Math.max(1, res[q].frames); return v / m; })(),
    wins: (function () { var v = 0; for (var q = 0; q < m; q++) if (res[q].score[0] > res[q].score[1]) v++; return v; })(),
    draws: (function () { var v = 0; for (var q = 0; q < m; q++) if (res[q].score[0] === res[q].score[1]) v++; return v; })(),
    n: m
  };
}

function line(r) {
  var name = AI_LEVELS[r.levelA].name + (r.levelA === r.levelB ? '' : ' vs ' + AI_LEVELS[r.levelB].name);
  return (name + '                    ').slice(0, 22) +
    (r.teamSize + 'v' + r.teamSize) +
    '  goals ' + r.goalsFor.toFixed(2) + '-' + r.goalsAgainst.toFixed(2) +
    '  diff ' + (r.goalsFor - r.goalsAgainst >= 0 ? '+' : '') + (r.goalsFor - r.goalsAgainst).toFixed(2) +
    '  W/D/L ' + r.wins + '/' + r.draws + '/' + (r.n - r.wins - r.draws) +
    '\n                       touches ' + r.touches.toFixed(1) +
    '  passes ' + r.passes.toFixed(2) +
    '  demos ' + r.demos.toFixed(2) +
    '  aerial ' + r.aerial.toFixed(2) +
    '  flip ' + r.flip.toFixed(2) +
    '  ownGoal ' + r.ownGoals.toFixed(2) +
    '\n                       poss ' + r.possA.toFixed(0) + '%' +
    '  ballSpd ' + r.ballSpd.toFixed(1) +
    '  ballAir ' + r.airPct.toFixed(0) + '%' +
    '  tmGap ' + r.gap.toFixed(0) +
    '  territory ' + (r.terr >= 0 ? '+' : '') + r.terr.toFixed(1);
}

var arg = process.argv[2] || '';
var SEEDS = 6;

if (arg !== '--ladder') {
  console.log('============ SELF-PLAY (each level vs itself), 2v2, 3 min x ' + SEEDS + ' seeds ============');
  for (var lv = 0; lv < AI_LEVELS.length; lv++) {
    console.log(line(suite(lv, lv, 2, 3, SEEDS)));
  }
  console.log('');
  console.log('============ SELF-PLAY 3v3 ============');
  for (var lv3 = 0; lv3 < AI_LEVELS.length; lv3++) {
    console.log(line(suite(lv3, lv3, 3, 3, SEEDS)));
  }
  console.log('');
}

console.log('============ HEAD-TO-HEAD LADDER (PULSE=row tier vs VOLT=lower tier) ============');
for (var hi = 1; hi < AI_LEVELS.length; hi++) {
  console.log(line(suite(hi, hi - 1, 2, 4, SEEDS)));
}
console.log(line(suite(4, 0, 2, 4, SEEDS)));
