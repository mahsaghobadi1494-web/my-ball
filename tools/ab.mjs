/* tools/ab.mjs — decisive A/B between two arbitrary skill genomes.
 *
 * Every earlier comparison tool could only test "a genome JSON vs a tier in
 * ai.js", which made it impossible to answer the question that actually
 * mattered: does a learned genome keep its advantage when its numbers are
 * rounded, or when they are nudged by 1%?
 *
 * This tool takes two arbitrary sides. Each side is either a tier index in
 * ai.js (`tier:3`) or a path to a genome JSON (`/tmp/train_lg_c3.json`).
 *
 *   node tools/ab.mjs A B [seeds] [minutes] [offset] [stride] [procs] [perturb]
 *
 *     A, B       tier:N  or  path/to/genome.json
 *     seeds      how many seeds (default 24)
 *     minutes    match length (default 4)
 *     offset     seed family base (default 5000)
 *     stride     seed family stride (default 131)
 *     procs      parallel shards (default 4)
 *     perturb    fractional jitter applied to BOTH sides, e.g. 0.01 (default 0)
 *
 * Everything is paired and both-direction:
 *     obsA = A on PULSE vs B on VOLT      obsB = B on PULSE vs A on VOLT
 *     delta = (obsA - obsB) / 2           cancels the PULSE-side field bias
 * so an A/B of a genome against itself returns exactly 0.00.
 *
 * With `perturb` set, each side is replaced by the MEAN over K perturbed
 * copies of itself (K = 5). A real improvement survives that; a knife-edge
 * one that only exists at one exact float collapses to ~0.
 */
import { World } from '../src/game/world.js';
import { CFG, TEAM } from '../src/game/config.js';
import { AI_LEVELS } from '../src/game/ai.js';
import { fork } from 'child_process';
import { fileURLToPath } from 'url';
import fs from 'fs';

/* The project path contains a space ("WorkBuddy AI"), so import.meta.url is
 * percent-encoded and cannot be passed to fork() directly. */
var SELF = fileURLToPath(import.meta.url);

var HZ = CFG.arena.hz, GHW = CFG.arena.goalHalfW, GH = CFG.arena.goalHeight;
var GRAV = (CFG.physics && CFG.physics.gravity) ? CFG.physics.gravity : 9.8;
var BR = CFG.ball.radius;
var NUMERIC = ['react', 'ctrl', 'horizon', 'steerK', 'speedFrac', 'boost',
  'boostFloor', 'boostDuty', 'aimErr', 'posErr', 'flip', 'shotFlip', 'aerial',
  'airDribble', 'pass', 'demo', 'fake', 'defend', 'rotation', 'recover', 'kickoff'];

function loadSide(spec) {
  if (spec.indexOf('tier:') === 0) {
    return JSON.parse(JSON.stringify(AI_LEVELS[parseInt(spec.slice(5), 10)]));
  }
  var j = JSON.parse(fs.readFileSync(spec, 'utf8'));
  return j.genome ? j.genome : j;
}

