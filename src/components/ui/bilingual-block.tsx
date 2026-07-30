"use client";

import { useState } from "react";

export type BilingualBlockProps = {
  sourceLang: string;
  targetLang: string;
  sourceText: string;
  translatedText: string;
};

export function BilingualBlock({
  sourceLang,
  targetLang,
  sourceText,
  translatedText,
}: BilingualBlockProps) {
  const [showSource, setShowSource] = useState(false);

  return (
    <div className="rounded-[var(--radius-md)] border border-line bg-foam p-4 shadow-[var(--shadow-soft)]">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          {showSource ? sourceLang : targetLang}
        </p>
        <button
          type="button"
          className="text-sm font-semibold text-olive hover:text-olive-hover"
          onClick={() => setShowSource((v) => !v)}
        >
          {showSource ? "Show translation" : "Show original"}
        </button>
      </div>
      <p className="whitespace-pre-wrap text-[1.05rem] leading-relaxed text-ink">
        {showSource ? sourceText : translatedText}
      </p>
    </div>
  );
}
