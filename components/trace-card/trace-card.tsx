'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { TraceCard as TraceCardType } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TraceCardProps {
  card: TraceCardType
  onCardClick?: () => void
}

function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  if (days < 7) return `${days}일 전`
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

export function TraceCard({ card, onCardClick }: TraceCardProps) {
  const [hearted, setHearted] = useState(card.userReaction?.hearted ?? false)
  const [bookmarked, setBookmarked] = useState(card.userReaction?.bookmarked ?? false)
  const [heartCount, setHeartCount] = useState(card.reactions.heart)

  const handleHeart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setHearted(!hearted)
    setHeartCount(hearted ? heartCount - 1 : heartCount + 1)
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    setBookmarked(!bookmarked)
  }

  const firstLayer = card.layers[0]

  return (
    <article
      className="border-b border-border px-4 py-4 transition-colors hover:bg-muted/30 cursor-pointer"
      onClick={onCardClick}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="size-10 shrink-0">
          <AvatarImage src={card.user.avatarUrl} alt={card.user.displayName} />
          <AvatarFallback className="text-sm font-medium">
            {card.user.displayName[0]}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-foreground truncate">
              {card.user.displayName}
            </span>
            <span className="text-muted-foreground text-sm">
              @{card.user.username}
            </span>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm">
              {formatDate(card.createdAt)}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              className="ml-auto -mr-2 text-muted-foreground hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </div>

          {/* Book Info */}
          <div className="mb-2">
            <span className="text-muted-foreground text-sm">
              {card.book.title}
            </span>
            <span className="text-muted-foreground text-sm mx-1">·</span>
            <span className="text-muted-foreground text-sm">
              {card.book.author}
            </span>
          </div>

          {/* Quote */}
          <blockquote className="border-l-2 border-primary/50 pl-3 mb-3">
            <p className="text-foreground leading-relaxed text-balance">
              {`"${card.quote}"`}
            </p>
          </blockquote>

          {/* First Layer (Me) */}
          {firstLayer && (
            <div className="mb-3">
              <p className="text-foreground/90 leading-relaxed">
                {firstLayer.content}
              </p>
            </div>
          )}

          {/* Show more indicator if there are more layers */}
          {card.layers.length > 1 && (
            <p className="text-muted-foreground text-sm mb-3">
              +{card.layers.length - 1}개의 레이어 더 보기
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 -ml-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'text-muted-foreground hover:text-rose-500 gap-1.5 px-2',
                hearted && 'text-rose-500'
              )}
              onClick={handleHeart}
            >
              <Heart
                className={cn('size-4', hearted && 'fill-current')}
              />
              <span className="text-sm tabular-nums">{heartCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary gap-1.5 px-2"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="size-4" />
              <span className="text-sm tabular-nums">{card.reactions.comment}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'text-muted-foreground hover:text-primary px-2',
                bookmarked && 'text-primary'
              )}
              onClick={handleBookmark}
            >
              <Bookmark
                className={cn('size-4', bookmarked && 'fill-current')}
              />
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
