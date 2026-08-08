# Leblebee

Bilingual host-supplier ops for short-term rentals.  
Domain: [www.leblebee.com](https://www.leblebee.com)  
**License:** [MIT](LICENSE)

Built as a working product *and* as a public showcase of shipping with Cursor agents.

## Offer

- **Open source (MIT):** run it yourself, fork it, learn from the stack.
- **Hosted cloud** at www.leblebee.com: **free for now** while we dogfood with a small Greece circle. Later it will use a fair fee or commission, announced clearly before any change.

## Docs

- [Product spec](docs/SPEC.md)
- [Production deploy (OVH + DNS)](docs/DEPLOY_PRODUCTION.md)
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
- Design system: http://localhost:3010/design-system (admin)  
- Supabase Studio: http://127.0.0.1:54323  
- Mailpit (local magic links): http://127.0.0.1:54324  

Email strategy (local Mailpit / prod Supabase mail / later Brevo): [docs/EMAIL.md](docs/EMAIL.md)

### DB / Auth scripts

| Script | Purpose |
|--------|---------|
| `npm run db:start` | `supabase start` |
| `npm run db:stop` | `supabase stop` |
| `npm run db:reset` | Reset DB + reapply migrations |
| `npm run db:sync-env` | Write local keys into `.env.local` |
| `npm run auth:configure-email` | Set prod Auth Site URL + Supabase mailer (or SMTP_*) |

## Stack

Next.js · local Supabase CLI (cloud later) · OVH AI (Clin env) · Vercel (production)

See [ADR 001](docs/adr/001-stack.md).

## MVP focus

Communication and shared context — not provider surveillance. See `docs/SPEC.md`.
