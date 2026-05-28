'use client'

import { BottomNav } from '@/components/layout/bottom-nav'
import { Header } from '@/components/layout/header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { mockNotifications } from '@/lib/mock-data'
import type { Notification, NotificationType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ArrowLeftRight, Check, Heart, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'like':
      return <Heart className="size-4 text-foreground fill-current" />
    case 'comment':
      return <MessageCircle className="size-4 text-foreground" />
    case 'exchange_request':
      return <ArrowLeftRight className="size-4 text-foreground" />
    case 'exchange_accepted':
      return <Check className="size-4 text-(--color-success)" />
    default:
      return null
  }
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return '방금 전'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

function NotificationItem({
  notification,
  onCardClick,
}: {
  notification: Notification
  onCardClick: (traceCardId: string) => void
}) {
  return (
    <button
      type="button"
      className={cn(
        'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50',
        !notification.isRead && 'bg-primary/5',
      )}
      onClick={() => notification.traceCard && onCardClick(notification.traceCard.id)}
    >
      <div className="relative">
        <Avatar className="size-10">
          <AvatarImage
            src={notification.fromUser.avatarUrl}
            alt={notification.fromUser.displayName}
          />
          <AvatarFallback className="text-sm font-medium">
            {notification.fromUser.displayName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-background flex items-center justify-center">
          {getNotificationIcon(notification.type)}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-semibold">{notification.fromUser.displayName}</span>
          <span className="text-muted-foreground">{notification.message}</span>
        </p>
        {notification.traceCard && (
          <p className="text-xs text-muted-foreground mt-1 truncate">
            &quot;{notification.traceCard.quote.slice(0, 40)}...&quot;
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>

      {!notification.isRead && <div className="size-2 rounded-full bg-primary mt-2 shrink-0" />}
    </button>
  )
}

export default function DiscoverPage() {
  const router = useRouter()
  const notifications = mockNotifications

  const handleCardClick = (traceCardId: string) => {
    router.push(`/trace/${traceCardId}?from=/discover`)
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <Header title="발견" align="left" />

      <main className="max-w-lg mx-auto">
        {notifications.length > 0 ? (
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
            <h3 className="font-medium mb-1">아직 알림이 없습니다</h3>
            <p className="text-sm text-muted-foreground">
              다른 사용자가 회원님의 Trace Card에 반응하면 여기에 표시됩니다.
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
