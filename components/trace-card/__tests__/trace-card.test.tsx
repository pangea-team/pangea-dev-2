import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/lib/supabase/actions/share', () => ({
  requestShare: vi.fn(),
}))

vi.mock('@/lib/supabase/actions/reactions', () => ({
  toggleHeart: vi.fn(),
}))

import { TraceCard } from '@/components/trace-card/trace-card'
import { requestShare } from '@/lib/supabase/actions/share'
import type { TraceCard as TraceCardType } from '@/lib/types'

const makeCard = (overrides?: Partial<TraceCardType>): TraceCardType => ({
  id: 'card-1',
  userId: 'owner-1',
  user: { id: 'owner-1', nickname: '오너', createdAt: new Date() },
  book: { id: 'book-1', title: '책 제목', author: '저자' },
  quote: '인용문',
  meThought: '나의 생각',
  traceExpanded: '확장된 흔적',
  layers: [],
  isPublic: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  reactions: { heart: 0, comment: 0 },
  userReaction: { hearted: false },
  shareStatus: 'none',
  ...overrides,
})

describe('TraceCard — isOwner + shareStatus=none → Share 버튼 미렌더', () => {
  it('currentUserId === card.user.id 이고 shareStatus=none이면 Share 버튼이 없다', () => {
    render(<TraceCard card={makeCard({ shareStatus: 'none' })} currentUserId="owner-1" />)
    expect(screen.queryByText('Share')).not.toBeInTheDocument()
  })

  it('currentUserId !== card.user.id 이고 shareStatus=none이면 Share 버튼이 있다', () => {
    render(<TraceCard card={makeCard({ shareStatus: 'none' })} currentUserId="requester-1" />)
    expect(screen.getByText('Share')).toBeInTheDocument()
  })

  it('isOwner=true 이더라도 shareStatus=pending이면 버튼이 렌더된다', () => {
    render(<TraceCard card={makeCard({ shareStatus: 'pending' })} currentUserId="owner-1" />)
    expect(screen.getByText('요청중')).toBeInTheDocument()
  })

  it('isOwner=true 이더라도 shareStatus=accepted이면 버튼이 렌더된다', () => {
    render(<TraceCard card={makeCard({ shareStatus: 'accepted' })} currentUserId="owner-1" />)
    expect(screen.getByText('Shared')).toBeInTheDocument()
  })
})

describe('TraceCard — 낙관적 업데이트 롤백', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('requestShare 실패 시 shareStatus가 none으로 롤백된다', async () => {
    vi.mocked(requestShare).mockRejectedValueOnce(new Error('서버 오류'))

    render(<TraceCard card={makeCard({ shareStatus: 'none' })} currentUserId="requester-1" />)

    // Share 버튼 클릭 → 다이얼로그 오픈
    await userEvent.click(screen.getByRole('button', { name: /share/i }))

    // 다이얼로그 내 "요청하기" 클릭
    const confirmBtn = await screen.findByRole('button', { name: '요청하기' })
    await userEvent.click(confirmBtn)

    // 요청 실패 후 none으로 롤백 → Share 버튼 다시 표시
    await waitFor(() => {
      expect(screen.getByText('Share')).toBeInTheDocument()
    })
  })

  it('requestShare 성공 시 shareStatus가 pending으로 유지된다', async () => {
    vi.mocked(requestShare).mockResolvedValueOnce(undefined)

    render(<TraceCard card={makeCard({ shareStatus: 'none' })} currentUserId="requester-1" />)

    await userEvent.click(screen.getByRole('button', { name: /share/i }))
    const confirmBtn = await screen.findByRole('button', { name: '요청하기' })
    await userEvent.click(confirmBtn)

    await waitFor(() => {
      expect(screen.getByText('요청중')).toBeInTheDocument()
    })
  })
})

describe('TraceCard — 자기 알림 안 생성', () => {
  it.todo(
    '알림 생성은 Supabase DB 트리거에서 처리됨 — 앱 레벨에 createNotification 함수 없어 단위 테스트 불가. 트리거 로직에서 from_user_id = user_id 행은 삽입하지 않아야 한다.',
  )
})
