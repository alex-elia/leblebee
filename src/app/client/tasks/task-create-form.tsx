"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import {
  createAndAssignTask,
  previewTaskInstructions,
  type TaskActionState,
} from "./actions";
import { Button, CompanionHint, TextAreaField, TextField } from "@/components/ui";
import type { PropertyPlaybook } from "@/lib/properties/playbook";

const initial: TaskActionState = {};

type Option = { id: string; label: string; language?: string };

const LANG: Record<string, string> = {
  en: "English",
  fr: "French",
  el: "Greek",
};

export function TaskCreateForm({
  properties,
  suppliers,
  playbooks,
  defaultSupplierId,
  defaultPropertyId,
  clientLang = "en",
}: {
  properties: Option[];
  suppliers: Option[];
  playbooks: Record<string, PropertyPlaybook>;
  defaultSupplierId?: string;
  defaultPropertyId?: string;
  clientLang?: string;
}) {
  const [previewState, previewAction, previewPending] = useActionState(
    previewTaskInstructions,
    initial,
  );
  const [createState, createAction, createPending] = useActionState(
    createAndAssignTask,
    initial,
  );

  const [propertyId, setPropertyId] = useState(defaultPropertyId ?? "");
  const [supplierId, setSupplierId] = useState(defaultSupplierId ?? "");
  const [category, setCategory] = useState("cleaning");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [specificNotes, setSpecificNotes] = useState("");
  const [includeStandards, setIncludeStandards] = useState(true);

  const selected = suppliers.find((s) => s.id === supplierId);
  const targetLang = selected?.language ?? "el";
  const targetLangLabel = LANG[targetLang] ?? targetLang;
  const playbook = useMemo(
    () =>
      playbooks[propertyId] ?? {
        access: [],
        materials: [],
        standards: [],
        notes: [],
      },
    [playbooks, propertyId],
  );
  const preview = previewState.preview;

  useEffect(() => {
    if (preview) {
      setTitle(preview.clarifiedTitle);
      setDescription(preview.clarifiedBody);
    }
  }, [preview]);

  return (
    <div className="flex max-w-xl flex-col gap-8">
      <form action={previewAction} className="flex flex-col gap-4">
        <input type="hidden" name="source_language" value={clientLang} />
        <input type="hidden" name="target_language" value={targetLang} />
        <input type="hidden" name="property_id" value={propertyId} />
        <input type="hidden" name="category" value={category} />
        <input
          type="hidden"
          name="include_standards"
          value={includeStandards ? "1" : "0"}
        />

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-ink">Property</span>
          <select
            required
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            className="w-full rounded-[var(--radius-sm)] border border-line bg-foam px-3 py-2.5"
          >
            <option value="" disabled>
              Select property…
            </option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        {propertyId ? (
          <div className="rounded-[var(--radius-md)] border border-line bg-foam p-4 text-sm">
            <p className="font-semibold text-ink">Apartment standard (auto-included)</p>
            <label className="mt-2 flex items-center gap-2 text-ink-muted">
              <input
                type="checkbox"
                checked={includeStandards}
                onChange={(e) => setIncludeStandards(e.target.checked)}
              />
              Include standard checklist for this task
            </label>
            {playbook.standards.length > 0 ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-muted">
                {playbook.standards.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-ink-muted">
                No standard work yet — add it on the property page.
              </p>
            )}
            {(playbook.access.length > 0 || playbook.materials.length > 0) && (
              <p className="mt-3 text-xs text-ink-muted">
                Access codes and material locations from the apartment standard
                are also sent with the task.
              </p>
            )}
          </div>
        ) : null}

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-ink">Supplier</span>
          <select
            required
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            className="w-full rounded-[var(--radius-sm)] border border-line bg-foam px-3 py-2.5"
          >
            <option value="" disabled>
              Select supplier…
            </option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label} ({(s.language ?? "el").toUpperCase()})
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-ink">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-[var(--radius-sm)] border border-line bg-foam px-3 py-2.5"
          >
            <option value="cleaning">Cleaning / turnover</option>
            <option value="maintenance">Maintenance</option>
            <option value="ac">AC</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="checkin">Check-in help</option>
            <option value="other">Other</option>
          </select>
        </label>

        <TextField
          label="Title"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Turnover clean before Friday 14:00"
        />

        <TextAreaField
          label="This visit only"
          name="specific_notes"
          rows={4}
          value={specificNotes}
          onChange={(e) => setSpecificNotes(e.target.value)}
          placeholder="Prepare a welcome gift: wine bottle on the table. Guest arrives 16:00."
          hint="Extras for this stay or guest — not part of the apartment standard."
        />

        <TextAreaField
          label="Extra freeform notes (optional)"
          name="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Anything else for AI to weave in…"
          hint="Usually leave empty if standards + this visit cover it."
        />

        <Button
          type="submit"
          variant="secondary"
          disabled={previewPending || !supplierId || !propertyId}
        >
          {previewPending
            ? "Preparing with AI…"
            : "Prepare clear bilingual briefing"}
        </Button>
        {previewState.error ? (
          <p className="text-sm font-semibold text-coral">{previewState.error}</p>
        ) : null}
      </form>

      {preview ? (
        <form
          action={createAction}
          className="flex flex-col gap-4 border-t border-line pt-6"
        >
          <input type="hidden" name="property_id" value={propertyId} />
          <input type="hidden" name="supplier_id" value={supplierId} />
          <input type="hidden" name="category" value={category} />
          <input type="hidden" name="source_language" value={clientLang} />
          <input type="hidden" name="target_language" value={targetLang} />
          <input type="hidden" name="specific_notes" value={specificNotes} />
          <input type="hidden" name="title" value={title} />
          <input type="hidden" name="description" value={description} />
          <input
            type="hidden"
            name="translated_title"
            value={preview.translatedTitle}
          />
          <input
            type="hidden"
            name="translated_body"
            value={preview.translatedBody}
          />
          <input
            type="hidden"
            name="checklist"
            value={preview.checklist.join("\n")}
          />
          <input type="hidden" name="ai_model" value={preview.model} />

          <div>
            <h2 className="font-display text-2xl text-ink">Review before send</h2>
            <p className="mt-1 text-sm text-ink-muted">
              You edit your language version. Below is exactly what the supplier
              reads on their phone.
            </p>
          </div>

          {preview.vagueFlags.length > 0 ? (
            <CompanionHint title="Leblebee clarified">
              <ul className="list-disc space-y-1 pl-5">
                {preview.vagueFlags.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </CompanionHint>
          ) : null}

          <TextField
            label="Your version — title"
            name="clarified_title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextAreaField
            label="Your version — full briefing"
            name="clarified_body"
            required
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            hint="Stored for you in your language (audit + edits)."
          />

          <div className="rounded-[var(--radius-md)] border-2 border-olive/40 bg-olive-soft/30 p-4">
            <p className="font-display text-lg text-olive">
              Supplier phone preview · {targetLangLabel}
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              This is the translated briefing they open from their magic link —
              access codes, where to find stock, standard work, and this-visit
              extras. If something looks wrong, edit your version above and
              prepare again.
            </p>
            <p className="mt-4 font-semibold text-ink">
              {preview.translatedTitle}
            </p>
            <p className="mt-2 whitespace-pre-wrap text-ink">
              {preview.translatedBody}
            </p>
            {preview.checklist.length > 0 ? (
              <div className="mt-4 border-t border-olive/20 pt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Checklist on their screen
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink">
                  {preview.checklist.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <TextField label="Due" name="due_at" type="datetime-local" />
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-ink">Priority</span>
            <select
              name="priority"
              defaultValue="normal"
              className="w-full rounded-[var(--radius-sm)] border border-line bg-foam px-3 py-2.5"
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
            </select>
          </label>

          <Button type="submit" disabled={createPending}>
            {createPending ? "Sending…" : "Send briefing to supplier"}
          </Button>
          {createState.error ? (
            <p className="text-sm font-semibold text-coral">
              {createState.error}
            </p>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}
