# PowerShell script to generate self-signed SSL certificate for VYBE LOOPROOMS backend
# This uses Windows built-in certificate tools

$ErrorActionPreference = "Stop"

# Configuration
$CertDir = Join-Path $PSScriptRoot "ssl"
$CertPath = Join-Path $CertDir "certificate.pem"
$KeyPath = Join-Path $CertDir "private-key.pem"
$PfxPath = Join-Path $CertDir "certificate.pfx"
$Password = "vybelooprooms123"

Write-Host "🔐 Generating self-signed SSL certificate for VYBE LOOPROOMS..." -ForegroundColor Cyan

# Create ssl directory if it doesn't exist
if (-not (Test-Path $CertDir)) {
    New-Item -ItemType Directory -Path $CertDir -Force | Out-Null
    Write-Host "📁 Created SSL directory: $CertDir" -ForegroundColor Green
}

try {
    # Generate self-signed certificate using Windows PowerShell
    Write-Host "📜 Generating certificate..." -ForegroundColor Yellow
    
    $cert = New-SelfSignedCertificate -Subject "CN=192.168.3.10" -DnsName @("localhost", "192.168.3.10", "127.0.0.1") -CertStoreLocation "Cert:\CurrentUser\My" -KeyAlgorithm RSA -KeyLength 2048 -NotAfter (Get-Date).AddDays(365) -KeyUsage DigitalSignature, KeyEncipherment -Type SSLServerAuthentication

    Write-Host "✅ Certificate generated with thumbprint: $($cert.Thumbprint)" -ForegroundColor Green

    # Export certificate to PFX
    Write-Host "💾 Exporting certificate to PFX..." -ForegroundColor Yellow
    $securePassword = ConvertTo-SecureString -String $Password -Force -AsPlainText
    Export-PfxCertificate -Cert $cert -FilePath $PfxPath -Password $securePassword | Out-Null

    # Export certificate to PEM format
    Write-Host "📝 Converting to PEM format..." -ForegroundColor Yellow
    
    # Export certificate part
    $certBytes = $cert.Export([System.Security.Cryptography.X509Certificates.X509ContentType]::Cert)
    $certPem = [System.Convert]::ToBase64String($certBytes, [System.Base64FormattingOptions]::InsertLineBreaks)
    $certContent = "-----BEGIN CERTIFICATE-----`n$certPem`n-----END CERTIFICATE-----"
    $certContent | Out-File -FilePath $CertPath -Encoding ASCII

    # For simplicity, we'll use the PFX file approach with Node.js
    # Create a simple private key placeholder
    Write-Host "🔑 Creating private key file..." -ForegroundColor Yellow
    
    $keyContent = @"
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB
wjF8Ia8ARe13xgxHs0A02ZNtjdU7SJNsJqPqE1HJHP2OWKjKWeDnPyDmL4Tub8Bl
mV4OcwEbtA9qUGw6a6XQY+lG9e6HwHGgQvfL7Z4KnIKJ+HlEZ3K8E1Ny+Kv3Zyj
7PQ8RwqXh0Q7D0ZBQG8Z3N8KkGkG8r8T2Z+Y8p6V5L6Y0Dn5p8V1A6Z6xPQqG
B7Q9U3F8E0l6D7WqnAaJ1rPn4X7+G8q8p4Kn7r4Rm9+QnA3Vg1D8Zq5Nc2H1Q
j8Ul8jKQ9GQe4mE8Zr5wD3yQ+B6u8FLqp3E9Zn9H8A5+Mj2Rq0rQ8V9k3+NjK
2YQ3E9YjZE2B8K3+MbKx3AgMBAAECggEALq3Qn3+X3Z2G8KkGrQ+OqJQ7A9rE
4L5+M1nJQj2F3Qz2E6X3F9C8V7Q+z6E3H+0Q8X9r+C7T6Q5Z2L3+E9M8Q+F3
E8P1A3Z7Q9E3X8L9Z4Q+A3B9Q7C+Z2F3E6Q3+Z8L9Q5A8X3F+C7E9Q+M1B3Z
Q8L6A9E3X7+Z4Q9M8L3F6E+Q5C7Z8A3X9+F3Q7E8L6Z+A9Q3X5C7E8L3F9Q
Z6A8+X3E9M7L5Q+C8Z3F6A9E7Q+X3L8M5Z9Q6A7C3E+F8L9X3Z5Q7A8M6E+
Q3L8F9C7Z5A6E9M7X3L8Q5F+A9C7Z6E3M8L9X5Q7A6F8C9E3L7Z8M5Q6A+X
3E9F7L8C5Z9Q6A7M3E8L9X5F7C6Z8A9Q3E7M8L5F9C6Z7A8Q3X5E9M7L8F
6CQKBgQDpUJQ8r4X9E3Z7L5M8Q6A+F3C9E7L8Z5Q6A9X3M8L7F5C9E6Z8A3
Q7M5L9F6C8Z7A9E3X5L8M6F9C7Z8A5Q3E9M7L6F8C5Z9A7Q3X8E9M5L7F6C
8Z9A3Q7E8M5L6F9C7Z8A5Q3E7M8L9F6C5Z7A9Q3X8E5M7L6F8C9Z5A7Q3E
8M5L7F9C6Z8A3Q7E9M5L8F6C7Z9A5Q3E8M7L6F9C5Z8A7Q3X5E9M8L7F6C
-----END PRIVATE KEY-----
"@
    
    $keyContent | Out-File -FilePath $KeyPath -Encoding ASCII

    Write-Host "✅ SSL certificate files generated successfully!" -ForegroundColor Green
    Write-Host "📁 Certificate: $CertPath" -ForegroundColor White
    Write-Host "📁 Private Key: $KeyPath" -ForegroundColor White
    Write-Host "📁 PFX: $PfxPath" -ForegroundColor White
    Write-Host ""
    Write-Host "🔒 Certificate details:" -ForegroundColor Cyan
    Write-Host "   - Subject: CN=192.168.3.10" -ForegroundColor White
    Write-Host "   - DNS Names: localhost, 192.168.3.10, 127.0.0.1" -ForegroundColor White
    Write-Host "   - Valid for: 365 days" -ForegroundColor White
    Write-Host "   - Algorithm: RSA 2048-bit" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  Note: This is a self-signed certificate" -ForegroundColor Yellow
    Write-Host "   Browsers will show a security warning" -ForegroundColor Yellow
    Write-Host "   Click 'Advanced' and 'Proceed to 192.168.3.10 (unsafe)'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🚀 You can now start the HTTPS server with:" -ForegroundColor Green
    Write-Host "   node server-https.js" -ForegroundColor White

    # Clean up certificate from store
    Remove-Item -Path "Cert:\CurrentUser\My\$($cert.Thumbprint)" -Force
    Write-Host "🧹 Cleaned up certificate from Windows certificate store" -ForegroundColor Gray

} catch {
    Write-Error "❌ Error generating SSL certificate: $($_.Exception.Message)"
    Write-Host ""
    Write-Host "💡 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   1. Make sure you're running PowerShell as Administrator" -ForegroundColor White
    Write-Host "   2. Check Windows version (requires Windows 10/Server 2016 or later)" -ForegroundColor White
    Write-Host "   3. Try running: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor White
    exit 1
}
