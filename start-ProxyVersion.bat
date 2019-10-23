@echo off
:loop
node serverProxy.js
echo.
echo Press any key to restart server...
pause>nul
goto loop
