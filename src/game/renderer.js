// @ts-nocheck
import { TAU, PI, rad, clamp, lerp, V3, Quat, M4, m4perspective, m4ortho, m4lookAt, m4mul, m4compose, m3fromM4, tv, tc } from './math.js';
import { CFG, TEAM_COLOR, STADIUM_THEMES } from './config.js';

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

  // 2. Main Soccer Pitch Area (Spaced safely inside arena walls)
  var marginX = 3.6; // 3.6m margin between sideline and arena wall
  var marginZ = 4.2; // 4.2m margin between goal line and end wall
  var pLeft = (-A.hx + marginX + A.hx) * px;
  var pRight = (A.hx - marginX + A.hx) * px;
  var pTop = (-A.hz + marginZ + A.hz) * pz;
  var pBottom = (A.hz - marginZ + A.hz) * pz;
  var pWidth = pRight - pLeft;
  var pHeight = pBottom - pTop;

  // Outer safety kerb line bordering the pitch
  g.strokeStyle = "rgba(255, 255, 255, 0.14)";
  g.lineWidth = 1.4 * px;
  g.strokeRect(pLeft - 1.2 * px, pTop - 1.2 * pz, pWidth + 2.4 * px, pHeight + 2.4 * pz);

  // High quality manicured pitch grass (Clip to pitch rectangle with rounded corners)
  g.save();
  var pitchCornerRadius = 2.4 * px;
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

export function texSky() {
  var W = 1024, H = 512, c = makeCanvas(W);
  c.height = H;
  var g = c.getContext("2d");

  // Brilliant clear daytime sky gradient
  var grd = g.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0.00, "#1268cb"); // Deep azure zenith
  grd.addColorStop(0.22, "#2b84e4"); // Vibrant daytime sky
  grd.addColorStop(0.48, "#56a5f2"); // Rich cerulean
  grd.addColorStop(0.72, "#8bc4f8"); // Soft atmospheric blue
  grd.addColorStop(0.88, "#bde0fb"); // Low horizon mist
  grd.addColorStop(1.00, "#eaf4fd"); // Radiant sunlit horizon
  g.fillStyle = grd;
  g.fillRect(0, 0, W, H);

  // Radiant Golden Daytime Sun with Corona & Flares
  var sunX = W * 0.72, sunY = 90;
  var sCorona = g.createRadialGradient(sunX, sunY, 15, sunX, sunY, 260);
  sCorona.addColorStop(0.00, "rgba(255, 255, 255, 1.0)");
  sCorona.addColorStop(0.12, "rgba(255, 252, 220, 0.88)");
  sCorona.addColorStop(0.35, "rgba(255, 240, 180, 0.38)");
  sCorona.addColorStop(0.65, "rgba(240, 225, 255, 0.12)");
  sCorona.addColorStop(1.00, "rgba(230, 240, 255, 0)");
  g.fillStyle = sCorona;
  g.beginPath();
  g.arc(sunX, sunY, 260, 0, TAU);
  g.fill();

  // Intense solar core disk
  g.fillStyle = "#ffffff";
  g.beginPath();
  g.arc(sunX, sunY, 28, 0, TAU);
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
      ug.addColorStop(0, "rgba(190, 215, 240, 0.65)");
      ug.addColorStop(0.65, "rgba(215, 232, 248, 0.35)");
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
      tg.addColorStop(0, "rgba(255, 255, 255, 0.96)");
      tg.addColorStop(0.72, "rgba(250, 252, 255, 0.85)");
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

  // Distant low horizon cloud haze
  for (var hi = 0; hi < 18; hi++) {
    var hx = (hi * 65) % W;
    var hy = 340 + (hi % 3) * 18;
    var hg = g.createRadialGradient(hx, hy, 0, hx, hy, 140);
    hg.addColorStop(0, "rgba(255, 255, 255, 0.45)");
    hg.addColorStop(0.6, "rgba(240, 248, 255, 0.2)");
    hg.addColorStop(1, "rgba(255, 255, 255, 0)");
    g.fillStyle = hg;
    g.beginPath();
    g.ellipse(hx, hy, 140, 25, 0, 0, TAU);
    g.fill();
  }

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

  // 1. Deep Solid Neutral Charcoal Base
  g.fillStyle = "#161b22";
  g.fillRect(0, 0, W, H);

  // 2. Exact 12 Icosahedron Pentagon Centers in Spherical Coordinates (phi, theta)
  var pentagons = [];
  pentagons.push({ phi: 0.0, th: 0.0, team: 0 });
  pentagons.push({ phi: Math.PI, th: 0.0, team: 1 });
  var phi1 = Math.atan(0.5); // ~26.565 deg
  var phiRing1 = Math.PI * 0.5 - phi1; // Northern ring (~63.43 deg)
  var phiRing2 = Math.PI * 0.5 + phi1; // Southern ring
  for (var k = 0; k < 5; k++) {
    pentagons.push({ phi: phiRing1, th: (k / 5) * TAU, team: k % 2 });
    pentagons.push({ phi: phiRing2, th: ((k + 0.5) / 5) * TAU, team: (k + 1) % 2 });
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

  var pCenters3D = pentagons.map(function (p) {
    var cart = sphToCart(p.phi, p.th);
    cart.team = p.team;
    return cart;
  });

  var pentRad = 0.36; // Bold, distinct pentagons

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
      var closestCenter = null;
      for (var pi = 0; pi < pCenters3D.length; pi++) {
        var pc = pCenters3D[pi];
        var dot = px * pc.x + py * pc.y + pz * pc.z;
        dot = Math.max(-1.0, Math.min(1.0, dot));
        var angDist = Math.acos(dot);
        if (angDist < minDist) {
          secondDist = minDist;
          minDist = angDist;
          closestCenter = pc;
        } else if (angDist < secondDist) {
          secondDist = angDist;
        }
      }

      var idx = (y * W + x) * 4;
      var team = closestCenter ? closestCenter.team : 0;

      // A. Deep Solid Jet-Black Obsidian Pentagons with Rich Carbon Weave
      if (minDist < pentRad * 0.76) {
        var pDist = minDist / (pentRad * 0.76);
        var lum = Math.floor(16 + (1.0 - pDist) * 14);
        data[idx] = lum;
        data[idx + 1] = lum + 2;
        data[idx + 2] = lum + 5;
        // Pronounced domed center height (180 -> 255)
        var pHeight = Math.floor(180 + Math.cos(pDist * Math.PI * 0.5) * 75);
        data[idx + 3] = pHeight;
      }
      // B. Solid High-Saturation Electric Team Accent Ribbon
      else if (minDist < pentRad) {
        var tRatio = (minDist - pentRad * 0.76) / (pentRad * 0.24);
        if (team === 0) {
          // Solid Vibrant Royal Blue / Cyan Strike (#0055ff -> #00d4ff)
          data[idx] = Math.floor(0 + tRatio * 10);
          data[idx + 1] = Math.floor(90 + tRatio * 120);
          data[idx + 2] = 255;
        } else {
          // Solid Vibrant Crimson / Amber Fire (#d62828 -> #ff8800)
          data[idx] = 255;
          data[idx + 1] = Math.floor(40 + tRatio * 110);
          data[idx + 2] = 15;
        }
        // Beveled shoulder height (150 -> 180)
        data[idx + 3] = Math.floor(150 + (1.0 - tRatio) * 30);
      }
      // C. Championship Solid Gold Ring Accent
      else if (minDist < pentRad + 0.020) {
        data[idx] = 255;
        data[idx + 1] = 190;
        data[idx + 2] = 25;
        data[idx + 3] = 140; // Bevel ridge
      }
      // D. Deep Recessed Dark Seam Trench (Deep Valley for extreme 3D bump relief)
      else if (minDist < pentRad + 0.046) {
        var seamDist = minDist - (pentRad + 0.020);
        var seamProfile = Math.abs(seamDist - 0.013) / 0.013; // 0.0 at center, 1.0 at edges
        var seamDark = Math.floor(10 + seamProfile * 25);
        data[idx] = seamDark;
        data[idx + 1] = seamDark;
        data[idx + 2] = seamDark;
        // Deep carved canyon height in alpha channel!
        data[idx + 3] = Math.floor(15 + seamProfile * 90);
      }
      // E. Hexagonal Panels with Solid Rich Color Blocking & Pillow Doming
      else {
        var seamDiff = Math.abs(minDist - secondDist);
        if (seamDiff < 0.034) {
          // Hexagonal Boundary Dark Seam (Deep Valley)
          var hexProfile = seamDiff / 0.034;
          var hexGroove = Math.floor(10 + hexProfile * 30);
          data[idx] = hexGroove;
          data[idx + 1] = hexGroove;
          data[idx + 2] = hexGroove;
          data[idx + 3] = Math.floor(15 + hexProfile * 90);
        } else {
          // Solid Rich Hexagonal Panel
          var distToEdge = Math.min(minDist - (pentRad + 0.046), seamDiff - 0.034);
          var pillow = Math.sin(Math.min(1.0, distToEdge / 0.10) * (Math.PI * 0.5));
          
          // Checker alternating solid panel color scheme: Clean Solid Off-White, Electric Cobalt, and Solar Crimson
          var hexType = (Math.floor(phi * 2.2) + Math.floor(th * 2.2)) % 3;
          if (hexType === 0) {
            // Solid Rich Deep Cobalt Blue
            data[idx] = 15;
            data[idx + 1] = 75;
            data[idx + 2] = 225;
          } else if (hexType === 1) {
            // Solid Rich Scarlet Red
            data[idx] = 230;
            data[idx + 1] = 30;
            data[idx + 2] = 40;
          } else {
            // Solid Clean Pearl Off-White
            data[idx] = 235;
            data[idx + 1] = 238;
            data[idx + 2] = 245;
          }
          // Domed pillow height peaking at 255 at panel center!
          data[idx + 3] = Math.floor(120 + pillow * 135);
        }
      }
    }
  }

  g.putImageData(imgData, 0, 0);

  // 3. Bold Crisp Championship Emblems & Graphics
  g.fillStyle = "#ffffff";
  g.font = "900 28px sans-serif";
  g.textAlign = "center";
  g.shadowColor = "rgba(0,0,0,0.8)";
  g.shadowBlur = 6;
  g.fillText("OVERDRIVE", W * 0.5, H * 0.5 - 6);
  g.fillStyle = "#ffcc00";
  g.font = "bold 16px sans-serif";
  g.fillText("★ STRIKER PRO ★", W * 0.5, H * 0.5 + 18);

  g.fillStyle = "#ffffff";
  g.font = "900 28px sans-serif";
  g.fillText("OVERDRIVE", W * 0.5, H * 0.18);
  g.fillText("OVERDRIVE", W * 0.5, H * 0.82);

  return c;
}

