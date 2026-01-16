# Script untuk menjalankan development server
# Mengatasi masalah path dengan karakter '&'

$ErrorActionPreference = "Stop"
$PROJECT_DIR = $PSScriptRoot

Write-Host "🚀 Starting development server..." -ForegroundColor Cyan
Write-Host ""

# Cleanup drive Z: jika masih ada
if (Test-Path Z:\) {
    Write-Host "Cleaning up existing Z: drive..." -ForegroundColor Yellow
    subst Z: /d 2>$null
}

try {
    # Mount project ke Z:
    Write-Host "Mounting project to Z:..." -ForegroundColor Cyan
    subst Z: $PROJECT_DIR
    
    if (-not $?) {
        throw "Failed to mount Z: drive"
    }

    # Pindah ke Z:
    Set-Location Z:\
    
    Write-Host "✅ Mounted successfully" -ForegroundColor Green
    Write-Host ""
    Write-Host "📦 Starting Next.js development server..." -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    
    # Jalankan dev server
    npm run dev
}
catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
}
finally {
    # Cleanup
    Write-Host ""
    Write-Host "Cleaning up..." -ForegroundColor Yellow
    Set-Location C:\
    if (Test-Path Z:\) {
        subst Z: /d 2>$null
    }
    Write-Host "✅ Cleanup complete" -ForegroundColor Green
}
