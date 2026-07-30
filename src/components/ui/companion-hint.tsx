import { type ReactNode } from "react";
import { Button } from "./button";

export type CompanionHintProps = {
  title?: string;
  children: ReactNode;
  onDismissLabel?: string;
};

export function CompanionHint({
  title = "Leblebee suggests",
  children,
  onDismissLabel = "Dismiss",
}: CompanionHintProps) {
  return (
    <aside className="rounded-[var(--radius-md)] border border-olive-soft bg-olive-soft/50 p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <p className="font-display text-lg text-olive">{title}</p>
        <Button variant="ghost" className="!min-h-0 px-2 py-1 text-sm text-ink-muted">
          {onDismissLabel}
        </Button>
      </div>
      <div className="text-sm leading-relaxed text-ink">{children}</div>
    </aside>
  );
}