/* ────────────────────────────── shard worker ───────────────────────────── */
if (process.env.AB_SHARD) {
  var A = loadSide(process.argv[2]);
  var B = loadSide(process.argv[3]);
  var OFF = parseInt(process.argv[5], 10), STR = parseInt(process.argv[6], 10);
  var MINS = parseFloat(process.argv[4]);
  var PERT = parseFloat(process.env.AB_PERT || '0');
  var K = PERT > 0 ? 5 : 1;
  var shard = parseInt(process.env.AB_SHARD, 10);
  var nShard = parseInt(process.env.AB_SHARDS, 10);

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

  /* Deterministic jitter of one genome, copy index c. Every numeric field is
   * scaled by exp(u) with u uniform in [-PERT, +PERT]. */
  function jitter(g, c) {
    var s = (c * 2654435761 + 12345) >>> 0;
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
      var u = (r() * 2 - 1) * PERT;
      var v = o[k] * Math.exp(u);
      if (k === 'boostFloor') v = Math.min(100, Math.max(0, v));
      o[k] = v;
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

  /* Value of one side on one seed, averaged over its K jittered copies.
   * `aOnPulse` picks which side sits on PULSE. With PERT = 0 (K = 1) this is
   * the plain single match. Both sides are jittered with the SAME copy index,
   * so this compares a neighbourhood against a neighbourhood, not a point
   * against a cloud. */
  function sideValue(g, opp, seed, aOnPulse) {
    var acc = { d: 0, terr: 0, onT: 0 };
    for (var c = 0; c < K; c++) {
      var gg = (K === 1) ? g : jitter(g, c);
      var oo = (K === 1) ? opp : jitter(opp, c);
      var r = aOnPulse ? run(gg, oo, seed) : run(oo, gg, seed);
      acc.d += r.d; acc.terr += r.terr; acc.onT += r.onT;
    }
    return { d: acc.d / K, terr: acc.terr / K, onT: acc.onT / K };
  }

  var out = [];
  for (var s = shard; s < parseInt(process.argv[7], 10); s += nShard) {
    var seed = OFF + s * STR;
    var a = sideValue(A, B, seed, true);    // A on PULSE
    var b = sideValue(B, A, seed, true);    // B on PULSE
    out.push({ seed: seed, dg: (a.d - b.d) / 2, dt: (a.terr - b.terr) / 2, doT: (a.onT - b.onT) / 2 });
  }
  process.stdout.write('@@' + JSON.stringify(out));
  process.exit(0);
}

/* ────────────────────────────── driver ─────────────────────────────────── */
var A = process.argv[2], B = process.argv[3];
var SEEDS = parseInt(process.argv[4] || '24', 10);
var MINS = parseFloat(process.argv[5] || '4');
var OFF = parseInt(process.argv[6] || '5000', 10);
var STR = parseInt(process.argv[7] || '131', 10);
var PROCS = parseInt(process.argv[8] || '4', 10);
var PERT = parseFloat(process.argv[9] || '0');

console.log('A = ' + A);
console.log('B = ' + B);
console.log(SEEDS + ' seeds x ' + MINS + ' min   family ' + OFF + '+' + STR + 'n   ' +
  PROCS + ' shards' + (PERT > 0 ? '   PERTURB +/-' + (PERT * 100).toFixed(1) + '% (5 copies)' : ''));

var pending = PROCS, all = [];
for (var p = 0; p < PROCS; p++) {
  var cp = fork(SELF, [A, B, MINS, String(OFF), String(STR), String(SEEDS)],
    { env: Object.assign({}, process.env, { AB_SHARD: String(p), AB_SHARDS: String(PROCS), AB_PERT: String(PERT) }), silent: true });
  cp.stdout.on('data', function (d) {
    var t = String(d);
    var i = t.indexOf('@@');
    if (i >= 0) { try { all = all.concat(JSON.parse(t.slice(i + 2))); } catch (e) {} }
  });
  cp.stderr.on('data', function (d) { process.stderr.write(String(d)); });
  cp.on('exit', function () {
    if (--pending === 0) finish();
  });
}

function mean(x) { var s = 0; for (var i = 0; i < x.length; i++) s += x[i]; return s / x.length; }
function se(x) {
  var m = mean(x), s = 0;
  for (var i = 0; i < x.length; i++) s += (x[i] - m) * (x[i] - m);
  return Math.sqrt(s / (x.length - 1) / x.length);
}
function verdict(m, e) {
  if (!(Math.abs(m) > 2 * e)) return 'inside noise';
  return m > 0 ? 'A IS BETTER' : 'A IS WORSE';
}

function finish() {
  all.sort(function (x, y) { return x.seed - y.seed; });
  var dg = all.map(function (r) { return r.dg; });
  var dt = all.map(function (r) { return r.dt; });
  var doT = all.map(function (r) { return r.doT; });
  var mg = mean(dg), eg = se(dg), mt = mean(dt), et = se(dt), mo = mean(doT), eo = se(doT);
  var won = 0, lost = 0, tie = 0;
  for (var i = 0; i < dg.length; i++) {
    if (dg[i] > 0.001) won++; else if (dg[i] < -0.001) lost++; else tie++;
  }
  console.log('');
  console.log('   goals       ' + (mg >= 0 ? '+' : '') + mg.toFixed(2) + ' +/- ' + eg.toFixed(2) + '    ' + verdict(mg, eg));
  console.log('   territory   ' + (mt >= 0 ? '+' : '') + mt.toFixed(2) + ' +/- ' + et.toFixed(2) + ' m  ' + verdict(mt, et));
  console.log('   on target   ' + (mo >= 0 ? '+' : '') + mo.toFixed(2) + ' +/- ' + eo.toFixed(2) + '    ' + verdict(mo, eo));
  console.log('   seeds       ' + won + ' won / ' + lost + ' lost / ' + tie + ' drawn   of ' + dg.length);
  process.exit(0);
}
