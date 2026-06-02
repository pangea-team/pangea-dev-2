-- share_requests 테이블 RLS 정책은 있으나 테이블 레벨 권한이 없어
-- authenticated 롤이 insert/select/update를 실행하지 못하는 문제 수정.
grant select, insert, update on public.share_requests to authenticated;
