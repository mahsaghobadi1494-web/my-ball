// @ts-nocheck
import { TAU, PI, rad, clamp, lerp, V3, Quat, M4, m4perspective, m4ortho, m4lookAt, m4mul, m4compose, m3fromM4, tv, tc } from './math.js';
import { CFG, TEAM_COLOR, STADIUM_THEMES } from './config.js';
import { buildCarKit } from './carModels.js';

function parseHex(h, fallback) {
  if (!h || typeof h !== 'string') return fallback;
  var str = h.replace('#', '').trim();
  if (str.length === 3) str = str[0] + str[0] + str[1] + str[1] + str[2] + str[2];
  if (str.length !== 6) return fallback;
  var n = parseInt(str, 16);
  if (isNaN(n)) return fallback;
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function makeCanvas(size) {
  var c = document.createElement("canvas");
  c.width = c.height = size;
  return c;
}

export function texField(A, themeKey) {
  themeKey = themeKey || (CFG.gfx && CFG.gfx.stadiumTheme) || "NEON_VELOCITY";
  var theme = STADIUM_THEMES[themeKey] || STADIUM_THEMES.NEON_VELOCITY;

  var S = 1024, c = makeCanvas(S), g = c.getContext("2d");
  var W = A.hx * 2, L = A.hz * 2;
  var px = S / W, pz = S / L;

  // 1. Sleek dark asphalt/tartan perimeter safety apron (between pitch and wall)
  g.fillStyle = "#12161f";
  g.fillRect(0, 0, S, S);

  // Subtle apron grip texture
  g.fillStyle = "rgba(255,255,255,0.02)";
  for (var ap = 0; ap < 3000; ap++) {
    g.fillRect(Math.random() * S, Math.random() * S, 2, 2);
  }

  // 2. Main Soccer Pitch Area (Covering full playable arena up to perimeter glass walls)
  var marginX = 0.4; // Extends right up to arena curved walls
  var marginZ = 0.4;
  var pLeft = (-A.hx + marginX + A.hx) * px;
  var pRight = (A.hx - marginX + A.hx) * px;
  var pTop = (-A.hz + marginZ + A.hz) * pz;
  var pBottom = (A.hz - marginZ + A.hz) * pz;
  var pWidth = pRight - pLeft;
  var pHeight = pBottom - pTop;

  // High quality manicured pitch grass (Clip to arena floor with rounded corners)
  g.save();
  var pitchCornerRadius = (A.cornerFillet ? A.cornerFillet * 0.95 : 11.5) * px;
  g.beginPath();
  if (typeof g.roundRect === "function") {
    g.roundRect(pLeft, pTop, pWidth, pHeight, pitchCornerRadius);
  } else {
    g.rect(pLeft, pTop, pWidth, pHeight);
  }
  g.clip();

  // Natural stadium turf stripes with smooth manicured finish
  var nStripes = 20;
  var stripeH = pHeight / nStripes;
  for (var s = 0; s < nStripes; s++) {
    g.fillStyle = (s % 2 === 0) ? theme.turfStripe1 : theme.turfStripe2;
    g.fillRect(pLeft, pTop + s * stripeH, pWidth, stripeH);
  }

  // Soft team side gradient washes
  var grd = g.createLinearGradient(0, pTop, 0, pBottom);
  grd.addColorStop(0.00, theme.team1Grad || "rgba(255,140,50,0.18)");
  grd.addColorStop(0.38, "rgba(0,0,0,0)");
  grd.addColorStop(0.62, "rgba(0,0,0,0)");
  grd.addColorStop(1.00, theme.team0Grad || "rgba(40,160,255,0.18)");
  g.fillStyle = grd;
  g.fillRect(pLeft, pTop, pWidth, pHeight);

  // Regulation Soccer Pitch Lines (Crisp white lines)
  g.lineCap = "round";
  var lineCol = theme.lineColor || "#ffffff";
  var lw = 0.38 * px; // ~38cm crisp regulation line width
  g.strokeStyle = lineCol;
  g.lineWidth = lw;

  function toPxX(x) { return (x + A.hx) * px; }
  function toPxZ(z) { return (z + A.hz) * pz; }

  // 1. Touchlines & Goal lines (Outer pitch perimeter)
  var minX = -A.hx + marginX, maxX = A.hx - marginX;
  var minZ = -A.hz + marginZ, maxZ = A.hz - marginZ;

  g.beginPath();
  g.strokeRect(toPxX(minX), toPxZ(minZ), (maxX - minX) * px, (maxZ - minZ) * pz);

  // 2. Half-way center line
  g.beginPath();
  g.moveTo(toPxX(minX), toPxZ(0));
  g.lineTo(toPxX(maxX), toPxZ(0));
  g.stroke();

  // 3. Center circle & kick-off spot
  g.beginPath();
  g.arc(toPxX(0), toPxZ(0), 9.15 * px, 0, TAU);
  g.stroke();

  g.fillStyle = lineCol;
  g.beginPath();
  g.arc(toPxX(0), toPxZ(0), 0.55 * px, 0, TAU);
  g.fill();

  // 4. Penalty Boxes (Both Ends)
  var penHalfW = 14.5;
  var penDepth = 12.0;
  for (var side = -1; side <= 1; side += 2) {
    var goalZ = side * maxZ;
    var penZ = side * (maxZ - penDepth);
    // Penalty box
    g.beginPath();
    g.moveTo(toPxX(-penHalfW), toPxZ(goalZ));
    g.lineTo(toPxX(-penHalfW), toPxZ(penZ));
    g.lineTo(toPxX(penHalfW), toPxZ(penZ));
    g.lineTo(toPxX(penHalfW), toPxZ(goalZ));
    g.stroke();

    // Goal area (6-yard box)
    var gaHalfW = 7.5;
    var gaDepth = 5.0;
    var gaZ = side * (maxZ - gaDepth);
    g.beginPath();
    g.moveTo(toPxX(-gaHalfW), toPxZ(goalZ));
    g.lineTo(toPxX(-gaHalfW), toPxZ(gaZ));
    g.lineTo(toPxX(gaHalfW), toPxZ(gaZ));
    g.lineTo(toPxX(gaHalfW), toPxZ(goalZ));
    g.stroke();

    // Penalty kick spot
    var spotZ = side * (maxZ - 8.0);
    g.beginPath();
    g.arc(toPxX(0), toPxZ(spotZ), 0.5 * px, 0, TAU);
    g.fill();

    // Penalty D-arc outside box
    g.beginPath();
    var arcStart = side > 0 ? 1.15 * PI : 0.15 * PI;
    var arcEnd   = side > 0 ? 1.85 * PI : 0.85 * PI;
    g.arc(toPxX(0), toPxZ(spotZ), 6.5 * px, arcStart, arcEnd);
    g.stroke();
  }

  // 5. Four Corner Kick Arcs
  var cr = 1.8 * px;
  var corners = [
    [toPxX(minX), toPxZ(minZ), 0, 0.5 * PI],
    [toPxX(maxX), toPxZ(minZ), 0.5 * PI, PI],
    [toPxX(maxX), toPxZ(maxZ), PI, 1.5 * PI],
    [toPxX(minX), toPxZ(maxZ), 1.5 * PI, 2.0 * PI]
  ];
  for (var ci = 0; ci < 4; ci++) {
    var q = corners[ci];
    g.beginPath();
    g.arc(q[0], q[1], cr, q[2], q[3]);
    g.stroke();
  }

  g.restore(); // Restore clip
  return c;
}

export function texPanel() {
  var S = 256, c = makeCanvas(S), g = c.getContext("2d");
  g.fillStyle = "#191b24"; g.fillRect(0, 0, S, S);
  g.strokeStyle = "rgba(255,255,255,0.055)"; g.lineWidth = 2;
  for (var i = 0; i <= 4; i++) {
    g.beginPath(); g.moveTo(i * S / 4, 0); g.lineTo(i * S / 4, S); g.stroke();
    g.beginPath(); g.moveTo(0, i * S / 4); g.lineTo(S, i * S / 4); g.stroke();
  }
  g.fillStyle = "rgba(255,255,255,0.028)";
  for (var y = 0; y < 4; y++) for (var x = 0; x < 4; x++) if ((x + y) % 2 === 0) g.fillRect(x * S / 4 + 3, y * S / 4 + 3, S / 4 - 6, S / 4 - 6);
  return c;
}

export function texNet() {
  var S = 128, c = makeCanvas(S), g = c.getContext("2d");
  g.clearRect(0, 0, S, S);
  g.strokeStyle = "rgba(226,232,244,0.85)"; g.lineWidth = 2.2;
  for (var i = 0; i <= 8; i++) {
    g.beginPath(); g.moveTo(i * S / 8, 0); g.lineTo(i * S / 8, S); g.stroke();
    g.beginPath(); g.moveTo(0, i * S / 8); g.lineTo(S, i * S / 8); g.stroke();
  }
  return c;
}

export function texNetWall() {
  // Delicate transparent diamond wire mesh for walls and roof ramps
  // ("طوری که خیلی تورش معلوم نباشه! یه مقدار میخوام بیرون استادیوم دیده بشه")
  var S = 256, c = makeCanvas(S), g = c.getContext("2d");
  g.clearRect(0, 0, S, S);

  // High-tension delicate diamond mesh wires (clear transparent gaps)
  g.strokeStyle = "rgba(255, 255, 255, 0.70)";
  g.lineWidth = 1.0;
  var step = 24;
  for (var d = -S; d <= S * 2; d += step) {
    g.beginPath();
    g.moveTo(d, 0);
    g.lineTo(d + S, S);
    g.stroke();
    g.beginPath();
    g.moveTo(d, S);
    g.lineTo(d + S, 0);
    g.stroke();
  }

  // Delicate glowing junction nodes
  g.fillStyle = "rgba(255, 255, 255, 0.85)";
  for (var y = 0; y <= S; y += step) {
    for (var x = (y % (step * 2) === 0 ? 0 : step); x <= S; x += step * 2) {
      g.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
    }
  }
  return c;
}

export function texSky(themeKey) {
  var activeTheme = themeKey || (CFG.gfx && CFG.gfx.stadiumTheme) || "NEON_CHAMPIONSHIP";
  var W = 1024, H = 512, c = makeCanvas(W);
  c.height = H;
  var g = c.getContext("2d");

  if (activeTheme === "CYBER_SUNSET") {
    // Synthwave / Cyberpunk Sunset Sky
    var grd = g.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0.00, "#12002b"); // Deep cosmic violet zenith
    grd.addColorStop(0.25, "#2d0b4d"); // Rich twilight purple
    grd.addColorStop(0.50, "#6c115e"); // Hot magenta
    grd.addColorStop(0.72, "#b82645"); // Crimson twilight
    grd.addColorStop(0.88, "#e85d26"); // Golden amber
    grd.addColorStop(1.00, "#ffb830"); // Blazing horizon gold
    g.fillStyle = grd;
    g.fillRect(0, 0, W, H);

    // Stars & celestial sparkles in the upper sky
    g.fillStyle = "#ffffff";
    for (var s = 0; s < 120; s++) {
      var sx = (s * 47) % W, sy = (s * 29) % (H * 0.45);
      var sAlpha = 0.3 + ((s % 5) * 0.15);
      g.globalAlpha = sAlpha;
      g.fillRect(sx, sy, (s % 3 === 0) ? 2.2 : 1.4, (s % 3 === 0) ? 2.2 : 1.4);
    }
    g.globalAlpha = 1.0;

    // Giant Glowing Retrowave / Synthwave Sun
    var sunX = W * 0.35, sunY = H * 0.62, sunR = 85;
    var sGlow = g.createRadialGradient(sunX, sunY, sunR * 0.2, sunX, sunY, sunR * 2.8);
    sGlow.addColorStop(0, "rgba(255, 230, 100, 0.95)");
    sGlow.addColorStop(0.35, "rgba(255, 60, 140, 0.45)");
    sGlow.addColorStop(0.75, "rgba(180, 20, 120, 0.15)");
    sGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    g.fillStyle = sGlow;
    g.beginPath(); g.arc(sunX, sunY, sunR * 2.8, 0, TAU); g.fill();

    // Solid Sun disk with horizontal laser slice bands
    g.save();
    g.beginPath(); g.arc(sunX, sunY, sunR, 0, TAU); g.clip();
    var sunGrad = g.createLinearGradient(sunX, sunY - sunR, sunX, sunY + sunR);
    sunGrad.addColorStop(0.0, "#fff59d");
    sunGrad.addColorStop(0.4, "#ff80ab");
    sunGrad.addColorStop(1.0, "#ff1744");
    g.fillStyle = sunGrad;
    g.fillRect(sunX - sunR, sunY - sunR, sunR * 2, sunR * 2);

    // Horizontal laser slices in lower half of sun
    for (var slice = 0; slice < 7; slice++) {
      var sliceY = sunY - 10 + slice * 14;
      var sliceH = 2.0 + slice * 1.2;
      g.fillStyle = "#2d0b4d";
      g.fillRect(sunX - sunR, sliceY, sunR * 2, sliceH);
    }
    g.restore();

    // Horizon Neon Wireframe Grid / Mountain Silhouettes
    g.fillStyle = "#0c0418";
    g.beginPath();
    g.moveTo(0, H);
    for (var mx = 0; mx <= W; mx += 32) {
      var my = H * 0.82 + Math.sin(mx * 0.015) * 22 + Math.cos(mx * 0.04) * 14;
      g.lineTo(mx, my);
    }
    g.lineTo(W, H); g.closePath(); g.fill();

    // Glowing horizon laser line
    g.strokeStyle = "#ff4081";
    g.lineWidth = 2.5;
    g.beginPath();
    for (var lx = 0; lx <= W; lx += 32) {
      var ly = H * 0.82 + Math.sin(lx * 0.015) * 22 + Math.cos(lx * 0.04) * 14;
      if (lx === 0) g.moveTo(lx, ly); else g.lineTo(lx, ly);
    }
    g.stroke();

    return c;
  }

  if (activeTheme === "COSMIC_AURORA") {
    // Starlight & Cosmic Aurora Sky
    var grd = g.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0.00, "#020712"); // Deep void zenith
    grd.addColorStop(0.35, "#061324"); // Indigo space
    grd.addColorStop(0.65, "#092233"); // Deep teal twilight
    grd.addColorStop(1.00, "#0e3a47"); // Luminous emerald horizon
    g.fillStyle = grd;
    g.fillRect(0, 0, W, H);

    // Dense star cluster and glowing cosmic dust
    for (var st = 0; st < 250; st++) {
      var stx = (st * 53) % W, sty = (st * 37) % (H * 0.75);
      var size = (st % 7 === 0) ? 2.5 : ((st % 3 === 0) ? 1.8 : 1.0);
      var bright = 0.4 + (st % 5) * 0.14;
      g.fillStyle = (st % 6 === 0) ? "rgba(100, 255, 220, " + bright + ")" : (st % 4 === 0 ? "rgba(220, 180, 255, " + bright + ")" : "rgba(255, 255, 255, " + bright + ")");
      g.fillRect(stx, sty, size, size);
    }

    // Sweeping Aurora Borealis Curtains
    g.save();
    g.globalCompositeOperation = "lighter";
    var numCurtains = 4;
    for (var cIdx = 0; cIdx < numCurtains; cIdx++) {
      var curCol = (cIdx % 2 === 0) ? "rgba(5, 255, 170, " : "rgba(180, 50, 255, ";
      var baseAy = 120 + cIdx * 45;
      for (var wave = 0; wave < 3; wave++) {
        var wGrad = g.createLinearGradient(0, baseAy - 60, 0, baseAy + 90);
        wGrad.addColorStop(0, curCol + "0.0)");
        wGrad.addColorStop(0.4, curCol + (0.35 - cIdx * 0.05) + ")");
        wGrad.addColorStop(1, curCol + "0.0)");
        g.fillStyle = wGrad;
        g.beginPath();
        g.moveTo(0, baseAy + 40);
        for (var ax = 0; ax <= W; ax += 20) {
          var ay = baseAy + Math.sin((ax + cIdx * 120) * 0.012) * 35 + Math.cos(ax * 0.025) * 18;
          g.lineTo(ax, ay);
        }
        g.lineTo(W, baseAy + 90);
        g.lineTo(0, baseAy + 90);
        g.closePath();
        g.fill();
      }
    }
    g.restore();

    return c;
  }

  if (activeTheme === "HYPERION_NIGHT" || activeTheme === "CYBER_DOME") {
    // Cyberpunk Metropolis & Indoor Truss Dome
    var grd = g.createLinearGradient(0, 0, 0, H);
    grd.addColorStop(0.00, "#080312"); // Deep obsidian
    grd.addColorStop(0.35, "#140824"); // Dark magenta haze
    grd.addColorStop(0.70, "#1f0d36"); // Glowing city atmospheric glow
    grd.addColorStop(1.00, "#321354"); // Vibrant neon horizon
    g.fillStyle = grd;
    g.fillRect(0, 0, W, H);

    // Towering distant holographic skyscraper silhouettes
    for (var b = 0; b < 24; b++) {
      var bx = b * 44;
      var bw = 24 + (b % 4) * 8;
      var bh = 90 + (b % 5) * 35 + Math.sin(b * 1.5) * 25;
      var by = H * 0.88 - bh;
      g.fillStyle = "#0c0418";
      g.fillRect(bx, by, bw, bh + 80);

      // Skyscraper neon window grids
      g.fillStyle = (b % 2 === 0) ? "rgba(255, 85, 212, 0.45)" : "rgba(80, 200, 255, 0.45)";
      for (var winY = by + 8; winY < by + bh; winY += 8) {
        for (var winX = bx + 4; winX < bx + bw - 4; winX += 6) {
          if ((winX + winY) % 3 !== 0) {
            g.fillRect(winX, winY, 2.5, 3.5);
          }
        }
      }
    }

    // Sky Searchlight Beams
    g.save();
    g.globalCompositeOperation = "lighter";
    var lights = [W * 0.2, W * 0.5, W * 0.8];
    for (var li = 0; li < lights.length; li++) {
      var lx = lights[li];
      var sGrad = g.createLinearGradient(lx, H * 0.85, lx + ((li % 2 === 0) ? 90 : -90), 0);
      sGrad.addColorStop(0, "rgba(255, 85, 212, 0.4)");
      sGrad.addColorStop(1, "rgba(80, 200, 255, 0.0)");
      g.fillStyle = sGrad;
      g.beginPath();
      g.moveTo(lx - 12, H * 0.85);
      g.lineTo(lx + ((li % 2 === 0) ? 140 : -140), 0);
      g.lineTo(lx + ((li % 2 === 0) ? 180 : -100), 0);
      g.lineTo(lx + 12, H * 0.85);
      g.closePath();
      g.fill();
    }
    g.restore();

    return c;
  }

  // Brilliant clear daytime championship sky gradient
  var grd = g.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0.00, "#0b52ba"); // Deep azure zenith
  grd.addColorStop(0.20, "#1f75fe"); // Vibrant sky blue
  grd.addColorStop(0.45, "#4892fe"); // Rich cerulean
  grd.addColorStop(0.70, "#7cb2fe"); // Soft atmospheric sky
  grd.addColorStop(0.88, "#afd0fe"); // Low horizon sun haze
  grd.addColorStop(1.00, "#eaf2fe"); // Radiant sunlit horizon
  g.fillStyle = grd;
  g.fillRect(0, 0, W, H);

  // Radiant Golden Daytime Sun with Solar Corona & God-Rays
  var sunX = W * 0.28, sunY = 160;

  // 1. Sun God-Rays (Volumetric Sunlight Beams)
  g.save();
  g.globalCompositeOperation = "lighter";
  var numRays = 18;
  for (var r = 0; r < numRays; r++) {
    var angle = (r / numRays) * TAU + 0.1;
    var rayLen = 220 + (r % 5) * 60;
    var rayWidth = 0.08 + (r % 3) * 0.04;
    g.beginPath();
    g.moveTo(sunX, sunY);
    g.arc(sunX, sunY, rayLen, angle - rayWidth, angle + rayWidth);
    g.closePath();
    var rayG = g.createRadialGradient(sunX, sunY, 10, sunX, sunY, rayLen);
    rayG.addColorStop(0, "rgba(255, 255, 240, 0.45)");
    rayG.addColorStop(0.4, "rgba(255, 235, 180, 0.20)");
    rayG.addColorStop(1, "rgba(255, 220, 150, 0)");
    g.fillStyle = rayG;
    g.fill();
  }

  // 2. Anamorphic Solar Lens Flare Streak
  var flareG = g.createLinearGradient(sunX - 350, sunY, sunX + 350, sunY);
  flareG.addColorStop(0, "rgba(255, 240, 180, 0)");
  flareG.addColorStop(0.35, "rgba(255, 245, 210, 0.25)");
  flareG.addColorStop(0.50, "rgba(255, 255, 255, 0.85)");
  flareG.addColorStop(0.65, "rgba(255, 245, 210, 0.25)");
  flareG.addColorStop(1, "rgba(255, 240, 180, 0)");
  g.fillStyle = flareG;
  g.fillRect(sunX - 350, sunY - 4, 700, 8);

  // 3. Wide Solar Outer Corona
  var sCorona = g.createRadialGradient(sunX, sunY, 10, sunX, sunY, 280);
  sCorona.addColorStop(0.00, "rgba(255, 255, 255, 1.0)");
  sCorona.addColorStop(0.10, "rgba(255, 252, 220, 0.90)");
  sCorona.addColorStop(0.30, "rgba(255, 230, 160, 0.45)");
  sCorona.addColorStop(0.60, "rgba(240, 215, 255, 0.15)");
  sCorona.addColorStop(1.00, "rgba(230, 240, 255, 0)");
  g.fillStyle = sCorona;
  g.beginPath();
  g.arc(sunX, sunY, 280, 0, TAU);
  g.fill();
  g.restore();

  // 4. Intense Solar Core Disk
  g.fillStyle = "#ffffff";
  g.beginPath();
  g.arc(sunX, sunY, 32, 0, TAU);
  g.fill();

  // Fluffy 3D Daytime Cumulus Clouds
  function drawCumulusCloud(cx, cy, scale) {
    var puffs = [
      { x: 0, y: 0, rx: 75 * scale, ry: 42 * scale },
      { x: -55 * scale, y: 8 * scale, rx: 50 * scale, ry: 32 * scale },
      { x: 55 * scale, y: 6 * scale, rx: 58 * scale, ry: 34 * scale },
      { x: -28 * scale, y: -18 * scale, rx: 48 * scale, ry: 38 * scale },
      { x: 26 * scale, y: -14 * scale, rx: 52 * scale, ry: 40 * scale }
    ];

    // Shaded underside
    for (var i = 0; i < puffs.length; i++) {
      var p = puffs[i];
      var ug = g.createRadialGradient(cx + p.x, cy + p.y + 12 * scale, 0, cx + p.x, cy + p.y + 12 * scale, p.rx);
      ug.addColorStop(0, "rgba(180, 210, 240, 0.65)");
      ug.addColorStop(0.65, "rgba(210, 228, 248, 0.35)");
      ug.addColorStop(1, "rgba(235, 245, 255, 0)");
      g.fillStyle = ug;
      g.beginPath();
      g.ellipse(cx + p.x, cy + p.y + 10 * scale, p.rx, p.ry, 0, 0, TAU);
      g.fill();
    }

    // Bright sunlit cloud tops
    for (var j = 0; j < puffs.length; j++) {
      var pt = puffs[j];
      var tg = g.createRadialGradient(cx + pt.x - 4 * scale, cy + pt.y - 8 * scale, 0, cx + pt.x, cy + pt.y, pt.rx);
      tg.addColorStop(0, "rgba(255, 255, 255, 0.98)");
      tg.addColorStop(0.72, "rgba(250, 252, 255, 0.88)");
      tg.addColorStop(1, "rgba(255, 255, 255, 0)");
      g.fillStyle = tg;
      g.beginPath();
      g.ellipse(cx + pt.x, cy + pt.y, pt.rx, pt.ry, 0, 0, TAU);
      g.fill();
    }
  }

  // Draw cloud formations across the sky
  drawCumulusCloud(W * 0.15, 140, 1.25);
  drawCumulusCloud(W * 0.42, 190, 1.45);
  drawCumulusCloud(W * 0.88, 220, 1.10);
  drawCumulusCloud(W * 0.60, 260, 0.95);
  drawCumulusCloud(W * 0.02, 240, 1.05);
  drawCumulusCloud(W * 0.30, 280, 0.85);
  drawCumulusCloud(W * 0.76, 160, 0.90);

  return c;
}

export function texBoostGlow() {
  var S = 256, c = makeCanvas(S), g = c.getContext("2d");
  var cx = S / 2, cy = S / 2;
  g.clearRect(0, 0, S, S);

  var gr = g.createRadialGradient(cx, cy, cx * 0.15, cx, cy, cx * 0.95);
  gr.addColorStop(0.00, "rgba(255, 230, 80, 0.90)");
  gr.addColorStop(0.35, "rgba(255, 175, 20, 0.55)");
  gr.addColorStop(0.70, "rgba(255, 120, 0, 0.18)");
  gr.addColorStop(1.00, "rgba(255, 100, 0, 0)");
  g.fillStyle = gr;
  g.beginPath(); g.arc(cx, cy, cx, 0, TAU); g.fill();

  g.strokeStyle = "rgba(255, 245, 180, 0.95)";
  g.lineWidth = 5;
  g.beginPath(); g.arc(cx, cy, cx * 0.72, 0, TAU); g.stroke();

  for (var i = 0; i < 12; i++) {
    var a = (i / 12) * TAU;
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * cx * 0.60, cy + Math.sin(a) * cx * 0.60);
    g.lineTo(cx + Math.cos(a) * cx * 0.84, cy + Math.sin(a) * cx * 0.84);
    g.stroke();
  }

  g.fillStyle = "rgba(255, 255, 255, 0.95)";
  for (var k = 0; k < 4; k++) {
    var ak = (k / 4) * TAU;
    g.save();
    g.translate(cx, cy);
    g.rotate(ak);
    g.beginPath();
    g.moveTo(0, -cx * 0.48);
    g.lineTo(cx * 0.14, -cx * 0.32);
    g.lineTo(0, -cx * 0.38);
    g.lineTo(-cx * 0.14, -cx * 0.32);
    g.closePath();
    g.fill();
    g.restore();
  }
  return c;
}

export function texBallSoccer() {
  var W = 1024, H = 512, c = makeCanvas(W), g = c.getContext("2d");
  c.height = H;

  // 1. Deep Solid Jet-Black Base
  g.fillStyle = "#111111";
  g.fillRect(0, 0, W, H);

  // 2. Exact 12 Icosahedron Pentagon Centers in Spherical Coordinates (phi, theta)
  var pentagons = [];
  pentagons.push({ phi: 0.0, th: 0.0 });
  pentagons.push({ phi: Math.PI, th: 0.0 });
  var phi1 = Math.atan(0.5); // ~26.565 deg
  var phiRing1 = Math.PI * 0.5 - phi1; // Northern ring (~63.43 deg)
  var phiRing2 = Math.PI * 0.5 + phi1; // Southern ring
  for (var k = 0; k < 5; k++) {
    pentagons.push({ phi: phiRing1, th: (k / 5) * TAU });
    pentagons.push({ phi: phiRing2, th: ((k + 0.5) / 5) * TAU });
  }

  function sphToCart(phi, th) {
    return {
      x: Math.sin(phi) * Math.cos(th),
      y: Math.cos(phi),
      z: Math.sin(phi) * Math.sin(th)
    };
  }

  var imgData = g.getImageData(0, 0, W, H);
  var data = imgData.data;

  var pCenters3D = pentagons.map(function (p) { return sphToCart(p.phi, p.th); });
  var pentRad = 0.38; // Bold, classic pentagon radius

  for (var y = 0; y < H; y++) {
    var v = y / H;
    var phi = v * Math.PI;
    var sinPhi = Math.sin(phi);
    var cosPhi = Math.cos(phi);

    for (var x = 0; x < W; x++) {
      var u = x / W;
      var th = u * TAU;

      var px = sinPhi * Math.cos(th);
      var py = cosPhi;
      var pz = sinPhi * Math.sin(th);

      var minDist = 999.0;
      var secondDist = 999.0;
      for (var pi = 0; pi < pCenters3D.length; pi++) {
        var pc = pCenters3D[pi];
        var dot = px * pc.x + py * pc.y + pz * pc.z;
        dot = Math.max(-1.0, Math.min(1.0, dot));
        var angDist = Math.acos(dot);
        if (angDist < minDist) {
          secondDist = minDist;
          minDist = angDist;
        } else if (angDist < secondDist) {
          secondDist = angDist;
        }
      }

      var idx = (y * W + x) * 4;

      // Classic Soccer Ball: 12 Solid Pitch-Black Pentagons & 20 Pure White Hexagons
      // A. Pitch-Black Pentagon Panels
      if (minDist < pentRad * 0.85) {
        var pDist = minDist / (pentRad * 0.85);
        var lum = Math.floor(15 + (1.0 - pDist) * 12);
        data[idx] = lum;
        data[idx + 1] = lum;
        data[idx + 2] = lum;
        // Domed center height peaking at 255 for deep 3D relief
        var pHeight = Math.floor(140 + Math.cos(pDist * Math.PI * 0.5) * 115);
        data[idx + 3] = pHeight;
      }
      // B. Deep Recessed Canyon Trench around Pentagon
      else if (minDist < pentRad + 0.035) {
        var seamDist = Math.abs(minDist - pentRad) / 0.035;
        var seamVal = Math.floor(8 + seamDist * 20);
        data[idx] = seamVal;
        data[idx + 1] = seamVal;
        data[idx + 2] = seamVal;
        // Deep canyon height in alpha channel for extreme 3D bump depth
        data[idx + 3] = Math.floor(15 + seamDist * 105);
      }
      // C. Pure White Hexagonal Panels with Pillowed 3D Doming
      else {
        var seamDiff = Math.abs(minDist - secondDist);
        if (seamDiff < 0.032) {
          // Hexagonal Boundary Seam Canyon (Deep Valley)
          var hexProfile = seamDiff / 0.032;
          var hexGroove = Math.floor(8 + hexProfile * 30);
          data[idx] = hexGroove;
          data[idx + 1] = hexGroove;
          data[idx + 2] = hexGroove;
          data[idx + 3] = Math.floor(15 + hexProfile * 105);
        } else {
          // Pure Crisp White Hexagon Panel
          var distToEdge = Math.min(minDist - (pentRad + 0.035), seamDiff - 0.032);
          var pillow = Math.sin(Math.min(1.0, distToEdge / 0.09) * (Math.PI * 0.5));
          
          var wVal = Math.floor(240 + pillow * 15);
          data[idx] = wVal;
          data[idx + 1] = wVal;
          data[idx + 2] = wVal;
          // Domed pillow height peaking at 255 at panel center
          data[idx + 3] = Math.floor(120 + pillow * 135);
        }
      }
    }
  }

  g.putImageData(imgData, 0, 0);
  return c;
}

export function texBallCurvy() {
  var W = 1024, H = 512, c = makeCanvas(W), g = c.getContext("2d");
  c.height = H;
  var imgData = g.createImageData(W, H);
  var data = imgData.data;

  for (var y = 0; y < H; y++) {
    var v = y / H, phi = v * Math.PI;
    var sinPhi = Math.sin(phi), cosPhi = Math.cos(phi);

    for (var x = 0; x < W; x++) {
      var u = 1.0 - (x / W), th = (x / W) * TAU;
      var px = sinPhi * Math.cos(th);
      var py = cosPhi;
      var pz = sinPhi * Math.sin(th);

      // 18-panel 3D Aerodynamic Swirl Layout
      var angle3d = Math.atan2(pz, px) + py * 1.8;
      var band = Math.floor(((angle3d + TAU * 10) % TAU) / (TAU / 12.0));
      var bandProgress = (((angle3d + TAU * 10) % TAU) % (TAU / 12.0)) / (TAU / 12.0);

      // Seam distance between panels
      var seamDist = Math.abs(bandProgress - 0.5) * 2.0; // 1.0 at edge, 0.0 at center

      var r = 255, gCol = 255, b = 255;
      if (band % 3 === 0) {
        // Deep Royal Blue (#003da5)
        r = 0; gCol = 61; b = 165;
      } else if (band % 3 === 1) {
        // Vibrant Golden Yellow (#ffc200)
        r = 255; gCol = 194; b = 0;
      } else {
        // Crisp Pearl White (#f8fafc)
        r = 248; gCol = 250; b = 252;
      }

      var idx = (y * W + x) * 4;

      if (seamDist > 0.88) {
        // Deep Recessed 3D Seam Channel
        var edgeRatio = (seamDist - 0.88) / 0.12;
        var dark = Math.floor(12 + (1.0 - edgeRatio) * 30);
        data[idx] = dark;
        data[idx + 1] = dark;
        data[idx + 2] = dark;
        data[idx + 3] = Math.floor(15 + (1.0 - edgeRatio) * 90);
      } else {
        // Pillowed 3D Aerodynamic Panel
        var pillow = Math.sin((seamDist / 0.88) * (Math.PI * 0.5));
        var pHeight = Math.floor(140 + (1.0 - pillow) * 115);
        data[idx] = r;
        data[idx + 1] = gCol;
        data[idx + 2] = b;
        data[idx + 3] = pHeight;
      }
    }
  }

  g.putImageData(imgData, 0, 0);
  return c;
}

