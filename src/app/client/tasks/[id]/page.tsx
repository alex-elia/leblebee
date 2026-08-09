import { PersonaShell } from "@/components/ui/persona-shell";
import { Button, StatusChip } from "@/components/ui";
import type { TaskStatus } from "@/components/ui/status-chip";
import { MessageComposer } from "@/components/tasks/message-composer";
import { MessageThread } from "@/components/tasks/message-thread";
import { HandoffGallery } from "@/components/tasks/handoff-gallery";
import { getArrivalPhotoUrls, getHandoffPhotoUrls } from "@/app/supplier/tasks/handoff-actions";
import { updateTaskStatus } from "../actions";
import { requireProfile } from "@/lib/auth/session";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Task",
};

export default async function ClientTaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, profile, supabase } = await requireProfile(["client", "admin"]);

  let query = supabase
    .from("tasks")
    .select(
      "*, providers!assigned_provider_id(id, name, language, email), properties!property_id(id, name)",
    )
    .eq("id", id);

  if (profile.role === "client") {
    query = query.eq("client_id", user.id);
  }

  const { data: task } = await query.maybeSingle();
  if (!task) notFound();

  const { data: translation } = await supabase
    .from("task_translations")
    .select("lang, title, body")
    .eq("task_id", id);

  const provider = Array.isArray(task.providers)
    ? task.providers[0]
    : task.providers;
  const property = Array.isArray(task.properties)
    ? task.properties[0]
    : task.properties;

  const supplierLang = provider?.language ?? "el";
  const supplierView = translation?.find((t) => t.lang === supplierLang);

  const { data: messages } = await supabase
    .from("task_messages")
    .select("id, body, translated_body, source_language, target_language, created_at, author_id")
    .eq("task_id", id)
    .order("created_at", { ascending: true });

  const authorIds = [...new Set((messages ?? []).map((m) => m.author_id))];
  const { data: authors } = authorIds.length
    ? await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", authorIds)
    : { data: [] as { id: string; display_name: string | null }[] };

  const authorMap = new Map(
    (authors ?? []).map((a) => [a.id, a.display_name]),
  );

  const arrivalPhotos = await getArrivalPhotoUrls(id);
  const departurePhotos = await getHandoffPhotoUrls(id);
  const hasArrivalPhotos = arrivalPhotos.length > 0;
  const hasDeparturePhotos = departurePhotos.length > 0;

  return (
    <PersonaShell
      role={profile.role}
      displayName={profile.display_name}
      email={user.email}
    >
      <p className="mb-4 text-sm font-semibold text-ink-muted">
        <Link href="/client/tasks" className="hover:text-olive">
          ← Tasks
        </Link>
      </p>

      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-ink sm:text-4xl">
            {task.title}
          </h1>
          <p className="mt-1 text-ink-muted">
            {property?.name ?? "Property"}
            {provider?.name ? ` · ${provider.name}` : ""}
            {task.due_at
              ? ` · due ${new Date(task.due_at).toLocaleString()}`
              : ""}
          </p>
        </div>
        <StatusChip status={task.status as TaskStatus} />
      </div>

      <section className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[var(--radius-md)] border border-line bg-foam p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Your instructions
          </p>
          <p className="whitespace-pre-wrap text-ink">{task.description}</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-line bg-foam p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Supplier view ({supplierLang.toUpperCase()})
          </p>
          <p className="font-semibold text-ink">
            {supplierView?.title ?? task.title}
          </p>
          <p className="mt-2 whitespace-pre-wrap text-ink">
            {supplierView?.body ?? task.description}
          </p>
        </div>
      </section>

      <div className="mb-8 flex flex-wrap gap-2">
        {task.status === "done" || task.status === "follow_up" ? (
          <>
            <form action={updateTaskStatus}>
              <input type="hidden" name="task_id" value={task.id} />
              <input type="hidden" name="status" value="closed" />
              <Button type="submit">Close</Button>
            </form>
            <form action={updateTaskStatus}>
              <input type="hidden" name="task_id" value={task.id} />
              <input type="hidden" name="status" value="follow_up" />
              <Button type="submit" variant="secondary">
                Needs follow-up
              </Button>
            </form>
          </>
        ) : null}
        {task.status === "assigned" || task.status === "accepted" ? (
          <form action={updateTaskStatus}>
            <input type="hidden" name="task_id" value={task.id} />
            <input type="hidden" name="status" value="cancelled" />
            <Button type="submit" variant="ghost" className="text-coral">
              Cancel task
            </Button>
          </form>
        ) : null}
      </div>

      {(hasArrivalPhotos ||
        hasDeparturePhotos ||
        task.status === "done" ||
        task.status === "follow_up" ||
        task.status === "closed") && (
        <section className="mb-8 border-t border-line pt-6">
          <h2 className="font-display mb-3 text-2xl text-ink">Cleaning photos</h2>
          {hasArrivalPhotos ? (
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-muted">
                On arrival (guest state)
              </h3>
              <HandoffGallery
                photos={arrivalPhotos}
                emptyMessage="No arrival photos yet."
                altPrefix="Arrival photo"
              />
            </div>
          ) : null}
          {hasDeparturePhotos ||
          task.status === "done" ||
          task.status === "follow_up" ||
          task.status === "closed" ? (
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-muted">
                On departure (after cleaning)
              </h3>
              {task.completion_notes ? (
                <p className="mb-3 text-sm text-ink-muted">
                  {task.completion_notes}
                </p>
              ) : null}
              <HandoffGallery
                photos={departurePhotos}
                emptyMessage="No departure photos yet."
                altPrefix="Departure photo"
              />
            </div>
          ) : null}
        </section>
      )}

      <section className="border-t border-line pt-6">
        <h2 className="font-display mb-4 text-2xl text-ink">Messages</h2>
        <MessageThread
          messages={(messages ?? []).map((m) => ({
            ...m,
            author_name: authorMap.get(m.author_id),
            is_mine: m.author_id === user.id,
          }))}
        />
        <div className="mt-6">
          <MessageComposer taskId={task.id} />
        </div>
      </section>
    </PersonaShell>
  );
}
