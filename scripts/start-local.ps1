# Start Backend and Frontend locally
# Run from project root: .\scripts\start-local.ps1

Write-Host "`n=== Starting Local Dev Environment ===`n" -ForegroundColor Cyan

# 1. Start Django backend (in background)
Write-Host "1. Starting Django backend on port 8002..." -ForegroundColor Yellow
$backend = Start-Process -FilePath "python" -ArgumentList "manage.py","runserver","8002","--settings=ludmilportifolio.settings_local" -WorkingDirectory (Join-Path $PSScriptRoot "..\..\ludmilportifolio") -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 3

# 2. Start Next.js frontend (in background)
Write-Host "2. Starting Next.js frontend..." -ForegroundColor Yellow
$frontend = Start-Process -FilePath "yarn" -ArgumentList "dev" -WorkingDirectory (Join-Path $PSScriptRoot "..") -PassThru -WindowStyle Hidden

Write-Host "`nBackend:  http://localhost:8002" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000 (or 3001/3002 if 3000 is in use)" -ForegroundColor Green
Write-Host "`n.env.local should have: DJANGO_API_URL=http://localhost:8002`n" -ForegroundColor Gray
