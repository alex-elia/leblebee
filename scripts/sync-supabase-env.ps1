# Sync local `supabase status` keys into .env.local (UTF-8 no BOM).
# Usage: powershell -File scripts/sync-supabase-env.ps1

$ErrorActionPreference = "Continue"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$status = & supabase status -o env 2>$null
if (-not $status) {
  throw "supabase status failed. Run supabase start first."
}
$blob = ($status | Out-String)

function Get-EnvValue([string]$text, [string]$key) {
  foreach ($line in ($text -split "`r?`n")) {
    if ($line -match "^$key=(.*)$") {
      return $Matches[1].Trim().Trim('"')
    }
  }
  return $null
}

$apiUrl = Get-EnvValue $blob "API_URL"
$anon = Get-EnvValue $blob "ANON_KEY"
$service = Get-EnvValue $blob "SERVICE_ROLE_KEY"

if (-not $apiUrl -or -not $anon -or -not $service) {
  Write-Host $blob
  throw "Could not parse supabase status env output."
}

$envPath = Join-Path $root ".env.local"
$lines = @()
if (Test-Path $envPath) {
  $lines = @(Get-Content $envPath)
}

function Set-Or-Add([string[]]$src, [string]$key, [string]$value) {
  $found = $false
  $out = foreach ($line in $src) {
    if ($line -match "^$key=") {
      $found = $true
      "$key=$value"
    } else {
      $line
    }
  }
  if (-not $found) {
    $out = @($out) + "$key=$value"
  }
  return @($out)
}

$lines = Set-Or-Add $lines "NEXT_PUBLIC_SUPABASE_URL" $apiUrl
$lines = Set-Or-Add $lines "NEXT_PUBLIC_SUPABASE_ANON_KEY" $anon
$lines = Set-Or-Add $lines "SUPABASE_SERVICE_ROLE_KEY" $service
$lines = Set-Or-Add $lines "NEXT_PUBLIC_APP_URL" "http://localhost:3010"

$utf8 = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllLines($envPath, $lines, $utf8)
Write-Host "Updated .env.local"
Write-Host "API: $apiUrl"
