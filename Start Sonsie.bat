@echo off
setlocal

set "REPO_ROOT=%~dp0"
cd /d "%REPO_ROOT%"

set "GIT_EXE=%ProgramFiles%\Git\cmd\git.exe"
if not exist "%GIT_EXE%" set "GIT_EXE=%LocalAppData%\Programs\Git\cmd\git.exe"

set "NODE_EXE=%ProgramFiles%\nodejs\node.exe"
if not exist "%NODE_EXE%" set "NODE_EXE=%LocalAppData%\Programs\nodejs\node.exe"

set "NPM_CMD=%ProgramFiles%\nodejs\npm.cmd"
if not exist "%NPM_CMD%" set "NPM_CMD=%LocalAppData%\Programs\nodejs\npm.cmd"

if not exist "%GIT_EXE%" (
  echo Git was not found on this computer.
  echo Please run the first-time setup command from the README.
  pause
  exit /b 1
)

if not exist "%NODE_EXE%" (
  echo Node.js was not found on this computer.
  echo Please run the first-time setup command from the README.
  pause
  exit /b 1
)

if not exist "%NPM_CMD%" (
  echo npm was not found on this computer.
  echo Please run the first-time setup command from the README.
  pause
  exit /b 1
)

if not exist ".git" (
  echo This file must stay inside the Sonsie folder.
  pause
  exit /b 1
)

echo Checking for Sonsie updates...
"%GIT_EXE%" pull --ff-only
if errorlevel 1 (
  echo Could not update the repo automatically.
  echo Open Windows Terminal in this folder and run: git status
  pause
  exit /b 1
)

if /i "%~1"=="--check-only" (
  powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\start-sales-demo.ps1" -ValidateOnly
  exit /b %errorlevel%
)

echo Starting Sonsie...
powershell -ExecutionPolicy Bypass -File ".\scripts\start-sales-demo.ps1"
if errorlevel 1 (
  echo Sonsie did not finish starting correctly.
  pause
  exit /b 1
)

exit /b 0
