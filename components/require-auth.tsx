'use client'

import { PATH } from '@/constants/path'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { type ReactNode, useEffect } from 'react'

export function RequireAuth({
  children,
  redirectTo,
}: {
  children: ReactNode
  redirectTo?: string
}) {
  const { isHydrated, isLoggedIn, hasCompletedProfile } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isHydrated) return
    if (!isLoggedIn) {
      router.replace(redirectTo ? PATH.LOGIN_WITH_REDIRECT(redirectTo) : PATH.LOGIN)
      return
    }
    if (!hasCompletedProfile) {
      router.replace(PATH.ONBOARDING)
    }
  }, [isHydrated, isLoggedIn, hasCompletedProfile, redirectTo, router])

  if (!isHydrated || !isLoggedIn || !hasCompletedProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-body-sm text-muted-foreground">로딩중...</p>
      </div>
    )
  }

  return <>{children}</>
}