export function texBallVolleyball() {
  var W = 1024, H = 512, c = makeCanvas(W), g = c.getContext("2d");
  c.height = H;
  var imgData = g.createImageData(W, H);
  var data = imgData.data;

  // Authentic 18-Panel Classic Olympic Volleyball (6 cubic faces, 3 parallel panels per face)
  for (var y = 0; y < H; y++) {
    var v = y / H, phi = v * Math.PI;
    var sinPhi = Math.sin(phi), cosPhi = Math.cos(phi);

    for (var x = 0; x < W; x++) {
      var u = 1.0 - (x / W), th = (x / W) * TAU;
      var px = sinPhi * Math.cos(th);
      var py = cosPhi;
      var pz = sinPhi * Math.sin(th);

      var ax = Math.abs(px), ay = Math.abs(py), az = Math.abs(pz);

      var face = 0; // 0: Y, 1: X, 2: Z
      var pCoord = 0;
      var e1 = 0, e2 = 0;

      if (ay >= ax && ay >= az) {
        face = 0;
        pCoord = pz / ay;
        e1 = ax / ay;
        e2 = az / ay;
      } else if (ax >= ay && ax >= az) {
        face = 1;
        pCoord = py / ax;
        e1 = ay / ax;
        e2 = az / ax;
      } else {
        face = 2;
        pCoord = px / az;
        e1 = ax / az;
        e2 = ay / az;
      }

      // Convert pCoord (-1.0 to 1.0) into 3 panel strips
      var panelPos = (pCoord + 1.0) * 1.5; // 0.0 to 3.0
      var stripIdx = Math.min(2, Math.floor(panelPos));
      var inStrip = panelPos - stripIdx - 0.5; // -0.5 to 0.5

      // Distance to inner panel seam
      var dStripSeam = Math.abs(0.5 - Math.abs(inStrip)) * (2.0 / 3.0);

      // Distance to face boundary seam
      var dBoundarySeam = Math.min(1.0 - e1, 1.0 - e2);

      var seamDist = Math.min(dStripSeam, dBoundarySeam);

      // Color scheme per face and strip: Classic White, Royal Blue (#0033cc), Golden Yellow (#ffcc00)
      var colorKey = (face * 3 + stripIdx) % 3;
      var r = 255, gCol = 255, b = 255;
      if (colorKey === 1) {
        // Mikasa Royal Blue (#0044cc)
        r = 0; gCol = 68; b = 204;
      } else if (colorKey === 2) {
        // Golden Yellow (#ffcc00)
        r = 255; gCol = 204; b = 0;
      } else {
        // Pearl White (#f4f6fa)
        r = 244; gCol = 246; b = 250;
      }

      var idx = (y * W + x) * 4;

      if (seamDist < 0.045) {
        // Recessed Dark Stitched Volleyball Seam Groove
        var seamProfile = seamDist / 0.045;
        var dark = Math.floor(18 + seamProfile * 25);
        data[idx] = dark;
        data[idx + 1] = dark + 2;
        data[idx + 2] = dark + 6;
        // Deep height canyon for 3D bump relief
        data[idx + 3] = Math.floor(15 + seamProfile * 90);
      } else {
        // Pillowed 3D Leather Panel Surface
        var pDist = (seamDist - 0.045) / 0.25;
        var pillow = Math.sin(Math.min(1.0, pDist) * (Math.PI * 0.5));
        
        // Micro-leather texture grain
        var grain = (Math.sin(px * 180.0) * Math.cos(py * 180.0)) * 6;

        data[idx] = Math.min(255, Math.max(0, Math.floor(r + grain)));
        data[idx + 1] = Math.min(255, Math.max(0, Math.floor(gCol + grain)));
        data[idx + 2] = Math.min(255, Math.max(0, Math.floor(b + grain)));
        // Domed panel heightmap peaking at 245
        data[idx + 3] = Math.floor(145 + pillow * 100);
      }
    }
  }

  g.putImageData(imgData, 0, 0);

  // Official Pro Volleyball Stamp
  g.fillStyle = "#ffcc00";
  g.font = "bold 24px sans-serif";
  g.textAlign = "center";
  g.shadowColor = "rgba(0,0,0,0.8)";
  g.shadowBlur = 4;
  g.fillText("★ MIKASA PRO 18 ★", W * 0.5, H * 0.48);
  g.fillStyle = "#ffffff";
  g.font = "16px monospace";
  g.fillText("OFFICIAL FIVB MATCH", W * 0.5, H * 0.54);

  return c;
}

export function texBallRocketLeague() {
  var W = 1024, H = 512, c = makeCanvas(W), g = c.getContext("2d");
  c.height = H;

  // 12 Icosahedron Pentagon Centers in Spherical Coordinates
  var pentagons = [];
  pentagons.push({ phi: 0.0, th: 0.0 });
  pentagons.push({ phi: Math.PI, th: 0.0 });
  var phi1 = Math.atan(0.5);
  var phiRing1 = Math.PI * 0.5 - phi1;
  var phiRing2 = Math.PI * 0.5 + phi1;
  for (var k = 0; k < 5; k++) {
    pentagons.push({ phi: phiRing1, th: (k / 5) * TAU });
    pentagons.push({ phi: phiRing2, th: ((k + 0.5) / 5) * TAU });
  }

  function sphToCart(phi, th) {
    var sinPhi = Math.sin(phi);
    return { x: sinPhi * Math.cos(th), y: Math.cos(phi), z: sinPhi * Math.sin(th) };
  }

  var pCenters3D = pentagons.map(function (p) { return sphToCart(p.phi, p.th); });
  var pentRad = 0.38;

  var imgData = g.createImageData(W, H);
  var data = imgData.data;

  for (var y = 0; y < H; y++) {
    var v = y / H, phi = v * Math.PI;
    var sinPhi = Math.sin(phi), cosPhi = Math.cos(phi);

    for (var x = 0; x < W; x++) {
      var u = 1.0 - (x / W), th = (x / W) * TAU;
      var px = sinPhi * Math.cos(th);
      var py = cosPhi;
      var pz = sinPhi * Math.sin(th);

      var minDist = 999.0;
      var secondDist = 999.0;
      for (var pi = 0; pi < pCenters3D.length; pi++) {
        var pc = pCenters3D[pi];
        var dot = px * pc.x + py * pc.y + pz * pc.z;
        var angDist = Math.acos(Math.min(1.0, Math.max(-1.0, dot)));
        if (angDist < minDist) {
          secondDist = minDist;
          minDist = angDist;
        } else if (angDist < secondDist) {
          secondDist = angDist;
        }
      }

      var idx = (y * W + x) * 4;

      // Rocket League Futuristic Cyber Ball Architecture
      // Team LED Energy Color Accent (Cyan for North Hemisphere, Electric Orange for South)
      var isCyan = py >= 0;

      // A. Metallic Carbon Pentagon Centers
      if (minDist < pentRad * 0.78) {
        var pDist = minDist / (pentRad * 0.78);
        var carbonPattern = (Math.floor(x * 0.2) + Math.floor(y * 0.2)) % 2 === 0 ? 32 : 18;
        data[idx] = carbonPattern;
        data[idx + 1] = carbonPattern + 4;
        data[idx + 2] = carbonPattern + 12;
        // Deep height relief
        data[idx + 3] = Math.floor(160 + (1.0 - pDist) * 95);
      }
      // B. High-Intensity Glowing LED Circuit Ring
      else if (minDist < pentRad) {
        if (isCyan) {
          // Electric Cyan Glow (#00f0ff)
          data[idx] = 0;
          data[idx + 1] = 230;
          data[idx + 2] = 255;
        } else {
          // Hyper Orange Glow (#ff6600)
          data[idx] = 255;
          data[idx + 1] = 100;
          data[idx + 2] = 0;
        }
        data[idx + 3] = 255; // Maximum 3D height ridge
      }
      // C. Recessed Metallic Armor Seam
      else if (minDist < pentRad + 0.032) {
        data[idx] = 10;
        data[idx + 1] = 12;
        data[idx + 2] = 18;
        data[idx + 3] = 20; // Deep canyon
      }
      // D. Hexagonal Cyber Alloy Plates
      else {
        var seamDiff = Math.abs(minDist - secondDist);
        if (seamDiff < 0.028) {
          // Glowing Inter-Hex LED Seam
          if (isCyan) {
            data[idx] = 0;
            data[idx + 1] = 180;
            data[idx + 2] = 240;
          } else {
            data[idx] = 240;
            data[idx + 1] = 80;
            data[idx + 2] = 10;
          }
          data[idx + 3] = 240;
        } else {
          // Dark Brushed Titanium Hex Plate with Cyber Micro-Grit
          var microGrit = (Math.sin(px * 80.0) * Math.cos(py * 80.0)) * 15;
          var hexGray = Math.floor(55 + microGrit);
          data[idx] = hexGray;
          data[idx + 1] = hexGray + 2;
          data[idx + 2] = hexGray + 8;
          data[idx + 3] = Math.floor(140 + Math.sin(seamDiff * 20.0) * 80);
        }
      }
    }
  }

  g.putImageData(imgData, 0, 0);

  // Draw Glowing Central Equator Ring on top
  g.strokeStyle = "#00f0ff";
  g.lineWidth = 14;
  g.shadowColor = "#00f0ff";
  g.shadowBlur = 12;
  g.beginPath();
  g.moveTo(0, H * 0.5);
  g.lineTo(W, H * 0.5);
  g.stroke();

  return c;
}

export function texBallTennis() {
  var W = 1024, H = 512, c = makeCanvas(W), g = c.getContext("2d");
  c.height = H;
  var imgData = g.createImageData(W, H);
  var data = imgData.data;

  // Sample continuous 3D Tennis Seam Curve on unit sphere
  var nSamples = 360;
  var seamPts = [];
  for (var i = 0; i < nSamples; i++) {
    var t = (i / nSamples) * TAU;
    var b = 0.65;
    var radTerm = Math.sqrt(Math.max(0.01, 1.0 - b * b * Math.sin(2.0 * t) * Math.sin(2.0 * t)));
    var sx = Math.cos(t) * radTerm;
    var sy = Math.sin(t) * radTerm;
    var sz = b * Math.sin(2.0 * t);
    seamPts.push({ x: sx, y: sy, z: sz });
  }

  for (var y = 0; y < H; y++) {
    var v = y / H, phi = v * Math.PI;
    var sinPhi = Math.sin(phi), cosPhi = Math.cos(phi);

    for (var x = 0; x < W; x++) {
      var u = 1.0 - (x / W), th = (x / W) * TAU;
      var px = sinPhi * Math.cos(th);
      var py = cosPhi;
      var pz = sinPhi * Math.sin(th);

      // Find minimum 3D Euclidean distance to tennis seam curve
      var minDist = 999.0;
      for (var sp = 0; sp < seamPts.length; sp++) {
        var pt = seamPts[sp];
        var dx = px - pt.x, dy = py - pt.y, dz = pz - pt.z;
        var distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < minDist) minDist = distSq;
      }
      minDist = Math.sqrt(minDist);

      var idx = (y * W + x) * 4;

      if (minDist < 0.055) {
        // Vulcanized White Rubber Tennis Seam Channel
        if (minDist < 0.028) {
          // Pure Crisp White Seam Core
          data[idx] = 245;
          data[idx + 1] = 248;
          data[idx + 2] = 250;
          data[idx + 3] = 30; // Recessed trench height
        } else {
          // Dark Rubber Seam Shadow Border
          var sRatio = (minDist - 0.028) / 0.027;
          var sDark = Math.floor(40 + sRatio * 160);
          data[idx] = sDark;
          data[idx + 1] = Math.floor(sDark * 1.1);
          data[idx + 2] = Math.floor(sDark * 0.4);
          data[idx + 3] = Math.floor(30 + sRatio * 150);
        }
      } else {
        // High-Visibility Optic Yellow Fuzzy Felt Cover with 3D Fiber Height
        var noise = Math.sin(px * 120.0) * Math.sin(py * 120.0) * Math.sin(pz * 120.0);
        var fR = Math.floor(210 + noise * 25);
        var fG = Math.floor(245 + noise * 10);
        var fB = Math.floor(10 + noise * 10);
        
        data[idx] = Math.min(255, fR);
        data[idx + 1] = Math.min(255, fG);
        data[idx + 2] = Math.max(0, fB);
        // Fuzzy raised felt height in alpha channel
        data[idx + 3] = Math.floor(210 + noise * 45);
      }
    }
  }

  g.putImageData(imgData, 0, 0);
  return c;
}

export function texBallBasketball() {
  var W = 1024, H = 512, c = makeCanvas(W), g = c.getContext("2d");
  c.height = H;

  // 1. Solid Official NBA Burnt Amber Leather Base (#d85412)
  g.fillStyle = "#d85412";
  g.fillRect(0, 0, W, H);

  // Helper to draw the clean basketball seam lines on 2D UV texture
  function drawSeamPath(strokeColor, strokeWidth) {
    g.strokeStyle = strokeColor;
    g.lineWidth = strokeWidth;
    g.lineCap = "round";
    g.lineJoin = "round";

    // 3. Four Spherical Bowed Side Arcs (Hardcoded tuned parameters)
    var maxPxOffset = typeof window.__basketballOffset === "number" ? window.__basketballOffset : 80;
    var arcGap = typeof window.__basketballArcGap === "number" ? window.__basketballArcGap : -16;
    var poleGap = typeof window.__basketballPoleGap === "number" ? window.__basketballPoleGap : 106; // Pixel separation from vertical line
    var yMarginPx = typeof window.__basketballYMargin === "number" ? window.__basketballYMargin : 0; // Pixel distance cutoff from top/bottom poles
    var curvePower = typeof window.__basketballCurvePower === "number" ? window.__basketballCurvePower : 2.5;
    var meridianShift = typeof window.__basketballMeridianShift === "number" ? window.__basketballMeridianShift : -70;
    var showMeridian = typeof window.__basketballShowMeridian !== "undefined" ? window.__basketballShowMeridian : true;
    var showEquator = typeof window.__basketballShowEquator !== "undefined" ? window.__basketballShowEquator : true;
    var drawCaps = typeof window.__basketballDrawCaps !== "undefined" ? window.__basketballDrawCaps : false;

    // 1. Horizontal Equator Line
    if (showEquator) {
      g.beginPath();
      g.moveTo(0, H * 0.5);
      g.lineTo(W, H * 0.5);
      g.stroke();
    }

    // 2. Vertical Meridian Lines (at x = 256 + shift and x = 768 + shift)
    if (showMeridian) {
      g.beginPath();
      g.moveTo((W * 0.25) + meridianShift, 0); g.lineTo((W * 0.25) + meridianShift, H);
      g.moveTo((W * 0.75) + meridianShift, 0); g.lineTo((W * 0.75) + meridianShift, H);
      g.stroke();
    }

    // Helper to draw left/right bowed side arcs with poleGap & yMarginPx
    var minY = Math.max(2, yMarginPx);
    var maxY = Math.min(H - 2, H - yMarginPx);

    function drawArcGroup(xCenter, dir) {
      g.beginPath();
      var first = true;
      for (var y = minY; y <= maxY; y += 2) {
        var yNorm = (y - minY) / Math.max(1, (maxY - minY)); // 0 to 1
        var sinVal = Math.sin(yNorm * Math.PI);
        if (curvePower !== 1.0) sinVal = Math.pow(sinVal, curvePower);

        var x = xCenter + dir * (poleGap + arcGap + maxPxOffset * sinVal);
        if (first) { g.moveTo(x, y); first = false; } else { g.lineTo(x, y); }
      }

      if (drawCaps) {
        // Closed loop back to center or cap
        g.closePath();
      }
      g.stroke();
    }

    var ctr1 = (W * 0.25) + meridianShift;
    var ctr2 = (W * 0.75) + meridianShift;

    // Arc 1 (Front Left Bow)
    drawArcGroup(ctr1, 1);
    // Arc 2 (Front Right Bow)
    drawArcGroup(ctr1, -1);
    // Arc 3 (Back Left Bow)
    drawArcGroup(ctr2, 1);
    // Arc 4 (Back Right Bow)
    drawArcGroup(ctr2, -1);
  }

  // Draw 3-Layer Multi-Depth Recessed Rubber Seam Channels
  drawSeamPath("#1c1c24", 16); // Soft outer shadow bevel
  drawSeamPath("#0a0a0f", 10); // Main vulcanized rubber channel
  drawSeamPath("#020204", 4);  // Deep inner crease shadow

  // 3. Stamped Metallic Gold & White Official NBA Championship Seal
  g.fillStyle = "#ffcc00";
  g.font = "900 28px sans-serif";
  g.textAlign = "center";
  g.shadowColor = "rgba(0,0,0,0.85)";
  g.shadowBlur = 6;
  g.fillText("★ SPALDING TF-1000 ★", W * 0.5, H * 0.32);
  g.fillStyle = "#ffffff";
  g.font = "bold 18px monospace";
  g.fillText("OFFICIAL NBA GAME BALL", W * 0.5, H * 0.38);

  // 4. Generate 3D Pebbled Leather Grain & Recessed Alpha Channel Heightmap
  var imgData = g.getImageData(0, 0, W, H);
  var data = imgData.data;

  for (var y = 0; y < H; y++) {
    var v = y / H, phi = v * Math.PI;
    var sinPhi = Math.sin(phi), cosPhi = Math.cos(phi);

    for (var x = 0; x < W; x++) {
      var th = (x / W) * TAU;
      var px = sinPhi * Math.cos(th);
      var py = cosPhi;
      var pz = sinPhi * Math.sin(th);

      var idx = (y * W + x) * 4;
      var r = data[idx], gVal = data[idx + 1], b = data[idx + 2];

      var isSeam = (r < 35 && gVal < 35 && b < 35);

      if (isSeam) {
        // Recessed pitch-black vulcanized rubber
        data[idx] = 10;
        data[idx + 1] = 10;
        data[idx + 2] = 14;
        // Deep canyon heightmap for 3D bump shader
        data[idx + 3] = 12;
      } else {
        // High-Density Micro-Pebbled Leather Bumps
        var pebble = Math.sin(px * 180.0) * Math.sin(py * 180.0) * Math.sin(pz * 180.0);
        var isBump = pebble > 0.05;

        data[idx] = isBump ? Math.min(255, r + 26) : r;
        data[idx + 1] = isBump ? Math.min(255, gVal + 12) : gVal;
        data[idx + 2] = isBump ? Math.min(255, b + 5) : b;

        // Domed leather panel heightmap + pebble bump height
        data[idx + 3] = isBump ? 220 : 175;
      }
    }
  }

  g.putImageData(imgData, 0, 0);
  return c;
}

export function texCarBodyDetail(style) {
  var S = 1024, c = makeCanvas(S), g = c.getContext("2d");
  c.height = S;

  var bStyle = style || (CFG.gfx && CFG.gfx.carBumpStyle) || "SPORTS_PANELS";

  // 1. Base Automotive Finish (Neutral high-key base so car body color tinting remains brilliantly pure)
  g.fillStyle = "rgb(238, 242, 246)";
  g.fillRect(0, 0, S, S);

  var imgData = g.getImageData(0, 0, S, S);
  var data = imgData.data;

  // Initialize base heightmap (Alpha channel = 195: Smooth flat body panel baseline)
  for (var i = 0; i < data.length; i += 4) {
    data[i + 3] = 195;
  }
  g.putImageData(imgData, 0, 0);

  // Helper for drawing sharp recessed seams with beveled specular lips
  function drawBeveledSeam(x1, y1, x2, y2, width) {
    var w = width || 3;
    // Outer beveled edge highlight (raised relief for specular catch)
    g.strokeStyle = "rgba(255, 255, 255, 0.95)";
    g.lineWidth = w + 3.5;
    g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();

    // Inner deep canyon crevice (dark shadow + deep recessed alpha)
    g.strokeStyle = "rgba(18, 20, 24, 1.0)";
    g.lineWidth = w;
    g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
  }

  function drawSeamPath(pts, width) {
    if (!pts || pts.length < 2) return;
    var w = width || 3;
    // Highlight
    g.strokeStyle = "rgba(255, 255, 255, 0.95)";
    g.lineWidth = w + 3.5;
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    for (var k = 1; k < pts.length; k++) g.lineTo(pts[k][0], pts[k][1]);
    g.stroke();

    // Canyon
    g.strokeStyle = "rgba(18, 20, 24, 1.0)";
    g.lineWidth = w;
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    for (var j = 1; j < pts.length; j++) g.lineTo(pts[j][0], pts[j][1]);
    g.stroke();
  }

  // 2. Hood Center Aerodynamic Power-Bulge (Raised smooth contour)
  var hoodBulge = g.createLinearGradient(0, 120, 0, 480);
  hoodBulge.addColorStop(0.0, "rgba(255, 255, 255, 0.0)");
  hoodBulge.addColorStop(0.3, "rgba(255, 255, 255, 0.85)");
  hoodBulge.addColorStop(0.7, "rgba(255, 255, 255, 0.85)");
  hoodBulge.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");
  g.fillStyle = hoodBulge;
  g.fillRect(440, 140, 144, 320);

  // Center Hood Spine Crease
  drawBeveledSeam(512, 110, 512, 470, 2.5);

  // 3. Twin Aerodynamic Hood Cooling Extraction Vents / Louvers
  var ventBoxes = [
    { x: 260, y: 190, w: 130, h: 180, angle: -0.15 },
    { x: 634, y: 190, w: 130, h: 180, angle:  0.15 }
  ];

  for (var vi = 0; vi < ventBoxes.length; vi++) {
    var vb = ventBoxes[vi];
    g.save();
    g.translate(vb.x + vb.w / 2, vb.y + vb.h / 2);
    g.rotate(vb.angle);

    // Recessed vent basin
    g.fillStyle = "rgba(24, 26, 32, 0.98)";
    g.fillRect(-vb.w / 2, -vb.h / 2, vb.w, vb.h);

    // Beveled frame
    g.strokeStyle = "rgba(255, 255, 255, 0.95)";
    g.lineWidth = 3.5;
    g.strokeRect(-vb.w / 2, -vb.h / 2, vb.w, vb.h);

    // Aerodynamic Slatted Louver Fins
    var nFins = 6;
    var finStep = vb.h / (nFins + 1);
    for (var fi = 1; fi <= nFins; fi++) {
      var fy = -vb.h / 2 + fi * finStep;
      // Fin highlight edge
      g.strokeStyle = "rgba(255, 255, 255, 0.95)";
      g.lineWidth = 3;
      g.beginPath(); g.moveTo(-vb.w / 2 + 6, fy); g.lineTo(vb.w / 2 - 6, fy); g.stroke();
      // Fin dark shadow slot underneath
      g.strokeStyle = "rgba(10, 12, 16, 1.0)";
      g.lineWidth = 2.5;
      g.beginPath(); g.moveTo(-vb.w / 2 + 6, fy + 3); g.lineTo(vb.w / 2 - 6, fy + 3); g.stroke();
    }
    g.restore();
  }

  // 4. Door Shutlines, Fender Flaring Creases & Body Seams
  // Front Fender to Hood Seams
  drawSeamPath([[210, 80], [380, 130], [420, 480], [340, 520]], 3.5);
  drawSeamPath([[814, 80], [644, 130], [604, 480], [684, 520]], 3.5);

  // Door Shutlines & Cockpit Pillar Seams
  drawSeamPath([[160, 480], [160, 820], [320, 860]], 3.5);
  drawSeamPath([[864, 480], [864, 820], [704, 860]], 3.5);

  // Side intake NACA duct scoop contours
  drawBeveledSeam(80, 560, 150, 720, 3.0);
  drawBeveledSeam(944, 560, 874, 720, 3.0);

  // Rear Engine Deck Louvers & Air Extraction Slots
  for (var rli = 0; rli < 5; rli++) {
    var rly = 600 + rli * 34;
    drawBeveledSeam(360, rly, 664, rly, 3.0);
  }

  // Fuel / Energy Fast-Charge Port Door (Circular embossed seam)
  g.strokeStyle = "rgba(255, 255, 255, 0.95)";
  g.lineWidth = 4.0;
  g.beginPath(); g.arc(880, 460, 26, 0, TAU); g.stroke();
  g.strokeStyle = "rgba(18, 20, 24, 1.0)";
  g.lineWidth = 2.5;
  g.beginPath(); g.arc(880, 460, 26, 0, TAU); g.stroke();

  // Widebody Fender Flare Fastener Bolts
  var boltPoints = [
    [180, 200], [150, 300], [150, 400], [180, 500],
    [844, 200], [874, 300], [874, 400], [844, 500],
    [130, 680], [130, 780], [160, 870],
    [894, 680], [894, 780], [864, 870]
  ];
  for (var bi = 0; bi < boltPoints.length; bi++) {
    var bx = boltPoints[bi][0], by = boltPoints[bi][1];
    // Raised chrome outer ring
    g.fillStyle = "rgba(255, 255, 255, 0.95)";
    g.beginPath(); g.arc(bx, by, 4.5, 0, TAU); g.fill();
    // Center recess
    g.fillStyle = "rgba(20, 22, 26, 1.0)";
    g.beginPath(); g.arc(bx, by, 2.0, 0, TAU); g.fill();
  }

  // 5. Post-Process Pass for Mathematical Alpha-Heightmap Normal Generation
  var finalImg = g.getImageData(0, 0, S, S);
  var fData = finalImg.data;

  for (var y = 0; y < S; y++) {
    for (var x = 0; x < S; x++) {
      var pidx = (y * S + x) * 4;
      var r = fData[pidx], gCol = fData[pidx + 1], b = fData[pidx + 2];
      var lum = (r + gCol + b) / 3.0;

      // Dark seam pixels -> Deep canyon height
      if (lum < 50) {
        fData[pidx + 3] = Math.floor(25 + lum * 0.7);
        // Slight ambient occlusion darkening in crevice
        fData[pidx] = Math.floor(r * 0.45);
        fData[pidx + 1] = Math.floor(gCol * 0.45);
        fData[pidx + 2] = Math.floor(b * 0.45);
      }
      // Bright bevel edge pixels -> Elevated peak height for crisp normal catch
      else if (lum > 248) {
        fData[pidx + 3] = 248;
      }
      // Base panel surface with micro carbon/aerodynamic texture
      else {
        var uCoord = x / S, vCoord = y / S;
        var microHeight = 195;

        if (bStyle === "CARBON_WEAVE" || y > 820) {
          // 2x2 Twill Carbon Fiber Weave pattern
          var cxVal = Math.floor(x / 4) % 4;
          var cyVal = Math.floor(y / 4) % 4;
          var isWeave = ((cxVal + cyVal) % 4 < 2);
          microHeight = isWeave ? 218 : 172;
        } else if (bStyle === "AERO_LOUVERS") {
          var rib = Math.sin(x * 0.4) * Math.cos(y * 0.1);
          microHeight = Math.floor(195 + rib * 16);
        } else if (bStyle === "ARMOR_PLATES") {
          var plateX = Math.floor(x / 64) % 2;
          var plateY = Math.floor(y / 64) % 2;
          microHeight = (plateX === plateY) ? 212 : 180;
        }

        fData[pidx + 3] = microHeight;
      }
    }
  }

  g.putImageData(finalImg, 0, 0);
  return c;
}

export function texCarTrimDetail() {
  var S = 512, c = makeCanvas(S), g = c.getContext("2d");
  g.fillStyle = "rgb(245, 248, 252)";
  g.fillRect(0, 0, S, S);

  // Beveled outer racing stripe borders
  g.strokeStyle = "rgba(20, 22, 28, 1.0)";
  g.lineWidth = 4;
  g.strokeRect(32, 0, S - 64, S);

  var imgData = g.getImageData(0, 0, S, S);
  var data = imgData.data;
  for (var i = 0; i < data.length; i += 4) {
    var lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i + 3] = lum < 60 ? 25 : 230; // Elevated trim decal thickness
  }
  g.putImageData(imgData, 0, 0);
  return c;
}

export function texCarAccentDetail() {
  var S = 512, c = makeCanvas(S), g = c.getContext("2d");
  c.height = S;

  // Real 2x2 Twill High-Density Carbon Fiber Weave Texture
  var imgData = g.createImageData(S, S);
  var data = imgData.data;

  for (var y = 0; y < S; y++) {
    for (var x = 0; x < S; x++) {
      var idx = (y * S + x) * 4;
      var cx = Math.floor(x / 4) % 4;
      var cy = Math.floor(y / 4) % 4;
      var twill = ((cx + cy) % 4 < 2);

      var baseLum = twill ? 48 : 26;
      var flake = (Math.sin(x * 12.0) * Math.cos(y * 12.0)) * 6;
      var lum = Math.floor(Math.max(15, Math.min(80, baseLum + flake)));

      data[idx] = lum;
      data[idx + 1] = Math.floor(lum * 1.05);
      data[idx + 2] = Math.floor(lum * 1.15);
      // High-Frequency 3D Carbon Weave Heightmap in Alpha Channel
      data[idx + 3] = twill ? 235 : 155;
    }
  }

  g.putImageData(imgData, 0, 0);
  return c;
}

export function texCarWheelDetail() {
  var S = 512, c = makeCanvas(S), g = c.getContext("2d");
  c.height = S;

  g.fillStyle = "#181a20";
  g.fillRect(0, 0, S, S);

  var cx = S / 2, cy = S / 2;

  // 1. High-Performance Sport Tire Directional Tread Grooves
  g.fillStyle = "rgba(10, 11, 14, 1.0)";
  var nTreads = 36;
  for (var ti = 0; ti < nTreads; ti++) {
    var ang = (ti / nTreads) * TAU;
    g.save();
    g.translate(cx, cy);
    g.rotate(ang);

    // Tread Siping Slot
    g.fillStyle = "rgba(255, 255, 255, 0.9)";
    g.fillRect(cx * 0.76, -4, cx * 0.22, 8);
    g.fillStyle = "rgba(8, 9, 12, 1.0)";
    g.fillRect(cx * 0.77, -2.5, cx * 0.20, 5);
    g.restore();
  }

  // 2. Sidewall Branding Ring
  g.strokeStyle = "rgba(255, 255, 255, 0.85)";
  g.lineWidth = 3;
  g.beginPath(); g.arc(cx, cy, cx * 0.74, 0, TAU); g.stroke();
  g.beginPath(); g.arc(cx, cy, cx * 0.52, 0, TAU); g.stroke();

  // 3. Central Hubcap 5-Bolt Lug Nut Pattern
  for (var b = 0; b < 5; b++) {
    var bAng = (b / 5) * TAU;
    var bx = cx + Math.cos(bAng) * (cx * 0.26);
    var by = cy + Math.sin(bAng) * (cx * 0.26);
    g.fillStyle = "rgba(255, 255, 255, 0.95)";
    g.beginPath(); g.arc(bx, by, 7.5, 0, TAU); g.fill();
    g.fillStyle = "rgba(15, 16, 20, 1.0)";
    g.beginPath(); g.arc(bx, by, 4.0, 0, TAU); g.fill();
  }

  // 4. Center Logo / Spinner Dome
  g.fillStyle = "rgba(255, 255, 255, 0.95)";
  g.beginPath(); g.arc(cx, cy, cx * 0.12, 0, TAU); g.fill();

  var imgData = g.getImageData(0, 0, S, S);
  var data = imgData.data;
  for (var i = 0; i < data.length; i += 4) {
    var lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i + 3] = lum > 200 ? 250 : (lum < 30 ? 30 : 180);
  }
  g.putImageData(imgData, 0, 0);
  return c;
}

export function texBall(ballType) {
  var t = (ballType || (CFG.gfx && CFG.gfx.ballType) || "soccer").toLowerCase();
  if (t === "volleyball") return texBallVolleyball();
  if (t === "rocketleague" || t === "rl" || t === "cyber") return texBallRocketLeague();
  if (t === "curvy" || t === "swirl") return texBallCurvy();
  if (t === "tennis") return texBallTennis();
  if (t === "basketball") return texBallBasketball();
  return texBallSoccer();
}

export function texBlob() {
  var S = 256, c = makeCanvas(S), g = c.getContext("2d");
  var cx = S / 2, cy = S / 2;
  var gr = g.createRadialGradient(cx, cy, cx * 0.1, cx, cy, cx * 0.95);
  gr.addColorStop(0.00, "rgba(0,0,0,0.78)");
  gr.addColorStop(0.35, "rgba(0,0,0,0.48)");
  gr.addColorStop(0.70, "rgba(0,0,0,0.14)");
  gr.addColorStop(1.00, "rgba(0,0,0,0.0)");
  g.fillStyle = gr;
  g.beginPath();
  g.ellipse(cx, cy, cx * 0.72, cy * 0.92, 0, 0, TAU);
  g.fill();
  return c;
}

export function texSpark() {
  var S = 64, c = makeCanvas(S), g = c.getContext("2d");
  var gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.25, "rgba(255,255,255,0.72)");
  gr.addColorStop(0.65, "rgba(255,255,255,0.16)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, S, S);
  return c;
}

