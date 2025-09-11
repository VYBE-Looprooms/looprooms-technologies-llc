# VYBE Project Development Helper Script
# Usage: .\dev-helper.ps1 [command]

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "VYBE Development Helper" -ForegroundColor Cyan
    Write-Host "======================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Available commands:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Development:" -ForegroundColor Green
    Write-Host "  dev-start        - Start development server (full app mode)"
    Write-Host "  dev-waitlist     - Start development server (waitlist mode)"
    Write-Host "  dev-switch       - Switch to development branch"
    Write-Host ""
    Write-Host "Production:" -ForegroundColor Red
    Write-Host "  prod-switch      - Switch to production branch"
    Write-Host "  prod-deploy      - Deploy changes to production"
    Write-Host "  prod-preview     - Preview production build locally"
    Write-Host ""
    Write-Host "Git Workflow:" -ForegroundColor Blue
    Write-Host "  commit [msg]     - Quick commit with message"
    Write-Host "  push-dev         - Push to development branch"
    Write-Host "  push-prod        - Push to production branch"
    Write-Host "  merge-to-prod    - Merge development to production"
    Write-Host ""
    Write-Host "Testing:" -ForegroundColor Magenta
    Write-Host "  test-waitlist    - Test waitlist mode locally"
    Write-Host "  test-full        - Test full app mode locally"
    Write-Host "  build-all        - Build both modes"
    Write-Host ""
    Write-Host "Status:" -ForegroundColor White
    Write-Host "  status           - Show current branch and environment"
    Write-Host "  help             - Show this help message"
}

function Get-Status {
    Write-Host "Current Status:" -ForegroundColor Cyan
    Write-Host "===============" -ForegroundColor Cyan
    
    $branch = git rev-parse --abbrev-ref HEAD
    Write-Host "Current Branch: $branch" -ForegroundColor $(if ($branch -eq "main") { "Red" } else { "Green" })
    
    $envFile = if (Test-Path "frontend\.env.local") { "frontend\.env.local" } else { "Not found" }
    Write-Host "Environment File: $envFile" -ForegroundColor Yellow
    
    if (Test-Path "frontend\.env.local") {
        $waitlistEnabled = Select-String -Path "frontend\.env.local" -Pattern "VITE_ENABLE_WAITLIST"
        if ($waitlistEnabled) {
            Write-Host "Waitlist Mode: $($waitlistEnabled.Line)" -ForegroundColor Blue
        }
    }
    
    Write-Host ""
    Write-Host "Recommendations:" -ForegroundColor Yellow
    if ($branch -eq "main") {
        Write-Host "  - You're on PRODUCTION branch!" -ForegroundColor Red
        Write-Host "  - Use 'dev-switch' to go to development" -ForegroundColor Green
    } else {
        Write-Host "  - You're on DEVELOPMENT branch" -ForegroundColor Green
        Write-Host "  - Perfect for active development!" -ForegroundColor Green
    }
}

function Start-Development {
    Write-Host "Starting development server (full app mode)..." -ForegroundColor Green
    Set-Location "frontend"
    npm run dev
}

function Start-DevelopmentWaitlist {
    Write-Host "Starting development server (waitlist mode)..." -ForegroundColor Yellow
    Set-Location "frontend"
    npm run dev:waitlist
}

function Switch-ToDevelopment {
    Write-Host "Switching to development branch..." -ForegroundColor Green
    git checkout development
    Write-Host "Now on development branch - ready for active development!" -ForegroundColor Green
}

function Switch-ToProduction {
    Write-Host "Switching to production branch..." -ForegroundColor Red
    Write-Host "WARNING: This is the production branch!" -ForegroundColor Red
    git checkout main
}

function Deploy-ToProduction {
    Write-Host "Deploying to production..." -ForegroundColor Red
    Write-Host "This will update the live website!" -ForegroundColor Red
    $confirm = Read-Host "Are you sure? (y/N)"
    
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        git checkout main
        git merge development
        git push origin main
        Write-Host "Deployed to production!" -ForegroundColor Green
        git checkout development
    } else {
        Write-Host "Deployment cancelled." -ForegroundColor Yellow
    }
}

function Test-Waitlist {
    Write-Host "Building and previewing waitlist mode..." -ForegroundColor Yellow
    Set-Location "frontend"
    npm run build:waitlist
    npm run preview:waitlist
}

function Test-Full {
    Write-Host "Building and previewing full app mode..." -ForegroundColor Green
    Set-Location "frontend"
    npm run build:dev
    npm run preview
}

function Push-Development {
    $msg = if ($args[0]) { $args[0] } else { "Development updates" }
    Write-Host "Committing and pushing to development..." -ForegroundColor Green
    git add .
    git commit -m $msg
    git push origin development
}

function Push-Production {
    Write-Host "Pushing to production..." -ForegroundColor Red
    Write-Host "WARNING: This will trigger a live deployment!" -ForegroundColor Red
    git push origin main
}

function Build-All {
    Write-Host "Building all modes..." -ForegroundColor Cyan
    Set-Location "frontend"
    Write-Host "Building development mode..." -ForegroundColor Green
    npm run build:dev
    Write-Host "Building production mode..." -ForegroundColor Red
    npm run build:waitlist
    Write-Host "All builds complete!" -ForegroundColor Green
}

# Main command processing
switch ($Command.ToLower()) {
    "help" { Show-Help }
    "status" { Get-Status }
    "dev-start" { Start-Development }
    "dev-waitlist" { Start-DevelopmentWaitlist }
    "dev-switch" { Switch-ToDevelopment }
    "prod-switch" { Switch-ToProduction }
    "prod-deploy" { Deploy-ToProduction }
    "prod-preview" { Test-Waitlist }
    "commit" { 
        $msg = if ($args[0]) { $args[0] } else { Read-Host "Commit message" }
        Push-Development $msg
    }
    "push-dev" { Push-Development }
    "push-prod" { Push-Production }
    "merge-to-prod" { Deploy-ToProduction }
    "test-waitlist" { Test-Waitlist }
    "test-full" { Test-Full }
    "build-all" { Build-All }
    default { 
        Write-Host "Unknown command: $Command" -ForegroundColor Red
        Write-Host "Use 'help' to see available commands." -ForegroundColor Yellow
    }
}
