-- Leblebee local seed — applied on `supabase db reset`
-- Optional local password for all seed users: leblebee-dev
-- Prefer magic-link sign-in in the app (Mailpit).

-- Admin: Alex Gon <alex.gon@eliago.com>
do $$
declare
  v_id uuid := 'a0000000-0000-4000-8000-000000000001';
  v_email text := 'alex.gon@eliago.com';
  v_name text := 'Alex Gon';
  v_role public.user_role := 'admin';
  v_instance uuid;
  v_existing uuid;
begin
  select id into v_instance from auth.instances limit 1;
  if v_instance is null then
    v_instance := '00000000-0000-0000-0000-000000000000';
  end if;

  select id into v_existing from auth.users where email = v_email;
  if v_existing is null then
    insert into auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      v_id, v_instance, v_email,
      crypt('leblebee-dev', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('role', v_role::text, 'display_name', v_name, 'preferred_language', 'en'),
      false, 'authenticated', 'authenticated', '', '', '', ''
    );

    insert into auth.identities (
      id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at
    ) values (
      v_id, v_id,
      jsonb_build_object('sub', v_id::text, 'email', v_email, 'email_verified', true),
      'email', v_id::text, now(), now(), now()
    );
  else
    v_id := v_existing;
  end if;

  insert into public.profiles (id, role, display_name, preferred_language)
  values (v_id, v_role, v_name, 'en')
  on conflict (id) do update
  set role = excluded.role,
      display_name = excluded.display_name,
      preferred_language = excluded.preferred_language;
end $$;

-- Client: Alex GonClient <alex.gon26@gmail.com>
do $$
declare
  v_id uuid := 'a0000000-0000-4000-8000-000000000002';
  v_email text := 'alex.gon26@gmail.com';
  v_name text := 'Alex GonClient';
  v_role public.user_role := 'client';
  v_instance uuid;
  v_existing uuid;
begin
  select id into v_instance from auth.instances limit 1;
  if v_instance is null then
    v_instance := '00000000-0000-0000-0000-000000000000';
  end if;

  select id into v_existing from auth.users where email = v_email;
  if v_existing is null then
    insert into auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      v_id, v_instance, v_email,
      crypt('leblebee-dev', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('role', v_role::text, 'display_name', v_name, 'preferred_language', 'en'),
      false, 'authenticated', 'authenticated', '', '', '', ''
    );

    insert into auth.identities (
      id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at
    ) values (
      v_id, v_id,
      jsonb_build_object('sub', v_id::text, 'email', v_email, 'email_verified', true),
      'email', v_id::text, now(), now(), now()
    );
  else
    v_id := v_existing;
  end if;

  insert into public.profiles (id, role, display_name, preferred_language)
  values (v_id, v_role, v_name, 'en')
  on conflict (id) do update
  set role = excluded.role,
      display_name = excluded.display_name,
      preferred_language = excluded.preferred_language;
end $$;

-- Supplier: Yorgos Vaxevanis <y.vax@gmail.com>
-- Seeded as supplier (local provider). Say if you wanted client instead.
do $$
declare
  v_id uuid := 'a0000000-0000-4000-8000-000000000003';
  v_email text := 'y.vax@gmail.com';
  v_name text := 'Yorgos Vaxevanis';
  v_role public.user_role := 'supplier';
  v_instance uuid;
  v_existing uuid;
  v_client_id uuid := 'a0000000-0000-4000-8000-000000000002';
begin
  select id into v_instance from auth.instances limit 1;
  if v_instance is null then
    v_instance := '00000000-0000-0000-0000-000000000000';
  end if;

  select id into v_existing from auth.users where email = v_email;
  if v_existing is null then
    insert into auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      v_id, v_instance, v_email,
      crypt('leblebee-dev', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('role', v_role::text, 'display_name', v_name, 'preferred_language', 'el'),
      false, 'authenticated', 'authenticated', '', '', '', ''
    );

    insert into auth.identities (
      id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at
    ) values (
      v_id, v_id,
      jsonb_build_object('sub', v_id::text, 'email', v_email, 'email_verified', true),
      'email', v_id::text, now(), now(), now()
    );
  else
    v_id := v_existing;
  end if;

  insert into public.profiles (id, role, display_name, preferred_language)
  values (v_id, v_role, v_name, 'el')
  on conflict (id) do update
  set role = excluded.role,
      display_name = excluded.display_name,
      preferred_language = excluded.preferred_language;

  -- Link Yorgos as supplier contact for Alex GonClient
  insert into public.providers (
    id, client_id, user_id, name, email, language, specialties, notes
  ) values (
    'b0000000-0000-4000-8000-000000000001',
    v_client_id,
    v_id,
    v_name,
    v_email,
    'el',
    array['cleaning', 'maintenance'],
    'Seed supplier — linked account'
  )
  on conflict (id) do update
  set user_id = excluded.user_id,
      email = excluded.email,
      name = excluded.name;

  insert into public.properties (
    id, client_id, name, address_notes
  ) values (
    'c0000000-0000-4000-8000-000000000001',
    v_client_id,
    'Analipsi Apt 12',
    'Lockbox 4421 · parking behind building'
  )
  on conflict (id) do nothing;

  delete from public.property_memory
  where property_id = 'c0000000-0000-4000-8000-000000000001';

  insert into public.property_memory (property_id, bullet, kind, sort_order)
  values
    ('c0000000-0000-4000-8000-000000000001', 'Lockbox 4421 on the left of the door', 'access', 0),
    ('c0000000-0000-4000-8000-000000000001', 'Building door code 1937#', 'access', 1),
    ('c0000000-0000-4000-8000-000000000001', 'Cleaning products under kitchen sink', 'materials', 0),
    ('c0000000-0000-4000-8000-000000000001', 'Spare linens in hallway closet', 'materials', 1),
    ('c0000000-0000-4000-8000-000000000001', 'Soaps & toilet paper in bathroom cabinet', 'materials', 2),
    ('c0000000-0000-4000-8000-000000000001', 'Clean all rooms', 'standard', 0),
    ('c0000000-0000-4000-8000-000000000001', 'Clean walls if mosquito stains', 'standard', 1),
    ('c0000000-0000-4000-8000-000000000001', 'Fill soaps and toilet paper', 'standard', 2),
    ('c0000000-0000-4000-8000-000000000001', 'Empty trash', 'standard', 3),
    ('c0000000-0000-4000-8000-000000000001', 'Leave AC remotes on kitchen counter', 'standard', 4),
    ('c0000000-0000-4000-8000-000000000001', 'Wifi card by the TV', 'note', 0);
end $$;
