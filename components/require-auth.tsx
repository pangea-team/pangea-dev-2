'use client'

import { PATH } from '@/constants/path'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { type ReactNode, useEffect } from 'react'

export function RequireAuth({ children, redirectTo }: { children: ReactNode; redirectTo: string }) {
  const { isLoggedIn, hasCompletedProfile, isHydrated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isHydrated) return
    if (!isLoggedIn) {
      router.push(PATH.LOGIN_WITH_REDIRECT(redirectTo))
      return
    }
    if (!hasCompletedProfile) {
      router.push(PATH.ONBOARDING)
    }
  }, [isHydrated, isLoggedIn, hasCompletedProfile, router, redirectTo])

  if (!isHydrated || !isLoggedIn || !hasCompletedProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-body-sm text-muted-foreground">로딩중...</p>
      </div>
    )
  }

  return <>{children}</>
}
