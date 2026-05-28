'use client'

import { useRouter } from 'next/navigation'
import { Settings, BookOpen } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { TraceCard } from '@/components/trace-card'
import { currentUser, mockTraceCards } from '@/lib/mock-data'

export default function ProfilePage() {
  const router = useRouter()
  
  // For demo: show all cards for current user (in real app, filter by userId)
  const userCards = mockTraceCards.filter(card => card.userId === currentUser.id)

  return (
    <div className="min-h-screen bg-background pb-16">
      <Header title="프로필" />

      <main className="max-w-lg mx-auto">
        {/* Profile Header */}
        <div className="px-4 py-6 border-b">
          <div className="flex items-start gap-4">
            <Avatar className="size-20">
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.displayName} />
              <AvatarFallback className="text-2xl font-medium">
                {currentUser.displayName[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{currentUser.displayName}</h2>
                  <p className="text-muted-foreground text-sm">@{currentUser.username}</p>
                </div>
                <Button variant="ghost" size="icon-sm">
                  <Settings className="size-5" />
                </Button>
              </div>
              {currentUser.bio && (
                <p className="text-sm mt-2 text-foreground/90">{currentUser.bio}</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t">
            <div className="text-center">
              <p className="font-semibold">{userCards.length}</p>
              <p className="text-xs text-muted-foreground">Trace Cards</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">
                {new Set(userCards.map(c => c.book.id)).size}
              </p>
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
                onCardClick={() => router.push(`/trace/${card.id}?from=/profile`)}
              />
            ))
          ) : (
            <div className="px-4 py-12 text-center">
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
                <BookOpen className="size-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">아직 Trace Card가 없습니다</h3>
              <p className="text-sm text-muted-foreground">
                독서의 흔적을 남겨보세요
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
