-- Task messages for bilingual client↔supplier chat

create table public.task_messages (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  source_language text not null default 'en',
  translated_body text,
  target_language text,
  model text,
  created_at timestamptz not null default now()
);

create index task_messages_task_id_idx on public.task_messages (task_id, created_at);

alter table public.task_messages enable row level security;

create policy "task_messages_client"
  on public.task_messages for all
  using (
    public.is_admin()
    or exists (
      select 1 from public.tasks t
      where t.id = task_id and t.client_id = auth.uid()
    )
  )
  with check (
    public.is_admin()
    or (
      author_id = auth.uid()
      and exists (
        select 1 from public.tasks t
        where t.id = task_id and t.client_id = auth.uid()
      )
    )
  );

create policy "task_messages_supplier_read"
  on public.task_messages for select
  using (
    exists (
      select 1
      from public.tasks t
      join public.providers pr on pr.id = t.assigned_provider_id
      where t.id = task_id and pr.user_id = auth.uid()
    )
  );

create policy "task_messages_supplier_insert"
  on public.task_messages for insert
  with check (
    author_id = auth.uid()
    and exists (
      select 1
      from public.tasks t
      join public.providers pr on pr.id = t.assigned_provider_id
      where t.id = task_id and pr.user_id = auth.uid()
    )
  );

-- Suppliers can read translations for assigned tasks
create policy "task_translations_supplier_read"
  on public.task_translations for select
  using (
    exists (
      select 1
      from public.tasks t
      join public.providers pr on pr.id = t.assigned_provider_id
      where t.id = task_id and pr.user_id = auth.uid()
    )
  );

-- Suppliers can read property memory for assigned tasks (context)
create policy "property_memory_supplier_read"
  on public.property_memory for select
  using (
    exists (
      select 1
      from public.tasks t
      join public.providers pr on pr.id = t.assigned_provider_id
      where t.property_id = property_id and pr.user_id = auth.uid()
    )
  );

create policy "properties_supplier_read"
  on public.properties for select
  using (
    exists (
      select 1
      from public.tasks t
      join public.providers pr on pr.id = t.assigned_provider_id
      where t.property_id = properties.id and pr.user_id = auth.uid()
    )
  );
