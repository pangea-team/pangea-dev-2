-- supabase/migrations/20260601000004_create_share_requests.sql

-- share_requests 테이블
create table share_requests (
  id             uuid primary key default gen_random_uuid(),
  trace_card_id  uuid not null references trace_cards(id) on delete cascade,
  requester_id   uuid not null references auth.users(id) on delete cascade,
  owner_id       uuid not null references auth.users(id) on delete cascade,
  status         text not null default 'pending'
                   check (status in ('pending', 'accepted', 'rejected', 'cancelled')),
  message        text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- 본인한테 신청 못 하도록
alter table share_requests
  add constraint share_requests_no_self_request
  check (requester_id != owner_id);

-- RLS
alter table share_requests enable row level security;

-- 신청자 or 소유자만 조회 가능
create policy "Requester and owner can read share requests"
  on share_requests for select
  using (
    auth.uid() = requester_id or
    auth.uid() = owner_id
  );

-- 본인만 신청 가능 (requester_id = 본인)
create policy "Authenticated users can insert share requests"
  on share_requests for insert
  with check (auth.uid() = requester_id);

-- 소유자는 수락/거절, 신청자는 취소만 가능
create policy "Owner can accept or reject, requester can cancel"
  on share_requests for update
  using (
    auth.uid() = owner_id or
    auth.uid() = requester_id
  );

-- 인덱스
create index on share_requests(owner_id, status, created_at desc);
create index on share_requests(requester_id, status, created_at desc);
create index on share_requests(trace_card_id);

-- updated_at 자동 갱신 트리거
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger share_requests_updated_at
  before update on share_requests
  for each row execute function update_updated_at();