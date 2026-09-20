// @ts-nocheck
import { clamp, lerp, V3, Quat, tv, tc } from './math.js';
import { CFG, TEAM } from './config.js';
import { Renderer, buildProps } from './renderer.js';
import { Arena, Vehicle } from './physics.js';
import { AudioManager } from './audio.js';
import { Effects } from './effects.js';
import { ReplayManager } from './replay.js';
import { World } from './world.js';

export function Camera() {
  this.pos = new V3(0, 4, -12);
  this.target = new V3(0, 1, 0);
  this.up = new V3(0, 1, 0);
  this.fov = CFG.camera.fov;
  this.ballcam = CFG.camera.startBallcam;
  this.shakeMag = 0;
  this.curDist = CFG.camera.distance;
  this.curHeight = CFG.camera.height;
  this.customizerMode = false;
  this.customizerOrbit = Math.PI * 0.35;
  this.customizerPitch = 0.28;
  this.customizerDist = 4.5;
  this.isDraggingOrbit = false;
  this.chaseYaw = undefined;
  this.flipLockTimer = 0;
}

Camera.prototype.update = function (dt, playerCar, ball, arena) {
  if (!playerCar) return;

  var B = playerCar.body;
  var speed = playerCar.speed();
  var speedZoom = clamp(speed / (CFG.physics.maxCarSpeed || 23.0), 0, 1) * (CFG.camera.speedZoom !== undefined ? CFG.camera.speedZoom : 2.6);

  if (this.shakeMag > 0) {
    this.shakeMag = Math.max(0, this.shakeMag - dt * 4.5);
  }

  var targetPos = new V3();
  var targetLook = new V3();

  // Camera stiffness response setting
  var stiff = clamp(CFG.camera.stiffness || 1.0, 0.2, 2.5);

  if (this.customizerMode) {
    // 360-degree turntable orbit around player car
    if (!this.isDraggingOrbit) {
      this.customizerOrbit = (this.customizerOrbit || (Math.PI * 0.35)) + dt * 0.3;
    }
    var cDist = this.customizerDist || 4.5;
    var pitch = clamp(this.customizerPitch || 0.28, 0.05, 1.1);
    var cHeight = 0.4 + Math.sin(pitch) * cDist;
    var horizDist = Math.cos(pitch) * cDist;
    var ox = Math.sin(this.customizerOrbit) * horizDist;
    var oz = Math.cos(this.customizerOrbit) * horizDist;
    targetPos.set(B.pos.x + ox, B.pos.y + cHeight, B.pos.z + oz);
    targetLook.set(B.pos.x, B.pos.y + 0.35, B.pos.z);
  } else if (this.ballcam && ball) {
    // Ballcam mode: responsive to Distance, Height & Pitch settings
    var dx = ball.body.pos.x - B.pos.x;
    var dz = ball.body.pos.z - B.pos.z;
    var horizDist = Math.sqrt(dx * dx + dz * dz);
    var flatBallX = horizDist > 0.001 ? dx / horizDist : (B.fwd ? B.fwd.x : 0);
    var flatBallZ = horizDist > 0.001 ? dz / horizDist : (B.fwd ? B.fwd.z : 1);

    var baseDist = (CFG.camera.distance !== undefined ? CFG.camera.distance : 9.0);
    var dist = baseDist * 1.06 + speedZoom;
    var baseH = (CFG.camera.height !== undefined ? CFG.camera.height : 2.45);
    var h = baseH + 0.65 + Math.min(Math.max(0, ball.body.pos.y) * 0.18, 3.5);
    var pitchAngle = (CFG.camera.pitch !== undefined ? CFG.camera.pitch : 12) * (Math.PI / 180);

    targetPos.set(
      B.pos.x - flatBallX * dist,
      B.pos.y + h,
      B.pos.z - flatBallZ * dist
    );
    // Tilt look target with pitch angle
    var lookY = ball.body.pos.y - Math.sin(pitchAngle) * 1.6;
    targetLook.set(ball.body.pos.x, lookY, ball.body.pos.z);
  } else {
    // Rear Chase Cam: Rock-solid horizon stabilization (Rocket League style)
    // Does NOT rotate, swing, roll, or flip when the car performs flips / dodges / rolls!
    if (this.flipLockTimer === undefined) this.flipLockTimer = 0;

    var isFlipping = !!(
      playerCar.flipping ||
      (playerCar.dodgeTimer !== undefined && playerCar.dodgeTimer > 0) ||
      (playerCar.rightingTimer !== undefined && playerCar.rightingTimer > 0)
    );

    if (isFlipping) {
      this.flipLockTimer = 0.35;
    } else if (this.flipLockTimer > 0) {
      this.flipLockTimer -= dt;
    }

    if (this.chaseYaw === undefined || Number.isNaN(this.chaseYaw)) {
      var initLen = Math.hypot(B.fwd.x, B.fwd.z);
      this.chaseYaw = initLen > 0.05 ? Math.atan2(B.fwd.x, B.fwd.z) : 0;
    }

    var flatFwdX = B.fwd.x;
    var flatFwdZ = B.fwd.z;
    var flatFwdLen = Math.sqrt(flatFwdX * flatFwdX + flatFwdZ * flatFwdZ);

    var carYaw = this.chaseYaw;
    var followRate = 0;

    if (isFlipping || this.flipLockTimer > 0) {
      // During and immediately following any flip (front flip, back flip, side flip, diagonal flip):
      // The camera yaw MUST NOT rotate with the tumbling car!
      // Keep camera locked on the flip trajectory, exactly as rock-solid as Ballcam.
      carYaw = this.chaseYaw;
      followRate = 0;
    } else if (playerCar.grounded) {
      // On the ground: track steering heading smoothly
      if (flatFwdLen > 0.05) {
        carYaw = Math.atan2(flatFwdX, flatFwdZ);
      } else {
        carYaw = this.chaseYaw;
      }
      followRate = 14.0;
    } else {
      // In the air (not flipping):
      // Only track yaw when car is upright (roof pointing up) and pitch is reasonable.
      // If car is inverted (B.up.y < 0.25) or steeply pitched (Math.abs(B.fwd.y) > 0.72),
      // do NOT rotate camera yaw to prevent inverted 180° whipping!
      var isUpright = (B.up ? B.up.y : 1) > 0.25;
      var isNotSteep = Math.abs(B.fwd.y) < 0.72;

      if (isUpright && isNotSteep && flatFwdLen > 0.30) {
        var candYaw = Math.atan2(flatFwdX, flatFwdZ);
        // Only track if not a sudden 180° inversion
        var diff = candYaw - this.chaseYaw;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        if (Math.abs(diff) < Math.PI * 0.65) {
          carYaw = candYaw;
          followRate = 4.5;
        } else {
          carYaw = this.chaseYaw;
          followRate = 0;
        }
      } else {
        carYaw = this.chaseYaw;
        followRate = 0;
      }
    }

    if (followRate > 0) {
      var yawDiff = carYaw - this.chaseYaw;
      while (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
      while (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
      var yawK = 1 - Math.exp(-followRate * stiff * dt);
      this.chaseYaw += yawDiff * yawK;
    }

    if (Number.isNaN(this.chaseYaw)) {
      this.chaseYaw = carYaw;
    }

    var chFwdX = Math.sin(this.chaseYaw);
    var chFwdZ = Math.cos(this.chaseYaw);

    var dist2 = (CFG.camera.distance !== undefined ? CFG.camera.distance : 9.0) + speedZoom;
    var h2 = (CFG.camera.height !== undefined ? CFG.camera.height : 2.45);
    var pitchAngle = (CFG.camera.pitch !== undefined ? CFG.camera.pitch : 12) * (Math.PI / 180);

    targetPos.set(
      B.pos.x - chFwdX * dist2,
      B.pos.y + h2,
      B.pos.z - chFwdZ * dist2
    );

    // Look ahead along the stabilized chase heading with pitch tilt angle
    var lookDistance = 6.0;
    var lookY = B.pos.y + 0.5 - Math.tan(pitchAngle) * lookDistance * 0.45;
    targetLook.set(
      B.pos.x + chFwdX * lookDistance,
      lookY,
      B.pos.z + chFwdZ * lookDistance
    );
  }

  // Arena bounds collision for camera
  if (arena) {
    targetPos.y = Math.max(0.45, Math.min(arena.h - 0.6, targetPos.y));
    var d = arena.dist(targetPos);
    if (d < 0.65) {
      var n = arena.normal(targetPos, tv());
      targetPos.addS(n, (0.65 - d) * 0.8);
    }
  }

  // Smooth interpolation with stiffness response
  var lerpK = 1 - Math.exp(-18 * stiff * dt);
  if (!Number.isNaN(targetPos.x) && !Number.isNaN(targetPos.y) && !Number.isNaN(targetPos.z)) {
    this.pos.x = lerp(this.pos.x, targetPos.x, lerpK);
    this.pos.y = lerp(this.pos.y, targetPos.y, lerpK);
    this.pos.z = lerp(this.pos.z, targetPos.z, lerpK);
  } else {
    this.pos.set(B.pos.x, B.pos.y + 2.5, B.pos.z - 8.0);
  }

  var lookK = 1 - Math.exp(-24 * stiff * dt);
  if (!Number.isNaN(targetLook.x) && !Number.isNaN(targetLook.y) && !Number.isNaN(targetLook.z)) {
    this.target.x = lerp(this.target.x, targetLook.x, lookK);
    this.target.y = lerp(this.target.y, targetLook.y, lookK);
    this.target.z = lerp(this.target.z, targetLook.z, lookK);
  } else {
    this.target.set(B.pos.x, B.pos.y + 0.5, B.pos.z);
  }

  // Dynamic FOV based on speed and user setting
  var targetFov = (CFG.camera.fov || 100) + speedZoom * (CFG.camera.fovSpeed || 10);
  this.fov = lerp(this.fov || targetFov, targetFov, 1 - Math.exp(-24 * dt));
};

export function InputHandler() {
  this.keys = {};
  this.virtual = {
    throttle: 0,
    steer: 0,
    pitch: 0,
    yaw: 0,
    roll: 0,
    jump: false,
    jumpEdge: false,
    boost: false,
    slide: false,
    rollLeft: false,
    rollRight: false,
    ballcamToggle: false
  };

  this.prevJumpKey = false;
  this.prevBallcamKey = false;
  this.listenersAttached = false;
}

InputHandler.prototype.attach = function (target) {
  if (this.listenersAttached) return;
  var self = this;
  target = target || window;

  this._onKeyDown = function (e) {
    self.keys[e.code] = true;
    self.keys[e.key.toLowerCase()] = true;
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab"].indexOf(e.code) !== -1) {
      e.preventDefault();
    }
  };
  this._onKeyUp = function (e) {
    self.keys[e.code] = false;
    self.keys[e.key.toLowerCase()] = false;
  };

  window.addEventListener("keydown", this._onKeyDown, { passive: false });
  window.addEventListener("keyup", this._onKeyUp, { passive: false });
  this.listenersAttached = true;
};

InputHandler.prototype.detach = function () {
  if (!this.listenersAttached) return;
  window.removeEventListener("keydown", this._onKeyDown);
  window.removeEventListener("keyup", this._onKeyUp);
  this.listenersAttached = false;
};

InputHandler.prototype.pollGamepad = function () {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  if (!gamepads) return null;
  for (var i = 0; i < gamepads.length; i++) {
    var gp = gamepads[i];
    if (gp && gp.connected) return gp;
  }
  return null;
};

InputHandler.prototype.update = function (playerCar, camera) {
  if (!playerCar) return;

  var k = this.keys;
  var gp = this.pollGamepad();
  var v = this.virtual;

  var throttle = 0;
  var steer = 0;
  var pitch = 0;
  var yaw = 0;
  var roll = 0;
  var jump = false;
  var boost = false;
  var slide = false;
  var rollLeft = false;
  var rollRight = false;
  var ballcamToggle = false;

  // Air roll / pitch modifier (Hold 'R' key, Gamepad LB/RB, or virtual button)
  var airRollHeld = !!(k["KeyR"] || k["r"] || v.airRollHeld || (gp && ((gp.buttons[4] && gp.buttons[4].pressed) || (gp.buttons[5] && gp.buttons[5].pressed))));

  var fwdKey = !!(k["KeyW"] || k["ArrowUp"]);
  var backKey = !!(k["KeyS"] || k["ArrowDown"]);
  var leftKey = !!(k["KeyA"] || k["ArrowLeft"]);
  var rightKey = !!(k["KeyD"] || k["ArrowRight"]);

  // Forward / Reverse throttle
  if (fwdKey) throttle += 1;
  if (backKey) throttle -= 1;

  // Steering on ground
  if (leftKey) steer -= 1;
  if (rightKey) steer += 1;

  // Air Orientation Handling:
  if (airRollHeld) {
    // When R is HELD:
    // W rotates nose down (forward pitch), S rotates nose up (backward pitch)
    if (fwdKey) pitch += 1;
    if (backKey) pitch -= 1;
    // A / Left rolls left (like Q), D / Right rolls right (like E)
    if (leftKey) rollLeft = true;
    if (rightKey) rollRight = true;
    yaw = 0;
  } else {
    // When R is NOT held:
    // W/S only throttle (forward/reverse), NO air pitch
    pitch = 0;
    // A/D only yaw (rotates around car's vertical UP axis, just like turning on ground)
    if (leftKey) yaw -= 1;
    if (rightKey) yaw += 1;
  }

  // Dedicated Air Roll buttons (Q and E) always roll
  if (k["KeyQ"]) rollLeft = true;
  if (k["KeyE"]) rollRight = true;

  // Jump
  if (k["Space"]) jump = true;

  // Boost (Shift or LMB or KeyB or KeyF)
  if (k["ShiftLeft"] || k["ShiftRight"] || k["KeyB"] || k["KeyF"]) boost = true;

  // Drift / Power-slide (Ctrl or Alt or KeyX)
  if (k["ControlLeft"] || k["ControlRight"] || k["AltLeft"] || k["KeyX"]) slide = true;

  // Ballcam toggle (KeyC or Space)
  if (k["KeyC"] || k["Space_ballcam"]) {
    if (!this.prevBallcamKey) ballcamToggle = true;
    this.prevBallcamKey = true;
  } else {
    this.prevBallcamKey = false;
  }

  // Merge Gamepad
  if (gp) {
    var deadzone = CFG.input.deadzone || 0.15;
    var lx = gp.axes[0];
    var ly = gp.axes[1];

    if (airRollHeld) {
      if (Math.abs(lx) > deadzone) {
        if (lx < 0) rollLeft = true;
        else rollRight = true;
      }
      if (Math.abs(ly) > deadzone) pitch = -ly;
    } else {
      if (Math.abs(lx) > deadzone) {
        steer = lx;
        yaw = lx;
      }
    }

    // Right Trigger (RT/R2, button 7) = Throttle Forward
    // Left Trigger (LT/L2, button 6) = Reverse/Brake
    var rt = gp.buttons[7] ? gp.buttons[7].value : 0;
    var lt = gp.buttons[6] ? gp.buttons[6].value : 0;
    if (rt > 0.05 || lt > 0.05) {
      throttle = rt - lt;
    }

    // A / Cross (button 0) = Jump
    if (gp.buttons[0] && gp.buttons[0].pressed) jump = true;

    // B / Circle (button 1) = Boost
    if (gp.buttons[1] && gp.buttons[1].pressed) boost = true;

    // X / Square (button 2) = Slide
    if (gp.buttons[2] && gp.buttons[2].pressed) slide = true;

    // Y / Triangle (button 3) = Ballcam toggle
    if (gp.buttons[3] && gp.buttons[3].pressed) {
      if (!this.prevBallcamKey) ballcamToggle = true;
      this.prevBallcamKey = true;
    }

    // LB / RB = Air roll left / right
    if (gp.buttons[4] && gp.buttons[4].pressed) rollLeft = true;
    if (gp.buttons[5] && gp.buttons[5].pressed) rollRight = true;
  }

  // Merge Virtual Touch Inputs
  if (v.throttle !== 0) throttle = v.throttle;
  if (v.steer !== 0) steer = v.steer;
  if (v.pitch !== 0) pitch = v.pitch;
  if (v.yaw !== 0) yaw = v.yaw;
  if (v.jump) jump = true;
  if (v.boost) boost = true;
  if (v.slide) slide = true;
  if (v.rollLeft) rollLeft = true;
  if (v.rollRight) rollRight = true;
  if (v.ballcamToggle) {
    ballcamToggle = true;
    v.ballcamToggle = false;
  }

  // Edge detection for jump
  var jumpEdge = jump && !this.prevJumpKey;
  this.prevJumpKey = jump;

  if (ballcamToggle && camera) {
    camera.ballcam = !camera.ballcam;
  }

  playerCar.input.throttle = clamp(throttle, -1, 1);
  playerCar.input.steer = clamp(steer, -1, 1);
  playerCar.input.pitch = clamp(pitch, -1, 1);
  playerCar.input.yaw = clamp(yaw, -1, 1);
  playerCar.input.roll = (rollLeft ? 1 : 0) - (rollRight ? 1 : 0);
  playerCar.input.rollLeft = rollLeft;
  playerCar.input.rollRight = rollRight;
  playerCar.input.airRollHeld = airRollHeld;
  playerCar.input.jump = jump;
  playerCar.input.jumpEdge = jumpEdge;
  playerCar.input.boost = boost;
  playerCar.input.slide = slide;
};

export function GameEngine(canvas, onStateChange) {
  this.canvas = canvas;
  this.onStateChange = onStateChange || function () {};

  this.audio = new AudioManager();
  this.effects = new Effects(1500);
  this.replay = new ReplayManager(6, 6.0, 60);

  this.renderer = new Renderer(canvas);
  this.camera = new Camera();
  this.input = new InputHandler();

  this.world = new World(CFG, this.audio, this.effects, this.replay);
  this.meshes = null;
  this.props = null;

  this.running = false;
  this.lastTime = 0;
  this.animId = 0;

  this.fps = 60;
  this.fpsTimer = 0;
  this.framesCount = 0;
}

GameEngine.prototype.init = function () {
  try {
    this.meshes = this.world.arena.build(this.renderer);
    this.props = buildProps(this.renderer);
    this.input.attach();

    // Spawn a showcase player car for the Main Menu and Car Customizer Garage
    if (this.world.cars.length === 0) {
      var menuCar = new Vehicle(0, TEAM.PULSE, true, "Player (You)");
      menuCar.body.pos.set(0, 0.35, 0);
      menuCar.body.quat.fromAxisAngle(0, 1, 0, Math.PI * 0.25);
      menuCar.body.vel.zero();
      menuCar.body.angVel.zero();
      this.world.cars.push(menuCar);
    }

    // Pointer orbit and zoom controls when Car Customizer / Garage is active
    var self = this;
    var isPointerDown = false;
    var lastPointerX = 0;
    var lastPointerY = 0;

    this.canvas.addEventListener("pointerdown", function (e) {
      if (self.camera.customizerMode) {
        isPointerDown = true;
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
        self.camera.isDraggingOrbit = true;
      }
    });

    window.addEventListener("pointermove", function (e) {
      if (isPointerDown && self.camera.customizerMode) {
        var dx = e.clientX - lastPointerX;
        var dy = e.clientY - lastPointerY;
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
        self.camera.customizerOrbit = (self.camera.customizerOrbit || 0) - dx * 0.008;
        self.camera.customizerPitch = clamp((self.camera.customizerPitch || 0.28) - dy * 0.006, 0.05, 1.1);
      }
    });

    window.addEventListener("pointerup", function () {
      if (isPointerDown) {
        isPointerDown = false;
        self.camera.isDraggingOrbit = false;
      }
    });

    this.canvas.addEventListener("wheel", function (e) {
      if (self.camera.customizerMode) {
        e.preventDefault();
        self.camera.customizerDist = clamp((self.camera.customizerDist || 4.5) + e.deltaY * 0.005, 2.2, 8.5);
      }
    }, { passive: false });

    this.start();
    return true;
  } catch (err) {
    console.error("GameEngine init error:", err);
    return false;
  }
};

GameEngine.prototype.startMatch = function (teamSize, playerTeam, botSkill) {
  this.audio.resume();
  this.world.initMatch(teamSize, playerTeam, botSkill);
  this.world.state = "COUNTDOWN";
  this.world.stateTimer = CFG.match.countdown || 3.0;
};

GameEngine.prototype.start = function () {
  if (this.running) return;
  this.running = true;
  this.lastTime = performance.now();
  var self = this;

  function loop(now) {
    if (!self.running) return;
    var dt = (now - self.lastTime) / 1000;
    self.lastTime = now;
    if (dt > 0.1) dt = 0.1;

    self.update(dt);
    self.render(dt);

    // FPS calculation
    self.framesCount++;
    self.fpsTimer += dt;
    if (self.fpsTimer >= 0.5) {
      self.fps = Math.round((self.framesCount / self.fpsTimer));
      self.framesCount = 0;
      self.fpsTimer = 0;
    }

    self.animId = requestAnimationFrame(loop);
  }

  this.animId = requestAnimationFrame(loop);
};

GameEngine.prototype.toggleBallcam = function () {
  if (this.camera) {
    this.camera.ballcam = !this.camera.ballcam;
    return this.camera.ballcam;
  }
  return false;
};

GameEngine.prototype.pause = function () {
  if (this.world.state !== "PAUSED") {
    this.world.prevState = this.world.state;
    this.world.state = "PAUSED";
  } else {
    this.world.state = this.world.prevState || "PLAYING";
  }
};

GameEngine.prototype.stop = function () {
  this.running = false;
  if (this.animId) cancelAnimationFrame(this.animId);
  this.input.detach();
};

GameEngine.prototype.update = function (dt) {
  var playerCar = this.world.cars.find(function (c) { return c.isPlayer; }) || this.world.cars[0];

  if (this.world.state !== "PAUSED") {
    this.input.update(playerCar, this.camera);
    this.world.step(dt);
    this.camera.update(dt, playerCar, this.world.ball, this.world.arena);
  }

  if (this.audio) {
    this.audio.updateEngine(dt, playerCar, this.world.state === "PLAYING" || this.world.state === "COUNTDOWN");
  }

  // Dispatch state update to UI callback (throttled to 20 FPS or immediate on state change)
  this.uiTimer = (this.uiTimer || 0) + dt;
  var stateChanged = this.lastNotifiedState !== this.world.state;
  if (this.onStateChange && (this.uiTimer >= 0.05 || stateChanged)) {
    this.uiTimer = 0;
    this.lastNotifiedState = this.world.state;
    this.onStateChange({
      state: this.world.state,
      score: this.world.score,
      matchTime: this.world.matchTime,
      overtime: this.world.overtime,
      countdown: this.world.countdownNum,
      ballcam: this.camera.ballcam,
      fps: this.fps,
      playerCar: playerCar ? {
        boost: Math.round(playerCar.boost),
        speed: Math.round(playerCar.speed() * 3.6), // km/h
        isGrounded: playerCar.grounded,
        stats: playerCar.stats
      } : null,
      goalEvent: this.world.goalEvent
    });
  }
};

GameEngine.prototype.render = function (dt) {
  var R = this.renderer;
  if (!R || !this.meshes || !this.props) return;

  var W = this.world;
  var cam = this.camera;
  var delta = (typeof dt === "number" && dt > 0) ? dt : 0.01667;

  R.resize();
  if (typeof R.renderShadowMap === "function") {
    R.renderShadowMap(this.props, W.cars, W.ball);
  }
  R.beginFrame(cam.pos, cam.target, cam.up, cam.fov, delta);

  var tSec = Math.max(0, Math.ceil(W.matchTime || 0));
  var clockStr = Math.floor(tSec / 60) + ":" + String(tSec % 60).padStart(2, "0");
  if (typeof R.updateScoreboard === "function") {
    R.updateScoreboard(clockStr, W.score[0], W.score[1], W.overtime ? "OVERTIME" : "NEON VELOCITY CHAMPIONSHIP");
  }

  // 1. Draw Arena (Sky, Elevated Grandstands, Animated Spectators, Pitch Floor, 3D Dynamic Instanced Grass, Trusses, Goals)
  R.drawArena(this.meshes, W.arena, this.props, W.cars, W.ball);

  // 2. Draw Boost Pads
  R.drawBoostPads(this.props, W.pads);

  // 3. Draw Vehicles & Shadows
  for (var i = 0; i < W.cars.length; i++) {
    var car = W.cars[i];
    R.drawVehicle(this.props, car, car.team);
  }

  // 4. Draw Ball & Shadow & Indicator
  if (W.ball) {
    R.drawBall(this.props, W.ball);
    if (W.prediction && W.prediction.length > 0) {
      R.drawBallPrediction(this.props, W.prediction);
    }
  }

  // 5. Draw Transparent Arena Net Cage & Volumetric Beams (AFTER vehicles so cars on walls/ceiling are 100% visible!)
  if (typeof R.drawArenaNet === "function") {
    R.drawArenaNet(this.meshes, this.props, W.arena);
  }

  // 6. Draw Particles
  if (this.effects && this.effects.live) {
    R.drawEffectParticles(this.effects.live);
  }

  // 6. Draw Hitbox Visualizer (if enabled)
  if (CFG.debug && CFG.debug.showHitboxes && typeof R.drawHitboxDebug === "function") {
    R.drawHitboxDebug(W.cars, W.ball);
  }
};

GameEngine.prototype.rebuildCarModels = function () {
  if (this.renderer) {
    try {
      this.props = buildProps(this.renderer);
    } catch (e) {
      console.warn("rebuildCarModels error:", e);
    }
  }
};

