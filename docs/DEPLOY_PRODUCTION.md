# Leblebee production deploy

Canonical URL: **https://www.leblebee.com**  
Skip staging: `main` / `workflow_dispatch` → production only.

## Split of responsibility

| Repo | Owns |
|------|------|
| **[kale-infra](https://github.com/alex-elia/kale-infra)** `production/k8s/leblebee/` | Namespace, Deployment, Service, Ingress, secret template, bootstrap |
| **[leblebee](https://github.com/alex-elia/leblebee)** GitHub Actions | Build image → GHCR, `supabase db push`, `kubectl set image` |

## DNS

| Record | Type | Value |
|--------|------|-------|
| `www.leblebee.com` | A | **`51.83.34.135`** |
| `leblebee.com` | A | **`51.83.34.135`** (redirects to www) |

Do not point the public site at SSH jump `51.91.150.231`.

## Supabase

Project: **`bbvpuxuvtnpfmprufgab`**

- Site URL: `https://www.leblebee.com`
- Redirect: `https://www.leblebee.com/auth/callback`

## One-time cluster bootstrap

On the jump host (or via `kale-infra/.../scripts/apply-leblebee.ps1`), follow:

**https://github.com/alex-elia/kale-infra/tree/main/production/k8s/leblebee**

You must create on the cluster (not from the placeholder YAML):

1. `ghcr-secret` in namespace `leblebee`
2. `leblebee-secrets` with real Supabase + OVH values

## GitHub environment `production` (you add these)

| Secret | Example |
|--------|---------|
| `PRODUCTION_HOST` | `51.91.150.231` |
| `PRODUCTION_USER` | `ubuntu` |
| `PRODUCTION_SSH_KEY` | jump-host private key |
| `PRODUCTION_SSH_PORT` | `22` |
| `NEXT_PUBLIC_APP_URL` | `https://www.leblebee.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://bbvpuxuvtnpfmprufgab.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / publishable key |
| `SUPABASE_ACCESS_TOKEN` | CLI token |
| `SUPABASE_DB_PASSWORD` | DB password |
| `SUPABASE_PROJECT_ID` | `bbvpuxuvtnpfmprufgab` |

After bootstrap + GitHub secrets: push to `main` or run **Build and Deploy to Production**.
