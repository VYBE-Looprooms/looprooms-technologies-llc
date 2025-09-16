const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { pki } = require('node-forge');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const emailRoutes = require('./routes/email');
const webhookRoutes = require('./routes/webhook');
const authRoutes = require('./src/routes/auth');
const verificationRoutes = require('./src/routes/verification');
// const adminRoutes = require('./src/routes/admin'); // Disabled for now
const looproomRoutes = require('./src/routes/looprooms');
const liveSessionRoutes = require('./src/routes/liveSessions');

// Import WebSocket service
const websocketService = require('./src/services/websocketService');

const app = express();
const HTTP_PORT = process.env.PORT || 3001;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// Generate self-signed certificate using node-forge
function generateSelfSignedCert() {
  console.log('🔐 Generating self-signed certificate...');
  
  // Generate key pair
  const keys = pki.rsa.generateKeyPair(2048);
  
  // Create certificate
  const cert = pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
  
  const attrs = [
    { name: 'countryName', value: 'US' },
    { name: 'stateOrProvinceName', value: 'California' },
    { name: 'localityName', value: 'San Francisco' },
    { name: 'organizationName', value: 'VYBE LOOPROOMS DEV' },
    { name: 'commonName', value: '192.168.3.10' }
  ];
  
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  
  // Add extensions
  cert.setExtensions([
    { name: 'basicConstraints', cA: true },
    { name: 'keyUsage', keyCertSign: true, digitalSignature: true, nonRepudiation: true, keyEncipherment: true, dataEncipherment: true },
    { name: 'subjectAltName', altNames: [
      { type: 2, value: 'localhost' },
      { type: 2, value: '192.168.3.10' },
      { type: 7, ip: '127.0.0.1' },
      { type: 7, ip: '192.168.3.10' }
    ]}
  ]);
  
  // Self-sign certificate
  cert.sign(keys.privateKey);
  
  // Convert to PEM format
  const certPem = pki.certificateToPem(cert);
  const keyPem = pki.privateKeyToPem(keys.privateKey);
  
  console.log('✅ Self-signed certificate generated successfully');
  
  return { cert: certPem, key: keyPem };
}

// Try to load existing certificates first, then generate if needed
let httpsOptions;

try {
  // First, try to load existing certificates
  const certPath = path.join(__dirname, 'ssl', 'certificate.pem');
  const keyPath = path.join(__dirname, 'ssl', 'private-key.pem');
  
  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    console.log('🔐 Loading existing SSL certificates...');
    httpsOptions = {
      cert: fs.readFileSync(certPath, 'utf8'),
      key: fs.readFileSync(keyPath, 'utf8')
    };
    console.log('✅ Existing SSL certificates loaded successfully');
  } else {
    console.log('🔐 Generating new self-signed certificate...');
    httpsOptions = generateSelfSignedCert();
  }
} catch (err) {
  console.log('⚠️  Error loading certificates, generating new ones...', err.message);
  try {
    httpsOptions = generateSelfSignedCert();
  } catch (generateErr) {
    console.log('❌ Could not generate certificate:', generateErr.message);
    httpsOptions = null;
  }
}

// Security middleware - relaxed for development
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true); // Allow all origins for development
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 2000, // Increased from 200 to 2000 (10x)
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    origin: req.get('Origin'),
    secure: req.secure
  });
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/verification', verificationRoutes);
// app.use('/api/admin', adminRoutes); // Disabled for now
app.use('/api/looprooms', looproomRoutes);
app.use('/api/sessions', liveSessionRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/webhook', webhookRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'VYBE LOOPROOMS™ Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    secure: req.secure,
    protocol: req.protocol,
    port: req.secure ? HTTPS_PORT : HTTP_PORT
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to VYBE LOOPROOMS™ Backend API',
    secure: req.secure,
    protocol: req.protocol,
    httpsAvailable: !!httpsOptions,
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      verification: {
        createSession: 'POST /api/verification/create-session',
        getStatus: 'GET /api/verification/status/:sessionId',
        submit: 'POST /api/verification/submit'
      }
    },
    documentation: 'Camera access requires HTTPS - use this HTTPS endpoint on mobile devices'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    secure: req.secure,
    protocol: req.protocol
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Global error handler:', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    secure: req.secure
  });

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start HTTP server
const httpServer = http.createServer(app);
httpServer.listen(HTTP_PORT, '0.0.0.0', () => {
  console.log('🌐 VYBE LOOPROOMS™ HTTP Backend API Started');
  console.log(`📡 HTTP Server running on http://localhost:${HTTP_PORT}`);
  console.log(`📡 Also accessible via http://192.168.3.10:${HTTP_PORT}`);
});

// Initialize WebSocket on HTTP server
websocketService.initialize(httpServer);

// Start HTTPS server if certificate is available
if (httpsOptions) {
  const httpsServer = https.createServer(httpsOptions, app);

  httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
    console.log('🔒 VYBE LOOPROOMS™ HTTPS Backend API Started');
    console.log(`📡 HTTPS Server running on https://localhost:${HTTPS_PORT}`);
    console.log(`📡 Also accessible via https://192.168.3.10:${HTTPS_PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('🔐 Using dynamically generated self-signed certificate');
    console.log('');
    console.log('🔗 Test URLs:');
    console.log(`   HTTP:  http://192.168.3.10:${HTTP_PORT}/health`);
    console.log(`   HTTPS: https://192.168.3.10:${HTTPS_PORT}/health`);
    console.log(`   WebSocket: ws://192.168.3.10:${HTTP_PORT}/ws`);
    console.log('');
    console.log('⚠️  Browser Security Warning:');
    console.log('   Browsers will show "Your connection is not private" warning');
    console.log('   Click "Advanced" → "Proceed to 192.168.3.10 (unsafe)" to continue');
    console.log('');
    console.log('📱 Mobile Camera Access:');
    console.log('   Use HTTPS URL for camera access on mobile devices');
    console.log(`   Frontend should point to: https://192.168.3.10:${HTTPS_PORT}`);
    console.log('✨ Ready to process secure requests!');
  });

  // Also initialize WebSocket on HTTPS server
  websocketService.initialize(httpsServer);

  // Email service info
  console.log('✅ Email service is ready to send messages');
  
  httpsServer.on('error', (err) => {
    console.error('❌ HTTPS Server error:', err.message);
    console.log('🔄 Continuing with HTTP only...');
  });
} else {
  console.log('⚠️  HTTPS server not available (certificate generation failed)');
  console.log('🌐 HTTP server running for basic API access');
  console.log('📱 Camera access will not work without HTTPS');
}

module.exports = app;
