@echo off
echo ========================================
echo   Deploying Backend to Vercel
echo ========================================
echo.

echo Checking Vercel CLI...
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Vercel CLI not found!
    echo Please install it: npm install -g vercel
    pause
    exit /b 1
)

echo.
echo Deploying to Vercel (Production)...
echo.

vercel --prod

echo.
echo ========================================
echo   Backend Deployment Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Go to Vercel Dashboard
echo 2. Set environment variables:
echo    - FLASK_ENV=production
echo    - DATABASE_URL=sqlite:///tmp/secueralgo.db
echo    - APP_KEY=your-secret-key
echo    - CORS_ORIGINS=https://your-frontend-url.vercel.app
echo    - VERCEL=1
echo 3. Test the deployment
echo.
pause
