import type { Comment, TraceCard, TraceLayer } from './types'

type ProfileRow = {
  id: string
  username: string | null
  display_name: string
  avatar_url: string | null
  bio: string | null
  created_at: string
}

export type TraceCardRow = {
  id: string
  user_id: string
  book_id: string
  quote: string | null
  me_thought: string | null
  trace_expanded: string | null
  layers: unknown
  is_public: boolean
  created_at: string
  updated_at: string
  profiles: ProfileRow | null
  books: {
    id: string
    title: string
    author: string | null
    cover_url: string | null
    isbn: string | null
    publisher: string | null
    published_date: string | null
  } | null
  reactions: { count: number | null }[]
  comments: { count: number | null }[]
}

export type CommentRow = {
  id: string
  user_id: string
  trace_card_id: string
  content: string
  created_at: string
  profiles: ProfileRow | null
}

export function mapTraceCard(row: TraceCardRow): TraceCard {
  return {
    id: row.id,
    userId: row.user_id,
    user: {
      id: row.profiles?.id ?? row.user_id,
      username: row.profiles?.username ?? '',
      displayName: row.profiles?.display_name ?? 'Unknown',
      avatarUrl: row.profiles?.avatar_url ?? undefined,
      bio: row.profiles?.bio ?? undefined,
      createdAt: new Date(row.profiles?.created_at ?? row.created_at),
    },
    book: {
      id: row.books?.id ?? row.book_id,
      title: row.books?.title ?? '',
      author: row.books?.author ?? '',
      coverUrl: row.books?.cover_url ?? undefined,
      isbn: row.books?.isbn ?? undefined,
      publisher: row.books?.publisher ?? undefined,
      publishedDate: row.books?.published_date ?? undefined,
    },
    quote: row.quote ?? '',
    meThought: row.me_thought ?? '',
    traceExpanded: row.trace_expanded ?? '',
    layers: Array.isArray(row.layers) ? (row.layers as TraceLayer[]) : [],
    isPublic: row.is_public,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    reactions: {
      heart: row.reactions[0]?.count ?? 0,
      comment: row.comments[0]?.count ?? 0,
    },
    // TODO: auth 연동 후 현재 유저 반응 조회로 교체
    userReaction: { hearted: false },
  }
}

export function mapComment(row: CommentRow): Comment {
  return {
    id: row.id,
    userId: row.user_id,
    user: {
      id: row.profiles?.id ?? row.user_id,
      username: row.profiles?.username ?? '',
      displayName: row.profiles?.display_name ?? 'Unknown',
      avatarUrl: row.profiles?.avatar_url ?? undefined,
      bio: row.profiles?.bio ?? undefined,
      createdAt: new Date(row.profiles?.created_at ?? row.created_at),
    },
    traceCardId: row.trace_card_id,
    content: row.content,
    createdAt: new Date(row.created_at),
  }
}
