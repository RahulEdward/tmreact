@echo off
echo ========================================
echo   Full Stack Deployment to Vercel
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
echo ========================================
echo   Step 1: Deploying Backend
echo ========================================
echo.

vercel --prod

echo.
echo Backend deployed! Please note the URL.
echo.
pause

echo.
echo ========================================
echo   Step 2: Deploying Frontend
echo ========================================
echo.

cd nextjs-frontend
vercel --prod
cd ..

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo IMPORTANT: Update Environment Variables
echo.
echo Backend (Vercel Dashboard):
echo   - FLASK_ENV=production
echo   - DATABASE_URL=sqlite:///tmp/secueralgo.db
echo   - APP_KEY=your-secret-key
echo   - CORS_ORIGINS=https://your-frontend-url.vercel.app
echo   - VERCEL=1
echo.
echo Frontend (Vercel Dashboard):
echo   - NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
echo   - NEXT_PUBLIC_SITE_URL=https://your-frontend-url.vercel.app
echo   - NODE_ENV=production
echo.
echo After setting environment variables, redeploy both:
echo   1. vercel --prod (in root for backend)
echo   2. cd nextjs-frontend ^&^& vercel --prod (for frontend)
echo.
pause
