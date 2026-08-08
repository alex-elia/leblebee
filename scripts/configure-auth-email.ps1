# Configure remote Supabase Auth email for Leblebee production.
#
# Default (no SMTP_* env): Supabase built-in mailer + prod Site URL / redirects.
# Optional custom SMTP later (Brevo, Resend, …): set SMTP_* env vars and re-run.
#
# Prerequisites:
#   supabase login
#   supabase link --project-ref bbvpuxuvtnpfmprufgab
#
# Usage:
#   .\scripts\configure-auth-email.ps1
#   # later:
#   $env:SMTP_HOST="smtp-relay.brevo.com"
#   $env:SMTP_PORT="587"
#   $env:SMTP_USER="..."
#   $env:SMTP_PASS="..."
#   $env:SMTP_ADMIN_EMAIL="noreply@leblebee.com"
#   $env:SMTP_SENDER_NAME="Leblebee"
#   .\scripts\configure-auth-email.ps1

param(
  [string]$ProjectRef = "bbvpuxuvtnpfmprufgab",
  [string]$SiteUrl = "https://www.leblebee.com"
)

$ErrorActionPreference = "Stop"

function Get-SupabaseAccessToken {
  if ($env:SUPABASE_ACCESS_TOKEN) { return $env:SUPABASE_ACCESS_TOKEN.Trim() }

  $candidates = @(
    (Join-Path $HOME ".supabase\access-token"),
    (Join-Path $env:USERPROFILE ".supabase\access-token"),
    (Join-Path $env:APPDATA "supabase\access-token")
  )
  foreach ($path in $candidates) {
    if (Test-Path $path) {
      $token = (Get-Content -Raw $path).Trim()
      if ($token) { return $token }
    }
  }

  throw "No SUPABASE_ACCESS_TOKEN. Create one at https://supabase.com/dashboard/account/tokens then set `$env:SUPABASE_ACCESS_TOKEN and re-run."
}

$token = Get-SupabaseAccessToken
$uri = "https://api.supabase.com/v1/projects/$ProjectRef/config/auth"
$headers = @{
  Authorization = "Bearer $token"
  "Content-Type" = "application/json"
}

$redirects = @(
  $SiteUrl,
  "$SiteUrl/",
  "$SiteUrl/auth/callback",
  "$SiteUrl/**"
) -join ","

$body = [ordered]@{
  site_url = $SiteUrl
  uri_allow_list = $redirects
  external_email_enabled = $true
  mailer_autoconfirm = $false
  mailer_secure_email_change_enabled = $true
  # Magic-link templates (HTML stored on the remote Auth config)
  mailer_subjects_magic_link = "Your Leblebee sign-in link"
  mailer_subjects_invite = "You are invited to Leblebee"
  mailer_subjects_confirmation = "Confirm your Leblebee email"
}

$smtpHost = $env:SMTP_HOST
if ($smtpHost) {
  Write-Host "Custom SMTP enabled -> $smtpHost (external provider)" -ForegroundColor Cyan
  $body.smtp_host = $smtpHost
  $body.smtp_port = if ($env:SMTP_PORT) { $env:SMTP_PORT } else { "587" }
  $body.smtp_user = $env:SMTP_USER
  $body.smtp_pass = $env:SMTP_PASS
  $body.smtp_admin_email = $env:SMTP_ADMIN_EMAIL
  $body.smtp_sender_name = if ($env:SMTP_SENDER_NAME) { $env:SMTP_SENDER_NAME } else { "Leblebee" }

  foreach ($required in @("smtp_user", "smtp_pass", "smtp_admin_email")) {
    if (-not $body[$required]) {
      throw "SMTP_HOST is set but $required / matching env is missing."
    }
  }
} else {
  Write-Host "Using Supabase built-in email (no custom SMTP)." -ForegroundColor Cyan
}

# Attach local HTML templates when present
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$templateMap = @{
  mailer_templates_magic_link_content = "magic_link.html"
  mailer_templates_invite_content = "invite.html"
  mailer_templates_confirmation_content = "confirmation.html"
}
foreach ($field in $templateMap.Keys) {
  $path = Join-Path $repoRoot "supabase\templates\$($templateMap[$field])"
  if (Test-Path $path) {
    $body[$field] = Get-Content -Raw $path
  }
}

Write-Host "PATCH $uri" -ForegroundColor DarkGray
Write-Host "site_url=$SiteUrl" -ForegroundColor DarkGray

$json = $body | ConvertTo-Json -Depth 5
$response = Invoke-RestMethod -Method Patch -Uri $uri -Headers $headers -Body $json

Write-Host "Auth email config updated." -ForegroundColor Green
Write-Host ("site_url={0}" -f $response.site_url)
Write-Host ("external_email_enabled={0}" -f $response.external_email_enabled)
if ($response.smtp_host) {
  Write-Host ("smtp_host={0}" -f $response.smtp_host)
} else {
  Write-Host "smtp_host=(none - Supabase default mailer)"
}
Write-Host ("Dashboard: https://supabase.com/dashboard/project/{0}/auth/smtp" -f $ProjectRef)
