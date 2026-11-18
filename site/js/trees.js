// 트리 4종 렌더링. 각 함수는 트리 그림 HTML 문자열을 돌려줌.
(function () {
  // 트리 양옆에 소품을 둘 수 있게 가로를 넓게 잡음 (트리 자체는 x 25~275)
  const VB = 'viewBox="-50 0 400 360"';

  // 동화책 느낌의 3단 초록 트리
  // inner: 트리 위 장식, back: 트리 뒤 소품, front: 트리 앞 소품, defs: <symbol> 등
  function greenTree(inner, { star = defaultStar(), back = '', front = '', defs = '', label = '크리스마스 트리' } = {}) {
    return `
    <svg class="tree-svg" ${VB} role="img" aria-label="${label}">
      <defs>${defs}</defs>
      ${back}
      <ellipse cx="150" cy="340" rx="190" ry="16" fill="#fff" opacity=".9"/>
      <rect x="134" y="300" width="32" height="40" rx="4" fill="#8b5a3c" stroke="#5b3a29" stroke-width="3"/>
      <path d="M150 170 L275 300 Q212 322 150 310 Q88 322 25 300 Z" fill="#3f8f5a" stroke="#2c5e3e" stroke-width="4" stroke-linejoin="round"/>
      <path d="M150 95 L250 212 Q200 228 150 218 Q100 228 50 212 Z" fill="#4fa36a" stroke="#2c5e3e" stroke-width="4" stroke-linejoin="round"/>
      <path d="M150 40 L222 134 Q186 146 150 138 Q114 146 78 134 Z" fill="#5cb377" stroke="#2c5e3e" stroke-width="4" stroke-linejoin="round"/>
      <path d="M150 52 L206 128" stroke="#ffffff" stroke-opacity=".18" stroke-width="10" stroke-linecap="round"/>
      ${inner}
      ${star}
      ${front}
    </svg>`;
  }

  function defaultStar() {
    return `<g transform="translate(150 46)"><g class="tree-star">
      <circle r="26" fill="#ffd36e" opacity=".25"/>
      <path d="M0 -22 L6.5 -7 L22 -6.8 L10 3.5 L13.6 19 L0 10.5 L-13.6 19 L-10 3.5 L-22 -6.8 L-6.5 -7Z"
            fill="#ffd36e" stroke="#c99420" stroke-width="3" stroke-linejoin="round"/>
    </g></g>`;
  }

  const SPOTS = [
    [140, 85], [168, 108], [120, 124], [186, 128],
    [112, 168], [186, 160], [150, 196], [82, 208], [218, 206],
    [98, 244], [200, 262], [70, 288], [128, 274], [230, 290], [160, 296],
  ];

  const LIGHTS = [
    'M108 108 Q150 126 196 104', 'M86 180 Q150 206 220 178', 'M60 262 Q150 292 244 258',
  ];

  // 반짝이 전구 줄
  function lights(colors = ['#fff3a8', '#ffb3c1', '#b3e0ff']) {
    let out = LIGHTS.map(d => `<path d="${d}" fill="none" stroke="#f6e3a1" stroke-width="3" stroke-dasharray="2 6" stroke-linecap="round"/>`).join('');
    LIGHTS.forEach((d, li) => {
      const [, x1, y1, cx, cy, x2, y2] = d.match(/M(\d+) (\d+) Q(\d+) (\d+) (\d+) (\d+)/).map(Number);
      for (let i = 1; i < 8; i++) {
        const t = i / 8;
        const x = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t * t * x2;
        const y = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t * t * y2;
        out += `<circle class="twinkle" style="animation-delay:${((i + li) % 5) * 0.3}s" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.6" fill="${colors[i % colors.length]}"/>`;
      }
    });
    return out;
  }

  // 공중에 떠 있는 반짝이
  function sparkles(points) {
    return points.map(([x, y, s = 1], i) => `
      <g transform="translate(${x} ${y}) scale(${s})"><path class="twinkle" style="animation-delay:${(i % 4) * 0.35}s"
        d="M0 -9 Q1.5 -1.5 9 0 Q1.5 1.5 0 9 Q-1.5 1.5 -9 0 Q-1.5 -1.5 0 -9Z" fill="#ffd36e" stroke="#e0a93a" stroke-width="1"/></g>`).join('');
  }

  // ───── 소품 ─────
  function teddy(x, y, s = 1) {
    return `<g transform="translate(${x} ${y}) scale(${s})" class="prop">
      <ellipse cx="-16" cy="-5" rx="11" ry="8" fill="#c08552" stroke="#5b3a29" stroke-width="3"/>
      <ellipse cx="16" cy="-5" rx="11" ry="8" fill="#c08552" stroke="#5b3a29" stroke-width="3"/>
      <ellipse cx="-16" cy="-5" rx="5" ry="4" fill="#f0cfa5"/><ellipse cx="16" cy="-5" rx="5" ry="4" fill="#f0cfa5"/>
      <ellipse cx="0" cy="-28" rx="25" ry="26" fill="#c08552" stroke="#5b3a29" stroke-width="3"/>
      <ellipse cx="0" cy="-24" rx="14" ry="15" fill="#f0cfa5"/>
      <ellipse cx="-24" cy="-36" rx="8" ry="12" transform="rotate(25 -24 -36)" fill="#c08552" stroke="#5b3a29" stroke-width="3"/>
      <ellipse cx="24" cy="-36" rx="8" ry="12" transform="rotate(-25 24 -36)" fill="#c08552" stroke="#5b3a29" stroke-width="3"/>
      <circle cx="-18" cy="-88" r="9" fill="#c08552" stroke="#5b3a29" stroke-width="3"/><circle cx="-18" cy="-88" r="4.5" fill="#f2a7a7"/>
      <circle cx="18" cy="-88" r="9" fill="#c08552" stroke="#5b3a29" stroke-width="3"/><circle cx="18" cy="-88" r="4.5" fill="#f2a7a7"/>
      <circle cx="0" cy="-70" r="24" fill="#c08552" stroke="#5b3a29" stroke-width="3"/>
      <ellipse cx="0" cy="-62" rx="10" ry="8" fill="#f0cfa5"/>
      <ellipse cx="0" cy="-66" rx="4" ry="3" fill="#3b2418"/>
      <path d="M0 -63 V-59 M-4 -58 Q0 -55 4 -58" stroke="#3b2418" stroke-width="2" fill="none" stroke-linecap="round"/>
      <circle cx="-9" cy="-74" r="3" fill="#3b2418"/><circle cx="9" cy="-74" r="3" fill="#3b2418"/>
      <circle cx="-8" cy="-75" r="1" fill="#fff"/><circle cx="10" cy="-75" r="1" fill="#fff"/>
      <ellipse cx="-15" cy="-63" rx="4.5" ry="2.8" fill="#ff9eb0" opacity=".85"/><ellipse cx="15" cy="-63" rx="4.5" ry="2.8" fill="#ff9eb0" opacity=".85"/>
      <path d="M-20 -50 Q0 -42 20 -50 L20 -44 Q0 -36 -20 -44Z" fill="#e2414f" stroke="#9b2532" stroke-width="2" stroke-linejoin="round"/>
      <path d="M10 -44 L16 -26 L8 -27 L5 -43Z" fill="#e2414f" stroke="#9b2532" stroke-width="2" stroke-linejoin="round"/>
      <path d="M-22 -86 Q-6 -112 22 -98 Q30 -94 34 -84 L18 -88 Q0 -96 -14 -84Z" fill="#e2414f" stroke="#9b2532" stroke-width="2" stroke-linejoin="round"/>
      <rect x="-24" y="-90" width="42" height="9" rx="4.5" fill="#fff" stroke="#d9d0c3" stroke-width="1.5" transform="rotate(-8 -3 -86)"/>
      <circle cx="35" cy="-83" r="5.5" fill="#fff" stroke="#d9d0c3" stroke-width="1.5"/>
    </g>`;
  }

  function present(x, y, w, h, body, ribbon) {
    return `<g transform="translate(${x} ${y})">
      <rect x="${-w / 2}" y="${-h}" width="${w}" height="${h}" rx="4" fill="${body}" stroke="#3b2418" stroke-width="2.5"/>
      <rect x="${-w / 2 - 3}" y="${-h}" width="${w + 6}" height="${Math.min(10, h * 0.28)}" rx="3" fill="${body}" stroke="#3b2418" stroke-width="2.5"/>
      <rect x="-4" y="${-h}" width="8" height="${h}" fill="${ribbon}"/>
      <path d="M0 ${-h} C-14 ${-h - 16} -20 ${-h - 4} -10 ${-h - 1} Z M0 ${-h} C14 ${-h - 16} 20 ${-h - 4} 10 ${-h - 1} Z"
            fill="${ribbon}" stroke="#3b2418" stroke-width="2" stroke-linejoin="round"/>
    </g>`;
  }

  function candyCane(x, y, s = 1) {
    const d = 'M0 0 L0 -46 Q0 -62 13 -62 Q26 -62 26 -48';
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <path d="${d}" fill="none" stroke="#3b2418" stroke-width="12" stroke-linecap="round"/>
      <path d="${d}" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
      <path d="${d}" fill="none" stroke="#e2414f" stroke-width="7" stroke-dasharray="6 6"/>
    </g>`;
  }

  function snowman(x, y, s = 1) {
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <circle cx="0" cy="-20" r="20" fill="#fff" stroke="#9fb0cc" stroke-width="2.5"/>
      <circle cx="0" cy="-52" r="14" fill="#fff" stroke="#9fb0cc" stroke-width="2.5"/>
      <circle cx="-5" cy="-55" r="1.8" fill="#3b2418"/><circle cx="5" cy="-55" r="1.8" fill="#3b2418"/>
      <path d="M0 -51 L10 -49 L0 -47Z" fill="#f08a3c"/>
      <path d="M-13 -42 Q0 -36 13 -42 L13 -38 Q0 -32 -13 -38Z" fill="#5b8def"/>
      <circle cx="0" cy="-24" r="2" fill="#3b2418"/><circle cx="0" cy="-15" r="2" fill="#3b2418"/>
      <rect x="-10" y="-74" width="20" height="10" rx="2" fill="#3b2418"/><rect x="-14" y="-66" width="28" height="4" rx="2" fill="#3b2418"/>
    </g>`;
  }

  // ✨ 예쁜 트리
  function pretty() {
    const colors = ['#e2414f', '#ffcf5a', '#5b8def', '#ff8fb1'];
    const balls = SPOTS.map(([x, y], i) => `
      <g class="ornament" style="animation-delay:${(i % 4) * 0.25}s">
        <circle cx="${x}" cy="${y}" r="9" fill="${colors[i % colors.length]}" stroke="#00000033" stroke-width="2"/>
        <circle cx="${x - 3}" cy="${y - 3}" r="2.6" fill="#fff" opacity=".8"/>
      </g>`).join('');
    const back = sparkles([[-20, 60, 1.2], [320, 48], [-36, 170, .8], [336, 160, 1.1], [20, 26, .7], [290, 110, .8], [-10, 240, .7], [320, 236, .9]]);
    const front =
      present(206, 346, 46, 30, '#5b8def', '#fff') +
      present(250, 346, 40, 44, '#e2414f', '#ffcf5a') +
      present(230, 318, 30, 20, '#ff8fb1', '#fff') +
      candyCane(-6, 346, 1) +
      snowman(318, 346, .9) +
      teddy(56, 346, .95);
    return greenTree(lights() + balls, { back, front, label: '곰돌이와 선물이 놓인 예쁜 크리스마스 트리' });
  }

  // 🐶 망꼬 트리 — 망꼬 얼굴 + 금색 종
  function mangkko() {
    const bell = `<symbol id="bell" viewBox="-15 -17 30 34">
        <path d="M-11 9 Q-11 -9 0 -10 Q11 -9 11 9 L13 12 L-13 12 Z" fill="#ffcf5a" stroke="#b07d17" stroke-width="2" stroke-linejoin="round"/>
        <path d="M-5 -4 Q-6 3 -6 7" stroke="#fff6c9" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <circle cy="14" r="3" fill="#b07d17"/>
        <path d="M0 -10 L-9 -15 L-8 -6 Z M0 -10 L9 -15 L8 -6 Z" fill="#e2414f" stroke="#9b2532" stroke-width="1.5" stroke-linejoin="round"/>
        <circle cy="-10" r="2.6" fill="#e2414f"/>
      </symbol>`;
    const kinds = ['basic', 'smile', 'squint'];
    let n = 0;
    const deco = SPOTS.map(([x, y], i) => {
      const delay = `animation-delay:${(i % 4) * 0.25}s`;
      if (i % 2 === 1) {
        return `<g class="ornament" style="${delay}"><use href="#bell" x="${x - 14}" y="${y - 15}" width="28" height="32"/></g>`;
      }
      const src = Mangkko.dataURL(kinds[n++ % 3], 4);
      return `<image class="ornament" style="${delay};image-rendering:pixelated" href="${src}" x="${x - 17}" y="${y - 14}" width="34" height="28"/>`;
    }).join('');
    const star = `<g class="tree-star"><circle cx="150" cy="36" r="30" fill="#ffd36e" opacity=".3"/>
      <image href="${Mangkko.dataURL('smile', 6)}" x="122" y="12" width="56" height="46" style="image-rendering:pixelated"/></g>`;
    const bubble = `<g transform="translate(212 34)"><rect x="0" y="-18" width="62" height="28" rx="12" fill="#fff" stroke="#3b2418" stroke-width="2.5"/>
      <path d="M8 8 L2 18 L18 9" fill="#fff" stroke="#3b2418" stroke-width="2.5" stroke-linejoin="round"/>
      <text x="31" y="2" text-anchor="middle" font-family="Jua" font-size="15" fill="#3b2418">멍멍!</text></g>`;
    const bone = `<g transform="translate(250 336) rotate(-12)">
      <path d="M-18 -4 H18 M-18 4 H18" stroke="#3b2418" stroke-width="2"/>
      <rect x="-18" y="-4" width="36" height="8" fill="#fff8ec"/>
      <circle cx="-20" cy="-5" r="6" fill="#fff8ec" stroke="#3b2418" stroke-width="2"/><circle cx="-20" cy="5" r="6" fill="#fff8ec" stroke="#3b2418" stroke-width="2"/>
      <circle cx="20" cy="-5" r="6" fill="#fff8ec" stroke="#3b2418" stroke-width="2"/><circle cx="20" cy="5" r="6" fill="#fff8ec" stroke="#3b2418" stroke-width="2"/>
      <rect x="-18" y="-3" width="36" height="6" fill="#fff8ec"/></g>`;
    return greenTree(lights(['#fff3a8', '#ffd36e']) + deco, {
      defs: bell, star: star + bubble, front: bone, label: '망꼬 얼굴과 종이 달린 트리',
    });
  }

  // 🐟 붕어빵 트리 — 초록 트리에 붕어빵 장식
  function bungeoppang() {
    const fish = `
      <symbol id="bung" viewBox="0 0 64 36">
        <path d="M8 18 C14 4 40 3 47 14 L60 6 C57 14 57 22 60 30 L47 22 C40 33 14 32 8 18Z"
              fill="#d9963f" stroke="#7a4518" stroke-width="2.6" stroke-linejoin="round"/>
        <path d="M12 18 C18 9 36 8 42 15" fill="none" stroke="#f1c27a" stroke-width="2" stroke-linecap="round" opacity=".8"/>
        <circle cx="16" cy="15" r="2.6" fill="#3b2418"/>
        <path d="M22 11 Q25 18 22 25" fill="none" stroke="#7a4518" stroke-width="2"/>
        <path d="M28 14 q3 2 6 0 M28 20 q3 2 6 0 M34 17 q3 2 6 0" fill="none" stroke="#a8652a" stroke-width="1.6"/>
      </symbol>`;
    const W = 40, H = 23;
    const deco = SPOTS.map(([x, y], i) => {
      const flip = i % 2 === 1;
      const rot = [-14, 8, -4, 12, -10][i % 5];
      const tr = `rotate(${rot} ${x} ${y})` + (flip ? ` translate(${2 * x} 0) scale(-1 1)` : '');
      return `<g class="fish" style="animation-delay:${(i % 5) * 0.18}s">
        <use href="#bung" x="${x - W / 2}" y="${y - H / 2}" width="${W}" height="${H}" transform="${tr}"/></g>`;
    }).join('');
    const star = `<g transform="translate(150 46)"><g class="tree-star">
      <circle r="26" fill="#c9832f" opacity=".2"/>
      <path d="M0 -22 L6.5 -7 L22 -6.8 L10 3.5 L13.6 19 L0 10.5 L-13.6 19 L-10 3.5 L-22 -6.8 L-6.5 -7Z" fill="#7a3b2e" stroke="#4a2018" stroke-width="3" stroke-linejoin="round"/>
      <text y="6" text-anchor="middle" font-family="Jua" font-size="13" fill="#ffd9c4">팥</text></g></g>`;
    const bag = `<g transform="translate(252 346)">
      <path d="M-30 -46 L30 -46 L36 0 L-36 0Z" fill="#c9a77b" stroke="#7a5a35" stroke-width="3" stroke-linejoin="round"/>
      <path d="M-30 -46 L-24 -54 L24 -54 L30 -46" fill="#b8956a" stroke="#7a5a35" stroke-width="3" stroke-linejoin="round"/>
      <text y="-18" text-anchor="middle" font-family="Jua" font-size="13" fill="#5b3a29">3개</text>
      <text y="-4" text-anchor="middle" font-family="Jua" font-size="13" fill="#5b3a29">2천원</text>
      <g class="steam" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85">
        <path d="M-10 -58 q-6 -9 0 -16 q6 -7 0 -14"/><path d="M10 -58 q-6 -9 0 -16 q6 -7 0 -14"/></g>
    </g>`;
    return greenTree(lights(['#fff3a8', '#ffcf9a']) + deco, {
      defs: fish, star, front: bag, label: '붕어빵이 장식으로 달린 트리',
    });
  }

  // 🐸 페페 트리
  function pepe() {
    return `<div class="pepe-frame"><img src="${CONFIG.pepeTreeImage}" alt="울고 있는 못생긴 크리스마스 트리"></div>`;
  }

  window.Trees = { pretty, mangkko, bungeoppang, pepe };
})();
