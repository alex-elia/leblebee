# ADR 002: Authentication — Magic Link for Hosts and Providers

## Status

Accepted

## Context

Hosts want frictionless login. Providers (cleaners, handymen) will not tolerate heavy signup; many live on WhatsApp but MVP notifications are email + in-app.

## Decision

- Use **Supabase Auth magic links** (email OTP / link) for both roles
- `profiles.role` is `host` | `provider`
- Hosts own properties, providers, and tasks
- Providers are invited by email and, once linked, only access **assigned** tasks via RLS
- Future option (not MVP): signed single-task tokens without a full session for ultra-low friction — same provider UI

## Consequences

- Email deliverability matters; validate with real cleaner in week one
- WhatsApp can later wrap the same deep link URL without changing auth model
- Assistant / read-only roles deferred
