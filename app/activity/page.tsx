'use client'

import { BottomNav } from '@/components/layout/bottom-nav'
import { Header } from '@/components/layout/header'
import { NotificationItem, type NotificationItemData } from '@/components/notification-item'
import { PATH } from '@/constants/path'
import { getMyNotifications } from '@/lib/supabase/actions/notifications'
import { acceptShare, getShareRequest, rejectShare } from '@/lib/supabase/actions/share'
import { Heart } from 'lucide-react'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

type ShareRequestDetail = Awaited<ReturnType<typeof getShareRequest>>

export default function ActivityPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationItemData[]>([])
  const [loading, setLoading] = useState(true)
  const [shareRequestDetail, setShareRequestDetail] = useState<ShareRequestDetail | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const loadNotifications = useCallback(() => {
    getMyNotifications()
      .then(setNotifications)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  const handleNotificationClick = async (notification: NotificationItemData) => {
    if (notification.type === 'exchange_request') {
      if (!notification.traceCard) return
      const detail = await getShareRequest(notification.traceCard.id, notification.fromUser.id)
      setShareRequestDetail(detail)
      setSheetOpen(true)
    } else if (notification.traceCard) {
      router.push(PATH.TRACE(notification.traceCard.id) as Route)
    }
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
                onCardClick={() => handleNotificationClick(notification)}
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

      {sheetOpen && shareRequestDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-sm w-full mx-4">
            <h2 className="text-heading-md mb-2">Share 신청</h2>
            <p className="text-body-sm">
              <span className="font-semibold">
                {shareRequestDetail.trace_cards?.representative_sentence ?? ''}
              </span>
            </p>
            <p className="text-body-sm text-muted-foreground mt-2">
              《{(shareRequestDetail.trace_cards?.books as { title?: string } | null)?.title ?? ''}
              》
            </p>

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                className="flex-1 px-4 py-2 rounded-lg border border-border text-body-sm"
                onClick={async () => {
                  await rejectShare(shareRequestDetail.id)
                  setSheetOpen(false)
                  loadNotifications()
                }}
              >
                거절
              </button>
              <button
                type="button"
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-body-sm"
                onClick={async () => {
                  await acceptShare(shareRequestDetail.id)
                  setSheetOpen(false)
                  loadNotifications()
                }}
              >
                수락
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
