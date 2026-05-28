'use client'

import { useState } from 'react'
import { TraceCard, TraceCardFull } from '@/components/trace-card'
import { feedTraceCards } from '@/lib/mock-data'
import type { TraceCard as TraceCardType } from '@/lib/types'

export function WorldFeed() {
  const [selectedCard, setSelectedCard] = useState<TraceCardType | null>(null)

  return (
    <>
      <div className="divide-y divide-border">
        {feedTraceCards.map((card) => (
          <TraceCard
            key={card.id}
            card={card}
            onCardClick={() => setSelectedCard(card)}
          />
        ))}
      </div>

      {selectedCard && (
        <TraceCardFull
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </>
  )
}
