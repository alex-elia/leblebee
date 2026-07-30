-- Leblebee MVP schema

create extension if not exists "pgcrypto";

create type public.user_role as enum ('admin', 'client', 'supplier');
create type public.task_status as enum (
  'draft',
  'assigned',
  'accepted',
  'done',
  'follow_up',
  'closed',
  'cancelled'
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null,
  display_name text,
  preferred_language text not null default 'en',
  created_at timestamptz not null default now()
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  address_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.property_memory (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  bullet text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.providers (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  name text not null,
  email text,
  phone text,
  whatsapp text,
  language text not null default 'el',
  specialties text[] not null default '{}',
  notes text,
  created_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  client_id uuid not null references public.profiles (id) on delete cascade,
  assigned_provider_id uuid references public.providers (id) on delete set null,
  category text not null default 'cleaning',
  title text not null,
  description text,
  source_language text not null default 'en',
  status public.task_status not null default 'draft',
  priority text not null default 'normal',
  due_at timestamptz,
  completion_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.task_translations (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  lang text not null,
  title text,
  body text,
  model text,
  created_at timestamptz not null default now(),
  unique (task_id, lang)
);

create table public.task_events (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  actor_id uuid references public.profiles (id) on delete set null,
  event_type text not null,
  note text,
  created_at timestamptz not null default now()
);

create table public.task_attachments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  created_by uuid references public.profiles (id) on delete set null,
  storage_path text not null,
  kind text not null default 'handoff',
  caption text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.property_memory enable row level security;
alter table public.providers enable row level security;
alter table public.tasks enable row level security;
alter table public.task_translations enable row level security;
alter table public.task_events enable row level security;
alter table public.task_attachments enable row level security;

create or replace function public.current_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "profiles_self_select"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "profiles_self_insert"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_self_update"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

create policy "properties_client_all"
  on public.properties for all
  using (auth.uid() = client_id or public.is_admin())
  with check (auth.uid() = client_id or public.is_admin());

create policy "providers_client_all"
  on public.providers for all
  using (auth.uid() = client_id or public.is_admin())
  with check (auth.uid() = client_id or public.is_admin());

create policy "tasks_client_all"
  on public.tasks for all
  using (auth.uid() = client_id or public.is_admin())
  with check (auth.uid() = client_id or public.is_admin());

create policy "property_memory_via_client"
  on public.property_memory for all
  using (
    public.is_admin()
    or exists (
      select 1 from public.properties p
      where p.id = property_id and p.client_id = auth.uid()
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.properties p
      where p.id = property_id and p.client_id = auth.uid()
    )
  );

create policy "task_child_via_client_translations"
  on public.task_translations for all
  using (
    public.is_admin()
    or exists (
      select 1 from public.tasks t
      where t.id = task_id and t.client_id = auth.uid()
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.tasks t
      where t.id = task_id and t.client_id = auth.uid()
    )
  );

create policy "task_child_via_client_events"
  on public.task_events for all
  using (
    public.is_admin()
    or exists (
      select 1 from public.tasks t
      where t.id = task_id and t.client_id = auth.uid()
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.tasks t
      where t.id = task_id and t.client_id = auth.uid()
    )
  );

create policy "task_child_via_client_attachments"
  on public.task_attachments for all
  using (
    public.is_admin()
    or exists (
      select 1 from public.tasks t
      where t.id = task_id and t.client_id = auth.uid()
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.tasks t
      where t.id = task_id and t.client_id = auth.uid()
    )
  );

-- Suppliers can read tasks assigned to their linked provider contact
create policy "tasks_supplier_read"
  on public.tasks for select
  using (
    exists (
      select 1 from public.providers pr
      where pr.id = assigned_provider_id and pr.user_id = auth.uid()
    )
  );

create policy "tasks_supplier_update"
  on public.tasks for update
  using (
    exists (
      select 1 from public.providers pr
      where pr.id = assigned_provider_id and pr.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.providers pr
      where pr.id = assigned_provider_id and pr.user_id = auth.uid()
    )
  );
