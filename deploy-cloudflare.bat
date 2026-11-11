@echo off
title SESI Cloudflare Pages Deployment
echo ========================================================
echo   SESI SRS - Deploy Desktop Layout to Cloudflare Pages
echo ========================================================
echo.
cd /d "%~dp0mobile-frontend"

echo [1/2] Building latest production bundle with desktop layout...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed! Please review errors above.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Deploying to Cloudflare Pages (sesi--srs)...
call npx wrangler pages deploy dist --project-name sesi--srs
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Deployment failed! Please review wrangler errors above.
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================================
echo   Deployment complete! Visit: https://sesi--srs.pages.dev/
echo ========================================================
echo.
pause

