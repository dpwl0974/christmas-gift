// 망꼬 픽셀 아트 — 망꼬랜드(art/mangkko-sprite.html) 데이터를 그대로 옮겨옴
(function () {
  const PAL = {
    o: '#3b2418', w: '#fffaf2', s: '#e3d8c8', t: '#cd8a4c', d: '#a5652f', l: '#e2b07c',
    e: '#2a1a12', h: '#ffffff', n: '#1c1717', p: '#eaa8a0', g: '#f28da0',
    y: '#e8e27a', Y: '#c4bd55', c: '#f3eedc', m: '#cfe8d6',
  };

  const FACE_BASE = [
    "................", "................", "................",
    ".....oooo.......",
    "...oottdtooooooo",
    "..ottppdtttttttw",
    ".otttppdtttttttw",
    ".odttpdottttttww",
    ".oddtdoottttttww",
    "..oddo.ottttttww",
    "...oo..otteettww",
    ".......oteheetww",
    ".......otteettww",
    ".......otttttwww",
    ".......ottttwwww",
    ".......owttwwwww",
    "........owwwwwww",
    "........owwwwnnn",
    "........owwwnnnn",
    ".........owwwnnn",
    ".........owwwwwo",
    "..........owwwoo",
    "...........owwww",
    "..........owwwww",
    ".........owwwwww",
    "........oyyyyyyy",
    "........oYYYYYYc",
    "........owwwwwww",
    "........owwwwwww",
  ];
  const SMILE_MOUTH = [
    ".........owwwnnn",
    "........owwwwwwo",
    "........owooooog",
    ".........owogggg",
    "..........owoggg",
  ];
  const SQUINT_EYES = [
    ".......ottttttww",
    ".......otoooottw",
    ".......ottttttww",
  ];

  const mirror = half => half.map(r => r + r.split('').reverse().join(''));
  const withRows = (base, start, rows) => { const b = base.slice(); rows.forEach((r, i) => (b[start + i] = r)); return b; };

  const FACES = {
    basic: mirror(FACE_BASE),
    smile: mirror(withRows(FACE_BASE, 19, SMILE_MOUTH)),
    squint: mirror(withRows(FACE_BASE, 10, SQUINT_EYES)),
  };
  Object.values(FACES).forEach(f => {
    f[26] = f[26].slice(0, 18) + 'mm' + f[26].slice(20);
    f[27] = f[27].slice(0, 18) + 'mm' + f[27].slice(20);
  });

  // 위쪽 빈 3줄은 잘라서 장식으로 쓸 때 꽉 차 보이게
  function draw(kind = 'basic', scale = 4, trim = true) {
    const rows = trim ? FACES[kind].slice(3) : FACES[kind];
    const w = rows[0].length, h = rows.length;
    const c = document.createElement('canvas');
    c.width = w * scale; c.height = h * scale;
    const g = c.getContext('2d');
    rows.forEach((r, y) => [...r].forEach((ch, x) => {
      const col = PAL[ch];
      if (!col) return;
      g.fillStyle = col;
      g.fillRect(x * scale, y * scale, scale, scale);
    }));
    c.className = 'pixel';
    return c;
  }

  const cache = {};
  function dataURL(kind = 'basic', scale = 4) {
    const k = kind + scale;
    return cache[k] || (cache[k] = draw(kind, scale).toDataURL());
  }

  window.Mangkko = { draw, dataURL, kinds: Object.keys(FACES) };
})();
