# ADR 007: Personas — Admin / Client / Supplier

## Status

Accepted

## Context

Leblebee needs separate experiences for platform operator, property owners, and local providers. Design-system tooling must stay internal.

## Decision

- Roles: `admin` | `client` | `supplier` (Postgres enum + `profiles.role`)
- **Admin** is fixed to `alex.gon@eliago.com` (forced in signup trigger + app checks)
- **Register** (`/register`): Client or Supplier + email magic link (`shouldCreateUser: true`)
- **Sign in** (`/login`): email only for existing accounts (`shouldCreateUser: false`); admin uses this path
- Admin email cannot self-register — redirected to Sign in
- Route prefixes: `/admin`, `/client`, `/supplier`
- `/design-system` is **admin-only** (middleware + page guard)
- Properties belong to `client_id` under `/client/properties`

## Consequences

- Clear UX per persona
- Cannot self-register as admin
- Existing local users need a fresh magic link after `db:reset` (roles changed from host/provider)
