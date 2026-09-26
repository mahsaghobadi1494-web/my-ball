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
for (var f = 0; f < 60 * 24; f++) {
  w.step(dt);
  if (f % 120 === 0) {
    var b = w.ball.body;
    var line = 't=' + (f / 60).toFixed(0).padStart(3) +
      ' ball(' + b.pos.x.toFixed(0).padStart(4) + ',' + b.pos.y.toFixed(1).padStart(5) + ',' + b.pos.z.toFixed(0).padStart(4) + ')' +
      ' v=' + b.vel.len().toFixed(0).padStart(3) +
      ' score=' + w.score.join('-');
    console.log(line);
    for (var i = 0; i < w.cars.length; i++) {
      var c = w.cars[i];
      var ai = null;
      for (var k = 0; k < w.ai.length; k++) if (w.ai[k].car === c) ai = w.ai[k];
      console.log('      ' + c.name.padEnd(11) +
        ' (' + c.body.pos.x.toFixed(0).padStart(4) + ',' + c.body.pos.z.toFixed(0).padStart(4) + ')' +
        ' spd=' + c.speed().toFixed(0).padStart(2) +
        ' bst=' + c.boost.toFixed(0).padStart(3) +
        ' r' + (ai ? ai.role : '-') +
        ' ' + (ai ? ai.state : '').padEnd(14) +
        ' mode=' + (ai ? (ai.mode || '-') : '-').padEnd(9) +
        ' solT=' + (ai && ai.solution ? ai.solution.t.toFixed(2) : '--') +
        ' aim=(' + (ai ? ai.aimDir.x.toFixed(1) + ',' + ai.aimDir.z.toFixed(1) : '') + ')' +
        ' touches=' + c.stats.touches);
    }
  }
}
