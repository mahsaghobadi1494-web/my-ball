// @ts-nocheck
import { clamp, lerp, V3, Quat, tv, tc } from './math.js';
import { CFG, TEAM, TEAM_NAME, BOT_NAMES } from './config.js';
import { Arena, Ball, Vehicle, predictBall, collideCarArena, collideCarBall, collideCarCar } from './physics.js';
import { AIController, assignRoles } from './ai.js';

export function BoostPad(x, z, big, index) {
  this.pos = new V3(x, 0, z);
  this.big = !!big;
  this.index = index;
  this.active = true;
  this.timer = 0;
  this.cooldown = this.big ? CFG.boostPad.bigCooldown : CFG.boostPad.smallCooldown;
  this.radius = this.big ? CFG.boostPad.bigRadius : CFG.boostPad.smallRadius;
  this.amount = this.big ? CFG.boostPad.bigAmount : CFG.boostPad.smallAmount;
  this.anim = Math.random() * 6.28;
}
BoostPad.prototype.update = function (dt) {
  this.anim += dt * (this.big ? 2.4 : 1.6);
  if (!this.active) {
    this.timer -= dt;
    if (this.timer <= 0) {
      this.active = true;
      this.timer = 0;
    }
  }
};
BoostPad.prototype.check = function (car) {
  if (!this.active) return false;
  if (car.boost >= 100) return false;
  var dSq = (car.body.pos.x - this.pos.x) * (car.body.pos.x - this.pos.x) + (car.body.pos.z - this.pos.z) * (car.body.pos.z - this.pos.z);
  if (dSq < this.radius * this.radius && car.body.pos.y < CFG.boostPad.height) {
    car.boost = Math.min(100, car.boost + this.amount);
    this.active = false;
    this.timer = this.cooldown;
    return true;
  }
  return false;
};

export function createBoostPads(arena) {
  var pads = [];
  var hx = arena.hx, hz = arena.hz;
  var idx = 0;

  // 6 Big Corner & Mid boost pads
  var bigCoords = [
    [-hx * 0.88, -hz * 0.88], [hx * 0.88, -hz * 0.88],
    [-hx * 0.90, 0],          [hx * 0.90, 0],
    [-hx * 0.88, hz * 0.88],  [hx * 0.88, hz * 0.88]
  ];
  for (var b = 0; b < bigCoords.length; b++) {
    pads.push(new BoostPad(bigCoords[b][0], bigCoords[b][1], true, idx++));
  }

  // Small boost pads grid (spacious center field layout)
  var smallCoords = [
    // Goal mouth pads
    [0, -hz * 0.88], [0, hz * 0.88],
    [-hx * 0.32, -hz * 0.72], [hx * 0.32, -hz * 0.72],
    [-hx * 0.32, hz * 0.72],  [hx * 0.32, hz * 0.72],

    // Flank lanes
    [-hx * 0.52, -hz * 0.42], [hx * 0.52, -hz * 0.42],
    [-hx * 0.52, hz * 0.42],  [hx * 0.52, hz * 0.42],

    // Straight kickoff lane pads (open center)
    [0, -hz * 0.35], [0, hz * 0.35],
    [-hx * 0.55, 0], [hx * 0.55, 0],

    // Corner wings
    [-hx * 0.68, -hz * 0.65], [hx * 0.68, -hz * 0.65],
    [-hx * 0.68, hz * 0.65],  [hx * 0.68, hz * 0.65]
  ];
  for (var s = 0; s < smallCoords.length; s++) {
    pads.push(new BoostPad(smallCoords[s][0], smallCoords[s][1], false, idx++));
  }
  return pads;
}

export function World(cfg, audio, effects, replay) {
  this.cfg = cfg || CFG;
  this.audio = audio;
  this.effects = effects;
  this.replay = replay;

  this.arena = new Arena(this.cfg.arena);
  this.ball = new Ball(this.cfg.ball);
  this.cars = [];
  this.ai = [];
  this.pads = createBoostPads(this.arena);

  this.state = "MENU"; // MENU, COUNTDOWN, PLAYING, GOAL, REPLAY, GAMEOVER, PAUSED
  this.prevState = "MENU";
  this.stateTimer = 0;
  this.matchTime = this.cfg.match.duration;
  this.time = 0;
  this.score = [0, 0];
  this.lastScorer = -1;
  this.lastScorerCar = -1;
  this.overtime = false;
  this.countdownNum = 3;

  this.contacts = [];
  this.prediction = [];
  this.goalEvent = null;
  this.stats = { shots: [0, 0], saves: [0, 0] };
  this.accumulator = 0;
}

