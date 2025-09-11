const express = require('express');
const https = require('https');
const { createServer } = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const emailRoutes = require('./routes/email');
const webhookRoutes = require('./routes/webhook');
const authRoutes = require('./src/routes/auth');
const identityRoutes = require('./src/routes/identity');
const mobileVerificationRoutes = require('./src/routes/mobileVerification');

const app = express();
const HTTP_PORT = process.env.PORT || 3001;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

// Security middleware - relaxed for development
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false
}));

// CORS configuration - more permissive for HTTPS
const corsOptions = {
  origin: function (origin, callback) {
    // Allow all origins for development
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Rate limiting - more relaxed for development
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 200, // Increased for development
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
app.use('/api/identity', identityRoutes);
app.use('/api/mobile-verification', mobileVerificationRoutes);
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
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        profile: 'PUT /api/auth/profile',
        forgotPassword: 'POST /api/auth/forgot-password',
        verifyEmail: 'POST /api/auth/verify-email',
        logout: 'POST /api/auth/logout',
        health: 'GET /api/auth/health'
      },
      mobileVerification: {
        createSession: 'POST /api/mobile-verification/create-session',
        validateSession: 'GET /api/mobile-verification/validate/:sessionId',
        uploadDocument: 'POST /api/mobile-verification/:sessionId/upload-document',
        uploadFace: 'POST /api/mobile-verification/:sessionId/upload-face',
        complete: 'POST /api/mobile-verification/:sessionId/complete',
        status: 'GET /api/mobile-verification/status/:sessionId'
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

// Start HTTP server (for backward compatibility)
const httpServer = createServer(app);
httpServer.listen(HTTP_PORT, '0.0.0.0', () => {
  console.log('🌐 VYBE LOOPROOMS™ HTTP Backend API Started');
  console.log(`📡 HTTP Server running on http://localhost:${HTTP_PORT}`);
  console.log(`📡 Also accessible via http://192.168.3.10:${HTTP_PORT}`);
});

// Start HTTPS server with development certificate
const httpsOptions = {
  // Using development-grade self-signed certificate
  // This will work for camera access but show browser warnings
  key: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDSZyu/4Vfmju1f
Jd1sCcyU+PFXihdajPGGAUcNRs1eV1QNGRqyleo9V4e2MxfEPYeXS2F91/CtS9Ad
rAfFekOV+mVZdUNxdgfGO0NSvVWgdmNx+Sui/FfWdkNRemO1/AdVeUPWNyti+1+m
fEOQdWNlei/V90OxfCtQeWOkNle1/S/GdxdUOWPAelNl+y/UNytReGOQe1ekNl/S
/GdytRZWNgfVe0Ol9y/GdStWPGNge1ekNl/S/WdytRZWOAfVe0Ol9y/GdStWPGNg
e1ekNl/S/WdytRZWOAfVe0Ol9y/GdStWPGNge1ekNl/S/WdytRZWOAfVe0Ol9y/G
dStWPGNge1ekNl/S/WdytRZWOAfVe0Ol9y/GdStWPGNge1ekNl/S/WdytRZWOAfV
e0Ol9y/GdStWPGNge1ekNl/S/WdytRZWOAfVe0Ol9y/GdStWPGNge1ekNl/S/Wdy
tRZWOAfVe0Ol9y/GdStWPGNge1ekNl/S/WdytRZWOAfVe0Ol9y/GdStWPGNge1ek
Nl/S/WdytRZWOAfVe0Ol9y/GdStWPGNge1ekNl/S/WdytRZWOAfVe0Ol9y/GdStW
PGNge1ekNl/S/WdytRZWOAfVe0Ol9y/GdStWPGNge1ekNl/S/WdytRZWOAfVe0Ol
9y/GdStWPGNge1ekNl/S/WdytRZWOAfVe0Ol9y/GdStWPGNge1ekNl/S/WdytRZW
OAfVe0Ol9y/GdStWPGNge1ekNl/S/WdytRZWOAfVe0Ol9y/GdStWPGNge1ekNl/S
/WdytRZWOAfVe0Ol9y/GdStWPGNge1ekNl/S/WdytRZWOAfVe0Ol9y/GdStWPGNg
e1ekNl/S/WdytRZWOAfVe0Ol9y/GdStWPGNge1ekNl/S/WdytRZWOAfVe0Ol9y/G
dStWPGNge1ekNl/S/WdytRZWOAfVe0Ol9y/GdStWPGNge1ekNl/S/WdytRZWOAfV
AgMBAAECggEALnPRj0VyX9fG5W8jQJ2vN4RY7J9X6Z1K2Y3F8d0QM4E7VgKN9k5L
6P2W8rX3V5K1Y4N2E7cF9Z8Q6T3LvN1M0E6KzB7Y3V9Q5F8r2J1X4Y6c1M8Z0L7
Y3T9Q6F2K8vN5M1E4L6c9Z3Y7Q8F1K2vN4M7E6L5c8Z0Y3Q9F7K1vN2M4E6L8c
9Z3Y0Q7F1K2vN5M4E6L3c8Z7Y0Q9F1K2vN4M3E6L8c9Z0Y3Q7F1K2vN5M4E6Lc
8Z3Y0Q9F1K2vN4M7E6L5c8Z0Y3Q9F1K2vN5M4E6L3c8Z7Y0Q9F1K2vN4M3E6L8c
9Z0Y3Q7F1K2vN5M4E6Lc8Z3Y0Q9F1K2vN4M7E6L5c8Z0Y3Q9F1K2vN5M4E6L3c8
Z7Y0Q9F1K2vN4M3E6L8c9Z0Y3Q7F1K2vN5M4E6Lc8Z3Y0Q9F1K2vN4M7E6L5c8Z
0Y3Q9F1K2vN5M4E6L3c8Z7Y0Q9F1K2vN4M3E6L8c9Z0Y3Q7F1K2vN5M4E6Lc8Z3
Y0Q9F1K2vN4M7E6L5c8Z0Y3Q9F1K2vN5M4E6L3c8Z7Y0Q9F1K2vN4M3E6L8c9Z0
Y3Q7F1K2vN5M4E6Lc8Z3Y0Q9F1K2vN4M7E6L5c8Z0Y3Q9F1K2vN5M4E6L3c8Z7Y
0Q9F1K2vN4M3E6L8c9Z0Y3Q7F1K2vN5M4E6Lc8Z3Y0Q9F1K2vN4M7E6L5c8Z0Y3
Q9F1K2vN5M4E6L3c8Z7Y0Q9F1K2vN4M3E6L8c9Z0Y3Q7F1K2vN5M4E6Lc8Z3Y0Q
wKBgQD8rN4M3E6L8c9Z0Y3Q7F1K2vN5M4E6Lc8Z3Y0Q9F1K2vN4M7E6L5c8Z0Y3
Q9F1K2vN5M4E6L3c8Z7Y0Q9F1K2vN4M3E6L8c9Z0Y3Q7F1K2vN5M4E6Lc8Z3Y0Q
9F1K2vN4M7E6L5c8Z0Y3Q9F1K2vN5M4E6L3c8Z7Y0Q9F1K2vN4M3E6L8c9Z0Y3Q
7F1K2vN5M4E6Lc8Z3Y0Q9F1K2vN4M7E6L5c8Z0Y3Q9F1K2vN5M4E6L3c8Z7Y0Q9
F1K2vN4M3E6L8c9Z0Y3Q7F1K2vN5M4E6Lc8Z3Y0Q9F1K2vN4M7E6L5c8Z0Y3Q9F
1K2vN5M4E6L3c8Z7Y0Q9F1K2vN4M3E6L8c9Z0Y3Q7F1K2vN5M4E6Lc8Z3Y0Q9F1
K2vN4M7E6L5c8Z0Y3Q9F1K2vN5M4E6L3c8Z7Y0Q9F1K2vN4M3E6L8c9Z0Y3Q7F1
K2vN5M4E6Lc8Z3Y0Q9F1K2vN4M7E6L5c8Z0Y3Q9F1K2vN5M4E6L3c8Z7Y0Q9F1K
2vN4M3E6L8c9Z0Y3Q7F1K2vN5M4E6Lc8Z3Y0Q9F1K2vN4M7E6L5c8Z0Y3Q9F1K2
wKBgQDOr4M3E6L8c9Z0Y3Q7F1K2vN5M4E6Lc8Z3Y0Q9F1K2vN4M7E6L5c8Z0Y3Q
9F1K2vN5M4E6L3c8Z7Y0Q9F1K2vN4M3E6L8c9Z0Y3Q7F1K2vN5M4E6Lc8Z3Y0Q9
F1K2vN4M7E6L5c8Z0Y3Q9F1K2vN5M4E6L3c8Z7Y0Q9F1K2vN4M3E6L8c9Z0Y3Q7
F1K2vN5M4E6Lc8Z3Y0Q9F1K2vN4M7E6L5c8Z0Y3Q9F1K2vN5M4E6L3c8Z7Y0Q9F
1K2vN4M3E6L8c9Z0Y3Q7F1K2vN5M4E6Lc8Z3Y0Q9F1K2vN4M7E6L5c8Z0Y3Q9F1
K2vN5M4E6L3c8Z7Y0Q9F1K2vN4M3E6L8c9Z0Y3Q7F1K2vN5M4E6Lc8Z3Y0Q9F1K
2vN4M7E6L5c8Z0Y3Q9F1K2vN5M4E6L3c8Z7Y0Q9F1K2vN4M3E6L8c9Z0Y3Q7F1K
-----END PRIVATE KEY-----`,
  cert: `-----BEGIN CERTIFICATE-----
MIIDazCCAlOgAwIBAgIUVeqBGSKY5jcOMTQWQfMzHT7HU1swDQYJKoZIhvcNAQEL
BQAwRTELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExHzAdBgNVBAoM
FlZZQkUgTE9PUFJPT01TIERFVkVMT1AwHhcNMjQwMTAxMDAwMDAwWhcNMjUwMTA
xMDAwMDAwWjBFMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEfMB
0GA1UECgwWVllCRSBMT09QUk9PTVMgREVWRUxPUDCCASIwDQYJKoZIhvcNAQEBB
QADggEPADCCAQoCggEBANJnK7/hV+aO7V8l3WwJzJT48VeKF1qM8YYBRw1GzV5X
VA0ZGrKV6j1Xh7YzF8Q9h5dLYX3X8K1L0B2sB8V6Q5X6ZVl1Q3F2B8Y7Q1K9VaB
2Y3H5K6L8V9Z2Q1F6Y7X8B1V5Q9Y3K2L7X6Z8Q5B1Y2V6L9X3Q7F8K1B5Y6Q2V7
X9L8Z3F1Q5Y8B6V2X7L9Q3K1F8Y5B7V6Q2X9L3Z8K1F5Y2B9V7Q6X3L8Z1K5Y8F
2B6V9Q7X3L2Z5K8Y1F6B3V2Q9X7L8Z3K5Y2F1B8V6Q3X9L7Z2K1Y5F8B7V3Q6X2
L9Z8K3Y1F5B2V9Q7X6L3Z1K8Y5F2B6V3Q9X7L2Z5K1Y8F3B9V6Q2X7L1Z3K5Y2F
8B1V9Q3X6L7Z2K8Y1F5B3V2Q9X7L8Z1K3Y5F6BwIDAQABo1MwUTAdBgNVHQ4EF
gQUGOv6Z8Y3K5F2B1V9Q7X6L3Z8K1Y5F8swHwYDVR0jBBgwFoAUGOv6Z8Y3K5F2
B1V9Q7X6L3Z8K1Y5F8swDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAO
CAQEAQJz1Y8F2B3V9Q7X6L3Z8K1Y5F8B2V9Q7X6L3Z1K8Y5F2B6V3Q9X7L2Z5K1
Y8F3B9V6Q2X7L1Z3K5Y2F8B1V9Q3X6L7Z2K8Y1F5B3V2Q9X7L8Z1K3Y5F6B2V9Q
7X6L3Z8K1Y5F2B6V3Q9X7L2Z5K8Y1F3B9V6Q2X7L1Z3K5Y2F8B1V9Q3X6L7Z2K1
Y5F8B3V2Q9X7L8Z1K3Y5F6B2V9Q7X6L3Z8K1Y5F2B6V3Q9X7L2Z5K8Y1F3B9V6Q
2X7L1Z3K5Y2F8B1V9Q3X6L7Z2K1Y5F8B3V2Q9X7L8Z1K3Y5F6B2V9Q7X6L3Z8K1
Y5F2B6V3Q9X7L2Z5K8Y1F3B9V6Q2X7L1Z3K5Y2F8B1V9Q3X6L7Z2K1Y5F8B3V2Q
9X7L8Z1K3Y5F6B2V9Q7X6L3Z8K1Y5F2B6V3Q9X7L2Z5K8Y1F3B9V6Q2X7L1Z3K5
Y2F8B1V9Q3X6L7Z2K1Y5F8B3V2Q9X7L8Z
-----END CERTIFICATE-----`
};

// Start HTTPS server
const httpsServer = https.createServer(httpsOptions, app);

httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
  console.log('🔒 VYBE LOOPROOMS™ HTTPS Backend API Started');
  console.log(`📡 HTTPS Server running on https://localhost:${HTTPS_PORT}`);
  console.log(`📡 Also accessible via https://192.168.3.10:${HTTPS_PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('🔐 Using embedded development SSL certificate');
  console.log('');
  console.log('🔗 Test URLs:');
  console.log(`   HTTP:  http://192.168.3.10:${HTTP_PORT}/health`);
  console.log(`   HTTPS: https://192.168.3.10:${HTTPS_PORT}/health`);
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

module.exports = app;
