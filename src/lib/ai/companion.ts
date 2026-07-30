import { ovhChat } from "@/lib/ai/ovh";
import type { PropertyPlaybook } from "@/lib/properties/playbook";

const LANG_LABEL: Record<string, string> = {
  en: "English",
  fr: "French",
  el: "Greek",
};

function langName(code: string) {
  return LANG_LABEL[code] ?? code;
}

function extractJson<T>(raw: string): T {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const text = fenced ? fenced[1].trim() : trimmed;
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return JSON.parse(text.slice(start, end + 1)) as T;
  }
  return JSON.parse(text) as T;
}

export type PrepareInstructionsResult = {
  clarifiedTitle: string;
  clarifiedBody: string;
  translatedTitle: string;
  translatedBody: string;
  checklist: string[];
  vagueFlags: string[];
  model: string;
};

/** Clarify host instructions and translate for the supplier. */
export async function prepareInstructions(input: {
  title: string;
  body: string;
  specificNotes?: string;
  sourceLang: string;
  targetLang: string;
  category?: string;
  playbook?: PropertyPlaybook;
}): Promise<PrepareInstructionsResult> {
  const playbook = input.playbook ?? {
    access: [],
    materials: [],
    standards: [],
    notes: [],
  };

  const { content, model } = await ovhChat(
    [
      {
        role: "system",
        content: `You help short-term rental hosts brief local suppliers clearly across languages.
Return ONLY valid JSON with keys:
clarifiedTitle, clarifiedBody, translatedTitle, translatedBody,
checklist (string array), vagueFlags (string array).

clarifiedBody structure (in ${langName(input.sourceLang)}), use these section headings exactly when content exists:
1) Access & codes
2) Where to find materials
3) Standard work (always for this apartment)
4) This visit only

translatedBody must mirror the same sections in ${langName(input.targetLang)}.

checklist = the standard work items (+ this-visit extras if actionable), in ${langName(input.targetLang)}.
If apartment standards are provided, use them as the base checklist — do not drop them; you may clarify wording only.
Preserve names, addresses, times, codes, locker numbers exactly.
Never invent codes, stock locations, or gifts that were not provided.
vagueFlags = ambiguities you clarified.`,
      },
      {
        role: "user",
        content: JSON.stringify({
          category: input.category ?? "general",
          sourceLang: input.sourceLang,
          targetLang: input.targetLang,
          title: input.title,
          freeformInstructions: input.body,
          thisVisitOnly: input.specificNotes ?? "",
          apartmentPlaybook: {
            accessAndCodes: playbook.access,
            whereToFindMaterials: playbook.materials,
            standardWorkAlways: playbook.standards,
            otherNotes: playbook.notes,
          },
        }),
      },
    ],
    { temperature: 0.2 },
  );

  const parsed = extractJson<{
    clarifiedTitle?: string;
    clarifiedBody?: string;
    translatedTitle?: string;
    translatedBody?: string;
    checklist?: string[];
    vagueFlags?: string[];
  }>(content);

  return {
    clarifiedTitle: parsed.clarifiedTitle?.trim() || input.title,
    clarifiedBody: parsed.clarifiedBody?.trim() || input.body,
    translatedTitle: parsed.translatedTitle?.trim() || input.title,
    translatedBody: parsed.translatedBody?.trim() || input.body,
    checklist: Array.isArray(parsed.checklist)
      ? parsed.checklist.map(String).filter(Boolean)
      : [...playbook.standards],
    vagueFlags: Array.isArray(parsed.vagueFlags)
      ? parsed.vagueFlags.map(String).filter(Boolean)
      : [],
    model,
  };
}

/** Translate a short message between host and supplier. */
export async function translateMessage(input: {
  body: string;
  sourceLang: string;
  targetLang: string;
}): Promise<{ translated: string; model: string }> {
  if (input.sourceLang === input.targetLang) {
    return { translated: input.body, model: "none" };
  }

  const { content, model } = await ovhChat(
    [
      {
        role: "system",
        content: `Translate the user message from ${langName(input.sourceLang)} to ${langName(input.targetLang)}.
Preserve names, addresses, times, codes. Return ONLY the translation text, no quotes or commentary.`,
      },
      { role: "user", content: input.body },
    ],
    { temperature: 0.1 },
  );

  return { translated: content.trim(), model };
}
