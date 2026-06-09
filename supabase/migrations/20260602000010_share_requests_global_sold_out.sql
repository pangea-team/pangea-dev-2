-- share_requests: 매칭 완료(accepted) 상태를 모든 인증 유저에게 공개 (품절 표시)
-- 기존 구조: 당사자(requester/owner)만 조회 가능
-- 변경 후: accepted 행은 전체 공개, 당사자는 상태 무관 조회

drop policy if exists "Requester and owner can read share requests" on share_requests;

create policy "Accepted requests are public; parties can read all"
  on share_requests for select
  using (
    status = 'accepted'
    or auth.uid() = requester_id
    or auth.uid() = owner_id
  );

-- 전역 품절 조회 최적화 인덱스
create index if not exists share_requests_card_status_idx
  on share_requests(trace_card_id, status);

-- 비로그인 유저도 accepted 행 조회 가능 (publishable key = anon 롤)
grant select on public.share_requests to anon;

-- Realtime 구독 활성화
alter publication supabase_realtime add table share_requests;
