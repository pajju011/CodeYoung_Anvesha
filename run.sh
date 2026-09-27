#!/usr/bin/env bash

echo "========================================================"
echo "  Anvesha: 1-on-1 Trial Class Appointment System"
echo "  Discover. Connect. Learn."
echo "========================================================"
echo ""

# 1. Verify Node.js is installed
if ! command -v node >/dev/null 2>&1; then
    echo "[ERROR] Node.js is not found in your system PATH."
    echo "Please install Node.js v18 or higher from https://nodejs.org/"
    exit 1
fi

# 2. Check if dependencies are installed
if [ ! -d "node_modules/react" ]; then
    echo "[INFO] Installing required project dependencies..."
    echo "This may take a moment on the first run..."
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] Dependency installation failed."
        exit 1
    fi
    echo "[SUCCESS] Dependencies installed successfully."
    echo ""
fi

# 3. Inform user about endpoints
echo "[INFO] Starting Full-Stack Application:"
echo "  - Backend API Server: http://localhost:3001/api/health"
echo "  - Frontend React UI:  http://localhost:5173/"
echo ""
echo "Press Ctrl+C anytime to stop the application."
echo "========================================================"
echo ""

# 4. Open default web browser after 3 seconds
(
  sleep 3
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://localhost:5173/" >/dev/null 2>&1
  elif command -v open >/dev/null 2>&1; then
    open "http://localhost:5173/" >/dev/null 2>&1
  fi
) &

# 5. Launch both Express backend and Vite frontend concurrently
npm run dev
