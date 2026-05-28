'use client'

import { useRouter } from 'next/navigation'
import { TraceCard } from '@/components/trace-card'
import { feedTraceCards } from '@/lib/mock-data'

export function WorldFeed() {
  const router = useRouter()

  return (
    <div className="divide-y divide-border">
      {feedTraceCards.map((card) => (
        <TraceCard
          key={card.id}
          card={card}
          onCardClick={() => router.push(`/trace/${card.id}?from=/`)}
        />
      ))}
    </div>
  )
}
