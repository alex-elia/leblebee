import { PersonaShell } from "@/components/ui/persona-shell";
import {
  BilingualBlock,
  Button,
  CompanionHint,
  EmptyState,
  PhotoStrip,
  StatusChip,
  TaskRow,
  TextAreaField,
  TextField,
} from "@/components/ui";
import { requireProfile } from "@/lib/auth/session";
import type { Metadata } from "next";
import type { TaskStatus } from "@/components/ui/status-chip";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Design system",
};

const statuses: TaskStatus[] = [
  "draft",
  "assigned",
  "accepted",
  "done",
  "follow_up",
  "closed",
  "cancelled",
];

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-line py-8">
      <h2 className="font-display mb-4 text-2xl text-ink">{title}</h2>
      {children}
    </section>
  );
}

export default async function DesignSystemPage() {
  const { user, profile } = await requireProfile(["admin"]);

  return (
    <PersonaShell
      role="admin"
      displayName={profile.display_name}
      email={user.email}
      title="Design system"
    >
      <div className="mb-2">
        <h1 className="font-display text-4xl text-ink">Aegean service kit</h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          Tokens and primitives for Leblebee host and provider surfaces. Calm,
          phone-first, collaborative — not a surveillance dashboard. Admin only.
        </p>
      </div>

      <Section title="Color">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Ink", "bg-ink text-foam"],
            ["Sand", "bg-sand text-ink border border-line"],
            ["Olive", "bg-olive text-foam"],
            ["Coral", "bg-coral text-foam"],
            ["Foam", "bg-foam text-ink border border-line"],
            ["Olive soft", "bg-olive-soft text-olive"],
            ["Coral soft", "bg-coral-soft text-coral"],
            ["Focus", "bg-focus text-foam"],
          ].map(([name, className]) => (
            <div
              key={name}
              className={`flex h-20 items-end rounded-[var(--radius-md)] p-3 text-sm font-semibold ${className}`}
            >
              {name}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <p className="font-display text-4xl">Fraunces for brand & headings</p>
        <p className="mt-3 max-w-xl text-lg">
          Source Sans 3 for body copy, forms, and Greek (Ελληνικά) UI strings.
          Large tap targets; keep paragraphs short on provider screens.
        </p>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section title="Fields">
        <div className="grid max-w-lg gap-4">
          <TextField
            label="Task title"
            name="title"
            placeholder="Turnover clean before Friday"
            hint="Host language — we’ll translate for the provider."
          />
          <TextAreaField
            label="Instructions"
            name="body"
            placeholder="Focus on bathrooms and terrace. Keys in lockbox."
          />
        </div>
      </Section>

      <Section title="Status chips">
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <StatusChip key={status} status={status} />
          ))}
        </div>
      </Section>

      <Section title="Task row">
        <div className="max-w-lg">
          <TaskRow
            title="Pre-arrival cleaning · Apt 12"
            dueLabel="Due Fri 10:00"
            providerName="Maria"
            status="assigned"
          />
          <TaskRow
            title="AC check after guest report"
            dueLabel="Due today"
            providerName="Nikos"
            status="follow_up"
          />
        </div>
      </Section>

      <Section title="Bilingual block">
        <div className="max-w-lg">
          <BilingualBlock
            sourceLang="French"
            targetLang="Greek"
            sourceText="Merci de préparer l’appartement pour vendredi 14h. Vérifier la clim et laisser les serviettes dans l’armoire."
            translatedText="Παρακαλώ ετοιμάστε το διαμέρισμα για την Παρασκευή στις 14:00. Ελέγξτε το κλιματιστικό και αφήστε τις πετσέτες στην ντουλάπα."
          />
        </div>
      </Section>

      <Section title="Photo strip">
        <PhotoStrip
          photos={[
            { id: "1", alt: "Bathroom" },
            { id: "2", alt: "Terrace" },
          ]}
        />
      </Section>

      <Section title="Companion hint">
        <div className="max-w-lg">
          <CompanionHint>
            <ul className="list-disc space-y-1 pl-5">
              <li>Trash taken out</li>
              <li>AC remotes on kitchen counter</li>
              <li>Linen count: 2 sets</li>
              <li>Wifi card visible near TV</li>
            </ul>
          </CompanionHint>
        </div>
      </Section>

      <Section title="Empty state">
        <EmptyState
          title="No open tasks"
          description="Create a task when something needs doing on the property — cleaning, repair, or a quick check."
          actionLabel="New task"
        />
      </Section>
    </PersonaShell>
  );
}
