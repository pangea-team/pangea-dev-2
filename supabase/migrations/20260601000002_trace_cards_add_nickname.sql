-- trace_cards.nickname: trace 작성 시점의 닉네임 스냅샷 (모델 인자 아닌 서버 주입)
alter table public.trace_cards
  add column nickname text not null default '';
