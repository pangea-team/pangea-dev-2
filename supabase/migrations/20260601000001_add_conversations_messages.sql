-- Phase 3: conversations / messages / trace_cards.conversation_id / Storage bucket

-- ---------- conversations ----------
create table public.conversations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  book_id    uuid not null references public.books (id) on delete cascade,
  created_at timestamptz not null default now()
);
create index conversations_user_idx on public.conversations (user_id);
alter table public.conversations enable row level security;
grant select, insert on public.conversations to authenticated;
create policy "own conversations" on public.conversations
  for all to authenticated
  using  ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ---------- messages ----------
create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  role            text not null check (role in ('user', 'assistant')),
  content         text not null default '',
  attachments     jsonb not null default '[]'::jsonb,
  created_at      timestamptz not null default now()
);
create index messages_conversation_idx on public.messages (conversation_id, created_at);
alter table public.messages enable row level security;
grant select, insert on public.messages to authenticated;
create policy "own messages" on public.messages
  for all to authenticated
  using (
    (select user_id from public.conversations where id = conversation_id) = (select auth.uid())
  )
  with check (
    (select user_id from public.conversations where id = conversation_id) = (select auth.uid())
  );

-- ---------- trace_cards.conversation_id ----------
alter table public.trace_cards
  add column conversation_id uuid references public.conversations (id) on delete set null;

-- ---------- Storage: book-pages 버킷 (비공개 + RLS) ----------
insert into storage.buckets (id, name, public)
  values ('book-pages', 'book-pages', false)
  on conflict (id) do nothing;

create policy "auth upload book-pages" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'book-pages'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "auth read own book-pages" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'book-pages'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );
