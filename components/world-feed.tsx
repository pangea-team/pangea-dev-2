'use client'

import { TraceCard } from '@/components/trace-card'
import { PATH } from '@/constants/path'
import type { TraceCard as TraceCardType } from '@/lib/types'
import { useRouter } from 'next/navigation'

export function WorldFeed({
  cards,
  currentUserId,
}: { cards: TraceCardType[]; currentUserId?: string }) {
  const router = useRouter()

  return (
    <div className="divide-y divide-border">
      {cards.map((card) => (
        <TraceCard
          key={card.id}
          card={card}
          currentUserId={currentUserId}
          onCardClick={() => router.push(PATH.TRACE_WITH_FROM(card.id, PATH.HOME))}
        />
      ))}
    </div>
  )
}
