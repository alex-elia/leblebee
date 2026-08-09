import { PersonaShell } from "@/components/ui/persona-shell";
import { listRecentActivity } from "@/lib/admin/activity";
import { requireProfile } from "@/lib/auth/session";
import { getI18n } from "@/lib/i18n/get-locale";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.admin.activity.title };
}

export default async function AdminActivityPage() {
  const { user, profile, supabase } = await requireProfile(["admin"]);
  const { locale, t } = await getI18n();
  const A = t.admin.activity;

  const events = await listRecentActivity(supabase);

  return (
    <PersonaShell
      role="admin"
      displayName={profile.display_name}
      email={user.email}
      title={A.title}
    >
      <h1 className="font-display text-4xl text-ink">{A.title}</h1>
      <p className="mt-2 text-ink-muted">{A.subtitle}</p>

      {!events.length ? (
        <p className="mt-8 text-sm text-ink-muted">{A.empty}</p>
      ) : (
        <ul className="mt-8 divide-y divide-line border-t border-line">
          {events.map((event) => (
            <li key={event.id} className="py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold text-ink">
                  {event.task ? (
                    <Link
                      href={`/client/tasks/${event.task.id}`}
                      className="text-olive hover:underline"
                    >
                      {event.task.title}
                    </Link>
                  ) : (
                    A.unknownTask
                  )}
                </p>
                <time
                  className="text-xs text-ink-muted"
                  dateTime={event.created_at}
                >
                  {new Date(event.created_at).toLocaleString(locale)}
                </time>
              </div>
              <p className="mt-1 text-sm text-ink-muted">
                {event.event_type}
                {event.actor?.display_name
                  ? ` · ${event.actor.display_name}`
                  : ""}
              </p>
              {event.note ? (
                <p className="mt-1 text-sm text-ink">{event.note}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </PersonaShell>
  );
}
