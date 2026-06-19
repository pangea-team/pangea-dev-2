import type { Shared } from '@/lib/types'

export function getReadingShared(list: Shared[], userId: string): Shared[] {
  return list.filter((s) => s.ownerId !== userId)
}

export function getOwnerShared(list: Shared[], userId: string): Shared[] {
  return list.filter((s) => s.ownerId === userId)
}
