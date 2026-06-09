import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock('@/components/layout/bottom-nav', () => ({ BottomNav: () => null }))
vi.mock('@/components/layout/header', () => ({ Header: () => null }))
vi.mock('@/components/world-feed', () => ({ WorldFeed: () => null }))

import WorldPage from '@/app/page'
import { createClient } from '@/lib/supabase/server'

type CallLog = Record<string, unknown[][]>

function makeBuilder(log: CallLog) {
  const methods: Record<string, (...args: unknown[]) => unknown> = {}
  // Blend chainable methods onto a real Promise so await works via the prototype .then
  // (avoids adding .then as an own property which Biome flags)
  const chain = Object.assign(Promise.resolve({ data: [], error: null }), methods)

  for (const method of ['select', 'eq', 'order', 'in', 'or']) {
    methods[method] = vi.fn((...args: unknown[]) => {
      log[method] = [...(log[method] ?? []), args]
      return chain
    })
    ;(chain as Record<string, unknown>)[method] = methods[method]
  }

  return chain as unknown as Record<string, unknown>
}

describe('WorldPage 쿼리 구조', () => {
  let log: CallLog

  beforeEach(() => {
    log = {}
    vi.mocked(createClient).mockResolvedValue({
      from: vi.fn(() => makeBuilder(log)),
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    } as never)
  })

  it('is_public=true 필터가 쿼리에 포함된다', async () => {
    await WorldPage()
    expect(log.eq).toContainEqual(['is_public', true])
  })

  it('created_at 내림차순 정렬이 쿼리에 포함된다', async () => {
    await WorldPage()
    expect(log.order).toContainEqual(['created_at', { ascending: false }])
  })
})