World.prototype.initMatch = function (teamSize, playerTeam, botSkill) {
  if (typeof teamSize === "string") {
    var parsed = parseInt(teamSize, 10);
    teamSize = isNaN(parsed) ? (this.cfg.match.teamSize || 2) : parsed;
  }
  teamSize = teamSize || this.cfg.match.teamSize || 2;
  playerTeam = playerTeam === undefined ? TEAM.PULSE : playerTeam;
  if (botSkill !== undefined) this.cfg.ai.skill = botSkill;

  this.cars = [];
  this.ai = [];
  this.score = [0, 0];
  this.matchTime = this.cfg.match.duration;
  this.overtime = false;
  this.time = 0;
  this.contacts = [];

  var carIndex = 0;
  // Team Pulse (0)
  for (var p = 0; p < teamSize; p++) {
    var isPlayer = (playerTeam === TEAM.PULSE && p === 0);
    var name = isPlayer ? "Player (You)" : (BOT_NAMES[0][p % BOT_NAMES[0].length] || "Pulse Bot " + (p + 1));
    var car = new Vehicle(carIndex, TEAM.PULSE, isPlayer, name);
    this.cars.push(car);
    if (!isPlayer) this.ai.push(new AIController(car, this));
    carIndex++;
  }

  // Team Volt (1)
  for (var v = 0; v < teamSize; v++) {
    var isPlayerV = (playerTeam === TEAM.VOLT && v === 0);
    var nameV = isPlayerV ? "Player (You)" : (BOT_NAMES[1][v % BOT_NAMES[1].length] || "Volt Bot " + (v + 1));
    var carV = new Vehicle(carIndex, TEAM.VOLT, isPlayerV, nameV);
    this.cars.push(carV);
    if (!isPlayerV) this.ai.push(new AIController(carV, this));
    carIndex++;
  }

  if (this.replay) {
    this.replay.reset();
  }

  this.setupKickoff(0);
};

World.prototype.setupKickoff = function (formationIndex) {
  formationIndex = formationIndex || 0;
  var hz = this.cfg.arena.hz;

  this.ball.reset(new V3(0, this.ball.radius + 0.001, 0), new V3(0, 0, 0));

  var pulseCars = this.cars.filter(function (c) { return c.team === TEAM.PULSE; });
  var voltCars = this.cars.filter(function (c) { return c.team === TEAM.VOLT; });

  // Kickoff positions: Center back, Diagonals, Left/Right offset
  var formations = [
    // Formation 0: Diagonal attack
    [
      { p: new V3(-11, 0.28, -hz + 14), yaw: 0.4 },
      { p: new V3(11, 0.28, -hz + 14), yaw: -0.4 },
      { p: new V3(0, 0.28, -hz + 9), yaw: 0 },
      { p: new V3(-3.5, 0.28, -hz + 10), yaw: 0 }
    ],
    // Formation 1: Center rush
    [
      { p: new V3(0, 0.28, -hz + 18), yaw: 0 },
      { p: new V3(-8, 0.28, -hz + 11), yaw: 0.2 },
      { p: new V3(8, 0.28, -hz + 11), yaw: -0.2 },
      { p: new V3(0, 0.28, -hz + 7), yaw: 0 }
    ],
    // Formation 2: Spread diagonal
    [
      { p: new V3(14, 0.28, -hz + 17), yaw: -0.5 },
      { p: new V3(-14, 0.28, -hz + 17), yaw: 0.5 },
      { p: new V3(0, 0.28, -hz + 8), yaw: 0 },
      { p: new V3(0, 0.28, -hz + 12), yaw: 0 }
    ]
  ];

  var form = formations[Math.abs(formationIndex) % formations.length];

  // Set Team Pulse
  for (var i = 0; i < pulseCars.length; i++) {
    var f = form[i % form.length];
    var q = new Quat().fromAxisAngle(0, 1, 0, f.yaw);
    pulseCars[i].resetState(f.p.clone(), q, 33);
    pulseCars[i].castWheels(this.arena);
  }

  // Set Team Volt (mirrored z and rotated 180 deg)
  for (var j = 0; j < voltCars.length; j++) {
    var fv = form[j % form.length];
    var pv = new V3(-fv.p.x, fv.p.y, -fv.p.z);
    var qv = new Quat().fromAxisAngle(0, 1, 0, fv.yaw + Math.PI);
    voltCars[j].resetState(pv, qv, 33);
    voltCars[j].castWheels(this.arena);
  }

  // Reactivate all boost pads
  for (var k = 0; k < this.pads.length; k++) {
    this.pads[k].active = true;
    this.pads[k].timer = 0;
  }

  this.state = "COUNTDOWN";
  this.stateTimer = this.cfg.match.countdown || 3.0;
  this.countdownNum = 3;
  if (this.audio) this.audio.countdown(3);
};

