@echo off
title Kenya Tax Calculator Launcher
echo ===================================================
echo           KENYA TAX CALCULATOR (KRA)
echo ===================================================
echo.
echo Launching Web Application on http://localhost:3000...
echo Opening browser...
echo.

start "" "http://localhost:3000"
npx next dev --webpack -p 3000