export function texCrowd(themeKey) {
  var activeTheme = themeKey || (CFG.gfx && CFG.gfx.stadiumTheme) || "NEON_CHAMPIONSHIP";
  var S = 1024, c = makeCanvas(S), g = c.getContext("2d");

  // 1. High-Tech Grandstand Carbon/Titanium Deck
  var deckColor = (activeTheme === "CYBER_SUNSET") ? "#180c26" :
                   (activeTheme === "COSMIC_AURORA") ? "#081620" :
                   (activeTheme === "HYPERION_NIGHT" || activeTheme === "CYBER_DOME") ? "#0d061a" : "#121724";
  g.fillStyle = deckColor;
  g.fillRect(0, 0, S, S);

  // 2. Tiered Seating Rows with Glowing Neon Trims
  var nRows = 48;
  var rowH = S / nRows;
  var isFantasy = (activeTheme === "CYBER_SUNSET" || activeTheme === "COSMIC_AURORA" || activeTheme === "HYPERION_NIGHT");

  for (var r = 0; r < nRows; r++) {
    var ry = r * rowH;
    // Riser shadow
    g.fillStyle = "rgba(5, 8, 14, 0.85)";
    g.fillRect(0, ry, S, rowH * 0.28);

    // Tread surface
    g.fillStyle = (r % 6 === 0) ? "rgba(35, 48, 72, 0.9)" : "rgba(22, 30, 46, 0.85)";
    g.fillRect(0, ry + rowH * 0.28, S, rowH * 0.72);

    // Glowing Neon Edge Lines every 4 rows
    if (r % 4 === 0) {
      var neonCol = (activeTheme === "CYBER_SUNSET") ? "rgba(255, 64, 129, 0.85)" :
                    (activeTheme === "COSMIC_AURORA") ? "rgba(5, 255, 170, 0.85)" :
                    (activeTheme === "HYPERION_NIGHT") ? "rgba(255, 85, 212, 0.85)" :
                    "rgba(53, 186, 255, 0.75)";
      g.fillStyle = neonCol;
      g.fillRect(0, ry + rowH * 0.28, S, 2.2);
    }
  }

  // 3. Middle Tier VIP Glass Box Suite
  var vipY = S * 0.46, vipH = rowH * 4;
  g.fillStyle = "#0a0e1a";
  g.fillRect(0, vipY, S, vipH);
  g.fillStyle = isFantasy ? "rgba(255, 215, 0, 0.35)" : "rgba(100, 200, 255, 0.25)";
  g.fillRect(0, vipY + 4, S, vipH - 8);
  // Glowing VIP Banner
  g.font = "bold 20px sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = isFantasy ? "#ffd166" : "#00e5ff";
  g.shadowColor = g.fillStyle;
  g.shadowBlur = 10;
  g.fillText("★ GRAND CHAMPIONSHIP STADIUM SKYBOX VIP ★", S * 0.5, vipY + vipH * 0.5);
  g.shadowBlur = 0;

  // 4. Team Spectator Colors (Vibrant Fantasy Colors)
  var bluePulsePalette = [
    "#00d2ff", "#38bdf8", "#0284c7", "#00f0ff", "#e0f2fe", "#7dd3fc"
  ];
  var orangeVoltPalette = [
    "#ff9900", "#fb923c", "#ea580c", "#ffd166", "#ff5500", "#ffedd5"
  ];
  var neutralPalette = [
    "#ffffff", "#f1f5f9", "#cbd5e1", "#ec4899", "#a855f7", "#10b981"
  ];

  // 5. High-Density Cheering Fans
  for (var f = 0; f < 5800; f++) {
    var fx = Math.random() * S;
    var rowIdx = Math.floor(Math.random() * nRows);
    // Don't draw over VIP text center
    var fy = rowIdx * rowH + rowH * 0.35 + Math.random() * (rowH * 0.48);
    if (fy >= vipY && fy <= vipY + vipH && fx > S * 0.25 && fx < S * 0.75) continue;

    var col;
    if (fx < S * 0.44) {
      col = (Math.random() < 0.75) ? bluePulsePalette[Math.floor(Math.random() * bluePulsePalette.length)] : neutralPalette[Math.floor(Math.random() * neutralPalette.length)];
    } else if (fx > S * 0.56) {
      col = (Math.random() < 0.75) ? orangeVoltPalette[Math.floor(Math.random() * orangeVoltPalette.length)] : neutralPalette[Math.floor(Math.random() * neutralPalette.length)];
    } else {
      col = (Math.random() < 0.4) ? bluePulsePalette[Math.floor(Math.random() * bluePulsePalette.length)] :
            (Math.random() < 0.8 ? orangeVoltPalette[Math.floor(Math.random() * orangeVoltPalette.length)] : neutralPalette[Math.floor(Math.random() * neutralPalette.length)]);
    }

    // Fan Jersey Torso
    g.fillStyle = col;
    g.fillRect(fx, fy, 3.8, 4.6);

    // Fan Head with Stylized Headband / Visor
    g.fillStyle = "rgba(255, 224, 196, 0.95)";
    g.fillRect(fx + 0.6, fy - 2.8, 2.6, 2.6);

    // Glowing Neon Headband / Visor on some fans
    if (f % 5 === 0) {
      g.fillStyle = (fx < S * 0.5) ? "#00f0ff" : "#ffd166";
      g.fillRect(fx + 0.6, fy - 2.0, 2.6, 1.2);
    }
  }

  // 6. Glowing LED Light-Sticks & Batons held up in the air!
  for (var ls = 0; ls < 650; ls++) {
    var lx = Math.random() * S;
    var ly = Math.random() * S;
    var lCol = (lx < S * 0.45) ? "#00f0ff" : (lx > S * 0.55 ? "#ffaa00" : (ls % 2 === 0 ? "#ff0077" : "#00ffaa"));
    
    // Glowing baton stick
    g.save();
    g.translate(lx, ly);
    g.rotate((Math.random() - 0.5) * 0.8);
    // Glow halo
    var bGrad = g.createRadialGradient(0, 0, 1, 0, 0, 7);
    bGrad.addColorStop(0, lCol);
    bGrad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = bGrad;
    g.beginPath(); g.arc(0, 0, 7, 0, TAU); g.fill();
    // Core neon line
    g.fillStyle = "#ffffff";
    g.fillRect(-1, -5, 2, 10);
    g.restore();
  }

  // 7. Waving Team Stadium Banners & Crests
  var banners = [
    { x: S * 0.18, y: S * 0.22, text: "⚡ PULSE ⚡", col: "#00f0ff", bg: "rgba(0, 50, 120, 0.85)" },
    { x: S * 0.82, y: S * 0.22, text: "⚡ VOLT ⚡", col: "#ffb703", bg: "rgba(120, 50, 0, 0.85)" },
    { x: S * 0.22, y: S * 0.72, text: "OVERDRIVE", col: "#38bdf8", bg: "rgba(0, 40, 100, 0.85)" },
    { x: S * 0.78, y: S * 0.72, text: "SUPERSONIC", col: "#fb8500", bg: "rgba(100, 30, 0, 0.85)" }
  ];

  for (var bi = 0; bi < banners.length; bi++) {
    var ban = banners[bi];
    var bw = 140, bh = 34;
    g.fillStyle = ban.bg;
    g.fillRect(ban.x - bw / 2, ban.y - bh / 2, bw, bh);
    g.strokeStyle = ban.col;
    g.lineWidth = 2.5;
    g.strokeRect(ban.x - bw / 2, ban.y - bh / 2, bw, bh);

    g.font = "bold 15px sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillStyle = ban.col;
    g.shadowColor = ban.col;
    g.shadowBlur = 8;
    g.fillText(ban.text, ban.x, ban.y);
    g.shadowBlur = 0;
  }

  // 8. Cheering Camera Flashes & Sparks
  for (var fl = 0; fl < 120; fl++) {
    var flx = Math.random() * S, fly = Math.random() * S;
    var flg = g.createRadialGradient(flx, fly, 0, flx, fly, 9.0);
    flg.addColorStop(0, "rgba(255, 255, 255, 1.0)");
    flg.addColorStop(0.3, "rgba(180, 235, 255, 0.7)");
    flg.addColorStop(0.7, "rgba(255, 180, 240, 0.2)");
    flg.addColorStop(1, "rgba(0, 0, 0, 0)");
    g.fillStyle = flg;
    g.beginPath(); g.arc(flx, fly, 9.0, 0, TAU); g.fill();
  }

  return c;
}

export function texAdBoard() {
  var S = 2048, H = 128, c = makeCanvas(S), g = c.getContext("2d");
  c.height = H;

  var ads = [
    { title: "ROCKET LEAGUE", sub: "APEX CHAMPIONSHIP 2026", bg: "#040814", textCol: "#ffffff", accent: "#00e5ff", tag: "LIVE ★", icon: "⚡" },
    { title: "NITRO OVERDRIVE", sub: "1000 HORSEPOWER BOOST", bg: "#160500", textCol: "#ffdd00", accent: "#ff4400", tag: "100% PWR", icon: "🔥" },
    { title: "VOLT-X DRIFT", sub: "PRO TRACTION SYSTEM", bg: "#021609", textCol: "#88ff55", accent: "#00ff88", tag: "PRO GRIP", icon: "❖" },
    { title: "CYBER DYNAMICS", sub: "AERO-GRAV TECHNOLOGY", bg: "#0c031c", textCol: "#e090ff", accent: "#a800ff", tag: "TURBO", icon: "▲" },
    { title: "PULSE ENERGY", sub: "HIGH-VOLTAGE CELLS", bg: "#001222", textCol: "#90eeff", accent: "#00b4d8", tag: "ECO-MAX", icon: "⚡" },
    { title: "AXIOM MOTORS", sub: "SUPERSONIC HYPER-ENGINES", bg: "#1c0012", textCol: "#ff99e0", accent: "#ff0077", tag: "FAST", icon: "★" },
    { title: "KESTREL RACING", sub: "WORLD CUP QUALIFIER", bg: "#181200", textCol: "#ffee77", accent: "#ffbb00", tag: "STAGE 1", icon: "◆" },
    { title: "ORBITAL TELEMETRY", sub: "PRECISION SENSOR SUITE", bg: "#041024", textCol: "#a8d5ff", accent: "#3a86ff", tag: "SYNC", icon: "◈" }
  ];

  var w = S / ads.length;
  for (var i = 0; i < ads.length; i++) {
    var ad = ads[i];
    var x0 = i * w;

    // Rich gradient background for each ad
    var bgGrad = g.createLinearGradient(x0, 0, x0 + w, H);
    bgGrad.addColorStop(0, ad.bg);
    bgGrad.addColorStop(0.5, "#0b101d");
    bgGrad.addColorStop(1, ad.bg);
    g.fillStyle = bgGrad;
    g.fillRect(x0, 0, w, H);

    // Glowing top & bottom LED neon border strips
    g.fillStyle = ad.accent;
    g.fillRect(x0, 0, w, 6);
    g.fillRect(x0, H - 6, w, 6);

    // Diagonal speed accents / chevrons
    g.save();
    g.fillStyle = ad.accent;
    g.globalAlpha = 0.22;
    for (var ch = 0; ch < 6; ch++) {
      g.beginPath();
      g.moveTo(x0 + ch * 42 + 10, H);
      g.lineTo(x0 + ch * 42 + 32, 0);
      g.lineTo(x0 + ch * 42 + 46, 0);
      g.lineTo(x0 + ch * 42 + 24, H);
      g.fill();
    }
    g.restore();

    // Icon & Brand Title Text with glow
    g.font = "bold 26px sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillStyle = ad.textCol;
    g.shadowColor = ad.accent;
    g.shadowBlur = 14;
    g.fillText(ad.icon + " " + ad.title, x0 + w / 2 - 24, H / 2 - 14);

    // Subtitle / Slogan Text
    g.font = "bold 13px sans-serif";
    g.fillStyle = ad.accent;
    g.shadowBlur = 8;
    g.fillText(ad.sub, x0 + w / 2 - 24, H / 2 + 18);
    g.shadowBlur = 0;

    // Tag / Badge Pill on the right side
    var px = x0 + w - 62, py = H / 2 - 20, pw = 52, ph = 40;
    g.fillStyle = ad.accent;
    g.beginPath();
    g.fillRect(px, py, pw, ph);
    g.fillStyle = "#000000";
    g.font = "bold 13px sans-serif";
    g.fillText(ad.tag, px + pw / 2, py + ph / 2);
  }

  // Overlay stadium LED dot-matrix grid pattern
  g.fillStyle = "rgba(0, 0, 0, 0.25)";
  for (var ly = 0; ly < H; ly += 4) g.fillRect(0, ly, S, 2);
  for (var lx = 0; lx < S; lx += 4) g.fillRect(lx, 0, 2, H);

  return c;
}

export function texRibbon() {
  var S = 1024, H = 64, c = makeCanvas(S), g = c.getContext("2d");
  c.height = H;

  g.fillStyle = "#070b16";
  g.fillRect(0, 0, S, H);

  // Top and bottom bright neon ticker runners
  g.fillStyle = "#00d2ff"; g.fillRect(0, 0, S / 2, 4);
  g.fillStyle = "#ff8800"; g.fillRect(S / 2, 0, S / 2, 4);
  g.fillStyle = "#00d2ff"; g.fillRect(0, H - 4, S / 2, 4);
  g.fillStyle = "#ff8800"; g.fillRect(S / 2, H - 4, S / 2, 4);

  // Dynamic Chevrons along ribbon
  for (var i = 0; i < 32; i++) {
    var isBlue = (i < 16);
    g.fillStyle = isBlue ? "rgba(0, 210, 255, 0.45)" : "rgba(255, 136, 0, 0.45)";
    g.beginPath();
    var cx = i * 32;
    g.moveTo(cx, H - 8);
    g.lineTo(cx + 14, H * 0.5);
    g.lineTo(cx, 8);
    g.lineTo(cx + 8, 8);
    g.lineTo(cx + 22, H * 0.5);
    g.lineTo(cx + 8, H - 8);
    g.fill();
  }

  // Ribbon Text & Badges
  g.font = "bold 20px sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";

  g.fillStyle = "#00f0ff";
  g.shadowColor = "#00f0ff";
  g.shadowBlur = 10;
  g.fillText("⚡ PULSE DIVISION ⚡", S * 0.25, H * 0.5);

  g.fillStyle = "#ffaa00";
  g.shadowColor = "#ffaa00";
  g.shadowBlur = 10;
  g.fillText("⚡ VOLT DIVISION ⚡", S * 0.75, H * 0.5);
  g.shadowBlur = 0;

  return c;
}

export function texScreen(clockStr, score0, score1, title) {
  var S = 512, H = 256, c = makeCanvas(S), g = c.getContext("2d");
  c.height = H;

  // Dark metallic bezel background
  g.fillStyle = "#03060c";
  g.fillRect(0, 0, S, H);

  // Inner illuminated screen matrix
  g.fillStyle = "#081120";
  g.fillRect(10, 10, S - 20, H - 20);

  // Team top & bottom neon header stripes
  g.fillStyle = "#00d2ff";
  g.fillRect(10, 10, S / 2 - 10, 6);
  g.fillStyle = "#ff9500";
  g.fillRect(S / 2, 10, S / 2 - 10, 6);

  // Top Header: "● LIVE MATCH" and Championship title
  g.font = "bold 14px sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";

  // Red LIVE dot
  g.fillStyle = "#ff2244";
  g.beginPath(); g.arc(42, 28, 5, 0, TAU); g.fill();
  g.fillStyle = "#ffffff";
  g.textAlign = "left";
  g.fillText("LIVE", 54, 28);

  g.textAlign = "center";
  g.fillStyle = "#88b5e8";
  g.fillText(title || "ROCKET LEAGUE APEX ARENA", S / 2, 28);

  // Main Digital Clock Box in Center
  g.fillStyle = "#040814";
  g.fillRect(S / 2 - 75, 46, 150, 48);
  g.strokeStyle = "rgba(100, 200, 255, 0.4)";
  g.lineWidth = 1.5;
  g.strokeRect(S / 2 - 75, 46, 150, 48);

  g.font = "bold 40px sans-serif";
  g.fillStyle = "#ffffff";
  g.shadowColor = "#00d2ff";
  g.shadowBlur = 8;
  g.fillText(clockStr || "5:00", S / 2, 70);
  g.shadowBlur = 0;

  // Team 0 Score Box (Team Pulse - Cyan)
  var s0 = score0 !== undefined ? score0 : 0;
  g.fillStyle = "rgba(0, 80, 160, 0.25)";
  g.fillRect(24, 104, S / 2 - 36, 100);
  g.strokeStyle = "#00d2ff";
  g.lineWidth = 2;
  g.strokeRect(24, 104, S / 2 - 36, 100);

  g.font = "bold 16px sans-serif";
  g.textAlign = "center";
  g.fillStyle = "#00d2ff";
  g.fillText("⚡ TEAM PULSE", 24 + (S / 2 - 36) / 2, 124);

  g.font = "bold 68px sans-serif";
  g.fillStyle = "#00f0ff";
  g.shadowColor = "#00d2ff";
  g.shadowBlur = 16;
  g.fillText(String(s0), 24 + (S / 2 - 36) / 2, 172);
  g.shadowBlur = 0;

  // Team 1 Score Box (Team Volt - Orange)
  var s1 = score1 !== undefined ? score1 : 0;
  g.fillStyle = "rgba(160, 60, 0, 0.25)";
  g.fillRect(S / 2 + 12, 104, S / 2 - 36, 100);
  g.strokeStyle = "#ff9500";
  g.lineWidth = 2;
  g.strokeRect(S / 2 + 12, 104, S / 2 - 36, 100);

  g.font = "bold 16px sans-serif";
  g.textAlign = "center";
  g.fillStyle = "#ffaa00";
  g.fillText("TEAM VOLT ⚡", S / 2 + 12 + (S / 2 - 36) / 2, 124);

  g.font = "bold 68px sans-serif";
  g.fillStyle = "#ffaa00";
  g.shadowColor = "#ff7700";
  g.shadowBlur = 16;
  g.fillText(String(s1), S / 2 + 12 + (S / 2 - 36) / 2, 172);
  g.shadowBlur = 0;

  // Bottom Audio/Energy Waveform Ticker
  g.fillStyle = "#040810";
  g.fillRect(10, H - 36, S - 20, 26);
  for (var bar = 0; bar < 32; bar++) {
    var barH = 4 + Math.sin(bar * 0.6) * 7 + Math.cos(bar * 1.2) * 5;
    g.fillStyle = bar < 16 ? "#00d2ff" : "#ff9500";
    g.fillRect(20 + bar * 15, H - 12 - barH, 10, barH);
  }

  // Scanline overlay
  g.fillStyle = "rgba(0, 0, 0, 0.30)";
  for (var sl = 10; sl < H - 10; sl += 3) {
    g.fillRect(10, sl, S - 20, 1);
  }

  return c;
}

export function Builder() { this.v = []; this.i = []; this.n = 0; }
Builder.prototype.vert = function (x, y, z, nx, ny, nz, u, vv) {
  this.v.push(x, y, z, nx, ny, nz, u, vv);
  return this.n++;
};
Builder.prototype.quad = function (a, b, c, d) { this.i.push(a, b, c, a, c, d); return this; };
Builder.prototype.tri = function (a, b, c) { this.i.push(a, b, c); return this; };
Builder.prototype.box = function (hx, hy, hz, p, q, uvs) {
  uvs = uvs || 1;
  var self = this;
  var P = new V3(), N = new V3();
  function put(x, y, z, nx, ny, nz, u, vv) {
    P.set(x, y, z); N.set(nx, ny, nz);
    if (q) { q.rotate(P, P); q.rotate(N, N); }
    if (p) P.add(p);
    return self.vert(P.x, P.y, P.z, N.x, N.y, N.z, u * uvs, vv * uvs);
  }
  var faces = [
    [[hx, -hy, -hz], [hx, -hy, hz], [hx, hy, hz], [hx, hy, -hz], [1, 0, 0]],
    [[-hx, -hy, hz], [-hx, -hy, -hz], [-hx, hy, -hz], [-hx, hy, hz], [-1, 0, 0]],
    [[-hx, hy, -hz], [hx, hy, -hz], [hx, hy, hz], [-hx, hy, hz], [0, 1, 0]],
    [[-hx, -hy, hz], [hx, -hy, hz], [hx, -hy, -hz], [-hx, -hy, -hz], [0, -1, 0]],
    [[-hx, -hy, hz], [-hx, hy, hz], [hx, hy, hz], [hx, -hy, hz], [0, 0, 1]],
    [[hx, -hy, -hz], [hx, hy, -hz], [-hx, hy, -hz], [-hx, -hy, -hz], [0, 0, -1]]
  ];
  for (var f = 0; f < 6; f++) {
    var F = faces[f], nn = F[4];
    var a = put(F[0][0], F[0][1], F[0][2], nn[0], nn[1], nn[2], 0, 0);
    var b = put(F[1][0], F[1][1], F[1][2], nn[0], nn[1], nn[2], 1, 0);
    var c = put(F[2][0], F[2][1], F[2][2], nn[0], nn[1], nn[2], 1, 1);
    var d = put(F[3][0], F[3][1], F[3][2], nn[0], nn[1], nn[2], 0, 1);
    this.quad(a, b, c, d);
  }
  return this;
};
Builder.prototype.sphere = function (r, seg, rings, p) {
  var base = this.n;
  for (var y = 0; y <= rings; y++) {
    var v = y / rings, phi = v * PI;
    for (var x = 0; x <= seg; x++) {
      var u = 1.0 - (x / seg), th = (x / seg) * TAU;
      var nx = Math.sin(phi) * Math.cos(th), ny = Math.cos(phi), nz = Math.sin(phi) * Math.sin(th);
      this.vert(nx * r + (p ? p.x : 0), ny * r + (p ? p.y : 0), nz * r + (p ? p.z : 0), nx, ny, nz, u, v);
    }
  }
  for (var yy = 0; yy < rings; yy++) {
    for (var xx = 0; xx < seg; xx++) {
      var i0 = base + yy * (seg + 1) + xx, i1 = i0 + 1, i2 = i0 + seg + 1, i3 = i2 + 1;
      this.quad(i0, i1, i3, i2);
    }
  }
  return this;
};
Builder.prototype.wheelCyl = function (r, w, seg) {
  var base = this.n, hw = w * 0.5, s;
  for (var i = 0; i <= seg; i++) {
    var a = i / seg * TAU, cy = Math.cos(a), sz = Math.sin(a);
    this.vert(-hw, cy * r, sz * r, 0, cy, sz, i / seg * 3, 0);
    this.vert(hw, cy * r, sz * r, 0, cy, sz, i / seg * 3, 1);
  }
  for (s = 0; s < seg; s++) this.quad(base + s * 2, base + s * 2 + 2, base + s * 2 + 3, base + s * 2 + 1);
  for (var side = 0; side < 2; side++) {
    var sx = side ? hw : -hw, ndir = side ? 1 : -1;
    var cIdx = this.vert(sx, 0, 0, ndir, 0, 0, 0.5, 0.5);
    var ring = [];
    for (var j = 0; j <= seg; j++) {
      var b = j / seg * TAU;
      ring.push(this.vert(sx, Math.cos(b) * r, Math.sin(b) * r, ndir, 0, 0, 0.5 + Math.cos(b) * 0.5, 0.5 + Math.sin(b) * 0.5));
    }
    for (var t = 0; t < seg; t++) {
      if (side) this.tri(cIdx, ring[t], ring[t + 1]); else this.tri(cIdx, ring[t + 1], ring[t]);
    }
  }
  return this;
};
Builder.prototype.polyDisc = function (r, seg, y, up, uvScale) {
  uvScale = uvScale || 1;
  var c = this.vert(0, y, 0, 0, up, 0, 0.5, 0.5), ring = [];
  for (var i = 0; i <= seg; i++) {
    var a = i / seg * TAU, x = Math.cos(a) * r, z = Math.sin(a) * r;
    ring.push(this.vert(x, y, z, 0, up, 0, 0.5 + x / (2 * r) * uvScale, 0.5 + z / (2 * r) * uvScale));
  }
  for (var t = 0; t < seg; t++) {
    if (up > 0) this.tri(c, ring[t + 1], ring[t]); else this.tri(c, ring[t], ring[t + 1]);
  }
  return this;
};
Builder.prototype.face = function (a, b, c, d, n, uvScale) {
  uvScale = uvScale === undefined ? 1 : uvScale;
  var ia = this.vert(a.x, a.y, a.z, n.x, n.y, n.z, 0, 0);
  var ib = this.vert(b.x, b.y, b.z, n.x, n.y, n.z, b.dist(a) * uvScale, 0);
  var ic = this.vert(c.x, c.y, c.z, n.x, n.y, n.z, b.dist(a) * uvScale, c.dist(b) * uvScale);
  var id = this.vert(d.x, d.y, d.z, n.x, n.y, n.z, 0, c.dist(b) * uvScale);
  return this.quad(ia, ib, ic, id);
};
Builder.prototype.quadN = function (a, b, c, d) {
  var v = this.v;
  var ax = v[a * 8], ay = v[a * 8 + 1], az = v[a * 8 + 2];
  var e1x = v[b * 8] - ax, e1y = v[b * 8 + 1] - ay, e1z = v[b * 8 + 2] - az;
  var e2x = v[c * 8] - ax, e2y = v[c * 8 + 1] - ay, e2z = v[c * 8 + 2] - az;
  var gx = e1y * e2z - e1z * e2y, gy = e1z * e2x - e1x * e2z, gz = e1x * e2y - e1y * e2x;
  var dot = gx * v[a * 8 + 3] + gy * v[a * 8 + 4] + gz * v[a * 8 + 5];
  if (dot >= 0) this.quad(a, b, c, d); else this.quad(a, d, c, b);
  return this;
};
Builder.prototype.faceTo = function (a, b, c, d, inside, uvScale) {
  uvScale = uvScale === undefined ? 0.25 : uvScale;
  var e1 = tv(b.x - a.x, b.y - a.y, b.z - a.z), e2 = tv(c.x - a.x, c.y - a.y, c.z - a.z);
  var n = tv().cross(e1, e2).norm();
  if (n.dot(tv(inside.x - a.x, inside.y - a.y, inside.z - a.z)) < 0) {
    n.negate();
    var t = b; b = d; d = t;
    e1.set(b.x - a.x, b.y - a.y, b.z - a.z);
  }
  var w = a.dist(b), h = b.dist(c);
  var i0 = this.vert(a.x, a.y, a.z, n.x, n.y, n.z, 0, 0);
  var i1 = this.vert(b.x, b.y, b.z, n.x, n.y, n.z, w * uvScale, 0);
  var i2 = this.vert(c.x, c.y, c.z, n.x, n.y, n.z, w * uvScale, h * uvScale);
  var i3 = this.vert(d.x, d.y, d.z, n.x, n.y, n.z, 0, h * uvScale);
  return this.quad(i0, i1, i2, i3);
};
Builder.prototype.boxRot = function (hx, hy, hz, p, rxDeg, ryDeg, rzDeg, uvs) {
  var q = null;
  if (rxDeg || ryDeg || rzDeg) {
    q = new Quat();
    var qx = new Quat().fromAxisAngle(1, 0, 0, rad(rxDeg || 0));
    var qy = new Quat().fromAxisAngle(0, 1, 0, rad(ryDeg || 0));
    var qz = new Quat().fromAxisAngle(0, 0, 1, rad(rzDeg || 0));
    q.mul(qy, qx).mul(q, qz);
  }
  return this.box(hx, hy, hz, p, q, uvs);
};
Builder.prototype.cylinder = function (rBottom, rTop, length, seg, p, q, capBottom, capTop) {
  seg = seg || 12;
  if (capBottom === undefined) capBottom = true;
  if (capTop === undefined) capTop = true;
  var base = this.n;
  var hl = length * 0.5;
  var self = this;
  var P = new V3(), N = new V3();
  function put(x, y, z, nx, ny, nz, u, vv) {
    P.set(x, y, z); N.set(nx, ny, nz);
    if (q) { q.rotate(P, P); q.rotate(N, N); }
    if (p) P.add(p);
    return self.vert(P.x, P.y, P.z, N.x, N.y, N.z, u, vv);
  }

  var dr = rBottom - rTop;
  var slopeLen = Math.sqrt(dr * dr + length * length);
  var nzNorm = slopeLen > 1e-6 ? dr / slopeLen : 0;
  var nrNorm = slopeLen > 1e-6 ? length / slopeLen : 1;

  for (var i = 0; i <= seg; i++) {
    var a = i / seg * TAU;
    var cosA = Math.cos(a), sinA = Math.sin(a);
    var nx = cosA * nrNorm, ny = sinA * nrNorm, nz = nzNorm;
    put(cosA * rBottom, sinA * rBottom, -hl, nx, ny, nz, i / seg, 0);
    put(cosA * rTop, sinA * rTop, hl, nx, ny, nz, i / seg, 1);
  }

  for (var s = 0; s < seg; s++) {
    this.quad(base + s * 2, base + s * 2 + 2, base + s * 2 + 3, base + s * 2 + 1);
  }

  if (capBottom && rBottom > 0.001) {
    var cBot = put(0, 0, -hl, 0, 0, -1, 0.5, 0.5);
    var ringB = [];
    for (var j = 0; j <= seg; j++) {
      var b = j / seg * TAU;
      ringB.push(put(Math.cos(b) * rBottom, Math.sin(b) * rBottom, -hl, 0, 0, -1, 0.5 + Math.cos(b) * 0.5, 0.5 + Math.sin(b) * 0.5));
    }
    for (var t = 0; t < seg; t++) {
      this.tri(cBot, ringB[t + 1], ringB[t]);
    }
  }

  if (capTop && rTop > 0.001) {
    var cTop = put(0, 0, hl, 0, 0, 1, 0.5, 0.5);
    var ringT = [];
    for (var j2 = 0; j2 <= seg; j2++) {
      var b2 = j2 / seg * TAU;
      ringT.push(put(Math.cos(b2) * rTop, Math.sin(b2) * rTop, hl, 0, 0, 1, 0.5 + Math.cos(b2) * 0.5, 0.5 + Math.sin(b2) * 0.5));
    }
    for (var t2 = 0; t2 < seg; t2++) {
      this.tri(cTop, ringT[t2], ringT[t2 + 1]);
    }
  }
  return this;
};
Builder.prototype.lightningBolt = function (scale, thickness, p, q) {
  var self = this;
  var P = new V3(), N = new V3();

  var pts = [
    { x: -0.35, y:  0.8 }, // V0
    { x:  0.35, y:  0.8 }, // V1
    { x:  0.05, y:  0.15 }, // V2
    { x:  0.45, y:  0.15 }, // V3
    { x:  0.0,  y: -0.9 }, // V4
    { x: -0.15, y: -0.1 }, // V5
    { x: -0.45, y: -0.1 }  // V6
  ];

  var frontIdx = [];
  var backIdx = [];

  function put(x, y, z, nx, ny, nz) {
    P.set(x, y, z);
    N.set(nx, ny, nz);
    if (q) { q.rotate(P, P); q.rotate(N, N); }
    if (p) P.add(p);
    return self.vert(P.x, P.y, P.z, N.x, N.y, N.z, (x / scale + 0.5), (y / scale + 0.5));
  }

  // 1. Front Face Vertices (Z = +thickness/2)
  for (var i = 0; i < 7; i++) {
    frontIdx.push(put(pts[i].x * scale, pts[i].y * scale, thickness * 0.5, 0, 0, 1));
  }
  // 2. Back Face Vertices (Z = -thickness/2)
  for (var i = 0; i < 7; i++) {
    backIdx.push(put(pts[i].x * scale, pts[i].y * scale, -thickness * 0.5, 0, 0, -1));
  }

  // 3. Front Face Triangles (Counter-Clockwise winding)
  this.tri(frontIdx[0], frontIdx[2], frontIdx[1]);
  this.tri(frontIdx[0], frontIdx[6], frontIdx[2]);
  this.tri(frontIdx[6], frontIdx[5], frontIdx[2]);
  this.tri(frontIdx[2], frontIdx[4], frontIdx[3]);
  this.tri(frontIdx[2], frontIdx[5], frontIdx[4]);

  // 4. Back Face Triangles (Clockwise winding looking from front, which is CCW from back)
  this.tri(backIdx[0], backIdx[1], backIdx[2]);
  this.tri(backIdx[0], backIdx[2], backIdx[6]);
  this.tri(backIdx[6], backIdx[2], backIdx[5]);
  this.tri(backIdx[2], backIdx[3], backIdx[4]);
  this.tri(backIdx[2], backIdx[4], backIdx[5]);

  // 5. Side Panels
  for (var k = 0; k < 7; k++) {
    var next = (k + 1) % 7;
    var dx = pts[next].x - pts[k].x;
    var dy = pts[next].y - pts[k].y;
    var len = Math.sqrt(dx * dx + dy * dy);
    var nx = 0, ny = 0;
    if (len > 1e-5) {
      nx = -dy / len;
      ny = dx / len;
    }

    var f0 = put(pts[k].x * scale, pts[k].y * scale, thickness * 0.5, nx, ny, 0);
    var f1 = put(pts[next].x * scale, pts[next].y * scale, thickness * 0.5, nx, ny, 0);
    var b1 = put(pts[next].x * scale, pts[next].y * scale, -thickness * 0.5, nx, ny, 0);
    var b0 = put(pts[k].x * scale, pts[k].y * scale, -thickness * 0.5, nx, ny, 0);

    // Correct CCW winding for side panels to prevent backface culling
    this.quad(f0, f1, b1, b0);
  }

  return this;
};
Builder.prototype.lightningBoltOutline = function (scale, tubeRadius) {
  var pts = [
    { x: -0.35, y:  0.8 },
    { x:  0.35, y:  0.8 },
    { x:  0.05, y:  0.15 },
    { x:  0.45, y:  0.15 },
    { x:  0.0,  y: -0.9 },
    { x: -0.15, y: -0.1 },
    { x: -0.45, y: -0.1 }
  ];

  var scalePts = pts.map(function(pt) {
    return new V3(pt.x * scale, pt.y * scale, 0);
  });

  for (var k = 0; k < 7; k++) {
    var p1 = scalePts[k];
    var p2 = scalePts[(k + 1) % 7];
    this.tube(p1, p2, tubeRadius, 8);
    this.sphere(tubeRadius, 8, 6, p1);
  }

  return this;
};
Builder.prototype.tube = function (p1, p2, radius, seg) {
  seg = seg || 8;
  var dir = new V3().subV(p2, p1);
  var len = dir.len();
  if (len < 1e-4) return this;
  dir.norm();
  var mid = new V3().addV(p1, p2).scale(0.5);
  var zAxis = new V3(0, 0, 1);
  var q = new Quat();
  var dot = zAxis.dot(dir);
  if (dot > 0.9999) {
    q.identity();
  } else if (dot < -0.9999) {
    q.fromAxisAngle(1, 0, 0, PI);
  } else {
    var axis = new V3().cross(zAxis, dir).norm();
    var angle = Math.acos(clamp(dot, -1, 1));
    q.fromAxisAngle(axis.x, axis.y, axis.z, angle);
  }
  return this.cylinder(radius, radius, len, seg, mid, q, true, true);
};
Builder.prototype.count = function () { return this.i.length; };

var BIAS_M4 = new Float32Array([
  0.5, 0.0, 0.0, 0.0,
  0.0, 0.5, 0.0, 0.0,
  0.0, 0.0, 0.5, 0.0,
  0.5, 0.5, 0.5, 1.0
]);

var VS_SHADOW = [
  "#version 300 es",
  "layout(location = 0) in vec3 aPos;",
  "uniform mat4 uLightVP;",
  "uniform mat4 uModel;",
  "void main(){",
  "  gl_Position = uLightVP * (uModel * vec4(aPos, 1.0));",
  "}"
].join("\n");

var FS_SHADOW = [
  "#version 300 es",
  "precision highp float;",
  "void main(){}"
].join("\n");

