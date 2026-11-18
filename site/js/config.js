// ✏️ 질문·정답·멘트는 전부 여기서 고치면 됩니다.
// {name} 은 별명, {name이는} 은 받침에 맞춰 "민수는 / 지민이는" 으로 바뀝니다.

window.CONFIG = {
  // 찡긋 사진을 쓰려면 assets 폴더에 넣고 경로를 적으세요. 예: 'assets/me-wink.png'
  // 비워두면 기본 일러스트가 나옵니다.
  winkImage: '',

  pepeTreeImage: 'assets/pepe-tree.webp',

  // 출입 심사 (예/아니오). 모두 '예'여야 통과.
  gates: [
    {
      q: '옞의 친구입니까?',
      yesToast: '',
      noTitle: '관계자 외 출입 금지입니다',
      noEmoji: '🚫',
      noArt: 'forbidden',
    },
    {
      q: '망꼬가 세상에서<br>젤 귀엽습니까?',
      art: 'mangkko',
      yesToast: '인정 👍',
      noTitle: '시력 검사 다시 받고 오세요',
      noEmoji: '👓',
      noArt: 'eyechart',
    },
    {
      q: '옞2가 평소에 멋있고,<br>자랑스럽다고 생각합니까?',
      yesToast: '저도 그렇게 생각해요 🥹',
      noTitle: '사람 보는 눈을 키우세요;;',
      noEmoji: '🦶',
      noArt: 'kick',
    },
  ],

  // 퀴즈 (정답은 answer 와 같은 문자열)
  quiz: [
    { key: 'yeajBirthday',    q: '옞의 생일은?',           options: ['9월 11일', '11월 9일', '9월 13일'], answer: '9월 11일' },
    { key: 'yeajAnime',       q: '옞의 최애 애니는?',       options: ['헌터x헌터', '마마마', '슈타게'],      answer: '슈타게' },
    { key: 'mangkkoBirthday', q: '망꼬의 생일은?',          options: ['6월 13일', '10월 4일', '9월 13일'], answer: '6월 13일' },
    { key: 'mangkkoArrival',  q: '망꼬가 우리집에 온 날은?', options: ['6월 13일', '10월 4일', '9월 13일'], answer: '10월 4일' },
    { key: 'bungeoppang',     q: '{name이는} 슈붕파? 팥붕파?', options: ['슈붕', '팥붕'],                answer: '슈붕' },
  ],

  trees: {
    pretty: {
      title: '✨ 반짝반짝 완벽한 트리',
      comment: '전부 정답! 당신은 진정한 옞의 친구예요.',
    },
    bungeoppang: {
      title: '🐟 붕어빵 트리',
      comment: '팥붕파에게는 붕어빵 트리를 드립니다.<br>슈붕의 세계로 오세요.',
    },
    mangkko: {
      title: '🐶 망꼬 트리',
      comment: '망꼬를 모르다니…<br>망꼬로 뒤덮인 트리 보면서 외우세요.',
    },
    pepe: {
      title: '🐸 슬픈 트리',
      comment: '옞을 이렇게 모르다니…<br>트리도 울고 있어요.',
    },
  },
};
