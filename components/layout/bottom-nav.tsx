'use client'

import { cn } from '@/lib/utils'
import { Globe, Lightbulb, PlusCircle, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const navItems = [
  { href: '/', icon: Globe },
  { href: '/create', icon: PlusCircle },
  { href: '/discover', icon: Lightbulb },
  { href: '/profile', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // 아래로 스크롤 - 숨김
        setIsVisible(false)
      } else {
        // 위로 스크롤 - 표시
        setIsVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 transition-transform duration-300',
        !isVisible && 'translate-y-full',
      )}
    >
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {navItems.map(({ href, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center justify-center w-16 h-full transition-colors',
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className={cn('size-6', isActive && 'stroke-[2.5px]')} />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
