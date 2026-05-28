'use client'

import { TraceCard } from '@/components/trace-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { mockTraceCards, mockUsers } from '@/lib/mock-data'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { use } from 'react'

interface UserProfilePageProps {
  params: Promise<{ id: string }>
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromPage = searchParams.get('from') || '/'

  const user = mockUsers.find((u) => u.id === id)
  const userCards = mockTraceCards.filter((card) => card.userId === id)

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">사용자를 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="flex items-center gap-3 px-4 h-14">
          <Button variant="ghost" size="icon-sm" onClick={() => router.push(fromPage)}>
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="font-semibold">프로필</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto">
        {/* Profile Header - Threads style */}
        <div className="px-4 py-6 border-b">
          <div className="flex items-start justify-between">
            {/* Left: Name, ID, Bio */}
            <div className="flex-1">
              <h2 className="text-heading-lg">{user.displayName}</h2>
              <p className="text-muted-foreground text-sm">@{user.username}</p>
              {user.bio && <p className="text-sm mt-3 text-foreground/90">{user.bio}</p>}
            </div>

            {/* Right: Avatar */}
            <Avatar className="size-20 shrink-0">
              <AvatarImage src={user.avatarUrl} alt={user.displayName} />
              <AvatarFallback className="text-2xl font-medium">
                {user.displayName[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t">
            <div className="text-center">
              <p className="font-semibold">{userCards.length}</p>
              <p className="text-xs text-muted-foreground">Trace Cards</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{new Set(userCards.map((c) => c.book.id)).size}</p>
              <p className="text-xs text-muted-foreground">Books</p>
            </div>
          </div>
        </div>

        {/* Trace Cards */}
        <div className="divide-y divide-border">
          {userCards.length > 0 ? (
            userCards.map((card) => (
              <TraceCard
                key={card.id}
                card={card}
                onCardClick={() => router.push(`/trace/${card.id}?from=/profile/${id}`)}
              />
            ))
          ) : (
            <div className="px-4 py-12 text-center">
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
                <BookOpen className="size-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">아직 Trace Card가 없습니다</h3>
              <p className="text-sm text-muted-foreground">독서의 흔적을 남겨보세요</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
