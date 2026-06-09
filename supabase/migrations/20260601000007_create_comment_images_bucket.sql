-- comment-images 버킷: public 읽기 + 인증 유저 본인 경로 쓰기
insert into storage.buckets (id, name, public)
  values ('comment-images', 'comment-images', true)
  on conflict (id) do nothing;

-- 인증된 유저만 업로드 가능, 반드시 본인 user_id를 첫 번째 경로 세그먼트로 사용
create policy "auth upload comment-images" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'comment-images'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );

-- public 버킷이므로 별도 SELECT policy 없이 누구나 URL로 읽기 가능
-- (Supabase public bucket 기본 동작)
