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

Auth email (magic links):

```powershell
$env:SUPABASE_ACCESS_TOKEN = "sbp_..."   # https://supabase.com/dashboard/account/tokens
npm run auth:configure-email
```

That sets Site URL `https://www.leblebee.com`, redirect allow-list, and **Supabase built-in mail** (no Brevo yet).  
Details / later SMTP switch: [EMAIL.md](./EMAIL.md).

## One-time cluster bootstrap

On the jump host (or via `kale-infra/.../scripts/apply-leblebee.ps1`), follow:

**https://github.com/alex-elia/kale-infra/tree/main/production/k8s/leblebee**

You must create on the cluster (not from the placeholder YAML):

1. `ghcr-secret` in namespace `leblebee`
2. `leblebee-secrets` with app URL + Supabase keys only (OVH AI stays in GitHub secrets)

Rollout uses replace-in-place (`maxSurge: 0`, `maxUnavailable: 1`) so deploys stop the running pod before starting the new one.

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
| `SUPABASE_SERVICE_ROLE_KEY` | service role (runtime + CI upserts k8s secret) |
| `SUPABASE_ACCESS_TOKEN` | CLI token |
| `SUPABASE_DB_PASSWORD` | DB password |
| `SUPABASE_PROJECT_ID` | `bbvpuxuvtnpfmprufgab` |
| `LLM_PROVIDER` / `OVH_AI_*` | optional; GitHub only (not required in kube secret) |

After bootstrap + GitHub secrets: push to `main` or run **Build and Deploy to Production**.
