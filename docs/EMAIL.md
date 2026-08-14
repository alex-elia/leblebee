# Email / auth

Leblebee uses **Supabase Auth** for sign-in. The app supports **email + password** (recommended) and optional **email magic links**.

## Environments

| Env | Delivery | How |
|-----|----------|-----|
| **Local** | Mailpit (Inbucket) | `supabase start` → http://127.0.0.1:54324 |
| **Production** | Supabase built-in mailer | No custom SMTP. Rate limits apply on free tier. |

Do **not** enable `[auth.email.smtp]` in local `config.toml`, or mail goes off-machine instead of Mailpit.

## Recommended: password sign-in

- **Register** at `/register` with email + password (one confirmation email if Supabase requires it).
- **Sign in** at `/login` with the **Password** tab (no email per visit).
- **Forgot password** at `/login/forgot` (one reset email when needed).

Local seed users use password `leblebee-dev` (see `supabase/seed.sql`).

## Optional: email magic link

On `/login` → **Email link** tab:

- Uses one Supabase email per request.
- Default Supabase template sends a PKCE link (`?code=`). It only works if opened in the **same browser** where you requested it.
- Do not open the link from the mail app browser on your phone; copy the URL to the browser where you clicked "Email me a sign-in link", or use password instead.

Custom HTML templates in `supabase/templates/` are optional. Push them with `npm run auth:configure-email` when you have a Supabase access token. Built-in mailer still works without custom templates.

## Site URL (production)

```powershell
$env:SUPABASE_ACCESS_TOKEN = "sbp_..."
npm run auth:configure-email
```

Sets Site URL `https://www.leblebee.com`, redirect allow-list, and optionally custom templates.

## Email limits

Prefer **password** for daily use. Reserve emails for:

- First registration (if confirmation enabled)
- Password reset
- Optional magic link sign-in

Task assignment no longer sends auth magic links (they failed for suppliers on default templates).
