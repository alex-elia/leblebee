export type TaskStatus =
  | "draft"
  | "assigned"
  | "accepted"
  | "done"
  | "follow_up"
  | "closed"
  | "cancelled";

const styles: Record<TaskStatus, string> = {
  draft: "bg-sand-deep text-ink-muted",
  assigned: "bg-olive-soft text-olive",
  accepted: "bg-[#d7e6ef] text-focus",
  done: "bg-olive text-foam",
  follow_up: "bg-coral-soft text-coral",
  closed: "bg-sand-deep text-ink-muted",
  cancelled: "bg-sand-deep text-ink-muted line-through",
};

const labels: Record<TaskStatus, string> = {
  draft: "Draft",
  assigned: "Sent",
  accepted: "Accepted",
  done: "Done",
  follow_up: "Follow-up",
  closed: "Closed",
  cancelled: "Cancelled",
};

export function StatusChip({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
