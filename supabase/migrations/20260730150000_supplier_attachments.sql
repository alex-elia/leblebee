-- Suppliers can read/write handoff attachments on assigned tasks

create policy "task_attachments_supplier"
  on public.task_attachments for all
  using (
    exists (
      select 1
      from public.tasks t
      join public.providers pr on pr.id = t.assigned_provider_id
      where t.id = task_id and pr.user_id = auth.uid()
    )
  )
  with check (
    created_by = auth.uid()
    and exists (
      select 1
      from public.tasks t
      join public.providers pr on pr.id = t.assigned_provider_id
      where t.id = task_id and pr.user_id = auth.uid()
    )
  );
