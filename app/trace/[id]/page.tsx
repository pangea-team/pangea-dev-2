import { type CommentRow, type TraceCardRow, mapComment, mapTraceCard } from '@/lib/mappers'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { TracePageClient } from './trace-page-client'

interface TracePageProps {
  params: Promise<{ id: string }>
}

export default async function TracePage({ params }: TracePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: traceData } = await supabase
    .from('trace_cards')
    .select(
      '*, profiles(id, nickname, avatar_url, bio, created_at), books(*), reactions(count), comments(count)',
    )
    .eq('id', id)
    .single()

  if (!traceData) notFound()

  const { data: commentsData } = await supabase
    .from('comments')
    .select('*, profiles(*)')
    .eq('trace_card_id', id)
    .order('created_at', { ascending: true })

  const card = mapTraceCard(traceData as unknown as TraceCardRow)
  const comments = (commentsData ?? []).map((c) => mapComment(c as unknown as CommentRow))

  return <TracePageClient card={card} initialComments={comments} />
}
