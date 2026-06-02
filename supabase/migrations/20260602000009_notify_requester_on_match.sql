-- 즉시 매칭 시 owner뿐 아니라 requester에게도 알림 발송
create or replace function notify_on_instant_match()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- owner에게 알림: 누군가 내 trace에 연결됨
  insert into notifications (user_id, type, from_user_id, trace_card_id, message)
  values (new.owner_id, 'exchange_matched', new.requester_id, new.trace_card_id, 'trace를 공유하기 시작했습니다');

  -- requester에게 알림: 연결 완료
  insert into notifications (user_id, type, from_user_id, trace_card_id, message)
  values (new.requester_id, 'exchange_matched', new.owner_id, new.trace_card_id, 'trace가 연결됐습니다');

  return new;
end;
$$;
