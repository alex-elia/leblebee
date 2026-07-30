# ADR 004: AI Companion — Structured Assist via OVH

## Status

Accepted

## Context

Translation alone is not enough. Hosts forget checklist items; instructions are often vague; providers and hosts need a shared “what next / don’t forget” layer. Product positioning is **service and communication**, not provider quality scoring.

## Decision

- Call OVH AI Endpoints only from the server
- MVP capabilities: translate + clarify, don’t-forget checklist, property-memory bullets, completion summary
- UI pattern: dismissible **CompanionHint** / “Leblebee suggests” — editable before send; never auto-act
- Do **not** ship photo quality scoring or unsupervised agent actions

## Consequences

- Prompts must preserve names, dates, addresses; show source + translation
- Property memory becomes a first-class table/column for grounding
- Near-term roadmap (post-dogfood): “what to do next” from open tasks + dates, seasonal reminders, draft replies
