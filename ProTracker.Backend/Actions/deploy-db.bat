@echo off
setlocal
cd /d "%~dp0.."
echo Deploying a fresh database...

set "DB_PATH=ProTracker.Web\Data\protracker.db"
set "OLD_DB_PATH=ProTracker.Web\proTracker.db"

if exist "%DB_PATH%" (
    echo Deleting existing database at %DB_PATH%...
    del "%DB_PATH%"
)
if exist "%OLD_DB_PATH%" (
    echo Deleting leftover database at %OLD_DB_PATH%...
    del "%OLD_DB_PATH%"
)

echo Applying migrations to create a new database...
dotnet ef database update --project ProTracker.Data --startup-project ProTracker.Web
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Migration failed. Ensure dotnet-ef tool is installed.
)
pause
