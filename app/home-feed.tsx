'use client'

import { BottomNav } from '@/components/layout/bottom-nav'
import { Header } from '@/components/layout/header'
import { WorldFeed } from '@/components/world-feed'
import { getWorldFeed } from '@/lib/supabase/actions/world'
import { useQuery } from '@tanstack/react-query'

export function HomeFeed() {
  const { data } = useQuery({
    queryKey: ['world-feed'],
    queryFn: getWorldFeed,
  })

  return (
    <div className="min-h-screen bg-background pb-16">
      <Header title="PANGEA" align="center" showLoginButton />
      <main className="max-w-2xl mx-auto">
        {!data ? (
          <div className="px-4 py-8 text-center">
            <p className="text-body-sm text-muted-foreground">불러오는 중...</p>
          </div>
        ) : (
          <WorldFeed cards={data.cards ?? []} currentUserId={data.currentUserId} />
        )}
      </main>
      <BottomNav />
    </div>
  )
}
