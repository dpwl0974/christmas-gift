(function () {
  const C = window.CONFIG;
  const stage = document.getElementById('stage');
  const state = { name: '', answers: {}, page: 0 };

  // ───────── 유틸 ─────────
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const hasBatchim = word => {
    const code = word.charCodeAt(word.length - 1);
    return code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0;
  };
  const fill = text => {
    const n = esc(state.name);
    return text
      .replace(/\{name이는\}/g, `<b class="nick">${n}</b>${hasBatchim(state.name) ? '이는' : '는'}`)
      .replace(/\{name\}/g, `<b class="nick">${n}</b>`);
  };
  const wait = ms => new Promise(r => setTimeout(r, ms));

  function go(render) {
    state.page += 1;
    stage.innerHTML = '';
    const page = document.createElement('section');
    page.className = 'page page-in';
    stage.appendChild(page);
    render(page);
    const no = document.createElement('div');
    no.className = 'page-no';
    no.textContent = `- ${state.page} -`;
    page.appendChild(no);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ───────── 0. 도착 ─────────
  function intro() {
    state.answers = {};
    state.page = 0;
    go(p => {
      p.innerHTML = `
        <p class="kicker">To. 나의 소중한 친구에게</p>
        <h1 class="title">크리스마스 선물이<br>도착했습니다!</h1>
        <div class="intro-gift wiggle">${giftSVG()}</div>
        <p class="lead">선물을 받으려면 몇 가지 <b>심사</b>를 통과해야 해요.<br>먼저 별명을 알려주세요.</p>
        <form class="name-form" autocomplete="off">
          <label for="nick" class="sr-only">별명</label>
          <input id="nick" maxlength="10" placeholder="별명 (최대 10자)" value="${esc(state.name)}" required>
          <button class="btn btn-red" type="submit" disabled>입장하기 🎄</button>
        </form>`;
      const input = p.querySelector('#nick');
      const btn = p.querySelector('button');
      const sync = () => (btn.disabled = !input.value.trim());
      input.addEventListener('input', sync);
      sync();
      p.querySelector('form').addEventListener('submit', e => {
        e.preventDefault();
        if (!input.value.trim()) return;
        state.name = input.value.trim();
        gate(0);
      });
    });
  }

  // ───────── 1~3. 출입 심사 (예/아니오) ─────────
  function gate(i) {
    const g = C.gates[i];
    go(p => {
      p.innerHTML = `
        <p class="kicker">출입 심사 ${i + 1} / ${C.gates.length}</p>
        ${g.art === 'mangkko' ? '<div class="gate-art"></div>' : '<div class="gate-art emoji-art">🎅</div>'}
        <h2 class="question">${fill(g.q)}</h2>
        <div class="yn">
          <button class="btn btn-green" data-a="yes">예</button>
          <button class="btn btn-ghost" data-a="no">아니오</button>
        </div>
        <div class="stamp" hidden></div>`;
      const art = p.querySelector('.gate-art');
      if (g.art === 'mangkko') art.appendChild(Mangkko.draw('basic', 6));

      p.querySelector('[data-a=no]').onclick = () => reject(i);
      p.querySelector('[data-a=yes]').onclick = async () => {
        p.querySelectorAll('.yn button').forEach(b => (b.disabled = true));
        if (g.art === 'mangkko') { art.innerHTML = ''; art.appendChild(Mangkko.draw('smile', 6)); }
        if (g.yesToast) {
          const s = p.querySelector('.stamp');
          s.innerHTML = g.yesToast;
          s.hidden = false;
          await wait(1300);
        }
        i + 1 < C.gates.length ? gate(i + 1) : qualify();
      };
    });
  }

  function reject(i) {
    const g = C.gates[i];
    go(p => {
      p.classList.add('page-reject');
      p.innerHTML = `
        <p class="kicker">심사 결과</p>
        <div class="reject-art">${rejectArt(g.noArt, g.noEmoji)}</div>
        <h2 class="question reject-title">${g.noTitle}</h2>
        <button class="btn btn-red">다시 대답하기 ↺</button>`;
      p.querySelector('button').onclick = () => gate(i);
    });
  }

  function rejectArt(kind, emoji) {
    if (kind === 'forbidden') {
      return `<div class="no-entry shake">${emoji}</div>
        <div class="tape">STAFF ONLY · 관계자 외 출입 금지 · STAFF ONLY</div>`;
    }
    if (kind === 'eyechart') {
      return `<svg class="eyechart" viewBox="0 0 160 190" role="img" aria-label="시력 검사표">
          <rect x="4" y="4" width="152" height="182" rx="10" fill="#fff" stroke="#3b2418" stroke-width="3"/>
          <text x="80" y="62" text-anchor="middle" font-size="52" font-family="Arial Black, sans-serif" fill="#3b2418">E</text>
          <text x="80" y="100" text-anchor="middle" font-size="28" font-family="Arial Black, sans-serif" fill="#3b2418" letter-spacing="6">F P</text>
          <text x="80" y="128" text-anchor="middle" font-size="18" font-family="Arial Black, sans-serif" fill="#3b2418" letter-spacing="4">T O Z</text>
          <text x="80" y="150" text-anchor="middle" font-size="12" font-family="Arial Black, sans-serif" fill="#3b2418" letter-spacing="3">망 꼬 귀 염</text>
          <text x="80" y="168" text-anchor="middle" font-size="8" font-family="Arial Black, sans-serif" fill="#3b2418" letter-spacing="2">진 짜 귀 여 움 인 정</text>
        </svg><div class="glasses bob">${emoji}</div>`;
    }
    if (kind === 'kick') {
      return `<div class="kick-scene">
          <span class="foot">${emoji}</span>
          <span class="victim">${esc(state.name)}</span>
          <span class="boom">💥</span>
        </div>`;
    }
    return `<div class="no-entry">${emoji}</div>`;
  }

  // ───────── 4. 자격 획득 ─────────
  function qualify() {
    go(p => {
      p.innerHTML = `
        <p class="kicker">📜 심사 통과</p>
        <h2 class="title small">모든 서약이<br>확인되었습니다</h2>
        <div class="scroll">
          <p>${fill('{name}')}님은 올해 <b>옞의 크리스마스 선물</b>을 받을 자격을 얻으셨어요.</p>
          <p>하지만 잠깐! 산타의 요정들이 트리를 만들기 전에 <b>마지막 시험</b>이 남아 있어요.
             지금부터 고르는 답이 <b>그대로 트리의 재료</b>가 됩니다.</p>
          <p>많이 맞히면 반짝반짝 예쁜 트리를, 틀리면… 음, 그건 직접 확인하세요. 🎄</p>
        </div>
        <button class="btn btn-red">시험 시작하기 ✍️</button>`;
      p.querySelector('button').onclick = () => quiz(0);
    });
  }

  // ───────── 5~9. 퀴즈 ─────────
  function quiz(i) {
    const q = C.quiz[i];
    go(p => {
      const dots = C.quiz.map((_, k) => `<i class="${k < i ? 'done' : k === i ? 'now' : ''}"></i>`).join('');
      p.innerHTML = `
        <p class="kicker">트리 재료 시험 ${i + 1} / ${C.quiz.length}</p>
        <div class="dots" aria-hidden="true">${dots}</div>
        <h2 class="question">${fill(q.q)}</h2>
        <div class="options">
          ${q.options.map((o, k) => `<button class="opt" data-v="${esc(o)}"><span class="num">${k + 1}</span>${esc(o)}</button>`).join('')}
        </div>`;
      p.querySelectorAll('.opt').forEach(b => {
        b.onclick = async () => {
          state.answers[q.key] = b.dataset.v;
          p.querySelectorAll('.opt').forEach(x => (x.disabled = true));
          b.classList.add('picked');
          await wait(450);
          i + 1 < C.quiz.length ? quiz(i + 1) : building();
        };
      });
    });
  }

  // ───────── 판정 ─────────
  const correct = key => state.answers[key] === C.quiz.find(q => q.key === key).answer;
  function judgeTree() {
    if (state.answers.bungeoppang !== '슈붕') return 'bungeoppang';
    if (!correct('mangkkoBirthday') || !correct('mangkkoArrival')) return 'mangkko';
    if (!correct('yeajBirthday') || !correct('yeajAnime')) return 'pepe';
    return 'pretty';
  }

  // ───────── 10. 제작 중 ─────────
  function building() {
    go(p => {
      p.innerHTML = `
        <div class="elves"><span>🧝</span><span>🎄</span><span>🧝‍♀️</span></div>
        <h2 class="question">요정들이 ${fill('{name}')}님의<br>트리를 만드는 중…</h2>
        <div class="bar"><i></i></div>
        <p class="lead status">나무 고르는 중…</p>`;
      const status = p.querySelector('.status');
      const steps = ['나무 고르는 중…', '답안지 채점하는 중… 🧐', '장식 다는 중…', '선물 포장하는 중… 🎀'];
      steps.forEach((s, k) => setTimeout(() => status.isConnected && (status.textContent = s), k * 700));
      setTimeout(showTree, 2900);
    });
  }

  // ───────── 11. 트리 공개 + 12. 선물 ─────────
  function showTree() {
    const kind = judgeTree();
    const t = C.trees[kind];
    const score = C.quiz.filter(q => correct(q.key)).length;
    go(p => {
      p.classList.add('page-tree', `tree-${kind}`);
      p.innerHTML = `
        <p class="kicker">${fill('{name}')}님의 트리 · 정답 ${score} / ${C.quiz.length}</p>
        <h2 class="title small">${t.title}</h2>
        <div class="tree-wrap grow">${Trees[kind]()}</div>
        <p class="lead">${t.comment}</p>
        <div class="under-tree">
          <div class="bubble">트리 밑에 선물이 있어요!<br><b>눌러서 열어보세요 👇</b></div>
          <button class="gift-btn bounce" aria-label="선물 상자 열기">${giftSVG()}</button>
        </div>`;
      const btn = p.querySelector('.gift-btn');
      btn.onclick = () => openGift(btn);
    });
  }

  function openGift(btn) {
    if (btn.classList.contains('opened')) return;
    btn.classList.remove('bounce');
    btn.classList.add('opened');
    btn.closest('.under-tree').querySelector('.bubble').remove();
    setTimeout(() => {
      Effects.fireworks(6000);
      const modal = document.createElement('div');
      modal.className = 'reveal';
      modal.innerHTML = `
        <div class="reveal-card pop">
          <p class="kicker">🎁 오늘의 선물</p>
          <h2 class="title">선물은 나야</h2>
          ${C.winkImage
            ? `<div class="wink-photo"><div class="crop"><img src="${esc(C.winkImage)}" alt="선물인 옞의 셀카"></div>
                 <span class="sticker s1">💖</span><span class="sticker s2">✨</span><span class="sticker s3">🎀</span></div>`
            : `<div class="wink">${winkSVG()}</div>`}
          <p class="lead">메리 크리스마스, ${fill('{name}')}! 🎄</p>
          <div class="yn">
            <button class="btn btn-green" data-a="again">처음부터 다시</button>
            <button class="btn btn-ghost" data-a="share">링크 복사하기</button>
          </div>
        </div>`;
      document.body.appendChild(modal);
      // 사진 파일이 없으면(예: GitHub에서 받은 코드) 찡긋 일러스트로 대신 보여줌
      const photo = modal.querySelector('.wink-photo img');
      if (photo) photo.onerror = () => { photo.closest('.wink-photo').outerHTML = `<div class="wink">${winkSVG()}</div>`; };
      modal.querySelector('[data-a=again]').onclick = () => { modal.remove(); intro(); };
      modal.querySelector('[data-a=share]').onclick = e => copyLink(e.currentTarget);
    }, 700);
  }

  async function copyLink(btn) {
    const url = location.href.split('#')[0];
    try { await navigator.clipboard.writeText(url); btn.textContent = '복사 완료! ✅'; }
    catch { prompt('이 링크를 복사해서 보내주세요', url); }
  }

  // ───────── 그림 ─────────
  function giftSVG() {
    return `<svg class="gift" viewBox="0 0 120 120" aria-hidden="true">
      <rect x="18" y="52" width="84" height="60" rx="6" fill="#e2414f" stroke="#8e1f2b" stroke-width="4"/>
      <rect x="52" y="52" width="16" height="60" fill="#ffcf5a" stroke="#c99420" stroke-width="3"/>
      <g class="lid">
        <rect x="12" y="36" width="96" height="20" rx="5" fill="#f05a67" stroke="#8e1f2b" stroke-width="4"/>
        <rect x="52" y="36" width="16" height="20" fill="#ffcf5a" stroke="#c99420" stroke-width="3"/>
        <path d="M60 36 C42 14 26 22 34 32 C40 38 54 37 60 36 C66 37 80 38 86 32 C94 22 78 14 60 36Z" fill="#ffcf5a" stroke="#c99420" stroke-width="3" stroke-linejoin="round"/>
      </g>
    </svg>`;
  }

  function winkSVG() {
    return `<svg viewBox="0 10 240 220" role="img" aria-label="찡긋 웃는 얼굴">
      <!-- 얼굴 -->
      <ellipse cx="120" cy="140" rx="80" ry="72" fill="#ffe8d8" stroke="#4a2e22" stroke-width="4"/>
      <!-- 앞머리 -->
      <path d="M42 132 C40 80 80 56 120 56 C160 56 200 80 198 132 C186 112 170 100 150 98 C146 108 132 114 120 108 C108 116 90 114 84 102 C66 108 50 118 42 132Z"
            fill="#6b4430" stroke="#4a2e22" stroke-width="3" stroke-linejoin="round"/>
      <!-- 산타 모자 -->
      <path d="M48 98 C56 44 104 22 150 28 C186 32 206 52 214 86 L196 94 C190 74 178 62 164 58 C176 74 182 88 184 100Z"
            fill="#e2414f" stroke="#9b2532" stroke-width="3" stroke-linejoin="round"/>
      <path d="M40 106 Q120 74 194 104" fill="none" stroke="#d9d0c3" stroke-width="24" stroke-linecap="round"/>
      <path d="M40 106 Q120 74 194 104" fill="none" stroke="#fff" stroke-width="19" stroke-linecap="round"/>
      <circle cx="212" cy="92" r="13" fill="#fff" stroke="#d9d0c3" stroke-width="2.5"/>
      <!-- 찡긋 눈 >< -->
      <path d="M70 134 L90 143 L70 152" fill="none" stroke="#3b2418" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- 뜬 눈 -->
      <ellipse cx="156" cy="143" rx="12" ry="14" fill="#3b2418"/>
      <circle cx="160" cy="137" r="5" fill="#fff"/><circle cx="152" cy="149" r="2.2" fill="#fff"/>
      <path d="M167 132 l6 -5 M170 138 l7 -2" stroke="#3b2418" stroke-width="3" stroke-linecap="round"/>
      <!-- 볼터치 -->
      <ellipse cx="72" cy="170" rx="15" ry="9" fill="#ffa0b4" opacity=".85"/>
      <ellipse cx="168" cy="172" rx="15" ry="9" fill="#ffa0b4" opacity=".85"/>
      <path d="M64 168 l4 -5 M71 169 l4 -5 M78 170 l4 -5" stroke="#ff7f98" stroke-width="2" stroke-linecap="round"/>
      <!-- ω 입 + 혀 -->
      <path d="M116 172 Q120 184 124 172" fill="#ff8fa0" stroke="#4a2e22" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M104 166 Q112 176 120 166 Q128 176 136 166" fill="none" stroke="#4a2e22" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- 반짝이 + 하트 -->
      <g class="sparkle"><path d="M50 116 Q52 124 60 126 Q52 128 50 136 Q48 128 40 126 Q48 124 50 116Z" fill="#ffcf5a" stroke="#c99420" stroke-width="1.5"/></g>
      <g class="float-heart"><path d="M206 160 C194 148 198 136 206 143 C214 136 218 148 206 160Z" fill="#ff5a7a" stroke="#c22d4d" stroke-width="2"/></g>
      <g class="float-heart" style="animation-delay:.6s"><path d="M28 70 C18 60 21 50 28 56 C35 50 38 60 28 70Z" fill="#ff8fb1" stroke="#d45683" stroke-width="2"/></g>
      <g class="float-heart" style="animation-delay:1.1s"><path d="M222 196 C214 188 216 180 222 185 C228 180 230 188 222 196Z" fill="#ffb3c8" stroke="#d45683" stroke-width="1.5"/></g>
    </svg>`;
  }

  intro();
})();
