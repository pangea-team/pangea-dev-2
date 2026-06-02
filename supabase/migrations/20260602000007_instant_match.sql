-- 즉시 매칭 구조로 전환
-- 1. 기존 pending 행 일괄 취소
update share_requests set status = 'cancelled' where status = 'pending';

-- 2. 수락/거절 흐름 트리거/함수 제거
drop trigger if exists share_requests_notify_request on share_requests;
drop trigger if exists share_requests_notify_accepted on share_requests;
drop function if exists notify_on_share_request();
drop function if exists notify_on_share_accepted();

-- 3. 즉시 매칭 알림: share_requests INSERT 시 owner에게 알림
create or replace function notify_on_instant_match()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into notifications (user_id, type, from_user_id, trace_card_id, message)
  values (new.owner_id, 'exchange_matched', new.requester_id, new.trace_card_id, 'trace를 공유하기 시작했습니다');
  return new;
end;
$$;

create trigger share_requests_notify_match
  after insert on share_requests
  for each row execute function notify_on_instant_match();
