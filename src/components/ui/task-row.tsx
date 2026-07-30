import { StatusChip, type TaskStatus } from "./status-chip";

export type TaskRowProps = {
  title: string;
  dueLabel: string;
  providerName?: string;
  status: TaskStatus;
  href?: string;
};

export function TaskRow({ title, dueLabel, providerName, status, href }: TaskRowProps) {
  const content = (
    <div className="flex items-start justify-between gap-3 border-b border-line py-3 transition-colors duration-150 hover:bg-foam/70">
      <div className="min-w-0">
        <p className="truncate font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-sm text-ink-muted">
          {dueLabel}
          {providerName ? ` · ${providerName}` : ""}
        </p>
      </div>
      <StatusChip status={status} />
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block focus-visible:rounded-[var(--radius-sm)]">
        {content}
      </a>
    );
  }

  return content;
}
