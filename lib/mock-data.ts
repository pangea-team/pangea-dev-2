import type { User, Book, TraceCard, Notification } from './types'

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
    publisher: '민음사',
    publishedDate: '2000-06-01',
  },
  {
    id: 'book-2',
    title: '1984',
    author: '조지 오웰',
    publisher: '민음사',
    publishedDate: '2003-06-01',
  },
  {
    id: 'book-3',
    title: '어린 왕자',
    author: '생텍쥐페리',
    publisher: '문학동네',
    publishedDate: '2007-01-01',
  },
  {
    id: 'book-4',
    title: '멋진 신세계',
    author: '올더스 헉슬리',
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
    quote: '새는 알에서 나오려고 투쟁한다. 알은 세계이다. 태어나려는 자는 하나의 세계를 깨뜨려야 한다.',
    layers: [
      {
        id: 'layer-1-1',
        type: 'me',
        content: '성장한다는 것은 결국 기존의 나를 깨부수는 일이구나. 익숙한 것에서 벗어나는 용기가 필요하다.',
        order: 0,
      },
      {
        id: 'layer-1-2',
        type: 'from-book',
        content: '싱클레어가 데미안을 만나면서 시작된 내면의 여정. 우리 모두에겐 깨야 할 알이 있다.',
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
    layers: [
      {
        id: 'layer-2-1',
        type: 'me',
        content: '보이지 않는 것들의 가치. 눈에 보이는 것만 쫓다 보면 정작 중요한 것을 놓치게 된다.',
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
]

// 내 Trace Cards (현재 사용자)
export const myTraceCards = mockTraceCards.filter(
  (card) => card.userId === currentUser.id
)

// 피드용 Trace Cards (공개된 것만)
export const feedTraceCards = mockTraceCards.filter((card) => card.isPublic)

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
