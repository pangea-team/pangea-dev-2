'use client'

import { BottomNav } from '@/components/layout/bottom-nav'
import { Header } from '@/components/layout/header'
import { TraceCard } from '@/components/trace-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { currentUser, mockTraceCards } from '@/lib/mock-data'
import { BookOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()

  // For demo: show all cards for current user (in real app, filter by userId)
  const userCards = mockTraceCards.filter((card) => card.userId === currentUser.id)

  return (
    <div className="min-h-screen bg-background pb-16">
      <Header title="프로필" align="left" />

      <main className="max-w-2xl mx-auto">
        {/* Profile Header - Threads style */}
        <div className=" py-6 border-b border-border px-4">
          <div className="flex items-start justify-between">
            {/* Left: Name, ID, Bio */}
            <div className="flex-1">
              <h2 className="text-heading-lg">{currentUser.displayName}</h2>
              <p className="text-body-sm text-muted-foreground">@{currentUser.username}</p>
              {currentUser.bio && (
                <p className="text-body-sm mt-3 text-foreground/90">{currentUser.bio}</p>
              )}
            </div>

            {/* Right: Avatar */}
            <Avatar className="size-20 shrink-0">
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.displayName} />
              <AvatarFallback className="text-2xl font-medium">
                {currentUser.displayName[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-heading-sm">{userCards.length}</p>
              <p className="text-caption text-muted-foreground">Trace Cards</p>
            </div>
            <div className="text-center">
              <p className="text-heading-sm">{new Set(userCards.map((c) => c.book.id)).size}</p>
              <p className="text-caption text-muted-foreground">Books</p>
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
                onCardClick={() => router.push(`/trace/${card.id}?from=/profile`)}
              />
            ))
          ) : (
            <div className="px-4 py-12 text-center">
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
                <BookOpen className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-heading-sm mb-1">아직 Trace Card가 없습니다</h3>
              <p className="text-body-sm text-muted-foreground">독서의 흔적을 남겨보세요</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
