# Start Next.js frontend only - keeps this window open so you see the URL
# Run from repo root: .\scripts\start-frontend.ps1
# Or from scripts: .\start-frontend.ps1

$root = if ($PSScriptRoot) { Join-Path $PSScriptRoot ".." } else { "h:\GitHub\portifolio" }
Set-Location $root

Write-Host "`n=== Starting Frontend (Next.js) ===`n" -ForegroundColor Cyan
Write-Host "Opening http://localhost:3000 in your browser once ready. If port 3000 is in use, check the output for the actual URL (e.g. http://localhost:3001).`n" -ForegroundColor Gray

# Optional: free port 3000 so we use it (comment out if you prefer not to kill other apps)
$on3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($on3000) {
    Write-Host "Port 3000 is in use. Next.js will use 3001 or 3002 unless you close the other app.`n" -ForegroundColor Yellow
}

yarn dev
