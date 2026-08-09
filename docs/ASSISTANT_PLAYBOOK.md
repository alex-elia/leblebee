# Leblebee assistant playbook

Curated knowledge for the landing **GuestAssistant** and the in-app **task companion** (clarify/translate). Same pattern as Onira / Konaki: editable content files, assembled at runtime — not model fine-tuning.

## Files

| File | Purpose |
|------|---------|
| `content/assistant/expertise.json` | Guest management, rental ops, STR real estate, coordination, Crete context, boundaries |
| `content/assistant/assistant-qa.json` | Curated Q&A (product + ops) |
| `content/assistant/advisor-bio.md` | Alex / Onira XP voice and principles |
| `src/lib/assistant-playbook/load-playbook.ts` | Loaders + formatters |
| `src/lib/ai-context.ts` | Full system prompt for `/api/chat` |
| `src/lib/ai/companion.ts` | Shorter expertise block for task brief AI |

## Tone (Onira XP)

- Advisory peer + warm host practicality
- Crete STR operator credibility (Konaki, Hygge, 10+ renovations)
- Communication-first; no surveillance, no invented codes or legal/tax guarantees
- Investment purchase advice stays out of scope → Onira Experience

## Preview (local dev)

```bash
npm run dev
curl "http://localhost:3010/api/chat/context?locale=en"
curl "http://localhost:3010/api/chat/context?locale=fr&format=text"
```

Not exposed in production.

## After edits

Redeploy the app so Docker picks up `content/assistant/*`. No Supabase migration required.
