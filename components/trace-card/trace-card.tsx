'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { TraceCard as TraceCardType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ArrowLeftRight, Bookmark, Heart, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
  const [hearted, setHearted] = useState(card.userReaction?.hearted ?? false)
  const [bookmarked, setBookmarked] = useState(card.userReaction?.bookmarked ?? false)
  const [heartCount, setHeartCount] = useState(card.reactions.heart)
  const [showExchangeDialog, setShowExchangeDialog] = useState(false)

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/profile/${card.user.id}?from=${window.location.pathname}`)
  }

  const handleExchangeRequest = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowExchangeDialog(true)
  }

  const handleConfirmExchange = () => {
    // TODO: 교환 요청 API 호출
    setShowExchangeDialog(false)
  }

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
      className="border-b border-border px-5 py-6 transition-colors hover:bg-muted/30 cursor-pointer"
      onClick={onCardClick}
    >
      {/* Header with Avatar */}
      <div className="flex items-center gap-3 mb-5">
        <Avatar
          className="size-9 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleAvatarClick}
        >
          <AvatarImage src={card.user.avatarUrl} alt={card.user.displayName} />
          <AvatarFallback className="text-xs font-medium">
            {card.user.displayName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span
            className="font-medium text-foreground text-sm truncate cursor-pointer hover:underline"
            onClick={handleAvatarClick}
          >
            {card.user.displayName}
          </span>
          <span className="text-muted-foreground text-sm">{formatDate(card.createdAt)}</span>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-primary"
          onClick={handleExchangeRequest}
        >
          <ArrowLeftRight className="size-4" />
        </Button>
      </div>

      {/* Card Content */}
      <div className="space-y-5">
        {/* Me Section */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2.5">Me</p>
          <p className="text-foreground leading-relaxed text-balance text-[15px]">
            {card.meThought}
          </p>
        </div>

        {/* From the Book Section */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2.5">
            From the Book
          </p>
          <p className="text-foreground/80 leading-relaxed mb-2.5 text-balance text-[15px]">
            {`"${card.quote}"`}
          </p>
          <p className="text-muted-foreground text-sm">
            《{card.book.title}》, {card.book.author}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-5 -ml-2">
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
          onClick={onCardClick}
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

      {/* Exchange Request Dialog */}
      <AlertDialog open={showExchangeDialog} onOpenChange={setShowExchangeDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>교환 요청</AlertDialogTitle>
            <AlertDialogDescription>
              {card.user.displayName}님에게 《{card.book.title}》 교환을 요청하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmExchange}>요청하기</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  )
}
