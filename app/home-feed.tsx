'use client'

import { BottomNav } from '@/components/layout/bottom-nav'
import { Header } from '@/components/layout/header'
import { WorldFeed } from '@/components/world-feed'
import { getWorldFeed } from '@/lib/supabase/actions/world'
import { createClient } from '@/lib/supabase/client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export function HomeFeed() {
  const queryClient = useQueryClient()
  const { data, isError } = useQuery({
    queryKey: ['world-feed'],
    queryFn: getWorldFeed,
  })

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('share-requests-sold-out')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'share_requests',
          filter: 'status=eq.accepted',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['world-feed'] })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])

  return (
    <div className="min-h-screen bg-background pb-16">
      <Header title="PANGEA" align="center" showLoginButton />
      <main className="max-w-2xl mx-auto">
        {isError ? (
          <div className="px-4 py-8 text-center">
            <p className="text-body-sm text-destructive">
              피드를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
            </p>
          </div>
        ) : !data ? (
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
