import type { Shared } from '@/lib/types'

// 현재 로그인 유저 ID (방향 판별 기준)
export const CURRENT_USER_ID = 'user-me'

export const MOCK_SHARED_LIST: Shared[] = [
  // ── 읽는 중 (ownerId !== CURRENT_USER_ID) ─────────────────────────────
  {
    id: 'shared-1',
    bookId: 'farewell',
    title: '작별인사',
    author: '김영하',
    totalPages: 312,
    ownerId: 'user-a', // 내가 아님 → 읽는 중
    exchangeStatus: 'reading',
    participants: [
      {
        id: 'user-a',
        name: '바람결',
        color: '#a8d5e2',
        meThought: '끝이 정해진 존재와 함께하는 것이, 결국 우리 모두의 이야기다.',
      },
      { id: CURRENT_USER_ID, name: '나', color: '#f9c5bd' },
    ],
    indexes: [
      {
        id: 'idx-1',
        participantId: 'user-a',
        pageNumber: 12,
        content:
          '철이는 처음에 자신이 인간이라고 믿었다. 그 믿음 자체가 그를 인간답게 만들었는지도 모른다.',
        comments: [],
        createdAt: new Date('2026-05-10T09:20:00'),
      },
      {
        id: 'idx-2',
        participantId: CURRENT_USER_ID,
        pageNumber: 27,
        content:
          '아버지는 말했다. "너는 내 아들이야." 그 말이 거짓이 아니었다는 걸, 나는 지금도 믿는다.',
        comments: [
          {
            id: 'cmt-1',
            participantId: 'user-a',
            content: '이 장면에서 울 뻔했어. 아버지의 감정이 진짜라는 게 느껴져서.',
            createdAt: new Date('2026-05-10T11:30:00'),
          },
        ],
        createdAt: new Date('2026-05-10T10:15:00'),
      },
      {
        id: 'idx-3',
        participantId: 'user-a',
        pageNumber: 45,
        content:
          '기억이란 무엇인가. 어떤 기억은 만들어진 것이고, 어떤 기억은 심어진 것이다. 하지만 그 기억이 나를 만든 것은 분명하다.',
        comments: [
          {
            id: 'cmt-2',
            participantId: CURRENT_USER_ID,
            content: '기억이 진짜냐 가짜냐보다 그게 나를 어떻게 만들었냐가 더 중요한 것 같아.',
            createdAt: new Date('2026-05-11T14:00:00'),
          },
          {
            id: 'cmt-3',
            participantId: 'user-a',
            content: '맞아. 철이의 슬픔이 프로그래밍된 것이라도, 그게 가짜라고 할 수 없잖아.',
            createdAt: new Date('2026-05-11T14:45:00'),
          },
        ],
        createdAt: new Date('2026-05-11T13:10:00'),
      },
      {
        id: 'idx-4',
        participantId: CURRENT_USER_ID,
        pageNumber: 78,
        content: '센터의 직원들은 철이를 사물처럼 다뤘다. 그러나 철이는 그들을 사람으로 기억했다.',
        comments: [],
        createdAt: new Date('2026-05-12T08:30:00'),
      },
      {
        id: 'idx-5',
        participantId: 'user-a',
        pageNumber: 103,
        content:
          '작별이라는 단어가 이렇게 무거운 건 처음 알았다. 다시 볼 수 없을지도 모른다는 것. 그게 이별이 아니라 작별인 이유다.',
        comments: [
          {
            id: 'cmt-4',
            participantId: CURRENT_USER_ID,
            content: '작별과 이별의 차이를 이 소설로 처음 느꼈어. 제목이 왜 작별인사인지.',
            createdAt: new Date('2026-05-13T20:10:00'),
          },
        ],
        createdAt: new Date('2026-05-13T19:00:00'),
      },
      {
        id: 'idx-6',
        participantId: CURRENT_USER_ID,
        pageNumber: 156,
        content:
          '철이가 마지막으로 웃었을 때, 그것이 프로그램된 표정인지 아닌지 나는 더 이상 알고 싶지 않았다.',
        imageUrl:
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
        comments: [
          {
            id: 'cmt-5',
            participantId: 'user-a',
            content: '이 장면 읽고 한참 멍했어.',
            createdAt: new Date('2026-05-14T16:20:00'),
          },
          {
            id: 'cmt-6',
            participantId: CURRENT_USER_ID,
            content: '진짜 감정과 시뮬레이션된 감정을 구분하는 게 의미 있을까 싶더라고.',
            createdAt: new Date('2026-05-14T17:00:00'),
          },
          {
            id: 'cmt-7',
            participantId: 'user-a',
            content: '결국 받아들이는 쪽이 진짜로 만드는 거 아닐까.',
            createdAt: new Date('2026-05-14T17:30:00'),
          },
        ],
        createdAt: new Date('2026-05-14T15:45:00'),
      },
      {
        id: 'idx-7',
        participantId: 'user-a',
        pageNumber: 201,
        content: '끝이 정해진 존재와 함께한다는 것. 어쩌면 우리 모두가 그 존재다.',
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop',
        comments: [],
        createdAt: new Date('2026-05-15T10:00:00'),
      },
      {
        id: 'idx-8',
        participantId: CURRENT_USER_ID,
        pageNumber: 247,
        content: '인사란 원래 다시 보기 위해 하는 것이다. 작별인사는 그래서 역설이다.',
        comments: [
          {
            id: 'cmt-8',
            participantId: 'user-a',
            content: '이 문장 때문에 제목이 완성되는 것 같아. 마지막까지 읽어야 알 수 있는 제목.',
            createdAt: new Date('2026-05-16T21:00:00'),
          },
        ],
        createdAt: new Date('2026-05-16T20:00:00'),
      },
    ],
  },
  {
    id: 'shared-2',
    bookId: 'pachinko',
    title: '파친코 1',
    author: '이민진',
    totalPages: 432,
    ownerId: 'user-b', // 내가 아님 → 읽는 중
    exchangeStatus: 'reading',
    participants: [
      {
        id: 'user-b',
        name: '느린돌',
        color: '#f4b8c1',
        meThought: '살아남는 것이 때로는 가장 큰 저항이다.',
      },
      { id: CURRENT_USER_ID, name: '나', color: '#a8d5e2' },
    ],
    indexes: [
      {
        id: 'idx-p1',
        participantId: 'user-b',
        pageNumber: 18,
        content: '역사가 우리를 망쳐놨지만, 그래도 상관없다.',
        comments: [],
        createdAt: new Date('2026-06-01T10:00:00'),
      },
      {
        id: 'idx-p2',
        participantId: CURRENT_USER_ID,
        pageNumber: 34,
        content: '선자는 아무것도 선택하지 않았지만, 모든 것이 그녀의 선택처럼 돌아왔다.',
        comments: [
          {
            id: 'cmt-p1',
            participantId: 'user-b',
            content: '그게 이 소설의 핵심인 것 같아. 선택과 운명 사이.',
            createdAt: new Date('2026-06-01T12:00:00'),
          },
        ],
        createdAt: new Date('2026-06-01T11:00:00'),
      },
      {
        id: 'idx-p3',
        participantId: 'user-b',
        pageNumber: 67,
        content: '고향이란 떠나온 뒤에야 비로소 선명해지는 것.',
        comments: [],
        createdAt: new Date('2026-06-02T09:00:00'),
      },
    ],
  },

  // ── 공유 중 (ownerId === CURRENT_USER_ID) — exchangeStatus 4종 ─────────
  {
    id: 'shared-3',
    bookId: 'alchemist',
    title: '연금술사',
    author: '파울로 코엘료',
    totalPages: 244,
    ownerId: CURRENT_USER_ID, // 내 책 → 공유 중
    exchangeStatus: 'reading',
    participants: [
      {
        id: CURRENT_USER_ID,
        name: '나',
        color: '#b5d5c5',
        meThought: '자신의 전설을 따라가는 것, 그게 삶의 전부인지도 모른다.',
      },
      { id: 'user-c', name: '초록빛', color: '#ffd6a5' },
    ],
    indexes: [
      {
        id: 'idx-a1',
        participantId: CURRENT_USER_ID,
        pageNumber: 22,
        content: '누군가 무언가를 간절히 원할 때, 온 우주가 그 소원이 실현되도록 도와준다.',
        comments: [],
        createdAt: new Date('2026-06-05T08:00:00'),
      },
      {
        id: 'idx-a2',
        participantId: 'user-c',
        pageNumber: 41,
        content: '사막은 위험하지만, 그것이 꿈을 포기할 이유가 되지는 않는다.',
        comments: [
          {
            id: 'cmt-a1',
            participantId: CURRENT_USER_ID,
            content: '이 문장에서 여정이 시작되는 느낌이야.',
            createdAt: new Date('2026-06-05T10:30:00'),
          },
        ],
        createdAt: new Date('2026-06-05T09:00:00'),
      },
      {
        id: 'idx-a3',
        participantId: CURRENT_USER_ID,
        pageNumber: 88,
        content: '두려움은 꿈을 꾸는 사람에게 가장 큰 장애물이다.',
        comments: [],
        createdAt: new Date('2026-06-06T07:30:00'),
      },
    ],
  },
  {
    id: 'shared-4',
    bookId: 'stoner',
    title: '스토너',
    author: '존 윌리엄스',
    totalPages: 336,
    ownerId: CURRENT_USER_ID, // 내 책 → 공유 중
    exchangeStatus: 'returning',
    participants: [
      {
        id: CURRENT_USER_ID,
        name: '나',
        color: '#c9b1ff',
        meThought: '평범한 삶에도 빛나는 순간은 있다. 그걸 기억하는 게 문학이다.',
      },
      { id: 'user-d', name: '달빛숲', color: '#ffb3c6' },
    ],
    indexes: [
      {
        id: 'idx-s1',
        participantId: 'user-d',
        pageNumber: 15,
        content: '윌리엄 스토너는 농부의 아들로 태어나 대학에 갔고, 그곳에서 문학을 발견했다.',
        comments: [],
        createdAt: new Date('2026-05-20T09:00:00'),
      },
      {
        id: 'idx-s2',
        participantId: CURRENT_USER_ID,
        pageNumber: 53,
        content: '사랑은 삶의 목적이 아니었다. 하지만 그것 없이는 삶이 아무 의미도 없었다.',
        comments: [
          {
            id: 'cmt-s1',
            participantId: 'user-d',
            content: '이 문장이 스토너의 비극을 한 줄로 요약하는 것 같아.',
            createdAt: new Date('2026-05-20T11:00:00'),
          },
        ],
        createdAt: new Date('2026-05-20T10:00:00'),
      },
      {
        id: 'idx-s3',
        participantId: 'user-d',
        pageNumber: 120,
        content: '그는 강의실에서만큼은 자신이 원하는 사람이 될 수 있었다.',
        comments: [],
        createdAt: new Date('2026-05-21T08:00:00'),
      },
    ],
  },
  {
    id: 'shared-5',
    bookId: 'little-prince',
    title: '어린 왕자',
    author: '앙투안 드 생텍쥐페리',
    totalPages: 128,
    ownerId: CURRENT_USER_ID, // 내 책 → 공유 중
    exchangeStatus: 'arrived',
    participants: [
      {
        id: CURRENT_USER_ID,
        name: '나',
        color: '#ffd6e0',
        meThought: '길들인다는 건 서로에게 유일한 존재가 된다는 것.',
      },
      { id: 'user-e', name: '노을빛', color: '#caffbf' },
    ],
    indexes: [
      {
        id: 'idx-lp1',
        participantId: CURRENT_USER_ID,
        pageNumber: 8,
        content:
          '어른들은 숫자를 좋아한다. 새 친구 이야기를 하면 목소리가 어떤지는 묻지 않는다. 몇 살인지, 형제가 몇 명인지를 묻는다.',
        comments: [],
        createdAt: new Date('2026-06-10T07:00:00'),
      },
      {
        id: 'idx-lp2',
        participantId: 'user-e',
        pageNumber: 63,
        content: '가장 중요한 것은 눈에 보이지 않아.',
        comments: [
          {
            id: 'cmt-lp1',
            participantId: CURRENT_USER_ID,
            content: '여우의 이 말을 처음 읽었을 때가 기억나. 그 이후로 보는 것이 달라졌어.',
            createdAt: new Date('2026-06-10T09:00:00'),
          },
        ],
        createdAt: new Date('2026-06-10T08:00:00'),
      },
      {
        id: 'idx-lp3',
        participantId: CURRENT_USER_ID,
        pageNumber: 95,
        content: '사막이 아름다운 건 어딘가에 우물을 숨기고 있기 때문이야.',
        comments: [],
        createdAt: new Date('2026-06-11T08:00:00'),
      },
    ],
  },
  {
    id: 'shared-6',
    bookId: 'kafka-on-shore',
    title: '해변의 카프카',
    author: '무라카미 하루키',
    totalPages: 624,
    ownerId: CURRENT_USER_ID, // 내 책 → 공유 중
    exchangeStatus: 'done',
    participants: [
      {
        id: CURRENT_USER_ID,
        name: '나',
        color: '#a0c4ff',
        meThought: '폭풍을 빠져나올 때 넌 이전과 같은 사람이 아니다. 그게 폭풍의 의미다.',
      },
      { id: 'user-f', name: '파도소리', color: '#fdffb6' },
    ],
    indexes: [
      {
        id: 'idx-k1',
        participantId: 'user-f',
        pageNumber: 30,
        content: '어딘가에 폭풍이 다가오고 있다. 그 폭풍을 피하려 하지 마라.',
        comments: [],
        createdAt: new Date('2026-04-01T09:00:00'),
      },
      {
        id: 'idx-k2',
        participantId: CURRENT_USER_ID,
        pageNumber: 88,
        content: '우리가 찾는 것은 항상 우리 안에 있다. 단지 찾는 법을 모를 뿐.',
        comments: [
          {
            id: 'cmt-k1',
            participantId: 'user-f',
            content: '이 책 읽는 동안 내가 뭘 찾고 있었는지 생각하게 됐어.',
            createdAt: new Date('2026-04-02T10:00:00'),
          },
        ],
        createdAt: new Date('2026-04-01T10:00:00'),
      },
      {
        id: 'idx-k3',
        participantId: 'user-f',
        pageNumber: 210,
        content: '시간은 흐르지 않는다. 우리가 시간 속을 흐를 뿐이다.',
        comments: [],
        createdAt: new Date('2026-04-05T08:00:00'),
      },
      {
        id: 'idx-k4',
        participantId: CURRENT_USER_ID,
        pageNumber: 450,
        content: '고양이와 대화할 수 있다면, 세상이 조금은 달라 보일 것이다.',
        comments: [],
        createdAt: new Date('2026-04-10T09:00:00'),
      },
    ],
  },
]

export const MOCK_SHARED = MOCK_SHARED_LIST[0]
