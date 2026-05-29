// PANGEA - 책 기반 SNS 타입 정의

// 사용자 프로필
export interface User {
  id: string
  username: string
  displayName: string
  avatarUrl?: string
  bio?: string
  createdAt: Date
}

// 도서 정보
export interface Book {
  id: string
  title: string
  author: string
  coverUrl?: string
  isbn?: string
  publisher?: string
  publishedDate?: string
}

// Trace 계층 (다층 구조)
export interface TraceLayer {
  id: string
  type: 'me' | 'from-book' | 'context'
  content: string
  order: number
}

// Trace
export interface TraceCard {
  id: string
  userId: string
  user: User
  book: Book
  quote: string // 밑줄 친 문장
  meThought: string // 나의 한 줄 생각 (Me)
  traceExpanded: string // 확장된 흔적 글 (Trace Expanded)
  layers: TraceLayer[] // 다층 감상 (레거시, 추후 제거 가능)
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  // 상호작용
  reactions: {
    heart: number
    bookmark: number
    comment: number
  }
  // 현재 사용자의 반응 상태
  userReaction?: {
    hearted: boolean
    bookmarked: boolean
  }
}

// Trace 생성 폼 데이터
export interface CreateTraceCardForm {
  book: {
    title: string
    author: string
  }
  quote: string
  layers: Omit<TraceLayer, 'id'>[]
  isPublic: boolean
}

// 댓글
export interface Comment {
  id: string
  userId: string
  user: User
  traceCardId: string
  content: string
  createdAt: Date
}

// 피드 필터
export type FeedFilter = 'all' | 'following' | 'recent'

// 알림 타입
export type NotificationType = 'like' | 'comment' | 'exchange_request' | 'exchange_accepted'

// 알림
export interface Notification {
  id: string
  type: NotificationType
  fromUser: User
  traceCard?: TraceCard
  message: string
  isRead: boolean
  createdAt: Date
}
