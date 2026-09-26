// @ts-nocheck
/**
 * Direct Touch Input Manager & Polling Engine
 * 
 * Provides zero-latency, direct hardware polling for mobile touch controls:
 * - Direct native pointer event delegation (eliminates React synthetic event overhead)
 * - Zero-allocation input buffer polled directly every physics frame
 * - Direct GPU hardware transform on analog joystick knob (bypasses React render loop)
 * - Real-time multi-touch tracking with pointer capture
 */

export const TouchInput = {
  // Directly polled input state
  state: {
    throttle: 0,     // -1 (reverse) to +1 (forward)
    steer: 0,        // -1 (left) to +1 (right)
    gas: false,
    brake: false,
    steerLeft: false,
    steerRight: false,
    pitch: 0,
    yaw: 0,
    roll: 0,
    jump: false,
    jumpEdge: false,
    boost: false,
    slide: false,
    rollLeft: false,
    rollRight: false,
    airRollHeld: false,
    ballcamToggle: false
  },

  // Internal pointer tracking
  _activePointers: new Map(), // pointerId -> action string
  _joystickPointerId: null,
  _joystickOrigin: { x: 0, y: 0, radius: 48 },
  _joystickOffset: { x: 0, y: 0 },
  _joystickBaseEl: null,
  _joystickKnobEl: null,
  _containerEl: null,
  _prevJump: false,
  _attached: false,

  // External toggle handler callback for Ballcam (e.g., to notify UI)
  onBallcamToggle: null,

  /**
   * Direct vibration / haptic feedback
   */
  haptic: function (ms = 12) {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(ms);
      }
    } catch (_) {}
  },

  /**
   * Attach high-performance native pointer listeners to the touch container
   */
  attach: function (containerEl) {
    if (this._attached && this._containerEl === containerEl) return;
    this.detach();

    if (!containerEl) return;
    this._containerEl = containerEl;

    var self = this;

    this._onPointerDown = function (e) {
      var target = e.target;
      var actionEl = target ? target.closest("[data-touch-action]") : null;
      var isJoystick = target ? target.closest("[data-touch-joystick]") : null;

      if (!actionEl && !isJoystick) return;

      e.preventDefault();
      e.stopPropagation();

      if (isJoystick && self._joystickPointerId === null) {
        self._joystickPointerId = e.pointerId;
        self._setupJoystickGeometry(isJoystick, e.clientX, e.clientY);
        self._updateJoystickPosition(e.clientX, e.clientY);
        self.haptic(10);
        if (self._joystickKnobEl) {
          self._joystickKnobEl.classList.add("touch-knob-active");
          self._joystickKnobEl.style.transition = "none";
        }
      } else if (actionEl) {
        var action = actionEl.getAttribute("data-touch-action");
        if (action) {
          self._activePointers.set(e.pointerId, { action: action, element: actionEl });
          actionEl.classList.add("touch-btn-pressed");
          self.haptic(14);
          self._handleActionState(action, true);
        }
      }
    };

    this._onPointerMove = function (e) {
      if (e.pointerId === self._joystickPointerId) {
        // If mouse release occurred without pointerup (e.g. outside window)
        if (e.pointerType === "mouse" && e.buttons === 0) {
          self._resetJoystick();
          return;
        }
        e.preventDefault();
        self._updateJoystickPosition(e.clientX, e.clientY);
      }
    };

    this._onPointerUp = function (e) {
      if (e.pointerId === self._joystickPointerId) {
        e.preventDefault();
        self._resetJoystick();
      }
      if (self._activePointers.has(e.pointerId)) {
        e.preventDefault();
        var item = self._activePointers.get(e.pointerId);
        self._activePointers.delete(e.pointerId);
        if (item) {
          if (item.element) item.element.classList.remove("touch-btn-pressed");
          self._handleActionState(item.action, false);
        }
      }
    };

    this._onPointerCancel = function (e) {
      self._onPointerUp(e);
    };

    this._onWindowBlur = function () {
      self.releaseAll();
    };

    this._onTouchEnd = function (e) {
      if (!e.touches || e.touches.length === 0) {
        self.releaseAll();
      }
    };

    containerEl.addEventListener("pointerdown", this._onPointerDown, { passive: false });
    window.addEventListener("pointermove", this._onPointerMove, { passive: false });
    window.addEventListener("pointerup", this._onPointerUp, { passive: false });
    window.addEventListener("pointercancel", this._onPointerCancel, { passive: false });
    window.addEventListener("touchend", this._onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", this._onTouchEnd, { passive: true });
    window.addEventListener("blur", this._onWindowBlur);

    this._attached = true;
  },

  detach: function () {
    if (!this._attached) return;
    if (this._containerEl) {
      this._containerEl.removeEventListener("pointerdown", this._onPointerDown);
    }
    window.removeEventListener("pointermove", this._onPointerMove);
    window.removeEventListener("pointerup", this._onPointerUp);
    window.removeEventListener("pointercancel", this._onPointerCancel);
    window.removeEventListener("touchend", this._onTouchEnd);
    window.removeEventListener("touchcancel", this._onTouchEnd);
    window.removeEventListener("blur", this._onWindowBlur);

    this.releaseAll();
    this._attached = false;
    this._containerEl = null;
  },

  releaseAll: function () {
    this._resetJoystick();
    for (var it of this._activePointers.values()) {
      if (it.element) it.element.classList.remove("touch-btn-pressed");
      this._handleActionState(it.action, false);
    }
    this._activePointers.clear();
    this._resetState();
  },

  setJoystickElements: function (baseEl, knobEl) {
    this._joystickBaseEl = baseEl;
    this._joystickKnobEl = knobEl;
  },

  _setupJoystickGeometry: function (joystickEl) {
    var rect = joystickEl.getBoundingClientRect();
    this._joystickOrigin.x = rect.left + rect.width / 2;
    this._joystickOrigin.y = rect.top + rect.height / 2;
    this._joystickOrigin.radius = Math.max(26, rect.width / 2 - 10);
  },

  _updateJoystickPosition: function (clientX, clientY) {
    var rawDx = clientX - this._joystickOrigin.x;
    var rawDy = clientY - this._joystickOrigin.y;

    // Check if virtual landscape rotation (90deg CSS rotation) is active
    var isVirtLandscape = typeof document !== "undefined" && !!document.querySelector(".virtual-landscape-container");
    var dx = rawDx;
    var dy = rawDy;

    if (isVirtLandscape) {
      // In 90deg clockwise CSS rotation:
      // Visual Right is physical Down (+rawDy)
      // Visual Forward is physical Left (-rawDx)
      dx = rawDy;
      dy = -rawDx;
    }

    var dist = Math.sqrt(dx * dx + dy * dy);
    var maxR = this._joystickOrigin.radius || 40;

    // Floating/following joystick origin:
    // If the finger moves beyond max radius, slide the center origin along with it.
    // This completely eliminates control lag, sticking, and dead-travel when changing direction.
    if (dist > maxR) {
      var excess = dist - maxR;
      var moveX = (dx / dist) * excess;
      var moveY = (dy / dist) * excess;

      if (isVirtLandscape) {
        this._joystickOrigin.x -= moveY;
        this._joystickOrigin.y += moveX;
      } else {
        this._joystickOrigin.x += moveX;
        this._joystickOrigin.y += moveY;
      }

      dx = (dx / dist) * maxR;
      dy = (dy / dist) * maxR;
      dist = maxR;
    }

    this._joystickOffset.x = dx;
    this._joystickOffset.y = dy;

    // Direct GPU transform - zero latency without React reconciliation
    if (this._joystickKnobEl) {
      this._joystickKnobEl.style.transition = "none";
      this._joystickKnobEl.style.transform = "translate3d(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px, 0)";
    }

    // 1. Independent Steer Calculation (Horizontal Axis):
    // Full authority (-1 to +1) reaches 100% at 82% of travel, regardless of forward/back deflection!
    var deadzoneX = maxR * 0.08;
    var absX = Math.abs(dx);
    if (absX <= deadzoneX) {
      this.state.steer = 0;
    } else {
      var sgnX = dx > 0 ? 1 : -1;
      var normX = (absX - deadzoneX) / (maxR * 0.82 - deadzoneX);
      normX = Math.max(0, Math.min(1, normX));
      // Responsive power curve for fine micro-adjustments near center, crisp full-lock at edges
      this.state.steer = sgnX * Math.pow(normX, 1.05);
    }

    // 2. Independent Throttle Calculation (Vertical Axis: Up is -dy / forward):
    var deadzoneY = maxR * 0.10;
    var fwdY = -dy;
    var absY = Math.abs(fwdY);
    if (absY <= deadzoneY) {
      this.state.throttle = 0;
    } else {
      var sgnY = fwdY > 0 ? 1 : -1;
      var normY = (absY - deadzoneY) / (maxR * 0.82 - deadzoneY);
      normY = Math.max(0, Math.min(1, normY));
      this.state.throttle = sgnY * Math.pow(normY, 1.05);
    }

    if (this.state.airRollHeld) {
      this.state.pitch = this.state.throttle;
      this.state.yaw = 0;
      if (this.state.steer < -0.25) {
        this.state.rollLeft = true;
        this.state.rollRight = false;
      } else if (this.state.steer > 0.25) {
        this.state.rollRight = true;
        this.state.rollLeft = false;
      } else {
        this.state.rollLeft = false;
        this.state.rollRight = false;
      }
    } else {
      this.state.pitch = 0;
      this.state.yaw = this.state.steer;
      this.state.rollLeft = false;
      this.state.rollRight = false;
    }
  },

  _resetJoystick: function () {
    this._joystickPointerId = null;
    this._joystickOffset.x = 0;
    this._joystickOffset.y = 0;
    if (this._joystickKnobEl) {
      this._joystickKnobEl.style.transition = "transform 0.14s cubic-bezier(0.18, 0.89, 0.32, 1.28)";
      this._joystickKnobEl.style.transform = "translate3d(0, 0, 0)";
      this._joystickKnobEl.classList.remove("touch-knob-active");
    }
    this.state.steer = 0;
    this.state.throttle = 0;
    this.state.pitch = 0;
    this.state.yaw = 0;
    if (!this._activePointersActionExists("rollLeft")) this.state.rollLeft = false;
    if (!this._activePointersActionExists("rollRight")) this.state.rollRight = false;
  },

  _handleActionState: function (action, pressed) {
    var s = this.state;
    switch (action) {
      case "gas":
        s.gas = pressed;
        break;
      case "brake":
        s.brake = pressed;
        break;
      case "steerLeft":
        s.steerLeft = pressed;
        break;
      case "steerRight":
        s.steerRight = pressed;
        break;
      case "jump":
        s.jump = pressed;
        break;
      case "boost":
        s.boost = pressed;
        break;
      case "slide":
        s.slide = pressed;
        break;
      case "rollLeft":
        s.rollLeft = pressed;
        break;
      case "rollRight":
        s.rollRight = pressed;
        break;
      case "airRoll":
        s.airRollHeld = pressed;
        break;
      case "ballcam":
        if (pressed) {
          s.ballcamToggle = true;
          if (typeof this.onBallcamToggle === "function") {
            this.onBallcamToggle();
          }
        }
        break;
      default:
        break;
    }
  },

  _activePointersActionExists: function (action) {
    for (var it of this._activePointers.values()) {
      if (it.action === action) return true;
    }
    return false;
  },

  _resetState: function () {
    var s = this.state;
    s.throttle = 0;
    s.steer = 0;
    s.gas = false;
    s.brake = false;
    s.steerLeft = false;
    s.steerRight = false;
    s.pitch = 0;
    s.yaw = 0;
    s.roll = 0;
    s.jump = false;
    s.jumpEdge = false;
    s.boost = false;
    s.slide = false;
    s.rollLeft = false;
    s.rollRight = false;
    s.airRollHeld = false;
    s.ballcamToggle = false;
  },

  /**
   * Direct Input Polling Method
   * Sampled directly by GameEngine input update loop on every physics frame.
   * Returns current input state in O(1) time without allocations.
   */
  poll: function () {
    return this.state;
  }
};
