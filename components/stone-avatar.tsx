'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type * as React from 'react'

const STONES = ['/icons/stone1.svg', '/icons/stone2.svg', '/icons/stone3.svg']

// seed 문자열을 안정적인 숫자로 변환 (같은 유저는 항상 같은 돌/각도)
function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

interface StoneAvatarProps extends React.ComponentProps<typeof Avatar> {
  seed: string
  alt?: string
}

export function StoneAvatar({ seed, alt, ...props }: StoneAvatarProps) {
  const src = STONES[hashString(seed) % STONES.length]
  const rotation = hashString(`${seed}-rotation`) % 360

  return (
    <Avatar {...props}>
      <AvatarImage
        src={src}
        alt={alt}
        className="object-cover"
        style={{ transform: `rotate(${rotation}deg)` }}
      />
      <AvatarFallback className="bg-muted" />
    </Avatar>
  )
}
