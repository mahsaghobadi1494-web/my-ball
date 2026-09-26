import { World } from '../src/game/world.js';
import { CFG } from '../src/game/config.js';
import { AI_LEVELS } from '../src/game/ai.js';

var ORIG = Math.random;
var s = 777 >>> 0;
Math.random = function () { s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

var cfg = JSON.parse(JSON.stringify(CFG));
var w = new World(cfg, null, null, null);
w.initMatch(2, -1, 2);
w.state = 'PLAYING'; w.stateTimer = 0; w.matchTime = 600;
var dt = 1 / 60;
var idle = 0, frames = 0, nearSum = 0;
for (var f = 0; f < 60 * 40; f++) {
  w.step(dt);
  var b = w.ball.body.pos;
  var near = 1e9;
  for (var i = 0; i < w.cars.length; i++) {
    var d = Math.hypot(w.cars[i].body.pos.x - b.x, w.cars[i].body.pos.z - b.z);
    if (d < near) near = d;
  }
  nearSum += near; frames++;
  if (near > 18) idle++;
  if (f % 180 === 0) {
    var bb = w.ball.body;
    console.log('t=' + (f / 60).toFixed(0).padStart(3) +
      ' ball(' + bb.pos.x.toFixed(0).padStart(4) + ',' + bb.pos.y.toFixed(1).padStart(5) + ',' + bb.pos.z.toFixed(0).padStart(4) + ')' +
      ' v=' + bb.vel.len().toFixed(0).padStart(3) + ' near=' + near.toFixed(0).padStart(3) +
      ' score=' + w.score.join('-') + '  ' +
      w.cars.map(function (c) {
        var ai = null; for (var k = 0; k < w.ai.length; k++) if (w.ai[k].car === c) ai = w.ai[k];
        return c.name.split('-')[0] + '[' + c.team + ']' + (ai ? ('r' + ai.role + ':' + ai.state.slice(0, 8)) : '') +
          '@' + c.body.pos.z.toFixed(0) + ' b' + c.boost.toFixed(0) + ' t' + c.stats.touches;
      }).join(' | '));
  }
}
console.log('---');
console.log('avg nearest-bot distance to ball: ' + (nearSum / frames).toFixed(1) + ' m');
console.log('frames with nobody within 18m: ' + (100 * idle / frames).toFixed(1) + '%');
var tt = [0, 0];
for (var q = 0; q < w.cars.length; q++) tt[w.cars[q].team] += w.cars[q].stats.touches;
console.log('total touches: ' + tt[0] + ' / ' + tt[1] + '  over ' + (frames / 60).toFixed(0) + 's  => ' +
  ((tt[0] + tt[1]) / (frames / 3600)).toFixed(0) + '/min');
console.log('score ' + w.score.join('-'));
