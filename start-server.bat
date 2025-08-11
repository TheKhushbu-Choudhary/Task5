@echo off
echo Starting ModernShop Local Server...
echo.
echo To view the website, open your browser and go to:
echo http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Try Python first
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python HTTP Server...
    python -m http.server 8000
    goto :end
)

REM Try Python3 if Python didn't work
python3 --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python3 HTTP Server...
    python3 -m http.server 8000
    goto :end
)

REM If no Python found
echo Python not found! Please install Python or use another web server.
echo.
echo Alternative methods:
echo 1. Install Python from https://python.org
echo 2. Use Node.js: npm install -g http-server, then run: http-server
echo 3. Use Live Server extension in VS Code
echo.
pause

:end
