const express = require('express');
const multer = require('multer');

// Test if all required packages are installed
async function testDependencies() {
  console.log('🧪 Testing backend dependencies...');

  try {
    // Test basic packages
    console.log('✅ Express:', require('express').version);
    console.log('✅ Multer:', require('multer').version);
    
    // Test image processing
    const sharp = require('sharp');
    console.log('✅ Sharp:', sharp.version || 'installed');
    
    // Test OCR
    const Tesseract = require('tesseract.js');
    console.log('✅ Tesseract.js:', Tesseract.version || 'installed');
    
    // Test crypto
    const crypto = require('crypto');
    console.log('✅ Crypto: built-in');
    
    // Test file system
    const fs = require('fs').promises;
    console.log('✅ File system: built-in');
    
    console.log('\n🎉 All dependencies are available!');
    console.log('\n📋 New verification system components:');
    console.log('   • VerificationService - OCR, face matching, liveness detection');
    console.log('   • VerificationController - API endpoints for session management');
    console.log('   • Verification Routes - /api/verification endpoints');
    console.log('   • VerificationV2 (frontend) - QR-based desktop interface');
    console.log('   • MobileVerification (frontend) - Mobile capture interface');
    
  } catch (error) {
    console.error('❌ Dependency test failed:', error.message);
    console.log('\n📦 To install missing dependencies, run:');
    console.log('   npm install tesseract.js sharp');
  }
}

testDependencies();