'use client'

import { BottomNav } from '@/components/layout/bottom-nav'
import { Header } from '@/components/layout/header'
import { NotificationItem } from '@/components/notification-item'
import { RequireAuth } from '@/components/require-auth'
import { PATH } from '@/constants/path'
import { getMyNotifications } from '@/lib/supabase/actions/notifications'
import { useQuery } from '@tanstack/react-query'
import { Heart } from 'lucide-react'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'

export default function DiscoverPage() {
  const router = useRouter()

  const { data: notifications = [], isPending } = useQuery({
    queryKey: ['notifications'],
    queryFn: getMyNotifications,
  })

  const handleCardClick = (traceCardId: string) => {
    router.push(PATH.TRACE_WITH_FROM(traceCardId, PATH.DISCOVER) as Route)
  }

  return (
    <RequireAuth redirectTo={PATH.DISCOVER}>
      <div className="min-h-screen bg-background pb-16">
        <Header title="발견" align="left" />

        <main className="max-w-2xl mx-auto">
          {isPending ? (
            <div className="px-4 py-8 text-center">
              <p className="text-body-sm text-muted-foreground">불러오는 중...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onCardClick={handleCardClick}
                />
              ))}
            </div>
          ) : (
            <div className="px-4 py-12 text-center">
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
                <Heart className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-heading-sm mb-1">아직 알림이 없습니다</h3>
              <p className="text-body-sm text-muted-foreground">
                다른 사용자가 회원님의 Trace에 반응하면 여기에 표시됩니다.
              </p>
            </div>
          )}
        </main>

        <BottomNav />
      </div>
    </RequireAuth>
  )
}
