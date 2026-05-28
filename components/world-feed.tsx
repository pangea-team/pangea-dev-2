'use client'

import { TraceCard } from '@/components/trace-card'
import { feedTraceCards } from '@/lib/mock-data'
import { useRouter } from 'next/navigation'

export function WorldFeed() {
  const router = useRouter()

  return (
    <div>
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
