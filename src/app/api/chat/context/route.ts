import { buildAssistantContext } from "@/lib/ai-context";
import { NextResponse } from "next/server";

/** Dev-only: inspect assembled assistant playbook prompt. */
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 });
  }

  const url = new URL(request.url);
  const locale = url.searchParams.get("locale") ?? "en";
  const format = url.searchParams.get("format") ?? "json";

  const { prompt, meta } = await buildAssistantContext(locale);

  if (format === "text") {
    return new NextResponse(prompt, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return NextResponse.json({
    meta,
    prompt,
    editHint:
      "Edit content/assistant/expertise.json, assistant-qa.json, advisor-bio.md — then refresh.",
  });
}
