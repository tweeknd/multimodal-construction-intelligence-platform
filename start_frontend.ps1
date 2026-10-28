# ConstructIQ — Start React Frontend
# Run from the project root directory

Write-Host "🏗️  ConstructIQ React Frontend" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

Set-Location frontend

Write-Host "Starting Vite dev server on http://localhost:5173" -ForegroundColor Green
Write-Host "Make sure backend is running on http://localhost:8000" -ForegroundColor Yellow
Write-Host ""
npm run dev
