-- profiles.display_name → full_name (실명, 서버 전용)
-- profiles.username     → nickname  (사용자 정한 닉네임)
-- trace_cards.me_thought → representative_sentence
alter table public.profiles rename column display_name to full_name;
alter table public.profiles rename column username to nickname;

-- unique 제약 이름도 컬럼명에 맞게 정리
alter table public.profiles rename constraint profiles_username_key to profiles_nickname_key;

-- trace_cards.me_thought → representative_sentence
alter table public.trace_cards rename column me_thought to representative_sentence;

-- 뷰 재생성: CREATE OR REPLACE VIEW는 컬럼명 변경 불가 → DROP 후 재생성
drop view public.trace_cards_with_counts;
create view public.trace_cards_with_counts with (security_invoker = on) as
  select t.*,
    (select count(*) from public.reactions r where r.trace_card_id = t.id and r.type = 'heart') as heart_count,
    (select count(*) from public.comments  c where c.trace_card_id = t.id) as comment_count
  from public.trace_cards t;
grant select on public.trace_cards_with_counts to anon, authenticated;

-- 가입 트리거: full_name 컬럼에 카카오 실명 삽입
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name',
             new.raw_user_meta_data ->> 'full_name',
             new.raw_user_meta_data ->> 'nickname', '독자'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end; $$;