World.prototype.scoreGoal = function (scoringTeam, impactPos) {
  this.score[scoringTeam]++;
  this.lastScorer = scoringTeam;
  this.lastScorerCar = this.ball.lastTouch;
  this.goalTime = this.time;
  this.goalHead = this.replay ? this.replay.head : -1;
  this.state = "GOAL";
  this.stateTimer = 1.0;

  if (this.ball.lastTouch >= 0 && this.cars[this.ball.lastTouch]) {
    this.cars[this.ball.lastTouch].stats.goals++;
  }

  if (this.effects) {
    this.effects.goalBurst(impactPos || this.ball.body.pos, scoringTeam);
    this.effects.confettiBurst(impactPos || this.ball.body.pos, scoringTeam);
  }
  if (this.audio) {
    this.audio.goal(this.cars.some(function (c) { return c.isPlayer && c.team !== scoringTeam; }));
  }

  this.goalEvent = {
    team: scoringTeam,
    teamName: TEAM_NAME[scoringTeam],
    pos: (impactPos || this.ball.body.pos).clone(),
    scorer: this.lastScorerCar >= 0 && this.cars[this.lastScorerCar] ? this.cars[this.lastScorerCar].name : TEAM_NAME[scoringTeam] + " Team",
    time: this.time
  };
};

World.prototype.step = function (dt) {
  var hz = this.cfg.physics.hz || 240;
  var fixedDt = 1 / hz;
  var maxSteps = this.cfg.physics.maxStepsPerFrame || 12;

  this.accumulator += Math.min(dt, 0.1);
  var steps = 0;

  while (this.accumulator >= fixedDt && steps < maxSteps) {
    this.fixedStep(fixedDt);
    this.accumulator -= fixedDt;
    steps++;
  }

  // Update dynamic effects
  if (this.effects) {
    this.effects.update(dt);
    this.effects.stadiumAtmosphere(this.arena, dt);
    if (this.ball) this.effects.ballTrail(this.ball, dt);
    for (var c = 0; c < this.cars.length; c++) {
      var car = this.cars[c];
      if (car.boostActive && this.effects) this.effects.boostFlame(car, dt);
      if (car.slideAmount > 0.1) {
        for (var w = 0; w < 4; w++) {
          if (car.wheels[w].grounded) this.effects.tyreDust(car, car.wheels[w], car.slideAmount, dt);
        }
      }
    }
  }

  // Predict ball trajectory for AI and visuals
  predictBall(this.ball, this.arena, this.cfg.ai.predictHorizon || 2.5, this.cfg.ai.predictStep || (1 / 30), this.prediction);
};

