create or replace function notify_on_instant_match()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- owner에게: 누가 내 trace를 읽음
  insert into notifications (user_id, type, from_user_id, trace_card_id, message)
  values (new.owner_id, 'exchange_matched', new.requester_id, new.trace_card_id, '님이 나의 trace를 읽습니다');

  -- requester에게: 내가 누구의 trace를 읽음
  insert into notifications (user_id, type, from_user_id, trace_card_id, message)
  values (new.requester_id, 'exchange_matched', new.owner_id, new.trace_card_id, '님의 trace를 읽습니다');

  return new;
end;
$$;
