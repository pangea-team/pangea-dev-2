'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { TraceCard as TraceCardType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Bookmark, Heart, MessageCircle, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

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

  return (
    <article
      className="border-b border-border px-4 py-5 transition-colors hover:bg-muted/30 cursor-pointer"
      onClick={onCardClick}
    >
      {/* Header with Avatar */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="size-8 shrink-0">
          <AvatarImage src={card.user.avatarUrl} alt={card.user.displayName} />
          <AvatarFallback className="text-xs font-medium">
            {card.user.displayName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="font-medium text-foreground text-sm truncate">
            {card.user.displayName}
          </span>
          <span className="text-muted-foreground text-sm">{formatDate(card.createdAt)}</span>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground -mr-2"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </div>

      {/* Card Content */}
      <div className="space-y-4">
        {/* Me Section */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Me</p>
          <p className="text-foreground leading-relaxed text-balance">{card.meThought}</p>
        </div>

        {/* Divider */}
        <div className="text-muted-foreground/50 text-center">⸻</div>

        {/* From the Book Section */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
            From the Book
          </p>
          <p className="text-foreground/80 leading-relaxed mb-2 text-balance">
            {`"${card.quote}"`}
          </p>
          <p className="text-muted-foreground text-sm">
            — 《{card.book.title}》, {card.book.author}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 mt-4 -ml-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'text-muted-foreground hover:text-rose-500 gap-1.5 px-2',
            hearted && 'text-rose-500',
          )}
          onClick={handleHeart}
        >
          <Heart className={cn('size-4', hearted && 'fill-current')} />
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
            bookmarked && 'text-primary',
          )}
          onClick={handleBookmark}
        >
          <Bookmark className={cn('size-4', bookmarked && 'fill-current')} />
        </Button>
      </div>
    </article>
  )
}
