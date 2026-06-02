-- notifications 테이블 RLS 정책은 있으나 테이블 레벨 권한이 없어
-- authenticated 롤이 쿼리 자체를 실행하지 못하는 문제 수정.
-- INSERT는 SECURITY DEFINER 트리거에서만 처리하므로 제외.
grant select, update on public.notifications to authenticated;
