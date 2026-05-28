import type { Book, Comment, Notification, TraceCard, User } from './types'

// 목업 사용자
export const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'bookworm_kim',
    displayName: '김독서',
    avatarUrl: undefined,
    bio: '책과 함께 성장하는 중',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'user-2',
    username: 'reader_lee',
    displayName: '이문학',
    avatarUrl: undefined,
    bio: '문학을 사랑하는 독자',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'user-3',
    username: 'page_turner',
    displayName: '박페이지',
    avatarUrl: undefined,
    bio: '하루 한 권 도전 중',
    createdAt: new Date('2024-03-10'),
  },
]

// 현재 사용자 (로그인된 사용자)
export const currentUser: User = mockUsers[0]

// 목업 도서
export const mockBooks: Book[] = [
  {
    id: 'book-1',
    title: '데미안',
    author: '헤르만 헤세',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
    publisher: '민음사',
    publishedDate: '2000-06-01',
  },
  {
    id: 'book-2',
    title: '1984',
    author: '조지 오웰',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop',
    publisher: '민음사',
    publishedDate: '2003-06-01',
  },
  {
    id: 'book-3',
    title: '어린 왕자',
    author: '생텍쥐페리',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop',
    publisher: '문학동네',
    publishedDate: '2007-01-01',
  },
  {
    id: 'book-4',
    title: '멋진 신세계',
    author: '올더스 헉슬리',
    coverUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=450&fit=crop',
    publisher: '소담출판사',
    publishedDate: '2015-03-01',
  },
]

