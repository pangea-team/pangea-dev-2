-- reactions(heart) insert → like 알림
create or replace function notify_on_heart()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid;
begin
  if new.type != 'heart' then
    return new;
  end if;

  select user_id into v_owner_id
  from trace_cards
  where id = new.trace_card_id;

  -- 본인 좋아요는 알림 제외
  if v_owner_id is null or v_owner_id = new.user_id then
    return new;
  end if;

  insert into notifications (user_id, type, from_user_id, trace_card_id, message)
  values (v_owner_id, 'like', new.user_id, new.trace_card_id, '좋아요를 눌렀습니다');

  return new;
end;
$$;

create trigger reactions_notify_heart
  after insert on reactions
  for each row execute function notify_on_heart();

-- share_requests insert → exchange_request 알림
create or replace function notify_on_share_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into notifications (user_id, type, from_user_id, trace_card_id, message)
  values (new.owner_id, 'exchange_request', new.requester_id, new.trace_card_id, 'trace 교환을 신청했습니다');

  return new;
end;
$$;

create trigger share_requests_notify_request
  after insert on share_requests
  for each row execute function notify_on_share_request();

-- share_requests status → accepted 업데이트 → exchange_accepted 알림
create or replace function notify_on_share_accepted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status != 'accepted' and new.status = 'accepted' then
    insert into notifications (user_id, type, from_user_id, trace_card_id, message)
    values (new.requester_id, 'exchange_accepted', new.owner_id, new.trace_card_id, 'trace 교환 요청을 수락했습니다');
  end if;

  return new;
end;
$$;

create trigger share_requests_notify_accepted
  after update on share_requests
  for each row execute function notify_on_share_accepted();
