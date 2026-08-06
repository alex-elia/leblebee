"use client";

import { useActionState, useState } from "react";
import {
  completeTaskWithHandoff,
  type HandoffActionState,
} from "./handoff-actions";
import { Button, TextAreaField } from "@/components/ui";

const initial: HandoffActionState = {};

export function HandoffCompleteForm({ taskId }: { taskId: string }) {
  const [state, action, pending] = useActionState(
    completeTaskWithHandoff,
    initial,
  );
  const [count, setCount] = useState(0);

  return (
    <form
      action={action}
      className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-line bg-foam p-4"
    >
      <input type="hidden" name="task_id" value={taskId} />
      <div>
        <h3 className="font-display text-xl text-ink">Handoff photos</h3>
        <p className="mt-1 text-sm text-ink-muted">
          Add at least one photo so the owner can see how you left the place —
          not for policing, for shared context.
        </p>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-ink">Photos</span>
        <input
          type="file"
          name="photos"
          accept="image/*"
          capture="environment"
          multiple
          required
          onChange={(e) => setCount(e.target.files?.length ?? 0)}
          className="block w-full text-sm text-ink file:mr-3 file:rounded-[var(--radius-sm)] file:border-0 file:bg-olive file:px-3 file:py-2 file:font-semibold file:text-foam"
        />
        <span className="text-xs text-ink-muted">
          {count > 0 ? `${count} selected` : "Camera or gallery · max 6"}
        </span>
      </label>
      <TextAreaField
        label="Short note (optional)"
        name="completion_notes"
        rows={2}
        placeholder="Terrace chairs stacked, linens left in closet…"
      />
      <Button type="submit" disabled={pending || count < 1}>
        {pending ? "Uploading…" : "Mark done with photos"}
      </Button>
      {state.error ? (
        <p className="text-sm font-semibold text-coral" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
