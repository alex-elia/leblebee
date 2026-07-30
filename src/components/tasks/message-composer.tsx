"use client";

import { useActionState } from "react";
import {
  sendTaskMessage,
  type MessageActionState,
} from "@/app/client/tasks/actions";
import { Button, TextAreaField } from "@/components/ui";

const initial: MessageActionState = {};

export function MessageComposer({
  taskId,
  placeholder,
}: {
  taskId: string;
  placeholder?: string;
}) {
  const [state, action, pending] = useActionState(sendTaskMessage, initial);

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="task_id" value={taskId} />
      <TextAreaField
        label="Message"
        name="body"
        required
        rows={3}
        placeholder={
          placeholder ??
          "Ask a question or add a note — we’ll translate automatically."
        }
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send (auto-translated)"}
      </Button>
      {state.error ? (
        <p className="text-sm font-semibold text-coral">{state.error}</p>
      ) : null}
    </form>
  );
}
