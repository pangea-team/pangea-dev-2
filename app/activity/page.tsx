'use client'

import { BottomNav } from '@/components/layout/bottom-nav'
import { Header } from '@/components/layout/header'
import { NotificationItem, type NotificationItemData } from '@/components/notification-item'
import { PATH } from '@/constants/path'
import { getMyNotifications } from '@/lib/supabase/actions/notifications'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ActivityPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationItemData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyNotifications()
      .then(setNotifications)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleCardClick = (traceCardId: string) => {
    router.push(PATH.TRACE(traceCardId))
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <Header title="활동" />

      <main className="max-w-2xl mx-auto">
        {loading ? (
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
  )
}
