/* ===== OCEAN BACKGROUND ===== */
(function initOcean() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  const bubbles = [];
  const plankton = [];

  function newBubble(fromBottom) {
    return {
      x: Math.random() * w,
      y: fromBottom ? h + 20 : Math.random() * h,
      r: Math.random() * 2.5 + 0.7,
      vy: -(Math.random() * 0.42 + 0.12),
      wobble: Math.random() * Math.PI * 2,
      ws: Math.random() * 0.02 + 0.008,
      wa: Math.random() * 0.4 + 0.12,
      o: Math.random() * 0.38 + 0.14,
    };
  }

  function newPlankton() {
    const roll = Math.random();
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.0 + 0.3,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.1,
      phase: Math.random() * Math.PI * 2,
      rgb: roll > 0.55 ? '65,155,255' : roll > 0.3 ? '105,75,240' : '25,195,215',
      bo: Math.random() * 0.38 + 0.08,
    };
  }

  function init() {
    bubbles.length = 0;
    plankton.length = 0;
    for (let i = 0; i < 65; i++) bubbles.push(newBubble(false));
    for (let i = 0; i < 55; i++) plankton.push(newPlankton());
  }

  let t = 0;

  function loop() {
    t++;
    ctx.clearRect(0, 0, w, h);

    // Subtle crepuscular light rays from above
    for (let i = 0; i < 7; i++) {
      const cx = w * ((i + 0.5) / 7) + Math.sin(t * 0.00035 + i * 1.25) * 55;
      const sw = w * 0.048 + Math.sin(t * 0.00028 + i * 0.9) * 11;
      const alpha = 0.022 + Math.sin(t * 0.0005 + i) * 0.01;
      const g = ctx.createLinearGradient(cx, 0, cx, h * 0.72);
      g.addColorStop(0, `rgba(55,135,225,${alpha})`);
      g.addColorStop(1, 'rgba(55,135,225,0)');
      ctx.beginPath();
      ctx.moveTo(cx - sw, 0);
      ctx.lineTo(cx + sw, 0);
      ctx.lineTo(cx + sw * 3, h * 0.72);
      ctx.lineTo(cx - sw * 3, h * 0.72);
      ctx.closePath();
      ctx.fillStyle = g;
      ctx.fill();
    }

    // Rising bubbles
    for (const b of bubbles) {
      b.wobble += b.ws;
      b.x += Math.sin(b.wobble) * b.wa;
      b.y += b.vy;
      if (b.y < -12) Object.assign(b, newBubble(true));

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(140,210,255,${b.o})`;
      ctx.lineWidth = 1.0;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(b.x - b.r * 0.27, b.y - b.r * 0.3, b.r * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(215,242,255,${b.o * 0.85})`;
      ctx.fill();
    }

    // Bioluminescent plankton
    ctx.save();
    for (const p of plankton) {
      p.x = (p.x + p.vx + w) % w;
      p.y = (p.y + p.vy + h) % h;
      const a = p.bo * (0.42 + 0.58 * Math.sin(t * 0.013 + p.phase));
      ctx.shadowBlur = 5;
      ctx.shadowColor = `rgba(${p.rgb},0.85)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.rgb},${a})`;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.restore();

    requestAnimationFrame(loop);
  }

  resize();
  init();
  loop();
  window.addEventListener('resize', () => { resize(); init(); });
})();


/* ===== WORD ROTATION ===== */
(function initWords() {
  const el = document.getElementById('rotatingWord');
  if (!el) return;
  const words = ['scientists', 'athletes', 'artists', 'educators', 'musicians', 'creators', 'visionaries', 'philosophers', 'inspiring projects'];
  let i = 0;

  setInterval(() => {
    el.classList.add('out');
    setTimeout(() => {
      i = (i + 1) % words.length;
      el.textContent = words[i];
      el.classList.remove('out');
    }, 270);
  }, 2800);
})();


/* ===== SCROLL REVEAL ===== */
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-item');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('v'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
})();


