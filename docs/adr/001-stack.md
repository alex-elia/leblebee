# ADR 001: Stack - Next.js + Supabase + OVH AI

## Status

Accepted (revised 2026-08-06)

## Context

Leblebee needs magic-link auth, relational data, photo storage, mobile web UI, and server-side LLM calls. OVH AI Endpoints are already configured in Clin. Local Supabase CLI is enough for dogfood; shared hosting needs a free Supabase cloud project.

## Decision

- **Frontend / BFF:** Next.js App Router on port **3010**; production `https://www.leblebee.com`
- **Auth / DB / Storage (dev):** local Supabase CLI (`supabase start`)
- **Auth / DB / Storage (prod):** free Supabase project **`bbvpuxuvtnpfmprufgab`**
- **AI:** OVH AI Endpoints via Clin-compatible env in `lib/ai/ovh.ts`
- **Hosting:** OVH Kubernetes (same cluster / ingress as Nemrut), deploy via GitHub Actions on `main`

### Local workflow

```bash
supabase start
npm run db:sync-env
npm run dev   # http://localhost:3010
```

### Production

See [DEPLOY_PRODUCTION.md](../DEPLOY_PRODUCTION.md).

DNS A records for `www.leblebee.com` and apex `leblebee.com` → **`51.83.34.135`** (ingress). Canonical URL is www.

## Consequences

- Same migrations for local and cloud
- Magic-link emails: Mailpit locally; Supabase Auth email in production
- No staging environment for now (direct prod)
