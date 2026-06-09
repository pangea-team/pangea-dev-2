-- owner_id당 accepted 행 최대 1개 보장 (레이스 컨디션 방지)
-- eligibility 체크와 INSERT 사이 틈에 두 명이 동시에 요청해도 두 번째 INSERT가 DB에서 거부됨
create unique index share_requests_owner_accepted_uniq
  on share_requests(owner_id)
  where status = 'accepted';
