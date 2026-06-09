'use client'

import { StoneAvatar } from '@/components/stone-avatar'
import { TraceCard } from '@/components/trace-card'
import { PATH } from '@/constants/path'
import { getUserProfile, getUserTraceCards } from '@/lib/supabase/actions/profile'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, BookOpen } from 'lucide-react'
import type { Route } from 'next'
import { useRouter, useSearchParams } from 'next/navigation'
import { use } from 'react'

interface UserProfilePageProps {
  params: Promise<{ id: string }>
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromPage = (searchParams.get('from') || PATH.HOME) as Route

  const { data, isPending } = useQuery({
    queryKey: ['user-profile', id],
    queryFn: () =>
      Promise.all([getUserProfile(id), getUserTraceCards(id)]).then(([profile, cardsResult]) => ({
        profile,
        cards: cardsResult.cards,
        currentUserId: cardsResult.currentUserId,
      })),
  })

  const profile = data?.profile
  const userCards = data?.cards ?? []
  const currentUserId = data?.currentUserId

  if (!isPending && profile === null) {
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
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center h-12">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg hover:bg-muted transition-colors"
              onClick={() => router.push(fromPage)}
            >
              <ArrowLeft className="size-5" />
              <span className="text-heading-md tracking-tight">프로필</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="py-6 border-b border-border px-4">
          <div className="flex items-start justify-between">
            {/* Left: Name, Bio */}
            <div className="flex-1">
              <h2 className="text-heading-lg">{profile?.nickname}</h2>
              {profile?.bio && (
                <p className="text-body-sm mt-3 text-foreground/90">{profile.bio}</p>
              )}
            </div>

            {/* Right: Avatar */}
            <StoneAvatar
              seed={profile?.id ?? id}
              alt={profile?.nickname ?? ''}
              className="size-20 shrink-0"
            />
          </div>

          {/* Stats */}
          <div className="-mx-4 px-4 flex items-center gap-6 mt-4 pt-6 border-t border-border">
            <div className="text-center">
              <p className="text-heading-sm">{userCards.length}</p>
              <p className="text-caption text-muted-foreground">Traces</p>
            </div>
            <div className="text-center">
              <p className="text-heading-sm">{new Set(userCards.map((c) => c.book.id)).size}</p>
              <p className="text-caption text-muted-foreground">Books</p>
            </div>
          </div>
        </div>

        {/* Traces */}
        <div className="divide-y divide-border">
          {isPending ? (
            <div className="px-4 py-8 text-center">
              <p className="text-body-sm text-muted-foreground">불러오는 중...</p>
            </div>
          ) : userCards.length > 0 ? (
            userCards.map((card) => (
              <TraceCard
                key={card.id}
                card={card}
                currentUserId={currentUserId}
                onCardClick={() =>
                  router.push(PATH.TRACE_WITH_FROM(card.id, PATH.PROFILE_DETAIL(id)))
                }
              />
            ))
          ) : (
            <div className="px-4 py-12 text-center">
              <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
                <BookOpen className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-heading-sm mb-1">아직 Trace가 없습니다</h3>
              <p className="text-body-sm text-muted-foreground">독서의 흔적을 남겨보세요</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
