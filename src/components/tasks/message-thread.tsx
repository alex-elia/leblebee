export type TaskMessageView = {
  id: string;
  body: string;
  translated_body: string | null;
  source_language: string;
  target_language: string | null;
  created_at: string;
  author_id: string;
  author_name?: string | null;
  is_mine: boolean;
};

export function MessageThread({
  messages,
  readerIsClient,
}: {
  messages: TaskMessageView[];
  readerIsClient: boolean;
}) {
  if (messages.length === 0) {
    return <p className="text-sm text-ink-muted">No messages yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {messages.map((m) => {
        const showTranslation =
          Boolean(m.translated_body) &&
          Boolean(m.target_language) &&
          m.source_language !== m.target_language;

        // Client reading supplier message → prefer translation; supplier reading client → prefer translation
        const preferTranslation = !m.is_mine && showTranslation;
        const primary = preferTranslation ? m.translated_body! : m.body;
        const secondary =
          showTranslation && preferTranslation
            ? m.body
            : showTranslation && !preferTranslation
              ? m.translated_body
              : null;

        return (
          <li
            key={m.id}
            className={`rounded-[var(--radius-md)] border border-line p-3 ${
              m.is_mine ? "bg-olive-soft/30" : "bg-foam"
            }`}
          >
            <p className="mb-1 text-xs font-semibold text-ink-muted">
              {m.is_mine ? "You" : m.author_name ?? "Them"} ·{" "}
              {new Date(m.created_at).toLocaleString()}
            </p>
            <p className="whitespace-pre-wrap text-ink">{primary}</p>
            {secondary ? (
              <p className="mt-2 border-t border-line pt-2 text-sm whitespace-pre-wrap text-ink-muted">
                {secondary}
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