var VS_MAIN = [
  "#version 300 es",
  "layout(location = 0) in vec3 aPos;",
  "layout(location = 1) in vec3 aNormal;",
  "layout(location = 2) in vec2 aUV;",
  "uniform mat4 uVP; uniform mat4 uModel; uniform mat3 uNM; uniform mat4 uShadowVP;",
  "uniform float uTime; uniform float uCrowd;",
  "uniform vec2 uUVScroll;",
  "out vec3 vN; out vec3 vW; out vec2 vUV; out vec4 vShadowCoord;",
  "out vec3 vLocalPos; out vec3 vLocalN;",
  "void main(){",
  "  vec4 w = uModel * vec4(aPos, 1.0);",
  "  if (uCrowd > 0.5 && aPos.y > 1.8) {",
  "    float wave = sin(uTime * 4.2 - aUV.x * 26.0) * 0.5 + 0.5;",
  "    float bounce = sin(uTime * 7.5 + aPos.x * 0.9 + aPos.z * 0.7) * 0.5 + 0.5;",
  "    float cheer = pow(wave, 3.5) * 0.55 + pow(bounce, 3.0) * 0.20;",
  "    w.y += cheer * clamp((aPos.y - 1.8) * 0.16, 0.0, 1.0);",
  "  }",
  "  vLocalPos = aPos;",
  "  vLocalN = aNormal;",
  "  vW = w.xyz; vN = uNM * aNormal; vUV = aUV + uUVScroll;",
  "  vShadowCoord = uShadowVP * w;",
  "  gl_Position = uVP * w;",
  "}"
].join("\n");
var FS_MAIN = [
  "#version 300 es",
  "precision highp float;",
  "precision highp sampler2D;",
  "precision highp sampler2DShadow;",
  "in vec3 vN; in vec3 vW; in vec2 vUV; in vec4 vShadowCoord;",
  "in vec3 vLocalPos; in vec3 vLocalN;",
  "uniform vec3 uColor; uniform vec3 uEmissive; uniform vec3 uCam; uniform vec3 uFogCol;",
  "uniform float uOpacity; uniform float uSpec; uniform float uUseTex; uniform float uFog;",
  "uniform float uAlphaTest; uniform float uRim;",
  "uniform float uFlood; uniform float uSun; uniform float uAmb; uniform float uBump;",
  "uniform float uClearcoat; uniform float uMetallic; uniform float uAO; uniform float uFlakes;",
  "uniform float uShadowEnable; uniform float uShadowSoftness;",
  "uniform float uTime; uniform float uCrowd;",
  "uniform float uVinylId; uniform vec3 uVinylColor; uniform float uVinylEmissive; uniform float uVinylScale; uniform float uVinylAnimated;",
  "uniform highp sampler2D uTex;",
  "uniform highp sampler2DShadow uShadowMap;",
  "out vec4 outColor;",
  // Primary Daylight Sun Vector
  "const vec3 L_SUN = vec3(-0.32, 0.82, 0.45);",
  // 6 Stadium Floodlight Sources (4 Corners + 2 Sidelines)
  "const vec3 L_C1 = vec3(-0.62, 0.74, -0.52);",
  "const vec3 L_C2 = vec3( 0.62, 0.74, -0.52);",
  "const vec3 L_C3 = vec3(-0.62, 0.74,  0.52);",
  "const vec3 L_C4 = vec3( 0.62, 0.74,  0.52);",
  "const vec3 L_M1 = vec3(-0.78, 0.62,  0.00);",
  "const vec3 L_M2 = vec3( 0.78, 0.62,  0.00);",
  "",
  "float calcShadow(vec4 sc, float NdotL) {",
  "  if (uShadowEnable < 0.5) return 1.0;",
  "  vec3 proj = sc.xyz / sc.w;",
  "  if (proj.x < 0.01 || proj.x > 0.99 || proj.y < 0.01 || proj.y > 0.99 || proj.z > 1.0 || proj.z < 0.0) {",
  "    return 1.0;",
  "  }",
  "  float slope = 1.0 - max(NdotL, 0.0);",
  "  float bias = max(0.0032 * slope, 0.0010);",
  "  vec2 texel = vec2(1.0 / 1024.0) * max(uShadowSoftness, 0.8);",
  "  float s = 0.0;",
  "  s += texture(uShadowMap, vec3(proj.xy + vec2(-0.8, -0.8) * texel, proj.z - bias));",
  "  s += texture(uShadowMap, vec3(proj.xy + vec2( 0.8, -0.8) * texel, proj.z - bias));",
  "  s += texture(uShadowMap, vec3(proj.xy + vec2(-0.8,  0.8) * texel, proj.z - bias));",
  "  s += texture(uShadowMap, vec3(proj.xy + vec2( 0.8,  0.8) * texel, proj.z - bias));",
  "  // Soft realistic daylight shadow fill (never a harsh pure-black streak)",
  "  return mix(0.50, 1.0, s * 0.25);",
  "}",
  "",
  "void main(){",
  "  vec4 tex = vec4(1.0);",
  "  if (uUseTex > 0.5) tex = texture(uTex, vUV);",
  "  if (uAlphaTest > 0.5 && tex.a < 0.20) discard;",
  "  vec3 base = uColor * tex.rgb;",
  // =========================================================================
  // HIGH-PRECISION 3D SURFACE PROCEDURAL CAR VINYL DECALS
  // Uses vLocalPos (x=width, y=height, z=length) & vLocalN for distortion-free mapping!
  // =========================================================================
  "  float vMask = 0.0;",
  "  float vGlow = 0.0;",
  "  if (uVinylId > 0.5) {",
  "    float vScale = max(uVinylScale, 0.1);",
  "    float distCenter = abs(vLocalPos.x); // Exact 0.0 at Hood/Roof center line",
  "    float zPos = vLocalPos.z;           // +1.2 at Hood Nose, -1.2 at Rear Bumper",
  "    float yPos = vLocalPos.y;           // +0.6 at Roof Top, -0.2 at Side Skirt",
  "",
  "    // Hood / Roof Projection (Centered at Hood x=0.0)",
  "    vec2 hUV = vec2(vLocalPos.x / (0.65 * vScale), (zPos + 1.2) / 2.4);",
  "",
  "    // Side Door Projection",
  "    vec2 sUV = vec2((zPos + 1.2) / 2.4, (yPos + 0.2) / 0.8);",
  "",
  "    float isTop = smoothstep(0.10, 0.45, vLocalN.y);",
  "    float isSide = smoothstep(0.10, 0.45, abs(vLocalN.x));",
  "",
  "    // 1. RACING_STRIPES (Twin GT Center Stripes)",
  "    if (uVinylId > 0.5 && uVinylId < 1.5) {",
  "      float s1 = smoothstep(0.015, 0.005, abs(distCenter - 0.08 * vScale) - 0.035 * vScale);",
  "      float p1 = smoothstep(0.008, 0.002, abs(distCenter - 0.140 * vScale) - 0.006 * vScale);",
  "      vMask = max(s1, p1) * isTop;",
  "    }",
  "    // 2. CYBER_GRID (Matrix Pulse Grid)",
  "    else if (uVinylId >= 1.5 && uVinylId < 2.5) {",
  "      vec2 gUV = vLocalPos.xz * 12.0 * vScale;",
  "      if (uVinylAnimated > 0.5) gUV.y -= uTime * 2.2;",
  "      vec2 gGrid = abs(fract(gUV - 0.5) - 0.5) / (fwidth(gUV) + 0.001);",
  "      float gLine = 1.0 - min(min(gGrid.x, gGrid.y), 1.0);",
  "      float pulse = sin(zPos * 10.0 - uTime * 6.0) * 0.5 + 0.5;",
  "      vMask = clamp(gLine, 0.0, 1.0) * (0.6 + 0.4 * pulse);",
  "      vGlow = vMask * (1.5 + 1.5 * pulse);",
  "    }",
  "    // 3. FLAME_SURGE (Dynamic Flowing Flames)",
  "    else if (uVinylId >= 2.5 && uVinylId < 3.5) {",
  "      float animY = uVinylAnimated > 0.5 ? uTime * 3.5 : 0.0;",
  "      float wave1 = sin(distCenter * 25.0 - animY + zPos * 8.0) * 0.08;",
  "      float wave2 = cos(distCenter * 45.0 + animY * 1.5 - zPos * 12.0) * 0.04;",
  "      float flameLimit = 0.50 - (distCenter * 1.2) + wave1 + wave2;",
  "      float fMask = smoothstep(flameLimit - 0.05, flameLimit + 0.02, hUV.y);",
  "      vMask = (1.0 - fMask) * max(isTop, isSide * 0.8);",
  "      vGlow = vMask * (1.8 + sin(uTime * 10.0 + distCenter * 20.0) * 0.6);",
  "    }",
  "    // 4. LIGHTNING_STORM (Electric Plasma Bolts)",
  "    else if (uVinylId >= 3.5 && uVinylId < 4.5) {",
  "      float tE = uVinylAnimated > 0.5 ? uTime * 9.0 : 0.0;",
  "      float jag1 = sin(zPos * 25.0 + floor(tE) * 17.13) * 0.10 + sin(zPos * 50.0 - tE * 2.0) * 0.04;",
  "      float bolt1 = smoothstep(0.020, 0.003, abs(distCenter - 0.12 - jag1));",
  "      float jag2 = cos(zPos * 35.0 + floor(tE * 1.3) * 23.41) * 0.08;",
  "      float bolt2 = smoothstep(0.016, 0.002, abs(distCenter - 0.26 - jag2));",
  "      vMask = max(bolt1, bolt2);",
  "      vGlow = vMask * (2.2 + sin(uTime * 20.0) * 0.8);",
  "    }",
  "    // 5. WAVE_FLOW (Holo Wave Stream)",
  "    else if (uVinylId >= 4.5 && uVinylId < 5.5) {",
  "      float tW = uVinylAnimated > 0.5 ? uTime * 4.0 : 0.0;",
  "      float wSin = sin(zPos * 18.0 - tW + sin(distCenter * 12.0) * 2.5);",
  "      float wCos = cos(distCenter * 20.0 + zPos * 10.0 - tW * 0.8);",
  "      vMask = smoothstep(0.4, 0.9, wSin * 0.5 + wCos * 0.5);",
  "      vGlow = pow(vMask, 2.0) * (1.4 + sin(tW * 1.5) * 0.4);",
  "    }",
  "    // 6. CARBON_HEX (Hex Honeycomb Carbon)",
  "    else if (uVinylId >= 5.5 && uVinylId < 6.5) {",
  "      vec2 cUV = vLocalPos.xz * 18.0 * vScale;",
  "      vec2 hFract = abs(fract(cUV) - 0.5);",
  "      float hexDist = max(hFract.x * 0.866025 + hFract.y * 0.5, hFract.y);",
  "      vMask = smoothstep(0.40, 0.48, hexDist);",
  "    }",
  "    // 7. CAMO_TACTICAL (Urban Tactical Camo)",
  "    else if (uVinylId >= 6.5 && uVinylId < 7.5) {",
  "      vec2 cUV = floor(vLocalPos.xz * 10.0 * vScale);",
  "      float cHash = fract(sin(dot(cUV, vec2(127.1, 311.7))) * 43758.5453);",
  "      vMask = smoothstep(0.45, 0.55, cHash);",
  "    }",
  "    // 8. DIGITAL_MATRIX (Digital Rain Matrix)",
  "    else if (uVinylId >= 7.5 && uVinylId < 8.5) {",
  "      float tM = uVinylAnimated > 0.5 ? uTime * 5.0 : 0.0;",
  "      vec2 mUV = vec2(vLocalPos.x * 15.0, zPos * 10.0) * vScale;",
  "      float colSpeed = fract(sin(floor(mUV.x) * 45.13) * 912.4) * 2.0 + 1.0;",
  "      float drop = fract(mUV.y * 0.15 - tM * 0.3 * colSpeed);",
  "      float charHash = fract(sin(dot(floor(vec2(mUV.x, mUV.y - tM * 3.0)), vec2(13.1, 71.7))) * 31415.9);",
  "      if (charHash > 0.55) vMask = pow(1.0 - drop, 3.0);",
  "      vGlow = vMask * 2.4;",
  "    }",
  "    // 9. SPEED_APEX (Apex Wings)",
  "    else if (uVinylId >= 8.5 && uVinylId < 9.5) {",
  "      float aZ = (zPos + 0.8) * 1.2 * vScale;",
  "      float apex1 = smoothstep(0.025, 0.005, abs(distCenter - aZ * 0.4) - 0.03);",
  "      float apex2 = smoothstep(0.025, 0.005, abs(distCenter - (aZ - 0.3) * 0.5) - 0.025);",
  "      vMask = max(apex1, apex2) * isTop;",
  "    }",
  "    // 10. SUNBURST_RAYS (Sunburst Rays)",
  "    else if (uVinylId >= 9.5 && uVinylId < 10.5) {",
  "      float angle = atan(zPos - 0.3, distCenter);",
  "      float rays = sin(angle * 16.0 * vScale);",
  "      vMask = smoothstep(0.3, 0.7, rays) * isTop;",
  "    }",
  "    // 11. DRAGON_FIRE (Mythic Dragon Breath & Animated Blazing Fire Streams)",
  "    else if (uVinylId >= 10.5 && uVinylId < 11.5) {",
  "      float tD = uVinylAnimated > 0.5 ? uTime * 8.0 : 0.0;",
  "      vec2 dHeadP = vec2(distCenter * 2.2, (zPos - 0.4) * 1.8);",
  "      float dHead = smoothstep(0.22, 0.15, length(dHeadP));",
  "      float hornL = smoothstep(0.025, 0.005, abs(distCenter - (zPos - 0.2) * 0.5 - 0.08) - 0.02) * step(0.2, zPos) * step(zPos, 0.7);",
  "      float fSpread = (zPos - 0.3) * 0.8;",
  "      float fTurb = sin(zPos * 25.0 - tD * 2.0 + distCenter * 20.0) * 0.05;",
  "      float flameBreath = smoothstep(fSpread + 0.08 + fTurb, fSpread - 0.02 + fTurb, distCenter) * step(0.3, zPos);",
  "      vMask = clamp(dHead + hornL + flameBreath, 0.0, 1.0) * max(isTop, isSide * 0.8);",
  "      vGlow = (flameBreath * 2.8 + dHead * 1.5) * (1.0 + 0.3 * sin(tD * 1.5));",
  "    }",
  "    // 12. PHOENIX_BLAZE (Immortal Phoenix Wing Crest & Solar Flares)",
  "    else if (uVinylId >= 11.5 && uVinylId < 12.5) {",
  "      float tP = uVinylAnimated > 0.5 ? uTime * 6.0 : 0.0;",
  "      float wingZ = abs(zPos - 0.3);",
  "      float wingSpan = sin(distCenter * 10.0 * vScale + tP * 0.4) * 0.08;",
  "      float wingArch = smoothstep(0.035, 0.008, abs(wingZ - (distCenter * 0.7 + wingSpan)) - 0.025);",
  "      float crestCore = smoothstep(0.18, 0.04, length(vec2(distCenter * 2.5, (zPos - 0.3) * 2.0)));",
  "      vMask = clamp(max(wingArch, crestCore), 0.0, 1.0) * isTop;",
  "      vGlow = vMask * (2.2 + sin(tP + distCenter * 10.0) * 0.8);",
  "    }",
  "    // 13. HERO_SPIDER_WEB (Superhero Spider-Web Suit & Neon Spider Emblem)",
  "    else if (uVinylId >= 12.5 && uVinylId < 13.5) {",
  "      vec2 centerP = vec2(0.0, 0.4);",
  "      vec2 toC = vec2(distCenter, zPos - centerP.y);",
  "      float dC = length(toC);",
  "      float webRings = smoothstep(0.015, 0.003, abs(fract(dC * 12.0 * vScale) - 0.5) - 0.42);",
  "      float webAngle = atan(toC.y, toC.x);",
  "      float webSpokes = smoothstep(0.018, 0.004, abs(sin(webAngle * 10.0)) - 0.92);",
  "      float spiderBody = smoothstep(0.08, 0.02, dC);",
  "      vMask = clamp(max(webRings * webSpokes, spiderBody), 0.0, 1.0) * max(isTop, isSide * 0.6);",
  "      vGlow = spiderBody * 2.5 + webRings * 0.6;",
  "    }",
  "    // 14. HERO_LIGHTNING_BOLT (Superhero Thunderbolt & Electric Shockwaves)",
  "    else if (uVinylId >= 13.5 && uVinylId < 14.5) {",
  "      float tZ = uVinylAnimated > 0.5 ? uTime * 10.0 : 0.0;",
  "      float boltPath = (zPos > 0.3) ? (zPos - 0.3) * 0.3 - 0.05 : (0.3 - zPos) * 0.4 + 0.04;",
  "      float boltMain = smoothstep(0.035 * vScale, 0.005, abs(distCenter - abs(boltPath)) - 0.025 * vScale);",
  "      float crackle = sin(zPos * 40.0 + floor(tZ) * 23.1) * 0.05;",
  "      float boltArc = smoothstep(0.02, 0.002, abs(distCenter - 0.22 - crackle));",
  "      vMask = max(boltMain, boltArc);",
  "      vGlow = vMask * (2.8 + sin(uTime * 25.0) * 0.8);",
  "    }",
  "    // 15. HERO_COSMIC_STAR (Cosmic Star Shield & Orbital Rings)",
  "    else if (uVinylId >= 14.5 && uVinylId < 15.5) {",
  "      float tS = uVinylAnimated > 0.5 ? uTime * 3.0 : 0.0;",
  "      vec2 sP = vec2(distCenter, zPos - 0.4);",
  "      float sDist = length(sP);",
  "      float sAng = atan(sP.y, sP.x) + tS * 0.3;",
  "      float starR = 0.16 + sin(sAng * 5.0) * 0.07;",
  "      float star = smoothstep(starR + 0.01, starR - 0.01, sDist);",
  "      float orbRing = smoothstep(0.018, 0.004, abs(sDist - 0.32) - 0.012);",
  "      vMask = clamp(max(star, orbRing), 0.0, 1.0) * isTop;",
  "      vGlow = star * 2.5 + orbRing * 1.6;",
  "    }",
  "    // 16. HERO_BAT_WING (Dark Knight Bat Wings Emblem)",
  "    else if (uVinylId >= 15.5 && uVinylId < 16.5) {",
  "      float bZ = (zPos - 0.4) * 2.0;",
  "      float bX = distCenter * 2.2;",
  "      float topEdge = 0.12 - bX * 0.2 + (bX < 0.15 ? (0.15 - bX) * 0.8 : 0.0);",
  "      float botEdge = -0.15 + sin(bX * 20.0) * 0.06 + bX * 0.3;",
  "      float batWing = step(botEdge, bZ) * step(bZ, topEdge) * step(bX, 0.65);",
  "      vMask = batWing * isTop;",
  "      vGlow = batWing * 1.8;",
  "    }",
  "    // 17. CUTE_STARS_GALAXY (Kawaii Twinkling Stars & Rainbow Sparkle Stream)",
  "    else if (uVinylId >= 16.5 && uVinylId < 17.5) {",
  "      float tK = uVinylAnimated > 0.5 ? uTime * 4.0 : 0.0;",
  "      vec2 kGrid = vLocalPos.xz * 12.0 * vScale;",
  "      vec2 kLocal = fract(kGrid) - 0.5;",
  "      float kHash = fract(sin(dot(floor(kGrid), vec2(12.9898, 78.233))) * 43758.5453);",
  "      float kStarDist = abs(kLocal.x) + abs(kLocal.y);",
  "      float twinkle = sin(tK * 3.0 + kHash * 20.0) * 0.5 + 0.5;",
  "      float kStar = (kHash > 0.40) ? smoothstep(0.28 * twinkle, 0.05, kStarDist) : 0.0;",
  "      vMask = kStar;",
  "      vGlow = kStar * 2.5 * (0.8 + 0.4 * twinkle);",
  "    }",
  "    // 18. CUTE_MONSTER_SMILE (Playful Cartoon Monster Teeth & Eyes)",
  "    else if (uVinylId >= 17.5 && uVinylId < 18.5) {",
  "      float mouthZ = zPos - 0.7 + pow(distCenter * 1.5, 2.0) * 0.2;",
  "      float mouthOpen = smoothstep(0.08, 0.05, abs(mouthZ) - 0.04) * step(distCenter, 0.35);",
  "      float teeth = abs(sin(distCenter * 40.0)) * mouthOpen;",
  "      vec2 eyeL = vec2(distCenter - 0.16, (zPos - 0.4) * 1.5);",
  "      float eyeOut = smoothstep(0.08, 0.05, length(eyeL));",
  "      float pupil = smoothstep(0.035, 0.020, length(eyeL));",
  "      vMask = clamp(mouthOpen * teeth + (eyeOut - pupil), 0.0, 1.0);",
  "      vGlow = vMask * 1.3;",
  "    }",
  "    // 19. CUTE_CANDY_SWEETS (Dripping Frosting Glaze & Rainbow Candy Sprinkles)",
  "    else if (uVinylId >= 18.5 && uVinylId < 19.5) {",
  "      float drip = sin(distCenter * 15.0) * 0.08 + cos(zPos * 20.0) * 0.04;",
  "      float glaze = smoothstep(0.3 + drip, 0.25 + drip, yPos);",
  "      vec2 sGrid = vLocalPos.xz * 20.0;",
  "      float sHash = fract(sin(dot(floor(sGrid), vec2(37.1, 89.3))) * 23421.6);",
  "      float sprinkle = (sHash > 0.65) ? smoothstep(0.2, 0.05, length(fract(sGrid) - 0.5)) : 0.0;",
  "      vMask = clamp(glaze * 0.8 + sprinkle, 0.0, 1.0);",
  "      vGlow = sprinkle * 1.8;",
  "    }",
  "    // 20. PIXEL_ARCADE_8BIT (Retro 8-Bit Arcade Invaders & Pixel Hearts)",
  "    else if (uVinylId >= 19.5 && uVinylId < 20.5) {",
  "      vec2 pUV = floor(vLocalPos.xz * 16.0 * vScale);",
  "      float pInvader = 0.0;",
  "      vec2 pCell = mod(pUV, 8.0);",
  "      vec2 pSym = vec2(abs(pCell.x - 3.5), pCell.y);",
  "      if (pSym.y == 1.0 && pSym.x < 1.0) pInvader = 1.0;",
  "      if (pSym.y == 2.0 && pSym.x < 2.0) pInvader = 1.0;",
  "      if (pSym.y == 3.0 && (pSym.x < 3.5 && pSym.x > 1.0)) pInvader = 1.0;",
  "      if (pSym.y == 4.0 && pSym.x < 3.0) pInvader = 1.0;",
  "      if (pSym.y == 5.0 && pSym.x > 1.5) pInvader = 1.0;",
  "      if (pSym.y == 6.0 && (pSym.x < 0.8 || pSym.x > 2.5)) pInvader = 1.0;",
  "      vMask = pInvader * isTop;",
  "      vGlow = pInvader * (2.0 + sin(uTime * 8.0) * 0.6);",
  "    }",
  "    // 21. CUTE_PAW_PRINTS (Walking Kitty/Puppy Paw Prints)",
  "    else if (uVinylId >= 20.5 && uVinylId < 21.5) {",
  "      vec2 pawUV = vec2(distCenter * 8.0, zPos * 6.0);",
  "      vec2 pawCell = fract(pawUV) - 0.5;",
  "      float pawHash = fract(sin(dot(floor(pawUV), vec2(23.7, 67.1))) * 54321.1);",
  "      float mainPad = smoothstep(0.18, 0.08, length(pawCell + vec2(0.0, 0.08)));",
  "      float toe1 = smoothstep(0.08, 0.02, length(pawCell - vec2(-0.16, 0.16)));",
  "      float toe2 = smoothstep(0.09, 0.02, length(pawCell - vec2(-0.06, 0.24)));",
  "      float toe3 = smoothstep(0.09, 0.02, length(pawCell - vec2( 0.06, 0.24)));",
  "      float toe4 = smoothstep(0.08, 0.02, length(pawCell - vec2( 0.16, 0.16)));",
  "      float paw = (pawHash > 0.35) ? max(mainPad, max(max(toe1, toe2), max(toe3, toe4))) : 0.0;",
  "      vMask = paw * isTop;",
  "    }",
  "    // 22. LAVA_MAGMA (Volcanic Molten Magma Fissures)",
  "    else if (uVinylId >= 21.5 && uVinylId < 22.5) {",
  "      float tL = uVinylAnimated > 0.5 ? uTime * 2.5 : 0.0;",
  "      vec2 lUV = vLocalPos.xz * 12.0 * vScale;",
  "      float n1 = sin(lUV.x * 2.0 + lUV.y * 1.5 - tL * 0.8) * 0.5 + 0.5;",
  "      float n2 = cos(lUV.x * 3.0 - lUV.y * 2.5 + tL * 1.2) * 0.5 + 0.5;",
  "      float crack = abs(n1 - n2);",
  "      float magma = smoothstep(0.14, 0.02, crack);",
  "      float pulse = sin(tL * 2.0 + zPos * 8.0) * 0.5 + 0.5;",
  "      vMask = magma;",
  "      vGlow = magma * (2.5 + pulse * 1.5);",
  "    }",
  "    // 23. QUANTUM_CIRCUIT (Quantum Golden PCB Microchip Tracks)",
  "    else if (uVinylId >= 22.5 && uVinylId < 23.5) {",
  "      float tQ = uVinylAnimated > 0.5 ? uTime * 4.0 : 0.0;",
  "      vec2 qUV = vLocalPos.xz * 14.0 * vScale;",
  "      vec2 qCell = fract(qUV);",
  "      float track = smoothstep(0.08, 0.02, abs(qCell.x - 0.5)) + smoothstep(0.08, 0.02, abs(qCell.y - 0.5));",
  "      float node = smoothstep(0.25, 0.15, length(qCell - 0.5));",
  "      float dataPkt = smoothstep(0.2, 0.05, length(qCell - vec2(fract(tQ * 0.4), 0.5)));",
  "      vMask = clamp(max(track * 0.8, node) + dataPkt, 0.0, 1.0);",
  "      vGlow = (node * 1.5 + dataPkt * 3.0);",
  "    }",
  "    // 24. NEON_TOKYO_DRIFT (Tokyo Midnight Drift Speed Slashes)",
  "    else if (uVinylId >= 23.5) {",
  "      float slash1 = smoothstep(0.035, 0.008, abs((sUV.x + sUV.y * 0.8) * 10.0 * vScale - 6.0) - 0.25);",
  "      float slash2 = smoothstep(0.025, 0.005, abs((sUV.x + sUV.y * 0.8) * 10.0 * vScale - 8.5) - 0.15);",
  "      float slash3 = smoothstep(0.020, 0.005, abs((sUV.x + sUV.y * 0.8) * 10.0 * vScale - 10.5) - 0.10);",
  "      vMask = max(max(slash1, slash2), slash3) * isSide;",
  "      vGlow = vMask * 1.8;",
  "    }",
  "",
  "    if (vMask > 0.001) {",
  "      base = mix(base, uVinylColor, clamp(vMask, 0.0, 1.0));",
  "    }",
  "  }",
  "  if (uCrowd > 0.5) {",
  "    vec2 gridUV = floor(vUV * vec2(192.0, 48.0));",
  "    float flashHash = fract(sin(dot(gridUV, vec2(12.9898, 78.233)) + floor(uTime * 14.0) * 0.07) * 43758.5453);",
  "    if (flashHash > 0.985) {",
  "      vec3 flashCol = vec3(1.2, 1.15, 1.05) * 3.2;",
  "      base += flashCol;",
  "    }",
  "    float waveGlow = sin(uTime * 4.2 - vUV.x * 26.0) * 0.5 + 0.5;",
  "    base += vec3(0.08, 0.12, 0.18) * pow(waveGlow, 2.5);",
  "  }",
  "  vec3 N = normalize(vN);",
  "  if (!gl_FrontFacing) N = -N;",
  // High-Impact True Procedural Bump / Normal mapping with Surface Gradient Formulation from Alpha Heightmap
  "  float seamAO = 1.0;",
  "  if (uBump > 0.001 && uUseTex > 0.5) {",
  "    vec2 uvStepX = vec2(1.5 / 1024.0, 0.0);",
  "    vec2 uvStepY = vec2(0.0, 1.5 / 1024.0);",
  "    float hTL = texture(uTex, vUV - uvStepX + uvStepY).a;",
  "    float hU  = texture(uTex, vUV + uvStepY).a;",
  "    float hTR = texture(uTex, vUV + uvStepX + uvStepY).a;",
  "    float hL  = texture(uTex, vUV - uvStepX).a;",
  "    float hC  = texture(uTex, vUV).a;",
  "    float hR  = texture(uTex, vUV + uvStepX).a;",
  "    float hBL = texture(uTex, vUV - uvStepX - uvStepY).a;",
  "    float hD  = texture(uTex, vUV - uvStepY).a;",
  "    float hBR = texture(uTex, vUV + uvStepX - uvStepY).a;",
  "    float dU = (hTR + 2.0 * hR + hBR) - (hTL + 2.0 * hL + hBL);",
  "    float dV = (hTL + 2.0 * hU + hTR) - (hBL + 2.0 * hD + hBR);",
  "    vec3 dp1 = dFdx(vW);",
  "    vec3 dp2 = dFdy(vW);",
  "    vec2 duv1 = dFdx(vUV);",
  "    vec2 duv2 = dFdy(vUV);",
  "    vec3 dp2perp = cross(dp2, N);",
  "    vec3 dp1perp = cross(N, dp1);",
  "    vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;",
  "    vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;",
  "    float lenTB = dot(T, T) + dot(B, B);",
  "    float invmax = inversesqrt(max(lenTB, 1e-6));",
  "    vec3 surfGrad = (T * (dU * invmax) + B * (dV * invmax));",
  "    float bumpScale = uBump * 16.0;",
  "    N = normalize(N - surfGrad * bumpScale);",
  "    seamAO = clamp(hC * 1.6 + 0.10, 0.15, 1.0);",
  "  } else if (uBump > 0.001) {",
  "    vec3 p = vW * 12.0;",
  "    float pGroove = sin(p.x * 2.0) * cos(p.z * 2.0);",
  "    vec3 gradP = vec3(dFdx(pGroove), 0.0, dFdy(pGroove));",
  "    N = normalize(N - gradP * (uBump * 0.35));",
  "  }",
  "  vec3 V = normalize(uCam - vW);",
  "  float NdotV = clamp(dot(N, V), 0.0, 1.0);",
  // Chassis Cavity & Ground Ambient Occlusion (underbody crevices, wheel wells)
  "  float groundAO = clamp(vW.y * 0.45 + 0.55, 0.50, 1.0);",
  "  float normalAO = clamp(N.y * 0.30 + 0.70, 0.60, 1.0);",
  "  float totalAO = mix(1.0, groundAO * normalAO, clamp(uAO, 0.0, 1.0)) * seamAO;",
  // Environmental hemisphere lighting: clear sky above, warm bounce below
  "  float hemi = clamp(N.y * 0.5 + 0.5, 0.0, 1.0);",
  "  vec3 skyAmb = vec3(0.28, 0.38, 0.52) * uAmb;",
  "  vec3 groundBounce = vec3(0.12, 0.18, 0.10) * uAmb;",
  "  vec3 amb = mix(groundBounce, skyAmb, hemi) * totalAO;",
  // Direct Sunlight with directional shadow map
  "  vec3 nLSun = normalize(L_SUN);",
  "  float NdotL = max(dot(N, nLSun), 0.0);",
  "  float NdotL_wrap = clamp((dot(N, nLSun) + 0.25) / 1.25, 0.0, 1.0);",
  "  float effectiveDiffuse = mix(NdotL, NdotL_wrap, 0.35);",
  // Vehicles NEVER self-shadow from world map so vehicle paint is always brilliantly lit
  "  float shadow = 1.0;",
  "  if (uClearcoat < 0.001 && uAO < 0.001 && uMetallic < 0.001) {",
  "    shadow = calcShadow(vShadowCoord, NdotL);",
  "  }",
  "  vec3 sunColor = vec3(1.0, 0.96, 0.90) * uSun;",
  "  vec3 sunDiffuse = sunColor * (effectiveDiffuse * shadow);",
  // Stadium Floodlight Multi-Source Fill
  "  vec3 nLC1 = normalize(L_C1); vec3 nLC2 = normalize(L_C2);",
  "  vec3 nLC3 = normalize(L_C3); vec3 nLC4 = normalize(L_C4);",
  "  vec3 nLM1 = normalize(L_M1); vec3 nLM2 = normalize(L_M2);",
  "  float dCorners = max(dot(N, nLC1), 0.0) + max(dot(N, nLC2), 0.0) + max(dot(N, nLC3), 0.0) + max(dot(N, nLC4), 0.0);",
  "  float dSides = max(dot(N, nLM1), 0.0) + max(dot(N, nLM2), 0.0);",
  "  vec3 floodDiffuse = ((dCorners * vec3(0.020, 0.023, 0.028)) + (dSides * vec3(0.024, 0.027, 0.032))) * (uFlood * totalAO);",
  // PBR Diffuse: Keep full vibrant base colors without washing out or darkening to mud
  "  vec3 diffuseBase = base * (1.0 - clamp(uMetallic * 0.35, 0.0, 0.50));",
  "  vec3 lit = diffuseBase * (amb + sunDiffuse + floodDiffuse);",
  // Physically-Based Microfacet GGX Basecoat Specular (saturated with metallic tint)
  "  vec3 HSun = normalize(nLSun + V);",
  "  float NdotH = max(dot(N, HSun), 0.0);",
  "  float roughness = clamp(1.0 - uSpec * 0.90, 0.03, 1.0);",
  "  float alphaR = roughness * roughness;",
  "  float alpha2 = alphaR * alphaR;",
  "  float denomSun = (NdotH * NdotH * (alpha2 - 1.0) + 1.0);",
  "  float D_GGX = alpha2 / (3.14159265 * denomSun * denomSun + 1e-5);",
  "  float fresnel = pow(1.0 - NdotV, 4.0);",
  "  vec3 F0 = mix(vec3(0.04), base * 1.25 + vec3(0.06), clamp(uMetallic, 0.0, 1.0));",
  "  vec3 F = F0 + (vec3(1.0) - F0) * fresnel;",
  "  vec3 specularSun = F * (D_GGX * 0.45) * sunColor * (uSpec * 3.0 * shadow);",
  // Multi-Layer Clearcoat (High-Gloss Automotive Lacquer - Transparent, never bleaching paint!)
  "  vec3 clearcoatLobe = vec3(0.0);",
  "  if (uClearcoat > 0.02) {",
  "    float NdotH_cc = max(dot(N, HSun), 0.0);",
  "    float ccSpec = pow(NdotH_cc, 160.0);",
  "    vec3 ccSunHighlight = vec3(1.0, 0.98, 0.92) * (ccSpec * 3.2 * shadow * uClearcoat);",
  "    float ccFresnel = pow(1.0 - NdotV, 5.0) * uClearcoat;",
  "    vec3 skyRefl = mix(base * 0.30, vec3(0.70, 0.85, 1.0), 0.40) * (ccFresnel * 0.45);",
  "    clearcoatLobe = ccSunHighlight + skyRefl;",
  "  }",
  // Dynamic Stadium Floodlight Glints
  "  vec3 floodSpec = vec3(0.0);",
  "  if (uFlood > 0.01 && uSpec > 0.15) {",
  "    vec3 H1 = normalize(nLC1 + V); vec3 H2 = normalize(nLC2 + V);",
  "    vec3 H3 = normalize(nLC3 + V); vec3 H4 = normalize(nLC4 + V);",
  "    vec3 HM1 = normalize(nLM1 + V); vec3 HM2 = normalize(nLM2 + V);",
  "    float glintExp = mix(38.0, 160.0, clamp(uMetallic + uClearcoat * 0.5, 0.0, 1.0));",
  "    float spC = pow(max(dot(N, H1), 0.0), glintExp) + pow(max(dot(N, H2), 0.0), glintExp) +",
  "                pow(max(dot(N, H3), 0.0), glintExp) + pow(max(dot(N, H4), 0.0), glintExp);",
  "    float spM = pow(max(dot(N, HM1), 0.0), glintExp) + pow(max(dot(N, HM2), 0.0), glintExp);",
  "    vec3 glintTint = mix(vec3(0.9, 0.95, 1.0), base * 1.4, clamp(uMetallic * 0.6, 0.0, 1.0));",
  "    floodSpec = glintTint * (spC * 0.12 + spM * 0.18) * (uFlood * uSpec * 2.6);",
  "  }",
  // Glancing sky sheen & clearcoat environment reflection
  "  vec3 R = reflect(-V, N);",
  "  float skyFac = clamp(R.y * 0.5 + 0.5, 0.0, 1.0);",
  "  vec3 envColor = mix(groundBounce, skyAmb * 1.2, skyFac);",
  "  vec3 envReflection = pow(1.0 - NdotV, 4.0) * envColor * (uSpec * 0.20 + uRim * 0.25);",
  "  vec3 col = lit + specularSun + clearcoatLobe + floodSpec + envReflection + uEmissive + (uVinylColor * (vGlow * uVinylEmissive * 1.5));",
  // Atmospheric Fog
  "  float dist = length(uCam - vW);",
  "  float fog = 1.0 - exp(-dist * uFog);",
  "  col = mix(col, uFogCol, clamp(fog, 0.0, 1.0));",
  // Standard ACES Film Tonemapper (Preserves rich, solid, vibrant saturated colors)
  "  vec3 aCol = col * (2.51 * col + 0.03);",
  "  vec3 bCol = col * (2.43 * col + 0.59) + 0.14;",
  "  vec3 tonemapped = clamp(aCol / bCol, 0.0, 1.0);",
  "  outColor = vec4(tonemapped, uOpacity * (uAlphaTest > 0.5 ? tex.a : 1.0));",
  "}"
].join("\n");

