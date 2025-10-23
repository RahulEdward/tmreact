@echo off
echo 🚀 Preparing backend for Vercel deployment...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
)

REM Login to Vercel
echo Please make sure you're logged in to Vercel:
vercel login

REM Deploy to Vercel
echo Deploying to Vercel...
vercel --prod

echo ✅ Backend deployment complete!
echo 📝 Don't forget to:
echo 1. Update CORS_ORIGINS in Vercel environment variables
echo 2. Set DATABASE_URL if using external database  
echo 3. Update frontend API URLs to point to Vercel domain

pause