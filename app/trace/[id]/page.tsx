'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { mockTraceCards } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { ArrowLeft, Bookmark, Heart, MessageCircle, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useState } from 'react'

interface TracePageProps {
  params: Promise<{ id: string }>
}

export default function TracePage({ params }: TracePageProps) {
  const { id } = use(params)
  const router = useRouter()

  const card = mockTraceCards.find((c) => c.id === id)

  const [hearted, setHearted] = useState(card?.userReaction?.hearted ?? false)
  const [bookmarked, setBookmarked] = useState(card?.userReaction?.bookmarked ?? false)
  const [heartCount, setHeartCount] = useState(card?.reactions.heart ?? 0)

  if (!card) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Trace Card를 찾을 수 없습니다.</p>
      </div>
    )
  }

  const handleHeart = () => {
    setHearted(!hearted)
    setHeartCount(hearted ? heartCount - 1 : heartCount + 1)
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon-sm" onClick={() => router.back()}>
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="font-semibold">TRACE CARD</h1>
          <Button variant="ghost" size="icon-sm" className="ml-auto text-muted-foreground">
            <MoreHorizontal className="size-5" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-6 py-6">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-8">
          <Avatar className="size-10">
            <AvatarImage src={card.user.avatarUrl} alt={card.user.displayName} />
            <AvatarFallback className="text-sm font-medium">
              {card.user.displayName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{card.user.displayName}</p>
            <p className="text-sm text-muted-foreground">@{card.user.username}</p>
          </div>
        </div>

        {/* Me Section */}
        <section className="mb-10">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Me</p>
          <p className="text-xl text-foreground leading-relaxed font-medium">
            {`"${card.meThought}"`}
          </p>
        </section>

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* From the Book Section */}
        <section className="mb-10">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            From the Book
          </p>
          <blockquote className="mb-4">
            <p className="text-lg text-foreground leading-relaxed italic">{`"${card.quote}"`}</p>
          </blockquote>
          <p className="text-muted-foreground">
            — 《{card.book.title}》, {card.book.author}
          </p>
        </section>

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* Trace Expanded Section */}
        <section className="mb-10">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Trace Expanded
          </p>
          <div className="text-foreground leading-loose whitespace-pre-line">
            {card.traceExpanded}
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className={cn('gap-1.5', hearted ? 'text-rose-500' : 'text-muted-foreground')}
            onClick={handleHeart}
          >
            <Heart className={cn('size-5', hearted && 'fill-current')} />
            <span className="tabular-nums">{heartCount}</span>
          </Button>

          <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
            <MessageCircle className="size-5" />
            <span className="tabular-nums">{card.reactions.comment}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={cn(bookmarked ? 'text-primary' : 'text-muted-foreground')}
            onClick={handleBookmark}
          >
            <Bookmark className={cn('size-5', bookmarked && 'fill-current')} />
          </Button>
        </div>
      </main>
    </div>
  )
}
