const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const emailRoutes = require('./routes/email');
const webhookRoutes = require('./routes/webhook');
const authRoutes = require('./src/routes/auth');
const identityRoutes = require('./src/routes/identity');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:8080',
      'https://feelyourvybe.com',
      'https://www.feelyourvybe.com',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8080',
      `http://${process.env.BACKEND_IP || '192.168.3.10'}:3001`,
      `http://${process.env.BACKEND_IP || '192.168.3.10'}:3003`,
      `http://${process.env.BACKEND_IP || '192.168.3.10'}:5678`,
      'http://127.0.0.1:3001',
      'http://localhost:3001'
    ];

    // Add additional origins from environment variable
    if (process.env.ALLOWED_ORIGINS) {
      const extraOrigins = process.env.ALLOWED_ORIGINS.split(',');
      allowedOrigins.push(...extraOrigins);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
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
    origin: req.get('Origin')
  });
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/identity', identityRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/webhook', webhookRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'VYBE LOOPROOMS™ Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to VYBE LOOPROOMS™ Backend API',
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
      email: {
        sendWelcome: 'POST /api/email/send-welcome',
        testConnection: 'GET /api/email/test-connection',
        health: 'GET /api/email/health'
      },
      webhook: {
        n8nProxy: 'POST /api/webhook/n8n-proxy',
        health: 'GET /api/webhook/health'
      }
    },
    documentation: 'See README.md for detailed API documentation'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'PUT /api/auth/profile',
      'POST /api/auth/forgot-password',
      'POST /api/auth/verify-email',
      'POST /api/auth/logout',
      'GET /api/auth/health',
      'POST /api/email/send-welcome',
      'GET /api/email/test-connection',
      'GET /api/email/health',
      'POST /api/webhook/n8n-proxy',
      'GET /api/webhook/health'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Global error handler:', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  if (error.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      error: 'Origin not allowed'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 VYBE LOOPROOMS™ Backend API Started');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`📡 Also accessible via http://127.0.0.1:${PORT}`);
  console.log(`📡 And via http://0.0.0.0:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📧 Email service: ${process.env.GMAIL_USER}`);
  console.log(`🔒 CORS allowed origins: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
  console.log('📋 Available endpoints:');
  console.log('   GET  / - API documentation');
  console.log('   GET  /health - Health check');
  console.log('   🔐 Authentication:');
  console.log('   POST /api/auth/register - Register new user');
  console.log('   POST /api/auth/login - User login');
  console.log('   GET  /api/auth/me - Get current user');
  console.log('   PUT  /api/auth/profile - Update profile');
  console.log('   POST /api/auth/forgot-password - Reset password');
  console.log('   POST /api/auth/verify-email - Verify email');
  console.log('   POST /api/auth/logout - User logout');
  console.log('   GET  /api/auth/health - Auth service health');
  console.log('   📧 Email:');
  console.log('   POST /api/email/send-welcome - Send welcome email');
  console.log('   GET  /api/email/test-connection - Test email connection');
  console.log('   GET  /api/email/health - Email service health');
  console.log('   🔗 Webhooks:');
  console.log('   POST /api/webhook/n8n-proxy - Webhook proxy to n8n');
  console.log('   GET  /api/webhook/health - Webhook service health');
  console.log('✨ Ready to process requests!');
});

module.exports = app;
