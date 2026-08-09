# Git hooks

Uses [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/lint-staged/lint-staged).

## Pre-commit

- `lint-staged`: ESLint with auto-fix on staged JS/TS files
- TypeScript `tsc --noEmit` when any staged `.ts` / `.tsx` files

## Pre-push

- Full project type check

## Manual

```bash
npm run lint
npm run lint:fix
npm run type-check
npm run check
```

## Skip (emergency only)

```bash
git commit --no-verify
git push --no-verify
```

Hooks install automatically on `npm install` via the `prepare` script.
