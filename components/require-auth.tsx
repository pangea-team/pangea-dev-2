'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

export function RequireAuth({ children, redirectTo }: { children: ReactNode; redirectTo: string }) {
  const { isLoggedIn, hasCompletedProfile, isHydrated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isHydrated) return
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(redirectTo)}`)
      return
    }
    if (!hasCompletedProfile) {
      router.push('/onboarding')
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
