/* tools/rtrain.mjs — ROBUST self-play learning.
 *
 * Why this exists (read this before trusting any number it prints)
 * --------------------------------------------------------------
 * train.mjs hill-climbed a genome against a fixed seed set and reported big
 * validated gains. They were not real. tools/ab.mjs measured the best learned
 * Legendary genome at +2.03 goals with 16/16 seeds won - and then, on the SAME
 * seeds, at -0.76 goals with 2/16 won after nudging its own values by 0.5%:
 *
 *     0%    +2.03 +/- 0.25    16/16 seeds won
 *     0.5%  -0.76 +/- 0.18     2/16 seeds won
 *     1.0%  -0.74 +/- 0.16     0/16 seeds won
 *     3.0%  +0.61 +/- 0.16    13/16 seeds won
 *
 * The sign flips non-monotonically with the size of the nudge, which is the
 * signature of pure chaos rather than skill. The simulator is deterministic,
 * so a 1e-5 change in one parameter changes the whole match trajectory; a
 * hill climb that only ever tests single exact values will happily climb onto
 * a knife edge and stay there.
 *
 * Two changes make the objective honest:
 *
 *   1. NEIGHBOURHOOD FITNESS. A candidate is scored as the MEAN over K
 *      perturbed copies of itself (each numeric field scaled by exp(u),
 *      u uniform in +/-jit). A knife-edge genome scores ~0 because its
 *      neighbours are ordinary; only a genome whose whole neighbourhood is
 *      better can win. This is the standard fix for a chaotic objective.
 *
 *   2. LOWER-VARIANCE PRIMARY METRIC. Goals are the thing we care about but
 *      they are far too sparse to steer on: 16 seeds leave a +/-0.25 standard
 *      error and the real top-tier differences are smaller than that, so a
 *      goals-only climb is fitting seed noise. Territory (mean ball z, an
 *      average over ~14,400 frames per match) and shots-on-target carry most
 *      of the gradient; goals stay in the score with a modest weight and are
 *      used for the final accept/reject test.
 *
 *   node tools/rtrain.mjs <chain> <gens> <seeds> <minutes> <out.json> [OPP] [BASE] [jit] [copies]
 */
import { World } from '../src/game/world.js';
import { CFG, TEAM } from '../src/game/config.js';
import { AI_LEVELS } from '../src/game/ai.js';
import fs from 'fs';

var HZ = CFG.arena.hz, GHW = CFG.arena.goalHalfW, GH = CFG.arena.goalHeight;
var GRAV = (CFG.physics && CFG.physics.gravity) ? CFG.physics.gravity : 9.8;
var BR = CFG.ball.radius;

var CHAIN = parseInt(process.argv[2] || '0', 10);
var GENS = parseInt(process.argv[3] || '12', 10);
var SEEDS = parseInt(process.argv[4] || '16', 10);
var MINS = parseFloat(process.argv[5] || '3');
var OUT = process.argv[6] || ('/tmp/rtrain_' + CHAIN + '.json');
var OPPTIER = parseInt(process.argv[7] !== undefined ? process.argv[7] : '4', 10);
var BASETIER = parseInt(process.argv[8] !== undefined ? process.argv[8] : OPPTIER, 10);
var JIT = parseFloat(process.argv[9] !== undefined ? process.argv[9] : '0.02');
var COPIES = parseInt(process.argv[10] !== undefined ? process.argv[10] : '3', 10);

var REF = JSON.parse(JSON.stringify(AI_LEVELS[OPPTIER]));
var GENOME0 = JSON.parse(JSON.stringify(AI_LEVELS[BASETIER]));

var NUMERIC = ['react', 'ctrl', 'horizon', 'steerK', 'speedFrac', 'boost',
  'boostFloor', 'boostDuty', 'aimErr', 'posErr', 'flip', 'shotFlip', 'aerial',
  'airDribble', 'pass', 'demo', 'fake', 'defend', 'rotation', 'recover', 'kickoff'];

