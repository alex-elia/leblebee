# ADR 001: Stack — Next.js + local Supabase + OVH AI

## Status

Accepted (revised 2026-07-29)

## Context

Leblebee needs magic-link auth, relational data, photo storage, mobile web UI, and server-side LLM calls. OVH AI Endpoints are already configured in Clin. A new paid Supabase cloud project is unnecessary for dogfood.

## Decision

- **Frontend / BFF:** Next.js App Router on port **3010**; production `leblebee.com`
- **Auth / DB / Storage (dev):** **local Supabase CLI** (`supabase start`) — free, same migrations as future cloud
- **AI:** OVH AI Endpoints via Clin-compatible env in `lib/ai/ovh.ts`
- **Cloud Supabase:** defer until the Greece owner circle needs shared hosting

### Local workflow

```bash
supabase start
npm run db:sync-env   # writes API URL + keys into .env.local
npm run dev           # http://localhost:3010
```

- Studio: http://127.0.0.1:54323  
- Mailpit (magic links): http://127.0.0.1:54324  
- API: http://127.0.0.1:54321  

Do not point Leblebee at Nemrut/Clin production Supabase.

## Consequences

- Dogfood without a $10 project fee
- Schema in `supabase/migrations/` ports cleanly to a future cloud project
- Magic-link emails appear in Mailpit locally
