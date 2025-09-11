#!/usr/bin/env node

/**
 * Backend Test Script
 * Tests the backend HTTPS server and camera-related endpoints
 */

const https = require('https');
const http = require('http');

// Disable SSL certificate verification for self-signed certificates
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const TEST_HTTPS_URL = 'https://192.168.3.10:3443';
const TEST_HTTP_URL = 'http://192.168.3.10:3001';

console.log('🧪 Testing VYBE Backend Servers...\n');

// Test function
async function testEndpoint(url, description) {
  return new Promise((resolve) => {
    const requestModule = url.startsWith('https') ? https : http;
    
    const req = requestModule.get(url, (res) => {
      console.log(`✅ ${description}: ${res.statusCode} ${res.statusMessage}`);
      resolve(true);
    });

    req.on('error', (err) => {
      console.log(`❌ ${description}: ${err.message}`);
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.log(`⏰ ${description}: Timeout`);
      req.destroy();
      resolve(false);
    });
  });
}

async function runTests() {
  console.log('Testing Backend Servers:');
  console.log('========================\n');

  // Test HTTPS server
  await testEndpoint(`${TEST_HTTPS_URL}/health`, 'HTTPS Health Check');
  await testEndpoint(`${TEST_HTTPS_URL}/`, 'HTTPS Root Endpoint');

  console.log('');

  // Test HTTP server
  await testEndpoint(`${TEST_HTTP_URL}/health`, 'HTTP Health Check');
  await testEndpoint(`${TEST_HTTP_URL}/`, 'HTTP Root Endpoint');

  console.log('\n📱 Camera-related endpoints (require authentication):');
  console.log('======================================================');
  
  // These will return 401 but should not return 404
  await testEndpoint(`${TEST_HTTPS_URL}/api/mobile-verification/create-test-session`, 'Create Test Session (HTTPS)');
  await testEndpoint(`${TEST_HTTP_URL}/api/mobile-verification/create-test-session`, 'Create Test Session (HTTP)');

  console.log('\n🌐 Frontend Access:');
  console.log('==================');
  console.log('Frontend (HTTPS): https://192.168.3.10:8080/');
  console.log('Frontend (HTTP):  http://192.168.3.10:8080/');
  
  console.log('\n💡 Tips:');
  console.log('========');
  console.log('1. If HTTPS endpoints fail, accept the certificate by visiting:');
  console.log('   https://192.168.3.10:3443/health');
  console.log('2. For camera issues, check browser permissions');
  console.log('3. Make sure both frontend (port 8080) and backend (ports 3001/3443) are running');
  console.log('4. If rate limited, wait 15 minutes or restart the backend');
}

runTests().catch(console.error);