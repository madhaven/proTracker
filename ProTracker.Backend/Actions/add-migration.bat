@echo off
setlocal
cd /d "%~dp0.."
echo Adding a new EF Core migration...

set /p "MIGRATION_NAME=Enter migration name: "

if "%MIGRATION_NAME%"=="" (
    echo [ERROR] Migration name cannot be empty.
    pause
    exit /b 1
)

echo Adding migration '%MIGRATION_NAME%'...
dotnet ef migrations add "%MIGRATION_NAME%" --project ProTracker.Data --startup-project ProTracker.Web
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Migration creation failed. Ensure dotnet-ef tool is installed and there are no build errors.
) else (
    echo [SUCCESS] Migration '%MIGRATION_NAME%' added.
)
pause