/* ===== NAVBAR ===== */
(function initNav() {
  const nav    = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  if (!toggle || !links) return;

  function closeMenu() {
    links.classList.remove('open');
    const s = toggle.querySelectorAll('span');
    s[0].style.transform = '';
    s[1].style.opacity   = '';
    s[2].style.transform = '';
  }

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    const s = toggle.querySelectorAll('span');
    if (open) {
      s[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      s[1].style.opacity   = '0';
      s[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      closeMenu();
    }
  });

  links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
})();


/* ===== FAQ ACCORDION ===== */
(function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const open   = btn.getAttribute('aria-expanded') === 'true';

      document.querySelectorAll('.faq-q').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });

      if (!open) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });
})();


/* ===== JELLYFISH CURSOR ===== */
(function initJellyfish() {
  if ('ontouchstart' in window) return;

  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  if (dot)  dot.style.display  = 'none';
  if (ring) ring.style.display = 'none';
  document.body.style.cursor = 'none';

  const cv = document.createElement('canvas');
  cv.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9999;';
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');

  function resize() { cv.width = window.innerWidth; cv.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let jx = mx, jy = my;
  let ang = -Math.PI / 2; // starts facing up
  let hovering = false;
  let glowCard = false;
  let glowT = 0;
  let t = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  document.querySelectorAll('a, button, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => hovering = true);
    el.addEventListener('mouseleave', () => hovering = false);
  });

  const glowCardEl = document.getElementById('glowCard');
  if (glowCardEl) {
    glowCardEl.addEventListener('mouseenter', () => { glowCard = true; });
    glowCardEl.addEventListener('mouseleave', () => { glowCard = false; });
  }

  const BW = 20; // bell half-width
  const BH = 13; // bell height
  const NT = 8;  // tentacle count

  function lerp3(r1, g1, b1, r2, g2, b2, t) {
    return `${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(b1 + (b2 - b1) * t)}`;
  }

  function drawJelly(x, y, pulse) {
    const sc = hovering ? 1.35 : 1;
    const bw = BW * sc * (1 + pulse * 0.1);
    const bh = BH * sc * (1 - pulse * 0.05);
    const bob = Math.sin(t * 0.038) * 1.4;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    ctx.translate(bob, 0); // perpendicular drift relative to swimming direction

    // Pulsing outer ring when glowing for Glowy card
    if (glowT > 0) {
      const ringPulse = (Math.sin(t * 0.06) * 0.5 + 0.5) * glowT;
      const ring = ctx.createRadialGradient(0, bh * 0.5, 0, 0, bh * 0.5, bw * 5.5);
      ring.addColorStop(0,    `rgba(6,182,212,${0.18 * ringPulse})`);
      ring.addColorStop(0.45, `rgba(6,182,212,${0.10 * ringPulse})`);
      ring.addColorStop(1,    'rgba(6,182,212,0)');
      ctx.beginPath();
      ctx.ellipse(0, bh * 0.5, bw * 5, bh * 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = ring;
      ctx.fill();
    }

    // Outer bioluminescent halo
    const haloAlpha = (hovering ? 0.26 : 0.17) + glowT * 0.38;
    const haloC1 = lerp3(80, 150, 255,  6, 182, 212, glowT);
    const haloC2 = lerp3(100, 80, 255,  6, 182, 212, glowT);
    const halo = ctx.createRadialGradient(0, 0, 0, 0, bh * 0.5, bw * 3.0);
    halo.addColorStop(0,   `rgba(${haloC1},${haloAlpha})`);
    halo.addColorStop(0.5, `rgba(${haloC2},${haloAlpha * 0.38})`);
    halo.addColorStop(1,   `rgba(${haloC1},0)`);
    ctx.beginPath();
    ctx.ellipse(0, bh * 0.5, bw * 2.5, bh * 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = halo;
    ctx.fill();

    // Tentacles trailing behind the bell
    for (let i = 0; i < NT; i++) {
      const f = i / (NT - 1);
      const tx = (f - 0.5) * bw * 1.7;
      const len = 25 + Math.sin(i * 2.0) * 7;
      ctx.beginPath();
      ctx.moveTo(tx, bh * 0.5);
      for (let s = 1; s <= 12; s++) {
        const sy = bh * 0.5 + len * s / 12;
        const sx = tx + Math.sin(t * 0.044 + i * 0.88 + s * 0.37) * (2 + pulse * 1.8);
        ctx.lineTo(sx, sy);
      }
      const baseTA = 0.16 + glowT * 0.29;
      const a = (baseTA + 0.12 * Math.sin(t * 0.028 + i * 0.65)) * sc;
      const tC = lerp3(100, 185, 255, 6, 182, 212, glowT);
      ctx.strokeStyle = `rgba(${tC},${a})`;
      ctx.lineWidth = 0.7 + glowT * 0.4;
      ctx.stroke();
    }

    // Bell body
    ctx.beginPath();
    ctx.moveTo(-bw, 0);
    ctx.bezierCurveTo(-bw, -bh * 1.8, bw, -bh * 1.8, bw, 0);
    ctx.bezierCurveTo(bw * 0.75, bh * 0.52, -bw * 0.75, bh * 0.52, -bw, 0);
    ctx.closePath();

    const bg = ctx.createRadialGradient(-bw * 0.17, -bh * 0.42, 0, 0, -bh * 0.12, bw * 1.12);
    bg.addColorStop(0,    `rgba(${lerp3(215,232,255, 220,255,255, glowT)},${0.8 + glowT * 0.12})`);
    bg.addColorStop(0.28, `rgba(${lerp3(105,158,255,   6,182,212, glowT)},${0.6 + glowT * 0.15})`);
    bg.addColorStop(0.62, `rgba(${lerp3( 78,105,228,   0,140,160, glowT)},${0.38 + glowT * 0.07})`);
    bg.addColorStop(1,    `rgba(${lerp3( 55, 78,195,   0,100,120, glowT)},0.1)`);
    ctx.fillStyle = bg;
    ctx.fill();

    // Rim glow
    ctx.beginPath();
    ctx.ellipse(0, 0, bw, bh * 0.19, 0, 0, Math.PI * 2);
    const rimAlpha = (hovering ? 0.38 : 0.25) + glowT * 0.32;
    const rimC = lerp3(145, 215, 255, 180, 255, 255, glowT);
    ctx.fillStyle = `rgba(${rimC},${rimAlpha})`;
    ctx.fill();

    // Radial canals (inner detail)
    ctx.save();
    ctx.globalAlpha = 0.4 + glowT * 0.25;
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, -bh * 0.07);
      ctx.quadraticCurveTo(
        Math.cos(a) * bw * 0.3,  Math.sin(a) * bh * 0.3  - bh * 0.27,
        Math.cos(a) * bw * 0.44, Math.sin(a) * bh * 0.44 - bh * 0.44
      );
      const cC = lerp3(165, 220, 255, 180, 255, 255, glowT);
      ctx.strokeStyle = `rgba(${cC},0.5)`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
    ctx.restore();

    ctx.restore();
  }

  function drawCursorDot(x, y) {
    ctx.save();
    ctx.shadowBlur = 14;
    ctx.shadowColor = 'rgba(210,235,255,0.9)';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(240,250,255,0.96)';
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  function loop() {
    t++;
    glowT += (glowCard ? 1 : -1) * 0.05;
    glowT = Math.max(0, Math.min(1, glowT));
    ctx.clearRect(0, 0, cv.width, cv.height);

    // Rotate toward the white dot first (using current center position)
    const dx = mx - jx, dy = my - jy;
    if (Math.sqrt(dx * dx + dy * dy) > 2) {
      let target = Math.atan2(dy, dx) + Math.PI / 2;
      let diff = target - ang;
      while (diff > Math.PI)  diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      ang += diff * 0.08;
    }

    // Chase so the bell apex lands on the white dot, not the center
    const APEX = BH * 1.8;
    const targetX = mx - APEX * Math.sin(ang);
    const targetY = my + APEX * Math.cos(ang);
    jx += (targetX - jx) * 0.09;
    jy += (targetY - jy) * 0.09;

    const pulse = Math.sin(t * 0.054) * 0.5 + 0.5;
    drawJelly(jx, jy, pulse);
    drawCursorDot(mx, my);

    requestAnimationFrame(loop);
  }

  loop();
})();


/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
