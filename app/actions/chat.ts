'use server'

import { createClient } from '@/lib/supabase/server'
import type { Book } from '@/lib/types'

export async function createConversation(book: Book): Promise<string> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('인증이 필요합니다.')

  // aladin_item_id(숫자 문자열)이면 upsert, UUID면 그대로 사용
  const aladinItemId = Number(book.id)
  let bookId: string

  if (!Number.isNaN(aladinItemId) && aladinItemId > 0) {
    const { data: upserted, error } = await supabase
      .from('books')
      .upsert(
        {
          aladin_item_id: aladinItemId,
          title: book.title,
          author: book.author ?? null,
          cover_url: book.coverUrl ?? null,
          isbn: book.isbn ?? null,
          publisher: book.publisher ?? null,
          published_date: book.publishedDate ?? null,
        },
        { onConflict: 'aladin_item_id' },
      )
      .select('id')
      .single()
    if (error || !upserted) throw new Error(`책 저장 실패: ${error?.message ?? ''}`)
    bookId = upserted.id
  } else {
    bookId = book.id
  }

  const { data: conversation, error: convError } = await supabase
    .from('conversations')
    .insert({ user_id: user.id, book_id: bookId })
    .select('id')
    .single()
  if (convError || !conversation) throw new Error(`대화 생성 실패: ${convError?.message ?? ''}`)

  return conversation.id
}
