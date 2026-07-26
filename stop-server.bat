@echo off
title Stop Engravia Labs Servers
echo Stopping all Engravia Labs processes...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM mongod.exe /T 2>nul
echo All Engravia processes stopped successfully.
timeout /t 3
