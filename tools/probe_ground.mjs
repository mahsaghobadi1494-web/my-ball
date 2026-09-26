/* Drive one car straight across the pitch with no AI and log grounded state. */
import { World } from '../src/game/world.js';
import { CFG } from '../src/game/config.js';
import { V3, Quat } from '../src/game/math.js';

var cfg = JSON.parse(JSON.stringify(CFG));
var w = new World(cfg, null, null, null);
w.initMatch(1, -1, 2);
w.state = 'PLAYING'; w.stateTimer = 0;
w.matchTime = 999;

var car = w.cars[1];
w.cars[0].body.pos.set(0, 300, 0);
w.ball.body.pos.set(0, 400, 0);          // get the ball out of the way
w.ball.body.vel.zero();

car.resetState(new V3(0, 0.28, 40), new Quat().fromAxisAngle(0, 1, 0, Math.PI), 100);
car.body.vel.zero(); car.body.angVel.zero();
car.castWheels(w.arena);

var dt = 1 / 60;
var prevG = true;
var airFrames = 0, n = 0, maxY = 0, airRuns = 0, inAir = false;
console.log('t     x      y      z      grounded spd   velY   wheelGnd');
for (var f = 0; f < 60 * 4; f++) {
  car.input.throttle = 1;
  car.input.steer = 0;
  car.input.boost = false;
  car.input.jump = false;
  w.step(dt);
  var g = car.wheels.map(function (wh) { return wh.grounded ? 1 : 0; }).join('');
  if (!car.grounded) { airFrames++; if (!inAir) { airRuns++; inAir = true; } }
  else inAir = false;
  if (car.body.pos.y > maxY) maxY = car.body.pos.y;
  n++;
  if (f % 4 === 0 || (!car.grounded && !prevG)) {
    console.log((f / 60).toFixed(2).padStart(5) + '  ' + car.body.pos.x.toFixed(2).padStart(6) + '  ' +
      car.body.pos.y.toFixed(2).padStart(6) + '  ' + car.body.pos.z.toFixed(2).padStart(7) +
      '  ' + (car.grounded ? 'G' : 'A') + '  ' + car.speed().toFixed(1).padStart(5) +
      '  ' + car.body.vel.y.toFixed(2).padStart(6) + '  ' + g +
      '  ballY ' + w.ball.body.pos.y.toFixed(1).padStart(7) +
      '  ballZ ' + w.ball.body.pos.z.toFixed(1).padStart(7) +
      '  arenaD ' + w.arena.dist(car.body.pos, true).toFixed(2).padStart(7) +
      '  c0Y ' + w.cars[0].body.pos.y.toFixed(0));
  }
  prevG = car.grounded;
}
console.log('airFrames ' + (100 * airFrames / n).toFixed(0) + '%   airRuns ' + airRuns + '   maxY ' + maxY.toFixed(2));
