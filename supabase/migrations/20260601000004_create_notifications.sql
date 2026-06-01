create table notifications (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  type          text not null check (type in ('like', 'comment', 'exchange_request', 'exchange_accepted')),
  from_user_id  uuid references public.profiles(id) on delete set null,
  trace_card_id uuid references trace_cards(id) on delete set null,
  message       text not null default '',
  is_read       boolean not null default false,
  created_at    timestamptz not null default now()
);

alter table notifications enable row level security;

create policy "Users can read own notifications"
  on notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on notifications for update
  using (auth.uid() = user_id);

create index on notifications(user_id, created_at desc);
create index on notifications(user_id, is_read);
