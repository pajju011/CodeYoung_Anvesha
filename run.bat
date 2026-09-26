@echo off
title TrialClass - Codeyoung Appointment Booking System
color 0b

echo ========================================================
echo   TrialClass: 1-on-1 Trial Class Appointment System
echo ========================================================
echo.

:: Check if node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in PATH!
    echo Please install Node.js (v18+) to run this project.
    echo.
    pause
    exit /b 1
)

:: Check if node_modules exists, install if missing
if not exist "node_modules\" (
    echo [INFO] node_modules not detected. Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
    echo.
)

echo [INFO] Starting Backend API (Port 3001) and Frontend (Port 5173)...
echo.
echo Application will be available at:
echo   - Frontend UI:  http://localhost:5173/
echo   - Backend API:  http://localhost:3001/api/health
echo.
echo Press Ctrl+C anytime to stop the server.
echo ========================================================
echo.

:: Automatically open browser after 2 seconds in background
start "" /b cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:5173/"

:: Launch backend and frontend concurrently
npm run dev
