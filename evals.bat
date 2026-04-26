@echo off
cd /d %~dp0
echo Starting EVAL.CORE Next.js Dashboard...
echo Server binding to all network interfaces (0.0.0.0)...

:: Use 'call' so control returns to this script, preventing it from closing
call npm run dev

:: Keep the window open so the terminal remains persistent
echo.
echo [!] The server process has stopped.
pause