var VS_GRASS = [
  "#version 300 es",
  "layout(location = 0) in vec3 aBladePos;",
  "layout(location = 1) in vec3 aBladeNormal;",
  "layout(location = 2) in vec2 aBladeUV;",
  "layout(location = 3) in vec4 aInstPosRot;",
  "layout(location = 4) in vec3 aInstScale;",
  "uniform mat4 uVP; uniform mat4 uShadowVP;",
  "uniform float uTime; uniform float uWindSpeed; uniform float uWindStrength; uniform float uGrassHeight; uniform float uGrassWidth; uniform float uTremble;",
  "uniform vec3 uCarPos; uniform vec3 uBallPos; uniform vec3 uCam;",
  "out vec3 vN; out vec3 vW; out vec2 vUV; out vec4 vShadowCoord; out float vHeight; out float vStripe; out vec2 vRootXZ; out float vCamDist;",
  "void main(){",
  "  vec3 rootPos = aInstPosRot.xyz;",
  "  vec3 toCam = rootPos - uCam;",
  "  float camDist = length(toCam);",
  "  float rot = aInstPosRot.w;",
  "  float hRatio = aBladePos.y;",
  "  vHeight = hRatio;",
  "  vUV = aBladeUV;",
  "  vRootXZ = rootPos.xz;",
  "  vCamDist = camDist;",
  "  vStripe = sin(rootPos.z * 0.65) * 0.5 + 0.5;",
  "  float wMult = uGrassWidth > 0.005 ? uGrassWidth : 1.0;",
  "  float wScale = aInstScale.x * 0.042 * wMult;",
  "  float hScale = aInstScale.y * uGrassHeight * 0.75;",
  "  vec3 localPos = vec3(aBladePos.x * wScale, aBladePos.y * hScale, aBladePos.z * wScale);",
  "  float cosR = cos(rot), sinR = sin(rot);",
  "  vec3 rotated = vec3(localPos.x * cosR - localPos.z * sinR, localPos.y, localPos.x * sinR + localPos.z * cosR);",
  "  vec3 wPos = rootPos + rotated;",
  "  // Fast single-pass wind calculation for max GPU speed",
  "  float t = uTime * uWindSpeed;",
  "  float wind = sin(t * 2.5 + rootPos.x * 0.18 + rootPos.z * 0.22) * uWindStrength * 0.45;",
  "  float bend = hRatio * hRatio * wind;",
  "  wPos.x += bend * hScale * 0.8;",
  "  wPos.z += bend * hScale * 0.5;",
  "  // Fast interaction push for car and ball near surface",
  "  if (hRatio > 0.15) {",
  "    vec2 toCar = wPos.xz - uCarPos.xz;",
  "    float dCarSq = dot(toCar, toCar);",
  "    if (dCarSq < 4.0) {",
  "      float p = (1.0 - sqrt(dCarSq) * 0.5) * hRatio * 0.30;",
  "      wPos.xz += normalize(toCar + vec2(1e-4)) * p;",
  "    }",
  "    vec2 toBall = wPos.xz - uBallPos.xz;",
  "    float dBallSq = dot(toBall, toBall);",
  "    if (dBallSq < 1.0) {",
  "      float p = (1.0 - sqrt(dBallSq)) * hRatio * 0.15;",
  "      wPos.xz += normalize(toBall + vec2(1e-4)) * p;",
  "    }",
  "  }",
  "  // Pure upward ground normal for 100% uniform color across all pitch grass",
  "  vN = vec3(0.0, 1.0, 0.0);",
  "  vW = wPos;",
  "  vShadowCoord = uShadowVP * vec4(wPos, 1.0);",
  "  gl_Position = uVP * vec4(wPos, 1.0);",
  "}"
].join("\n");

var FS_GRASS = [
  "#version 300 es",
  "precision highp float;",
  "precision highp sampler2DShadow;",
  "in vec3 vN; in vec3 vW; in vec2 vUV; in vec4 vShadowCoord; in float vHeight; in float vStripe; in vec2 vRootXZ; in float vCamDist;",
  "uniform vec3 uCam; uniform vec3 uFogCol; uniform float uFog;",
  "uniform float uSun; uniform float uAmb; uniform float uFlood;",
  "uniform float uShadowEnable; uniform float uShadowSoftness;",
  "uniform float uTipCream; uniform float uSubsurface;",
  "uniform vec2 uArenaHalf;",
  "uniform sampler2D uFieldTex;",
  "uniform highp sampler2DShadow uShadowMap;",
  "out vec4 outColor;",
  "const vec3 L_SUN = vec3(-0.32, 0.82, 0.45);",
  "float calcShadow(vec4 sc) {",
  "  if (uShadowEnable < 0.5) return 1.0;",
  "  vec3 proj = sc.xyz / sc.w;",
  "  if (proj.x < 0.01 || proj.x > 0.99 || proj.y < 0.01 || proj.y > 0.99 || proj.z > 1.0 || proj.z < 0.0) return 1.0;",
  "  float edgeFade = clamp(min(min(proj.x, 1.0 - proj.x), min(proj.y, 1.0 - proj.y)) * 12.0, 0.0, 1.0);",
  "  float bias = 0.0020;",
  "  vec2 texel = vec2(1.0 / 1024.0) * max(uShadowSoftness, 0.8);",
  "  float s = 0.0;",
  "  s += texture(uShadowMap, vec3(proj.xy + vec2(-0.8, -0.8) * texel, proj.z - bias));",
  "  s += texture(uShadowMap, vec3(proj.xy + vec2( 0.8, -0.8) * texel, proj.z - bias));",
  "  s += texture(uShadowMap, vec3(proj.xy + vec2(-0.8,  0.8) * texel, proj.z - bias));",
  "  s += texture(uShadowMap, vec3(proj.xy + vec2( 0.8,  0.8) * texel, proj.z - bias));",
  "  float rawShadow = mix(0.55, 1.0, s * 0.25);",
  "  return mix(1.0, rawShadow, edgeFade);",
  "}",
  "void main(){",
  "  vec3 N = vec3(0.0, 1.0, 0.0);",
  "  vec2 fieldUV = vec2((vRootXZ.x + uArenaHalf.x) / (2.0 * uArenaHalf.x), (vRootXZ.y + uArenaHalf.y) / (2.0 * uArenaHalf.y));",
  "  vec4 fieldCol = texture(uFieldTex, clamp(fieldUV, 0.0, 1.0));",
  "  float lineWhiteness = min(fieldCol.r, min(fieldCol.g, fieldCol.b));",
  "  float lineLuma = dot(fieldCol.rgb, vec3(0.299, 0.587, 0.114));",
  "  float maxChannel = max(fieldCol.r, max(fieldCol.g, fieldCol.b));",
  "  float lineFactor = max(lineWhiteness * 1.25, (maxChannel > 0.65 && lineLuma > 0.38) ? lineLuma * 1.15 : 0.0);",
  "  float lineMarking = smoothstep(0.36, 0.65, lineFactor);",
  "  // 100% Rich, uniform, lush green base color synchronized with pitch texture",
  "  vec3 lushGreen = fieldCol.rgb;",
  "  vec3 rootCol = lushGreen * 0.94;",
  "  vec3 midCol  = lushGreen * 1.00;",
  "  vec3 tipCol  = lushGreen * 1.04;",
  "  vec3 whiteLineRoot = vec3(0.85, 0.87, 0.89);",
  "  vec3 whiteLineMid  = vec3(0.95, 0.97, 0.98);",
  "  vec3 whiteLineTip  = vec3(1.00, 1.00, 1.00);",
  "  rootCol = mix(rootCol, whiteLineRoot, lineMarking);",
  "  midCol  = mix(midCol,  whiteLineMid,  lineMarking);",
  "  tipCol  = mix(tipCol,  whiteLineTip,  lineMarking);",
  "  vec3 baseColor = (vHeight < 0.50) ? mix(rootCol, midCol, vHeight / 0.50) : mix(midCol, tipCol, (vHeight - 0.50) / 0.50);",
  "  float rootAO = clamp(vHeight * 0.65 + 0.70, 0.70, 1.0);",
  "  vec3 nLSun = normalize(L_SUN);",
  "  float NdotL = max(dot(N, nLSun), 0.0);",
  "  float shadow = calcShadow(vShadowCoord);",
  "  vec3 sunColor = vec3(1.0, 0.96, 0.88) * uSun;",
  "  vec3 sunLight = sunColor * (NdotL * shadow * 0.85 + 0.15);",
  "  vec3 skyAmb = vec3(0.28, 0.38, 0.52) * uAmb;",
  "  vec3 ambLight = skyAmb * rootAO;",
  "  vec3 col = baseColor * (ambLight + sunLight);",
  "  float dist = vCamDist;",
  "  float fog = 1.0 - exp(-dist * uFog);",
  "  col = mix(col, uFogCol, clamp(fog, 0.0, 1.0));",
  "  vec3 aCol = col * (2.51 * col + 0.03);",
  "  vec3 bCol = col * (2.43 * col + 0.59) + 0.14;",
  "  vec3 tonemapped = clamp(aCol / bCol, 0.0, 1.0);",
  "  outColor = vec4(tonemapped, 1.0);",
  "}"
].join("\n");
var VS_PART = [
  "#version 300 es",
  "layout(location = 0) in vec2 aCorner;",
  "layout(location = 1) in vec3 iPos;",
  "layout(location = 2) in vec4 iCol;",
  "layout(location = 3) in vec2 iSize;",
  "uniform mat4 uVP; uniform vec3 uRight; uniform vec3 uUp;",
  "out vec2 vUV; out vec4 vCol;",
  "void main(){",
  "  vec3 w = iPos + uRight * aCorner.x * iSize.x + uUp * aCorner.y * iSize.y;",
  "  vUV = aCorner * 0.5 + 0.5; vCol = iCol;",
  "  gl_Position = uVP * vec4(w, 1.0);",
  "}"
].join("\n");
var FS_PART = [
  "#version 300 es",
  "precision highp float;",
  "precision highp sampler2D;",
  "in vec2 vUV; in vec4 vCol;",
  "uniform highp sampler2D uTex;",
  "out vec4 outColor;",
  "void main(){ vec4 t = texture(uTex, vUV); outColor = vec4(vCol.rgb * t.rgb, vCol.a * t.a); }"
].join("\n");
var VS_LINE = [
  "#version 300 es",
  "layout(location = 0) in vec3 aPos;",
  "layout(location = 1) in vec3 aCol;",
  "uniform mat4 uVP;",
  "out vec3 vCol;",
  "void main(){ vCol = aCol; gl_Position = uVP * vec4(aPos,1.0); }"
].join("\n");
var FS_LINE = [
  "#version 300 es",
  "precision highp float;",
  "in vec3 vCol; out vec4 outColor;",
  "void main(){ outColor = vec4(vCol, 1.0); }"
].join("\n");

export function Renderer(canvas) {
  this.canvas = canvas;
  var opts = { antialias: true, alpha: false, powerPreference: "high-performance", depth: true, stencil: false };
  var gl = canvas.getContext("webgl2", opts);
  if (!gl) throw new Error("WebGL2 is not available in this browser.");
  this.gl = gl;
  this.time = 0;
  this.vpDirty = true;
  this.proj = M4(); this.view = M4(); this.vp = M4();
  this.model = M4(); this.nm = new Float32Array(9);
  this.camPos = new V3(0, 3, -12);
  this.fogColor = [0.62, 0.78, 0.95];
  this.fogDensity = 0.0022;
  this.drawCalls = 0;
  this.dpr = 1;
  this.progMain = this.program(VS_MAIN, FS_MAIN);
  this.progPart = this.program(VS_PART, FS_PART);
  this.progLine = this.program(VS_LINE, FS_LINE);
  this.progGrass = this.program(VS_GRASS, FS_GRASS);
  this.extAniso = gl.getExtension("EXT_texture_filter_anisotropic") ||
                  gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") ||
                  gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
  this.maxAniso = this.extAniso ? gl.getParameter(this.extAniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) || 8 : 1;
  this.uMain = this.uniforms(this.progMain, [
    "uVP", "uModel", "uNM", "uColor", "uEmissive", "uCam", "uFogCol",
    "uOpacity", "uSpec", "uUseTex", "uFog", "uAlphaTest", "uRim",
    "uFlood", "uSun", "uAmb", "uBump", "uTex",
    "uClearcoat", "uMetallic", "uAO", "uFlakes",
    "uShadowVP", "uShadowMap", "uShadowEnable", "uShadowSoftness",
    "uTime", "uCrowd", "uUVScroll",
    "uVinylId", "uVinylColor", "uVinylEmissive", "uVinylScale", "uVinylAnimated"
  ]);
  this.uGrass = this.uniforms(this.progGrass, [
    "uVP", "uShadowVP", "uShadowMap", "uShadowEnable", "uShadowSoftness",
    "uCam", "uFogCol", "uFog", "uSun", "uAmb", "uFlood",
    "uTime", "uWindSpeed", "uWindStrength", "uGrassHeight", "uGrassWidth", "uTremble",
    "uTipCream", "uSubsurface", "uCarPos", "uBallPos",
    "uArenaHalf", "uFieldTex"
  ]);
  this.uPart = this.uniforms(this.progPart, ["uVP", "uRight", "uUp", "uTex"]);
  this.uLine = this.uniforms(this.progLine, ["uVP"]);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.clearColor(this.fogColor[0], this.fogColor[1], this.fogColor[2], 1);
  var white = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, white);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  this.whiteTex = white;
  this.initParticles(4096);
  this.initLines(24000);
  this.initShadowMap();
  this.initGrass();
  this.texCache = {};
  this.curProg = null;
  this.curTex = null;
  this.curVAO = null;
  this.curCull = true;
  this.lastClockStr = null;
  this.lastScore0 = null;
  this.lastScore1 = null;
  this.lastTitle = null;
}
Renderer.prototype.program = function (vsrc, fsrc) {
  var gl = this.gl;
  function sh(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error("Shader: " + gl.getShaderInfoLog(s));
    return s;
  }
  var p = gl.createProgram();
  gl.attachShader(p, sh(gl.VERTEX_SHADER, vsrc));
  gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fsrc));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error("Link: " + gl.getProgramInfoLog(p));
  return p;
};
Renderer.prototype.uniforms = function (p, names) {
  var o = {}, gl = this.gl;
  for (var i = 0; i < names.length; i++) o[names[i]] = gl.getUniformLocation(p, names[i]);
  return o;
};
Renderer.prototype.mesh = function (builder) {
  var gl = this.gl;
  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  var vb = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vb);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(builder.v), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 32, 0);
  gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 32, 12);
  gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 32, 24);
  var ib = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
  var big = builder.n > 65535;
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, big ? new Uint32Array(builder.i) : new Uint16Array(builder.i), gl.STATIC_DRAW);
  gl.bindVertexArray(null);
  return { vao: vao, count: builder.i.length, type: big ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT };
};
Renderer.prototype.texture = function (canvas, repeat, mips) {
  var gl = this.gl, t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mips === false ? gl.LINEAR : gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  if (mips !== false) {
    gl.generateMipmap(gl.TEXTURE_2D);
    if (this.extAniso && this.maxAniso > 1) {
      gl.texParameterf(gl.TEXTURE_2D, this.extAniso.TEXTURE_MAX_ANISOTROPY_EXT, this.maxAniso);
    }
  }
  return t;
};
Renderer.prototype.resize = function (scale) {
  var gl = this.gl, c = this.canvas;
  var gfxScale = scale || (CFG.gfx && CFG.gfx.renderScale) || 1;
  var perfMode = (CFG.gfx && CFG.gfx.perfMode) || "BALANCED";
  var maxDpr = perfMode === "ULTRA" ? 1.25 : (perfMode === "HIGH" ? 2.0 : 1.6);
  this.dpr = Math.min(Math.min(window.devicePixelRatio || 1, 2) * gfxScale, maxDpr);
  var w = Math.max(320, Math.floor(c.clientWidth * this.dpr));
  var h = Math.max(240, Math.floor(c.clientHeight * this.dpr));
  if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
  gl.viewport(0, 0, c.width, c.height);
  this.aspect = c.width / c.height;
};
Renderer.prototype.beginFrame = function (camPos, camTarget, camUp, fovDeg, dt) {
  var gl = this.gl;
  this.time = (this.time || 0) + (dt !== undefined && dt > 0 ? dt : 0.01667);
  this.camPos.copy(camPos);
  m4perspective(this.proj, rad(fovDeg), this.aspect || 1.6, 0.12, 480);
  m4lookAt(this.view, camPos, camTarget, camUp);
  m4mul(this.vp, this.proj, this.view);
  gl.depthMask(true);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.disable(gl.BLEND);
  gl.useProgram(this.progMain);
  this.curProg = this.progMain;
  this.curTex = null;
  this.curVAO = null;
  this.curCull = true;
  gl.uniformMatrix4fv(this.uMain.uVP, false, this.vp);
  gl.uniform3f(this.uMain.uCam, camPos.x, camPos.y, camPos.z);
  gl.uniform3f(this.uMain.uFogCol, this.fogColor[0], this.fogColor[1], this.fogColor[2]);
  gl.uniform1f(this.uMain.uFog, this.fogDensity);
  var gfx = CFG.gfx || {};
  gl.uniform1f(this.uMain.uFlood, gfx.floodlightIntensity !== undefined ? gfx.floodlightIntensity : 0.35);
  gl.uniform1f(this.uMain.uSun, gfx.sunIntensity !== undefined ? gfx.sunIntensity : 0.95);
  gl.uniform1f(this.uMain.uAmb, gfx.ambientLight !== undefined ? gfx.ambientLight : 0.85);
  gl.uniform1f(this.uMain.uTime, this.time);
  gl.uniform1f(this.uMain.uCrowd, 0.0);

  // Bind shadow depth texture on unit 1
  if (this.shadowDepthTex) {
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.shadowDepthTex);
    gl.uniform1i(this.uMain.uShadowMap, 1);
    gl.activeTexture(gl.TEXTURE0);
  }
  gl.uniform1i(this.uMain.uTex, 0);

  if (this.shadowVP) {
    gl.uniformMatrix4fv(this.uMain.uShadowVP, false, this.shadowVP);
  }
  gl.uniform1f(this.uMain.uShadowEnable, gfx.shadowMapping !== false ? 1.0 : 0.0);
  gl.uniform1f(this.uMain.uShadowSoftness, gfx.shadowSoftness !== undefined ? gfx.shadowSoftness : 1.0);

  this.drawCalls = 0;
  this.blendMode = "none";
  this.camRight = tv(this.view[0], this.view[4], this.view[8]).clone();
  this.camUp = tv(this.view[1], this.view[5], this.view[9]).clone();
};
Renderer.prototype.setBlend = function (mode) {
  if (this.blendMode === mode) return;
  var gl = this.gl;
  this.blendMode = mode;
  if (mode === "none") { gl.disable(gl.BLEND); gl.depthMask(true); return; }
  gl.enable(gl.BLEND);
  if (mode === "alpha") { gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false); }
  else if (mode === "add") { gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.depthMask(false); }
  else if (mode === "shadow") { gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false); }
};
var MAT_DEFAULT = {
  color: [0.8, 0.8, 0.85],
  emissive: [0, 0, 0],
  opacity: 1,
  spec: 0.35,
  tex: null,
  blend: "none",
  cull: true,
  rim: 0.25,
  alphaTest: false,
  clearcoat: 0.0,
  metallic: 0.0,
  ao: 0.0,
  flakes: 0.0,
  crowd: 0.0,
  vinylId: 0.0,
  vinylColor: [1.0, 1.0, 1.0],
  vinylEmissive: 0.0,
  vinylScale: 1.0,
  vinylAnimated: false
};
Renderer.prototype.draw = function (mesh, pos, quat, scale, mat) {
  var gl = this.gl, u = this.uMain;
  mat = mat || MAT_DEFAULT;
  var sx = scale ? scale.x : 1, sy = scale ? scale.y : 1, sz = scale ? scale.z : 1;
  m4compose(this.model, pos, quat, sx, sy, sz);
  m3fromM4(this.nm, this.model);
  if (sx !== sy || sy !== sz) {
    this.nm[0] /= sx * sx; this.nm[1] /= sx * sx; this.nm[2] /= sx * sx;
    this.nm[3] /= sy * sy; this.nm[4] /= sy * sy; this.nm[5] /= sy * sy;
    this.nm[6] /= sz * sz; this.nm[7] /= sz * sz; this.nm[8] /= sz * sz;
  }
  if (this.curProg !== this.progMain) {
    gl.useProgram(this.progMain);
    this.curProg = this.progMain;
  }
  gl.uniformMatrix4fv(u.uModel, false, this.model);
  gl.uniformMatrix3fv(u.uNM, false, this.nm);
  var c = mat.color || MAT_DEFAULT.color, e = mat.emissive || MAT_DEFAULT.emissive;
  gl.uniform3f(u.uColor, c[0], c[1], c[2]);
  gl.uniform3f(u.uEmissive, e[0], e[1], e[2]);
  gl.uniform1f(u.uOpacity, mat.opacity === undefined ? 1 : mat.opacity);
  gl.uniform1f(u.uSpec, mat.spec === undefined ? 0.35 : mat.spec);
  gl.uniform1f(u.uRim, mat.rim === undefined ? 0.25 : mat.rim);
  gl.uniform1f(u.uBump, mat.bump !== undefined ? mat.bump : 0.0);
  gl.uniform1f(u.uClearcoat, mat.clearcoat !== undefined ? mat.clearcoat : 0.0);
  gl.uniform1f(u.uMetallic, mat.metallic !== undefined ? mat.metallic : 0.0);
  gl.uniform1f(u.uAO, mat.ao !== undefined ? mat.ao : 0.0);
  gl.uniform1f(u.uFlakes, mat.flakes !== undefined ? mat.flakes : 0.0);
  gl.uniform1f(u.uAlphaTest, mat.alphaTest ? 1 : 0);
  gl.uniform1f(u.uUseTex, mat.tex ? 1 : 0);
  gl.uniform1f(u.uCrowd, mat.crowd !== undefined ? mat.crowd : 0.0);
  gl.uniform2f(u.uUVScroll, mat.uvScroll ? mat.uvScroll[0] : 0, mat.uvScroll ? mat.uvScroll[1] : 0);

  // Vinyl decal and dynamic animated shader parameters
  gl.uniform1f(u.uVinylId, mat.vinylId !== undefined ? mat.vinylId : 0.0);
  var vc = mat.vinylColor || MAT_DEFAULT.vinylColor;
  gl.uniform3f(u.uVinylColor, vc[0], vc[1], vc[2]);
  gl.uniform1f(u.uVinylEmissive, mat.vinylEmissive !== undefined ? mat.vinylEmissive : 0.0);
  gl.uniform1f(u.uVinylScale, mat.vinylScale !== undefined ? mat.vinylScale : 1.0);
  gl.uniform1f(u.uVinylAnimated, mat.vinylAnimated ? 1.0 : 0.0);

  var wantTex = mat.tex || this.whiteTex;
  if (this.curTex !== wantTex) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, wantTex);
    this.curTex = wantTex;
  }
  this.setBlend(mat.blend || "none");
  var wantCull = mat.cull !== false;
  if (this.curCull !== wantCull) {
    if (wantCull) gl.enable(gl.CULL_FACE); else gl.disable(gl.CULL_FACE);
    this.curCull = wantCull;
  }
  if (this.curVAO !== mesh.vao) {
    gl.bindVertexArray(mesh.vao);
    this.curVAO = mesh.vao;
  }
  gl.drawElements(gl.TRIANGLES, mesh.count, mesh.type, 0);
  this.drawCalls++;
};
Renderer.prototype.initGrass = function () {
  var gl = this.gl;
  // 6-vertex rounded-top smooth 3D grass blade geometry (4 triangles, 12 indices)
  // Format per vertex: pos(x,y,z), normal(x,y,z), uv(u,v) -> 8 floats
  // Soft curved top edges instead of sharp piercing needle points
  var bladeVerts = new Float32Array([
    -0.48, 0.00, 0.0,   0.0, 0.94, 0.34,  0.00, 0.00,
     0.48, 0.00, 0.0,   0.0, 0.94, 0.34,  1.00, 0.00,
    -0.40, 0.50, 0.0,   0.0, 0.91, 0.41,  0.10, 0.50,
     0.40, 0.50, 0.0,   0.0, 0.91, 0.41,  0.90, 0.50,
    -0.22, 0.96, 0.0,   0.0, 0.86, 0.51,  0.25, 0.96,
     0.22, 0.96, 0.0,   0.0, 0.86, 0.51,  0.75, 0.96
  ]);
  var bladeIndices = new Uint16Array([
    0, 1, 2,  // LOD 1: 1 triangle (far distance)
    1, 3, 2,  // LOD 2: 2 triangles (mid distance quad)
    2, 3, 4,  // LOD 3: upper transition
    3, 5, 4   // Soft rounded crown (creamy smooth top)
  ]);

  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  var vb = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vb);
  gl.bufferData(gl.ARRAY_BUFFER, bladeVerts, gl.STATIC_DRAW);

  // aBladePos (location 0)
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 32, 0);
  // aBladeNormal (location 1)
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 32, 12);
  // aBladeUV (location 2)
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 32, 24);

  var ib = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, bladeIndices, gl.STATIC_DRAW);

  // Instanced attribute locations 3 and 4
  gl.enableVertexAttribArray(3);
  gl.vertexAttribDivisor(3, 1);

  gl.enableVertexAttribArray(4);
  gl.vertexAttribDivisor(4, 1);

  gl.bindVertexArray(null);

  this.grassVAO = vao;
  this.grassChunks = [];
  this.grassCount = 0;
  this.frustumPlanes = new Float32Array(24);
  var initialCount = (CFG.gfx && CFG.gfx.grassBladeCount) || 1500000;
  this.generateGrassInstances(initialCount);
};
Renderer.prototype.generateGrassInstances = function (count) {
  var gl = this.gl;
  count = Math.max(5000, Math.min(count || 1500000, 5000000));

  var CHUNKS_X = 12;
  var CHUNKS_Z = 14;
  var TOTAL_CHUNKS = CHUNKS_X * CHUNKS_Z;

  // Global grass cache dictionary on renderer instance
  if (!this.grassCache) this.grassCache = {};

  // If already compiled and cached in GPU VRAM for this exact blade count, reuse instantly
  if (this.grassCache[count]) {
    this.grassChunks = this.grassCache[count];
    this.grassCount = count;
    this.lastGrassCount = count;
    return;
  }

  var arena = CFG.arena || {};
  var halfW = (arena.hx ? arena.hx - 0.4 : 61.0);
  var halfL = (arena.hz ? arena.hz - 0.4 : 76.4);
  var cornerR = (arena.cornerFillet ? arena.cornerFillet - 0.4 : 11.9);
  var stepX = (halfW * 2) / CHUNKS_X;
  var stepZ = (halfL * 2) / CHUNKS_Z;

  var chunks = [];
  for (var ci = 0; ci < TOTAL_CHUNKS; ci++) {
    chunks.push({
      buffer: gl.createBuffer(),
      count: 0,
      cx: 0,
      cz: 0,
      radius: 0
    });
  }

  // Fast deterministic LCG pseudo-random generator
  var seed = 0x85ebca6b ^ (count & 0xffff);
  function fastRand() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  var bladesPerChunk = Math.ceil(count / TOTAL_CHUNKS);
  var chunkData = new Float32Array(bladesPerChunk * 7);

  var chunkIdx = 0;
  for (var gz = 0; gz < CHUNKS_Z; gz++) {
    var minZ = -halfL + gz * stepZ;
    var maxZ = minZ + stepZ;
    var cz = (minZ + maxZ) * 0.5;

    for (var gx = 0; gx < CHUNKS_X; gx++) {
      var minX = -halfW + gx * stepX;
      var maxX = minX + stepX;
      var cx = (minX + maxX) * 0.5;

      var radius = Math.hypot(maxX - cx, maxZ - cz) + 0.8;
      var chunk = chunks[chunkIdx++];
      chunk.cx = cx;
      chunk.cz = cz;
      chunk.radius = radius;

      var written = 0;
      var ptr = 0;

      for (var b = 0; b < bladesPerChunk; b++) {
        var rx = minX + fastRand() * stepX;
        var rz = minZ + fastRand() * stepZ;

        // Pitch corner rounding check
        var cornerX = Math.abs(rx) - (halfW - cornerR);
        var cornerZ = Math.abs(rz) - (halfL - cornerR);
        if (cornerX > 0 && cornerZ > 0 && (cornerX * cornerX + cornerZ * cornerZ) > (cornerR * cornerR)) {
          rx = cx + (rx - cx) * 0.45;
          rz = cz + (rz - cz) * 0.45;
        }

        var rot = fastRand() * 6.2831853;
        var wScale = 0.80 + fastRand() * 0.40;
        var hScale = 0.75 + fastRand() * 0.50;
        var clump = fastRand();

        chunkData[ptr++] = rx;
        chunkData[ptr++] = 0.012; // Resting on turf surface
        chunkData[ptr++] = rz;
        chunkData[ptr++] = rot;

        chunkData[ptr++] = wScale;
        chunkData[ptr++] = hScale;
        chunkData[ptr++] = clump;

        written++;
      }

      chunk.count = written;
      gl.bindBuffer(gl.ARRAY_BUFFER, chunk.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, chunkData.subarray(0, written * 7), gl.STATIC_DRAW);
    }
  }

  this.grassCache[count] = chunks;
  this.grassChunks = chunks;
  this.grassCount = count;
  this.lastGrassCount = count;
};
Renderer.prototype.updateFrustumPlanes = function () {
  var m = this.vp;
  var p = this.frustumPlanes;
  if (!p) {
    p = this.frustumPlanes = new Float32Array(24);
  }

  // Left: row3 + row0
  var a = m[3] + m[0], b = m[7] + m[4], c = m[11] + m[8], d = m[15] + m[12];
  var inv = 1.0 / (Math.sqrt(a * a + b * b + c * c) || 1.0);
  p[0] = a * inv; p[1] = b * inv; p[2] = c * inv; p[3] = d * inv;

  // Right: row3 - row0
  a = m[3] - m[0]; b = m[7] - m[4]; c = m[11] - m[8]; d = m[15] - m[12];
  inv = 1.0 / (Math.sqrt(a * a + b * b + c * c) || 1.0);
  p[4] = a * inv; p[5] = b * inv; p[6] = c * inv; p[7] = d * inv;

  // Bottom: row3 + row1
  a = m[3] + m[1]; b = m[7] + m[5]; c = m[11] + m[9]; d = m[15] + m[13];
  inv = 1.0 / (Math.sqrt(a * a + b * b + c * c) || 1.0);
  p[8] = a * inv; p[9] = b * inv; p[10] = c * inv; p[11] = d * inv;

  // Top: row3 - row1
  a = m[3] - m[1]; b = m[7] - m[5]; c = m[11] - m[9]; d = m[15] - m[13];
  inv = 1.0 / (Math.sqrt(a * a + b * b + c * c) || 1.0);
  p[12] = a * inv; p[13] = b * inv; p[14] = c * inv; p[15] = d * inv;

  // Near: row3 + row2
  a = m[3] + m[2]; b = m[7] + m[6]; c = m[11] + m[10]; d = m[15] + m[14];
  inv = 1.0 / (Math.sqrt(a * a + b * b + c * c) || 1.0);
  p[16] = a * inv; p[17] = b * inv; p[18] = c * inv; p[19] = d * inv;

  // Far: row3 - row2
  a = m[3] - m[2]; b = m[7] - m[6]; c = m[11] - m[10]; d = m[15] - m[14];
  inv = 1.0 / (Math.sqrt(a * a + b * b + c * c) || 1.0);
  p[20] = a * inv; p[21] = b * inv; p[22] = c * inv; p[23] = d * inv;
};
Renderer.prototype.isChunkInFrustum = function (cx, cz, radius) {
  var p = this.frustumPlanes;
  for (var i = 0; i < 6; i++) {
    var off = i * 4;
    var dist = p[off] * cx + p[off + 1] * 0.25 + p[off + 2] * cz + p[off + 3];
    if (dist < -radius) return false;
  }
  return true;
};
Renderer.prototype.drawGrass = function (arena, cars, ball) {
  var gfx = CFG.gfx || {};
  if (gfx.grassEnabled === false) return;
  if (!this.progGrass || !this.grassVAO || this.grassCount <= 0) return;

  var targetCount = gfx.grassBladeCount || 150000;
  if (gfx.grassDensity === "HYPER_DENSE" || gfx.grassDensity === "HYPER") targetCount = 5000000;
  else if (gfx.grassDensity === "CINEMATIC_MAX" || gfx.grassDensity === "MAX") targetCount = 3000000;
  else if (gfx.grassDensity === "OPTIMIZED_2_5M") targetCount = 2500000;
  else if (gfx.grassDensity === "OPTIMIZED_2M") targetCount = 2000000;
  else if (gfx.grassDensity === "EXTREME") targetCount = 1500000;
  else if (gfx.grassDensity === "ULTRA_DENSE") targetCount = 750000;
  else if (gfx.grassDensity === "ULTRA") targetCount = 350000;
  else if (gfx.grassDensity === "HIGH") targetCount = 150000;
  else if (gfx.grassDensity === "BALANCED") targetCount = 60000;
  else if (gfx.grassDensity === "LOW") targetCount = 25000;
  else if (typeof gfx.grassBladeCount === "number") targetCount = gfx.grassBladeCount;

  targetCount = Math.max(5000, Math.min(targetCount, 5000000));

  if (targetCount !== this.grassCount) {
    this.generateGrassInstances(targetCount);
  }

  var gl = this.gl;
  var u = this.uGrass;

  gl.useProgram(this.progGrass);
  this.curProg = this.progGrass;
  this.curVAO = this.grassVAO;
  this.curTex = null;

  gl.uniformMatrix4fv(u.uVP, false, this.vp);
  gl.uniform3f(u.uCam, this.camPos.x, this.camPos.y, this.camPos.z);
  gl.uniform3f(u.uFogCol, this.fogColor[0], this.fogColor[1], this.fogColor[2]);
  gl.uniform1f(u.uFog, this.fogDensity);
  gl.uniform1f(u.uSun, gfx.sunIntensity !== undefined ? gfx.sunIntensity : 0.95);
  gl.uniform1f(u.uAmb, gfx.ambientLight !== undefined ? gfx.ambientLight : 0.85);
  gl.uniform1f(u.uFlood, gfx.floodlightIntensity !== undefined ? gfx.floodlightIntensity : 0.35);

  // Dynamic multi-harmonic wind & flutter jitter
  var time = this.time || 0.0;
  gl.uniform1f(u.uTime, time);
  gl.uniform1f(u.uWindSpeed, gfx.grassWindSpeed !== undefined ? gfx.grassWindSpeed : 1.4);
  gl.uniform1f(u.uWindStrength, gfx.grassWaveStrength !== undefined ? gfx.grassWaveStrength : 0.85);
  gl.uniform1f(u.uGrassHeight, gfx.grassHeight !== undefined ? gfx.grassHeight : 0.65);
  gl.uniform1f(u.uGrassWidth, gfx.grassBladeWidth !== undefined ? gfx.grassBladeWidth : 1.0);
  gl.uniform1f(u.uTremble, gfx.grassTremble !== undefined ? gfx.grassTremble : 0.80);
  gl.uniform1f(u.uTipCream, gfx.grassTipCreaminess !== undefined ? gfx.grassTipCreaminess : 0.95);
  gl.uniform1f(u.uSubsurface, gfx.grassSubsurface !== undefined ? gfx.grassSubsurface : 0.75);

  // Pitch Arena Dimensions & Soccer Field Texture for White Chalk Markings & Turf Tint
  var hx = (arena && arena.hx) || 40.0;
  var hz = (arena && arena.hz) || 50.0;
  gl.uniform2f(u.uArenaHalf, hx, hz);

  if (this.texField) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texField);
    gl.uniform1i(u.uFieldTex, 0);
  }

  // Interactive collision positions (car and ball bend grass on contact)
  var carPos = (cars && cars[0] && cars[0].body && cars[0].body.pos) ? cars[0].body.pos : _vPos.set(999, 999, 999);
  gl.uniform3f(u.uCarPos, carPos.x, carPos.y, carPos.z);
  var ballPos = (ball && ball.body && ball.body.pos) ? ball.body.pos : _vPos.set(999, 999, 999);
  gl.uniform3f(u.uBallPos, ballPos.x, ballPos.y, ballPos.z);

  // Shadow Map on Unit 1
  if (this.shadowDepthTex) {
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.shadowDepthTex);
    gl.uniform1i(u.uShadowMap, 1);
    gl.activeTexture(gl.TEXTURE0);
  }
  if (this.shadowVP) {
    gl.uniformMatrix4fv(u.uShadowVP, false, this.shadowVP);
  }
  gl.uniform1f(u.uShadowEnable, gfx.shadowMapping !== false ? 1.0 : 0.0);
  gl.uniform1f(u.uShadowSoftness, gfx.shadowSoftness !== undefined ? gfx.shadowSoftness : 1.0);

  // Double-sided grass rendering with depth buffer test
  gl.disable(gl.CULL_FACE);
  this.curCull = false;
  this.setBlend("none");

  this.updateFrustumPlanes();

  var camX = this.camPos.x;
  var camZ = this.camPos.z;
  var MAX_GRASS_DIST = 72.0; // Optimized distance threshold for maximum 60 FPS performance

  gl.bindVertexArray(this.grassVAO);

  var numChunks = (this.grassChunks && this.grassChunks.length) || 0;
  for (var k = 0; k < numChunks; k++) {
    var chunk = this.grassChunks[k];
    if (chunk.count <= 0) continue;

    // 1. Distance culling to chunk boundary
    var dx = chunk.cx - camX;
    var dz = chunk.cz - camZ;
    var dist = Math.sqrt(dx * dx + dz * dz);
    if (dist - chunk.radius > MAX_GRASS_DIST) continue;

    // 2. Frustum culling (skip chunks behind camera or outside FOV)
    if (!this.isChunkInFrustum(chunk.cx, chunk.cz, chunk.radius + 1.2)) continue;

    // 3. Multi-tier LOD density calculation based on camera distance
    // We render the full 12 indices (creamy rounded crown) to keep the grass level 100% flat and even, avoiding cut-off heights in the distance!
    var indexCount = 12;
    var drawInstances = chunk.count;

    if (dist > 48.0) {
      drawInstances = Math.floor(chunk.count * 0.40);
    } else if (dist > 25.0) {
      drawInstances = Math.floor(chunk.count * 0.70);
    }

    // Bind chunk instance buffer & set pointers
    gl.bindBuffer(gl.ARRAY_BUFFER, chunk.buffer);
    gl.vertexAttribPointer(3, 4, gl.FLOAT, false, 28, 0);
    gl.vertexAttribPointer(4, 3, gl.FLOAT, false, 28, 16);

    gl.drawElementsInstanced(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0, drawInstances);
    this.drawCalls++;
  }

  gl.enable(gl.CULL_FACE);
  this.curCull = true;
};
Renderer.prototype.initShadowMap = function () {
  var gl = this.gl;
  var size = 1024;
  this.shadowSize = size;
  var depthTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, depthTex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, size, size, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
  this.shadowDepthTex = depthTex;

  var fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTex, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  this.shadowFBO = fbo;

  this.progShadow = this.program(VS_SHADOW, FS_SHADOW);
  this.uShadow = this.uniforms(this.progShadow, ["uLightVP", "uModel"]);

  this.lightView = M4();
  this.lightProj = M4();
  this.lightVP = M4();
  this.shadowVP = M4();

  // Sunlight shadow matrices covering entire playing field
  var sunDir = tv(-0.32, 0.82, 0.45).norm();
  var eye = tv(sunDir.x * 75.0, sunDir.y * 75.0, sunDir.z * 75.0);
  var target = tv(0, 2.0, 0);
  var up = tv(0, 1, 0);
  m4lookAt(this.lightView, eye, target, up);
  m4ortho(this.lightProj, -52, 52, -65, 65, 15, 160);
  m4mul(this.lightVP, this.lightProj, this.lightView);
  m4mul(this.shadowVP, BIAS_M4, this.lightVP);
};
Renderer.prototype.drawShadowMesh = function (mesh, pos, quat, scale) {
  var gl = this.gl;
  if (!mesh) return;
  var sx = scale ? scale.x : 1, sy = scale ? scale.y : 1, sz = scale ? scale.z : 1;
  m4compose(this.model, pos, quat, sx, sy, sz);
  gl.uniformMatrix4fv(this.uShadow.uModel, false, this.model);
  if (this.curVAO !== mesh.vao) {
    gl.bindVertexArray(mesh.vao);
    this.curVAO = mesh.vao;
  }
  gl.drawElements(gl.TRIANGLES, mesh.count, mesh.type, 0);
};
Renderer.prototype.renderShadowMap = function (props, cars, ball) {
  var gfx = CFG.gfx || {};
  if (gfx.shadowMapping === false) return;
  var gl = this.gl;
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.shadowFBO);
  gl.viewport(0, 0, this.shadowSize, this.shadowSize);
  gl.depthMask(true);
  gl.clear(gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);

  gl.useProgram(this.progShadow);
  this.curProg = this.progShadow;
  gl.uniformMatrix4fv(this.uShadow.uLightVP, false, this.lightVP);
  this.curVAO = null;

  if (cars && cars.length) {
    var CAR_SCALE = (CFG.vehicle && CFG.vehicle.carScale !== undefined ? CFG.vehicle.carScale : 2.75);
    var V = CFG.vehicle || { wheel: { radius: 0.38, rest: 0.5, attachY: -0.1 } };
    var groundRestHeight = V.wheel.radius + V.wheel.rest - V.wheel.attachY;
    var upOffset = (CAR_SCALE - 1.0) * groundRestHeight;

    var BOT_MODELS = ['OCTANE', 'VORTEX', 'STRIKER', 'TITAN', 'RAPTOR', 'PHANTOM', 'MONSTER', 'KART', 'DRAGSTER', 'HYPER', 'COACH', 'SUV', 'HOTROD', 'LIMO'];
    for (var i = 0; i < cars.length; i++) {
      var car = cars[i];
      if (!car || !car.body) continue;
      var B = car.body;
      var carDrawPos = _vScratch2.set(B.pos.x + B.up.x * upOffset, B.pos.y + B.up.y * upOffset, B.pos.z + B.up.z * upOffset);
      _vScale.set(CAR_SCALE, CAR_SCALE, CAR_SCALE);

      var modelId = car.isPlayer
        ? ((CFG.customization && CFG.customization.model) || 'OCTANE')
        : (BOT_MODELS[(car.carIndex !== undefined ? car.carIndex : car.id || 0) % BOT_MODELS.length] || 'OCTANE');

      var kitM = (props.carKit && props.carKit.models && props.carKit.models[modelId]) || null;
      var shadowBody = (kitM && kitM.body) || props.body;
      var shadowAccent = (kitM && kitM.accent) || props.accent;

      if (shadowBody) {
        this.drawShadowMesh(shadowBody, carDrawPos, B.quat, _vScale);
      }
      if (shadowAccent) {
        this.drawShadowMesh(shadowAccent, carDrawPos, B.quat, _vScale);
      }
    }
  }

  if (ball) {
    var bRad = ball.radius;
    _vScale.set(bRad, bRad, bRad);
    this.drawShadowMesh(props.ball, ball.body.pos, ball.body.quat, _vScale);
  }

  // Restore main framebuffer
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, this.canvas.width, this.canvas.height);
};
Renderer.prototype.initParticles = function (max) {
  var gl = this.gl;
  this.partMax = max;
  this.partData = new Float32Array(max * 9);
  this.partCount = 0;
  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  var quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);
  this.partBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.partBuf);
  gl.bufferData(gl.ARRAY_BUFFER, this.partData.byteLength, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 36, 0); gl.vertexAttribDivisor(1, 1);
  gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 36, 12); gl.vertexAttribDivisor(2, 1);
  gl.enableVertexAttribArray(3); gl.vertexAttribPointer(3, 2, gl.FLOAT, false, 36, 28); gl.vertexAttribDivisor(3, 1);
  gl.bindVertexArray(null);
  this.partVAO = vao;
};
Renderer.prototype.drawParticles = function (list, count, tex) {
  if (!count) return;
  var gl = this.gl, n = Math.min(count, this.partMax), d = this.partData, k = 0;
  for (var i = 0; i < n; i++) {
    var p = list[i];
    d[k] = p.pos.x; d[k + 1] = p.pos.y; d[k + 2] = p.pos.z;
    d[k + 3] = p.col[0]; d[k + 4] = p.col[1]; d[k + 5] = p.col[2]; d[k + 6] = p.alpha;
    d[k + 7] = p.size; d[k + 8] = p.size * (p.stretch || 1);
    k += 9;
  }
  gl.useProgram(this.progPart);
  this.curProg = this.progPart;
  this.curTex = null;
  this.curVAO = null;
  gl.uniformMatrix4fv(this.uPart.uVP, false, this.vp);
  gl.uniform3f(this.uPart.uRight, this.camRight.x, this.camRight.y, this.camRight.z);
  gl.uniform3f(this.uPart.uUp, this.camUp.x, this.camUp.y, this.camUp.z);
  gl.uniform1i(this.uPart.uTex, 0);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.depthMask(false);
  this.blendMode = "add";
  gl.bindVertexArray(this.partVAO);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.partBuf);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, d, 0, n * 9);
  gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, n);
  gl.bindVertexArray(null);
  this.drawCalls++;
};
Renderer.prototype.initLines = function (maxVerts) {
  var gl = this.gl;
  this.lineMax = maxVerts;
  this.lineData = new Float32Array(maxVerts * 6);
  this.lineCount = 0;
  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  this.lineBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuf);
  gl.bufferData(gl.ARRAY_BUFFER, this.lineData.byteLength, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
  gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
  gl.bindVertexArray(null);
  this.lineVAO = vao;
};
Renderer.prototype.line = function (a, b, col) {
  if (this.lineCount + 2 > this.lineMax) return;
  var d = this.lineData, k = this.lineCount * 6;
  d[k] = a.x; d[k + 1] = a.y; d[k + 2] = a.z; d[k + 3] = col[0]; d[k + 4] = col[1]; d[k + 5] = col[2];
  d[k + 6] = b.x; d[k + 7] = b.y; d[k + 8] = b.z; d[k + 9] = col[0]; d[k + 10] = col[1]; d[k + 11] = col[2];
  this.lineCount += 2;
};
Renderer.prototype.flushLines = function () {
  if (!this.lineCount) return;
  var gl = this.gl;
  gl.useProgram(this.progLine);
  this.curProg = this.progLine;
  this.curTex = null;
  this.curVAO = null;
  gl.uniformMatrix4fv(this.uLine.uVP, false, this.vp);
  gl.disable(gl.BLEND); gl.depthMask(true); this.blendMode = "none";
  gl.bindVertexArray(this.lineVAO);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuf);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.lineData, 0, this.lineCount * 6);
  gl.drawArrays(gl.LINES, 0, this.lineCount);
  gl.bindVertexArray(null);
  this.lineCount = 0;
  this.drawCalls++;
};

