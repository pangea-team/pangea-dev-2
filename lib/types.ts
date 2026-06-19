// PANGEA - 책 기반 SNS 타입 정의

// 사용자 프로필
export interface User {
  id: string
  nickname: string
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
    comment: number
  }
  // 현재 사용자의 반응 상태
  userReaction?: {
    hearted: boolean
  }
  shareStatus: 'none' | 'accepted'
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
  imageUrl?: string
  createdAt: Date
}

// Shared History (함께 읽기)
export type SharedParticipant = {
  id: string
  name: string
  color: string // 파스텔 hex, 아바타·타임라인 탭에 사용
  meThought?: string // DB: representative_sentence. 주인 대표문장: participants.find(p => p.id === ownerId)?.meThought
}

export type SharedIndexComment = {
  id: string
  participantId: string // DB: participant_id
  content: string // DB: content
  imageUrl?: string // DB: image_url
  createdAt: Date // DB: created_at
}

export type SharedIndex = {
  id: string
  participantId: string // DB: participant_id
  pageNumber: number // DB: page_number
  content: string // DB: content
  imageUrl?: string // DB: image_url
  comments: SharedIndexComment[]
  createdAt: Date // DB: created_at
}

export type Shared = {
  id: string
  bookId: string
  title: string
  author: string
  totalPages: number
  ownerId: string // 이 책을 올린 주인. currentUserId와 비교: ownerId === me → 공유 중, ownerId !== me → 읽는 중
  exchangeStatus: 'reading' | 'returning' | 'arrived' | 'done' // 교환 진행 상태
  participants: SharedParticipant[]
  indexes: SharedIndex[]
}

// 피드 필터
export type FeedFilter = 'all' | 'following' | 'recent'

// 알림 타입
export type NotificationType = 'like' | 'comment' | 'exchange_matched'

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
