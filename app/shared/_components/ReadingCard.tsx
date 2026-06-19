import { Button } from '@/components/ui/button'
import { PATH } from '@/constants/path'
import { CURRENT_USER_ID } from '@/lib/mock/shared'
import type { Shared } from '@/lib/types'
import Link from 'next/link'

type Props = {
  shared: Shared
}

export function ReadingCard({ shared }: Props) {
  const owner = shared.participants.find((p) => p.id === shared.ownerId)
  const me = shared.participants.find((p) => p.id === CURRENT_USER_ID)
  if (!owner || !me) return null

  return (
    <Link href={PATH.SHARED_DETAIL(shared.id)} className="block">
      <div className="bg-card rounded-xl p-4 flex gap-4">
        {/* Owner avatar + my avatar overlay */}
        <div className="relative shrink-0 w-14 h-14">
          <div
            className="w-full h-full rounded-full"
            style={{ backgroundColor: owner.color }}
            aria-hidden="true"
          />
          <span
            className="absolute bottom-0 right-0 translate-x-1 translate-y-1 w-6 h-6 rounded-full border-2 border-card block"
            style={{ backgroundColor: me.color }}
            aria-label="나"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <p className="text-label-md truncate">
            <span>{owner.name}</span>의 책
          </p>

          <p className="text-caption text-(--color-text-tertiary) truncate">《{shared.title}》</p>
          <p className="text-quote-sm text-muted-foreground line-clamp-2 mt-1">
            {`"${owner.meThought}"`}
          </p>

          <div className="flex justify-end mt-2">
            <Button type="button" size="sm">
              인덱스 남기기
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
