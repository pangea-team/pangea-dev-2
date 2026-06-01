-- comments 테이블에 image_url 컬럼 추가
-- (Supabase Studio에서 직접 적용됐으며, 이 파일은 migration history 정합성을 위해 보완됨)
alter table public.comments
  add column if not exists image_url text;
