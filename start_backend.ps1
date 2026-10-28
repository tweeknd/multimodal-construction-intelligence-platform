# ConstructIQ — Start FastAPI Backend
# Run from the project root directory

Write-Host "🏗️  ConstructIQ AI Backend" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check if virtual environment exists
if (Test-Path "backend\venv\Scripts\Activate.ps1") {
    Write-Host "Activating virtual environment..." -ForegroundColor Yellow
    & backend\venv\Scripts\Activate.ps1
}

Set-Location backend

Write-Host "Installing/verifying dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt --quiet

Write-Host "Starting FastAPI backend on http://localhost:8000" -ForegroundColor Green
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""
uvicorn main:app --reload --port 8000
