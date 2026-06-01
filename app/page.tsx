import { BottomNav } from '@/components/layout/bottom-nav'
import { Header } from '@/components/layout/header'
import { WorldFeed } from '@/components/world-feed'
import { type TraceCardRow, mapTraceCard } from '@/lib/mappers'
import { createClient } from '@/lib/supabase/server'

export default async function WorldPage() {
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

  if (authData.user && rows.length > 0) {
    const { data: reactions } = await supabase
      .from('reactions')
      .select('trace_card_id')
      .eq('user_id', authData.user.id)
      .eq('type', 'heart')
      .in(
        'trace_card_id',
        rows.map((r) => r.id as string),
      )
    heartedSet = new Set(reactions?.map((r) => r.trace_card_id) ?? [])
  }

  const cards = rows.map((row) =>
    mapTraceCard(row as unknown as TraceCardRow, heartedSet.has(row.id as string)),
  )

  return (
    <div className="min-h-screen bg-background pb-16">
      <Header title="PANGEA" align="center" showLoginButton />
      <main className="max-w-2xl mx-auto">
        <WorldFeed cards={cards} />
      </main>
      <BottomNav />
    </div>
  )
}
