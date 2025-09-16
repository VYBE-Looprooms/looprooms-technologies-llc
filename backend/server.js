const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
require('dotenv').config();

const emailRoutes = require('./routes/email');
const webhookRoutes = require('./routes/webhook');
const authRoutes = require('./routes/auth');
const looproomRoutes = require('./routes/looprooms');
const moodRoutes = require('./routes/moods');
const engagementRoutes = require('./routes/engagement');
const { initializeSockets } = require('./realtime/socket');
const { connectDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// CORS configuration
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
  'http://localhost:3001',
];

if (process.env.ALLOWED_ORIGINS) {
  const extraOrigins = process.env.ALLOWED_ORIGINS.split(',').map((item) => item.trim());
  allowedOrigins.push(...extraOrigins);
}

const checkOrigin = (origin, callback) => {
  if (!origin) return callback(null, true);

  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  console.log('[VYBE] CORS blocked origin:', origin);
  return callback(new Error('Not allowed by CORS'));
};

const corsOptions = {
  origin: checkOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes',
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
  });
  next();
});

// Routes
app.use('/api/email', emailRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/looprooms', looproomRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/engagement', engagementRoutes);
app.use('/api/webhook', webhookRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'VYBE LOOPROOMS Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
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
        refresh: 'POST /api/auth/refresh',
      },
      looprooms: {
        list: 'GET /api/looprooms',
        categories: 'GET /api/looprooms/categories',
        detail: 'GET /api/looprooms/:slug',
      },
      mood: {
        recommend: 'POST /api/moods/recommend',
      },
      engagement: {
        reactionPresets: 'GET /api/engagement/reactions',
        motivationalMessages: 'GET /api/engagement/motivations',
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
      'POST /api/auth/refresh',
      'GET /api/looprooms',
      'GET /api/looprooms/categories',
      'GET /api/looprooms/:slug',
      'POST /api/moods/recommend',
      'GET /api/engagement/reactions',
      'GET /api/engagement/motivations',
    ],
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('[VYBE] Global error handler:', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  if (error.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      error: 'Origin not allowed',
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  });
});

const startServer = async () => {
  try {
    await connectDatabase();

    const server = http.createServer(app);
    const io = initializeSockets(server, { checkOrigin });

    server.listen(PORT, '0.0.0.0', () => {
      console.log('[VYBE] Backend API started');
      console.log(`[VYBE] Listening at http://localhost:${PORT}`);
      console.log(`[VYBE] Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`[VYBE] Email service user: ${process.env.GMAIL_USER || 'not-configured'}`);
      console.log(`[VYBE] CORS origin: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
      console.log('[VYBE] Available endpoints:');
      console.log('   GET  / - API documentation');
      console.log('   GET  /health - Health check');
      console.log('   POST /api/email/send-welcome');
      console.log('   GET  /api/email/test-connection');
      console.log('   GET  /api/email/health');
      console.log('   POST /api/auth/register');
      console.log('   POST /api/auth/login');
      console.log('   POST /api/auth/refresh');
      console.log('   GET  /api/looprooms');
      console.log('   GET  /api/looprooms/categories');
      console.log('   GET  /api/looprooms/:slug');
      console.log('   POST /api/moods/recommend');
      console.log('   GET  /api/engagement/reactions');
      console.log('   GET  /api/engagement/motivations');
      console.log('   POST /api/webhook/n8n-proxy');
      console.log('   GET  /api/webhook/health');
      console.log('   WebSocket namespace: /socket.io');
    });

    return { server, io };
  } catch (error) {
    console.error('[VYBE] Failed to start server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
module.exports.startServer = startServer;





