@echo off
title Engravia Labs Server Launcher
echo ========================================================
echo   ENGRAVIA LABS - LOCAL SERVER LAUNCHER
echo ========================================================
cd /d "%~dp0"
set PATH=%~dp0.tools\node-v20.14.0-win-x64;%PATH%
node start-engravia.js
pause
