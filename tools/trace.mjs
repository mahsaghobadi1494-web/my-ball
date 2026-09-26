import { World } from '../src/game/world.js';
import { CFG } from '../src/game/config.js';

var s = 777 >>> 0;
Math.random = function () { s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

var cfg = JSON.parse(JSON.stringify(CFG));
var w = new World(cfg, null, null, null);
w.initMatch(2, -1, 2);
w.state = 'PLAYING'; w.stateTimer = 0; w.matchTime = 600;
var dt = 1 / 60;
var hits = [];
var oh = w.handleContacts.bind(w);
w.handleContacts = function () {
  for (var i = 0; i < this.contacts.length; i++) {
    var c = this.contacts[i];
    if (c && (c.type === 'ballCar' || c.type === 'ballWall')) hits.push(c.type + ':' + (this.cars[c.car] ? this.cars[c.car].name.split('-')[0] : 'wall'));
  }
  oh();
};
for (var f = 0; f < 60 * 24; f++) {
  w.step(dt);
  if (f > 60 * 8 && f % 15 === 0) {
    var b = w.ball.body;
    console.log('t=' + (f / 60).toFixed(2) +
      ' p=(' + b.pos.x.toFixed(1) + ',' + b.pos.y.toFixed(2) + ',' + b.pos.z.toFixed(1) + ')' +
      ' v=(' + b.vel.x.toFixed(1) + ',' + b.vel.y.toFixed(1) + ',' + b.vel.z.toFixed(1) + ')' +
      ' |v|=' + b.vel.len().toFixed(1) +
      ' |w|=' + b.angVel.len().toFixed(1) +
      ' contacts=' + (hits.length ? hits.join(',') : '-'));
    hits.length = 0;
  }
}