export function texBallVolleyball() {
  var W = 1024, H = 512, c = makeCanvas(W), g = c.getContext("2d");
  c.height = H;
  // Professional 18-panel Mikasa V200W dynamic swirling aerodynamic design
  g.fillStyle = "#ffffff"; g.fillRect(0, 0, W, H);

  // 12 Curved multi-color panel ribbons (Royal Blue, Vibrant Yellow, Clean White)
  var nSwirls = 12;
  var w = W / nSwirls;
  var cols = ["#1240a0", "#ffbe00", "#f4f6fa", "#1240a0", "#ffbe00", "#f4f6fa"];

  for (var i = 0; i < nSwirls; i++) {
    g.fillStyle = cols[i % cols.length];
    g.beginPath();
    var x0 = i * w;
    var x1 = (i + 1) * w;
    g.moveTo(x0, 0);
    g.bezierCurveTo(x0 + w * 0.8, H * 0.35, x0 - w * 0.5, H * 0.65, x0 + w * 0.4, H);
    g.lineTo(x1 + w * 0.4, H);
    g.bezierCurveTo(x1 - w * 0.5, H * 0.65, x1 + w * 0.8, H * 0.35, x1, 0);
    g.closePath();
    g.fill();

    // Deep recessed rubber groove for pronounced bump & lighting relief
    g.strokeStyle = "#080c16";
    g.lineWidth = 6;
    g.stroke();
  }

  // Horizontal grip channels with deep contrast seams
  g.strokeStyle = "rgba(10, 16, 30, 0.9)";
  g.lineWidth = 5;
  for (var h = 1; h < 4; h++) {
    g.beginPath();
    g.moveTo(0, H * (h / 4));
    g.lineTo(W, H * (h / 4));
    g.stroke();
  }

  // Official Pro Volleyball Gold Badge
  g.fillStyle = "#ffcc00";
  g.font = "bold 32px sans-serif";
  g.textAlign = "center";
  g.fillText("PRO V-200 OLYMPIC", W * 0.5, H * 0.5);

  // Set Alpha Heightmap: compute from luminance + groove depth
  var img = g.getImageData(0, 0, W, H);
  var d = img.data;
  for (var p = 0; p < d.length; p += 4) {
    var lum = (d[p] + d[p + 1] + d[p + 2]) / 3;
    // Dark grooves have very low height (30), panels have high pillow height (240)
    d[p + 3] = lum < 35 ? 25 : Math.floor(140 + (lum / 255) * 115);
  }
  g.putImageData(img, 0, 0);

  return c;
}

