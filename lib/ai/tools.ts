import type { Database } from '@/lib/supabase/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'
import { tool } from 'ai'
import { z } from 'zod'

export function createTraceTool({
  supabase,
  userId,
  conversationId,
  bookId,
  nickname,
}: {
  supabase: SupabaseClient<Database>
  userId: string
  conversationId: string
  bookId: string
  nickname: string
}) {
  return tool({
    description:
      'trace를 생성합니다. 사용자의 생각이 충분히 정리되어 확인을 받은 뒤에만 호출합니다.',
    inputSchema: z.object({
      representative_sentence: z.string().describe('나의 한 줄 생각 (Me thought)'),
      book_quote: z.string().describe('책에서 밑줄 친 원문 문장'),
      trace_expanded: z.string().describe('생각을 확장한 글'),
    }),
    execute: async ({ representative_sentence, book_quote, trace_expanded }) => {
      const { data, error } = await supabase
        .from('trace_cards')
        .upsert(
          {
            user_id: userId,
            book_id: bookId,
            conversation_id: conversationId,
            nickname,
            representative_sentence,
            quote: book_quote,
            trace_expanded,
            is_public: true,
            layers: [],
          },
          { onConflict: 'conversation_id' },
        )
        .select('id')
        .single()

      if (error) throw new Error(error.message)
      return { traceId: data.id, success: true }
    },
  })
}
