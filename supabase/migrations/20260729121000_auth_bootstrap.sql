-- Auth bootstrap: persona on signup; admin email is always admin.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_email constant text := 'alex.gon@eliago.com';
  chosen text := lower(coalesce(new.raw_user_meta_data->>'role', ''));
  resolved public.user_role;
begin
  if lower(coalesce(new.email, '')) = admin_email then
    resolved := 'admin';
  elsif chosen in ('client', 'supplier') then
    resolved := chosen::public.user_role;
  else
    -- Force an explicit choice later; default to client for incomplete OTP meta
    resolved := 'client';
  end if;

  insert into public.profiles (id, role, display_name, preferred_language)
  values (
    new.id,
    resolved,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'preferred_language', 'en')
  )
  on conflict (id) do update
    set role = excluded.role
    where public.profiles.role is distinct from excluded.role
      and lower(coalesce(new.email, '')) = admin_email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Storage bucket for task handoff photos
insert into storage.buckets (id, name, public)
values ('task-attachments', 'task-attachments', false)
on conflict (id) do nothing;

drop policy if exists "task_attachments_storage_host" on storage.objects;
create policy "task_attachments_storage_auth"
  on storage.objects for all
  using (
    bucket_id = 'task-attachments'
    and auth.role() = 'authenticated'
  )
  with check (
    bucket_id = 'task-attachments'
    and auth.role() = 'authenticated'
  );