// 목업 Trace Cards
export const mockTraceCards: TraceCard[] = [
  {
    id: 'trace-1',
    userId: 'user-2',
    user: mockUsers[1],
    book: mockBooks[0],
    quote:
      '새는 알에서 나오려고 투쟁한다. 알은 세계이다. 태어나려는 자는 하나의 세계를 깨뜨려야 한다.',
    meThought: '성장한다는 것은 결국 기존의 나를 깨부수는 일이구나.',
    traceExpanded: `익숙한 것에서 벗어나는 용기가 필요하다.

싱클레어가 데미안을 만나면서 시작된 내면의 여정. 우리 모두에겐 깨야 할 알이 있다.

나는 지금 어떤 알 속에 있는 걸까? 안전하다고 느끼는 이 공간이 사실은 나를 가두고 있는 건 아닐까.

변화를 두려워하지 말자. 깨어짐은 끝이 아니라 시작이니까.`,
    layers: [
      {
        id: 'layer-1-1',
        type: 'me',
        content:
          '성장한다는 것은 결국 기존의 나를 깨부수는 일이구나. 익숙한 것에서 벗어나는 용기가 필요하다.',
        order: 0,
      },
      {
        id: 'layer-1-2',
        type: 'from-book',
        content:
          '싱클레어가 데미안을 만나면서 시작된 내면의 여정. 우리 모두에겐 깨야 할 알이 있다.',
        order: 1,
      },
    ],
    isPublic: true,
    createdAt: new Date('2024-05-20T10:30:00'),
    updatedAt: new Date('2024-05-20T10:30:00'),
    reactions: { heart: 24, bookmark: 8, comment: 3 },
    userReaction: { hearted: false, bookmarked: true },
  },
  {
    id: 'trace-2',
    userId: 'user-3',
    user: mockUsers[2],
    book: mockBooks[2],
    quote: '사막이 아름다운 것은 어딘가에 샘을 숨기고 있기 때문이야.',
    meThought: '보이지 않는 것들의 가치를 믿는다.',
    traceExpanded: `눈에 보이는 것만 쫓다 보면 정작 중요한 것을 놓치게 된다.

어린 왕자가 여우에게 배운 것처럼, 본질적인 것은 눈에 보이지 않는다.

우리는 너무 빨리 지나치고, 너무 쉽게 판단하고, 너무 자주 잊어버린다.

가끔은 멈춰 서서, 보이지 않는 것들을 느껴보는 시간이 필요하다.`,
    layers: [
      {
        id: 'layer-2-1',
        type: 'me',
        content:
          '보이지 않는 것들의 가치. 눈에 보이는 것만 쫓다 보면 정작 중요한 것을 놓치게 된다.',
        order: 0,
      },
    ],
    isPublic: true,
    createdAt: new Date('2024-05-19T15:20:00'),
    updatedAt: new Date('2024-05-19T15:20:00'),
    reactions: { heart: 42, bookmark: 15, comment: 7 },
    userReaction: { hearted: true, bookmarked: false },
  },
  {
    id: 'trace-3',
    userId: 'user-1',
    user: mockUsers[0],
    book: mockBooks[1],
    quote: '자유는 2 더하기 2가 4라고 말할 수 있는 자유다.',
    meThought: '진실을 말할 수 있는 자유, 그것이 진짜 자유다.',
    traceExpanded: `지금 우리 사회에서도 여전히 유효한 메시지다.

오웰이 전체주의 사회를 비판하며 쓴 이 문장은 70년이 지난 지금도 울림이 있다.

당연한 것을 당연하다고 말할 수 없을 때, 우리는 이미 자유를 잃은 것이다.

2+2=4. 이 단순한 진실을 지키는 것이 왜 이렇게 어려운 걸까.`,
    layers: [
      {
        id: 'layer-3-1',
        type: 'me',
        content: '진실을 말할 수 있는 자유. 지금 우리 사회에서도 여전히 유효한 메시지다.',
        order: 0,
      },
      {
        id: 'layer-3-2',
        type: 'context',
        content: '오웰이 전체주의 사회를 비판하며 쓴 이 문장은 70년이 지난 지금도 울림이 있다.',
        order: 1,
      },
    ],
    isPublic: true,
    createdAt: new Date('2024-05-18T09:15:00'),
    updatedAt: new Date('2024-05-18T09:15:00'),
    reactions: { heart: 18, bookmark: 6, comment: 2 },
    userReaction: { hearted: false, bookmarked: false },
  },
  {
    id: 'trace-4',
    userId: 'user-2',
    user: mockUsers[1],
    book: mockBooks[3],
    quote: '행복하기 위해서는 진실을 외면해야 하고, 진실을 보기 위해서는 행복을 포기해야 한다.',
    meThought: '편안한 무지와 불편한 진실 사이, 나는 어디에 서 있는가.',
    traceExpanded: `소마로 마취된 사회에서 버나드의 질문은 불편하지만 필수적이다.

나는 어떤 삶을 살고 싶은가? 편안하지만 거짓된 삶인가, 불편하지만 진실한 삶인가.

헉슬리가 그린 미래는 더 이상 미래가 아니다. 우리는 이미 그 안에 살고 있다.

스마트폰, SNS, 알고리즘... 우리의 소마는 이미 우리 손안에 있다.`,
    layers: [
      {
        id: 'layer-4-1',
        type: 'me',
        content: '편안한 무지와 불편한 진실 사이의 선택. 나는 어떤 삶을 살고 싶은가?',
        order: 0,
      },
      {
        id: 'layer-4-2',
        type: 'from-book',
        content: '소마로 마취된 사회에서 버나드의 질문은 불편하지만 필수적이다.',
        order: 1,
      },
    ],
    isPublic: true,
    createdAt: new Date('2024-05-17T20:45:00'),
    updatedAt: new Date('2024-05-17T20:45:00'),
    reactions: { heart: 31, bookmark: 12, comment: 5 },
    userReaction: { hearted: true, bookmarked: true },
  },
  {
    id: 'trace-5',
    userId: 'user-1',
    user: mockUsers[0],
    book: {
      id: 'book-5',
      title: '피노키오',
      author: '카를로 콜로디',
      coverUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&h=450&fit=crop',
      publisher: '민음사',
      publishedDate: '1883-01-01',
    },
    quote: '값비싼 나무토막이 아니라 단순한 땔감용 나무토막이었습니다.',
    meThought: '완성된 존재보다, 자유롭게 흔들리며 자기 모습을 만들어가는 존재가 좋다.',
    traceExpanded: `처음부터 특별한 존재였다는 이야기보다, 평범하고 작은 시작이 더 오래 남았다.

피노키오는 착한 아이는 아니다. 거짓말도 하고, 사고도 치고, 자꾸 옆길로 샌다. 근데 이상하게 살아 있다.

자유롭고, 당당하고, 자기 호기심을 숨기지 않는다.

그래서 미워하기보다 "그냥 어린애지 뭐" 하는 마음으로 보게 된다.

그리고 그런 피노키오 곁에는 귀뚜라미와 새처럼 붙잡아주는 존재들이 있고, 악역조차 재채기로 연민을 숨기지 못한다.

완벽하게 선하거나 완성된 세계가 아니라, 흔들리고 부딪히면서도 조금씩 자기 모습을 만들어가는 세계.

결국 이 문장에 끌렸다.

"값비싼 나무토막이 아니라 단순한 땔감용 나무토막이었습니다."`,
    layers: [],
    isPublic: true,
    createdAt: new Date('2024-05-21T11:00:00'),
    updatedAt: new Date('2024-05-21T11:00:00'),
    reactions: { heart: 56, bookmark: 23, comment: 12 },
    userReaction: { hearted: false, bookmarked: false },
  },
]

