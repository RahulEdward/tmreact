@echo off
echo ========================================
echo   Deploying Frontend to Vercel
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
echo Navigating to frontend directory...
cd nextjs-frontend

echo.
echo Deploying to Vercel (Production)...
echo.

vercel --prod

cd ..

echo.
echo ========================================
echo   Frontend Deployment Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Update backend CORS_ORIGINS with frontend URL
echo 2. Test the application
echo 3. Verify authentication flow
echo.
pause
