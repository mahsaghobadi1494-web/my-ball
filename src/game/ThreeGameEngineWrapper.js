// @ts-nocheck
import { CFG } from "./config.js";

export class ThreeGameEngineWrapper {
  constructor(canvas, onStateChange) {
    this.canvas = canvas;
    this.onStateChange = onStateChange;
    this.running = false;

    if (!window.ThreeGameEngine) {
      throw new Error("window.ThreeGameEngine is not loaded yet.");
    }

    const self = this;

    // Define options matching what the compiled Mf class expects
    const options = {
      quality: "high",
      volume: CFG.audio.master,
      muted: false,
      settings: {
        teamSize: CFG.match.teamSize || 3,
        difficulty: "pro",
        matchMinutes: 5,
        autoQuality: true
      },
      onEvent: (event) => {
        if (event.type === "state") {
          // Translate to the format our App.tsx expects
          const stateData = {
            state: event.state,
            score: event.score || [0, 0],
            matchTime: self.engine.clock || 0,
            overtime: event.overtime || false,
            countdown: self.engine.countdown || 0,
            ballcam: self.engine.rig ? self.engine.rig.ballCam : true,
            fps: self.engine.stats ? self.engine.stats.fps : 60,
            playerCar: self.engine.player ? {
              boost: Math.round(self.engine.player.boost),
              speed: Math.round(self.engine.player.vel.length() * 3.6),
              isGrounded: self.engine.player.grounded,
              stats: self.engine.player.stats || { goals: 0, shots: 0, saves: 0 }
            } : null,
            goalEvent: event.announce && event.announce.kind === "goal" ? {
              scorer: event.scorer,
              team: event.scoringTeam
            } : null
          };

          self.onStateChange(stateData);
        }
      }
    };

    this.engine = new window.ThreeGameEngine(canvas, options);
    window.NVC = this.engine;

    // Proxy the input so virtual touch controls add/remove keys to input.keys
    this.input = {
      virtual: new Proxy({}, {
        set: (target, key, val) => {
          target[key] = val;
          self.syncVirtualInputToKeys(key, val);
          return true;
        }
      })
    };

    // Proxy the camera
    this.camera = new Proxy({}, {
      get: (target, prop) => {
        if (prop === "ballcam") {
          return self.engine.rig ? self.engine.rig.ballCam : true;
        }
        return target[prop];
      },
      set: (target, prop, val) => {
        if (prop === "ballcam" && self.engine.rig) {
          self.engine.rig.ballCam = !!val;
        }
        target[prop] = val;
        return true;
      }
    });

    // Audio interface
    this.audio = {
      setMaster: (vol) => {
        if (self.engine.audio && typeof self.engine.audio.setVolume === "function") {
          self.engine.audio.setVolume(vol);
        }
      },
      setSfx: (vol) => {
        // SFX can be set here if needed, or is a no-op
      },
      setVolumes: () => {}
    };
  }

  // Getters to match App.tsx references to world, like world.state, world.cars, world.setupKickoff
  get world() {
    const self = this;
    return new Proxy(this.engine.world || {}, {
      get: (target, prop) => {
        if (prop === "setupKickoff") {
          return () => {
            if (typeof self.engine.resetKickoff === "function") {
              self.engine.resetKickoff(true);
              self.engine.setState("KICKOFF");
            }
          };
        }
        if (prop === "state") {
          return self.engine.state;
        }
        return target[prop];
      },
      set: (target, prop, val) => {
        if (prop === "state") {
          if (typeof self.engine.setState === "function") {
            self.engine.setState(val);
          }
        }
        target[prop] = val;
        return true;
      }
    });
  }

  // Map virtual touch button events to keycodes in the input Set
  syncVirtualInputToKeys(key, val) {
    if (!this.engine.input || !this.engine.input.keys) return;
    const keys = this.engine.input.keys;

    switch (key) {
      case "throttle":
        if (val > 0) {
          keys.add("KeyW");
          keys.delete("KeyS");
        } else if (val < 0) {
          keys.add("KeyS");
          keys.delete("KeyW");
        } else {
          keys.delete("KeyW");
          keys.delete("KeyS");
        }
        break;
      case "steer":
        if (val < 0) {
          keys.add("KeyA");
          keys.delete("KeyD");
        } else if (val > 0) {
          keys.add("KeyD");
          keys.delete("KeyA");
        } else {
          keys.delete("KeyA");
          keys.delete("KeyD");
        }
        break;
      case "jump":
        if (val) {
          keys.add("Space");
        } else {
          keys.delete("Space");
        }
        break;
      case "boost":
        if (val) {
          keys.add("ShiftLeft");
        } else {
          keys.delete("ShiftLeft");
        }
        break;
      case "slide":
        if (val) {
          keys.add("ControlLeft");
        } else {
          keys.delete("ControlLeft");
        }
        break;
      case "rollLeft":
        if (val) {
          keys.add("KeyQ");
        } else {
          keys.delete("KeyQ");
        }
        break;
      case "rollRight":
        if (val) {
          keys.add("KeyE");
        } else {
          keys.delete("KeyE");
        }
        break;
      default:
        break;
    }
  }

  init() {
    this.engine.load((p, label) => {
      console.log(`Loading Assets: ${Math.round(p * 100)}% - ${label}`);
    }).then(() => {
      this.start();
    });
    return true;
  }

  start() {
    this.running = true;
    this.engine.start();
  }

  startMatch(teamSize, playerTeam, botSkill) {
    if (this.engine.audio) {
      this.engine.audio.init();
      this.engine.audio.resume();
    }

    const mode = teamSize === 0 ? "freeplay" : "match";
    this.engine.setupMatch(mode, {
      teamSize: teamSize || 3,
      difficulty: botSkill === 0 ? "rookie" : botSkill === 1 ? "pro" : "allstar",
      minutes: 5
    });
    this.engine.canvas.focus();
  }

  toggleBallcam() {
    if (this.engine.rig) {
      this.engine.rig.ballCam = !this.engine.rig.ballCam;
      return this.engine.rig.ballCam;
    }
    return false;
  }

  pause() {
    if (typeof this.engine.togglePause === "function") {
      this.engine.togglePause();
    }
  }

  stop() {
    this.running = false;
    if (typeof this.engine.destroy === "function") {
      this.engine.destroy();
    }
  }
}
