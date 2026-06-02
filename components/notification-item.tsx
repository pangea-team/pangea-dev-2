import { StoneAvatar } from '@/components/stone-avatar'
import { PATH } from '@/constants/path'
import type { NotificationType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Check, Heart, MessageCircle } from 'lucide-react'
import Link from 'next/link'

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'like':
      return <Heart className="size-4 text-foreground fill-current" />
    case 'comment':
      return <MessageCircle className="size-4 text-foreground" />
    case 'exchange_matched':
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

export interface NotificationItemData {
  id: string
  type: NotificationType
  fromUser: {
    id: string
    nickname: string
    avatarUrl?: string
  }
  traceCard?: {
    id: string
    quote: string
  }
  message: string
  isRead: boolean
  createdAt: Date
}

export function NotificationItem({
  notification,
  onCardClick,
}: {
  notification: NotificationItemData
  onCardClick: (traceCardId: string) => void
}) {
  return (
    <div
      className={cn(
        'w-full flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50',
        !notification.isRead && 'bg-primary/5',
      )}
    >
      <div className="relative shrink-0">
        <Link href={PATH.PROFILE_WITH_FROM(notification.fromUser.id, PATH.DISCOVER)}>
          <StoneAvatar
            seed={notification.fromUser.id}
            alt={notification.fromUser.nickname}
            className="size-10"
          />
        </Link>
        <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-background flex items-center justify-center">
          {getNotificationIcon(notification.type)}
        </div>
      </div>

      <button
        type="button"
        className="flex-1 min-w-0 text-left"
        onClick={() => notification.traceCard && onCardClick(notification.traceCard.id)}
      >
        <p className="text-body-sm">
          <span className="font-semibold">{notification.fromUser.nickname}</span>
          <span className="text-muted-foreground">
            {' '}
            님{notification.type === 'exchange_matched' ? '과' : '이'} {notification.message}
          </span>
        </p>
        {notification.traceCard && (
          <p className="text-caption text-muted-foreground mt-1 truncate">
            &quot;{notification.traceCard.quote.slice(0, 40)}...&quot;
          </p>
        )}
        <p className="text-caption text-muted-foreground mt-1">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </button>

      {!notification.isRead && <div className="size-2 rounded-full bg-primary mt-2 shrink-0" />}
    </div>
  )
}
