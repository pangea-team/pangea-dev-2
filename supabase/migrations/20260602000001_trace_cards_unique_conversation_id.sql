-- conversation 하나에 trace 하나만 허용 (중복 INSERT 방지)
-- 기존 중복 row가 있다면 최신 것만 남기고 제거
delete from public.trace_cards
where id not in (
  select distinct on (conversation_id) id
  from public.trace_cards
  where conversation_id is not null
  order by conversation_id, created_at desc
);

alter table public.trace_cards
  add constraint trace_cards_conversation_id_key unique (conversation_id);
