'use client'

import { TraceCard } from '@/components/trace-card'
import { PATH } from '@/constants/path'
import { feedTraceCards } from '@/lib/mock-data'
import { useRouter } from 'next/navigation'

export function WorldFeed() {
  const router = useRouter()

  return (
    <div className="divide-y divide-border">
      {feedTraceCards.map((card) => (
        <TraceCard
          key={card.id}
          card={card}
          onCardClick={() => router.push(PATH.TRACE_WITH_FROM(card.id, PATH.HOME))}
        />
      ))}
    </div>
  )
}
