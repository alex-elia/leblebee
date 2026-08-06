import { PersonaShell } from "@/components/ui/persona-shell";
import { Button, StatusChip } from "@/components/ui";
import type { TaskStatus } from "@/components/ui/status-chip";
import { MessageComposer } from "@/components/tasks/message-composer";
import { MessageThread } from "@/components/tasks/message-thread";
import { HandoffGallery } from "@/components/tasks/handoff-gallery";
import { HandoffCompleteForm } from "../handoff-complete-form";
import { getHandoffPhotoUrls } from "../handoff-actions";
import { updateTaskStatus } from "@/app/client/tasks/actions";
import { requireProfile } from "@/lib/auth/session";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Task",
};

export default async function SupplierTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user, profile, supabase } = await requireProfile(["supplier", "admin"]);

  const { data: task } = await supabase
    .from("tasks")
    .select(
      "*, providers!assigned_provider_id(id, name, language, user_id), properties!property_id(id, name, address_notes)",
    )
    .eq("id", id)
    .maybeSingle();

  if (!task) notFound();

  const provider = Array.isArray(task.providers)
    ? task.providers[0]
    : task.providers;
  const property = Array.isArray(task.properties)
    ? task.properties[0]
    : task.properties;

  if (profile.role === "supplier" && provider?.user_id !== user.id) {
    notFound();
  }

  const lang = provider?.language ?? profile.preferred_language ?? "el";
  const { data: translation } = await supabase
    .from("task_translations")
    .select("title, body")
    .eq("task_id", id)
    .eq("lang", lang)
    .maybeSingle();

  const { data: memory } = await supabase
    .from("property_memory")
    .select("bullet, kind")
    .eq("property_id", task.property_id)
    .order("sort_order");

  const { data: messages } = await supabase
    .from("task_messages")
    .select(
      "id, body, translated_body, source_language, target_language, created_at, author_id",
    )
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

  const photos = await getHandoffPhotoUrls(id);
  const canComplete =
    task.status === "accepted" || task.status === "assigned";

  return (
    <PersonaShell
      role={profile.role}
      displayName={profile.display_name}
      email={user.email}
    >
      <p className="mb-4 text-sm font-semibold text-ink-muted">
        <Link href="/supplier" className="hover:text-olive">
          ← My tasks
        </Link>
      </p>

      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-ink">
            {translation?.title ?? task.title}
          </h1>
          <p className="mt-1 text-ink-muted">
            {property?.name}
            {task.due_at
              ? ` · due ${new Date(task.due_at).toLocaleString()}`
              : ""}
          </p>
        </div>
        <StatusChip status={task.status as TaskStatus} />
      </div>

      <section className="mb-6 rounded-[var(--radius-md)] border border-line bg-foam p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Instructions
        </p>
        <p className="whitespace-pre-wrap text-[1.05rem] leading-relaxed text-ink">
          {translation?.body ?? task.description}
        </p>
        {property?.address_notes ? (
          <p className="mt-4 border-t border-line pt-3 text-sm whitespace-pre-wrap text-ink-muted">
            Access: {property.address_notes}
          </p>
        ) : null}
        {memory && memory.length > 0 ? (
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-muted">
            {memory.map((m) => (
              <li key={`${m.kind}-${m.bullet}`}>{m.bullet}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <div className="mb-8 flex flex-wrap gap-2">
        {task.status === "assigned" ? (
          <form action={updateTaskStatus}>
            <input type="hidden" name="task_id" value={task.id} />
            <input type="hidden" name="status" value="accepted" />
            <Button type="submit">Confirm received</Button>
          </form>
        ) : null}
      </div>

      {canComplete ? (
        <div className="mb-8">
          <HandoffCompleteForm taskId={task.id} />
        </div>
      ) : null}

      {(task.status === "done" ||
        task.status === "follow_up" ||
        task.status === "closed" ||
        photos.length > 0) && (
        <section className="mb-8 border-t border-line pt-6">
          <h2 className="font-display mb-3 text-2xl text-ink">Handoff photos</h2>
          {task.completion_notes ? (
            <p className="mb-3 text-sm text-ink-muted">{task.completion_notes}</p>
          ) : null}
          <HandoffGallery photos={photos} />
        </section>
      )}

      <section className="border-t border-line pt-6">
        <h2 className="font-display mb-4 text-2xl text-ink">Messages</h2>
        <MessageThread
          readerIsClient={false}
          messages={(messages ?? []).map((m) => ({
            ...m,
            author_name: authorMap.get(m.author_id),
            is_mine: m.author_id === user.id,
          }))}
        />
        <div className="mt-6">
          <MessageComposer
            taskId={task.id}
            placeholder="Write in Greek or your language — we translate for the owner."
          />
        </div>
      </section>
    </PersonaShell>
  );
}
