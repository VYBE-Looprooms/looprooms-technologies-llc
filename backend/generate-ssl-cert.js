const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const certDir = path.join(__dirname, 'ssl');
const keyPath = path.join(certDir, 'private-key.pem');
const certPath = path.join(certDir, 'certificate.pem');

// Create ssl directory if it doesn't exist
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir, { recursive: true });
}

console.log('🔐 Generating self-signed SSL certificate...');

try {
  // Generate private key
  console.log('📝 Generating private key...');
  execSync(`openssl genrsa -out "${keyPath}" 2048`, { stdio: 'inherit' });

  // Generate certificate
  console.log('📜 Generating certificate...');
  const certCommand = `openssl req -new -x509 -key "${keyPath}" -out "${certPath}" -days 365 -subj "/C=US/ST=California/L=San Francisco/O=VYBE LOOPROOMS/OU=Development/CN=192.168.3.10" -addext "subjectAltName=DNS:localhost,DNS:192.168.3.10,IP:127.0.0.1,IP:192.168.3.10"`;
  
  execSync(certCommand, { stdio: 'inherit' });

  console.log('✅ SSL certificate generated successfully!');
  console.log(`📁 Private key: ${keyPath}`);
  console.log(`📁 Certificate: ${certPath}`);
  console.log('');
  console.log('🔒 Certificate details:');
  console.log('   - Valid for 365 days');
  console.log('   - Common Name: 192.168.3.10');
  console.log('   - Subject Alternative Names: localhost, 192.168.3.10, 127.0.0.1');
  console.log('');
  console.log('⚠️  Note: This is a self-signed certificate. Browsers will show a security warning.');
  console.log('   To proceed, click "Advanced" and "Proceed to 192.168.3.10 (unsafe)"');

} catch (error) {
  console.error('❌ Error generating SSL certificate:', error.message);
  console.log('');
  console.log('💡 Troubleshooting:');
  console.log('   1. Make sure OpenSSL is installed on your system');
  console.log('   2. On Windows, you can install OpenSSL from: https://slproweb.com/products/Win32OpenSSL.html');
  console.log('   3. Or use Git Bash which includes OpenSSL');
  console.log('   4. Alternatively, use Windows Subsystem for Linux (WSL)');
  process.exit(1);
}
