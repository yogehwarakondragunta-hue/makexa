@echo off
echo ========================================
echo    Starting Makexa Application...
echo ========================================
echo.

:: Start backend server in a new window
echo [1/2] Starting Backend Server (port 5000)...
start "Makexa Backend" cmd /k "cd /d %~dp0server && node server.js"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: Start frontend dev server in a new window
echo [2/2] Starting Frontend Dev Server (port 5173)...
start "Makexa Frontend" cmd /k "cd /d %~dp0Client && npx vite --host --port 5173"

:: Wait a moment then open browser
timeout /t 4 /nobreak >nul
echo.
echo ========================================
echo    Opening Makexa in your browser...
echo ========================================
start http://localhost:5173

echo.
echo Both servers are running!
echo - Backend:  http://localhost:5000
echo - Frontend: http://localhost:5173
echo.
echo Close the server windows to stop.
pause
