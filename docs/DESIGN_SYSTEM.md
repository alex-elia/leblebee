# Design system

Living gallery: `/design-system`

## Tokens

Defined in `src/app/globals.css` (`--ink`, `--sand`, `--olive`, `--coral`, …) and exposed to Tailwind via `@theme`.

## Primitives

| Component | Path | Use |
|-----------|------|-----|
| `AppShell` | `components/ui/app-shell.tsx` | Page chrome + brand |
| `Button` | `button.tsx` | primary / secondary / ghost |
| `TextField` / `TextAreaField` | `field.tsx` | Forms |
| `StatusChip` | `status-chip.tsx` | Task lifecycle |
| `TaskRow` | `task-row.tsx` | Lists |
| `BilingualBlock` | `bilingual-block.tsx` | Source ↔ translation |
| `PhotoStrip` | `photo-strip.tsx` | Handoff photos |
| `CompanionHint` | `companion-hint.tsx` | AI suggestions |
| `EmptyState` | `empty-state.tsx` | Zero-data screens |

## Principles

- Brand first on marketing/login
- Provider screens: one job, large targets
- Collaborative copy; coral only for attention
- Cards only when wrapping interaction
