'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const BIO_MAX_LENGTH = 80

export default function OnboardingPage() {
  const router = useRouter()
  const { isLoggedIn, hasCompletedProfile, isHydrated, completeProfile } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    if (!isHydrated) return
    if (!isLoggedIn) {
      router.replace('/login?redirect=/onboarding')
      return
    }
    if (hasCompletedProfile) {
      router.replace('/')
    }
  }, [isHydrated, isLoggedIn, hasCompletedProfile, router])

  const canSubmit =
    displayName.trim().length > 0 && bio.trim().length > 0 && bio.length <= BIO_MAX_LENGTH

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    completeProfile(displayName, bio)
    router.replace('/')
  }

  if (!isHydrated || !isLoggedIn || hasCompletedProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-body-sm text-muted-foreground">로딩중...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-center h-12 px-4">
        <h1 className="text-heading-md tracking-tight">PANGEA</h1>
      </header>

      <main className="flex-1 flex flex-col px-4 pb-8">
        <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-heading-lg">프로필을 만들어주세요</h2>
            <p className="text-body-sm text-muted-foreground">
              닉네임과 한 줄 소개로 나를 표현해보세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="displayName">닉네임</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="예: 김독서"
                maxLength={20}
                autoComplete="nickname"
                className="h-11"
              />
              <p className="text-caption text-muted-foreground">
                다른 사람에게 보이는 이름이에요
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">한 줄 소개</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="예: 책과 함께 성장하는 중"
                maxLength={BIO_MAX_LENGTH}
                rows={2}
                className="min-h-11 resize-none"
              />
              <p className="text-caption text-muted-foreground text-right">
                {bio.length}/{BIO_MAX_LENGTH}
              </p>
            </div>

            <Button type="submit" className="w-full h-12" disabled={!canSubmit}>
              시작하기
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
