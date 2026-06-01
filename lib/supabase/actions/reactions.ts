'use server'

import { createClient } from '@/lib/supabase/server'

export async function toggleHeart(traceCardId: string): Promise<{ hearted: boolean }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: existing } = await supabase
    .from('reactions')
    .select('id')
    .eq('trace_card_id', traceCardId)
    .eq('user_id', user.id)
    .eq('type', 'heart')
    .maybeSingle()

  if (existing) {
    const { error } = await supabase.from('reactions').delete().eq('id', existing.id)
    if (error) throw error
    return { hearted: false }
  }

  const { error } = await supabase
    .from('reactions')
    .insert({ trace_card_id: traceCardId, user_id: user.id, type: 'heart' })
  if (error) throw error
  return { hearted: true }
}
