'use server'

import { createClient } from '@/lib/supabase/server'

export async function requestShare(traceCardId: string, ownerId: string): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('share_requests')
    .insert({ trace_card_id: traceCardId, requester_id: user.id, owner_id: ownerId })
  if (error) throw error
}

export async function getShareRequest(traceCardId: string, requesterId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('share_requests')
    .select(
      'id, status, message, created_at, trace_cards(id, representative_sentence, books(title, cover_url))',
    )
    .eq('trace_card_id', traceCardId)
    .eq('requester_id', requesterId)
    .eq('status', 'pending')
    .single()

  if (error) throw error
  return data
}

export async function acceptShare(shareRequestId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('share_requests')
    .update({ status: 'accepted' })
    .eq('id', shareRequestId)
  if (error) throw error
}

export async function rejectShare(shareRequestId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('share_requests')
    .update({ status: 'rejected' })
    .eq('id', shareRequestId)
  if (error) throw error
}