export function buildProps(R) {
  var V = CFG.vehicle;

  // ==========================================
  // 1. OCTANE PAINTED BODYWORK (Team Color)
  // ==========================================
  var b = new Builder();

  // A. Lower Chassis Tub & Main Floor
  b.boxRot(0.30, 0.035, 0.52, new V3(0, -0.015, 0.02), 0, 0, 0);

  // B. Main Mid-Section & Cockpit Base
  b.boxRot(0.28, 0.05, 0.30, new V3(0, 0.055, 0.03), 0, 0, 0);
  // Side pods / door panel flares
  b.boxRot(0.045, 0.05, 0.26, new V3(-0.30, 0.065, 0.02), 0, 0, -4);
  b.boxRot(0.045, 0.05, 0.26, new V3(0.30, 0.065, 0.02), 0, 0, 4);

  // C. Sloping Front Hood (Octane Buggy Nose)
  // Main hood slope
  b.boxRot(0.23, 0.030, 0.20, new V3(0, 0.075, 0.35), -14, 0, 0);
  // Front nose bridge & lower cowl
  b.boxRot(0.21, 0.028, 0.07, new V3(0, 0.03, 0.52), -6, 0, 0);
  // Octane Center Hood Power Bulge / Scoop
  b.boxRot(0.085, 0.018, 0.16, new V3(0, 0.10, 0.36), -14, 0, 0);
  // Left & right hood aero ribs
  b.boxRot(0.018, 0.012, 0.13, new V3(-0.15, 0.09, 0.36), -14, 0, 0);
  b.boxRot(0.018, 0.012, 0.13, new V3(0.15, 0.09, 0.36), -14, 0, 0);

  // D. Front Mudguards / Fender Arches (Octane signature trophy-truck open arches)
  b.boxRot(0.05, 0.032, 0.14, new V3(-0.34, 0.07, 0.40), -8, 6, -6);
  b.boxRot(0.05, 0.032, 0.14, new V3(0.34, 0.07, 0.40), -8, -6, 6);

  // E. Muscular Rear Fender Flares
  b.boxRot(0.06, 0.06, 0.18, new V3(-0.34, 0.085, -0.38), 6, -4, -6);
  b.boxRot(0.06, 0.06, 0.18, new V3(0.34, 0.085, -0.38), 6, 4, 6);

  // F. Driver Cockpit Roof & Iconic Overhead Air Intake Scoop
  b.boxRot(0.19, 0.018, 0.15, new V3(0, 0.22, -0.06), 4, 0, 0);
  // Overhead air intake scoop
  b.boxRot(0.07, 0.022, 0.11, new V3(0, 0.25, -0.05), -14, 0, 0);
  b.boxRot(0.075, 0.020, 0.02, new V3(0, 0.255, 0.04), 0, 0, 0);

  // G. Rear Engine Deck Cowling
  b.boxRot(0.23, 0.032, 0.14, new V3(0, 0.11, -0.35), 8, 0, 0);

  // H. Iconic High-Downforce Rear Wing / Spoiler
  // Main horizontal aerofoil blade
  b.boxRot(0.36, 0.016, 0.085, new V3(0, 0.265, -0.48), -10, 0, 0);
  // Left & Right vertical aerodynamic endplates
  b.boxRot(0.012, 0.055, 0.10, new V3(-0.36, 0.265, -0.48), 0, 0, 0);
  b.boxRot(0.012, 0.055, 0.10, new V3(0.36, 0.265, -0.48), 0, 0, 0);

  var bodyMesh = R.mesh(b);


  // ==========================================
  // 2. DARK TITANIUM CHASSIS, TUBULAR CAGE & ENGINE
  // ==========================================
  var a = new Builder();

  // A. Octane Outer Tubular Steel Roll Cage
  // Left A-Pillar
  a.tube(new V3(-0.24, 0.08, 0.22), new V3(-0.20, 0.225, 0.02), 0.016);
  // Right A-Pillar
  a.tube(new V3(0.24, 0.08, 0.22), new V3(0.20, 0.225, 0.02), 0.016);
  // Roof side rails
  a.tube(new V3(-0.20, 0.225, 0.02), new V3(-0.20, 0.225, -0.16), 0.016);
  a.tube(new V3(0.20, 0.225, 0.02), new V3(0.20, 0.225, -0.16), 0.016);
  // Roof crossbars (front & rear)
  a.tube(new V3(-0.20, 0.225, 0.02), new V3(0.20, 0.225, 0.02), 0.015);
  a.tube(new V3(-0.20, 0.225, -0.16), new V3(0.20, 0.225, -0.16), 0.015);
  // C-Pillar rear down-tubes (connecting to rear deck)
  a.tube(new V3(-0.20, 0.225, -0.16), new V3(-0.24, 0.09, -0.44), 0.016);
  a.tube(new V3(0.20, 0.225, -0.16), new V3(0.24, 0.09, -0.44), 0.016);

  // Side Rocker / Nerf Protection Bars
  a.tube(new V3(-0.36, 0.02, 0.26), new V3(-0.36, 0.02, -0.24), 0.017);
  a.tube(new V3(0.36, 0.02, 0.26), new V3(0.36, 0.02, -0.24), 0.017);
  // Mounts to chassis
  a.tube(new V3(-0.36, 0.02, 0.26), new V3(-0.28, 0.02, 0.30), 0.013);
  a.tube(new V3(-0.36, 0.02, -0.24), new V3(-0.28, 0.02, -0.28), 0.013);
  a.tube(new V3(0.36, 0.02, 0.26), new V3(0.28, 0.02, 0.30), 0.013);
  a.tube(new V3(0.36, 0.02, -0.24), new V3(0.28, 0.02, -0.28), 0.013);

  // B. Aggressive Front Bumper, Splitter & Grill
  a.boxRot(0.31, 0.030, 0.035, new V3(0, -0.015, 0.58), 0, 0, 0);
  a.boxRot(0.34, 0.012, 0.06, new V3(0, -0.048, 0.59), 0, 0, 0);
  a.boxRot(0.18, 0.024, 0.02, new V3(0, 0.02, 0.57), 0, 0, 0);
  // Front tow brackets
  a.boxRot(0.012, 0.02, 0.025, new V3(-0.16, -0.035, 0.605), 0, 0, 0);
  a.boxRot(0.012, 0.02, 0.025, new V3(0.16, -0.035, 0.605), 0, 0, 0);

  // C. Rear Aerodynamic Diffuser & Lower Bumper
  a.boxRot(0.30, 0.028, 0.04, new V3(0, -0.01, -0.56), 0, 0, 0);
  a.boxRot(0.33, 0.012, 0.07, new V3(0, -0.045, -0.57), -8, 0, 0);
  // Diffuser vertical strakes
  [-0.20, -0.07, 0.07, 0.20].forEach(function (x) {
    a.boxRot(0.008, 0.025, 0.06, new V3(x, -0.035, -0.57), -8, 0, 0);
  });

  // D. Spoiler Pylons (Twin Aerodynamic Struts)
  a.boxRot(0.016, 0.09, 0.024, new V3(-0.15, 0.19, -0.45), 24, 0, 0);
  a.boxRot(0.016, 0.09, 0.024, new V3(0.15, 0.19, -0.45), 24, 0, 0);

  // E. Exposed Supercharged V8 Engine & Machinery
  a.boxRot(0.15, 0.055, 0.12, new V3(0, 0.08, -0.30), 0, 0, 0);
  a.boxRot(0.10, 0.032, 0.09, new V3(0, 0.135, -0.29), 0, 0, 0);
  // Supercharger pulley
  a.cylinder(0.022, 0.022, 0.04, 8, new V3(0, 0.14, -0.23), null, true, true);

  // F. Dual Massive Rocket/Nitro Exhaust Thruster Bells
  a.cylinder(0.052, 0.042, 0.12, 12, new V3(-0.11, 0.075, -0.58), null, true, true);
  a.cylinder(0.052, 0.042, 0.12, 12, new V3(0.11, 0.075, -0.58), null, true, true);

  var accentMesh = R.mesh(a);


  // ==========================================
  // 3. TINTED RACING CANOPY GLASS
  // ==========================================
  var g = new Builder();
  // Raked Windshield
  g.boxRot(0.185, 0.014, 0.15, new V3(0, 0.155, 0.10), -40, 0, 0);
  // Side Windows
  g.boxRot(0.010, 0.042, 0.14, new V3(-0.19, 0.16, -0.06), 0, 0, -4);
  g.boxRot(0.010, 0.042, 0.14, new V3(0.19, 0.16, -0.06), 0, 0, 4);
  // Rear Window
  g.boxRot(0.175, 0.014, 0.12, new V3(0, 0.16, -0.19), 36, 0, 0);
  var glassMesh = R.mesh(g);


  // ==========================================
  // 4. GLOWING HEADLIGHTS & TAILLIGHTS
  // ==========================================
  var l = new Builder();
  // Front LED Headlights
  l.boxRot(0.05, 0.018, 0.018, new V3(-0.18, 0.065, 0.54), -14, -8, 0);
  l.boxRot(0.05, 0.018, 0.018, new V3(0.18, 0.065, 0.54), -14, 8, 0);
  // Rear Taillights
  l.boxRot(0.045, 0.016, 0.014, new V3(-0.21, 0.10, -0.54), 8, 0, 0);
  l.boxRot(0.045, 0.016, 0.014, new V3(0.21, 0.10, -0.54), 8, 0, 0);
  // Rear center high neon brake light bar
  l.boxRot(0.13, 0.010, 0.012, new V3(0, 0.135, -0.48), 0, 0, 0);
  var lightsMesh = R.mesh(l);


  // ==========================================
  // 5. ROCKET BOOST THRUSTER INNER CORES
  // ==========================================
  var t = new Builder();
  t.cylinder(0.036, 0.010, 0.06, 10, new V3(-0.11, 0.075, -0.63), null, true, true);
  t.cylinder(0.036, 0.010, 0.06, 10, new V3(0.11, 0.075, -0.63), null, true, true);
  var thrusterMesh = R.mesh(t);


  // ==========================================
  // 6. WHEELS & 5-SPOKE ALLOY RIMS
  // ==========================================
  var w = new Builder();
  w.wheelCyl(1.0, 0.64, 16);
  w.wheelCyl(0.92, 0.66, 16);
  var wheelMesh = R.mesh(w);

  var hub = new Builder();
  hub.wheelCyl(0.70, 0.68, 14);
  hub.wheelCyl(0.24, 0.72, 10);
  for (var k = 0; k < 5; k++) {
    var ang = k / 5 * TAU;
    var qSpoke = new Quat().fromAxisAngle(1, 0, 0, ang);
    hub.box(0.33, 0.045, 0.22, new V3(0, Math.cos(ang) * 0.40, Math.sin(ang) * 0.40), qSpoke, 1);
  }
  var hubMesh = R.mesh(hub);

  // ==========================================
  // BALL & ARENA PROPS
  // ==========================================
  var ballB = new Builder();
  ballB.sphere(1, 64, 36);
  var ballMesh = R.mesh(ballB);

  var s = new Builder();
  var i0 = s.vert(-1, 0, -1, 0, 1, 0, 0, 0);
  var i1 = s.vert(1, 0, -1, 0, 1, 0, 1, 0);
  var i2 = s.vert(1, 0, 1, 0, 1, 0, 1, 1);
  var i3 = s.vert(-1, 0, 1, 0, 1, 0, 0, 1);
  s.quadN(i0, i1, i2, i3);
  var shadowMesh = R.mesh(s);

  // ==========================================
  // SLEEK CYBER-GRID BOOST PADS (Ultra low-profile rounded 3D cushion capsule style)
  // ==========================================
  // 1. Small Boost Pad (12% Field Pad): Sleek, flat beveled cushion-capsule podium sitting flush on turf
  var psBase = new Builder();
  var qCylVert = new Quat().fromAxisAngle(1, 0, 0, PI / 2);
  psBase.cylinder(0.50, 0.44, 0.03, 16, new V3(0, 0.015, 0), qCylVert, true, true); // Extremely sleek base plate
  psBase.cylinder(0.40, 0.30, 0.04, 16, new V3(0, 0.040, 0), qCylVert, true, true); // Smooth low-profile cushion top
  var padSmallBase = R.mesh(psBase);

  // Floating Small Boost Micro Lightning Bolt (Shazam-style)
  var psCore = new Builder();
  psCore.lightningBolt(0.42, 0.12);
  var padSmallCore = R.mesh(psCore);

  var psOutline = new Builder();
  psOutline.lightningBoltOutline(0.42, 0.024); // Smooth round 3D boundary tube outline for small lightning bolt
  var padSmallCoreOutline = R.mesh(psOutline);

  // 2. Big Boost Pad (100% Full Pill Station): High-fidelity flat beveled cushion-podium sitting flush on turf
  var pbBase = new Builder();
  pbBase.cylinder(1.50, 1.35, 0.04, 32, new V3(0, 0.02, 0), qCylVert, true, true);  // Flat, sleek lower bezel
  pbBase.cylinder(1.20, 0.90, 0.06, 32, new V3(0, 0.06, 0), qCylVert, true, true);  // Flatter, elegant cushion dome
  var padBigBase = R.mesh(pbBase);

  // Big Boost Floating Lightning Bolt (Shazam-style - sleek and compact)
  var pbOrb = new Builder();
  pbOrb.lightningBolt(0.85, 0.22);
  var padBigOrb = R.mesh(pbOrb);

  var pbOrbOutline = new Builder();
  pbOrbOutline.lightningBoltOutline(0.85, 0.048); // Smooth round 3D boundary tube outline for big lightning bolt
  var padBigOrbOutline = R.mesh(pbOrbOutline);

  // Big Boost Orbital Gimbal Ring (scaled to match the smaller footprint)
  var pbRing = new Builder();
  var rSegs = 20;
  for (var rs = 0; rs < rSegs; rs++) {
    var ra0 = (rs / rSegs) * TAU, ra1 = ((rs + 1) / rSegs) * TAU;
    var rMidX = (Math.cos(ra0) + Math.cos(ra1)) * 0.5 * 0.58;
    var rMidZ = (Math.sin(ra0) + Math.sin(ra1)) * 0.5 * 0.58;
    var segLen = 0.58 * (TAU / rSegs) * 1.05;
    pbRing.box(0.032, 0.032, segLen, new V3(rMidX, 0, rMidZ), new Quat().fromAxisAngle(0, 1, 0, ra0 + PI / rSegs), 1.0);
  }
  var padBigRing = R.mesh(pbRing);

  var kb = new Builder();
  kb.polyDisc(0.9, 24, 0.008, 1, 1);
  var ring = R.mesh(kb);

  // ==========================================
  // 3. VOLUMETRIC 3D LASER BEAM MESHES
  // ==========================================
  // Unit Z-aligned laser core cylinder (from z=0 to z=1)
  var bLaserCore = new Builder();
  bLaserCore.cylinder(1.0, 1.0, 1.0, 8, new V3(0, 0, 0.5), null, true, true);
  var laserCore = R.mesh(bLaserCore);

  // Unit Z-aligned laser blooming halo envelope cylinder (from z=0 to z=1)
  var bLaserHalo = new Builder();
  bLaserHalo.cylinder(1.0, 1.0, 1.0, 10, new V3(0, 0, 0.5), null, false, false);
  var laserHalo = R.mesh(bLaserHalo);

  // Optical lens flare and laser impact glow sphere
  var bLaserFlare = new Builder();
  bLaserFlare.sphere(1.0, 10, 8, new V3(0, 0, 0));
  var laserFlare = R.mesh(bLaserFlare);

  var carKit = null;
  try {
    carKit = buildCarKit(R);
  } catch (e) {
    console.error("buildCarKit error:", e);
  }

  return {
    carKit: carKit,
    body: (carKit && carKit.models && carKit.models.OCTANE && carKit.models.OCTANE.body) || bodyMesh,
    accent: (carKit && carKit.models && carKit.models.OCTANE && carKit.models.OCTANE.accent) || accentMesh,
    glass: (carKit && carKit.models && carKit.models.OCTANE && carKit.models.OCTANE.glass) || glassMesh,
    lights: (carKit && carKit.models && carKit.models.OCTANE && carKit.models.OCTANE.lights) || lightsMesh,
    thruster: (carKit && carKit.models && carKit.models.OCTANE && carKit.models.OCTANE.thruster) || thrusterMesh,
    trim: (carKit && carKit.models && carKit.models.OCTANE && carKit.models.OCTANE.trim) || null,
    wheel: (carKit && carKit.wheels && carKit.wheels.SPORT && carKit.wheels.SPORT.wheel) || wheelMesh,
    hub: (carKit && carKit.wheels && carKit.wheels.SPORT && carKit.wheels.SPORT.hub) || hubMesh,
    ball: ballMesh, shadow: shadowMesh,
    padSmall: padSmallBase, padSmallBase: padSmallBase, padSmallCore: padSmallCore, padSmallCoreOutline: padSmallCoreOutline,
    padBig: padBigBase, padBigBase: padBigBase, padBigOrb: padBigOrb, padBigOrbOutline: padBigOrbOutline, padBigRing: padBigRing,
    laserCore: laserCore, laserHalo: laserHalo, laserFlare: laserFlare,
    ring: ring
  };
}

