'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { TraceCard as TraceCardType } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Heart, MessageCircle, MoreHorizontal, X } from 'lucide-react'
import { useState } from 'react'

interface TraceCardFullProps {
  card: TraceCardType
  onClose: () => void
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const layerTypeLabel = {
  me: '나의 생각',
  'from-book': '책에서',
  context: '맥락',
}

export function TraceCardFull({ card, onClose }: TraceCardFullProps) {
  const [hearted, setHearted] = useState(card.userReaction?.hearted ?? false)
  const [heartCount, setHeartCount] = useState(card.reactions.heart)

  const handleHeart = () => {
    setHearted(!hearted)
    setHeartCount(hearted ? heartCount - 1 : heartCount + 1)
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-x-0 bottom-0 z-50 h-[90vh] rounded-t-xl border-t bg-background shadow-lg animate-in slide-in-from-bottom duration-300 overflow-hidden flex flex-col md:inset-4 md:bottom-4 md:h-auto md:max-h-[90vh] md:max-w-2xl md:mx-auto md:rounded-xl md:border">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
          <h2 className="text-heading-sm">Trace</h2>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* User Info */}
          <div className="flex items-start gap-3 mb-4">
            <Avatar className="size-12">
              <AvatarImage src={card.user.avatarUrl} alt={card.user.displayName} />
              <AvatarFallback className="text-body-md">{card.user.displayName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-heading-sm text-foreground">{card.user.displayName}</span>
                <span className="text-body-sm text-muted-foreground">@{card.user.username}</span>
              </div>
              <p className="text-body-sm text-muted-foreground">{formatDate(card.createdAt)}</p>
            </div>
            <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
              <MoreHorizontal className="size-5" />
            </Button>
          </div>

          {/* Book Info */}
          <div className="bg-muted/50 rounded-lg p-3 mb-4">
            <p className="text-heading-sm text-foreground">{card.book.title}</p>
            <p className="text-body-sm text-muted-foreground">{card.book.author}</p>
          </div>

          {/* Quote */}
          <div className="mb-6">
            <p className="text-caption uppercase tracking-wider text-muted-foreground mb-2">
              밑줄 친 문장
            </p>
            <blockquote className="border-l-2 border-primary pl-4 py-1">
              <p className="text-quote text-foreground text-balance">{`"${card.quote}"`}</p>
            </blockquote>
          </div>

          {/* Layers */}
          <div className="space-y-4">
            <p className="text-caption uppercase tracking-wider text-muted-foreground">
              독서의 흔적
            </p>
            {card.layers.map((layer, index) => (
              <div
                key={layer.id}
                className={cn(
                  'rounded-lg p-4',
                  layer.type === 'me' && 'bg-primary/5 border border-primary/10',
                  layer.type === 'from-book' && 'bg-muted/50 border border-muted',
                  layer.type === 'context' && 'bg-accent/50 border border-accent',
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-caption font-medium text-muted-foreground uppercase tracking-wider">
                    {layerTypeLabel[layer.type]}
                  </span>
                  <span className="text-caption text-muted-foreground">#{index + 1}</span>
                </div>
                <p className="text-body-lg text-foreground">{layer.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t px-4 py-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={cn('gap-1.5', hearted ? 'text-primary' : 'text-muted-foreground')}
                onClick={handleHeart}
              >
                <Heart className={cn('size-5', hearted && 'fill-current')} />
                <span className="tabular-nums">{heartCount}</span>
              </Button>

              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                <MessageCircle className="size-5" />
                <span className="tabular-nums">{card.reactions.comment}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
