-- PANGEA 초기 스키마 (MVP): profiles / books / trace_cards / comments / reactions

-- ---------- profiles ----------
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  username     text unique,                       -- nullable: 온보딩에서 설정
  display_name text not null default '독자',
  avatar_url   text,
  bio          text,
  created_at   timestamptz not null default now()
);
alter table public.profiles enable row level security;
grant select on public.profiles to anon, authenticated;
grant update on public.profiles to authenticated;
create policy "profiles readable" on public.profiles
  for select to anon, authenticated using (true);
create policy "update own profile" on public.profiles
  for update to authenticated using ((select auth.uid()) = id);

-- 가입 트리거: auth.users 생성 시 profiles 자동 생성 (security definer라 RLS 우회)
create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name',
             new.raw_user_meta_data ->> 'full_name',
             new.raw_user_meta_data ->> 'nickname', '독자'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end; $$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- books ----------
create table public.books (
  id             uuid primary key default gen_random_uuid(),
  aladin_item_id bigint unique,
  title          text not null,
  author         text,
  cover_url      text,
  isbn           text unique,        -- isbn13
  publisher      text,
  published_date text,               -- 'YYYY-MM-DD' (알라딘 pubDate)
  created_at     timestamptz not null default now()
);
alter table public.books enable row level security;
grant select on public.books to anon, authenticated;
grant insert, update on public.books to authenticated;
create policy "books readable" on public.books
  for select to anon, authenticated using (true);
create policy "auth upsert books" on public.books
  for insert to authenticated with check (true);
create policy "auth update books" on public.books
  for update to authenticated using (true);

-- ---------- trace_cards ----------
create table public.trace_cards (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles (id) on delete cascade,
  book_id        uuid not null references public.books (id),
  quote          text,
  me_thought     text,
  trace_expanded text,
  layers         jsonb not null default '[]'::jsonb,   -- 레거시, 추후 제거 가능
  is_public      boolean not null default false,       -- 기본 비공개(안전)
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index trace_cards_user_idx on public.trace_cards (user_id);
create index trace_cards_book_idx on public.trace_cards (book_id);
create index trace_cards_feed_idx on public.trace_cards (created_at desc) where is_public;
alter table public.trace_cards enable row level security;
grant select, insert, update, delete on public.trace_cards to authenticated;
grant select on public.trace_cards to anon;          -- 공개 trace 비로그인 열람
create policy "public or own readable" on public.trace_cards
  for select to anon, authenticated
  using (is_public or (select auth.uid()) = user_id);
create policy "insert own trace" on public.trace_cards
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update own trace" on public.trace_cards
  for update to authenticated using ((select auth.uid()) = user_id);
create policy "delete own trace" on public.trace_cards
  for delete to authenticated using ((select auth.uid()) = user_id);

-- ---------- comments ----------
create table public.comments (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  trace_card_id uuid not null references public.trace_cards (id) on delete cascade,
  content       text not null,
  created_at    timestamptz not null default now()
);
create index comments_trace_idx on public.comments (trace_card_id);
alter table public.comments enable row level security;
grant select, insert, delete on public.comments to authenticated;
grant select on public.comments to anon;
create policy "comments on visible traces" on public.comments
  for select to anon, authenticated using (exists (
    select 1 from public.trace_cards t
    where t.id = trace_card_id and (t.is_public or t.user_id = (select auth.uid()))));
create policy "insert own comment" on public.comments
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "delete own comment" on public.comments
  for delete to authenticated using ((select auth.uid()) = user_id);

-- ---------- reactions ----------
create table public.reactions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  trace_card_id uuid not null references public.trace_cards (id) on delete cascade,
  type          text not null default 'heart' check (type in ('heart')),  -- 북마크 시 'bookmark' 추가
  created_at    timestamptz not null default now(),
  unique (user_id, trace_card_id, type)
);
create index reactions_trace_idx on public.reactions (trace_card_id);
alter table public.reactions enable row level security;
grant select, insert, delete on public.reactions to authenticated;
grant select on public.reactions to anon;
create policy "reactions on visible traces" on public.reactions
  for select to anon, authenticated using (exists (
    select 1 from public.trace_cards t
    where t.id = trace_card_id and (t.is_public or t.user_id = (select auth.uid()))));
create policy "insert own reaction" on public.reactions
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "delete own reaction" on public.reactions
  for delete to authenticated using ((select auth.uid()) = user_id);

-- ---------- 카운트 집계 뷰 (security_invoker로 RLS 존중) ----------
create view public.trace_cards_with_counts with (security_invoker = on) as
  select t.*,
    (select count(*) from public.reactions r where r.trace_card_id = t.id and r.type = 'heart') as heart_count,
    (select count(*) from public.comments  c where c.trace_card_id = t.id) as comment_count
  from public.trace_cards t;
grant select on public.trace_cards_with_counts to anon, authenticated;