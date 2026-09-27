@echo off
setlocal enabledelayedexpansion
title Anvesha - 1-on-1 Trial Class Appointment System
color 0b

echo ========================================================
echo   Anvesha: 1-on-1 Trial Class Appointment System
echo   Discover. Connect. Learn.
echo ========================================================
echo.

:: 1. Verify Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in your system PATH.
    echo Please install Node.js v18 or higher from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: 2. Check if react exists in node_modules, install if missing
if not exist "node_modules\react\" (
    echo [INFO] Installing required project dependencies...
    echo This may take a moment on the first run...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Dependency installation failed.
        pause
        exit /b 1
    )
    echo [SUCCESS] Dependencies installed successfully.
    echo.
)

:: 3. Inform user about endpoints
echo [INFO] Starting Full-Stack Application:
echo   - Backend API Server: http://localhost:3001/api/health
echo   - Frontend React UI:  http://localhost:5173/
echo.
echo [INFO] Opening http://localhost:5173/ in your default browser...
echo.
echo Press Ctrl+C anytime in this window to stop the application.
echo ========================================================
echo.

:: 4. Open default web browser after a 3-second delay
start "" /b cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:5173/"

:: 5. Launch both Express backend and Vite frontend concurrently
call npm run dev

if %errorlevel% neq 0 (
    echo.
    echo [INFO] Server stopped.
    pause
)
