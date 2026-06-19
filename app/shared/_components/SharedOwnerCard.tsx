'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PATH } from '@/constants/path'
import { EXCHANGE_STATUS_CONFIG } from '@/constants/shared-status'
import { CURRENT_USER_ID } from '@/lib/mock/shared'
import type { Shared } from '@/lib/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useState } from 'react'

type Props = {
  shared: Shared
}

export function SharedOwnerCard({ shared }: Props) {
  const [status, setStatus] = useState(shared.exchangeStatus)

  const reader = shared.participants.find((p) => p.id !== CURRENT_USER_ID)
  if (!reader) return null

  const config = EXCHANGE_STATUS_CONFIG[status]
  const isArrived = status === 'arrived'

  return (
    <Link href={PATH.SHARED_DETAIL(shared.id)} className="block">
      <div
        className={cn(
          'bg-card rounded-xl px-3 py-2.5 flex items-center gap-3 border-1',
          isArrived ? 'border-primary' : 'border-(--color-border-subtle)',
        )}
      >
        {/* Cover + reader avatar overlay */}
        <div className="relative shrink-0 w-10 h-14">
          <div className="w-full h-full rounded-md bg-muted" />
          <span
            className="absolute bottom-0 right-0 translate-x-1 translate-y-1 w-5 h-5 rounded-full border-2 border-card block"
            style={{ backgroundColor: reader.color }}
            aria-label={reader.name}
          />
        </div>

        {/* Content — single row */}
        <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
          <div className="flex flex-col gap-0.5 min-w-0">
            <h3 className="text-label-sm truncate">{shared.title}</h3>
            <p className="text-caption text-muted-foreground">{config.subtext(reader.name)}</p>
          </div>

          <div className="shrink-0">
            {isArrived && config.actionLabel ? (
              <Button
                type="button"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setStatus('done')
                }}
              >
                {config.actionLabel}
              </Button>
            ) : config.badge ? (
              <Badge variant={config.badge.variant}>{config.badge.label}</Badge>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  )
}
