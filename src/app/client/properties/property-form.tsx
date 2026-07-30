"use client";

import { useActionState } from "react";
import {
  createProperty,
  updateProperty,
  type PropertyActionState,
} from "./actions";
import { Button, TextAreaField, TextField } from "@/components/ui";
import { listToLines, type PropertyPlaybook } from "@/lib/properties/playbook";

const initial: PropertyActionState = {};

export function PropertyForm({
  mode,
  property,
}: {
  mode: "create" | "edit";
  property?: {
    id: string;
    name: string;
    address_notes: string | null;
    playbook: PropertyPlaybook;
  };
}) {
  const action = mode === "create" ? createProperty : updateProperty;
  const [state, formAction, pending] = useActionState(action, initial);
  const playbook = property?.playbook;

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-6">
      {mode === "edit" && property ? (
        <input type="hidden" name="id" value={property.id} />
      ) : null}

      <div className="flex flex-col gap-4">
        <TextField
          label="Property name"
          name="name"
          required
          defaultValue={property?.name ?? ""}
          placeholder="Apt 12 · Analipsi"
        />
        <TextAreaField
          label="Address / building"
          name="address_notes"
          rows={2}
          defaultValue={property?.address_notes ?? ""}
          placeholder="Street, floor, parking…"
        />
      </div>

      <section className="flex flex-col gap-3 border-t border-line pt-5">
        <div>
          <h2 className="font-display text-xl text-ink">Apartment standard</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Reused on every task for this place. One item per line.
          </p>
        </div>
        <TextAreaField
          label="Access & codes"
          name="access"
          rows={3}
          defaultValue={listToLines(playbook?.access ?? [])}
          hint="Lockbox codes, whether doors are locked, how to enter if not."
          placeholder={"Lockbox 4421 on left of door\nBuilding door code 1937#\nIf lockbox empty, spare key with Maria downstairs"}
        />
        <TextAreaField
          label="Where to find materials"
          name="materials"
          rows={3}
          defaultValue={listToLines(playbook?.materials ?? [])}
          hint="Stocked soap, linen, cleaning products, trash bags…"
          placeholder={"Cleaning products under kitchen sink\nSpare linens in hallway closet\nSoaps & toilet paper in bathroom cabinet"}
        />
        <TextAreaField
          label="Standard work (always)"
          name="standards"
          rows={5}
          defaultValue={listToLines(playbook?.standards ?? [])}
          hint="The usual turnover checklist for every guest change."
          placeholder={"Clean all rooms\nClean walls if mosquito stains\nFill soaps and toilet paper\nEmpty trash\nCheck AC remotes on kitchen counter"}
        />
        <TextAreaField
          label="Other notes"
          name="notes"
          rows={2}
          defaultValue={listToLines(playbook?.notes ?? [])}
          placeholder="Wifi card by the TV"
        />
      </section>

      <Button type="submit" disabled={pending}>
        {pending
          ? "Saving…"
          : mode === "create"
            ? "Create property"
            : "Save apartment standard"}
      </Button>
      {state.error ? (
        <p className="text-sm font-semibold text-coral" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p className="text-sm font-semibold text-olive">Saved.</p>
      ) : null}
    </form>
  );
}
