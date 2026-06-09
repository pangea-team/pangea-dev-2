import { HomeFeed } from '@/app/home-feed'
import { getQueryClient } from '@/lib/query-client'
import { getWorldFeed } from '@/lib/supabase/actions/world'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'

export default async function WorldPage() {
  const qc = getQueryClient()
  await qc.prefetchQuery({ queryKey: ['world-feed'], queryFn: getWorldFeed })

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <HomeFeed />
    </HydrationBoundary>
  )
}
