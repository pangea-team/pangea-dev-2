'use client'

import { BottomNav } from '@/components/layout/bottom-nav'
import { Header } from '@/components/layout/header'
import { RequireAuth } from '@/components/require-auth'
import { Button } from '@/components/ui/button'

import { PATH } from '@/constants/path'
import type { Book } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

// TODO: 다음 이슈 - AI chat (useChat)
function TraceChatPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-2 rounded-xl border border-dashed border-border text-muted-foreground">
      <p className="text-body-sm">AI 대화 준비 중</p>
      <p className="text-caption">(다음 이슈에서 구현 예정)</p>
    </div>
  )
}

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
  const [isGenerating, setIsGenerating] = useState(false)
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

  return (
    <RequireAuth redirectTo={PATH.CREATE}>
      <div className="min-h-screen bg-background pb-16">
        <Header title="trace 만들기" />

        <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
          {/* Step 1: 책 검색 — 항상 노출 */}
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
                              // TODO: 다음 패스 - books upsert
                              setSelectedBook(book)
                              setIsGenerating(false)
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

          {/* Step 2: 선택된 책 카드 + trace 생성 */}
          {selectedBook && (
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
                    setIsGenerating(false)
                  }}
                  className="ml-auto shrink-0 self-start text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              {!isGenerating && (
                <div className="space-y-3">
                  <p className="text-body-sm text-foreground">이제 trace를 생성해 볼게요</p>
                  <Button className="w-full" onClick={() => setIsGenerating(true)}>
                    trace 생성하기
                  </Button>
                </div>
              )}

              {/* Step 3 placeholder — 다음 이슈에서 AI chat 구현 */}
              {isGenerating && <TraceChatPlaceholder />}
            </section>
          )}
        </main>

        <BottomNav />
      </div>
    </RequireAuth>
  )
}