// Hard bounds so a mutation cannot wander into a degenerate regime. These are
// deliberately generous - the point of the bounds is only to stop the search
// leaving the physically meaningful range, not to encode any belief about the
// optimum (the knees are what the search is meant to find).
var BOUNDS = {
  react: [0.08, 0.60], ctrl: [0.008, 0.20], horizon: [0.8, 6.0],
  steerK: [0.8, 3.2], speedFrac: [0.45, 0.88], boost: [0.0, 1.2],
  boostFloor: [10, 80], boostDuty: [0.0, 1.0], aimErr: [0.4, 9.0],
  posErr: [0.4, 7.0], flip: [0, 1], shotFlip: [0, 1], aerial: [0, 1],
  airDribble: [0, 1], pass: [0, 1], demo: [0, 1], fake: [0, 1],
  defend: [0, 1], rotation: [0, 1], recover: [0, 1], kickoff: [0, 1]
};
function clampKey(k, v) {
  var b = BOUNDS[k];
  if (!b) return v;
  return Math.min(b[1], Math.max(b[0], v));
}

/* deterministic RNG so a chain is reproducible */
var rseed = (0x9e3779b9 ^ (CHAIN * 2654435761)) >>> 0;
function rnd() {
  rseed = (rseed + 0x6D2B79F5) >>> 0;
  var t = rseed; t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

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

/* Jitter one genome. Copy index c is folded into the seed so copies are
 * reproducible and independent of each other. */
function jitter(g, c) {
  var s = (c * 2654435761 + CHAIN * 40503 + 12345) >>> 0;
  function r() {
    s = (s + 0x6D2B79F5) >>> 0;
    var t = s; t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  var o = JSON.parse(JSON.stringify(g));
  for (var i = 0; i < NUMERIC.length; i++) {
    var k = NUMERIC[i];
    if (typeof o[k] !== 'number') continue;
    o[k] = clampKey(k, o[k] * Math.exp((r() * 2 - 1) * JIT));
  }
  return o;
}

function run(pulseSk, voltSk, seed) {
  seedRandom(seed);
  var cfg = JSON.parse(JSON.stringify(CFG));
  var w = new World(cfg, null, null, null);
  w.initMatch(2, -1, 2);
  for (var i = 0; i < w.ai.length; i++) {
    w.ai[i].sk = (w.ai[i].car.team === TEAM.PULSE) ? pulseSk : voltSk;
    w.ai[i].refreshSkill = function () {};
  }
  w.matchTime = MINS * 60; cfg.match.duration = MINS * 60;
  var frames = Math.round(MINS * 60 * 60), terr = 0, n = 0, onT = 0;
  var cool = [0, 0];
  for (var f = 0; f < frames; f++) {
    var dt = 1 / 60;
    w.step(dt);
    var b = w.ball.body;
    terr += b.pos.z; n++;
    cool[0] -= dt; cool[1] -= dt;
    for (var s = 0; s < 2; s++) {
      var sgn = (s === TEAM.PULSE) ? 1 : -1, goalZ = sgn * HZ;
      if (cool[s] > 0) continue;
      if (b.vel.z * sgn < 12) continue;
      if ((b.pos.z - (-sgn * HZ)) * sgn < HZ * 0.55) continue;
      cool[s] = 1.2;
      var tt = (goalZ - b.pos.z) / b.vel.z;
      if (tt <= 0 || tt > 4) continue;
      var px = b.pos.x + b.vel.x * tt;
      var py = Math.max(b.pos.y + b.vel.y * tt - 0.5 * GRAV * tt * tt, BR);
      if (Math.abs(px) < GHW && py <= GH) onT += (s === TEAM.PULSE ? 1 : -1);
    }
    if (w.state === 'GAMEOVER') break;
  }
  var r = { d: w.score[0] - w.score[1], terr: terr / n, onT: onT };
  Math.random = ORIG;
  return r;
}

/* Neighbourhood-averaged, paired, both-direction fitness.
 * D = (candidate-on-PULSE - candidate-on-VOLT)/2 cancels the PULSE-side field
 * asymmetry (identical genomes score exactly 0). Averaging over K jittered
 * copies makes it a property of the whole neighbourhood rather than of one
 * knife-edge point. */
function fitness(genome) {
  var dg = 0, dt = 0, doT = 0, nm = 0;
  for (var s = 0; s < SEEDS; s++) {
    var seed = 7000 + s * 613;
    for (var c = 0; c < COPIES; c++) {
      var g = (COPIES === 1) ? genome : jitter(genome, c);
      var rr = (COPIES === 1) ? REF : jitter(REF, c);
      var a = run(g, rr, seed);
      var b = run(rr, g, seed);
      dg += (a.d - b.d) / 2; dt += (a.terr - b.terr) / 2; doT += (a.onT - b.onT) / 2;
      nm++;
    }
  }
  var goal = dg / nm, terr = dt / nm, onT = doT / nm;
  // Territory and shots carry most of the gradient (far less seed noise than
  // the ~3 goal events in a match); goals still dominate the weight because
  // they are what the game is scored on.
  return { goal: goal, terr: terr, onT: onT,
    score: goal * 1.0 + terr * 0.06 + onT * 0.12 };
}

console.log('chain ' + CHAIN + '  base tier ' + BASETIER + '  vs tier ' + OPPTIER +
  '   ' + GENS + ' gens x ' + SEEDS + ' seeds x ' + COPIES + ' copies x ' + MINS + ' min' +
  '   jitter +/-' + (JIT * 100).toFixed(1) + '%');
console.log('   seed family 7000+613n (disjoint from ab.mjs 5000+131n and train.mjs 9000+977n)');

var genome = JSON.parse(JSON.stringify(GENOME0));
var best = { fit: fitness(genome), genome: JSON.parse(JSON.stringify(genome)) };
console.log('   gen  0   score ' + best.fit.score.toFixed(3) +
  '   (goals ' + best.fit.goal.toFixed(3) + '  terr ' + best.fit.terr.toFixed(2) +
  '  onT ' + best.fit.onT.toFixed(2) + ')   [start]');

for (var gen = 1; gen <= GENS; gen++) {
  var cand = JSON.parse(JSON.stringify(best.genome));
  var nMut = 1 + Math.floor(rnd() * 3);
  var heat = 0.16 * (1 - gen / GENS) + 0.03;
  var touched = [];
  for (var m = 0; m < nMut; m++) {
    var k = NUMERIC[Math.floor(rnd() * NUMERIC.length)];
    if (touched.indexOf(k) >= 0) continue;
    touched.push(k);
    cand[k] = clampKey(k, cand[k] * Math.exp((rnd() * 2 - 1) * heat));
  }
  var fit = fitness(cand);
  var mark = '';
  if (fit.score > best.fit.score) {
    best = { fit: fit, genome: cand };
    genome = JSON.parse(JSON.stringify(cand));
    mark = '  ACCEPT  ' + touched.join(',');
  }
  console.log('   gen ' + String(gen).padStart(2) + '  score ' + fit.score.toFixed(3) +
    '   (goals ' + fit.goal.toFixed(3) + '  terr ' + fit.terr.toFixed(2) +
    '  onT ' + fit.onT.toFixed(2) + ')' + mark);
  fs.writeFileSync(OUT, JSON.stringify({
    chain: CHAIN, gen: gen, score: best.fit.score, goal: best.fit.goal,
    terr: best.fit.terr, onT: best.fit.onT, jit: JIT, copies: COPIES,
    seeds: SEEDS, minutes: MINS, opp: OPPTIER, base: BASETIER, genome: best.genome
  }, null, 1));
}

console.log('');
console.log('   best score ' + best.fit.score.toFixed(3) + '  ->  ' + OUT);
console.log('   NOTE: a positive score here is only a candidate. It must clear');
console.log('   tools/ab.mjs on a fresh seed family before it counts as anything.');
console.log('');
console.log('   WARNING - this objective is NOT actually robust, and the way it');
console.log('   failed is worth knowing. Averaging over K perturbed copies still');
console.log('   yields a deterministic CHAOTIC function of the genome, just sampled');
console.log('   at K points instead of one. Measured on the chain-0 result:');
console.log('     full precision,  vs All-Star under a +/-2% sweep: +0.28 +/- 0.09 (11W/0L)');
console.log('     rounded to 4dp,  same measurement:                -0.51 +/- 0.08 (0W/15L)');
console.log('   A ~1e-5 change (rounding six fields) moved the result by 0.8 goals.');
console.log('   Control (tier vs itself, same sweep) returns exactly 0.00, so the');
console.log('   harness is sound - the OBJECTIVE is what cannot be smoothed.');
console.log('   Practical use: treat this as SEARCH + SELECT, i.e. generate');
console.log('   candidates and keep the one that measures best on several disjoint');
console.log('   seed families. Do not expect the winner to survive later edits;');
console.log('   re-run tools/ab.mjs on the affected pair after any change.');
