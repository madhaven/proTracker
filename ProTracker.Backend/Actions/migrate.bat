@echo off
setlocal
cd /d "%~dp0.."
echo Running database migrations...
dotnet ef database update --project ProTracker.Data --startup-project ProTracker.Web
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Migration failed. Ensure dotnet-ef tool is installed.
)
pause
