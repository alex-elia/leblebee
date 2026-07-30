export type PlaybookKind = "access" | "materials" | "standard" | "note";

export type PropertyPlaybook = {
  access: string[];
  materials: string[];
  standards: string[];
  notes: string[];
};

export function emptyPlaybook(): PropertyPlaybook {
  return { access: [], materials: [], standards: [], notes: [] };
}

export function linesToList(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
}

export function listToLines(items: string[]): string {
  return items.join("\n");
}

export function groupPlaybookRows(
  rows: { bullet: string; kind?: string | null; sort_order?: number }[],
): PropertyPlaybook {
  const playbook = emptyPlaybook();
  for (const row of rows) {
    const kind = (row.kind ?? "note") as PlaybookKind;
    if (kind === "access") playbook.access.push(row.bullet);
    else if (kind === "materials") playbook.materials.push(row.bullet);
    else if (kind === "standard") playbook.standards.push(row.bullet);
    else playbook.notes.push(row.bullet);
  }
  return playbook;
}

export function playbookToInsertRows(propertyId: string, playbook: PropertyPlaybook) {
  const rows: { property_id: string; bullet: string; kind: PlaybookKind; sort_order: number }[] =
    [];
  const push = (kind: PlaybookKind, items: string[]) => {
    items.forEach((bullet, index) => {
      rows.push({ property_id: propertyId, bullet, kind, sort_order: index });
    });
  };
  push("access", playbook.access);
  push("materials", playbook.materials);
  push("standard", playbook.standards);
  push("note", playbook.notes);
  return rows;
}

/** Compose the owner-facing draft body before AI (standards + this visit). */
export function composeTaskDraftBody(input: {
  standards: string[];
  specificNotes: string;
  includeStandards: boolean;
}): string {
  const parts: string[] = [];
  if (input.includeStandards && input.standards.length > 0) {
    parts.push("Standard for this apartment:");
    for (const s of input.standards) parts.push(`- ${s}`);
  }
  if (input.specificNotes.trim()) {
    if (parts.length) parts.push("");
    parts.push("This visit only:");
    parts.push(input.specificNotes.trim());
  }
  return parts.join("\n");
}
