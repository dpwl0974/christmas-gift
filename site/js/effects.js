// 눈 내리기 + 폭죽
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ───── 눈 ─────
  const snow = document.getElementById('snow');
  const sg = snow.getContext('2d');
  let flakes = [];
  function resizeSnow() {
    snow.width = innerWidth * devicePixelRatio;
    snow.height = innerHeight * devicePixelRatio;
    const n = Math.min(120, Math.round(innerWidth / 8));
    flakes = Array.from({ length: n }, () => ({
      x: Math.random() * snow.width, y: Math.random() * snow.height,
      r: (Math.random() * 2.2 + 0.8) * devicePixelRatio,
      v: (Math.random() * 0.6 + 0.3) * devicePixelRatio,
      drift: Math.random() * Math.PI * 2,
    }));
  }
  function tickSnow() {
    sg.clearRect(0, 0, snow.width, snow.height);
    sg.fillStyle = 'rgba(255,255,255,.85)';
    for (const f of flakes) {
      f.y += f.v; f.drift += 0.01; f.x += Math.sin(f.drift) * 0.4 * devicePixelRatio;
      if (f.y > snow.height) { f.y = -5; f.x = Math.random() * snow.width; }
      sg.beginPath(); sg.arc(f.x, f.y, f.r, 0, Math.PI * 2); sg.fill();
    }
    requestAnimationFrame(tickSnow);
  }
  resizeSnow();
  addEventListener('resize', resizeSnow);
  if (!reduceMotion) tickSnow();

  // ───── 폭죽 ─────
  const fw = document.getElementById('fireworks');
  const fg = fw.getContext('2d');
  const COLORS = ['#ff5a6e', '#ffd36e', '#7ee0a1', '#7fb6ff', '#ff9ad5', '#fff3c4'];
  let particles = [], rockets = [], running = false, until = 0;

  function sizeFw() { fw.width = innerWidth * devicePixelRatio; fw.height = innerHeight * devicePixelRatio; }
  addEventListener('resize', sizeFw);

  function launch() {
    const d = devicePixelRatio;
    rockets.push({
      x: fw.width * (0.15 + Math.random() * 0.7), y: fw.height,
      vy: -(9 + Math.random() * 4) * d,
      ty: fw.height * (0.15 + Math.random() * 0.3),
      color: COLORS[(Math.random() * COLORS.length) | 0],
    });
  }
  function burst(x, y, color) {
    const d = devicePixelRatio, n = 70;
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n, s = (Math.random() * 4 + 2) * d;
      particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, color: Math.random() < 0.3 ? '#fff' : color });
    }
  }
  function tick() {
    fg.globalCompositeOperation = 'destination-out';
    fg.fillStyle = 'rgba(0,0,0,.22)';
    fg.fillRect(0, 0, fw.width, fw.height);
    fg.globalCompositeOperation = 'lighter';

    if (performance.now() < until && Math.random() < 0.08) launch();

    rockets = rockets.filter(r => {
      r.y += r.vy;
      fg.fillStyle = r.color; fg.beginPath(); fg.arc(r.x, r.y, 2.5 * devicePixelRatio, 0, 7); fg.fill();
      if (r.y <= r.ty) { burst(r.x, r.y, r.color); return false; }
      return true;
    });
    particles = particles.filter(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.06 * devicePixelRatio; p.vx *= 0.985; p.vy *= 0.985; p.life -= 0.012;
      fg.globalAlpha = Math.max(p.life, 0);
      fg.fillStyle = p.color; fg.beginPath(); fg.arc(p.x, p.y, 2 * devicePixelRatio, 0, 7); fg.fill();
      fg.globalAlpha = 1;
      return p.life > 0;
    });

    if (rockets.length || particles.length || performance.now() < until) requestAnimationFrame(tick);
    else { running = false; fg.clearRect(0, 0, fw.width, fw.height); }
  }

  function fireworks(ms = 5000) {
    sizeFw();
    until = performance.now() + ms;
    for (let i = 0; i < 4; i++) setTimeout(launch, i * 180);
    if (!running) { running = true; requestAnimationFrame(tick); }
  }

  window.Effects = { fireworks };
})();
