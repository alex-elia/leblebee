# Leblebee production deploy

Canonical URL: **https://www.leblebee.com**  
Skip staging: `main` / `workflow_dispatch` → production only.

## Split of responsibility

| Repo | Owns |
|------|------|
| **[kale-infra](https://github.com/alex-elia/kale-infra)** `production/k8s/leblebee/` | Namespace, Deployment, Service, Ingress, secret template, bootstrap |
| **Supabase GitHub integration** | DB migrations from `supabase/migrations/` on push |
| **[leblebee](https://github.com/alex-elia/leblebee)** GitHub Actions | Build image → GHCR, deploy edge functions (when present), `kubectl set image` |

## DNS

| Record | Type | Value |
|--------|------|-------|
| `www.leblebee.com` | A | **`51.83.34.135`** |
| `leblebee.com` | A | **`51.83.34.135`** (redirects to www) |

Do not point the public site at SSH jump `51.91.150.231`.

## Supabase

Project: **`bbvpuxuvtnpfmprufgab`**

**Migrations:** applied by the Supabase ↔ GitHub integration (not in this repo's deploy workflow).

**Edge functions:** add folders under `supabase/functions/<name>/`; CI deploys them automatically on push to `main`.

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
| `SUPABASE_ACCESS_TOKEN` | CLI token (edge function deploy + local auth email script) |
| `SUPABASE_PROJECT_ID` | `bbvpuxuvtnpfmprufgab` (optional; defaults to Leblebee ref) |
| `LLM_PROVIDER` / `OVH_AI_*` | optional; GitHub only (not required in kube secret) |

`SUPABASE_DB_PASSWORD` is only needed for local CLI (`supabase link`, `db push`), not for production deploy.

After bootstrap + GitHub secrets: push to `main` or run **Build and Deploy to Production**.

## Platform admin

Fixed admin account: **`alex.gon@eliago.com`** (see [`src/lib/auth/roles.ts`](../src/lib/auth/roles.ts) and migration `20260808100000_ensure_platform_admin.sql`).

1. Open **https://www.leblebee.com/login** (do not use `/register` for this email).
2. Request a magic link for `alex.gon@eliago.com` (first sign-in creates the auth account).
3. Click the link in your email. You land on `/admin` with the admin role.

If the role was wrong before migration `20260808100000`, Supabase GitHub integration applies it on next push. You can also run the migration SQL once in the Supabase SQL editor.

Admin routes: `/admin`, `/admin/users`, `/admin/activity`, `/admin/intros`, `/admin/agent` (prompt reports).

## Guest AI assistant (`elia-site-tools`)

Landing page uses `@elia/agent-next` (`GuestAssistant` + `/api/chat`), same stack as Konaki/Onira.

Playbook content: `content/assistant/` (see [ASSISTANT_PLAYBOOK.md](./ASSISTANT_PLAYBOOK.md)). Dev preview: `GET /api/chat/context?locale=en`.

`preinstall` runs `scripts/ensure-elia-tools.mjs`:

- Clones [github.com/alex-elia/elia-site-tools](https://github.com/alex-elia/elia-site-tools) (Docker/CI, fresh clones)
- Or links a local checkout if present (`../elia-site-tools`, `../../source/repos/elia-site-tools`, or `ELIA_SITE_TOOLS_DIR`)

Required for chat: `OVH_AI_ENDPOINTS_ACCESS_TOKEN` (already used by task companion).

Optional telemetry/reports: `AGENT_DATABASE_URL`, `AGENT_ADMIN_SECRET`, `AGENT_REPORT_TO`, `RESEND_API_KEY`, `RESEND_FROM`.

Build/dev use `--webpack` so `file:` packages resolve reliably.
