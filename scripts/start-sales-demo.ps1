param(
  [switch]$ValidateOnly,
  [switch]$SkipInstall,
  [switch]$SkipBrowser
)

$ErrorActionPreference = "Stop"

function Resolve-CommandPath {
  param(
    [string[]]$Candidates,
    [string]$Name
  )

  foreach ($candidate in $Candidates) {
    if (Test-Path $candidate) {
      return $candidate
    }
  }

  throw "$Name was not found. Close Windows Terminal, reopen it, and run the launch command again."
}

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$nodePath = Resolve-CommandPath -Name "Node.js" -Candidates @(
  "$env:ProgramFiles\nodejs\node.exe",
  "$env:LocalAppData\Programs\nodejs\node.exe"
)

$npmPath = Resolve-CommandPath -Name "Node.js" -Candidates @(
  "$env:ProgramFiles\nodejs\npm.cmd",
  "$env:LocalAppData\Programs\nodejs\npm.cmd"
)

if ($ValidateOnly) {
  Write-Host "Repo root: $repoRoot"
  Write-Host "node: $nodePath"
  Write-Host "npm: $npmPath"
  exit 0
}

if (-not $SkipInstall) {
  & $npmPath install --no-fund --no-audit
}

$quotedRepoRoot = $repoRoot.Replace("'", "''")
$quotedNodePath = $nodePath.Replace("'", "''")
$serverCommand = "Set-Location '$quotedRepoRoot'; & '$quotedNodePath' .\node_modules\next\dist\bin\next dev"

Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-ExecutionPolicy", "Bypass",
  "-Command", $serverCommand
)

if (-not $SkipBrowser) {
  for ($attempt = 0; $attempt -lt 45; $attempt++) {
    Start-Sleep -Seconds 2

    try {
      Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 2 | Out-Null
      Start-Process "http://localhost:3000"
      exit 0
    } catch {
    }
  }

  throw "The app did not start on http://localhost:3000 within 90 seconds. Check the PowerShell window that opened for the server."
}
