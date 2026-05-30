'use client'

import { Button } from '@/components/ui/button'
import { PATH } from '@/constants/path'
import { isProfileComplete, loadProfileFromStorage, useAuth } from '@/lib/auth-context'
import type { Route } from 'next'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, hasCompletedProfile, isHydrated } = useAuth()

  const redirectTo = (searchParams.get('redirect') || PATH.HOME) as Route

  const handleKakaoLogin = () => {
    // UI만 구현 - 실제 API 연결 없음
    login()
    const profileComplete =
      isHydrated && hasCompletedProfile ? true : isProfileComplete(loadProfileFromStorage())
    router.push(profileComplete ? redirectTo : PATH.ONBOARDING)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center h-12 px-4">
        <h1 className="text-heading-md tracking-tight">PANGEA</h1>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo & Welcome */}
          <div className="text-center space-y-2">
            <h2 className="text-heading-lg">환영합니다</h2>
            <p className="text-body-sm text-muted-foreground">독서의 흔적을 남기고 공유해보세요</p>
          </div>

          {/* Kakao Login Button */}
          <Button
            onClick={handleKakaoLogin}
            className="w-full h-12 bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] font-medium"
          >
            <svg
              aria-hidden="true"
              className="size-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 3C6.477 3 2 6.463 2 10.714c0 2.689 1.777 5.054 4.447 6.418-.18.674-.656 2.443-.751 2.823-.118.469.172.463.362.337.15-.1 2.378-1.617 3.342-2.276.514.076 1.047.116 1.6.116 5.523 0 10-3.463 10-7.418C22 6.463 17.523 3 12 3z" />
            </svg>
            카카오로 시작하기
          </Button>

          {/* Terms */}
          <p className="text-caption text-muted-foreground text-center">
            로그인하면 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
          </p>
        </div>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">로딩중...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
