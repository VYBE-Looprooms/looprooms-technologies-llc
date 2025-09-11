# VYBE Development Server Starter
# This script starts both frontend and backend servers for development

Write-Host "🚀 Starting VYBE Development Servers..." -ForegroundColor Green
Write-Host ""

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = Test-NetConnection -ComputerName "localhost" -Port $Port -WarningAction SilentlyContinue
        return $connection.TcpTestSucceeded
    } catch {
        return $false
    }
}

# Function to start a process in a new window
function Start-ProcessInNewWindow {
    param(
        [string]$FilePath,
        [string]$ArgumentList,
        [string]$WorkingDirectory,
        [string]$WindowTitle
    )
    
    Start-Process -FilePath $FilePath -ArgumentList $ArgumentList -WorkingDirectory $WorkingDirectory -WindowTitle $WindowTitle
}

# Check if ports are already in use
$frontendPort = 8080
$backendHttpPort = 3001
$backendHttpsPort = 3443

Write-Host "Checking port availability..." -ForegroundColor Yellow

if (Test-Port $frontendPort) {
    Write-Host "⚠️  Port $frontendPort is already in use (Frontend)" -ForegroundColor Yellow
} else {
    Write-Host "✅ Port $frontendPort is available (Frontend)" -ForegroundColor Green
}

if (Test-Port $backendHttpPort) {
    Write-Host "⚠️  Port $backendHttpPort is already in use (Backend HTTP)" -ForegroundColor Yellow
} else {
    Write-Host "✅ Port $backendHttpPort is available (Backend HTTP)" -ForegroundColor Green
}

if (Test-Port $backendHttpsPort) {
    Write-Host "⚠️  Port $backendHttpsPort is already in use (Backend HTTPS)" -ForegroundColor Yellow
} else {
    Write-Host "✅ Port $backendHttpsPort is available (Backend HTTPS)" -ForegroundColor Green
}

Write-Host ""

# Start Backend HTTPS Server
Write-Host "🔒 Starting Backend HTTPS Server (Port $backendHttpsPort)..." -ForegroundColor Cyan
Start-ProcessInNewWindow -FilePath "node" -ArgumentList "server-https.js" -WorkingDirectory ".\backend" -WindowTitle "VYBE Backend HTTPS"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "🌐 Starting Frontend Server (Port $frontendPort)..." -ForegroundColor Cyan
Start-ProcessInNewWindow -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory ".\frontend" -WindowTitle "VYBE Frontend"

# Wait a moment for frontend to start
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "🎉 Servers starting up..." -ForegroundColor Green
Write-Host ""
Write-Host "📱 Frontend URLs:" -ForegroundColor White
Write-Host "   HTTPS: https://192.168.3.10:8080/" -ForegroundColor Green
Write-Host "   HTTP:  http://192.168.3.10:8080/" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔧 Backend URLs:" -ForegroundColor White
Write-Host "   HTTPS: https://192.168.3.10:3443/" -ForegroundColor Green
Write-Host "   HTTP:  http://192.168.3.10:3001/" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔍 Health Checks:" -ForegroundColor White
Write-Host "   Backend HTTPS: https://192.168.3.10:3443/health" -ForegroundColor Green
Write-Host "   Backend HTTP:  http://192.168.3.10:3001/health" -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "   - If using HTTPS frontend, accept the backend certificate first"
Write-Host "   - Visit backend health check URLs to accept certificates"
Write-Host "   - Check camera permissions in browser settings"
Write-Host "   - Press Ctrl+C in each terminal window to stop servers"
Write-Host ""

# Optional: Run backend test
$testBackend = Read-Host "Run backend connectivity test? (y/n)"
if ($testBackend -eq "y" -or $testBackend -eq "Y") {
    Write-Host ""
    Write-Host "🧪 Running backend test..." -ForegroundColor Cyan
    node test-backend.js
}

Write-Host ""
Write-Host "✨ Development environment ready!" -ForegroundColor Green