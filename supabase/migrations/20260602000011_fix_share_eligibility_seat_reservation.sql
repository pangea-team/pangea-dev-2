-- 자리선점 방식으로 수정: owner_id(수신자) 의 자리만 확인
-- requester_id(발신자) 는 이미 다른 곳에 요청을 보냈어도 요청을 받을 수 있음
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
    and owner_id = p_owner_id;

  return v_count = 0;
end;
$$;