World.prototype.fixedStep = function (dt) {
  this.time += dt;

  // Handle Match State Timing
  if (this.state === "COUNTDOWN") {
    this.stateTimer -= dt;
    var currentCount = Math.ceil(this.stateTimer);
    if (currentCount !== this.countdownNum && currentCount > 0) {
      this.countdownNum = currentCount;
      if (this.audio) this.audio.countdown(this.countdownNum);
    }
    if (this.stateTimer <= 0) {
      this.state = "PLAYING";
      this.stateTimer = 0;
      this.countdownNum = 0;
      if (this.audio) this.audio.countdown(0);
    }
  } else if (this.state === "PLAYING") {
    if (!this.overtime) {
      this.matchTime = Math.max(0, this.matchTime - dt);
      if (this.matchTime <= 0) {
        if (this.score[0] === this.score[1] && this.cfg.match.overtime) {
          this.overtime = true;
          if (this.audio) this.audio.whistle();
        } else {
          this.state = "GAMEOVER";
          this.stateTimer = 5.0;
          if (this.audio) this.audio.whistle();
        }
      }
    }
  } else if (this.state === "GOAL") {
    this.stateTimer -= dt;
    if (this.stateTimer <= 0) {
      var preGoalSecs = 9.0;
      var postGoalSecs = 1.2;
      var started = false;
      if (this.replay) {
        if (typeof this.replay.startGoalReplay === "function") {
          started = this.replay.startGoalReplay(preGoalSecs, postGoalSecs, this.goalHead, this.goalTime, 0.95);
        } else {
          started = this.replay.start(11.5, 0.95, this.goalTime || this.time);
        }
      }
      if (started) {
        this.state = "REPLAY";
        this.stateTimer = 25.0;
      } else {
        this.checkOvertimeOrResetKickoff();
      }
    }
  } else if (this.state === "REPLAY") {
    this.stateTimer -= dt;
    var sampled = this.replay && this.replay.sample(dt, this.cars, this.ball);
    if (!sampled || this.stateTimer <= 0) {
      if (this.replay) this.replay.stop();
      this.checkOvertimeOrResetKickoff();
    }
    return; // Don't run physics simulation while replaying
  } else if (this.state === "GAMEOVER") {
    this.stateTimer -= dt;
  }

  // Update boost pads
  for (var p = 0; p < this.pads.length; p++) {
    this.pads[p].update(dt);
  }

  // AI decision making
  if (this.state === "PLAYING" || this.state === "COUNTDOWN") {
    assignRoles(this);
    for (var a = 0; a < this.ai.length; a++) {
      if (this.state === "COUNTDOWN") {
        this.ai[a].car.input.throttle = 1;
        this.ai[a].car.input.boost = true;
      } else {
        this.ai[a].update(dt);
      }
    }
  }

  // Step Vehicles
  for (var i = 0; i < this.cars.length; i++) {
    var car = this.cars[i];
    if (this.state === "COUNTDOWN" || this.state === "MENU") {
      // Lock movement during countdown and menu showcase but keep wheels positioned
      car.body.vel.zero();
      car.body.angVel.zero();
      car.castWheels(this.arena);
    } else {
      car.step(dt, this.arena, this);
      collideCarArena(car, this.arena, this);
      // Check boost pickup
      for (var bp = 0; bp < this.pads.length; bp++) {
        if (this.pads[bp].check(car) && this.audio) {
          this.audio.pad(this.pads[bp].big);
        }
      }
    }
  }

  // Car vs Car Collisions
  if (this.state !== "MENU") {
    for (var c1 = 0; c1 < this.cars.length; c1++) {
      for (var c2 = c1 + 1; c2 < this.cars.length; c2++) {
        collideCarCar(this.cars[c1], this.cars[c2], this);
      }
    }
  }

  // Step Ball
  if (this.state !== "COUNTDOWN" && this.state !== "MENU") {
    this.ball.step(dt, this.arena, this.cars, this);
  }

  // Check Goals
  if (this.state === "PLAYING") {
    var goalSide = this.arena.goalTest(this.ball.body.pos, this.ball.radius);
    if (goalSide === 1) {
      // Pulse scores into Volt goal (side = 1)
      this.scoreGoal(TEAM.PULSE, this.ball.body.pos);
    } else if (goalSide === -1) {
      // Volt scores into Pulse goal (side = -1)
      this.scoreGoal(TEAM.VOLT, this.ball.body.pos);
    }
  }

  // Process contact audio & effects
  this.handleContacts();

  // Record Replay
  if (this.replay && (this.state === "PLAYING" || this.state === "GOAL" || this.state === "COUNTDOWN")) {
    this.replay.record(dt, this.cars, this.ball, this.time);
  }
};

World.prototype.checkOvertimeOrResetKickoff = function () {
  if (this.overtime) {
    this.state = "GAMEOVER";
    this.stateTimer = 5.0;
    if (this.audio) this.audio.whistle();
  } else {
    this.setupKickoff(Math.floor(Math.random() * 3));
  }
};

World.prototype.handleContacts = function () {
  while (this.contacts.length > 0) {
    var c = this.contacts.pop();
    if (!c) continue;

    if (c.type === "ballCar") {
      if (this.audio) this.audio.ballHit(c.speed, c.surface);
      if (this.effects) this.effects.sparks(c.pos, c.normal, c.speed * 0.9);
    } else if (c.type === "ballWall") {
      if (this.audio) this.audio.wallHit(c.speed);
      if (this.effects) this.effects.impactRing(c.pos, c.normal, c.speed);
    } else if (c.type === "carWall") {
      if (this.audio) this.audio.wallHit(c.speed * 0.7);
      if (this.effects) this.effects.sparks(c.pos, c.normal, c.speed * 0.6);
    } else if (c.type === "jump") {
      if (this.audio) this.audio.jump();
    } else if (c.type === "dodge") {
      if (this.audio) this.audio.dodge();
    } else if (c.type === "land") {
      if (this.audio) this.audio.land(c.impulse);
    }
  }
};
