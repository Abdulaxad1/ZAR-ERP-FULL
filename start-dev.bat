@echo off
start "ZAR ERP Backend" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 2 >nul
start "ZAR ERP Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
