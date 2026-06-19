import { PATH } from '@/constants/path'
import { MOCK_LIBRARY_BOOKS } from '@/lib/mock/books'
import { CURRENT_USER_ID, MOCK_SHARED_LIST } from '@/lib/mock/shared'
import { ArrowLeft, MessageCircle, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { IndexComposer } from './_components/IndexComposer'

function formatDate(date: Date): string {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function SharedDetailPage({ params }: Props) {
  const { id } = await params

  const history = MOCK_SHARED_LIST.find((h) => h.id === id)
  if (!history) notFound()
  const libraryBook = MOCK_LIBRARY_BOOKS.find((b) => b.sharedId === id)
  const sortedIndexes = [...history.indexes].sort((a, b) => a.pageNumber - b.pageNumber)

  const otherParticipant = history.participants.find((p) => p.id !== CURRENT_USER_ID)
  const readingNote = otherParticipant
    ? libraryBook?.status === 'reading'
      ? `${otherParticipant.name}의 책을 읽는 중`
      : libraryBook?.status === 'shared'
        ? `${otherParticipant.name}이 나의 책을 읽는 중`
        : null
    : null

  return (
    <div className="h-dvh flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="shrink-0 bg-background border-b border-border">
        <div className="max-w-2xl mx-auto flex items-center justify-between h-12 px-4">
          <Link href={PATH.SHARED} aria-label="뒤로가기">
            <ArrowLeft className="size-5 text-foreground" />
          </Link>
          <span className="text-label-md">PANGEA</span>
          <button type="button" aria-label="더보기" className="text-foreground">
            <MoreHorizontal className="size-5" />
          </button>
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {/* Book info */}
          <div className="px-4 pt-4 pb-4 border-b border-(--color-border-subtle)">
            <div className="flex gap-3">
              <div className="w-18 h-24 rounded-lg bg-muted shrink-0" />
              <div className="flex-1 flex flex-col justify-center min-w-0 gap-0.5">
                <h2 className="text-heading-sm truncate">{history.title}</h2>
                <p className="text-caption text-(--color-text-tertiary)">{history.author}</p>
                {readingNote && (
                  <p className="text-body-sm text-muted-foreground mt-1">{readingNote}</p>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative h-3 mt-4">
              <div
                className="absolute inset-x-0 bg-border rounded-full"
                style={{ top: '5px', height: '2px' }}
              />
              {sortedIndexes.map((idx) => {
                const participant = history.participants.find((p) => p.id === idx.participantId)
                if (!participant) return null
                const left = (idx.pageNumber / history.totalPages) * 100
                return (
                  <span
                    key={idx.id}
                    style={{
                      position: 'absolute',
                      left: `${left}%`,
                      top: 0,
                      width: '3px',
                      height: '12px',
                      borderRadius: '2px',
                      backgroundColor: participant.color,
                      opacity: idx.comments.length === 0 ? 0.3 : 1,
                    }}
                  />
                )
              })}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-caption text-(--color-text-tertiary)">p.1</span>
              <span className="text-caption text-(--color-text-tertiary)">
                p.{history.totalPages}
              </span>
            </div>
          </div>

          {/* Empty state */}
          {sortedIndexes.length === 0 && (
            <div className="flex items-center justify-center px-6 py-16">
              <p className="text-body-sm text-muted-foreground text-center">
                아직 남겨진 인덱스가 없어요.
              </p>
            </div>
          )}

          {/* Index timeline */}
          {sortedIndexes.length > 0 && (
            <div className="relative mt-3 mb-4">
              <div
                className="absolute top-0 bottom-0 bg-border"
                style={{ left: '16px', width: '1px' }}
              />
              {sortedIndexes.map((index) => {
                const author = history.participants.find((p) => p.id === index.participantId)
                if (!author) return null
                const firstComment = index.comments[0]
                const commentAuthor = firstComment
                  ? history.participants.find((p) => p.id === firstComment.participantId)
                  : null

                return (
                  <Link
                    key={index.id}
                    href={PATH.SHARED_DETAIL_INDEX_DETAIL(id, index.id)}
                    className="block"
                  >
                    <div className="flex px-4 py-4 border-b border-(--color-border-subtle)">
                      {/* Tab marker + page number */}
                      <div className="flex items-start gap-1.5 shrink-0 mr-3">
                        <div
                          className="shrink-0 mt-1"
                          style={{
                            width: '14px',
                            height: '10px',
                            borderRadius: '0 2px 2px 0',
                            backgroundColor: author.color,
                          }}
                        />
                        <span className="text-caption text-(--color-text-tertiary)">
                          p.{index.pageNumber}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-label-sm">{author.name}</span>
                          <span className="text-caption text-(--color-text-tertiary)">
                            · {formatDate(index.createdAt)}
                          </span>
                        </div>
                        <p className="text-body-sm line-clamp-2">{index.content}</p>
                        {index.imageUrl && (
                          <div className="mt-2 h-25 rounded-md bg-(--color-surface-muted)" />
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-caption text-(--color-text-tertiary) flex items-center gap-1">
                            <MessageCircle className="size-3" />
                            {index.comments.length}
                          </span>
                          <span className="text-caption text-(--color-text-tertiary)">더 보기</span>
                        </div>
                        {firstComment && commentAuthor && (
                          <div className="mt-2 flex items-center gap-1.5">
                            <span
                              className="inline-block w-4 h-4 rounded-full shrink-0"
                              style={{ backgroundColor: commentAuthor.color }}
                              aria-hidden="true"
                            />
                            <p className="text-caption text-muted-foreground truncate">
                              <span className="font-medium">{commentAuthor.name}</span>{' '}
                              {firstComment.content}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <IndexComposer />
    </div>
  )
}
