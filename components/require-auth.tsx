'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

export function RequireAuth({ children, redirectTo }: { children: ReactNode; redirectTo: string }) {
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(redirectTo)}`)
    }
  }, [isLoggedIn, router, redirectTo])

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">로그인 페이지로 이동중...</p>
      </div>
    )
  }

  return <>{children}</>
}
