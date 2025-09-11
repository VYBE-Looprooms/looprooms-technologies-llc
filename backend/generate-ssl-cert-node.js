const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const forge = require('node-forge');

const sslDir = path.join(__dirname, 'ssl');
const keyPath = path.join(sslDir, 'private-key.pem');
const certPath = path.join(sslDir, 'certificate.pem');

// Create ssl directory if it doesn't exist
if (!fs.existsSync(sslDir)) {
  fs.mkdirSync(sslDir, { recursive: true });
  console.log('📁 Created SSL directory:', sslDir);
}

console.log('🔐 Generating self-signed SSL certificate using node-forge...');

try {
  // Generate a key pair
  console.log('🔑 Generating RSA key pair...');
  const keys = forge.pki.rsa.generateKeyPair(2048);

  // Create a certificate
  console.log('📜 Creating certificate...');
  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

  const attrs = [{
    name: 'commonName',
    value: '192.168.3.10'
  }, {
    name: 'countryName',
    value: 'US'
  }, {
    shortName: 'ST',
    value: 'California'
  }, {
    name: 'localityName',
    value: 'San Francisco'
  }, {
    name: 'organizationName',
    value: 'VYBE LOOPROOMS'
  }, {
    shortName: 'OU',
    value: 'Development'
  }];

  cert.setSubject(attrs);
  cert.setIssuer(attrs);

  // Add extensions
  cert.setExtensions([{
    name: 'basicConstraints',
    cA: true
  }, {
    name: 'keyUsage',
    keyCertSign: true,
    digitalSignature: true,
    nonRepudiation: true,
    keyEncipherment: true,
    dataEncipherment: true
  }, {
    name: 'extKeyUsage',
    serverAuth: true,
    clientAuth: true,
    codeSigning: true,
    emailProtection: true,
    timeStamping: true
  }, {
    name: 'nsCertType',
    client: true,
    server: true,
    email: true,
    objsign: true,
    sslCA: true,
    emailCA: true,
    objCA: true
  }, {
    name: 'subjectAltName',
    altNames: [{
      type: 7, // IP
      ip: '192.168.3.10'
    }, {
      type: 2, // DNS
      value: 'localhost'
    }]
  }]);

  // Self-sign certificate
  cert.sign(keys.privateKey);

  // Convert to PEM format
  const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);
  const certificatePem = forge.pki.certificateToPem(cert);

  // Save private key
  fs.writeFileSync(keyPath, privateKeyPem);
  console.log('✅ Private key saved to:', keyPath);

  // Save certificate
  fs.writeFileSync(certPath, certificatePem);
  console.log('✅ Certificate saved to:', certPath);

  console.log('');
  console.log('✅ SSL certificate files generated successfully!');
  console.log('📁 Private Key:', keyPath);
  console.log('📁 Certificate:', certPath);
  console.log('');
  console.log('🔒 Certificate details:');
  console.log('   - Self-signed for development use');
  console.log('   - Valid for HTTPS server with Node.js');
  console.log('   - Browsers will show security warning');
  console.log('');
  console.log('⚠️  Note: This is a development certificate');
  console.log('   - Browsers will show "Your connection is not private"');
  console.log('   - Click "Advanced" → "Proceed to 192.168.3.10 (unsafe)"');
  console.log('');
  console.log('🚀 You can now start the HTTPS server with:');
  console.log('   node server-https.js');

} catch (error) {
  console.error('❌ Error generating SSL certificate:', error.message);
  console.log('');
  console.log('💡 Troubleshooting:');
  console.log('   1. Make sure node-forge is installed: npm install node-forge');
  console.log('   2. Check file permissions in the ssl directory');
  console.log('   3. Try running as administrator if needed');
  process.exit(1);
}
