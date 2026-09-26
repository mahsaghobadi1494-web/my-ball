import fs from 'fs';

const p = new URL('../src/game/config.js', import.meta.url);
let s = fs.readFileSync(p, 'utf8');

const from = `    boostThreshold: 34,
    dodgeRange: 2.9
  },`;
const to = `    boostThreshold: 34,
    dodgeRange: 2.9,
    // Higher-fidelity trajectory used by the bot brain (independent of the visual prediction line)
    brainHorizon: 4.2,
    brainStep: 1 / 45,
    brainRate: 30,        // Hz - how often the shared ball trajectory is rebuilt
    planRate: 24,         // Hz - how often team roles / play plans are rebuilt
    steerSmooth: 12.0,    // steering servo rate (per second)
    aimError: true        // level-driven aim error enabled
  },
  demo: {
    enabled: true,
    minSpeed: 20.0,       // minimum closing speed (m/s) for a demolition
    minAttackerSpeed: 15.0,
    speedEdge: 3.5,       // attacker must be this much faster than the victim
    range: 3.35,          // centre-to-centre distance that counts as a hit
    respawn: 3.0,         // seconds out of play after being demolished
    immunity: 3.6,        // seconds of demolition immunity after respawning
    cooldown: 3.2         // attacker cooldown after a successful demolition
  },`;

if (s.indexOf(from) < 0) { console.error('ANCHOR NOT FOUND'); process.exit(1); }
s = s.replace(from, to);
fs.writeFileSync(p, s);
console.log('config.js patched OK');
