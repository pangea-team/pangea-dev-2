import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

import { requestShare } from '@/lib/supabase/actions/share'
import { createClient } from '@/lib/supabase/server'

describe('requestShare 서버 액션', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('비로그인 시 Unauthorized 에러 발생', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
    } as never)

    await expect(requestShare('card-1', 'owner-1')).rejects.toThrow('Unauthorized')
  })

  it('본인 글에 요청 시 셀프 거래 차단 에러 발생', async () => {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'uid-1' } } }),
      },
    } as never)

    await expect(requestShare('card-1', 'uid-1')).rejects.toThrow(
      '본인 글에는 거래를 신청할 수 없습니다',
    )
  })

  it('다른 유저 글에 요청 시 insert가 올바른 인자로 호출된다', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null })

    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'requester-1' } } }),
      },
      from: vi.fn(() => ({ insert: mockInsert })),
    } as never)

    await requestShare('card-1', 'owner-1')

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        trace_card_id: 'card-1',
        requester_id: 'requester-1',
        owner_id: 'owner-1',
      }),
    )
  })
})
