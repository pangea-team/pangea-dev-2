drop extension if exists "pg_net";

revoke delete on table "public"."books" from "anon";

revoke insert on table "public"."books" from "anon";

revoke update on table "public"."books" from "anon";

revoke delete on table "public"."books" from "authenticated";

revoke delete on table "public"."books" from "service_role";

revoke insert on table "public"."books" from "service_role";

revoke select on table "public"."books" from "service_role";

revoke update on table "public"."books" from "service_role";

revoke delete on table "public"."comments" from "anon";

revoke insert on table "public"."comments" from "anon";

revoke update on table "public"."comments" from "anon";

revoke update on table "public"."comments" from "authenticated";

revoke delete on table "public"."comments" from "service_role";

revoke insert on table "public"."comments" from "service_role";

revoke select on table "public"."comments" from "service_role";

revoke update on table "public"."comments" from "service_role";

revoke delete on table "public"."conversations" from "anon";

revoke insert on table "public"."conversations" from "anon";

revoke select on table "public"."conversations" from "anon";

revoke update on table "public"."conversations" from "anon";

revoke delete on table "public"."conversations" from "authenticated";

revoke update on table "public"."conversations" from "authenticated";

revoke delete on table "public"."conversations" from "service_role";

revoke insert on table "public"."conversations" from "service_role";

revoke select on table "public"."conversations" from "service_role";

revoke update on table "public"."conversations" from "service_role";

revoke delete on table "public"."messages" from "anon";

revoke insert on table "public"."messages" from "anon";

revoke select on table "public"."messages" from "anon";

revoke update on table "public"."messages" from "anon";

revoke delete on table "public"."messages" from "authenticated";

revoke update on table "public"."messages" from "authenticated";

revoke delete on table "public"."messages" from "service_role";

revoke insert on table "public"."messages" from "service_role";

revoke select on table "public"."messages" from "service_role";

revoke update on table "public"."messages" from "service_role";

revoke delete on table "public"."notifications" from "anon";

revoke insert on table "public"."notifications" from "anon";

revoke select on table "public"."notifications" from "anon";

revoke update on table "public"."notifications" from "anon";

revoke delete on table "public"."notifications" from "authenticated";

revoke insert on table "public"."notifications" from "authenticated";

revoke select on table "public"."notifications" from "authenticated";

revoke update on table "public"."notifications" from "authenticated";

revoke delete on table "public"."notifications" from "service_role";

revoke insert on table "public"."notifications" from "service_role";

revoke select on table "public"."notifications" from "service_role";

revoke update on table "public"."notifications" from "service_role";

revoke delete on table "public"."profiles" from "anon";

revoke insert on table "public"."profiles" from "anon";

revoke update on table "public"."profiles" from "anon";

revoke delete on table "public"."profiles" from "authenticated";

revoke insert on table "public"."profiles" from "authenticated";

revoke delete on table "public"."profiles" from "service_role";

revoke insert on table "public"."profiles" from "service_role";

revoke select on table "public"."profiles" from "service_role";

revoke update on table "public"."profiles" from "service_role";

revoke delete on table "public"."reactions" from "anon";

revoke insert on table "public"."reactions" from "anon";

revoke update on table "public"."reactions" from "anon";

revoke update on table "public"."reactions" from "authenticated";

revoke delete on table "public"."reactions" from "service_role";

revoke insert on table "public"."reactions" from "service_role";

revoke select on table "public"."reactions" from "service_role";

revoke update on table "public"."reactions" from "service_role";

revoke delete on table "public"."share_requests" from "anon";

revoke insert on table "public"."share_requests" from "anon";

revoke select on table "public"."share_requests" from "anon";

revoke update on table "public"."share_requests" from "anon";

revoke delete on table "public"."share_requests" from "authenticated";

revoke insert on table "public"."share_requests" from "authenticated";

revoke select on table "public"."share_requests" from "authenticated";

revoke update on table "public"."share_requests" from "authenticated";

revoke delete on table "public"."share_requests" from "service_role";

revoke insert on table "public"."share_requests" from "service_role";

revoke select on table "public"."share_requests" from "service_role";

revoke update on table "public"."share_requests" from "service_role";

revoke delete on table "public"."trace_cards" from "anon";

revoke insert on table "public"."trace_cards" from "anon";

revoke update on table "public"."trace_cards" from "anon";

revoke delete on table "public"."trace_cards" from "service_role";

revoke insert on table "public"."trace_cards" from "service_role";

revoke select on table "public"."trace_cards" from "service_role";

revoke update on table "public"."trace_cards" from "service_role";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$
;


