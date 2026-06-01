'use server'

import { createClient } from '@/lib/supabase/server'

export async function getMyNotifications() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('notifications')
    .select(
      'id, type, message, is_read, created_at, trace_card_id, from_user:profiles!from_user_id(id, nickname, avatar_url), trace_cards(id, quote)',
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return []

  return (data ?? []).map((n) => {
    const fromUser = Array.isArray(n.from_user) ? n.from_user[0] : n.from_user
    const traceCard = Array.isArray(n.trace_cards) ? n.trace_cards[0] : n.trace_cards

    return {
      id: n.id,
      type: n.type as 'like' | 'comment' | 'exchange_request' | 'exchange_accepted',
      fromUser: {
        id: fromUser?.id ?? '',
        nickname: fromUser?.nickname ?? '',
        avatarUrl: fromUser?.avatar_url ?? undefined,
      },
      traceCard: traceCard
        ? {
            id: traceCard.id,
            quote: traceCard.quote ?? '',
          }
        : undefined,
      message: n.message,
      isRead: n.is_read,
      createdAt: new Date(n.created_at),
    }
  })
}

export async function markNotificationRead(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id)
  if (error) throw error
}

export async function markAllNotificationsRead() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
  if (error) throw error
}
