// Deep-Space Particle Field Background
(function () {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Style and inject canvas
  canvas.id = 'global-starfield';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  document.body.prepend(canvas);

  let width, height;
  let particles = [];
  let shootingStars = [];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Colors based on theme
  function getThemeColors() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    return isLight ? [
      '#64748b', // darker slate instead of white
      '#0284c7', // darker cyan
      '#0369a1', // deeper cyan
      '#ca8a04', // darker gold
      '#6d28d9'  // darker violet
    ] : [
      '#ffffff', // white
      '#22d3ee', // cyan
      '#0ea5e9', // deep cyan
      '#facc15', // gold
      '#8b5cf6'  // violet
    ];
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    particles = [];
    const particleCount = Math.floor((width * height) / 1000); // 10x Density based on screen size

    for (let i = 0; i < particleCount; i++) {
      // Exploding from bottom-left corner
      const x = Math.pow(Math.random(), 3) * width;
      const y = height - Math.pow(Math.random(), 3) * height;

      const size = Math.random() > 0.98 ? Math.random() * 2.5 + 1.5 : Math.random() * 1.2 + 0.3;
      const colorIndex = Math.floor(Math.random() * 5);

      particles.push({
        x, y, size, colorIndex,
        baseAlpha: Math.random() * 0.5 + 0.1,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        isGlow: size > 2,
        vx: (Math.random() - 0.2) * 0.3, // slight drift to the right
        vy: (Math.random() - 0.8) * 0.3  // slight drift upwards
      });
    }
  }

  function spawnShootingStar() {
    if (prefersReducedMotion || document.visibilityState === 'hidden') return;

    // Start from bottom-left region
    const startY = height - (Math.random() * height * 0.4);
    const startX = Math.random() * width * 0.4;

    shootingStars.push({
      x: startX,
      y: startY,
      length: Math.random() * 150 + 80, // longer tail
      speed: Math.random() * 12 + 8,
      angle: (-Math.PI / 4) + (Math.random() * 0.3 - 0.15), // Up and to the right
      life: 1,
      decay: Math.random() * 0.015 + 0.005
    });

    // Randomize next spawn (3-7s)
    setTimeout(spawnShootingStar, Math.random() * 4000 + 3000);
  }

  function draw() {
    if (document.visibilityState === 'hidden') {
      requestAnimationFrame(draw);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // Draw particles
    const time = Date.now();
    const currentColors = getThemeColors();
    particles.forEach(p => {
      let alpha = p.baseAlpha;

      if (!prefersReducedMotion) {
        // Move particles to create a floating space atmosphere
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        if (p.isGlow) {
          alpha = p.baseAlpha + Math.sin(p.twinklePhase + time * p.twinkleSpeed) * 0.3;
          alpha = Math.max(0.1, Math.min(1, alpha));
          ctx.shadowBlur = 8;
          ctx.shadowColor = currentColors[p.colorIndex];
        } else {
          ctx.shadowBlur = 0;
        }
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = currentColors[p.colorIndex];
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw shooting stars
    if (!prefersReducedMotion) {
      ctx.shadowBlur = 0;
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];

        const endX = star.x - Math.cos(star.angle) * star.length;
        const endY = star.y - Math.sin(star.angle) * star.length;

        const grad = ctx.createLinearGradient(star.x, star.y, endX, endY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${star.life})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.life -= star.decay;

        if (star.life <= 0) {
          shootingStars.splice(i, 1);
        }
      }
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    // Debounce resize
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(resize, 200);
  });

  resize();
  draw();
  setTimeout(spawnShootingStar, 2000);
})();
