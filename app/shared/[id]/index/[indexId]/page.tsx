import { PATH } from '@/constants/path'
import { MOCK_SHARED_LIST } from '@/lib/mock/shared'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ReplyComposer } from './_components/ReplyComposer'

function formatDate(date: Date): string {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}

type Props = {
  params: Promise<{ id: string; indexId: string }>
}

export default async function IndexDetailPage({ params }: Props) {
  const { id, indexId } = await params

  const history = MOCK_SHARED_LIST.find((h) => h.id === id)
  if (!history) notFound()

  const index = history.indexes.find((i) => i.id === indexId)
  if (!index) notFound()

  const author = history.participants.find((p) => p.id === index.participantId)
  if (!author) notFound()

  const hasComments = index.comments.length > 0
  const showJumpButton = index.comments.length >= 2

  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="shrink-0 bg-background border-b border-border">
        <div className="max-w-2xl mx-auto flex items-center justify-between h-12 px-4">
          <Link href={PATH.SHARED_DETAIL(id)} aria-label="뒤로가기">
            <ArrowLeft className="size-5 text-foreground" />
          </Link>
          <span className="text-label-sm">p.{index.pageNumber}</span>
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-5 h-5 rounded-full shrink-0"
              style={{ backgroundColor: author.color }}
              aria-hidden="true"
            />
            <span className="text-label-sm">{author.name}</span>
            <span className="text-caption text-(--color-text-tertiary)">
              · {formatDate(index.createdAt)}
            </span>
          </div>
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 pt-5 pb-4">
          {/* Original index */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className="w-8 h-8 rounded-full shrink-0 block"
                style={{ backgroundColor: author.color }}
              />
              {hasComments && <div className="w-px flex-1 mt-2 bg-border" />}
            </div>
            <div className="flex-1 pb-5">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-label-sm">{author.name}</span>
                <span className="text-caption text-(--color-text-tertiary)">
                  · {formatDate(index.createdAt)}
                </span>
              </div>
              <p className="text-body-md">{index.content}</p>
              {index.imageUrl && (
                <div className="mt-3 rounded-xl bg-(--color-surface-muted) border border-border aspect-video" />
              )}
            </div>
          </div>

          {/* Comment section */}
          {hasComments && (
            <>
              <div className="flex items-center gap-3 py-3">
                <span className="text-caption text-(--color-text-tertiary) shrink-0 uppercase tracking-wider">
                  댓글
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="flex flex-col">
                {index.comments.map((comment, i) => {
                  const commentAuthor = history.participants.find(
                    (p) => p.id === comment.participantId,
                  )
                  if (!commentAuthor) return null
                  const isLast = i === index.comments.length - 1

                  return (
                    <div key={comment.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span
                          className="w-7 h-7 rounded-full shrink-0 block"
                          style={{ backgroundColor: commentAuthor.color }}
                        />
                        {!isLast && <div className="w-px flex-1 mt-2 bg-border" />}
                      </div>
                      <div className="flex-1 pb-4" id={isLast ? 'latest-comment' : undefined}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-label-sm">{commentAuthor.name}</span>
                          <span className="text-caption text-(--color-text-tertiary)">
                            · {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-body-sm">{comment.content}</p>
                        {comment.imageUrl && (
                          <div className="mt-2 rounded-xl bg-(--color-surface-muted) border border-border aspect-video" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Jump to latest */}
      {showJumpButton && (
        <a
          href="#latest-comment"
          className="shrink-0 flex items-center justify-center gap-1.5 py-1.5 border-t border-border bg-background text-caption text-(--color-text-tertiary) hover:text-foreground transition-colors"
        >
          <ChevronDown className="size-3.5" />
          최신 댓글
        </a>
      )}

      <ReplyComposer />
    </div>
  )
}
