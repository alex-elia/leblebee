-- Typed playbook items per apartment (access, stock, standard tasks)

alter table public.property_memory
  add column if not exists kind text not null default 'note';

alter table public.property_memory
  drop constraint if exists property_memory_kind_check;

alter table public.property_memory
  add constraint property_memory_kind_check
  check (kind in ('access', 'materials', 'standard', 'note'));

create index if not exists property_memory_property_kind_idx
  on public.property_memory (property_id, kind, sort_order);

-- Optional specific extras on a task (this visit only)
alter table public.tasks
  add column if not exists specific_notes text;
