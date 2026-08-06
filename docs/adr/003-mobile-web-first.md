# ADR 003: Mobile Strategy — Web First, Not Native

## Status

Accepted

## Context

Smartphone use is critical for providers on site. Native (React Native / Expo) adds store friction and dual release cost before product-market fit.

## Decision

- Ship a **mobile-first Next.js web app** on www.leblebee.com
- Provider UX: one task at a time, large tap targets, camera `capture` for handoff photos
- Optional PWA “Add to Home Screen” later; not required for MVP
- Revisit native only if web camera/upload or offline needs fail dogfood

## Consequences

- Faster iteration for a small Greece owner circle
- Deep links work for email now and WhatsApp later
- Must test on real Android/iOS browsers early
