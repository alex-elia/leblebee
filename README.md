# Leblebee

Bilingual host–provider ops for short-term rentals.  
Domain: [leblebee.com](https://leblebee.com)

## Docs

- [Product spec](docs/SPEC.md)
- [ADRs](docs/adr/)

## Local setup

```bash
npm install
# OVH keys: copy from clin/web into .env.local (or keep existing)
supabase start
npm run db:sync-env
npm run dev
```

- App: http://localhost:3010  
- Design system: http://localhost:3010/design-system  
- Supabase Studio: http://127.0.0.1:54323  
- Mailpit (magic links): http://127.0.0.1:54324  

### DB scripts

| Script | Purpose |
|--------|---------|
| `npm run db:start` | `supabase start` |
| `npm run db:stop` | `supabase stop` |
| `npm run db:reset` | Reset DB + reapply migrations |
| `npm run db:sync-env` | Write local keys into `.env.local` |

## Stack

Next.js · local Supabase CLI (cloud later) · OVH AI (Clin env) · Vercel (production)

See [ADR 001](docs/adr/001-stack.md).

## MVP focus

Communication and shared context — not provider surveillance. See `docs/SPEC.md`.
