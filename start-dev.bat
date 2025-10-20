@echo off
echo Starting Flask + React Development Environment
echo.
echo This will open two command windows:
echo 1. Flask Backend (http://localhost:5000)
echo 2. React Frontend (http://localhost:5173)
echo.
echo Press any key to continue...
pause

echo Starting Flask Backend...
start "Flask Backend" cmd /k "python app.py"

echo Waiting 3 seconds for Flask to start...
timeout /t 3 /nobreak > nul

echo Starting React Frontend...
start "React Frontend" cmd /k "cd react-frontend && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Flask: http://localhost:5000
echo React: http://localhost:5173
echo.
echo Press any key to exit this window...
pause