export function texBallTennis() {
  var W = 1024, H = 512, c = makeCanvas(W), g = c.getContext("2d");
  c.height = H;
  // High-visibility Optic Yellow Tennis Base
  g.fillStyle = "#d4ee10"; g.fillRect(0, 0, W, H);

  // Fibrous fuzzy felt micro-texture
  for (var f = 0; f < 8000; f++) {
    var fx = Math.random() * W, fy = Math.random() * H;
    var fLen = 3 + Math.random() * 4;
    var fAng = Math.random() * TAU;
    g.strokeStyle = Math.random() > 0.5 ? "rgba(255,255,160,0.4)" : "rgba(120,150,0,0.3)";
    g.lineWidth = 1.4;
    g.beginPath();
    g.moveTo(fx, fy);
    g.lineTo(fx + Math.cos(fAng) * fLen, fy + Math.sin(fAng) * fLen);
    g.stroke();
  }

  // Curved tennis ball rubber seam (continuous harmonic sine wave across longitude)
  g.strokeStyle = "#384405";
  g.lineWidth = 18;
  g.beginPath();
  for (var x = 0; x <= W; x += 4) {
    var y = H * 0.5 + Math.sin((x / W) * TAU * 2) * (H * 0.35);
    if (x === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.stroke();

  // Crisp white inner vulcanized seam
  g.strokeStyle = "#ffffff";
  g.lineWidth = 10;
  g.beginPath();
  for (var x2 = 0; x2 <= W; x2 += 4) {
    var y2 = H * 0.5 + Math.sin((x2 / W) * TAU * 2) * (H * 0.35);
    if (x2 === 0) g.moveTo(x2, y2); else g.lineTo(x2, y2);
  }
  g.stroke();

  var img2 = g.getImageData(0, 0, W, H);
  var d2 = img2.data;
  for (var p2 = 0; p2 < d2.length; p2 += 4) {
    var isDarkSeam = (d2[p2] < 90 && d2[p2 + 1] < 100);
    d2[p2 + 3] = isDarkSeam ? 20 : 235;
  }
  g.putImageData(img2, 0, 0);

  return c;
}

export function texBallBasketball() {
  var W = 1024, H = 512, c = makeCanvas(W), g = c.getContext("2d");
  c.height = H;
  // Official regulation NBA amber/burnt orange pebbled composite leather
  g.fillStyle = "#cf4d10"; g.fillRect(0, 0, W, H);

  // Micro-pebble grain surface
  for (var p = 0; p < 10000; p++) {
    var px = Math.random() * W, py = Math.random() * H;
    g.fillStyle = Math.random() > 0.5 ? "rgba(255,140,50,0.3)" : "rgba(80,25,0,0.35)";
    g.fillRect(px, py, 2.5, 2.5);
  }

  // Deep black recessed rubber ribs (8-panel basketball seams)
  g.strokeStyle = "#08080a";
  g.lineWidth = 14;
  g.lineCap = "round";

  // Equator & Meridian
  g.beginPath(); g.moveTo(0, H * 0.5); g.lineTo(W, H * 0.5); g.stroke();
  g.beginPath(); g.moveTo(W * 0.25, 0); g.lineTo(W * 0.25, H); g.stroke();
  g.beginPath(); g.moveTo(W * 0.75, 0); g.lineTo(W * 0.75, H); g.stroke();

  // Characteristic curved side ribs (harmonic sinusoidal arcs)
  g.beginPath();
  for (var bx = 0; bx <= W; bx += 4) {
    var by = H * 0.5 + Math.sin((bx / W) * TAU) * (H * 0.38);
    if (bx === 0) g.moveTo(bx, by); else g.lineTo(bx, by);
  }
  g.stroke();

  // Gold foil tournament lettering
  g.fillStyle = "#ffcc00";
  g.font = "900 36px monospace";
  g.textAlign = "center";
  g.fillText("SPALDING OFFICIAL GAME", W * 0.5, H * 0.44);

  var img3 = g.getImageData(0, 0, W, H);
  var d3 = img3.data;
  for (var p3 = 0; p3 < d3.length; p3 += 4) {
    var isRib = (d3[p3] < 30 && d3[p3 + 1] < 30 && d3[p3 + 2] < 30);
    d3[p3 + 3] = isRib ? 20 : 240;
  }
  g.putImageData(img3, 0, 0);

  return c;
}

export function texBall(ballType) {
  var t = (ballType || (CFG.gfx && CFG.gfx.ballType) || "soccer").toLowerCase();
  if (t === "volleyball") return texBallVolleyball();
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

export function texCrowd() {
  var S = 512, c = makeCanvas(S), g = c.getContext("2d");
  // Grandstand concrete terrace structure
  g.fillStyle = "#10141f"; g.fillRect(0, 0, S, S);

  // Tiered seating rows
  var nRows = 32;
  var rowH = S / nRows;
  for (var r = 0; r < nRows; r++) {
    var ry = r * rowH;
    // Dark shadow riser
    g.fillStyle = "#090c14";
    g.fillRect(0, ry, S, rowH * 0.28);
    // Concrete tread / walkway
    g.fillStyle = (r % 4 === 0) ? "#1a2234" : "#141a28";
    g.fillRect(0, ry + rowH * 0.28, S, rowH * 0.72);
  }

  // Spectator shirts & cheering fans
  var fanPalette = [
    "#ff9745", "#ffa760", "#ff6b25", // Team Orange
    "#35baff", "#60d0ff", "#1890e0", // Team Blue
    "#e2e8f5", "#ccd6ea", "#f5f7fc", // White / Silver
    "#4a5572", "#353e54", "#262c3d"  // Dark neutral jackets
  ];

  for (var f = 0; f < 3800; f++) {
    var fx = Math.random() * S;
    var rowIdx = Math.floor(Math.random() * nRows);
    var fy = rowIdx * rowH + rowH * 0.35 + Math.random() * (rowH * 0.52);

    var col;
    if (fx < S * 0.42) {
      col = (Math.random() < 0.65) ? fanPalette[Math.floor(Math.random() * 3)] : fanPalette[Math.floor(Math.random() * fanPalette.length)];
    } else if (fx > S * 0.58) {
      col = (Math.random() < 0.65) ? fanPalette[3 + Math.floor(Math.random() * 3)] : fanPalette[Math.floor(Math.random() * fanPalette.length)];
    } else {
      col = fanPalette[Math.floor(Math.random() * fanPalette.length)];
    }

    g.fillStyle = col;
    g.fillRect(fx, fy, 2.6, 3.2);
    // Fan head / skin
    g.fillStyle = "rgba(255, 218, 185, 0.75)";
    g.fillRect(fx + 0.4, fy - 1.8, 1.8, 1.8);
  }

  // Cheering camera flashes and glow sticks
  for (var fl = 0; fl < 75; fl++) {
    var flx = Math.random() * S, fly = Math.random() * S;
    var flg = g.createRadialGradient(flx, fly, 0, flx, fly, 5.5);
    flg.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    flg.addColorStop(0.35, "rgba(180, 220, 255, 0.5)");
    flg.addColorStop(1, "rgba(0, 0, 0, 0)");
    g.fillStyle = flg;
    g.beginPath(); g.arc(flx, fly, 5.5, 0, TAU); g.fill();
  }
  return c;
}

export function texAdBoard() {
  var S = 2048, H = 128, c = makeCanvas(S), g = c.getContext("2d");
  c.height = H;
  var brands = ["NEON VELOCITY", "AXIOM DRIVETRAIN", "VOLTRACK TYRES", "HALCYON CELLS", "KESTREL ENERGY", "NULLPOINT DYNAMICS", "MERIDIAN AEROWORKS", "ORBITAL LOGISTICS"];
  var w = S / brands.length;
  for (var i = 0; i < brands.length; i++) {
    g.fillStyle = (i % 2 === 0) ? "#0a0e18" : "#121828";
    g.fillRect(i * w, 0, w, H);
    g.fillStyle = (i % 2 === 0) ? "#e2e8f5" : "#80c8ff";
    g.font = "bold 24px sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(brands[i], i * w + w / 2, H / 2 - 2);
    g.fillStyle = "#35baff";
    g.fillRect(i * w, H - 6, w, 6);
  }
  return c;
}

export function texRibbon() {
  var S = 512, H = 64, c = makeCanvas(S), g = c.getContext("2d");
  c.height = H;
  g.fillStyle = "#080c18"; g.fillRect(0, 0, S, H);
  g.fillStyle = "#35baff";
  for (var i = 0; i < 16; i++) {
    g.beginPath();
    g.moveTo(i * 32, H);
    g.lineTo(i * 32 + 16, 0);
    g.lineTo(i * 32 + 28, 0);
    g.lineTo(i * 32 + 12, H);
    g.fill();
  }
  g.fillStyle = "#ff9745";
  for (var j = 0; j < 16; j++) {
    g.beginPath();
    g.moveTo(j * 32 + 16, H);
    g.lineTo(j * 32 + 32, 0);
    g.lineTo(j * 32 + 44, 0);
    g.lineTo(j * 32 + 28, H);
    g.fill();
  }
  return c;
}

export function texScreen(clockStr, score0, score1, title) {
  var S = 512, H = 256, c = makeCanvas(S), g = c.getContext("2d");
  c.height = H;
  g.fillStyle = "#050810"; g.fillRect(0, 0, S, H);
  g.fillStyle = "#0d182b"; g.fillRect(12, 12, S - 24, H - 24);
  g.fillStyle = "#35baff"; g.fillRect(12, 12, S - 24, 8);
  g.fillStyle = "#ff9745"; g.fillRect(12, H - 20, S - 24, 8);
  g.textAlign = "center";
  g.fillStyle = "#ffffff";
  g.font = "bold 58px sans-serif";
  g.fillText(clockStr || "5:00", S / 2, 80);
  g.font = "bold 100px sans-serif";
  g.fillStyle = "#35baff";
  g.textAlign = "right";
  g.fillText(String(score0 !== undefined ? score0 : 0), S / 2 - 25, 180);
  g.fillStyle = "#ff9745";
  g.textAlign = "left";
  g.fillText(String(score1 !== undefined ? score1 : 0), S / 2 + 25, 180);
  g.fillStyle = "#5d6b90";
  g.fillRect(S / 2 - 4, 105, 8, 80);
  g.textAlign = "center";
  g.fillStyle = "#a9c2e4";
  g.font = "bold 18px sans-serif";
  g.fillText(title || "NEON VELOCITY CHAMPIONSHIP", S / 2, 226);
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
      var u = x / seg, th = u * TAU;
      var nx = Math.sin(phi) * Math.cos(th), ny = Math.cos(phi), nz = Math.sin(phi) * Math.sin(th);
      this.vert(nx * r + (p ? p.x : 0), ny * r + (p ? p.y : 0), nz * r + (p ? p.z : 0), nx, ny, nz, u, v);
    }
  }
  for (var yy = 0; yy < rings; yy++) {
    for (var xx = 0; xx < seg; xx++) {
      var i0 = base + yy * (seg + 1) + xx, i1 = i0 + 1, i2 = i0 + seg + 1, i3 = i2 + 1;
      this.quad(i0, i2, i3, i1);
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
  "out vec3 vN; out vec3 vW; out vec2 vUV; out vec4 vShadowCoord;",
  "void main(){",
  "  vec4 w = uModel * vec4(aPos, 1.0);",
  "  if (uCrowd > 0.5 && aPos.y > 1.8) {",
  "    float wave = sin(uTime * 4.2 - aUV.x * 26.0) * 0.5 + 0.5;",
  "    float bounce = sin(uTime * 7.5 + aPos.x * 0.9 + aPos.z * 0.7) * 0.5 + 0.5;",
  "    float cheer = pow(wave, 3.5) * 0.55 + pow(bounce, 3.0) * 0.20;",
  "    w.y += cheer * clamp((aPos.y - 1.8) * 0.16, 0.0, 1.0);",
  "  }",
  "  vW = w.xyz; vN = uNM * aNormal; vUV = aUV;",
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
  "uniform vec3 uColor; uniform vec3 uEmissive; uniform vec3 uCam; uniform vec3 uFogCol;",
  "uniform float uOpacity; uniform float uSpec; uniform float uUseTex; uniform float uFog;",
  "uniform float uAlphaTest; uniform float uRim;",
  "uniform float uFlood; uniform float uSun; uniform float uAmb; uniform float uBump;",
  "uniform float uClearcoat; uniform float uMetallic; uniform float uAO; uniform float uFlakes;",
  "uniform float uShadowEnable; uniform float uShadowSoftness;",
  "uniform float uTime; uniform float uCrowd;",
  "uniform highp sampler2D uTex;",
  "uniform highp sampler2DShadow uShadowMap;",
  "out vec4 outColor;",
  // Primary Daylight Sun Vector
  "const vec3 L_SUN = vec3(0.38, 0.85, -0.36);",
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
  "    vec2 uvStepY = vec2(0.0, 1.5 / 512.0);",
  "    float hC = texture(uTex, vUV).a;",
  "    float hR = texture(uTex, vUV + uvStepX).a;",
  "    float hL = texture(uTex, vUV - uvStepX).a;",
  "    float hU = texture(uTex, vUV + uvStepY).a;",
  "    float hD = texture(uTex, vUV - uvStepY).a;",
  "    float dU = (hR - hL);",
  "    float dV = (hU - hD);",
  "    vec3 dp1 = dFdx(vW);",
  "    vec3 dp2 = dFdy(vW);",
  "    vec2 duv1 = dFdx(vUV);",
  "    vec2 duv2 = dFdy(vUV);",
  "    vec3 dp2perp = cross(dp2, N);",
  "    vec3 dp1perp = cross(N, dp1);",
  "    vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;",
  "    vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;",
  "    float invmax = inversesqrt(max(dot(T, T), dot(B, B)) + 1e-6);",
  "    vec3 surfGrad = (T * (dU * invmax) + B * (dV * invmax));",
  "    float bumpScale = uBump * 6.5;",
  "    N = normalize(N - surfGrad * bumpScale);",
  "    seamAO = clamp(hC * 1.5 + 0.15, 0.20, 1.0);",
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
  "  vec3 col = lit + specularSun + clearcoatLobe + floodSpec + envReflection + uEmissive;",
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
  "uniform vec3 uCarPos; uniform vec3 uBallPos;",
  "out vec3 vN; out vec3 vW; out vec2 vUV; out vec4 vShadowCoord; out float vHeight; out float vStripe; out vec2 vRootXZ;",
  "void main(){",
  "  vec3 rootPos = aInstPosRot.xyz;",
  "  float rot = aInstPosRot.w;",
  "  float hRatio = aBladePos.y;",
  "  vHeight = hRatio;",
  "  vUV = aBladeUV;",
  "  vRootXZ = rootPos.xz;",
  "  vStripe = sin(rootPos.z * 0.65) * 0.5 + 0.5;",
  "  float wMult = uGrassWidth > 0.005 ? uGrassWidth : 1.0;",
  "  float wScale = aInstScale.x * 0.038 * wMult;",
  "  float hScale = aInstScale.y * uGrassHeight * 0.75;",
  "  vec3 localPos = vec3(aBladePos.x * wScale, aBladePos.y * hScale, aBladePos.z * wScale);",
  "  float cosR = cos(rot), sinR = sin(rot);",
  "  vec3 rotated = vec3(localPos.x * cosR - localPos.z * sinR, localPos.y, localPos.x * sinR + localPos.z * cosR);",
  "  vec3 wPos = rootPos + rotated;",
  "  float t = uTime * uWindSpeed;",
  "  vec2 windDir = normalize(vec2(0.82, 0.45));",
  "  float macroWave = sin(t * 2.2 + rootPos.x * 0.12 + rootPos.z * 0.16) * cos(t * 1.5 + rootPos.z * 0.22);",
  "  float microFlutter = sin(t * 6.5 + rootPos.x * 0.85 + rootPos.z * 0.95) * 0.40;",
  "  float jitterTremble = sin(t * 14.0 + rootPos.x * 8.0 + rootPos.z * 7.0) * (uTremble * 0.25);",
  "  float totalWind = (macroWave + microFlutter + jitterTremble) * uWindStrength;",
  "  float bend = pow(hRatio, 1.45) * totalWind * 0.65;",
  "  wPos.x += windDir.x * bend * hScale;",
  "  wPos.z += windDir.y * bend * hScale;",
  "  wPos.y -= (bend * bend) * 0.35 * hScale;",
  "  vec2 toCar = wPos.xz - uCarPos.xz;",
  "  float distCar = length(toCar);",
  "  if (distCar < 3.2 && abs(wPos.y - uCarPos.y) < 1.8) {",
  "    float carPush = (1.0 - distCar / 3.2) * hRatio * 0.65;",
  "    vec2 pushDir = normalize(toCar + vec2(1e-4));",
  "    wPos.xz += pushDir * carPush;",
  "    wPos.y -= carPush * 0.45;",
  "  }",
  "  vec2 toBall = wPos.xz - uBallPos.xz;",
  "  float distBall = length(toBall);",
  "  if (distBall < 2.8 && abs(wPos.y - uBallPos.y) < 2.0) {",
  "    float ballPush = (1.0 - distBall / 2.8) * hRatio * 0.70;",
  "    vec2 pushDir = normalize(toBall + vec2(1e-4));",
  "    wPos.xz += pushDir * ballPush;",
  "    wPos.y -= ballPush * 0.50;",
  "  }",
  "  vec3 normalRot = vec3(aBladeNormal.x * cosR - aBladeNormal.z * sinR, aBladeNormal.y, aBladeNormal.x * sinR + aBladeNormal.z * cosR);",
  "  normalRot.x += windDir.x * bend * 0.8;",
  "  normalRot.z += windDir.y * bend * 0.8;",
  "  vN = normalize(normalRot);",
  "  vW = wPos;",
  "  vShadowCoord = uShadowVP * vec4(wPos, 1.0);",
  "  gl_Position = uVP * vec4(wPos, 1.0);",
  "}"
].join("\n");

var FS_GRASS = [
  "#version 300 es",
  "precision highp float;",
  "precision highp sampler2DShadow;",
  "in vec3 vN; in vec3 vW; in vec2 vUV; in vec4 vShadowCoord; in float vHeight; in float vStripe; in vec2 vRootXZ;",
  "uniform vec3 uCam; uniform vec3 uFogCol; uniform float uFog;",
  "uniform float uSun; uniform float uAmb; uniform float uFlood;",
  "uniform float uShadowEnable; uniform float uShadowSoftness;",
  "uniform float uTipCream; uniform float uSubsurface;",
  "uniform vec2 uArenaHalf;",
  "uniform sampler2D uFieldTex;",
  "uniform highp sampler2DShadow uShadowMap;",
  "out vec4 outColor;",
  "const vec3 L_SUN = vec3(0.38, 0.85, -0.36);",
  "float calcShadow(vec4 sc, float NdotL) {",
  "  if (uShadowEnable < 0.5) return 1.0;",
  "  vec3 proj = sc.xyz / sc.w;",
  "  if (proj.x < 0.01 || proj.x > 0.99 || proj.y < 0.01 || proj.y > 0.99 || proj.z > 1.0 || proj.z < 0.0) return 1.0;",
  "  float bias = 0.0018;",
  "  vec2 texel = vec2(1.0 / 1024.0) * max(uShadowSoftness, 0.8);",
  "  float s = 0.0;",
  "  s += texture(uShadowMap, vec3(proj.xy + vec2(-0.8, -0.8) * texel, proj.z - bias));",
  "  s += texture(uShadowMap, vec3(proj.xy + vec2( 0.8, -0.8) * texel, proj.z - bias));",
  "  s += texture(uShadowMap, vec3(proj.xy + vec2(-0.8,  0.8) * texel, proj.z - bias));",
  "  s += texture(uShadowMap, vec3(proj.xy + vec2( 0.8,  0.8) * texel, proj.z - bias));",
  "  return mix(0.50, 1.0, s * 0.25);",
  "}",
  "void main(){",
  "  vec3 N = normalize(vN);",
  "  if (!gl_FrontFacing) N = -N;",
  "  vec2 fieldUV = vec2((vRootXZ.x + uArenaHalf.x) / (2.0 * uArenaHalf.x), (vRootXZ.y + uArenaHalf.y) / (2.0 * uArenaHalf.y));",
  "  vec4 fieldCol = texture(uFieldTex, clamp(fieldUV, 0.0, 1.0));",
  "  float lineWhiteness = min(fieldCol.r, min(fieldCol.g, fieldCol.b));",
  "  float lineLuma = dot(fieldCol.rgb, vec3(0.299, 0.587, 0.114));",
  "  float maxChannel = max(fieldCol.r, max(fieldCol.g, fieldCol.b));",
  "  float lineFactor = max(lineWhiteness * 1.25, (maxChannel > 0.65 && lineLuma > 0.38) ? lineLuma * 1.15 : 0.0);",
  "  float lineMarking = smoothstep(0.36, 0.65, lineFactor);",
  "  vec3 fieldTint = mix(vec3(1.0), fieldCol.rgb * 2.4, 0.38);",
  "  vec3 rootCol = mix(vec3(0.04, 0.16, 0.06), vec3(0.06, 0.22, 0.08), vStripe) * fieldTint;",
  "  vec3 midCol = mix(vec3(0.16, 0.52, 0.18), vec3(0.24, 0.65, 0.26), vStripe) * fieldTint;",
  "  vec3 tipCol = mix(vec3(0.55, 0.78, 0.32), vec3(0.96, 0.92, 0.68), uTipCream) * fieldTint;",
  "  vec3 markCol = (maxChannel > 0.02) ? (fieldCol.rgb / maxChannel) : vec3(1.0);",
  "  vec3 whiteLineRoot = mix(vec3(0.72, 0.76, 0.78), markCol * 0.85, 0.5);",
  "  vec3 whiteLineMid  = mix(vec3(0.95, 0.97, 0.99), markCol, 0.5);",
  "  vec3 whiteLineTip  = vec3(1.0, 1.0, 1.0);",
  "  rootCol = mix(rootCol, whiteLineRoot, lineMarking);",
  "  midCol  = mix(midCol, whiteLineMid, lineMarking);",
  "  tipCol  = mix(tipCol, whiteLineTip, lineMarking);",
  "  vec3 baseColor = (vHeight < 0.55) ? mix(rootCol, midCol, vHeight / 0.55) : mix(midCol, tipCol, (vHeight - 0.55) / 0.45);",
  "  float rootAO = clamp(vHeight * 1.4 + 0.32, 0.35, 1.0);",
  "  vec3 nLSun = normalize(L_SUN);",
  "  float NdotL = max(dot(N, nLSun), 0.0);",
  "  float NdotL_sss = clamp((dot(N, nLSun) + 0.45) / 1.45, 0.0, 1.0);",
  "  float diffuse = mix(NdotL, NdotL_sss, uSubsurface * 0.65);",
  "  float shadow = calcShadow(vShadowCoord, NdotL);",
  "  vec3 sunColor = vec3(1.0, 0.96, 0.88) * uSun;",
  "  vec3 sunLight = sunColor * (diffuse * shadow);",
  "  float hemi = clamp(N.y * 0.5 + 0.5, 0.0, 1.0);",
  "  vec3 skyAmb = vec3(0.28, 0.42, 0.55) * uAmb;",
  "  vec3 groundBounce = vec3(0.08, 0.14, 0.06) * uAmb;",
  "  vec3 ambLight = mix(groundBounce, skyAmb, hemi) * rootAO;",
  "  vec3 V = normalize(uCam - vW);",
  "  vec3 H = normalize(nLSun + V);",
  "  float spec = pow(max(dot(N, H), 0.0), 32.0) * vHeight * 0.45 * shadow;",
  "  vec3 specLight = sunColor * spec;",
  "  vec3 col = baseColor * (ambLight + sunLight) + specLight;",
  "  float dist = length(uCam - vW);",
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
  this.uMain = this.uniforms(this.progMain, [
    "uVP", "uModel", "uNM", "uColor", "uEmissive", "uCam", "uFogCol",
    "uOpacity", "uSpec", "uUseTex", "uFog", "uAlphaTest", "uRim",
    "uFlood", "uSun", "uAmb", "uBump", "uTex",
    "uClearcoat", "uMetallic", "uAO", "uFlakes",
    "uShadowVP", "uShadowMap", "uShadowEnable", "uShadowSoftness",
    "uTime", "uCrowd"
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
  if (mips !== false) gl.generateMipmap(gl.TEXTURE_2D);
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
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.depthMask(true);
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
  crowd: 0.0
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
  // 5-vertex tapered realistic 3D grass blade geometry (3 triangles, 9 indices)
  // Format per vertex: pos(x,y,z), normal(x,y,z), uv(u,v) -> 8 floats
  var bladeVerts = new Float32Array([
    -0.50, 0.0, 0.0,   0.0, 0.35, 0.94,  0.00, 0.0,
     0.50, 0.0, 0.0,   0.0, 0.35, 0.94,  1.00, 0.0,
    -0.32, 0.5, 0.0,   0.0, 0.58, 0.81,  0.15, 0.5,
     0.32, 0.5, 0.0,   0.0, 0.58, 0.81,  0.85, 0.5,
     0.00, 1.0, 0.0,   0.0, 0.85, 0.52,  0.50, 1.0
  ]);
  var bladeIndices = new Uint16Array([
    0, 1, 2,
    1, 3, 2,
    2, 3, 4
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

  // Instanced Buffer: posRot (vec4: x,y,z,rot) + scale (vec3: wScale, hScale, clump) = 7 floats = 28 bytes per instance
  var instBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, instBuffer);

  // aInstPosRot (location 3)
  gl.enableVertexAttribArray(3);
  gl.vertexAttribPointer(3, 4, gl.FLOAT, false, 28, 0);
  gl.vertexAttribDivisor(3, 1);

  // aInstScale (location 4)
  gl.enableVertexAttribArray(4);
  gl.vertexAttribPointer(4, 3, gl.FLOAT, false, 28, 16);
  gl.vertexAttribDivisor(4, 1);

  gl.bindVertexArray(null);

  this.grassVAO = vao;
  this.grassInstBuffer = instBuffer;
  this.grassCount = 0;
  var initialCount = (CFG.gfx && CFG.gfx.grassBladeCount) || 150000;
  this.generateGrassInstances(initialCount);
};
Renderer.prototype.generateGrassInstances = function (count) {
  var gl = this.gl;
  count = Math.max(5000, Math.min(count || 150000, 5000000));
  var data = new Float32Array(count * 7);
  var halfW = 38.2;
  var halfL = 47.8;
  var cornerR = 7.5;
  var idx = 0;

  // Stratified Poisson-like random distribution across pitch
  for (var i = 0; i < count; i++) {
    var rx = (Math.random() * 2 - 1) * halfW;
    var rz = (Math.random() * 2 - 1) * halfL;

    // Soft round corners
    var cx = Math.abs(rx) - (halfW - cornerR);
    var cz = Math.abs(rz) - (halfL - cornerR);
    if (cx > 0 && cz > 0 && Math.sqrt(cx * cx + cz * cz) > cornerR) {
      // Re-sample within bounds
      rx *= 0.88;
      rz *= 0.88;
    }

    var rot = Math.random() * Math.PI * 2;
    var wScale = 0.80 + Math.random() * 0.40;
    var hScale = 0.75 + Math.random() * 0.50;
    var clump = Math.random();

    // Position (x, y, z, rot)
    data[idx++] = rx;
    data[idx++] = 0.012; // Resting exactly on the turf surface
    data[idx++] = rz;
    data[idx++] = rot;

    // Scale (w, h, clump)
    data[idx++] = wScale;
    data[idx++] = hScale;
    data[idx++] = clump;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, this.grassInstBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  this.grassCount = count;
  this.lastGrassCount = count;
};
Renderer.prototype.drawGrass = function (arena, cars, ball) {
  var gfx = CFG.gfx || {};
  if (gfx.grassEnabled === false) return;
  if (!this.progGrass || !this.grassVAO || this.grassCount <= 0) return;

  var targetCount = gfx.grassBladeCount || 150000;
  if (gfx.grassDensity === "HYPER_DENSE" || gfx.grassDensity === "HYPER") targetCount = 5000000;
  else if (gfx.grassDensity === "CINEMATIC_MAX" || gfx.grassDensity === "MAX") targetCount = 3000000;
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
  var carPos = (cars && cars[0] && cars[0].pos) ? cars[0].pos : _vPos.set(999, 999, 999);
  gl.uniform3f(u.uCarPos, carPos.x, carPos.y, carPos.z);
  var ballPos = (ball && ball.pos) ? ball.pos : _vPos.set(999, 999, 999);
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

  gl.bindVertexArray(this.grassVAO);
  gl.drawElementsInstanced(gl.TRIANGLES, 9, gl.UNSIGNED_SHORT, 0, this.grassCount);
  this.drawCalls++;

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
  var sunDir = tv(0.38, 0.85, -0.36).norm();
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
  gl.clear(gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.depthMask(true);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);

  gl.useProgram(this.progShadow);
  this.curProg = this.progShadow;
  gl.uniformMatrix4fv(this.uShadow.uLightVP, false, this.lightVP);
  this.curVAO = null;

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
  // SLEEK CYBER-GRID BOOST PADS
  // ==========================================
  // 1. Small Boost Pad (12% Pad): Elevated Hex bevel pedestal + floating rotating diamond energy core
  var psBase = new Builder();
  psBase.polyDisc(1.22, 6, 0.24, 1, 1);
  for (var hxi = 0; hxi < 6; hxi++) {
    var ha0 = (hxi / 6) * TAU, ha1 = ((hxi + 1) / 6) * TAU;
    var hmx = (Math.cos(ha0) + Math.cos(ha1)) * 0.5 * 1.10;
    var hmz = (Math.sin(ha0) + Math.sin(ha1)) * 0.5 * 1.10;
    psBase.box(0.10, 0.24, 0.60, new V3(hmx, 0.12, hmz), new Quat().fromAxisAngle(0, 1, 0, ha0 + PI / 6), 0.8);
  }
  var padSmallBase = R.mesh(psBase);

  // Floating Small Boost Diamond Crystal Core
  var psCore = new Builder();
  psCore.cylinder(0.28, 0.02, 0.52, 6, new V3(0, 0.26, 0), null, true, true);
  psCore.cylinder(0.02, 0.28, 0.52, 6, new V3(0, -0.26, 0), null, true, true);
  var padSmallCore = R.mesh(psCore);

  // 2. Big Boost Pad (100% Full Pill): Heavy 6-pylon launcher base + floating energy orb + dual orbital gimbal rings
  var pbBase = new Builder();
  pbBase.polyDisc(2.5, 6, 0.32, 1, 1);
  for (var bp = 0; bp < 6; bp++) {
    var bpa = (bp / 6) * TAU;
    var bx = Math.cos(bpa) * 2.2, bz = Math.sin(bpa) * 2.2;
    pbBase.box(0.26, 0.70, 0.26, new V3(bx, 0.38, bz), null, 0.8);
    pbBase.box(0.18, 0.55, 0.18, new V3(bx * 0.82, 0.60, bz * 0.82), new Quat().fromAxisAngle(bz, 0, -bx, 0.35), 0.8);
  }
  pbBase.polyDisc(1.5, 16, 0.38, 1, 1);
  var padBigBase = R.mesh(pbBase);

  // Big Boost Floating Energy Core (Faceted power sphere)
  var pbOrb = new Builder();
  pbOrb.sphere(0.46, 16, 12);
  var padBigOrb = R.mesh(pbOrb);

  // Big Boost Orbital Gimbal Ring
  var pbRing = new Builder();
  var rSegs = 20;
  for (var rs = 0; rs < rSegs; rs++) {
    var ra0 = (rs / rSegs) * TAU, ra1 = ((rs + 1) / rSegs) * TAU;
    var rMidX = (Math.cos(ra0) + Math.cos(ra1)) * 0.5 * 0.80;
    var rMidZ = (Math.sin(ra0) + Math.sin(ra1)) * 0.5 * 0.80;
    var segLen = 0.80 * (TAU / rSegs) * 1.05;
    pbRing.box(0.045, 0.045, segLen, new V3(rMidX, 0, rMidZ), new Quat().fromAxisAngle(0, 1, 0, ra0 + PI / rSegs), 1.0);
  }
  var padBigRing = R.mesh(pbRing);

  var kb = new Builder();
  kb.polyDisc(0.9, 24, 0.008, 1, 1);
  var ring = R.mesh(kb);

  return {
    body: bodyMesh, accent: accentMesh, glass: glassMesh, lights: lightsMesh, thruster: thrusterMesh,
    wheel: wheelMesh, hub: hubMesh,
    ball: ballMesh, shadow: shadowMesh,
    padSmall: padSmallBase, padSmallBase: padSmallBase, padSmallCore: padSmallCore,
    padBig: padBigBase, padBigBase: padBigBase, padBigOrb: padBigOrb, padBigRing: padBigRing,
    ring: ring
  };
}

Renderer.prototype.initTextures = function (arena) {
  var activeTheme = (CFG.gfx && CFG.gfx.stadiumTheme) || "NEON_CHAMPIONSHIP";
  var activeBallType = (CFG.gfx && CFG.gfx.ballType) || "soccer";
  if (!this.initializedTextures) {
    this.currentStadiumTheme = activeTheme;
    this.currentBallType = activeBallType;
    this.texField = this.texture(texField(arena, activeTheme), false, true);
    this.texPanel = this.texture(texPanel(), true, true);
    this.texNet = this.texture(texNet(), true, true);
    this.texNetWall = this.texture(texNetWall(), true, true);
    this.texSky = this.texture(texSky(), false, true);
    this.texBoostGlow = this.texture(texBoostGlow(), false, true);
    this.texBall = this.texture(texBall(activeBallType), false, true);
    this.texBlob = this.texture(texBlob(), false, true);
    this.texSpark = this.texture(texSpark(), false, true);
    this.texCrowd = this.texture(texCrowd(), true, true);
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
    }
    if (this.currentBallType !== activeBallType) {
      this.currentBallType = activeBallType;
      if (this.texBall) gl.deleteTexture(this.texBall);
      this.texBall = this.texture(texBall(activeBallType), false, true);
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

  // 1. Panoramic Sky Dome (Vibrant Daytime Sky, Sun & Fluffy Clouds)
  if (meshes.skyDome) {
    this.draw(meshes.skyDome, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      tex: this.texSky,
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

  // 4. Floodlight Truss Towers (6 towers: 4 corners + 2 center long sides)
  if (meshes.trusses) {
    this.draw(meshes.trusses, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      color: [0.45, 0.50, 0.58],
      emissive: [0.12, 0.14, 0.18],
      spec: 0.65,
      rim: 0.25
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

  // 6. Perimeter Ad Boards (LED Sponsor Panels)
  if (meshes.adBoards) {
    this.draw(meshes.adBoards, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      tex: this.texAdBoard,
      emissive: [0.70, 0.75, 0.85],
      spec: 0.6,
      rim: 0.15
    });
  }

  // 7. Upper Tier LED Ribbons
  if (meshes.ribbons) {
    this.draw(meshes.ribbons, _vPos.set(0, 0, 0), _qIdentity, _vOne, {
      tex: this.texRibbon,
      emissive: [0.80, 0.85, 1.0],
      spec: 0.5
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
      color: teamCol,
      emissive: [teamCol[0] * 0.75, teamCol[1] * 0.75, teamCol[2] * 0.75],
      spec: 0.85,
      rim: 0.50
    });
  }
};

Renderer.prototype.drawArenaNet = function (meshes) {
  if (!meshes) return;
  var flInt = (CFG.gfx && CFG.gfx.floodlightIntensity !== undefined) ? CFG.gfx.floodlightIntensity : 0.20;

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
};

Renderer.prototype.drawBoostPads = function (props, pads) {
  var perfMode = (CFG.gfx && CFG.gfx.perfMode) || "BALANCED";
  var isUltraFast = perfMode === "ULTRA";

  for (var i = 0; i < pads.length; i++) {
    var p = pads[i];
    var isBig = p.big;
    var active = p.active;

    if (isBig) {
      // 1. Heavy Launcher Base Pad (Elevated prominently above grass)
      var bigBaseMesh = props.padBigBase || props.padBig;
      var bBasePos = _vPos.set(p.pos.x, p.pos.y + 0.18, p.pos.z);
      this.draw(bigBaseMesh, bBasePos, _qIdentity, _vOne, {
        color: active ? [0.28, 0.30, 0.36] : [0.15, 0.16, 0.18],
        emissive: active ? [0.35, 0.22, 0.04] : [0.03, 0.03, 0.03],
        spec: active ? 0.7 : 0.2
      });

      if (active) {
        var bobY = p.pos.y + 1.55 + Math.sin(p.anim * 2.5) * 0.08;
        _vScratch1.set(p.pos.x, bobY, p.pos.z);

        // 2. Spinning Energy Core Orb
        if (props.padBigOrb) {
          _qTemp.fromAxisAngle(0, 1, 0, p.anim * 1.8);
          this.draw(props.padBigOrb, _vScratch1, _qTemp, _vOne, {
            color: [1.0, 0.88, 0.25],
            emissive: [1.8, 1.35, 0.3],
            spec: 1.0,
            rim: 0.8
          });
        }

        // 3. Inclined Orbital Gimbal Rings
        if (props.padBigRing && !isUltraFast) {
          _qScratch1.fromAxisAngle(0.6, 1, 0.2, p.anim * 2.2);
          this.draw(props.padBigRing, _vScratch1, _qScratch1, _vOne, {
            color: [1.0, 0.92, 0.45],
            emissive: [1.5, 1.1, 0.2],
            spec: 0.9
          });

          // 4. Counter-rotating Orbital Gimbal Ring 2
          _qScratch2.fromAxisAngle(-0.6, 1, -0.2, -p.anim * 1.6);
          _vScale.set(1.18, 1.18, 1.18);
          this.draw(props.padBigRing, _vScratch1, _qScratch2, _vScale, {
            color: [1.0, 0.78, 0.15],
            emissive: [1.2, 0.85, 0.15],
            spec: 0.9
          });
        }

        // 5. Floor Pulse Rune (Hovering above grass on launcher deck)
        var rScale = 2.45 + Math.sin(p.anim * 3.0) * 0.12;
        _vScale.set(rScale, 1, rScale);
        this.draw(props.ring, _vPos.set(p.pos.x, p.pos.y + 0.32, p.pos.z), _qIdentity, _vScale, {
          tex: this.texBoostGlow,
          color: [1.0, 0.85, 0.25],
          emissive: [1.2, 0.9, 0.2],
          blend: "add",
          opacity: 0.85 + Math.sin(p.anim * 3) * 0.15
        });
      }
    } else {
      // Small Boost Pad
      // 1. Chamfered Hex Plate on Turf (Elevated above grass)
      var smallBaseMesh = props.padSmallBase || props.padSmall;
      var sBasePos = _vPos.set(p.pos.x, p.pos.y + 0.14, p.pos.z);
      this.draw(smallBaseMesh, sBasePos, _qIdentity, _vOne, {
        color: active ? [0.25, 0.27, 0.32] : [0.14, 0.15, 0.17],
        emissive: active ? [0.22, 0.15, 0.02] : [0.02, 0.02, 0.02],
        spec: active ? 0.6 : 0.15
      });

      if (active) {
        var sBobY = p.pos.y + 0.85 + Math.sin(p.anim * 3.2) * 0.045;
        _vScratch1.set(p.pos.x, sBobY, p.pos.z);

        // 2. Floating Rotating Diamond Crystal
        if (props.padSmallCore) {
          _qTemp.fromAxisAngle(0, 1, 0, p.anim * 2.0);
          this.draw(props.padSmallCore, _vScratch1, _qTemp, _vOne, {
            color: [1.0, 0.85, 0.2],
            emissive: [1.6, 1.2, 0.25],
            spec: 1.0,
            rim: 0.7
          });
        }

        // 3. Ground Glow Ring
        var sScale = 1.35 + Math.sin(p.anim * 2.5) * 0.08;
        _vScale.set(sScale, 1, sScale);
        this.draw(props.ring, _vPos.set(p.pos.x, p.pos.y + 0.25, p.pos.z), _qIdentity, _vScale, {
          tex: this.texBoostGlow,
          color: [1.0, 0.82, 0.2],
          emissive: [1.0, 0.75, 0.15],
          blend: "add",
          opacity: 0.75 + Math.sin(p.anim * 2.5) * 0.15
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
  var carDrawPos = _vScratch2.set(B.pos.x + B.up.x * upOffset, B.pos.y + B.up.y * upOffset, B.pos.z + B.up.z * upOffset);

  _vScale.set(CAR_SCALE, CAR_SCALE, CAR_SCALE);

  // 1. Main Body Shell (Vibrant automotive lacquer + high-gloss clearcoat + metallic flakes + AO)
  var carGloss = (CFG.gfx && CFG.gfx.carGloss !== undefined) ? CFG.gfx.carGloss : 0.95;
  var carClearcoat = (CFG.gfx && CFG.gfx.carClearcoat !== undefined) ? CFG.gfx.carClearcoat : 0.85;
  var carMetallic = (CFG.gfx && CFG.gfx.carMetallic !== undefined) ? CFG.gfx.carMetallic : 0.50;
  var carFlakes = (CFG.gfx && CFG.gfx.carFlakes !== undefined) ? CFG.gfx.carFlakes : 0.80;
  var carAO = (CFG.gfx && CFG.gfx.carAmbientOcclusion !== undefined) ? CFG.gfx.carAmbientOcclusion : 0.80;

  this.draw(props.body, carDrawPos, B.quat, _vScale, {
    color: col,
    spec: carGloss,
    clearcoat: carClearcoat,
    metallic: carMetallic,
    flakes: carFlakes,
    ao: carAO,
    rim: 0.35
  });

  // 3. Trim / Accent & Roll Cage & Engine (Titanium/Carbon with AO)
  if (boostActive) {
    _trimEmissive[0] = col[0] * 0.9;
    _trimEmissive[1] = col[1] * 0.9;
    _trimEmissive[2] = col[2] * 0.9;
  } else {
    _trimEmissive[0] = 0.08;
    _trimEmissive[1] = 0.08;
    _trimEmissive[2] = 0.10;
  }
  this.draw(props.accent, carDrawPos, B.quat, _vScale, {
    color: [0.15, 0.16, 0.19],
    emissive: _trimEmissive,
    spec: carGloss * 0.9,
    clearcoat: carClearcoat * 0.5,
    ao: carAO,
    rim: 0.25
  });

  // 4. Glass cockpit (Dark tinted racing canopy)
  this.draw(props.glass, carDrawPos, B.quat, _vScale, {
    color: [0.04, 0.07, 0.12],
    emissive: [0.02, 0.03, 0.05],
    spec: 0.98,
    clearcoat: 1.0,
    rim: 0.85
  });

  // 5. Glowing Headlights & Taillights
  if (props.lights) {
    this.draw(props.lights, carDrawPos, B.quat, _vScale, {
      color: [1.0, 1.0, 1.0],
      emissive: [1.8, 1.9, 2.1],
      spec: 1.0
    });
  }

  // 6. Rocket Thruster Exhaust Core (Intense glow on Boost!)
  if (props.thruster) {
    var thrusterEmissive = boostActive
      ? [2.8, 1.4, 0.3]
      : [0.35, 0.18, 0.04];
    this.draw(props.thruster, carDrawPos, B.quat, _vScale, {
      color: boostActive ? [1.0, 0.8, 0.2] : [0.4, 0.2, 0.1],
      emissive: thrusterEmissive,
      spec: 1.0
    });
  }

  // 7. Four Wheels & Rims (Zero heap allocation in wheel loop)
  for (var w = 0; w < 4; w++) {
    var wheel = car.wheels[w];
    var curR = (wheel && wheel.radius) ? wheel.radius : V.wheel.radius;
    _wheelScale.set(CAR_SCALE * curR, CAR_SCALE * curR, CAR_SCALE * curR);
    var relX = (wheel.center.x - B.pos.x) * CAR_SCALE;
    var relY = (wheel.center.y - B.pos.y) * CAR_SCALE;
    var relZ = (wheel.center.z - B.pos.z) * CAR_SCALE;
    _vScratch1.set(carDrawPos.x + relX, carDrawPos.y + relY, carDrawPos.z + relZ);

    // Rotate wheel around steer (Y) and rolling spin (X)
    _qScratch1.fromAxisAngle(0, 1, 0, wheel.steer);
    _qScratch2.fromAxisAngle(1, 0, 0, wheel.spin);
    _qScratch3.mul(B.quat, _qScratch1).mul(_qScratch3, _qScratch2);

    this.draw(props.wheel, _vScratch1, _qScratch3, _wheelScale, {
      color: [0.10, 0.10, 0.12],
      spec: 0.30,
      ao: 0.95
    });

    this.draw(props.hub, _vScratch1, _qScratch3, _wheelScale, {
      color: col,
      emissive: [col[0] * 0.25, col[1] * 0.25, col[2] * 0.25],
      spec: 0.95,
      clearcoat: 0.85,
      metallic: 0.80,
      rim: 0.45
    });
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
