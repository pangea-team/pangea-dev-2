'use server'

import { type CommentRow, mapComment } from '@/lib/mappers'
import { createClient } from '@/lib/supabase/server'
import type { Comment } from '@/lib/types'

export async function addComment(traceCardId: string, content: string): Promise<Comment> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('comments')
    .insert({ trace_card_id: traceCardId, user_id: user.id, content: content.trim() })
    .select('*, profiles(*)')
    .single()

  if (error) throw error
  return mapComment(data as unknown as CommentRow)
}