// 내 Trace Cards (현재 사용자)
export const myTraceCards = mockTraceCards.filter((card) => card.userId === currentUser.id)

// 피드용 Trace Cards (공개된 것만)
export const feedTraceCards = mockTraceCards.filter((card) => card.isPublic)

// 목업 댓글
export const mockComments: Comment[] = [
  {
    id: 'comment-1',
    userId: 'user-2',
    user: mockUsers[1],
    traceCardId: 'trace-1',
    content: '정말 공감되는 해석이에요. 저도 데미안 읽으면서 비슷한 생각을 했어요.',
    createdAt: new Date('2024-05-20T11:00:00'),
  },
  {
    id: 'comment-2',
    userId: 'user-3',
    user: mockUsers[2],
    traceCardId: 'trace-1',
    content: '깨어짐은 끝이 아니라 시작이라는 말이 인상적이네요.',
    createdAt: new Date('2024-05-20T12:30:00'),
  },
  {
    id: 'comment-3',
    userId: 'user-1',
    user: mockUsers[0],
    traceCardId: 'trace-1',
    content: '이 문장 덕분에 데미안 다시 읽고 싶어졌어요!',
    createdAt: new Date('2024-05-20T14:15:00'),
  },
  {
    id: 'comment-4',
    userId: 'user-1',
    user: mockUsers[0],
    traceCardId: 'trace-2',
    content: '어린 왕자는 읽을 때마다 새로운 의미가 느껴지는 것 같아요.',
    createdAt: new Date('2024-05-19T16:00:00'),
  },
  {
    id: 'comment-5',
    userId: 'user-2',
    user: mockUsers[1],
    traceCardId: 'trace-2',
    content: '보이지 않는 것들의 가치... 요즘 세상에 정말 필요한 메시지예요.',
    createdAt: new Date('2024-05-19T17:30:00'),
  },
  {
    id: 'comment-6',
    userId: 'user-3',
    user: mockUsers[2],
    traceCardId: 'trace-5',
    content: '피노키오를 이런 시각으로 본 적이 없었는데, 완전 새롭네요!',
    createdAt: new Date('2024-05-21T12:00:00'),
  },
  {
    id: 'comment-7',
    userId: 'user-2',
    user: mockUsers[1],
    traceCardId: 'trace-5',
    content: '흔들리면서 자기 모습을 만들어간다는 표현이 좋아요.',
    createdAt: new Date('2024-05-21T13:00:00'),
  },
]

// traceCardId로 댓글 가져오기
export const getCommentsByTraceCardId = (traceCardId: string): Comment[] => {
  return mockComments.filter((comment) => comment.traceCardId === traceCardId)
}

// 목업 알림
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'like',
    fromUser: mockUsers[1],
    traceCard: mockTraceCards[2],
    message: '님이 회원님의 Trace Card를 좋아합니다.',
    isRead: false,
    createdAt: new Date('2024-05-20T14:30:00'),
  },
  {
    id: 'notif-2',
    type: 'comment',
    fromUser: mockUsers[2],
    traceCard: mockTraceCards[2],
    message: '님이 회원님의 Trace Card에 댓글을 남겼습니다.',
    isRead: false,
    createdAt: new Date('2024-05-20T12:15:00'),
  },
  {
    id: 'notif-3',
    type: 'exchange_request',
    fromUser: mockUsers[1],
    traceCard: mockTraceCards[0],
    message: '님이 교환을 요청했습니다.',
    isRead: false,
    createdAt: new Date('2024-05-19T18:45:00'),
  },
  {
    id: 'notif-4',
    type: 'like',
    fromUser: mockUsers[2],
    traceCard: mockTraceCards[2],
    message: '님이 회원님의 Trace Card를 좋아합니다.',
    isRead: true,
    createdAt: new Date('2024-05-18T09:20:00'),
  },
  {
    id: 'notif-5',
    type: 'exchange_accepted',
    fromUser: mockUsers[1],
    traceCard: mockTraceCards[3],
    message: '님이 교환 요청을 수락했습니다.',
    isRead: true,
    createdAt: new Date('2024-05-17T16:00:00'),
  },
]
