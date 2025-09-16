const jwt = require('jsonwebtoken');
const AuthService = require('../services/authService');

/**
 * Middleware to authenticate JWT tokens
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
        code: 'TOKEN_MISSING'
      });
    }

    // Verify token
    const decoded = AuthService.verifyToken(token);
    
    // Get fresh user data
    const user = await AuthService.getUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        code: 'TOKEN_INVALID'
      });
    }

    // Attach user to request
    req.user = user;
    req.token = token;
    
    next();

  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format',
        code: 'TOKEN_MALFORMED'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      code: 'AUTH_ERROR'
    });
  }
};

/**
 * Middleware to check if user has required role
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
};

/**
 * Middleware to check subscription tier
 */
const requireSubscription = (...tiers) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    const userTier = req.user.subscription?.tier || 'FREE';
    
    if (!tiers.includes(userTier)) {
      return res.status(403).json({
        success: false,
        message: 'Premium subscription required',
        code: 'SUBSCRIPTION_REQUIRED',
        required: tiers,
        current: userTier
      });
    }

    next();
  };
};

/**
 * Optional authentication - attaches user if token is valid, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = AuthService.verifyToken(token);
      const user = await AuthService.getUserById(decoded.userId);
      
      if (user) {
        req.user = user;
        req.token = token;
      }
    }

    next();

  } catch (error) {
    // Silently fail for optional auth
    next();
  }
};

/**
 * Middleware to check if user has an approved creator application
 */
const requireApprovedCreator = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // Check if user has CREATOR role AND is verified
    if (req.user.role !== 'CREATOR' || !req.user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Approved creator status required. Please submit your creator application and wait for approval.',
        code: 'CREATOR_APPROVAL_REQUIRED',
        userRole: req.user.role,
        isVerified: req.user.isVerified
      });
    }

    // Additional check: verify creator application exists and is approved
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const application = await prisma.creatorApplication.findUnique({
      where: { userId: req.user.id }
    });

    if (!application || application.status !== 'APPROVED') {
      return res.status(403).json({
        success: false,
        message: 'Creator application must be approved before accessing creator features.',
        code: 'CREATOR_APPLICATION_NOT_APPROVED',
        applicationStatus: application?.status || 'NOT_SUBMITTED'
      });
    }

    next();

  } catch (error) {
    console.error('❌ Creator approval check error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Error verifying creator status',
      code: 'CREATOR_CHECK_ERROR'
    });
  }
};

/**
 * Rate limiting for authentication endpoints
 */
const authRateLimit = require('express-rate-limit')({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Increased from 5 to 50 (10x) - Limit each IP to 50 requests per windowMs for auth endpoints
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authenticateToken,
  requireRole,
  requireSubscription,
  requireApprovedCreator,
  optionalAuth,
  authRateLimit
};
