-- 신청 전 양측 매칭 완료 여부 확인 (RLS 우회 필요하므로 security definer)
-- 요청자(p_requester_id) 또는 카드 소유자(p_owner_id) 중 한 명이라도
-- 이미 accepted 상태인 share_request에 관여되어 있으면 false 반환
create or replace function check_share_eligibility(p_requester_id uuid, p_owner_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  select count(*) into v_count
  from share_requests
  where status = 'accepted'
    and (
      requester_id = p_requester_id or owner_id = p_requester_id or
      requester_id = p_owner_id     or owner_id = p_owner_id
    );

  return v_count = 0;
end;
$$;

grant execute on function check_share_eligibility(uuid, uuid) to authenticated;
