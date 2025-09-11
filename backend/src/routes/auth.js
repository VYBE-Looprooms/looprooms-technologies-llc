const express = require('express');
const AuthController = require('../controllers/authController');
const { authenticateToken, authRateLimit } = require('../middleware/auth');
const { validate, sanitize, schemas } = require('../middleware/validation');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user account
 * @access  Public
 */
router.post('/register', 
  authRateLimit,
  sanitize,
  validate(schemas.register),
  AuthController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login with email and password
 * @access  Public
 */
router.post('/login',
  authRateLimit,
  sanitize,
  validate(schemas.login),
  AuthController.login
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me',
  authenticateToken,
  AuthController.getMe
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile',
  authenticateToken,
  sanitize,
  validate(schemas.updateProfile),
  AuthController.updateProfile
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password',
  authRateLimit,
  sanitize,
  validate(schemas.forgotPassword),
  AuthController.forgotPassword
);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify user email address
 * @access  Private
 */
router.post('/verify-email',
  authenticateToken,
  AuthController.verifyEmail
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (invalidate token client-side)
 * @access  Private
 */
router.post('/logout',
  authenticateToken,
  AuthController.logout
);

/**
 * @route   GET /api/auth/health
 * @desc    Auth service health check
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Authentication service is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      me: 'GET /api/auth/me',
      profile: 'PUT /api/auth/profile',
      forgotPassword: 'POST /api/auth/forgot-password',
      verifyEmail: 'POST /api/auth/verify-email',
      logout: 'POST /api/auth/logout'
    }
  });
});

module.exports = router;
