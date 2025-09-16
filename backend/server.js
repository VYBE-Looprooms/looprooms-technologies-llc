const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const emailRoutes = require('./routes/email');
const webhookRoutes = require('./routes/webhook');
const authRoutes = require('./routes/auth');
const { connectDatabase } = require('./config/database');

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
app.use('/api/email', emailRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/webhook', webhookRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'VYBE LOOPROOMS Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to VYBE LOOPROOMS Backend API',
    endpoints: {
      health: '/health',
      email: {
        sendWelcome: 'POST /api/email/send-welcome',
        testConnection: 'GET /api/email/test-connection',
        health: 'GET /api/email/health',
      },
      webhook: {
        n8nProxy: 'POST /api/webhook/n8n-proxy',
        health: 'GET /api/webhook/health',
      },
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
      },
    },
    documentation: 'See README.md for detailed API documentation',
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
      'POST /api/email/send-welcome',
      'GET /api/email/test-connection',
      'GET /api/email/health',
      'POST /api/webhook/n8n-proxy',
      'GET /api/webhook/health',
      'POST /api/auth/register',
      'POST /api/auth/login',
    ],
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

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, '0.0.0.0', () => {
      console.log('[VYBE] Backend API started');
      console.log('[VYBE] Listening at http://localhost:' + PORT);
      console.log('[VYBE] Environment: ' + (process.env.NODE_ENV || 'development'));
      console.log('[VYBE] Email service user: ' + (process.env.GMAIL_USER || 'not-configured'));
      console.log('[VYBE] CORS origin: ' + (process.env.FRONTEND_URL || 'http://localhost:8080'));
      console.log('[VYBE] Available endpoints:');
      console.log('   GET  / - API documentation');
      console.log('   GET  /health - Health check');
      console.log('   POST /api/email/send-welcome - Send welcome email');
      console.log('   GET  /api/email/test-connection - Test email connection');
      console.log('   GET  /api/email/health - Email service health');
      console.log('   POST /api/webhook/n8n-proxy - Webhook proxy to n8n');
      console.log('   GET  /api/webhook/health - Webhook service health');
      console.log('   POST /api/auth/register - User registration');
      console.log('   POST /api/auth/login - User login');
    });
  } catch (error) {
    console.error('[VYBE] Failed to start server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
