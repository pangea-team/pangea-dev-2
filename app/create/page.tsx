'use client'

import { createConversation } from '@/app/actions/chat'
import { TraceChat } from '@/components/chat/trace-chat'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Header } from '@/components/layout/header'
import { RequireAuth } from '@/components/require-auth'
import { Button } from '@/components/ui/button'
import { PATH } from '@/constants/path'
import type { Book } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Loader2, Search, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

async function searchBooks(query: string): Promise<Book[]> {
  const res = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`)
  if (!res.ok) return []
  return res.json()
}

export default function CreatePage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [startError, setStartError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      const books = await searchBooks(query)
      setResults(books)
      setLoading(false)
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  const handleStartChat = async () => {
    if (!selectedBook || isStarting) return
    setStartError(null)
    setIsStarting(true)
    try {
      const id = await createConversation(selectedBook)
      setConversationId(id)
    } catch (err) {
      setStartError(
        err instanceof Error ? err.message : '대화를 시작할 수 없어요. 다시 시도해 주세요.',
      )
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <RequireAuth redirectTo={PATH.CREATE}>
      <div className="min-h-screen bg-background pb-16">
        <Header title="trace 만들기" />

        <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
          {/* Step 1: 책 검색 — 채팅 시작 전만 노출 */}
          {!conversationId && (
            <section className="space-y-3">
              <div>
                <h2 className="text-heading-lg text-foreground">어떤 책을 읽으셨나요?</h2>
                <p className="text-body-sm text-muted-foreground mt-1">
                  trace를 남길 책을 먼저 찾아볼게요.
                </p>
              </div>

              <div className="relative">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-background">
                  <Search className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="책 제목이나 저자를 검색하세요"
                    className="flex-1 bg-transparent text-body-sm text-foreground placeholder:text-muted-foreground outline-none"
                  />
                </div>

                {query.trim() && (
                  <div className="mt-1 rounded-lg border border-border bg-background overflow-hidden">
                    {loading && (
                      <div className="py-6 text-center text-body-sm text-muted-foreground">
                        검색 중...
                      </div>
                    )}
                    {!loading && results.length === 0 && (
                      <div className="py-6 text-center text-body-sm text-muted-foreground">
                        찾는 책이 없네요. 다른 제목으로 검색해 볼까요?
                      </div>
                    )}
                    {!loading && results.length > 0 && (
                      <ul>
                        {results.map((book) => (
                          <li key={book.id}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBook(book)
                                setConversationId(null)
                                setStartError(null)
                                setQuery('')
                                setResults([])
                              }}
                              className={cn(
                                'w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted transition-colors',
                              )}
                            >
                              {book.coverUrl ? (
                                <div className="w-8 h-11 shrink-0 overflow-hidden rounded-sm bg-muted">
                                  <Image
                                    src={book.coverUrl}
                                    alt={book.title}
                                    width={32}
                                    height={44}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              ) : (
                                <div className="w-8 h-11 shrink-0 rounded-sm bg-muted" />
                              )}
                              <div className="flex flex-col min-w-0">
                                <span className="text-body-sm text-foreground truncate">
                                  {book.title}
                                </span>
                                <span className="text-caption text-muted-foreground">
                                  {book.author}
                                </span>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Step 2: 선택된 책 카드 + trace 생성 — 채팅 시작 전만 노출 */}
          {!conversationId && selectedBook && (
            <section className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                {selectedBook.coverUrl ? (
                  <div className="w-14 h-20 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={selectedBook.coverUrl}
                      alt={selectedBook.title}
                      width={56}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-20 shrink-0 rounded-md bg-muted" />
                )}
                <div className="flex flex-col justify-center min-w-0 gap-1">
                  <p className="text-heading-sm text-foreground truncate">{selectedBook.title}</p>
                  <p className="text-body-sm text-muted-foreground">{selectedBook.author}</p>
                </div>
                <button
                  type="button"
                  aria-label="선택 해제"
                  onClick={() => {
                    setSelectedBook(null)
                    setStartError(null)
                  }}
                  className="ml-auto shrink-0 self-start text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="space-y-3">
                {startError && <p className="text-caption text-destructive">{startError}</p>}
                <Button className="w-full" onClick={handleStartChat} disabled={isStarting}>
                  {isStarting ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-2" />
                      대화 준비 중...
                    </>
                  ) : (
                    'trace 생성하기'
                  )}
                </Button>
              </div>
            </section>
          )}

          {/* Step 3: 채팅 활성 — 컴팩트 책 헤더 + TraceChat */}
          {conversationId && selectedBook && (
            <>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
                {selectedBook.coverUrl ? (
                  <div className="w-10 h-14 shrink-0 overflow-hidden rounded-sm bg-muted">
                    <Image
                      src={selectedBook.coverUrl}
                      alt={selectedBook.title}
                      width={40}
                      height={56}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-14 shrink-0 rounded-sm bg-muted" />
                )}
                <div className="flex flex-col min-w-0 gap-0.5">
                  <p className="text-heading-sm text-foreground truncate">{selectedBook.title}</p>
                  <p className="text-body-sm text-muted-foreground">{selectedBook.author}</p>
                  {selectedBook.publisher && (
                    <p className="text-caption text-muted-foreground">{selectedBook.publisher}</p>
                  )}
                </div>
              </div>
              <TraceChat conversationId={conversationId} />
            </>
          )}
        </main>

        <BottomNav />
      </div>
    </RequireAuth>
  )
}
