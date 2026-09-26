/* tools/train.mjs — self-play hill climbing: let the bot LEARN a skill set.
 *
 * Hand-tuning failed four times, so stop guessing. This treats a tier's skill
 * values as a genome, plays the candidate against a FROZEN reference (the
 * current Legendary) and keeps a mutation only when it measurably wins.
 *
 * Two things make this work at all despite the noise:
 *
 *  1. PAIRED SEEDS. Candidate and reference are both evaluated on the exact
 *     same seed set, in both directions. Comparing two configs on common
 *     random numbers cancels most of the seed-to-seed variance that makes
 *     absolute goal difference so noisy.
 *  2. A COMPOSITE FITNESS. Goals alone are far too sparse to steer on
 *     (self-play between identical tiers swings +/-2 goals). Territory and
 *     shots-on-target are sampled thousands of times per match, so they give
 *     the search a gradient. Goals still carry the most weight.
 *
 *   node tools/train.mjs <chainId> <generations> <seeds> <minutes> <out.json>
 */
import { World } from '../src/game/world.js';
import { CFG } from '../src/game/config.js';
import { TEAM } from '../src/game/config.js';
import { AI_LEVELS } from '../src/game/ai.js';
import fs from 'fs';

var HZ = CFG.arena.hz, GHW = CFG.arena.goalHalfW, GH = CFG.arena.goalHeight;
var GRAV = (CFG.physics && CFG.physics.gravity) ? CFG.physics.gravity : 9.8;
var BR = CFG.ball.radius;

var CHAIN = parseInt(process.argv[2] || '0', 10);
var GENS = parseInt(process.argv[3] || '60', 10);
var SEEDS = parseInt(process.argv[4] || '10', 10);
var MINS = parseFloat(process.argv[5] || '2');
var OUT = process.argv[6] || '/tmp/train_best.json';

/* ---- genome definition ------------------------------------------------- */
var BOUNDS = {
  react: [0.08, 0.40], ctrl: [0.008, 0.10], horizon: [1.0, 5.0],
  steerK: [1.0, 3.2], speedFrac: [0.55, 0.90], boost: [0.05, 1.0],
  boostFloor: [30, 60], boostDuty: [0.15, 0.80], aimErr: [0.6, 7.0],
  posErr: [1.0, 5.5], flip: [0, 0.80], shotFlip: [0, 0.50], aerial: [0, 0.90],
  airDribble: [0, 0.70], pass: [0, 0.80], demo: [0, 0.60], fake: [0, 0.60],
  defend: [0.20, 1.0], rotation: [0.20, 1.0], recover: [0.30, 1.0]
};
var KEYS = Object.keys(BOUNDS);

/* Two DIFFERENT roles, and conflating them was a real bug in the first run:
 *   BASETIER - whose genome we start from and are trying to improve
 *   OPPTIER  - the frozen opponent the candidate must beat
 * When BASETIER === OPPTIER this is plain self-improvement ("new tier N beats
 * old tier N"). When they differ it is "evolve tier A until it beats tier B",
 * which is what keeps the ladder monotone after a lower tier gets stronger.
 */
var OPPTIER = parseInt(process.argv[7] !== undefined ? process.argv[7] : '4', 10);
var BASETIER = parseInt(process.argv[8] !== undefined ? process.argv[8] : OPPTIER, 10);
var REF = JSON.parse(JSON.stringify(AI_LEVELS[OPPTIER]));
var GENOME0 = JSON.parse(JSON.stringify(AI_LEVELS[BASETIER]));

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

/* One match. pulseSk = skill object on the PULSE side, voltSk on VOLT. */
function match(pulseSk, voltSk, seed) {
  seedRandom(seed);
  var cfg = JSON.parse(JSON.stringify(CFG));
  var w = new World(cfg, null, null, null);
  w.initMatch(2, -1, 2);
  for (var i = 0; i < w.ai.length; i++) {
    var isP = w.ai[i].car.team === TEAM.PULSE;
    w.ai[i].sk = isP ? pulseSk : voltSk;
    w.ai[i].refreshSkill = function () {};   // hold the injected genome
  }
  w.matchTime = MINS * 60; cfg.match.duration = MINS * 60;
  var frames = Math.round(MINS * 60 * 60), terr = 0, n = 0, onT = 0;
  var cool = [0, 0], last = [0, 0];
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

/* Paired, both-direction differential against the frozen reference.
 * D = (candidate-on-PULSE  -  candidate-on-VOLT) / 2, which cancels the
 * PULSE-side field asymmetry. */
function fitness(genome) {
  var dg = 0, dt = 0, doT = 0;
  for (var s = 0; s < SEEDS; s++) {
    var seed = 9000 + s * 977;
    var a = match(genome, REF, seed);      // candidate on PULSE
    var b = match(REF, genome, seed);      // candidate on VOLT
    dg += (a.d - b.d) / 2;
    dt += (a.terr - b.terr) / 2;
    doT += (a.onT - b.onT) / 2;
  }
  var goal = dg / SEEDS, terr = dt / SEEDS, onT = doT / SEEDS;
  return {
    goal: goal, terr: terr, onT: onT,
    // Goals dominate; territory and on-target shots exist to give the search
    // a usable gradient between the sparse goal events.
    score: goal * 1.0 + terr * 0.06 + onT * 0.12
  };
}

/* ---- hill climb --------------------------------------------------------- */
var rnd = (function (a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; })(12345 + CHAIN * 7919);

function clampKey(k, v) { var b = BOUNDS[k]; return Math.min(b[1], Math.max(b[0], v)); }

var genome = GENOME0;
var best = fitness(genome);
console.log('chain ' + CHAIN + '  base ' + AI_LEVELS[BASETIER].name + '  vs ' + AI_LEVELS[OPPTIER].name +
  '   start score ' + best.score.toFixed(3) +
  '  (goal ' + best.goal.toFixed(2) + ' terr ' + best.terr.toFixed(2) + ' onT ' + best.onT.toFixed(2) + ')');

var accepted = 0;
for (var gen = 0; gen < GENS; gen++) {
  // Anneal the mutation size so early steps explore and later steps refine.
  var heat = 0.18 * (1 - gen / GENS) + 0.03;
  var nMut = 1 + Math.floor(rnd() * 4);
  var cand = JSON.parse(JSON.stringify(genome));
  var touched = [];
  for (var m = 0; m < nMut; m++) {
    var k = KEYS[Math.floor(rnd() * KEYS.length)];
    var f = Math.exp((rnd() * 2 - 1) * heat);
    cand[k] = clampKey(k, cand[k] * f);
    touched.push(k);
  }
  var fit = fitness(cand);
  if (fit.score > best.score) {
    genome = cand; best = fit; accepted++;
    fs.writeFileSync(OUT, JSON.stringify({ chain: CHAIN, gen: gen, score: best.score, goal: best.goal, terr: best.terr, onT: best.onT, genome: genome }, null, 2));
    console.log('  gen ' + gen + ' ACCEPT score ' + best.score.toFixed(3) +
      '  goal ' + best.goal.toFixed(2) + ' terr ' + best.terr.toFixed(2) + ' onT ' + best.onT.toFixed(2) +
      '   [' + touched.join(',') + ']');
  }
}
console.log('chain ' + CHAIN + ' done  accepted ' + accepted + '/' + GENS +
  '  final score ' + best.score.toFixed(3) + '  goal ' + best.goal.toFixed(2));
fs.writeFileSync(OUT, JSON.stringify({ chain: CHAIN, gen: GENS, score: best.score, goal: best.goal, terr: best.terr, onT: best.onT, genome: genome }, null, 2));
