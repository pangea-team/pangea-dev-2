'use server'

import { createClient } from '@/lib/supabase/server'

export async function requestShare(traceCardId: string, ownerId: string): Promise<void> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  if (user.id === ownerId) throw new Error('본인 글에는 거래를 신청할 수 없습니다')

  const { data: eligible, error: eligibilityError } = await supabase.rpc(
    'check_share_eligibility',
    {
      p_requester_id: user.id,
      p_owner_id: ownerId,
    },
  )
  if (eligibilityError) throw eligibilityError
  if (!eligible) throw new Error('이미 매칭이 완료된 유저입니다')

  const { error } = await supabase.from('share_requests').insert({
    trace_card_id: traceCardId,
    requester_id: user.id,
    owner_id: ownerId,
    status: 'accepted',
  })
  if (error) throw error
}