Renderer.prototype.initTextures = function (arena) {
  var activeTheme = (CFG.gfx && CFG.gfx.stadiumTheme) || "NEON_CHAMPIONSHIP";
  var activeBallType = (CFG.gfx && CFG.gfx.ballType) || "soccer";
  var currentOffset = typeof window.__basketballOffset === "number" ? window.__basketballOffset : 80;
  var currentArcGap = typeof window.__basketballArcGap === "number" ? window.__basketballArcGap : -16;
  var currentPoleGap = typeof window.__basketballPoleGap === "number" ? window.__basketballPoleGap : 106;
  var currentYMargin = typeof window.__basketballYMargin === "number" ? window.__basketballYMargin : 0;
  var currentCurvePower = typeof window.__basketballCurvePower === "number" ? window.__basketballCurvePower : 2.5;
  var currentMeridianShift = typeof window.__basketballMeridianShift === "number" ? window.__basketballMeridianShift : -70;
  var currentShowMeridian = typeof window.__basketballShowMeridian !== "undefined" ? window.__basketballShowMeridian : true;
  var currentShowEquator = typeof window.__basketballShowEquator !== "undefined" ? window.__basketballShowEquator : true;
  var currentDrawCaps = typeof window.__basketballDrawCaps !== "undefined" ? window.__basketballDrawCaps : false;
  var currentBasketballKey = [currentOffset, currentArcGap, currentPoleGap, currentYMargin, currentCurvePower, currentMeridianShift, currentShowMeridian, currentShowEquator, currentDrawCaps].join("_");

  var currentCarBumpStyle = (CFG.gfx && CFG.gfx.carBumpStyle) || "SPORTS_PANELS";

  if (!this.initializedTextures) {
    this.currentStadiumTheme = activeTheme;
    this.currentBallType = activeBallType;
    this.currentBasketballKey = currentBasketballKey;
    this.currentCarBumpStyle = currentCarBumpStyle;
    this.texField = this.texture(texField(arena, activeTheme), false, true);
    this.texPanel = this.texture(texPanel(), true, true);
    this.texNet = this.texture(texNet(), true, true);
    this.texNetWall = this.texture(texNetWall(), true, true);
    this.texSky = this.texture(texSky(activeTheme), false, true);
    this.texBoostGlow = this.texture(texBoostGlow(), false, true);
    this.texBall = this.texture(texBall(activeBallType), false, true);
    this.texCarBody = this.texture(texCarBodyDetail(currentCarBumpStyle), false, true);
    this.texCarTrim = this.texture(texCarTrimDetail(), false, true);
    this.texCarAccent = this.texture(texCarAccentDetail(), true, true);
    this.texCarWheel = this.texture(texCarWheelDetail(), false, true);
    this.texBlob = this.texture(texBlob(), false, true);
    this.texSpark = this.texture(texSpark(), false, true);
    this.texCrowd = this.texture(texCrowd(activeTheme), true, true);
    this.texAdBoard = this.texture(texAdBoard(), true, true);
    this.texRibbon = this.texture(texRibbon(), true, true);
    this.texScreen = this.texture(texScreen("5:00", 0, 0, "NEON VELOCITY CHAMPIONSHIP"), false, true);
    this.initializedTextures = true;
  } else {
    var gl = this.gl;
    if (this.currentStadiumTheme !== activeTheme) {
      this.currentStadiumTheme = activeTheme;
      if (this.texField) gl.deleteTexture(this.texField);
      this.texField = this.texture(texField(arena, activeTheme), false, true);
      if (this.texSky) gl.deleteTexture(this.texSky);
      this.texSky = this.texture(texSky(activeTheme), false, true);
      if (this.texCrowd) gl.deleteTexture(this.texCrowd);
      this.texCrowd = this.texture(texCrowd(activeTheme), true, true);
    }
    if (this.currentBallType !== activeBallType || (activeBallType === "basketball" && this.currentBasketballKey !== currentBasketballKey)) {
      this.currentBallType = activeBallType;
      this.currentBasketballKey = currentBasketballKey;
      if (this.texBall) gl.deleteTexture(this.texBall);
      this.texBall = this.texture(texBall(activeBallType), false, true);
    }
    if (this.currentCarBumpStyle !== currentCarBumpStyle) {
      this.currentCarBumpStyle = currentCarBumpStyle;
      if (this.texCarBody) gl.deleteTexture(this.texCarBody);
      this.texCarBody = this.texture(texCarBodyDetail(currentCarBumpStyle), false, true);
    }
  }
};

Renderer.prototype.updateScoreboard = function (clockStr, score0, score1, title) {
  if (!this.gl || !this.texScreen) return;
  if (this.lastClockStr === clockStr && this.lastScore0 === score0 && this.lastScore1 === score1 && this.lastTitle === title) {
    return;
  }
  this.lastClockStr = clockStr;
  this.lastScore0 = score0;
  this.lastScore1 = score1;
  this.lastTitle = title;
  var gl = this.gl;
  var canvas = texScreen(clockStr, score0, score1, title);
  gl.bindTexture(gl.TEXTURE_2D, this.texScreen);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  this.curTex = this.texScreen;
};

var _qIdentity = new Quat();
var _vOne = new V3(1, 1, 1);
var _vPos = new V3();
var _vScale = new V3();
var _qTemp = new Quat();
var _qScratch1 = new Quat();
var _qScratch2 = new Quat();
var _qScratch3 = new Quat();
var _vScratch1 = new V3();
var _vScratch2 = new V3();
var _vScratch3 = new V3();
var _vScratch4 = new V3();
var _vCarDrawPos = new V3();
var _wheelScale = new V3();
var _metallicCol = [0, 0, 0];
var _trimEmissive = [0, 0, 0];
var _colScratch = [0, 0, 0];

Renderer.prototype.drawArena = function (meshes, arena, props, cars, ball) {
  this.initTextures(arena);
  if (props) this.props = props;

  var activeThemeKey = (CFG.gfx && CFG.gfx.stadiumTheme) || "NEON_CHAMPIONSHIP";
  var theme = STADIUM_THEMES[activeThemeKey] || STADIUM_THEMES.NEON_CHAMPIONSHIP;
  if (theme && theme.fogColor) {
    this.fogColor = theme.fogColor;
  }

  // 1. Panoramic Sky Dome (Vibrant Daytime Sky, Sun & Fluffy Clouds with smooth atmospheric drift)
  if (meshes.skyDome) {
    this.draw(meshes.skyDome, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      tex: this.texSky,
      uvScroll: [this.time * 0.002, 0.0],
      color: [1.0, 1.0, 1.0],
      emissive: [1.0, 1.0, 1.0], // Full daytime emissive radiance
      spec: 0.0,
      rim: 0.0,
      cull: false
    });
  }

  // 2. Spectator Grandstands (Spaciously elevated outside net walls with lively cheer animations)
  if (meshes.grandstands || meshes.crowd) {
    var gMesh = meshes.grandstands || meshes.crowd;
    this.draw(gMesh, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      tex: this.texCrowd,
      crowd: (CFG.gfx && CFG.gfx.crowdAnimation !== false) ? 1.0 : 0.0,
      emissive: [0.18, 0.20, 0.25],
      spec: 0.25,
      rim: 0.15
    });
  }

  // 2b. VIP Luxury Glass Skyboxes (Warm golden illuminated interior suites)
  if (meshes.vipSuites) {
    this.draw(meshes.vipSuites, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      color: [1.0, 0.92, 0.75],
      emissive: [0.45, 0.38, 0.22],
      metallic: 0.85,
      spec: 0.90,
      rim: 0.35
    });
  }

  // 4. Floodlight Truss Towers (6 towers: 4 corners + 2 center long sides)
  if (meshes.trusses) {
    this.draw(meshes.trusses, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      color: [0.45, 0.50, 0.58],
      emissive: [0.12, 0.14, 0.18],
      spec: 0.65,
      rim: 0.25
    });
  }

  // 4b. Monumental Steel Super-Arches & Suspension Cable Network
  if (meshes.roofSuperArch) {
    this.draw(meshes.roofSuperArch, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      color: [0.72, 0.78, 0.88],
      emissive: [0.15, 0.18, 0.24],
      metallic: 0.92,
      spec: 0.95,
      clearcoat: 0.8,
      rim: 0.55
    });
  }

  // 4c. Translucent ETFE Glass Canopy Membrane Shell
  if (meshes.roofCanopy) {
    this.draw(meshes.roofCanopy, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      color: [0.88, 0.92, 0.98],
      emissive: [0.15, 0.18, 0.25],
      opacity: 0.85,
      blend: "alpha",
      spec: 0.85,
      rim: 0.60,
      cull: false
    });
  }

  // 4d. Under-Canopy Pitch Spotlights & Light Strips
  var rPulse = 0.85 + Math.sin(this.time * 2.8) * 0.15;
  if (meshes.roofSpotlights) {
    this.draw(meshes.roofSpotlights, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      color: [0.95, 0.98, 1.0],
      emissive: [1.2 * rPulse, 1.3 * rPulse, 1.5 * rPulse],
      spec: 0.95
    });
  }

  // 4e. 3D Stadium Roof Space-Truss Architecture & Majestic Canopy Arches
  if (meshes.roofTruss) {
    this.draw(meshes.roofTruss, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      color: [0.42, 0.48, 0.56],
      emissive: [0.10, 0.12, 0.16],
      spec: 0.75,
      metallic: 0.80,
      rim: 0.35
    });
  }
  if (meshes.roofNeon) {
    this.draw(meshes.roofNeon, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      color: [0.90, 0.95, 1.0],
      emissive: [0.35 * rPulse, 0.65 * rPulse, 1.2 * rPulse],
      spec: 0.90,
      rim: 0.50
    });
  }

  // 5. Floor (Turf with subtle floodlight pools)
  var pitchBright = (CFG.gfx && CFG.gfx.pitchBrightness !== undefined) ? CFG.gfx.pitchBrightness : 1.0;
  var pitchSpec = (CFG.gfx && CFG.gfx.pitchRoughness !== undefined) ? (1.0 - CFG.gfx.pitchRoughness * 0.7) : 0.40;
  this.draw(meshes.floor, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
    tex: this.texField,
    color: [pitchBright, pitchBright, pitchBright],
    spec: pitchSpec,
    rim: 0.12
  });

  // 5b. Dynamic 3D Instanced Pitch Grass Blades (Full pitch coverage with wind flutter, soft cream tips & ball/car physics interaction)
  this.drawGrass(arena, cars, ball);

  // 6. Perimeter Ad Boards (LED Sponsor Panels with dynamic scrolling ticker)
  if (meshes.adBoards) {
    this.draw(meshes.adBoards, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      tex: this.texAdBoard,
      uvScroll: [this.time * 0.04, 0.0],
      emissive: [0.12, 0.15, 0.18],
      spec: 0.7,
      rim: 0.20
    });
  }

  // 7. Upper Tier LED Ribbons
  if (meshes.ribbons) {
    this.draw(meshes.ribbons, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      tex: this.texRibbon,
      uvScroll: [-this.time * 0.06, 0.0],
      emissive: [0.15, 0.18, 0.22],
      spec: 0.6
    });
  }

  // 8. Stadium Floodlight Headbanks (18 lamps each atop 6 towers - turns off when floodlight is 0)
  var flInt = (CFG.gfx && CFG.gfx.floodlightIntensity !== undefined) ? CFG.gfx.floodlightIntensity : 0.20;
  var flEmiss = flInt * 1.8;
  this.draw(meshes.lights, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
    color: flInt > 0.01 ? [0.95, 0.97, 1.0] : [0.2, 0.22, 0.25],
    emissive: [flEmiss * 0.9, flEmiss * 0.95, flEmiss],
    spec: 0.85
  });

  // 9. Big Scoreboard Screens behind goals
  if (meshes.screens) {
    this.draw(meshes.screens, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      tex: this.texScreen,
      emissive: [1.0, 1.0, 1.15],
      spec: 0.8
    });
  }

  // 9b. Suspended 4-Sided Center 3D Halo Jumbotron & Holographic Scoreboard
  if (meshes.jumbotron) {
    this.draw(meshes.jumbotron, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      color: [0.35, 0.40, 0.48],
      emissive: [0.15, 0.18, 0.24],
      metallic: 0.85,
      spec: 0.80,
      rim: 0.35
    });
  }
  if (meshes.jumbotronScreens) {
    this.draw(meshes.jumbotronScreens, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      tex: this.texScreen,
      emissive: [1.15, 1.15, 1.30],
      spec: 0.85
    });
  }

  // 9c. Arena Perimeter Glowing Neon Tubes
  if (meshes.neonPerimeter) {
    var pPulse = 0.85 + Math.sin(this.time * 3.5) * 0.18;
    this.draw(meshes.neonPerimeter, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      color: [0.8, 0.95, 1.0],
      emissive: [0.25 * pPulse, 0.65 * pPulse, 1.0 * pPulse],
      spec: 0.9
    });
  }

  // 9d. Pitch Corner Flags
  if (meshes.cornerFlags) {
    this.draw(meshes.cornerFlags, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      color: [0.95, 0.95, 0.98],
      emissive: [0.18, 0.18, 0.22],
      spec: 0.6,
      cull: false
    });
  }

  // 10. Goals
  for (var g = 0; g < meshes.goals.length; g++) {
    var goal = meshes.goals[g];
    var teamCol = TEAM_COLOR[goal.team];

    this.draw(goal.cavity, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      color: [0.10, 0.12, 0.15],
      spec: 0.2
    });

    this.draw(goal.net, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      tex: this.texNet,
      color: [0.92, 0.95, 1.0],
      alphaTest: true,
      cull: false,
      spec: 0.35
    });

    this.draw(goal.frame, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      color: [0.88, 0.91, 0.95],
      emissive: [0.12, 0.14, 0.18],
      metallic: 0.95,
      spec: 0.95,
      clearcoat: 0.85,
      rim: 0.45
    });

    // Glowing Neon Goal Trim & Crown Halo Arch
    if (goal.neon) {
      var nPulse = 0.9 + Math.sin(this.time * 5.0 + g * Math.PI) * 0.25;
      var nCol = (goal.team === 0)
        ? [0.05 * nPulse, 0.85 * nPulse, 1.35 * nPulse]
        : [1.35 * nPulse, 0.65 * nPulse, 0.05 * nPulse];
      this.draw(goal.neon, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
        color: [1.0, 1.0, 1.0],
        emissive: nCol,
        spec: 0.95,
        rim: 0.5
      });
    }
  }
};

// =========================================================================
// VOLUMETRIC 3D LASER BEAM RENDERER (CORE + GLOWING BLOOM HALO + FLARES)
// =========================================================================
Renderer.prototype.drawLaserBeam = function (p1, p2, colInfo, props, haloRadius, coreRadius) {
  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  var dz = p2.z - p1.z;
  var len = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (len < 0.05) return;

  var nx = dx / len;
  var ny = dy / len;
  var nz = dz / len;

  // Calculate quaternion rotation from unit vector (0, 0, 1) to (nx, ny, nz)
  var qRot = _qScratch1;
  var dot = nz;
  if (dot > 0.9999) {
    qRot.identity();
  } else if (dot < -0.9999) {
    qRot.fromAxisAngle(1, 0, 0, Math.PI);
  } else {
    var cx = -ny;
    var cy = nx;
    var cLen = Math.sqrt(cx * cx + cy * cy);
    if (cLen > 0.0001) {
      cx /= cLen;
      cy /= cLen;
      var angle = Math.acos(clamp(dot, -1, 1));
      qRot.fromAxisAngle(cx, cy, 0, angle);
    } else {
      qRot.identity();
    }
  }

  var lGfx = (CFG.gfx) || {};
  var bMult = (lGfx.laserBrightness !== undefined) ? lGfx.laserBrightness : 0.45;
  var tMult = (lGfx.laserThickness !== undefined) ? lGfx.laserThickness : 0.70;
  var hMult = (lGfx.laserHaloRadius !== undefined) ? lGfx.laserHaloRadius : 0.75;
  var oMult = (lGfx.laserOpacity !== undefined) ? lGfx.laserOpacity : 0.40;
  var sMult = (lGfx.laserSpotRadius !== undefined) ? lGfx.laserSpotRadius : 0.80;

  var hR = (haloRadius || 0.35) * hMult;
  var cR = (coreRadius || 0.09) * tMult;

  // 1. Outer Volumetric Glowing Halo Envelope (Additive blooming cylinder)
  if (props && props.laserHalo) {
    _vScale.set(hR, hR, len);
    this.draw(props.laserHalo, p1, qRot, _vScale, {
      color: colInfo.halo,
      emissive: [colInfo.haloEmiss[0] * bMult, colInfo.haloEmiss[1] * bMult, colInfo.haloEmiss[2] * bMult],
      opacity: 0.62 * oMult,
      blend: "add",
      cull: false,
      spec: 0.0
    });
  }

  // 2. High-Energy White-Hot Intense Searing Core (Center laser tube)
  if (props && props.laserCore) {
    _vScale.set(cR, cR, len);
    this.draw(props.laserCore, p1, qRot, _vScale, {
      color: [1.0, 1.0, 1.0],
      emissive: [colInfo.coreEmiss[0] * bMult, colInfo.coreEmiss[1] * bMult, colInfo.coreEmiss[2] * bMult],
      opacity: 0.95 * oMult,
      blend: "add",
      cull: false,
      spec: 0.0
    });
  }

  // 3. Projector Optical Lens Flare at Origin Tower
  if (props && props.laserFlare) {
    this.draw(props.laserFlare, p1, _qIdentity, _vScale.set(0.65 * sMult, 0.65 * sMult, 0.65 * sMult), {
      color: [1.0, 1.0, 1.0],
      emissive: [colInfo.flareEmiss[0] * bMult, colInfo.flareEmiss[1] * bMult, colInfo.flareEmiss[2] * bMult],
      opacity: 0.88 * oMult,
      blend: "add",
      cull: false,
      spec: 0.0
    });

    // 4. Ground/Canopy Focal Energy Impact Spot
    this.draw(props.laserFlare, p2, _qIdentity, _vScale.set(0.85 * sMult, 0.85 * sMult, 0.85 * sMult), {
      color: colInfo.halo,
      emissive: [colInfo.impactEmiss[0] * bMult, colInfo.impactEmiss[1] * bMult, colInfo.impactEmiss[2] * bMult],
      opacity: 0.72 * oMult,
      blend: "add",
      cull: false,
      spec: 0.0
    });
  }
};

Renderer.prototype.drawArenaNet = function (meshes, props, arena) {
  if (!meshes) return;
  var flInt = (CFG.gfx && CFG.gfx.floodlightIntensity !== undefined) ? CFG.gfx.floodlightIntensity : 0.20;
  var p = props || this.props;

  // Transparent Net Cage: Walls, Roof Ramps, and Ceiling
  // Drawn with alpha blending and backface culling after vehicles and ball so the car is completely visible on the wall!
  if (meshes.shell) {
    this.draw(meshes.shell, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      tex: this.texNetWall,
      color: [1.0, 1.0, 1.0],
      emissive: [0.06, 0.08, 0.12],
      opacity: 0.40,
      blend: "alpha",
      alphaTest: true,
      cull: true,
      spec: 0.35,
      rim: 0.20
    });
  }

  if (meshes.ceiling) {
    this.draw(meshes.ceiling, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      tex: this.texNetWall,
      color: [1.0, 1.0, 1.0],
      emissive: [0.06, 0.08, 0.12],
      opacity: 0.40,
      blend: "alpha",
      alphaTest: true,
      cull: true,
      spec: 0.30,
      rim: 0.18
    });
  }

  // Soft Volumetric Light Beams (Only visible when floodlights are active)
  if (meshes.beams && flInt > 0.02) {
    this.draw(meshes.beams, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      color: [0.70, 0.82, 0.95],
      emissive: [0.35 * flInt, 0.45 * flInt, 0.60 * flInt],
      opacity: 0.04 * flInt,
      blend: "add",
      cull: false,
      spec: 0.0
    });
  }

  // =========================================================================
  // DYNAMIC 3D VOLUMETRIC LASER SHOW & SKY SEARCHLIGHTS
  // =========================================================================
  if (flInt > 0.01) {
    var t = this.time;
    var laserPalettes = [
      // 1. Electric Cyan Laser (Hot white core -> radiant electric cyan bloom)
      {
        halo: [0.0, 0.85, 1.0],
        haloEmiss: [0.1, 1.8, 3.2],
        coreEmiss: [3.2, 4.0, 4.0],
        flareEmiss: [0.4, 2.8, 4.0],
        impactEmiss: [0.1, 2.0, 3.5]
      },
      // 2. Synthwave Cyber-Magenta / Laser Pink (Hot pink-white core -> deep magenta halo)
      {
        halo: [1.0, 0.08, 0.70],
        haloEmiss: [3.2, 0.2, 2.0],
        coreEmiss: [4.0, 2.5, 3.8],
        flareEmiss: [4.0, 0.5, 2.8],
        impactEmiss: [3.5, 0.2, 2.2]
      },
      // 3. Radioactive Laser-Lime / Emerald (Bright mint core -> lime aura)
      {
        halo: [0.1, 1.0, 0.35],
        haloEmiss: [0.2, 3.2, 1.0],
        coreEmiss: [2.5, 4.0, 2.8],
        flareEmiss: [0.5, 4.0, 1.8],
        impactEmiss: [0.2, 3.5, 1.2]
      },
      // 4. Blazing Solar Gold / Plasma Amber (Solar white-gold core -> deep gold halo)
      {
        halo: [1.0, 0.65, 0.0],
        haloEmiss: [3.5, 2.0, 0.1],
        coreEmiss: [4.0, 3.8, 2.0],
        flareEmiss: [4.0, 2.8, 0.3],
        impactEmiss: [3.8, 2.2, 0.1]
      },
      // 5. Cosmic Ultra-Violet / Deep Plasma (Lavender core -> ultraviolet aura)
      {
        halo: [0.70, 0.15, 1.0],
        haloEmiss: [2.5, 0.4, 3.8],
        coreEmiss: [3.6, 2.8, 4.0],
        flareEmiss: [3.0, 0.8, 4.0],
        impactEmiss: [2.8, 0.5, 4.0]
      },
      // 6. Electric Hyper-Turquoise / Neon Aqua (Turquoise core -> bright aqua halo)
      {
        halo: [0.0, 1.0, 0.85],
        haloEmiss: [0.1, 2.8, 2.4],
        coreEmiss: [2.4, 4.0, 3.8],
        flareEmiss: [0.3, 3.8, 3.2],
        impactEmiss: [0.1, 3.0, 2.5]
      }
    ];

    var hx = (arena && arena.hx) || (CFG.arena && CFG.arena.hx) || 61.5;
    var hz = (arena && arena.hz) || (CFG.arena && CFG.arena.hz) || 76.8;
    var arenaHeight = (arena && arena.height) || (CFG.arena && CFG.arena.height) || 30.75;

    var towerOrigins = [
      { x: -hx * 1.32, y: arenaHeight * 1.05, z: -hz * 1.25 },
      { x:  hx * 1.32, y: arenaHeight * 1.05, z: -hz * 1.25 },
      { x: -hx * 1.32, y: arenaHeight * 1.05, z:  hz * 1.25 },
      { x:  hx * 1.32, y: arenaHeight * 1.05, z:  hz * 1.25 },
      { x: -hx * 1.38, y: arenaHeight * 1.05, z:   0.0 },
      { x:  hx * 1.38, y: arenaHeight * 1.05, z:   0.0 }
    ];

    var hasVolumetric = p && p.laserCore && p.laserHalo;

    for (var li = 0; li < towerOrigins.length; li++) {
      var orig = towerOrigins[li];
      var colInfo = laserPalettes[li % laserPalettes.length];
      var speed = 0.85 + (li * 0.22);
      var phase = li * 1.05;

      // Irregular, chaotic movement targeting spectator grandstand seats around stadium perimeter
      var noise1 = Math.sin(t * (1.73 + li * 0.17) + phase * 2.4) * 0.6 + Math.cos(t * 3.41 + li * 0.5) * 0.4;
      var noise2 = Math.cos(t * (1.37 + li * 0.23) - phase * 1.8) * 0.6 + Math.sin(t * 2.89 + li * 0.8) * 0.4;
      var noiseJitter = (Math.sin(t * 11.3 + li * 7.1) > 0.6 ? 1 : -1) * (0.5 + Math.cos(t * 19.1 + li) * 0.5);

      var sweepSide = (li % 2 === 0) ? 1 : -1;
      var sweepX = sweepSide * (hx + 5.5 + noise1 * 18.0);
      var sweepZ = ((li < 2) ? -1 : (li < 4) ? 1 : (Math.sin(t * 0.85 + phase) > 0 ? 1 : -1)) * (hz * 0.68 + noise2 * 35.0 + noiseJitter * 5.0);
      var sweepY = 13.0 + Math.abs(noise1 + noise2) * 10.0;

      var pOrig = _vScratch1.set(orig.x, orig.y, orig.z);
      var pSweep = _vScratch2.set(sweepX, sweepY, sweepZ);

      // Pulsating beam thickness
      var pulse = 1.0 + Math.sin(t * 10.0 + li * 2.5) * 0.18;
      var haloR = 0.36 * pulse;
      var coreR = 0.095 * (1.0 + Math.sin(t * 14.0 + li * 1.5) * 0.10);

      if (hasVolumetric) {
        // Render 3D Volumetric Field Laser Beam
        this.drawLaserBeam(pOrig, pSweep, colInfo, p, haloR, coreR);
      } else if (this.lineCount !== undefined) {
        this.line(pOrig, pSweep, colInfo.halo);
      }

      // Sky zenith criss-cross beams (Spectacular canopy light vortex)
      var skyX = Math.cos(t * speed * 0.5 + phase) * (hx * 1.1);
      var skyZ = Math.sin(t * speed * 0.4 + phase) * (hz * 1.1);
      var skyY = arenaHeight * 1.6 + Math.sin(t * 0.8 + phase) * 8.0;
      var pSky = _vScratch2.set(skyX, skyY, skyZ);

      var colInfoSky = laserPalettes[(li + 3) % laserPalettes.length];
      var haloRSky = 0.42 * pulse;
      var coreRSky = 0.11;

      if (hasVolumetric) {
        // Render 3D Volumetric Sky Zenith Laser Beam
        this.drawLaserBeam(pOrig, pSky, colInfoSky, p, haloRSky, coreRSky);
      } else if (this.lineCount !== undefined) {
        this.line(pOrig, pSky, colInfoSky.halo);
      }
    }

    if (!hasVolumetric && this.lineCount !== undefined) {
      this.flushLines();
    }
  }
};

Renderer.prototype.drawBoostPads = function (props, pads) {
  var perfMode = (CFG.gfx && CFG.gfx.perfMode) || "BALANCED";
  var isUltraFast = perfMode === "ULTRA";
  var padElev = (CFG.gfx && CFG.gfx.boostPadHeightOffset !== undefined) ? CFG.gfx.boostPadHeightOffset : 0.35;
  var pHasLaser = props && props.laserCore && props.laserHalo;

  var bigLightningPalette = {
    halo: [1.0, 0.65, 0.08],     // Golden Sunburst halo
    haloEmiss: [4.0, 2.2, 0.05],  // Blazing amber glow
    coreEmiss: [6.0, 5.5, 4.0]    // Brilliant white-gold core
  };

  var smallLightningPalette = {
    halo: [0.15, 0.85, 1.0],      // Fresh, high-tech Electric Cyan
    haloEmiss: [0.8, 3.5, 7.0],
    coreEmiss: [5.0, 5.0, 5.0]
  };

  for (var i = 0; i < pads.length; i++) {
    var p = pads[i];
    var isBig = p.big;
    var active = p.active;

    if (isBig) {
      // 100% BIG BOOST POWER STATION
      // 1. Sleek, low-profile cushion base: sits flush on the turf using padElev ground offset
      var bigBaseMesh = props.padBigBase || props.padBig;
      var bBasePos = _vPos.set(p.pos.x, p.pos.y + padElev, p.pos.z); // Elevated correctly above turf

      if (active) {
        // Draw highly polished shiny platinum/chrome cushion base
        this.draw(bigBaseMesh, bBasePos, _qIdentity, _vOne, {
          color: [0.92, 0.94, 0.98],                                     // Ultra shiny platinum metal
          emissive: [0.35, 0.28, 0.05],                                  // Under-grid power lanes
          metallic: 1.0,
          clearcoat: 1.0,
          flakes: 1.0,
          bump: 1.5,                                                     // High-fidelity edge lines on cushion borders
          spec: 2.0
        });

        // Draw elegant, low floating height for the sleek compact lightning bolt
        var bobY = p.pos.y + 0.65 + padElev + Math.sin(p.anim * 2.5) * 0.05;
        _vScratch1.set(p.pos.x, bobY, p.pos.z);

        // 2. Dual-Layer Rounded 3D Lightning Bolt
        if (props.padBigOrb && props.padBigOrbOutline) {
          var swayAngle = Math.sin(p.anim * 0.7) * 0.45;
          _qTemp.fromAxisAngle(0, 1, 0, swayAngle);
          var tiltQ = new Quat().fromAxisAngle(1, 0, 0, Math.cos(p.anim * 0.5) * 0.12);
          _qTemp.mul(_qTemp, tiltQ);

          var glowIntensity = 1.8 + Math.sin(p.anim * 4.5) * 0.45;

          // Inner solid core: Fully colored radiant gold (gorgeous premium metallic paint finish)
          _vScale.set(0.72, 0.72, 0.72);
          this.draw(props.padBigOrb, _vScratch1, _qTemp, _vScale, {
            color: [1.0, 0.70, 0.02], // Highly attractive fully colored liquid gold
            emissive: [1.5 * glowIntensity, 0.8 * glowIntensity, 0.02 * glowIntensity],
            metallic: 1.0,
            clearcoat: 1.0,
            spec: 2.0,
            rim: 0.8
          });

          // Outer outline: Smooth 3D tubular boundary frame outlining the lightning bolt with perfectly rounded corners!
          this.draw(props.padBigOrbOutline, _vScratch1, _qTemp, _vScale, {
            color: [1.0, 0.85, 0.30], // Glowing neon gold boundary frame
            emissive: [3.0 * glowIntensity, 1.8 * glowIntensity, 0.05 * glowIntensity],
            metallic: 1.0,
            clearcoat: 1.0,
            spec: 2.0
          });

          // 2.5 Synchronized Halo Ring (3D Floating Ring framing the bolt and moving in unison)
          if (props.padBigRing) {
            var spinQ = new Quat().fromAxisAngle(0, 1, 0, p.anim * 1.8);
            var ringQ = new Quat();
            ringQ.mul(_qTemp, spinQ); // Sway/tilt and spin together!

            _vScale.set(1.3 * 0.72, 1.3 * 0.72, 1.3 * 0.72);
            this.draw(props.padBigRing, _vScratch1, ringQ, _vScale, {
              color: [1.0, 0.80, 0.15],
              emissive: [3.5 * glowIntensity, 1.8 * glowIntensity, 0.05 * glowIntensity],
              metallic: 1.0,
              clearcoat: 1.0,
              spec: 2.0
            });
          }
        }

        // 3. Inclined Orbital Gimbal Rings (Neon Teal & Sunburst Orange)
        if (props.padBigRing && !isUltraFast) {
          _qScratch1.fromAxisAngle(0.6, 1, 0.2, p.anim * 2.2);
          _vScale.set(0.72, 0.72, 0.72);
          this.draw(props.padBigRing, _vScratch1, _qScratch1, _vScale, {
            color: [0.0, 0.85, 1.0], // Electric Sky Blue
            emissive: [0.2, 2.5, 5.0],
            spec: 0.9
          });

          // 4. Counter-rotating Orbital Gimbal Ring 2
          _qScratch2.fromAxisAngle(-0.6, 1, -0.2, -p.anim * 1.6);
          _vScale.set(1.18 * 0.72, 1.18 * 0.72, 1.18 * 0.72);
          this.draw(props.padBigRing, _vScratch1, _qScratch2, _vScale, {
            color: [1.0, 0.45, 0.0], // Solar Fire Orange
            emissive: [3.0, 1.2, 0.0],
            spec: 0.9
          });
        }

        // 5. 3D High-Voltage Lightning Discharge Arcs
        if (pHasLaser && !isUltraFast) {
          for (var arc = 0; arc < 3; arc++) {
            var pAngle = (arc * (TAU / 3)) + p.anim * 1.5;
            var px = p.pos.x + Math.cos(pAngle) * 1.4;
            var pz = p.pos.z + Math.sin(pAngle) * 1.4;
            var py = p.pos.y + 0.15 + padElev; // Low flare ground positions

            var pStart = _vScratch2.set(px, py, pz);
            var jitX = (Math.random() - 0.5) * 0.15;
            var jitZ = (Math.random() - 0.5) * 0.15;
            var pEnd = _vPos.set(p.pos.x + jitX, bobY, p.pos.z + jitZ);

            this.drawLaserBeam(pStart, pEnd, bigLightningPalette, props, 0.15, 0.04);
          }
        }

        // 6. Ground Pulse Rune
        var rScale = 1.75 + Math.sin(p.anim * 3.0) * 0.08;
        _vScale.set(rScale, 1, rScale);
        this.draw(props.ring, _vPos.set(p.pos.x, p.pos.y + 0.04 + padElev, p.pos.z), _qIdentity, _vScale, {
          tex: this.texBoostGlow,
          color: [1.0, 0.78, 0.1],
          emissive: [1.8, 1.1, 0.1],
          blend: "add",
          opacity: 0.85 + Math.sin(p.anim * 3) * 0.15
        });
      } else {
        // Used / Inactive Big Pad: Premium dark-luxury carved carbon/leather cushion with breathing amber embers
        var pulse = 0.50 + Math.sin(p.anim * 1.8) * 0.40;
        this.draw(bigBaseMesh, bBasePos, _qIdentity, _vOne, {
          color: [0.11, 0.13, 0.15],                                     // Deep luxury carbon-leather texture shell
          emissive: [0.55 * pulse, 0.22 * pulse, 0.05 * pulse],          // Breathing amber power core ring
          metallic: 0.8,
          clearcoat: 1.0,
          bump: 1.5,                                                     // High-fidelity seam and stitch detail lines
          spec: 1.5
        });
      }
    } else {
      // SMALL BOOST FIELD PAD (12% Boost - Sleek, Compact Micro Pad)
      var smallBaseMesh = props.padSmallBase || props.padSmall;
      var sBasePos = _vPos.set(p.pos.x, p.pos.y + padElev, p.pos.z); // Elevated correctly above turf

      if (active) {
        // Active platinum alloy cushion base
        this.draw(smallBaseMesh, sBasePos, _qIdentity, _vOne, {
          color: [0.88, 0.92, 0.96],                                     // Premium polished chrome alloy
          emissive: [0.02, 0.45, 0.90],                                  // Under-grid power lanes
          metallic: 1.0,
          clearcoat: 1.0,
          bump: 1.2,                                                     // High-fidelity edge highlights
          spec: 1.8
        });

        var sBobY = p.pos.y + 0.35 + padElev + Math.sin(p.anim * 3.2) * 0.025;
        _vScratch1.set(p.pos.x, sBobY, p.pos.z);

        // 2. Dual-Layer Rounded Micro Lightning Bolt
        if (props.padSmallCore && props.padSmallCoreOutline) {
          var sSwayAngle = Math.sin(p.anim * 0.8) * 0.38;
          _qTemp.fromAxisAngle(0, 1, 0, sSwayAngle);
          var sTiltQ = new Quat().fromAxisAngle(1, 0, 0, Math.cos(p.anim * 0.6) * 0.10);
          _qTemp.mul(_qTemp, sTiltQ);

          var sGlow = 1.6 + Math.sin(p.anim * 4.8) * 0.35;
          var sColor = [0.0, 0.82, 1.0];

          // Inner solid core: Fully colored radiant cyber cyan-teal
          _vScale.set(0.80, 0.80, 0.80);
          this.draw(props.padSmallCore, _vScratch1, _qTemp, _vScale, {
            color: sColor,
            emissive: [0.1 * sGlow, 2.5 * sGlow, 5.0 * sGlow],
            metallic: 1.0,
            clearcoat: 1.0,
            spec: 1.8,
            rim: 0.8
          });

          // Outer outline: Smooth 3D tubular boundary frame outlining the lightning bolt with perfectly rounded corners!
          this.draw(props.padSmallCoreOutline, _vScratch1, _qTemp, _vScale, {
            color: [0.40, 0.90, 1.0], // Neon cyber-cyan boundary frame
            emissive: [0.2 * sGlow, 3.5 * sGlow, 7.5 * sGlow],
            metallic: 1.0,
            clearcoat: 1.0,
            spec: 2.0
          });

          // 2.5 Synchronized Halo Ring (3D Floating Ring framing the bolt and moving in unison)
          if (props.padBigRing) {
            var sSpinQ = new Quat().fromAxisAngle(0, 1, 0, -p.anim * 2.2);
            var sRingQ = new Quat();
            sRingQ.mul(_qTemp, sSpinQ); // Sway/tilt and spin together!

            _vScale.set(0.60, 0.60, 0.60); // Sized to fit around the micro bolt
            this.draw(props.padBigRing, _vScratch1, sRingQ, _vScale, {
              color: [0.20, 0.85, 1.0],
              emissive: [0.2 * sGlow, 3.5 * sGlow, 7.0 * sGlow],
              metallic: 1.0,
              clearcoat: 1.0,
              spec: 2.0
            });
          }
        }

        // 3. Mini Vertical Electric Spark Lightning Arcs
        if (pHasLaser && !isUltraFast) {
          for (var sArc = 0; sArc < 2; sArc++) {
            var sAngle = (sArc * PI) + p.anim * 3.0;
            var spx = p.pos.x + Math.cos(sAngle) * 0.20;
            var spz = p.pos.z + Math.sin(sAngle) * 0.20;
            var spy = p.pos.y + 0.05 + padElev;

            var pMStart = _vScratch2.set(spx, spy, spz);
            var pMEnd = _vPos.set(p.pos.x, sBobY, p.pos.z);

            this.drawLaserBeam(pMStart, pMEnd, smallLightningPalette, props, 0.06, 0.02);
          }
        }

        // 4. Ground Glow Ring
        var sScale = 0.60 + Math.sin(p.anim * 2.5) * 0.04;
        _vScale.set(sScale, 1, sScale);
        this.draw(props.ring, _vPos.set(p.pos.x, p.pos.y + 0.02 + padElev, p.pos.z), _qIdentity, _vScale, {
          tex: this.texBoostGlow,
          color: [0.0, 0.82, 1.0],
          emissive: [0.1, 1.2, 2.5],
          blend: "add",
          opacity: 0.75 + Math.sin(p.anim * 2.5) * 0.15
        });
      } else {
        // Used / Inactive Small Pad: Premium dark-luxury carved carbon/leather cushion with breathing blue embers
        var sPulse = 0.50 + Math.sin(p.anim * 2.2) * 0.40;
        this.draw(smallBaseMesh, sBasePos, _qIdentity, _vOne, {
          color: [0.08, 0.10, 0.12],                                     // Charcoal carbon-leather shell
          emissive: [0.02 * sPulse, 0.22 * sPulse, 0.55 * sPulse],       // Breathing cyan recharging embers
          metallic: 0.8,
          clearcoat: 1.0,
          bump: 1.2,
          spec: 1.5
        });
      }
    }
  }
};

