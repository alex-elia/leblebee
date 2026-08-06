# Leblebee — Product Spec (MVP)

**Domain:** [www.leblebee.com](https://www.leblebee.com)  
**Audience:** Remote short-term rental hosts + local providers (start: founder dogfood + small Greece owner circle)  
**Stack:** Next.js, local Supabase CLI (Auth/DB/Storage), OVH AI Endpoints — see ADR 001  
**License:** MIT (public repo) · hosted cloud free for now; fair fee/commission later  
**Status:** Active MVP — communication-first, not PMS

## Promise

Host and local provider stay aligned on what to do, when, and what the place needs — across languages — so guests get a better stay and nobody is guessing.

Leblebee is a bilingual ops channel with shared property context and a light AI companion. It is **not** a control/HR tool for scoring providers.

## Primary users

| Role | Needs |
|------|--------|
| **Admin** (`alex.gon@eliago.com` only) | Platform overview, design system, cross-tenant visibility |
| **Client** | Property owner — properties, tasks, suppliers |
| **Supplier** | Local provider — assigned tasks, handoff notes/photos |

## MVP in scope

1. Magic-link auth (host + invited provider)
2. Properties + private provider contacts
3. Task create → translate/clarify (OVH) → assign → email notify
4. Provider mobile flow: confirm → do → note + photo(s) → done
5. Host sees bilingual completion summary; can ask follow-up / reopen
6. Property memory (keys, quirks, linen notes) injected into companion hints
7. UI EN / FR / EL; task content stored as source + translations
8. Design system + `/design-system` for development

## Explicitly out of MVP

- Airbnb/PMS sync, pricing, guest messaging inbox
- Shared marketplace directory, reliability scores, reports
- WhatsApp/SMS API (deep-link copy is OK later)
- Native apps, voice notes, photo “quality” AI
- Payments between host and provider

## Task lifecycle

`draft` → `assigned` → `accepted` → `done` → (`follow_up` | `closed`) | `cancelled`

Handoff photos are encouraged (soft requirement for cleaning); they are **context**, not courtroom evidence. Host language: acknowledge / follow-up — not approve/reject theater.

## AI companion (MVP)

| Capability | Behavior |
|------------|----------|
| Translate + clarify | Provider language + editable clearer rewrite if vague |
| Don’t-forget checklist | From category + property memory |
| Property memory assist | Short bullets stored on property, injected into new tasks |
| Completion summary | Bilingual short summary from note (+ optional captions) |

All suggestions are editable before send. Never fabricate completion. Never silently rewrite host intent. Preserve names, dates, addresses.

## Notifications (v1)

- Email magic links + assigned / accepted / done / reminder if not accepted
- In-app lists when logged in
- WhatsApp later: same deep link

## Success criteria

- Host creates a task in under 60 seconds
- Provider completes a task from mobile without training
- Real turnover week runs on Leblebee for founder + cleaner
- A neighbor host creates ≥3 tasks without a walkthrough

## Delivery slices

0. Foundations + design system + auth + property/provider CRUD  
1. Task loop + OVH + email + provider mobile handoff  
2. Companion don’t-forget + property memory + completion summary  
3. Multi-host isolation polish + overdue reminder + WhatsApp message copy  
