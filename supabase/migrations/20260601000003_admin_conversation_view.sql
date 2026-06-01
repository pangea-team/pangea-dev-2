-- 운영자용 대화 조회 View + conversations 테이블 개선
-- 기존 messages 저장 로직 및 채팅 UI 조회 방식은 변경하지 않음

-- ============================================================
-- 1. conversations 테이블 컬럼 추가
-- ============================================================

alter table public.conversations
  add column updated_at      timestamptz not null default now(),
  add column last_message_at timestamptz,
  add column message_count   integer     not null default 0,
  add column summary         text,
  add column status          text        not null default 'active'
    check (status in ('active', 'trace_created', 'completed'));

-- ============================================================
-- 2. messages 삽입 시 conversations 자동 동기화 트리거
-- ============================================================

create or replace function public.sync_conversation_on_message()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.conversations
  set
    updated_at      = now(),
    last_message_at = now(),
    message_count   = (
      select count(*)::integer from public.messages
      where conversation_id = NEW.conversation_id
    )
  where id = NEW.conversation_id;
  return NEW;
end;
$$;

create trigger on_message_inserted
  after insert on public.messages
  for each row execute procedure public.sync_conversation_on_message();

-- ============================================================
-- 3. trace_card 연결 시 conversations.status 업데이트 트리거
-- ============================================================

create or replace function public.sync_conversation_status_on_trace()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if NEW.conversation_id is not null then
    update public.conversations
    set status = 'trace_created', updated_at = now()
    where id = NEW.conversation_id
      and status = 'active';
  end if;
  return NEW;
end;
$$;

create trigger on_trace_linked_to_conversation
  after insert or update of conversation_id on public.trace_cards
  for each row execute procedure public.sync_conversation_status_on_trace();

-- ============================================================
-- 4. 기존 대화 데이터 message_count / last_message_at 초기 동기화
-- ============================================================

update public.conversations c
set
  message_count   = sub.cnt,
  last_message_at = sub.last_at,
  updated_at      = coalesce(sub.last_at, c.created_at)
from (
  select
    conversation_id,
    count(*)::integer as cnt,
    max(created_at)   as last_at
  from public.messages
  group by conversation_id
) sub
where c.id = sub.conversation_id;

-- ============================================================
-- 5. 운영자용 대화 조회 View
--    security_invoker 미설정(default off) → owner(postgres) 권한으로 실행
--    authenticated/anon 에게 grant 하지 않음 → service_role 전용
-- ============================================================

create view public.admin_conversation_logs as
select
  c.id                                              as conversation_id,
  c.user_id,
  p.nickname,
  c.book_id,
  b.title                                           as book_title,
  c.status,
  c.summary,
  c.created_at                                      as conversation_created_at,
  min(m.created_at)                                 as first_message_at,
  max(m.created_at)                                 as last_message_at,
  count(m.id)::integer                              as message_count,
  string_agg(
    case
      when m.role = 'user' then
        '👤 USER: ' || case
          when trim(m.content) = '' and jsonb_array_length(m.attachments) > 0 then '[첨부만 있음]'
          when trim(m.content) = '' then '[내용 없음]'
          else trim(m.content)
        end
      when m.role = 'assistant' then
        '🤖 AI: ' || coalesce(nullif(trim(m.content), ''), '[내용 없음]')
      else
        upper(m.role) || ': ' || coalesce(nullif(trim(m.content), ''), '[내용 없음]')
    end,
    E'\n\n'
    order by m.created_at
  )                                                 as conversation_text,
  t.id                                              as trace_id,
  t.quote                                           as trace_quote,
  t.representative_sentence                         as trace_representative_sentence,
  t.updated_at                                      as trace_updated_at
from      public.conversations  c
left join public.messages        m on m.conversation_id = c.id
left join public.profiles        p on p.id = c.user_id
left join public.books           b on b.id = c.book_id
left join public.trace_cards     t on t.conversation_id = c.id
group by
  c.id, c.user_id, p.nickname,
  c.book_id, b.title,
  c.status, c.summary, c.created_at,
  t.id, t.quote, t.representative_sentence, t.updated_at;

-- authenticated / anon 에게는 grant 없음
-- 관리자 API 라우트에서 SUPABASE_SERVICE_ROLE_KEY 로만 조회할 것
