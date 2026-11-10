@echo off
title SESI SRS Local Dev Launcher
echo ========================================================
echo Starting SESI Local SSMS Backend and Mobile Frontend...
echo ========================================================

:: Release ports 5195 & 5196 if any previous instances were left running
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5195 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5196 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1

start "SESI SSMS Backend (Port 5195)" cmd /k "cd /d "%~dp0mobile-backend" && dotnet watch"

timeout /t 3 /nobreak >nul

start "SESI Mobile Frontend (Port 5196)" cmd /k "cd /d "%~dp0mobile-frontend" && npm run dev"

echo Done! Both servers are launching in separate persistent windows.
