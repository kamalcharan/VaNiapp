@echo off
REM ===========================================================================
REM VaNi Question Viewer - Windows Launcher
REM Double-click this file to start the question viewer in your browser.
REM ===========================================================================

cd /d "%~dp0"

REM Check if Python is installed
where python >nul 2>&1
if errorlevel 1 (
    echo.
    echo ========================================================
    echo  Python is not installed on this computer.
    echo ========================================================
    echo.
    echo  Please install Python 3 from the Microsoft Store:
    echo  https://apps.microsoft.com/detail/9NRWMJP3717K
    echo.
    echo  After installing, double-click this file again.
    echo.
    pause
    exit /b 1
)

REM Open the browser to the login page (slight delay so server is up first)
start "" http://localhost:8080/login.html

echo.
echo ========================================================
echo  VaNi Question Viewer is running.
echo ========================================================
echo.
echo  The browser should open automatically.
echo  If not, open this link manually:
echo    http://localhost:8080/login.html
echo.
echo  KEEP THIS WINDOW OPEN while reviewing questions.
echo  Close this window when you are done.
echo.
echo ========================================================
echo.

python -m http.server 8080
