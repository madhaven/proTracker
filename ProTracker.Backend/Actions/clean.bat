@echo off
setlocal
cd /d "%~dp0.."
echo Cleaning untracked files...
git clean -fd
pause
