'use server'

import { createClient } from '@/lib/supabase/server'
import type { TraceCard, TraceLayer } from '@/lib/types'

export async function getMyTraceCards(): Promise<TraceCard[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const [{ data: rows, error }, { data: reactions }, { data: shareReqs }] = await Promise.all([
    supabase
      .from('trace_cards_with_counts')
      .select(
        'id, user_id, quote, representative_sentence, trace_expanded, layers, is_public, heart_count, comment_count, created_at, updated_at, books(id, title, author, cover_url, isbn, publisher, published_date), profiles(id, nickname, avatar_url, bio, created_at)',
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase.from('reactions').select('trace_card_id').eq('user_id', user.id).eq('type', 'heart'),
    supabase
      .from('share_requests')
      .select('trace_card_id, status')
      .or(`requester_id.eq.${user.id},owner_id.eq.${user.id}`)
      .in('status', ['accepted', 'pending']),
  ])

  if (error || !rows) return []

  const heartedSet = new Set(reactions?.map((r) => r.trace_card_id) ?? [])
  const shareStatusMap = new Map<string, 'pending' | 'accepted'>()
  for (const req of shareReqs ?? []) {
    if (!req.trace_card_id) continue
    const existing = shareStatusMap.get(req.trace_card_id)
    if (req.status === 'accepted') {
      shareStatusMap.set(req.trace_card_id, 'accepted')
    } else if (req.status === 'pending' && existing !== 'accepted') {
      shareStatusMap.set(req.trace_card_id, 'pending')
    }
  }

  return rows
    .filter((r): r is typeof r & { id: string } => r.id !== null)
    .map((r) => {
      const book = (Array.isArray(r.books) ? r.books[0] : r.books) as {
        id: string
        title: string
        author: string | null
        cover_url: string | null
        isbn: string | null
        publisher: string | null
        published_date: string | null
      } | null

      const profile = (Array.isArray(r.profiles) ? r.profiles[0] : r.profiles) as {
        id: string
        nickname: string | null
        avatar_url: string | null
        bio: string | null
        created_at: string
      } | null

      return {
        id: r.id,
        userId: r.user_id ?? '',
        user: {
          id: profile?.id ?? user.id,
          nickname: profile?.nickname ?? '',
          avatarUrl: profile?.avatar_url ?? undefined,
          bio: profile?.bio ?? undefined,
          createdAt: new Date(profile?.created_at ?? r.created_at ?? ''),
        },
        book: {
          id: book?.id ?? '',
          title: book?.title ?? '',
          author: book?.author ?? '',
          coverUrl: book?.cover_url ?? undefined,
          isbn: book?.isbn ?? undefined,
          publisher: book?.publisher ?? undefined,
          publishedDate: book?.published_date ?? undefined,
        },
        quote: r.quote ?? '',
        meThought: r.representative_sentence ?? '',
        traceExpanded: r.trace_expanded ?? '',
        layers: (r.layers as unknown as TraceLayer[]) ?? [],
        isPublic: r.is_public ?? false,
        createdAt: new Date(r.created_at ?? ''),
        updatedAt: new Date(r.updated_at ?? ''),
        reactions: {
          heart: Number(r.heart_count ?? 0),
          comment: Number(r.comment_count ?? 0),
        },
        userReaction: { hearted: heartedSet.has(r.id) },
        shareStatus: shareStatusMap.get(r.id) ?? 'none',
      } satisfies TraceCard
    })
}

export async function getUserTraceCards(
  userId: string,
): Promise<{ cards: TraceCard[]; currentUserId: string | undefined }> {
  const supabase = await createClient()

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  const [{ data: rows, error }, { data: reactions }, { data: shareReqs }] = await Promise.all([
    supabase
      .from('trace_cards_with_counts')
      .select(
        'id, user_id, quote, representative_sentence, trace_expanded, layers, is_public, heart_count, comment_count, created_at, updated_at, books(id, title, author, cover_url, isbn, publisher, published_date), profiles(id, nickname, avatar_url, bio, created_at)',
      )
      .eq('user_id', userId)
      .eq('is_public', true)
      .order('created_at', { ascending: false }),
    currentUser
      ? supabase
          .from('reactions')
          .select('trace_card_id')
          .eq('user_id', currentUser.id)
          .eq('type', 'heart')
      : Promise.resolve({ data: [] }),
    currentUser
      ? supabase
          .from('share_requests')
          .select('trace_card_id, status')
          .or(`requester_id.eq.${currentUser.id},owner_id.eq.${currentUser.id}`)
          .in('status', ['accepted', 'pending'])
      : Promise.resolve({ data: [] }),
  ])

  if (error || !rows) return { cards: [], currentUserId: currentUser?.id }

  const heartedSet = new Set(
    (reactions as { trace_card_id: string }[] | null)?.map((r) => r.trace_card_id) ?? [],
  )
  const shareStatusMap = new Map<string, 'pending' | 'accepted'>()
  for (const req of (shareReqs as { trace_card_id: string | null; status: string }[] | null) ??
    []) {
    if (!req.trace_card_id) continue
    const existing = shareStatusMap.get(req.trace_card_id)
    if (req.status === 'accepted') {
      shareStatusMap.set(req.trace_card_id, 'accepted')
    } else if (req.status === 'pending' && existing !== 'accepted') {
      shareStatusMap.set(req.trace_card_id, 'pending')
    }
  }

  const cards = rows
    .filter((r): r is typeof r & { id: string } => r.id !== null)
    .map((r) => {
      const book = (Array.isArray(r.books) ? r.books[0] : r.books) as {
        id: string
        title: string
        author: string | null
        cover_url: string | null
        isbn: string | null
        publisher: string | null
        published_date: string | null
      } | null

      const profile = (Array.isArray(r.profiles) ? r.profiles[0] : r.profiles) as {
        id: string
        nickname: string | null
        avatar_url: string | null
        bio: string | null
        created_at: string
      } | null

      return {
        id: r.id,
        userId: r.user_id ?? '',
        user: {
          id: profile?.id ?? userId,
          nickname: profile?.nickname ?? '',
          avatarUrl: profile?.avatar_url ?? undefined,
          bio: profile?.bio ?? undefined,
          createdAt: new Date(profile?.created_at ?? r.created_at ?? ''),
        },
        book: {
          id: book?.id ?? '',
          title: book?.title ?? '',
          author: book?.author ?? '',
          coverUrl: book?.cover_url ?? undefined,
          isbn: book?.isbn ?? undefined,
          publisher: book?.publisher ?? undefined,
          publishedDate: book?.published_date ?? undefined,
        },
        quote: r.quote ?? '',
        meThought: r.representative_sentence ?? '',
        traceExpanded: r.trace_expanded ?? '',
        layers: (r.layers as unknown as TraceLayer[]) ?? [],
        isPublic: r.is_public ?? false,
        createdAt: new Date(r.created_at ?? ''),
        updatedAt: new Date(r.updated_at ?? ''),
        reactions: {
          heart: Number(r.heart_count ?? 0),
          comment: Number(r.comment_count ?? 0),
        },
        userReaction: { hearted: heartedSet.has(r.id) },
        shareStatus: shareStatusMap.get(r.id) ?? 'none',
      } satisfies TraceCard
    })

  return { cards, currentUserId: currentUser?.id }
}

export async function getUserProfile(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, nickname, avatar_url, bio, created_at')
    .eq('id', userId)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    nickname: data.nickname ?? '',
    avatarUrl: data.avatar_url ?? undefined,
    bio: data.bio ?? undefined,
    createdAt: new Date(data.created_at),
  }
}
