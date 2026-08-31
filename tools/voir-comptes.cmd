@echo off
chcp 65001 >nul
set "PYTHONIOENCODING=utf-8"
title RGRV - Visualiseur des comptes
mode con: cols=132 lines=38 >nul 2>&1
cd /d "%~dp0.."
py tools\admin_accounts.py
pause
