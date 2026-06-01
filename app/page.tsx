import { BottomNav } from '@/components/layout/bottom-nav'
import { Header } from '@/components/layout/header'
import { WorldFeed } from '@/components/world-feed'
import { type TraceCardRow, mapTraceCard } from '@/lib/mappers'
import { createClient } from '@/lib/supabase/server'

export default async function WorldPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('trace_cards')
    .select('*, profiles(*), books(*), reactions(count), comments(count)')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  const cards = (data ?? []).map((row) => mapTraceCard(row as unknown as TraceCardRow))

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
