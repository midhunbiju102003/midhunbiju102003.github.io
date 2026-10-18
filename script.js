/**
 * Midhun Biju Portfolio — Dala Interactive Engine
 * Signature Constellation Brain Visualization & Ambient Triangles
 */

(function () {
  'use strict';

  const COLOR_PALETTE = [
    '#8052ff', // Electric Iris (violet)
    '#ffb829', // Saffron Spark (amber)
    '#15846e', // Deep Verdant (teal)
    '#e040fb', // Vivid Magenta
    '#38bdf8', // Electric Sky Blue
    '#a855f7'  // Purple
  ];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. HERO CONSTELLATION VISUALIZATION (Organic Brain Particle Cloud)
     ========================================================================== */
  const constellationCanvas = document.getElementById('constellation-canvas');

  if (constellationCanvas) {
    const ctx = constellationCanvas.getContext('2d');
    let width = (constellationCanvas.width = 600);
    let height = (constellationCanvas.height = 600);

    const PARTICLE_COUNT = 520;
    const AMBIENT_HERO_COUNT = 90;
    const particles = [];
    const ambientHero = [];

    let rotX = 0.2;
    let rotY = 0;
    let targetRotX = 0.2;
    let targetRotY = 0;
    let isHovering = false;
    let mouseX = 0;
    let mouseY = 0;

    // Responsive canvas resolution
    function resizeConstellation() {
      const rect = constellationCanvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width * dpr;
      height = rect.height * dpr;
      constellationCanvas.width = width;
      constellationCanvas.height = height;
    }

    // Helper: Draw tiny sharp-edged outlined triangle
    function drawTriangle(context, x, y, size, angle, strokeColor, alpha) {
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      context.strokeStyle = strokeColor;
      context.globalAlpha = Math.max(0, Math.min(1, alpha));
      context.lineWidth = 1.2;

      context.beginPath();
      const r = size;
      context.moveTo(0, -r);
      context.lineTo(r * 0.866, r * 0.5);
      context.lineTo(-r * 0.866, r * 0.5);
      context.closePath();
      context.stroke();
      context.restore();
    }

    // Generate dual-hemisphere neural brain coordinates
    function createBrainParticles() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Choose hemisphere (-1 for left, +1 for right)
        const side = Math.random() > 0.5 ? 1 : -1;

        // Spherical parametric distribution sculpted into brain lobes
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);

        // Hemisphere ellipsoid scale
        let rx = 110 + Math.sin(phi * 3) * 15;
        let ry = 95 + Math.cos(theta * 2) * 12;
        let rz = 130 + Math.sin(theta * 4) * 10;

        // Hemispheric cleft separation
        let x = (Math.sin(phi) * Math.cos(theta) * rx) * 0.85 + side * 42;
        let y = Math.sin(phi) * Math.sin(theta) * ry * 0.95;
        let z = Math.cos(phi) * rz;

        // Brain convolutions / folds
        const fold = Math.sin(x * 0.05) * Math.cos(y * 0.05) * Math.sin(z * 0.05);
        x += fold * 12;
        y += fold * 12;
        z += fold * 12;

        particles.push({
          baseX: x,
          baseY: y,
          baseZ: z,
          x,
          y,
          z,
          size: 2.2 + Math.random() * 3.2,
          angle: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.03,
          color: COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)],
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03
        });
      }

      // Precompute 2 nearest 3D neighbours per particle (static neural mesh)
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        let b1 = -1, b2 = -1, d1 = Infinity, d2 = Infinity;
        for (let m = 0; m < particles.length; m++) {
          if (m === i) continue;
          const q = particles[m];
          const d = (a.baseX - q.baseX) ** 2 + (a.baseY - q.baseY) ** 2 + (a.baseZ - q.baseZ) ** 2;
          if (d < d1) { d2 = d1; b2 = b1; d1 = d; b1 = m; } else if (d < d2) { d2 = d; b2 = m; }
        }
        a.nb = [b1, b2];
      }

      // Ambient particles floating around the brain cloud
      ambientHero.length = 0;
      for (let i = 0; i < AMBIENT_HERO_COUNT; i++) {
        const radius = 170 + Math.random() * 120;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        ambientHero.push({
          x: radius * Math.sin(phi) * Math.cos(theta),
          y: radius * Math.sin(phi) * Math.sin(theta) * 0.8,
          z: radius * Math.cos(phi),
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          vz: (Math.random() - 0.5) * 0.25,
          size: 2 + Math.random() * 2.5,
          angle: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.02,
          color: COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)],
          alpha: 0.25 + Math.random() * 0.4
        });
      }
    }

    // Pointer: hover tilt (mouse), drag-to-rotate (touch/pen/mouse), click = pulse wave
    let dragging = false, lastX = 0, moved = 0, pulse = 0, heroVisible = true;
    constellationCanvas.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; moved = 0; });
    window.addEventListener('pointerup', (e) => {
      if (dragging && moved < 5) pulse = 0.001;
      dragging = false;
      if (e.pointerType !== 'mouse') { isHovering = false; targetRotX = 0.2; }
    });
    window.addEventListener('pointercancel', () => { dragging = false; isHovering = false; });
    constellationCanvas.addEventListener('pointermove', (e) => {
      if (dragging) {
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        moved += Math.abs(dx);
        targetRotY += dx * 0.01;
        isHovering = true;
        return;
      }
      if (e.pointerType !== 'mouse') return;
      const rect = constellationCanvas.getBoundingClientRect();
      targetRotY = ((e.clientX - rect.left) / rect.width - 0.5) * 1.5;
      targetRotX = -((e.clientY - rect.top) / rect.height - 0.5) * 1.2 + 0.2;
      isHovering = true;
    });
    constellationCanvas.addEventListener('pointerleave', () => {
      if (!dragging) { isHovering = false; targetRotX = 0.2; }
    });

    let frameCount = 0;

    function renderConstellation() {
      ctx.clearRect(0, 0, width, height);

      // Smooth camera rotation
      if (!isHovering) {
        targetRotY += 0.0035;
      }
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      const fov = 420;
      const k = Math.min(width, height) / 600; // keeps brain proportional at any canvas size / DPR
      const centerX = width / 2;
      const centerY = height / 2;

      frameCount++;
      if (pulse > 0) { pulse += 0.02; if (pulse > 1.4) pulse = 0; }

      // Transform and project brain particles
      const projected = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Subtle biological breathing oscillation
        p.pulsePhase += p.pulseSpeed;
        const breath = Math.sin(p.pulsePhase) * 4;

        // 3D rotation
        let x1 = (p.baseX + (p.baseX > 0 ? breath : -breath));
        let y1 = p.baseY + breath * 0.5;
        let z1 = p.baseZ + breath * 0.5;

        // Y-axis rotation
        let x2 = x1 * cosY - z1 * sinY;
        let z2 = z1 * cosY + x1 * sinY;

        // X-axis rotation
        let y3 = y1 * cosX - z2 * sinX;
        let z3 = z2 * cosX + y1 * sinX;

        // Perspective projection
        const depth = z3 + 360;
        if (depth > 10) {
          const scale = fov / depth;
          const px = centerX + x2 * scale * k;
          const py = centerY + y3 * scale * k;
          const alpha = 0.25 + (z3 + 180) / 360 * 0.75;
          const boost = pulse > 0 ? Math.exp(-Math.pow((Math.hypot(p.baseX, p.baseY, p.baseZ) - pulse * 260) / 28, 2)) : 0;

          p.angle += p.rotSpeed;

          projected.push({
            x: px,
            y: py,
            z: z3,
            idx: i,
            size: Math.max(1.2, p.size * scale * 0.85 * (1 + boost * 0.9)) * k,
            angle: p.angle,
            color: p.color,
            alpha: Math.max(0.15, Math.min(1, alpha + boost * 0.5))
          });
        }
      }

      // Sort by depth for correct painter's order
      projected.sort((a, b) => a.z - b.z);

      // Draw neural mesh between each particle's nearest 3D neighbours
      ctx.lineWidth = 0.6 * k;
      const byIdx = new Array(particles.length);
      for (let i = 0; i < projected.length; i++) byIdx[projected[i].idx] = projected[i];
      for (let i = 0; i < particles.length; i++) {
        const p1 = byIdx[i];
        if (!p1) continue;
        const nb = particles[i].nb;
        for (let n = 0; n < nb.length; n++) {
          const p2 = byIdx[nb[n]];
          if (!p2) continue;
          ctx.strokeStyle = p1.color;
          ctx.globalAlpha = 0.16 * Math.min(p1.alpha, p2.alpha);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Draw all brain particles
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        drawTriangle(ctx, p.x, p.y, p.size, p.angle, p.color, p.alpha);
      }

      // Render ambient particles drifting in hero visual
      for (let i = 0; i < ambientHero.length; i++) {
        const a = ambientHero[i];
        a.x += a.vx;
        a.y += a.vy;
        a.z += a.vz;

        // Boundary wrap
        if (Math.abs(a.x) > 280) a.vx *= -1;
        if (Math.abs(a.y) > 220) a.vy *= -1;
        if (Math.abs(a.z) > 260) a.vz *= -1;

        let x1 = a.x * cosY - a.z * sinY;
        let z1 = a.z * cosY + a.x * sinY;
        let y2 = a.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + a.y * sinX;

        const depth = z2 + 360;
        if (depth > 20) {
          const scale = fov / depth;
          const px = centerX + x1 * scale * k;
          const py = centerY + y2 * scale * k;
          a.angle += a.rotSpeed;
          drawTriangle(ctx, px, py, a.size * scale * k, a.angle, a.color, a.alpha * 0.6);
        }
      }

      if (!prefersReducedMotion && heroVisible) {
        requestAnimationFrame(renderConstellation);
      }
    }

    window.addEventListener('resize', () => {
      resizeConstellation();
      if (prefersReducedMotion) renderConstellation();
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        const was = heroVisible;
        heroVisible = entry.isIntersecting;
        if (heroVisible && !was && !prefersReducedMotion) renderConstellation();
      }).observe(constellationCanvas);
    }

    resizeConstellation();
    createBrainParticles();
    renderConstellation();
  }

  /* ==========================================================================
     2. AMBIENT BACKGROUND PARTICLE FIELD
     Decorative scattered triangle glyphs floating across black velvet void
     ========================================================================== */
  const ambientCanvas = document.getElementById('ambient-canvas');

  if (ambientCanvas) {
    const actx = ambientCanvas.getContext('2d');
    let aWidth = (ambientCanvas.width = window.innerWidth);
    let aHeight = (ambientCanvas.height = window.innerHeight);

    const AMBIENT_COUNT = 45;
    const ambientField = [];

    function resizeAmbient() {
      aWidth = ambientCanvas.width = window.innerWidth;
      aHeight = ambientCanvas.height = window.innerHeight;
    }

    for (let i = 0; i < AMBIENT_COUNT; i++) {
      ambientField.push({
        x: Math.random() * aWidth,
        y: Math.random() * aHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 3 + Math.random() * 4,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        color: COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)],
        alpha: 0.12 + Math.random() * 0.22
      });
    }

    function renderAmbientField() {
      actx.clearRect(0, 0, aWidth, aHeight);

      for (let i = 0; i < ambientField.length; i++) {
        const p = ambientField[i];
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.rotSpeed;

        if (p.x < -20) p.x = aWidth + 20;
        if (p.x > aWidth + 20) p.x = -20;
        if (p.y < -20) p.y = aHeight + 20;
        if (p.y > aHeight + 20) p.y = -20;

        actx.save();
        actx.translate(p.x, p.y);
        actx.rotate(p.angle);
        actx.strokeStyle = p.color;
        actx.globalAlpha = p.alpha;
        actx.lineWidth = 1;

        actx.beginPath();
        const r = p.size;
        actx.moveTo(0, -r);
        actx.lineTo(r * 0.866, r * 0.5);
        actx.lineTo(-r * 0.866, r * 0.5);
        actx.closePath();
        actx.stroke();
        actx.restore();
      }

      if (!prefersReducedMotion) {
        requestAnimationFrame(renderAmbientField);
      }
    }

    window.addEventListener('resize', resizeAmbient);
    renderAmbientField();
  }

  /* ==========================================================================
     3. PROJECT FILTERING LOGIC
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectEntries = document.querySelectorAll('.project-entry');

  if (filterButtons.length && projectEntries.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const filter = btn.dataset.filter;
        projectEntries.forEach((entry) => {
          const show = filter === 'all' || entry.dataset.category === filter;
          if (show) {
            if (entry.hidden) { entry.hidden = false; entry.classList.add('is-hiding'); void entry.offsetWidth; }
            entry.classList.remove('is-hiding');
          } else {
            entry.classList.add('is-hiding');
            setTimeout(() => { if (entry.classList.contains('is-hiding')) entry.hidden = true; }, 300);
          }
        });
      });
    });
  }

  /* ==========================================================================
     4. NAVIGATION DRAWER & SCROLL SPY
     ========================================================================== */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active navigation link tracking
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNavLink() {
    let currentId = 'home';
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    const scrollPos = window.scrollY + 200 + (atBottom ? 99999 : 0);

    sections.forEach((sec) => {
      if (scrollPos >= sec.offsetTop) {
        currentId = sec.id;
      }
    });

    navAnchors.forEach((link) => {
      const target = link.getAttribute('href');
      link.classList.toggle('active', target === `#${currentId}`);
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  /* ==========================================================================
     5. DYNAMIC COPYRIGHT YEAR
     ========================================================================== */
  const yearElem = document.getElementById('year');
  if (yearElem) {
    yearElem.textContent = String(new Date().getFullYear());
  }
})();


/* ==========================================================================
   6. MOTION & UX LAYER — header, progress, reveals, word-split, drawer, magnetic
   ========================================================================== */
(function () {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = document.querySelector('.site-header');
  const bar = document.querySelector('.scroll-progress');
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (header) header.classList.toggle('scrolled', y > 24);
      if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Split headlines into words for masked slide-up reveal
  document.querySelectorAll('.display-headline, .section-headline').forEach((el) => {
    let n = 0;
    const wrap = (node) => {
      const outer = document.createElement('span');
      const inner = document.createElement('span');
      outer.className = 'w';
      inner.className = 'w-i';
      inner.style.setProperty('--wi', n++);
      inner.appendChild(node);
      outer.appendChild(inner);
      return outer;
    };
    const frag = document.createDocumentFragment();
    el.childNodes.forEach((node) => {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach((t) => {
          if (!t) return;
          frag.appendChild(/^\s+$/.test(t) ? document.createTextNode(' ') : wrap(document.createTextNode(t)));
        });
      } else if (node.nodeName === 'BR') {
        frag.appendChild(node.cloneNode());
      } else {
        frag.appendChild(wrap(node.cloneNode(true)));
      }
    });
    el.textContent = '';
    el.appendChild(frag);
    el.classList.add('split');
  });

  // Stagger children of [data-stagger] groups
  document.querySelectorAll('[data-stagger]').forEach((g) => {
    [...g.children].forEach((c, i) => {
      c.setAttribute('data-reveal', '');
      c.style.setProperty('--d', i * 90 + 'ms');
    });
  });

  // Reveal on scroll
  const targets = document.querySelectorAll('[data-reveal], .split');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    targets.forEach((t) => io.observe(t));
  } else {
    targets.forEach((t) => t.classList.add('in'));
  }

  // Mobile drawer: scroll lock, Esc to close, auto-close on desktop resize
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    const sync = () => { document.body.style.overflow = links.classList.contains('open') ? 'hidden' : ''; };
    const close = () => { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); sync(); };
    toggle.addEventListener('click', () => setTimeout(sync));
    links.addEventListener('click', () => setTimeout(sync));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('open')) { close(); toggle.focus(); }
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 768) close(); });
  }

  // Magnetic pill buttons (fine pointers only)
  if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.button-pill').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.setProperty('--mx', (e.clientX - r.left - r.width / 2) * 0.18 + 'px');
        b.style.setProperty('--my', (e.clientY - r.top - r.height / 2) * 0.28 + 'px');
      });
      b.addEventListener('pointerleave', () => {
        b.style.removeProperty('--mx');
        b.style.removeProperty('--my');
      });
    });
  }
})();
