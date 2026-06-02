'use server'

import { type TraceCardRow, mapTraceCard } from '@/lib/mappers'
import { deriveShareStatusMap } from '@/lib/share-status'
import { createClient } from '@/lib/supabase/server'

export async function getWorldFeed() {
  const supabase = await createClient()

  const [{ data }, { data: authData }] = await Promise.all([
    supabase
      .from('trace_cards')
      .select('*, profiles(*), books(*), reactions(count), comments(count)')
      .eq('is_public', true)
      .order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ])

  const rows = data ?? []
  let heartedSet = new Set<string>()
  let shareStatusMap = new Map<string, 'pending' | 'accepted'>()

  if (authData.user && rows.length > 0) {
    const cardIds = rows.map((r) => r.id as string)
    const [{ data: reactions }, { data: shareReqs }] = await Promise.all([
      supabase
        .from('reactions')
        .select('trace_card_id')
        .eq('user_id', authData.user.id)
        .eq('type', 'heart')
        .in('trace_card_id', cardIds),
      supabase
        .from('share_requests')
        .select('trace_card_id, status')
        .or(`requester_id.eq.${authData.user.id},owner_id.eq.${authData.user.id}`)
        .in('trace_card_id', cardIds)
        .in('status', ['accepted', 'pending']),
    ])
    heartedSet = new Set(reactions?.map((r) => r.trace_card_id) ?? [])
    shareStatusMap = deriveShareStatusMap(shareReqs ?? [])
  }

  const cards = rows.map((row) =>
    mapTraceCard(
      row as unknown as TraceCardRow,
      heartedSet.has(row.id as string),
      shareStatusMap.get(row.id as string) ?? 'none',
    ),
  )

  return { cards, currentUserId: authData.user?.id }
}