Renderer.prototype.drawVehicle = function (props, car, team) {
  var B = car.body;
  var col = TEAM_COLOR[team];
  var boostActive = car.boostActive;
  var CAR_SCALE = (CFG.vehicle.carScale !== undefined ? CFG.vehicle.carScale : 2.75);
  var V = CFG.vehicle;
  var groundRestHeight = V.wheel.radius + V.wheel.rest - V.wheel.attachY;
  var upOffset = (CAR_SCALE - 1.0) * groundRestHeight;
  var carDrawPos = _vCarDrawPos.set(B.pos.x + B.up.x * upOffset, B.pos.y + B.up.y * upOffset, B.pos.z + B.up.z * upOffset);

  _vScale.set(CAR_SCALE, CAR_SCALE, CAR_SCALE);

  // Dynamic rebuild of the car kit meshes to match the active tuning parameters (e.g. wheel radius/suspension/hideWheelFlaps/flapOffsetY/flapScale/flapWidthScale/flapThickScale)
  var W_cfg = V.wheel;
  var hideFlapsKey = (CFG.vehicle && CFG.vehicle.hideWheelFlaps) ? "1" : "0";
  var flapOffsetYKey = (CFG.vehicle && CFG.vehicle.flapOffsetY !== undefined) ? CFG.vehicle.flapOffsetY.toFixed(3) : "0";
  var flapScaleKey = (CFG.vehicle && CFG.vehicle.flapScale !== undefined) ? CFG.vehicle.flapScale.toFixed(2) : "1";
  var flapWidthScaleKey = (CFG.vehicle && CFG.vehicle.flapWidthScale !== undefined) ? CFG.vehicle.flapWidthScale.toFixed(2) : "1";
  var flapThickScaleKey = (CFG.vehicle && CFG.vehicle.flapThickScale !== undefined) ? CFG.vehicle.flapThickScale.toFixed(2) : "1";
  var checkKey = W_cfg.radius + "_" + W_cfg.rest + "_" + W_cfg.attachX + "_" + W_cfg.attachY + "_" + W_cfg.attachZ + "_" + hideFlapsKey + "_" + flapOffsetYKey + "_" + flapScaleKey + "_" + flapWidthScaleKey + "_" + flapThickScaleKey;
  if (props && !props._lastWheelCheck) {
    props._lastWheelCheck = checkKey;
  } else if (props && props._lastWheelCheck !== checkKey) {
    props._lastWheelCheck = checkKey;
    try {
      var newKit = buildCarKit(this);
      if (newKit) {
        // Clean up old model VAOs to prevent memory leaks
        if (props.carKit && props.carKit.models) {
          for (var mid in props.carKit.models) {
            var oldM = props.carKit.models[mid];
            if (oldM.body && oldM.body.vao) this.gl.deleteVertexArray(oldM.body.vao);
            if (oldM.accent && oldM.accent.vao) this.gl.deleteVertexArray(oldM.accent.vao);
            if (oldM.glass && oldM.glass.vao) this.gl.deleteVertexArray(oldM.glass.vao);
            if (oldM.lights && oldM.lights.vao) this.gl.deleteVertexArray(oldM.lights.vao);
            if (oldM.thruster && oldM.thruster.vao) this.gl.deleteVertexArray(oldM.thruster.vao);
            if (oldM.trim && oldM.trim.vao) this.gl.deleteVertexArray(oldM.trim.vao);
          }
        }
        // Clean up old wheel VAOs
        if (props.carKit && props.carKit.wheels) {
          for (var wid in props.carKit.wheels) {
            var oldW = props.carKit.wheels[wid];
            if (oldW.wheel && oldW.wheel.vao) this.gl.deleteVertexArray(oldW.wheel.vao);
            if (oldW.hub && oldW.hub.vao) this.gl.deleteVertexArray(oldW.hub.vao);
          }
        }
        props.carKit = newKit;
        if (newKit.models && newKit.models.OCTANE) {
          var oct = newKit.models.OCTANE;
          props.body = oct.body;
          props.accent = oct.accent;
          props.glass = oct.glass;
          props.lights = oct.lights;
          props.thruster = oct.thruster;
          props.trim = oct.trim;
        }
        if (newKit.wheels && newKit.wheels.SPORT) {
          props.wheel = newKit.wheels.SPORT.wheel;
          props.hub = newKit.wheels.SPORT.hub;
        }
      }
    } catch (e) {
      console.error("Failed to dynamically rebuild carKit:", e);
    }
  }

  var BOT_MODELS = ['OCTANE', 'VORTEX', 'STRIKER', 'TITAN', 'RAPTOR', 'PHANTOM', 'MONSTER', 'KART', 'DRAGSTER', 'HYPER', 'COACH', 'SUV', 'HOTROD', 'LIMO'];
  var BOT_WHEELS = ['SPORT', 'TURBINE', 'MESH', 'OFFROAD', 'DISH', 'AERO', 'STEEL'];

  var isPlayer = !!car.isPlayer;
  var cust = CFG.customization || {};

  var modelId = isPlayer
    ? (cust.model || 'OCTANE')
    : (BOT_MODELS[(car.carIndex !== undefined ? car.carIndex : car.id || 0) % BOT_MODELS.length] || 'OCTANE');
  var wheelId = isPlayer
    ? (cust.wheel || 'SPORT')
    : (BOT_WHEELS[(car.carIndex !== undefined ? car.carIndex : car.id || 0) % BOT_WHEELS.length] || 'SPORT');

  var kitM = (props.carKit && props.carKit.models && props.carKit.models[modelId]) || null;
  var kitW = (props.carKit && props.carKit.wheels && props.carKit.wheels[wheelId]) || null;

  var meshBody = (kitM && kitM.body) || props.body;
  var meshAccent = (kitM && kitM.accent) || props.accent;
  var meshGlass = (kitM && kitM.glass) || props.glass;
  var meshLights = (kitM && kitM.lights) || props.lights;
  var meshHeadlights = (kitM && kitM.headlights) || props.headlights || null;
  var meshTaillights = (kitM && kitM.taillights) || props.taillights || null;
  var meshThruster = (kitM && kitM.thruster) || props.thruster;
  var meshTrim = (kitM && kitM.trim) || props.trim;
  var meshWheel = (kitW && kitW.wheel) || props.wheel;
  var meshHub = (kitW && kitW.hub) || props.hub;

  // Default colors
  var bodyCol = col;
  var accentCol = [0.15, 0.16, 0.19];
  var trimCol = [0.94, 0.95, 0.96];
  var glassCol = [0.04, 0.07, 0.12];
  var lightsCol = team === 0 ? [0.4, 0.7, 1.0] : [1.0, 0.6, 0.2];
  var thrusterCol = boostActive ? [1.0, 0.8, 0.2] : [0.4, 0.2, 0.1];
  var wheelCol = [0.10, 0.10, 0.12];
  var hubCol = col;

  var carGloss = (CFG.gfx && CFG.gfx.carGloss !== undefined) ? CFG.gfx.carGloss : 0.95;
  var carClearcoat = (CFG.gfx && CFG.gfx.carClearcoat !== undefined) ? CFG.gfx.carClearcoat : 0.85;
  var carMetallic = (CFG.gfx && CFG.gfx.carMetallic !== undefined) ? CFG.gfx.carMetallic : 0.50;
  var carFlakes = (CFG.gfx && CFG.gfx.carFlakes !== undefined) ? CFG.gfx.carFlakes : 0.80;
  var carBump = (CFG.gfx && CFG.gfx.carBump !== undefined) ? CFG.gfx.carBump : 0.90;
  var carAO = (CFG.gfx && CFG.gfx.carAmbientOcclusion !== undefined) ? CFG.gfx.carAmbientOcclusion : 0.80;

  if (isPlayer && cust.useCustomPaint) {
    if (cust.bodyColor) bodyCol = parseHex(cust.bodyColor, bodyCol);
    if (cust.accentColor) accentCol = parseHex(cust.accentColor, accentCol);
    if (cust.trimColor) trimCol = parseHex(cust.trimColor, trimCol);
    if (cust.glassColor) glassCol = parseHex(cust.glassColor, glassCol);
    if (cust.lightsColor) lightsCol = parseHex(cust.lightsColor, lightsCol);
    if (cust.thrusterColor) thrusterCol = parseHex(cust.thrusterColor, thrusterCol);
    if (cust.hubColor) hubCol = parseHex(cust.hubColor, hubCol);
    if (cust.wheelColor) wheelCol = parseHex(cust.wheelColor, wheelCol);

    if (cust.metallic !== undefined) carMetallic = cust.metallic;
    if (cust.gloss !== undefined) carGloss = cust.gloss;
    if (cust.flakes !== undefined) carFlakes = cust.flakes;
    if (cust.clearcoat !== undefined) carClearcoat = cust.clearcoat;
    if (cust.bump !== undefined) carBump = cust.bump;
  }

  // High-Precision Procedural Car Vinyls & Dynamic Animated Livery
  var VINYL_MAP = {
    "NONE": 0.0,
    "RACING_STRIPES": 1.0,
    "CYBER_GRID": 2.0,
    "FLAME_SURGE": 3.0,
    "LIGHTNING_STORM": 4.0,
    "WAVE_FLOW": 5.0,
    "CARBON_HEX": 6.0,
    "CAMO_TACTICAL": 7.0,
    "DIGITAL_MATRIX": 8.0,
    "SPEED_APEX": 9.0,
    "SUNBURST_RAYS": 10.0,
    "DRAGON_FIRE": 11.0,
    "PHOENIX_BLAZE": 12.0,
    "HERO_SPIDER_WEB": 13.0,
    "HERO_LIGHTNING_BOLT": 14.0,
    "HERO_COSMIC_STAR": 15.0,
    "HERO_BAT_WING": 16.0,
    "CUTE_STARS_GALAXY": 17.0,
    "CUTE_MONSTER_SMILE": 18.0,
    "CUTE_CANDY_SWEETS": 19.0,
    "PIXEL_ARCADE_8BIT": 20.0,
    "CUTE_PAW_PRINTS": 21.0,
    "LAVA_MAGMA": 22.0,
    "QUANTUM_CIRCUIT": 23.0,
    "NEON_TOKYO_DRIFT": 24.0
  };

  var vinylId = 0.0;
  var vinylColor = [1.0, 1.0, 1.0];
  var vinylEmissive = 0.0;
  var vinylScale = 1.0;
  var vinylAnimated = false;

  if (isPlayer) {
    var vKey = cust.vinyl || "NONE";
    vinylId = VINYL_MAP[vKey] !== undefined ? VINYL_MAP[vKey] : 0.0;
    if (cust.vinylColor) vinylColor = parseHex(cust.vinylColor, [1.0, 1.0, 1.0]);
    if (cust.vinylEmissive !== undefined) vinylEmissive = cust.vinylEmissive;
    if (cust.vinylScale !== undefined) vinylScale = cust.vinylScale;
    if (cust.vinylAnimated !== undefined) vinylAnimated = !!cust.vinylAnimated;
  } else {
    // Bots can have distinctive dynamic vinyls based on their car index
    var botVinyls = ["RACING_STRIPES", "CYBER_GRID", "FLAME_SURGE", "LIGHTNING_STORM", "WAVE_FLOW", "CARBON_HEX", "SPEED_APEX"];
    var botVKey = botVinyls[(car.carIndex !== undefined ? car.carIndex : car.id || 0) % botVinyls.length];
    vinylId = VINYL_MAP[botVKey] || 0.0;
    vinylColor = (team === 0 ? [0.4, 0.85, 1.0] : [1.0, 0.75, 0.3]);
    vinylEmissive = 0.45;
    vinylScale = 1.0;
    vinylAnimated = true;
  }

  // 1. Main Body Shell (Realistic 3D Embossed Panel Relief, Team Colors & Vinyl Decals)
  if (meshBody) {
    this.draw(meshBody, carDrawPos, B.quat, _vScale, {
      color: bodyCol,
      tex: this.texCarBody,
      bump: carBump,
      spec: carGloss,
      clearcoat: carClearcoat,
      metallic: carMetallic,
      flakes: carFlakes,
      ao: carAO,
      rim: 0.35,
      vinylId: vinylId,
      vinylColor: vinylColor,
      vinylEmissive: vinylEmissive,
      vinylScale: vinylScale,
      vinylAnimated: vinylAnimated
    });
  }

  // 2. Racing Stripes / Livery Trim
  if (meshTrim) {
    this.draw(meshTrim, carDrawPos, B.quat, _vScale, {
      color: trimCol,
      tex: this.texCarTrim,
      bump: carBump * 0.75,
      spec: carGloss * 0.9,
      clearcoat: carClearcoat * 0.8,
      ao: carAO,
      rim: 0.30
    });
  }

  // 3. Trim / Accent & Roll Cage & Engine
  if (meshAccent) {
    if (boostActive) {
      _trimEmissive[0] = accentCol[0] * 0.9;
      _trimEmissive[1] = accentCol[1] * 0.9;
      _trimEmissive[2] = accentCol[2] * 0.9;
    } else {
      _trimEmissive[0] = accentCol[0] * 0.2;
      _trimEmissive[1] = accentCol[1] * 0.2;
      _trimEmissive[2] = accentCol[2] * 0.2;
    }
    this.draw(meshAccent, carDrawPos, B.quat, _vScale, {
      color: accentCol,
      tex: this.texCarAccent,
      bump: carBump * 0.85,
      emissive: _trimEmissive,
      spec: carGloss * 0.85,
      clearcoat: carClearcoat * 0.5,
      ao: carAO,
      rim: 0.25
    });
  }

  // 4. Glass cockpit
  if (meshGlass) {
    this.draw(meshGlass, carDrawPos, B.quat, _vScale, {
      color: glassCol,
      emissive: [glassCol[0] * 0.15, glassCol[1] * 0.15, glassCol[2] * 0.15],
      spec: 0.98,
      clearcoat: 1.0,
      rim: 0.85
    });
  }

  // Dynamic Brake Detection (Foot brake / reverse throttle OR handbrake slide)
  var isBraking = false;
  if (car.input) {
    if (car.input.throttle < -0.05) {
      isBraking = true;
    }
    var fwdSpeed = car.forwardSpeed ? car.forwardSpeed() : 0;
    if (car.input.slide && Math.abs(fwdSpeed) > 0.6) {
      isBraking = true;
    }
  }

  // 5. Clean Radiant Car Headlights & Taillights (Self-illuminating object meshes)
  if (meshHeadlights || meshTaillights) {
    if (meshHeadlights) {
      // Front Headlights fixture object
      this.draw(meshHeadlights, carDrawPos, B.quat, _vScale, {
        color: lightsCol,
        emissive: [lightsCol[0] * 2.2, lightsCol[1] * 2.2, lightsCol[2] * 2.2],
        spec: 1.0,
        clearcoat: 1.0
      });
    }
    if (meshTaillights) {
      // Rear Taillights fixture object (Clean warm yellowish-white self-glow on brake)
      var tailCol = isBraking ? [1.0, 0.96, 0.78] : [0.85, 0.18, 0.14];
      var tailEmissive = isBraking
        ? [2.8, 2.6, 1.8] // Warm yellowish-white self-luminous glow directly on the light mesh
        : [1.1, 0.20, 0.15]; // Sleek ambient red running light

      this.draw(meshTaillights, carDrawPos, B.quat, _vScale, {
        color: tailCol,
        emissive: tailEmissive,
        spec: 1.0,
        clearcoat: 1.0
      });
    }
  } else if (meshLights) {
    // Fallback unified light mesh
    var activeLightsCol = isBraking ? [1.0, 0.96, 0.78] : lightsCol;
    var activeEmissive = isBraking
      ? [2.8, 2.6, 1.8]
      : [lightsCol[0] * 2.0, lightsCol[1] * 2.0, lightsCol[2] * 2.0];

    this.draw(meshLights, carDrawPos, B.quat, _vScale, {
      color: activeLightsCol,
      emissive: activeEmissive,
      spec: 1.0,
      clearcoat: 1.0
    });
  }

  // 6. Rocket Thruster Exhaust Core
  if (meshThruster) {
    var thrusterEmissive = boostActive
      ? [thrusterCol[0] * 3.5, thrusterCol[1] * 2.5, thrusterCol[2] * 1.5]
      : [thrusterCol[0] * 0.45, thrusterCol[1] * 0.35, thrusterCol[2] * 0.2];
    this.draw(meshThruster, carDrawPos, B.quat, _vScale, {
      color: boostActive ? [1.0, 0.8, 0.2] : thrusterCol,
      emissive: thrusterEmissive,
      spec: 1.0
    });
  }

  // 7. Four Wheels & Rims
  for (var w = 0; w < 4; w++) {
    var wheel = car.wheels[w];
    if (!wheel) continue;
    var curR = wheel.radius || V.wheel.radius;
    _wheelScale.set(CAR_SCALE * curR, CAR_SCALE * curR, CAR_SCALE * curR);

    // Determine custom visual X offset for this model (e.g. to match fender arches)
    var customX = (kitM && kitM.archX !== undefined) ? (kitM.archX + 0.025) : null;

    var sx = (wheel.local.x > 0) ? 1 : -1;
    var localX = (customX !== null) ? (sx * customX) : wheel.local.x;

    // Direct, mathematically correct local-to-world rotation keeping suspension movement aligned with car's orientation
    var comp = wheel.compression || 0;
    var restTravel = V.wheel.rest - comp;
    var localPos = _vScratch4;
    localPos.set(localX, wheel.local.y - restTravel, wheel.local.z);

    var attachRot = B.quat.rotate(localPos, _vScratch3);
    var relX = attachRot.x * CAR_SCALE;
    var relY = attachRot.y * CAR_SCALE;
    var relZ = attachRot.z * CAR_SCALE;
    _vScratch1.set(carDrawPos.x + relX, carDrawPos.y + relY, carDrawPos.z + relZ);

    // Rotate wheel around steer (Y) and rolling spin (X)
    _qScratch1.fromAxisAngle(0, 1, 0, wheel.steer || 0);
    _qScratch2.fromAxisAngle(1, 0, 0, wheel.spin || 0);
    _qScratch3.mul(B.quat, _qScratch1).mul(_qScratch3, _qScratch2);

    if (meshWheel) {
      this.draw(meshWheel, _vScratch1, _qScratch3, _wheelScale, {
        color: wheelCol,
        tex: this.texCarWheel,
        bump: carBump * 0.90,
        spec: 0.30,
        ao: 0.95
      });
    }

    if (meshHub) {
      this.draw(meshHub, _vScratch1, _qScratch3, _wheelScale, {
        color: hubCol,
        tex: this.texCarWheel,
        bump: carBump * 0.65,
        emissive: [hubCol[0] * 0.25, hubCol[1] * 0.25, hubCol[2] * 0.25],
        spec: 0.95,
        clearcoat: 0.85,
        metallic: 0.80,
        rim: 0.45
      });
    }

    // 7.1 Four corner fenders / wheel bumpers (fender arches and brake calipers)
    // Rendered relative to the body but offset along the suspension travel (restTravel)
    if (!CFG.vehicle.hideWheelFlaps && kitM && kitM.fenders && kitM.fenders[w]) {
      var f = kitM.fenders[w];
      var comp = wheel.compression || 0;
      var restTravel = V.wheel.rest - comp;
      var fPos = _vScratch2.set(
        carDrawPos.x - B.up.x * restTravel * CAR_SCALE,
        carDrawPos.y - B.up.y * restTravel * CAR_SCALE,
        carDrawPos.z - B.up.z * restTravel * CAR_SCALE
      );

      if (f.body) {
        this.draw(f.body, fPos, B.quat, _vScale, {
          color: bodyCol,
          tex: this.texCarBody,
          bump: carBump,
          spec: carGloss,
          clearcoat: carClearcoat,
          metallic: carMetallic,
          flakes: carFlakes,
          ao: carAO,
          rim: 0.35
        });
      }

      if (f.accent) {
        this.draw(f.accent, fPos, B.quat, _vScale, {
          color: accentCol,
          tex: this.texCarAccent,
          bump: carBump * 0.85,
          emissive: _trimEmissive,
          spec: carGloss * 0.85,
          clearcoat: carClearcoat * 0.5,
          ao: carAO,
          rim: 0.25
        });
      }
    }
  }
};

Renderer.prototype.drawBall = function (props, ball) {
  var B = ball.body;
  var r = ball.radius;

  // Ball Ground Shadow & Indicator Ring
  var h = Math.max(0, B.pos.y);
  var shadowAlpha = clamp(1.0 - h * 0.04, 0.15, 0.85);
  var ringSize = r * (1.08 + h * 0.05);

  _vScale.set(ringSize, 1, ringSize);
  this.draw(props.shadow, _vPos.set(B.pos.x, 0.015, B.pos.z), _qIdentity, _vScale, {
    tex: this.texBlob,
    blend: "shadow",
    opacity: shadowAlpha
  });

  // Ball Landing Spot Ring
  var teamCol = ball.lastTouchTeam >= 0 ? TEAM_COLOR[ball.lastTouchTeam] : [1, 1, 1];
  this.draw(props.ring, _vPos.set(B.pos.x, 0.02, B.pos.z), _qIdentity, _vScale, {
    color: teamCol,
    emissive: [teamCol[0] * 0.6, teamCol[1] * 0.6, teamCol[2] * 0.6],
    blend: "add",
    opacity: clamp(0.9 - h * 0.03, 0.25, 0.9)
  });

  // Ball Mesh (exact physics radius r)
  _vScale.set(r, r, r);
  var flash = ball.hitFlash > 0 ? ball.hitFlash * 0.6 : 0;
  var ballBright = (CFG.gfx && CFG.gfx.ballBrightness !== undefined) ? CFG.gfx.ballBrightness : 0.95;
  var ballGloss = (CFG.gfx && CFG.gfx.ballGloss !== undefined) ? CFG.gfx.ballGloss : 0.65;
  var ballMetallic = (CFG.gfx && CFG.gfx.ballMetallic !== undefined) ? CFG.gfx.ballMetallic : 0.0;
  var ballBump = (CFG.gfx && CFG.gfx.ballBumpIntensity !== undefined) ? CFG.gfx.ballBumpIntensity : 1.0;
  var ballGlow = (CFG.gfx && CFG.gfx.ballEmissiveGlow !== undefined) ? CFG.gfx.ballEmissiveGlow : 0.0;
  var emissiveTotal = flash + ballGlow;

  this.draw(props.ball, B.pos, B.quat, _vScale, {
    tex: this.texBall,
    color: [ballBright, ballBright, ballBright],
    spec: ballGloss,
    clearcoat: 0.25,
    metallic: ballMetallic,
    flakes: 0.0,
    ao: 0.50,
    rim: 0.15,
    bump: ballBump,
    emissive: [emissiveTotal, emissiveTotal, emissiveTotal]
  });
};

Renderer.prototype.drawBallPrediction = function (props, points) {
  if (!points || points.length < 2) return;
  var col = [0.95, 0.85, 0.35];
  for (var i = 0; i < points.length - 1; i += 2) {
    var p0 = points[i];
    var p1 = points[Math.min(i + 1, points.length - 1)];
    var alpha = clamp(1.0 - (p0.t / 2.5), 0.1, 0.85);
    _vPos.set(p0.x, p0.y, p0.z);
    _vScratch1.set(p1.x, p1.y, p1.z);
    _colScratch[0] = col[0] * alpha;
    _colScratch[1] = col[1] * alpha;
    _colScratch[2] = col[2] * alpha;
    this.line(_vPos, _vScratch1, _colScratch);
  }
  this.flushLines();
};

Renderer.prototype.drawEffectParticles = function (liveList) {
  if (!liveList || !liveList.length) return;
  this.drawParticles(liveList, liveList.length, this.texSpark || this.whiteTex);
};

Renderer.prototype.drawHitboxDebug = function (cars, ball) {
  var V = CFG.vehicle;
  var CAR_SCALE = (CFG.vehicle.carScale !== undefined ? CFG.vehicle.carScale : 2.75);
  var scaleX = (V.ballHitboxScaleX || 1.25);
  var scaleY = (V.ballHitboxScaleY || 1.20);
  var scaleZ = (V.ballHitboxScaleZ || 1.25);

  var elevationOffset = (V.hitboxElevationOffset !== undefined ? V.hitboxElevationOffset : 0.0) * CAR_SCALE;
  var groundRestHeight = V.wheel.radius + V.wheel.rest - V.wheel.attachY;
  var upOffset = (CAR_SCALE - 1.0) * groundRestHeight + elevationOffset;

  var self = this;
  function drawRoundedBoxWireframe(center, quat, hx, hy, hz, roundness, col) {
    var maxR = Math.min(hx, Math.min(hy, hz));
    var r = (roundness || 0) * maxR;
    if (r < 0.005) {
      var corners = [
        new V3(-hx, -hy, -hz), new V3(hx, -hy, -hz),
        new V3(hx, hy, -hz), new V3(-hx, hy, -hz),
        new V3(-hx, -hy, hz), new V3(hx, -hy, hz),
        new V3(hx, hy, hz), new V3(-hx, hy, hz)
      ];
      var worldPts = [];
      for (var i = 0; i < 8; i++) {
        var p = quat.rotate(corners[i], tv());
        p.add(center);
        worldPts.push(p);
      }
      // Bottom square
      self.line(worldPts[0], worldPts[1], col);
      self.line(worldPts[1], worldPts[2], col);
      self.line(worldPts[2], worldPts[3], col);
      self.line(worldPts[3], worldPts[0], col);
      // Top square
      self.line(worldPts[4], worldPts[5], col);
      self.line(worldPts[5], worldPts[6], col);
      self.line(worldPts[6], worldPts[7], col);
      self.line(worldPts[7], worldPts[4], col);
      // Vertical pillars
      self.line(worldPts[0], worldPts[4], col);
      self.line(worldPts[1], worldPts[5], col);
      self.line(worldPts[2], worldPts[6], col);
      self.line(worldPts[3], worldPts[7], col);
      return;
    }

    var ix = Math.max(0, hx - r), iy = Math.max(0, hy - r), iz = Math.max(0, hz - r);
    // Draw 12 edge lines for inner rounded box
    var edges = [
      // X edges
      [new V3(-ix, -hy, -iz), new V3(ix, -hy, -iz)],
      [new V3(-ix, hy, -iz), new V3(ix, hy, -iz)],
      [new V3(-ix, -hy, iz), new V3(ix, -hy, iz)],
      [new V3(-ix, hy, iz), new V3(ix, hy, iz)],
      // Y edges
      [new V3(-hx, -iy, -iz), new V3(-hx, iy, -iz)],
      [new V3(hx, -iy, -iz), new V3(hx, iy, -iz)],
      [new V3(-hx, -iy, iz), new V3(-hx, iy, iz)],
      [new V3(hx, -iy, iz), new V3(hx, iy, iz)],
      // Z edges
      [new V3(-hx, -hy, -iz), new V3(-hx, -hy, iz)],
      [new V3(hx, -hy, -iz), new V3(hx, -hy, iz)],
      [new V3(-hx, hy, -iz), new V3(-hx, hy, iz)],
      [new V3(hx, hy, -iz), new V3(hx, hy, iz)]
    ];
    for (var e = 0; e < edges.length; e++) {
      var p1 = quat.rotate(edges[e][0], tv()).add(center);
      var p2 = quat.rotate(edges[e][1], tv()).add(center);
      self.line(p1, p2, col);
    }

    // Corner arcs (8 corners)
    var SEGS = 3;
    var cornerSigns = [
      [-1,-1,-1], [1,-1,-1], [1,1,-1], [-1,1,-1],
      [-1,-1,1],  [1,-1,1],  [1,1,1],  [-1,1,1]
    ];
    for (var c = 0; c < 8; c++) {
      var cs = cornerSigns[c];
      var base = [cs[0] * ix, cs[1] * iy, cs[2] * iz];
      for (var axis = 0; axis < 3; axis++) {
        var a1 = (axis + 1) % 3, a2 = (axis + 2) % 3;
        var prevP = null;
        for (var s = 0; s <= SEGS; s++) {
          var ang = (s / SEGS) * (Math.PI * 0.5);
          var vec = [base[0], base[1], base[2]];
          vec[a1] += cs[a1] * Math.cos(ang) * r;
          vec[a2] += cs[a2] * Math.sin(ang) * r;
          var pt = quat.rotate(new V3(vec[0], vec[1], vec[2]), tv()).add(center);
          if (prevP) self.line(prevP, pt, col);
          prevP = pt;
        }
      }
    }
  }

  // Draw Vehicles
  if (cars) {
    for (var c = 0; c < cars.length; c++) {
      var car = cars[c];
      var B = car.body;
      var carCenter = tv(B.pos.x + B.up.x * upOffset, B.pos.y + B.up.y * upOffset, B.pos.z + B.up.z * upOffset);

      // 1. Physics Chassis Hitbox (wall/ground/car contact - Cyan/Green)
      var physCol = [0.2, 0.9, 0.9];
      drawRoundedBoxWireframe(carCenter, B.quat, V.hx * CAR_SCALE, V.hy * CAR_SCALE, V.hz * CAR_SCALE, V.chassisRoundness || 0.15, physCol);

      // 2. Ball-Hitbox (separate, enlarged striking box - Orange/Gold)
      var ballBoxCol = [1.0, 0.6, 0.1];
      drawRoundedBoxWireframe(carCenter, B.quat, V.hx * CAR_SCALE * scaleX, V.hy * CAR_SCALE * scaleY, V.hz * CAR_SCALE * scaleZ, V.ballBoxRoundness || 0.20, ballBoxCol);
    }
  }

  // Draw Ball Sphere wireframe circles (Red/Pink)
  if (ball) {
    var bPos = ball.body.pos;
    var bRad = ball.radius;
    var ballCol = [1.0, 0.2, 0.4];
    var segments = 24;
    // Circle in X-Z
    for (var k = 0; k < segments; k++) {
      var a1 = (k / segments) * TAU, a2 = ((k + 1) / segments) * TAU;
      self.line(
        tv(bPos.x + Math.cos(a1) * bRad, bPos.y, bPos.z + Math.sin(a1) * bRad),
        tv(bPos.x + Math.cos(a2) * bRad, bPos.y, bPos.z + Math.sin(a2) * bRad),
        ballCol
      );
    }
    // Circle in X-Y
    for (var k2 = 0; k2 < segments; k2++) {
      var b1 = (k2 / segments) * TAU, b2 = ((k2 + 1) / segments) * TAU;
      self.line(
        tv(bPos.x + Math.cos(b1) * bRad, bPos.y + Math.sin(b1) * bRad, bPos.z),
        tv(bPos.x + Math.cos(b2) * bRad, bPos.y + Math.sin(b2) * bRad, bPos.z),
        ballCol
      );
    }
    // Circle in Y-Z
    for (var k3 = 0; k3 < segments; k3++) {
      var c1 = (k3 / segments) * TAU, c2 = ((k3 + 1) / segments) * TAU;
      self.line(
        tv(bPos.x, bPos.y + Math.cos(c1) * bRad, bPos.z + Math.sin(c1) * bRad),
        tv(bPos.x, bPos.y + Math.cos(c2) * bRad, bPos.z + Math.sin(c2) * bRad),
        ballCol
      );
    }
  }

  this.flushLines();
};
