@echo off
echo Building React frontend for production...

REM Clean previous build
if exist dist rmdir /s /q dist

REM Install dependencies if needed
if not exist node_modules (
    echo Installing dependencies...
    npm install
)

REM Type check
echo Running type check...
npm run type-check
if %errorlevel% neq 0 (
    echo Type check failed!
    pause
    exit /b 1
)

REM Build for production
echo Building for production...
npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo Build completed successfully!
echo.
echo Build output is in the 'dist' directory.
echo.
echo To integrate with Flask:
echo 1. Copy dist/* to Flask static/react/ directory
echo 2. Update Flask routes to serve React app
echo 3. Configure CORS if needed
echo.

REM Optional: Copy to Flask static directory if it exists
if exist "..\static" (
    echo Flask static directory found. Copy build files? (Y/N)
    set /p choice=
    if /i "%choice%"=="Y" (
        if not exist "..\static\react" mkdir "..\static\react"
        xcopy /E /Y dist\* ..\static\react\
        echo Files copied to Flask static/react directory!
    )
)

pause