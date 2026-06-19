import { CURRENT_USER_ID, MOCK_SHARED_LIST } from '@/lib/mock/shared'
import { getOwnerShared, getReadingShared } from '../_utils/selectors'
import { ReadingCard } from './ReadingCard'
import { SharedOwnerCard } from './SharedOwnerCard'

export function LibraryContent() {
  const reading = getReadingShared(MOCK_SHARED_LIST, CURRENT_USER_ID)
  const owning = getOwnerShared(MOCK_SHARED_LIST, CURRENT_USER_ID)

  return (
    <div className="flex flex-col ">
      <section className=" py-4 ">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-label-md">읽는 중</h2>
            <span className="text-caption text-(--color-text-tertiary)">{reading.length}권</span>
          </div>
          <div className="flex flex-col gap-3 divide-y divide-(--color-border-subtle) border-y border-(--color-border-subtle)">
            {reading.map((s) => (
              <ReadingCard key={s.id} shared={s} />
            ))}
          </div>
        </div>
      </section>

      <section className=" py-4 mt-6">
        <div className="max-w-2xl mx-auto px-4 ">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-label-md">공유 중</h2>
            <span className="text-caption text-(--color-text-tertiary)">{owning.length}권</span>
          </div>
          <div className="flex flex-col gap-3">
            {owning.map((s) => (
              <SharedOwnerCard key={s.id} shared={s} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
