-- notifications.type CHECK 제약을 즉시 매칭 구조에 맞게 업데이트
-- exchange_request, exchange_accepted → exchange_matched 로 통합
alter table notifications
  drop constraint notifications_type_check;

alter table notifications
  add constraint notifications_type_check
  check (type in ('like', 'comment', 'exchange_matched'));
