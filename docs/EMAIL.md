# Email / magic links

Leblebee does **not** send auth mail from the Next.js app.  
`signInWithOtp` asks **Supabase Auth** to send the magic link. Where that mail goes depends on environment.

## Environments

| Env | Delivery | How |
|-----|----------|-----|
| **Local** | Mailpit (Inbucket) | `supabase start` → `[inbucket]` in `supabase/config.toml`. UI: http://127.0.0.1:54324 |
| **Production (now)** | Supabase built-in mailer | No custom SMTP. Configure Site URL + redirects with `npm run auth:configure-email` |
| **Production (later)** | Brevo / Resend / etc. | Same script with `SMTP_*` env vars, or Dashboard → Auth → SMTP |

Do **not** enable `[auth.email.smtp]` in local `config.toml`, or magic links leave the machine instead of Mailpit.

Do **not** run `supabase config push` from this repo for Auth URLs — local `site_url` is `http://localhost:3010` and would overwrite production.

## One-time / after Auth template changes

```powershell
# Personal access token (CLI keychain is not readable by the script):
# https://supabase.com/dashboard/account/tokens
$env:SUPABASE_ACCESS_TOKEN = "sbp_..."
npm run auth:configure-email
```

Sets on project `bbvpuxuvtnpfmprufgab`:

- Site URL: `https://www.leblebee.com`
- Redirect allow-list including `/auth/callback`
- Email provider enabled
- Leblebee HTML templates for magic link / invite / confirmation
- **No SMTP** → Supabase default sending

## Switch to Brevo (or Resend) later

Keep using Supabase Auth; only change the SMTP relay:

```powershell
$env:SMTP_HOST = "smtp-relay.brevo.com"   # or smtp.resend.com
$env:SMTP_PORT = "587"
$env:SMTP_USER = "..."                    # Brevo login / Resend "resend"
$env:SMTP_PASS = "..."                    # SMTP key / API key
$env:SMTP_ADMIN_EMAIL = "noreply@leblebee.com"
$env:SMTP_SENDER_NAME = "Leblebee"
npm run auth:configure-email
```

Verify the sender domain (SPF/DKIM) in the provider dashboard.

## App UX

- Local success copy mentions Mailpit.
- Production success copy tells users to check their inbox.
- Magic-link emails use **token_hash** links plus a **6-digit code** (`{{ .Token }}`). Sign-in on the site uses the code (no link click, no PKCE). The link is a backup.
- After changing templates in `supabase/templates/`, run `npm run auth:configure-email` so production Supabase picks them up.
- Supabase free tier has email rate limits: prefer entering the code on `/login` instead of requesting many links. One email = one code.
- Callback redirects use `NEXT_PUBLIC_APP_URL` (not `0.0.0.0:3010` from the container bind address).

## Free-tier note

Also confirm Supabase **Site URL** is `https://www.leblebee.com` (Dashboard → Auth → URL configuration, or `npm run auth:configure-email`).

Supabase built-in mailer is rate-limited and fine for dogfood. Move to Brevo/Resend when deliverability or volume becomes an issue.
