import { deriveShareStatusMap } from '@/lib/share-status'
import { describe, expect, it } from 'vitest'

describe('deriveShareStatusMap', () => {
  it('accepted가 pending보다 우선된다 (pending 먼저 삽입)', () => {
    const map = deriveShareStatusMap([
      { trace_card_id: 'c1', status: 'pending' },
      { trace_card_id: 'c1', status: 'accepted' },
    ])
    expect(map.get('c1')).toBe('accepted')
  })

  it('accepted 이후 pending이 와도 accepted가 유지된다', () => {
    const map = deriveShareStatusMap([
      { trace_card_id: 'c1', status: 'accepted' },
      { trace_card_id: 'c1', status: 'pending' },
    ])
    expect(map.get('c1')).toBe('accepted')
  })

  it('rejected 상태는 map에 포함되지 않아 none으로 처리된다', () => {
    const map = deriveShareStatusMap([{ trace_card_id: 'c1', status: 'rejected' }])
    expect(map.get('c1')).toBeUndefined()
  })

  it('cancelled 상태는 map에 포함되지 않아 none으로 처리된다', () => {
    const map = deriveShareStatusMap([{ trace_card_id: 'c1', status: 'cancelled' }])
    expect(map.get('c1')).toBeUndefined()
  })

  it('trace_card_id가 null인 항목은 무시된다', () => {
    const map = deriveShareStatusMap([{ trace_card_id: null, status: 'accepted' }])
    expect(map.size).toBe(0)
  })

  it('requester/owner 양쪽에서 온 결과를 카드 단위로 올바르게 집계한다', () => {
    // DB 쿼리에서 requester_id OR owner_id 매칭으로 두 행이 올 수 있는 상황
    const map = deriveShareStatusMap([
      { trace_card_id: 'c1', status: 'accepted' },
      { trace_card_id: 'c2', status: 'pending' },
      { trace_card_id: 'c3', status: 'rejected' },
    ])
    expect(map.get('c1')).toBe('accepted')
    expect(map.get('c2')).toBe('pending')
    expect(map.get('c3')).toBeUndefined()
  })
})
