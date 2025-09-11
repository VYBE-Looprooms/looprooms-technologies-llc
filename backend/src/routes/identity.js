const express = require('express');
const multer = require('multer');
const IdentityVerificationController = require('../controllers/identityVerificationController');
const { authenticateToken } = require('../middleware/auth');
const { validate, sanitize, schemas } = require('../middleware/validation');

const router = express.Router();

// Configure multer for file uploads (memory storage for cloud upload)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

/**
 * @route   POST /api/identity/upload-document
 * @desc    Upload identity document (front/back)
 * @access  Private
 */
router.post('/upload-document',
  authenticateToken,
  upload.single('document'),
  IdentityVerificationController.uploadDocument
);

/**
 * @route   POST /api/identity/upload-face
 * @desc    Upload face verification photo
 * @access  Private
 */
router.post('/upload-face',
  authenticateToken,
  upload.single('face'),
  IdentityVerificationController.uploadFaceVerification
);

/**
 * @route   POST /api/identity/complete
 * @desc    Complete identity verification process
 * @access  Private
 */
router.post('/complete',
  authenticateToken,
  IdentityVerificationController.completeVerification
);

/**
 * @route   GET /api/identity/status
 * @desc    Get identity verification status
 * @access  Private
 */
router.get('/status',
  authenticateToken,
  IdentityVerificationController.getVerificationStatus
);

/**
 * @route   GET /api/identity/health
 * @desc    Identity verification service health check
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Identity verification service is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      uploadDocument: 'POST /api/identity/upload-document',
      uploadFace: 'POST /api/identity/upload-face',
      complete: 'POST /api/identity/complete',
      status: 'GET /api/identity/status'
    }
  });
});

module.exports = router;
