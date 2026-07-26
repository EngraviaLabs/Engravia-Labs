# Engravia Labs Local Development Launcher
$env:PATH = "$PSScriptRoot\.tools\node-v20.14.0-win-x64;" + $env:PATH

Write-Host "=========================================" -ForegroundColor Gold
Write-Host "     ENGRAVIA LABS - LOCAL RUNNER       " -ForegroundColor Gold
Write-Host "=========================================" -ForegroundColor Gold

Write-Host "`n[1/4] Starting Local MongoDB server..." -ForegroundColor Cyan
Start-Job -Name "Engravia-DB" -ScriptBlock {
    param($root)
    $env:PATH = "$root\.tools\node-v20.14.0-win-x64;" + $env:PATH
    Set-Location $root
    node backend\start-db.js
} -ArgumentList $PSScriptRoot

Start-Sleep -Seconds 6

Write-Host "`n[2/4] Seeding Database with sample products & admin account..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\database"
node seed.js
Set-Location $PSScriptRoot

Write-Host "`n[3/4] Starting Backend API Server (http://localhost:5000)..." -ForegroundColor Green
Start-Job -Name "Engravia-Backend" -ScriptBlock {
    param($root)
    $env:PATH = "$root\.tools\node-v20.14.0-win-x64;" + $env:PATH
    Set-Location "$root\backend"
    npm run dev
} -ArgumentList $PSScriptRoot

Write-Host "`n[4/4] Starting Admin Panel (http://localhost:3001)..." -ForegroundColor Green
Start-Job -Name "Engravia-Admin" -ScriptBlock {
    param($root)
    $env:PATH = "$root\.tools\node-v20.14.0-win-x64;" + $env:PATH
    Set-Location "$root\admin"
    npm run dev
} -ArgumentList $PSScriptRoot

Write-Host "`n🚀 Launching Storefront (http://localhost:3000)..." -ForegroundColor Green
Set-Location "$PSScriptRoot\frontend"
npm run dev
