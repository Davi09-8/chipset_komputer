@echo off
setlocal
set "PROJECT_DIR=%~dp0"
:: Remove trailing backslash
set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

echo Mounting project to Z: to bypass path issues...
:: Try to unmount first just in case
subst Z: /d >nul 2>&1
subst Z: "%PROJECT_DIR%"
if errorlevel 1 (
    echo Failed to mount Z:. It might be in use.
    echo Please free Z: or edit this script to use another letter.
    pause
    exit /b 1
)

echo Switching to Z:...
Z:
echo Starting development server...
cmd /c "npm run dev"

echo Cleaning up...
c:
subst Z: /d
pause
