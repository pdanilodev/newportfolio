// Particle background — vanilla canvas
(() => {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w, h, dpr, particles = [];

  const COUNT = window.innerWidth < 640 ? 40 : 80;
  const COLOR = 'rgba(0, 217, 255, ';

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function init() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-0.15, 0.15),
        vy: rand(-0.15, 0.15),
        r: rand(0.5, 1.8),
        a: rand(0.15, 0.6),
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, w, h);

    // particles
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w; else if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; else if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = COLOR + p.a + ')';
      ctx.fill();
    }

    // connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        const max = 120;
        if (d2 < max * max) {
          const alpha = (1 - Math.sqrt(d2) / max) * 0.15;
          ctx.strokeStyle = COLOR + alpha + ')';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize();
  init();
  step();
})();

// Subtle 3D tilt for keycaps following the pointer
(() => {
  const keys = document.querySelectorAll('.keycap');
  keys.forEach((key) => {
    key.addEventListener('mousemove', (e) => {
      const r = key.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      key.style.transform = `translateY(-8px) scale(1.08) rotateX(${-y * 18}deg) rotateY(${x * 18}deg)`;
    });
    key.addEventListener('mouseleave', () => {
      key.style.transform = '';
    });
  });
})();
