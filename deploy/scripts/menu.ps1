#Requires -Version 5.1
$ErrorActionPreference = 'Stop'

. (Join-Path $PSScriptRoot 'lib.ps1')

$Host.UI.RawUI.WindowTitle = 'Zanburak Nuxt Deploy Manager'

function Write-Banner {
    Clear-Host
    $c = Get-NuxtConfig
    Write-Host ''
    Write-Host '  +============================================================+' -ForegroundColor DarkGreen
    Write-Host '  |         Zanburak - Nuxt SSR Deploy Manager                 |' -ForegroundColor Green
    Write-Host '  +============================================================+' -ForegroundColor DarkGreen
    Write-Host "  |  Server: $($c.SshHost):$($c.SshPort)  |  Path: $($c.RemoteDir)" -ForegroundColor DarkGray
    Write-Host '  +============================================================+' -ForegroundColor DarkGreen
    Write-Host ''
}

function Write-Section([string]$Title) {
    Write-Host "  -- $Title --" -ForegroundColor Yellow
}

function Write-MenuItem([string]$Key, [string]$Label) {
    Write-Host ('  [{0}] {1}' -f $Key.PadLeft(2), $Label)
}

function Wait-Continue {
    Write-Host ''
    Write-Host '  Press Enter to return to menu...' -ForegroundColor DarkGray
    [void][Console]::ReadLine()
}

function Invoke-SafeAction {
    param([scriptblock]$Action)

    try {
        & $Action
    }
    catch {
        Write-DeployError $_.Exception.Message
    }

    Wait-Continue
}

function Show-MainMenu {
    while ($true) {
        Write-Banner

        Write-Section 'DEPLOYMENT'
        Write-MenuItem '1' 'Full deploy (npm run build -> zip -> upload -> restart)'
        Write-MenuItem '2' 'Quick deploy existing .output (skip local build)'
        Write-MenuItem '3' 'Build locally only (npm run build)'
        Write-MenuItem '4' 'Create .output zip archive only'
        Write-Host ''

        Write-Section 'NUXT SSR SERVICE (systemd: zanburak-nuxt)'
        Write-MenuItem '5' 'Install / Update systemd service unit'
        Write-MenuItem '6' 'Start Nuxt service'
        Write-MenuItem '7' 'Stop Nuxt service'
        Write-MenuItem '8' 'Restart Nuxt service'
        Write-MenuItem '9' 'Service status'
        Write-MenuItem '10' 'View service logs (journalctl)'
        Write-Host ''

        Write-Section 'NGINX & WEB'
        Write-MenuItem '11' 'Test & reload Nginx'
        Write-MenuItem '12' 'View Nginx error logs'
        Write-Host ''

        Write-MenuItem '0' 'Exit'
        Write-Host ''

        $choice = (Read-Host '  Enter option number').Trim()

        switch ($choice) {
            '0' { return }

            '1' {
                Invoke-SafeAction -Action { Deploy-NuxtOutput }
            }
            '2' {
                Invoke-SafeAction -Action { Deploy-NuxtOutput -SkipBuild }
            }
            '3' {
                Invoke-SafeAction -Action { Build-NuxtLocal }
            }
            '4' {
                Invoke-SafeAction -Action {
                    $c = Get-NuxtConfig
                    $zip = Join-Path $script:DeployRoot $c.ZipName
                    New-NuxtZip -ZipPath $zip
                }
            }

            '5' {
                Invoke-SafeAction -Action { Install-NuxtService }
            }
            '6' {
                Invoke-SafeAction -Action { Start-NuxtService }
            }
            '7' {
                Invoke-SafeAction -Action { Stop-NuxtService }
            }
            '8' {
                Invoke-SafeAction -Action { Restart-NuxtService }
            }
            '9' {
                Invoke-SafeAction -Action { Get-NuxtStatus }
            }
            '10' {
                Invoke-SafeAction -Action {
                    $lines = Read-Host '  Number of lines (default 50)'
                    if (-not ($lines -match '^\d+$')) { $lines = 50 }
                    Show-NuxtLogs -Lines [int]$lines
                }
            }

            '11' {
                Invoke-SafeAction -Action { Test-And-ReloadNginx }
            }
            '12' {
                Invoke-SafeAction -Action {
                    $lines = Read-Host '  Number of lines (default 50)'
                    if (-not ($lines -match '^\d+$')) { $lines = 50 }
                    Show-NginxLogs -Lines [int]$lines
                }
            }

            default {
                Write-DeployWarn 'Invalid option. Try again.'
                Start-Sleep -Seconds 1
            }
        }
    }
}

Show-MainMenu
