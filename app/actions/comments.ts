'use server'

import { mapComment } from '@/lib/mappers'
import { createClient } from '@/lib/supabase/server'
import type { Comment } from '@/lib/types'

export async function submitComment(traceCardId: string, content: string): Promise<Comment> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('인증이 필요합니다.')

  const { data, error } = await supabase
    .from('comments')
    .insert({ trace_card_id: traceCardId, user_id: user.id, content })
    .select('*, profiles(*)')
    .single()

  if (error) throw new Error(error.message)

  return mapComment(data as Parameters<typeof mapComment>[0])
}
