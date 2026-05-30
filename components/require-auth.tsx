'use client'

import type { ReactNode } from 'react'

// DB 설정 전 임시 비활성화 — 원본은 git history 참고
export function RequireAuth({ children }: { children: ReactNode; redirectTo?: string }) {
  return <>{children}</>
}
