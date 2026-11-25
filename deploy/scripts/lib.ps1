#Requires -Version 5.1
$ErrorActionPreference = 'Stop'

$script:DeployRoot = $PSScriptRoot
$script:NuxtDir    = Split-Path -Parent (Split-Path -Parent $DeployRoot)
$script:Config     = . (Join-Path $DeployRoot 'config.ps1')

function Get-NuxtConfig { return $script:Config }

function Write-DeployStep([string]$Message) {
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Write-DeploySuccess([string]$Message) {
    Write-Host $Message -ForegroundColor Green
}

function Write-DeployWarn([string]$Message) {
    Write-Host $Message -ForegroundColor Yellow
}

function Write-DeployError([string]$Message) {
    Write-Host $Message -ForegroundColor Red
}

function Get-PlinkPath {
    $cmd = Get-Command plink -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }
    $default = 'C:\Program Files\PuTTY\plink.exe'
    if (Test-Path $default) { return $default }
    throw 'plink not found. Install PuTTY.'
}

function Get-PscpPath {
    $cmd = Get-Command pscp -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }
    $default = 'C:\Program Files\PuTTY\pscp.exe'
    if (Test-Path $default) { return $default }
    throw 'pscp not found. Install PuTTY.'
}

function Test-UseSshKey {
    $c = $script:Config
    return ($c.SshKeyPath -and (Test-Path $c.SshKeyPath))
}

function Get-PlinkHostKeyArgs {
    $keys = @($script:Config.SshHostKey)
    $args = @()
    foreach ($key in $keys) {
        if ($key -match '^[0-9a-fA-F:]{47}$') {
            $args += @('-hostkey', $key)
        }
        elseif ($key -match '^SHA256:[A-Za-z0-9+/=]+$') {
            $args += @('-hostkey', $key)
        }
    }
    return $args
}

function Get-PlinkCommonArgs {
    $c = $script:Config
    return @('-batch') + @(Get-PlinkHostKeyArgs) + @('-ssh', "$($c.SshUser)@$($c.SshHost)", '-P', $c.SshPort, '-pw', $c.SshPass)
}

function Invoke-RemoteCommand {
    param(
        [string]$Command,
        [switch]$AllowFailure
    )

    $c = $script:Config
    if (Test-UseSshKey) {
        & ssh -p $c.SshPort -i $c.SshKeyPath -o StrictHostKeyChecking=accept-new "$($c.SshUser)@$($c.SshHost)" $Command
    }
    else {
        $plink = Get-PlinkPath
        $args  = @(Get-PlinkCommonArgs) + @($Command)
        & $plink @args
    }

    $exit = [int]$LASTEXITCODE
    if ($exit -ne 0 -and -not $AllowFailure) {
        throw "Remote command failed with exit code ${exit} - $Command"
    }
    return $exit
}

function Invoke-RemoteCommandText {
    param([string]$Command)

    $c = $script:Config
    $plink = Get-PlinkPath
    $args  = @(Get-PlinkCommonArgs) + @($Command)
    $raw   = & $plink @args 2>&1 | Out-String
    return $raw.Trim()
}

function Send-RemoteFile {
    param(
        [string]$LocalPath,
        [string]$RemotePath
    )

    if (-not (Test-Path $LocalPath)) {
        throw "Local file not found: $LocalPath"
    }

    $c = $script:Config
    $pscp = Get-PscpPath
    $hostKeyArgs = Get-PlinkHostKeyArgs
    $args = @('-batch') + @($hostKeyArgs) + @('-P', $c.SshPort, '-pw', $c.SshPass, $LocalPath, "$($c.SshUser)@$($c.SshHost):$RemotePath")
    & $pscp @args

    if ($LASTEXITCODE -ne 0) {
        throw "Upload failed with exit code $LASTEXITCODE for $LocalPath"
    }
}

function Build-NuxtLocal {
    Write-DeployStep "Building Nuxt 3 locally (npm run build)..."
    Push-Location $script:NuxtDir
    try {
        & npm run build
        if ($LASTEXITCODE -ne 0) {
            throw "npm run build failed with code $LASTEXITCODE"
        }
        Write-DeploySuccess "Nuxt local build completed."
    }
    finally {
        Pop-Location
    }
}

