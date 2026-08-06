# ADR 006: Design System — Aegean Service

## Status

Accepted

## Context

MVP needs a coherent, phone-legible UI without a heavy component library. Brand lives on www.leblebee.com; first viewport and app shell should feel local and calm, not generic SaaS purple.

## Decision

- CSS variables in `globals.css` + small `components/ui/*`
- Typography: **Fraunces** (display/brand) + **Source Sans 3** (body)
- Palette: sea ink, sand surface, olive primary, coral only for attention
- Living gallery at `/design-system` for development
- Cards only when wrapping interaction; prefer lists and open layout

## Consequences

- Faster UI consistency for host + provider surfaces
- Avoid Inter/Roboto defaults and dark-mode-first aesthetics in MVP
- Design tokens map into Tailwind `@theme` for utility use
