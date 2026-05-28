'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function Header({
  title,
  align = 'left',
  showLoginButton = false,
}: {
  title: string
  align?: 'left' | 'center'
  showLoginButton?: boolean
}) {
  const { isLoggedIn } = useAuth()

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div
        className={cn(
          'flex items-center h-12 px-4 max-w-2xl mx-auto',
          align === 'center' ? 'justify-center' : 'justify-start',
        )}
      >
        <h1
          className={cn(
            'text-heading-md tracking-tight',
            align === 'center' && showLoginButton && 'flex-1 text-center',
          )}
        >
          {title}
        </h1>
        {showLoginButton && !isLoggedIn && (
          <Button variant="ghost" size="sm" asChild className="absolute right-4">
            <Link href="/login">로그인</Link>
          </Button>
        )}
      </div>
    </header>
  )
}