function New-NuxtZip {
    param([string]$ZipPath)

    $outputDir = Join-Path $script:NuxtDir '.output'
    if (-not (Test-Path $outputDir)) {
        throw ".output folder not found. Please run local build first!"
    }

    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem

    if (Test-Path $ZipPath) { Remove-Item $ZipPath -Force }

    Write-DeployStep "Creating zip from .output -> $ZipPath"
    
    $zip = [System.IO.Compression.ZipFile]::Open($ZipPath, [System.IO.Compression.ZipArchiveMode]::Create)
    try {
        $files = Get-ChildItem -Path $outputDir -Recurse -File
        foreach ($file in $files) {
            $rel = $file.FullName.Substring($outputDir.Length).TrimStart('\', '/').Replace('\', '/')
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $rel, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
        }
    }
    finally {
        $zip.Dispose()
    }
    
    $sizeMB = (Get-Item $ZipPath).Length / 1MB
    Write-DeploySuccess ("Zip archive created ({0:N2} MB)" -f $sizeMB)
    return $ZipPath
}

function Deploy-NuxtOutput {
    param([switch]$SkipBuild)

    $c = $script:Config
    $localZip = Join-Path $script:DeployRoot $c.ZipName

    if (-not $SkipBuild) {
        Build-NuxtLocal
    }

    New-NuxtZip -ZipPath $localZip

    Write-DeployStep "Uploading helper scripts and .output zip to server..."
    $extractPy = Join-Path $script:DeployRoot 'extract.py'
    $patchJs   = Join-Path $script:DeployRoot 'patch-pinia-clean.js'
    if (Test-Path $extractPy) { Send-RemoteFile -LocalPath $extractPy -RemotePath '/tmp/extract.py' }
    if (Test-Path $patchJs)   { Send-RemoteFile -LocalPath $patchJs   -RemotePath '/tmp/patch-pinia-clean.js' }

    Send-RemoteFile -LocalPath $localZip -RemotePath $c.RemoteZip

    Write-DeployStep "Extracting on server to $($c.RemoteDir)/.output..."
    $cmd = "mkdir -p $($c.RemoteDir)/.output && rm -rf $($c.RemoteDir)/.output/* && python3 /tmp/extract.py $($c.RemoteZip) $($c.RemoteDir)/.output && rm -f $($c.RemoteZip) && node /tmp/patch-pinia-clean.js && cd $($c.RemoteDir)/.output/server && npm install --omit=dev && chown -R $($c.WebUser):$($c.WebGroup) $($c.RemoteDir) && chmod -R 755 $($c.RemoteDir)"
    Invoke-RemoteCommand $cmd

    Write-DeployStep "Restarting Nuxt SSR service..."
    Restart-NuxtService

    Write-DeploySuccess "Nuxt SSR deployed successfully!"
}

function Install-NuxtService {
    $c = $script:Config
    $template = Join-Path $script:DeployRoot 'systemd\zanburak-nuxt.service'
    if (-not (Test-Path $template)) {
        throw "Service template not found: $template"
    }

    $content = Get-Content $template -Raw
    $content = $content.Replace('{{WEB_USER}}', $c.WebUser)
    $content = $content.Replace('{{WEB_GROUP}}', $c.WebGroup)
    $content = $content.Replace('{{REMOTE_DIR}}', $c.RemoteDir)
    $content = $content.Replace('{{NODE_PATH}}', $c.NodePath)
    $content = $content.Replace('{{NUXT_PORT}}', $c.NuxtPort.ToString())
    $content = $content.Replace('{{NUXT_HOST}}', $c.NuxtHost)

    $tempFile = [System.IO.Path]::GetTempFileName()
    try {
        [System.IO.File]::WriteAllText($tempFile, $content, [System.Text.Encoding]::UTF8)
        $remoteTmp = "/tmp/$($c.ServiceName).service"
        Send-RemoteFile -LocalPath $tempFile -RemotePath $remoteTmp

        $cmd = @"
mv $remoteTmp /etc/systemd/system/$($c.ServiceName).service
chmod 644 /etc/systemd/system/$($c.ServiceName).service
systemctl daemon-reload
systemctl enable $($c.ServiceName)
systemctl restart $($c.ServiceName)
"@
        Invoke-RemoteCommand $cmd
        Write-DeploySuccess "Service $($c.ServiceName) installed, enabled and started."
    }
    finally {
        if (Test-Path $tempFile) { Remove-Item $tempFile -Force }
    }
}

function Restart-NuxtService {
    $c = $script:Config
    Write-DeployStep "Restarting $($c.ServiceName)..."
    Invoke-RemoteCommand "systemctl restart $($c.ServiceName)"
    Write-DeploySuccess "$($c.ServiceName) restarted."
}

function Start-NuxtService {
    $c = $script:Config
    Write-DeployStep "Starting $($c.ServiceName)..."
    Invoke-RemoteCommand "systemctl start $($c.ServiceName)"
    Write-DeploySuccess "$($c.ServiceName) started."
}

function Stop-NuxtService {
    $c = $script:Config
    Write-DeployStep "Stopping $($c.ServiceName)..."
    Invoke-RemoteCommand "systemctl stop $($c.ServiceName)"
    Write-DeploySuccess "$($c.ServiceName) stopped."
}

function Get-NuxtStatus {
    $c = $script:Config
    Write-DeployStep "Status of $($c.ServiceName):"
    Invoke-RemoteCommand "systemctl status $($c.ServiceName) --no-pager -l" -AllowFailure
}

function Show-NuxtLogs {
    param([int]$Lines = 50)
    $c = $script:Config
    Write-DeployStep "Logs for $($c.ServiceName) (last $Lines lines):"
    Invoke-RemoteCommand "journalctl -u $($c.ServiceName) -n $Lines --no-pager"
}

function Test-And-ReloadNginx {
    Write-DeployStep "Testing and reloading Nginx..."
    Invoke-RemoteCommand "nginx -t && systemctl reload nginx"
    Write-DeploySuccess "Nginx configuration verified and reloaded."
}

function Show-NginxLogs {
    param([int]$Lines = 50)
    Write-DeployStep "Nginx Error Logs (last $Lines lines):"
    Invoke-RemoteCommand "tail -n $Lines /var/log/nginx/error.log" -AllowFailure
}
