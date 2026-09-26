/* tools/kickoff.mjs — measure the kickoff, the one fully deterministic phase.
 *
 * Why this tool exists
 * --------------------
 * Every continuous skill field (aimErr, posErr, ctrl, steerK...) feeds the
 * steering math directly, so a 1e-5 change in one of them changes the whole
 * match trajectory. tools/ab.mjs proved this: the learned Legendary genome
 * measured +2.03 goals with 16/16 seeds won at full precision, and -0.76 with
 * 2/16 won after a 0.5% nudge. Numeric tuning of those fields is therefore
 * fitting chaos, not skill.
 *
 * The kickoff is different. world.js freezes every car at a fixed spawn and
 * freezes the ball at centre for the whole COUNTDOWN, then releases all of it
 * on one frame. The first ~4 seconds are a deterministic race to a stationary
 * ball - no chaos amplification, so an improvement here is real and survives
 * perturbation.
 *
 * What it reports, per seed:
 *   firstTouch   seconds from release until the ball is first touched
 *   team         which team got that first touch (0 = PULSE, 1 = VOLT)
 *   ballZ        ball z after the observation window
 *   goal         who scored inside the window, if anyone
 *
 *   node tools/kickoff.mjs [tier] [seeds] [windowSec]
 */
import { World } from '../src/game/world.js';
import { CFG, TEAM } from '../src/game/config.js';

var TIER = parseInt(process.argv[2] || '4', 10);
var SEEDS = parseInt(process.argv[3] || '24', 10);
var WINDOW = parseFloat(process.argv[4] || '12');

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

function one(seed) {
  seedRandom(seed);
  var cfg = JSON.parse(JSON.stringify(CFG));
  cfg.ai.skill = TIER;
  var w = new World(cfg, null, null, null);
  w.initMatch(2, -1, TIER);

  // Burn the countdown without touching the AI's own state machine.
  var t = 0;
  while (w.state === 'COUNTDOWN' && t < 8) { w.step(1 / 60); t += 1 / 60; }

  var frames = Math.round(WINDOW * 60);
  var firstTouch = -1, firstTeam = -1, goal = -1, goalAt = -1;
  var lastTouch = w.ball.lastTouch;
  for (var f = 0; f < frames; f++) {
    w.step(1 / 60);
    if (firstTouch < 0 && w.ball.lastTouch >= 0 && w.ball.lastTouch !== lastTouch) {
      firstTouch = f / 60;
      firstTeam = w.cars[w.ball.lastTouch].team;
      lastTouch = w.ball.lastTouch;
    }
    if (goal < 0 && (w.score[0] > 0 || w.score[1] > 0)) {
      goal = w.score[0] > 0 ? 0 : 1;
      goalAt = f / 60;
    }
    if (w.state === 'GAMEOVER') break;
  }
  var r = { firstTouch: firstTouch, firstTeam: firstTeam, ballZ: w.ball.body.pos.z,
            goal: goal, goalAt: goalAt, score: [w.score[0], w.score[1]] };
  Math.random = ORIG;
  return r;
}

console.log('KICKOFF  tier ' + TIER + '  ' + SEEDS + ' seeds  ' + WINDOW + 's window');
console.log('');
console.log('  seed   firstTouch  team   ballZ   goal   goalAt   score');
var nTouch = 0, pulseFirst = 0, voltFirst = 0, noTouch = 0;
var pulseGoals = 0, voltGoals = 0, tSum = 0;
var zs = [];
for (var s = 0; s < SEEDS; s++) {
  var seed = 5000 + s * 131;
  var r = one(seed);
  if (r.firstTouch < 0) { noTouch++; } else {
    nTouch++; tSum += r.firstTouch;
    if (r.firstTeam === TEAM.PULSE) pulseFirst++; else voltFirst++;
  }
  if (r.goal === TEAM.PULSE) pulseGoals++;
  else if (r.goal === TEAM.VOLT) voltGoals++;
  zs.push(r.ballZ);
  console.log('  ' + String(seed).padStart(5) + '   ' +
    (r.firstTouch < 0 ? '  none  ' : r.firstTouch.toFixed(2).padStart(7)) + '   ' +
    (r.firstTeam < 0 ? ' - ' : (r.firstTeam === TEAM.PULSE ? 'PLS' : 'VLT')) + '   ' +
    r.ballZ.toFixed(1).padStart(6) + '   ' +
    (r.goal < 0 ? ' - ' : (r.goal === TEAM.PULSE ? 'PLS' : 'VLT')) + '    ' +
    (r.goalAt < 0 ? '  -  ' : r.goalAt.toFixed(1).padStart(5)) + '   ' +
    r.score[0] + '-' + r.score[1]);
}
var mz = 0; for (var i = 0; i < zs.length; i++) mz += zs[i]; mz /= zs.length;
console.log('');
console.log('  first touch reached   ' + nTouch + '/' + SEEDS + (noTouch ? '   (NEVER TOUCHED: ' + noTouch + ')' : ''));
console.log('  mean time to touch    ' + (nTouch ? (tSum / nTouch).toFixed(2) : 'n/a') + ' s');
console.log('  won the race          PULSE ' + pulseFirst + '  VOLT ' + voltFirst);
console.log('  goals in window       PULSE ' + pulseGoals + '  VOLT ' + voltGoals +
  '   (total ' + (pulseGoals + voltGoals) + ' in ' + SEEDS + ' kickoffs)');
console.log('  mean ball z at ' + WINDOW + 's   ' + mz.toFixed(1) + ' m  (negative = pinned in PULSE half)');
