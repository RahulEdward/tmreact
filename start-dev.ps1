Write-Host "Starting Flask + React Development Environment" -ForegroundColor Green
Write-Host ""
Write-Host "This will open two command windows:" -ForegroundColor Yellow
Write-Host "1. Flask Backend (http://localhost:5000)" -ForegroundColor Cyan
Write-Host "2. React Frontend (http://localhost:5173)" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to continue"

Write-Host "Starting Flask Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python app.py"

Write-Host "Waiting 3 seconds for Flask to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "Starting React Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd react-frontend; npm run dev"

Write-Host ""
Write-Host "Both servers are starting in separate windows." -ForegroundColor Green
Write-Host "Flask: http://localhost:5000" -ForegroundColor Cyan
Write-Host "React: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit this window"