import { Button } from "./button";

export type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-3 py-10">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      <p className="max-w-md text-ink-muted">{description}</p>
      {actionLabel ? <Button>{actionLabel}</Button> : null}
    </div>
  );
}
