const express = require('express');
const multer = require('multer');
const VerificationController = require('../controllers/verificationController');
const CreatorVerificationController = require('../controllers/creatorVerificationController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
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
 * @route   POST /api/verification/create-session
 * @desc    Create a new verification session for QR code flow
 * @access  Private
 */
router.post('/create-session',
  authenticateToken,
  VerificationController.createSession
);

/**
 * @route   GET /api/verification/status/:sessionId
 * @desc    Get verification status for a session
 * @access  Private
 */
router.get('/status/:sessionId',
  authenticateToken,
  VerificationController.getStatus
);

/**
 * @route   POST /api/verification/submit
 * @desc    Submit verification data from mobile device
 * @access  Public (uses session token)
 */
router.post('/submit',
  upload.fields([
    { name: 'id_image', maxCount: 1 },
    { name: 'selfie', maxCount: 1 }
  ]),
  VerificationController.submitVerification
);

/**
 * @route   POST /api/verification/creator/submit
 * @desc    Submit creator verification with ID documents
 * @access  Private
 */
router.post('/creator/submit',
  authenticateToken,
  upload.fields([
    { name: 'idFront', maxCount: 1 },
    { name: 'idBack', maxCount: 1 },
    { name: 'selfie', maxCount: 1 }
  ]),
  CreatorVerificationController.submitVerification
);

/**
 * @route   GET /api/verification/creator/status
 * @desc    Get creator verification status
 * @access  Private
 */
router.get('/creator/status',
  authenticateToken,
  CreatorVerificationController.getVerificationStatus
);

/**
 * @route   POST /api/verification/creator/review/:applicationId
 * @desc    Review creator verification (Admin/Moderator only)
 * @access  Private (Admin/Moderator)
 */
router.post('/creator/review/:applicationId',
  authenticateToken,
  CreatorVerificationController.reviewVerification
);

/**
 * @route   GET /api/verification/creator/pending
 * @desc    Get pending creator verifications (Admin/Moderator only)
 * @access  Private (Admin/Moderator)
 */
router.get('/creator/pending',
  authenticateToken,
  CreatorVerificationController.getPendingVerifications
);

/**
 * @route   GET /api/verification/creator/statistics
 * @desc    Get creator verification statistics (Admin/Moderator only)
 * @access  Private (Admin/Moderator)
 */
router.get('/creator/statistics',
  authenticateToken,
  CreatorVerificationController.getStatistics
);

/**
 * @route   GET /api/verification/health
 * @desc    Verification service health check
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Verification service is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      createSession: 'POST /api/verification/create-session',
      getStatus: 'GET /api/verification/status/:sessionId',
      submit: 'POST /api/verification/submit',
      creatorSubmit: 'POST /api/verification/creator/submit',
      creatorStatus: 'GET /api/verification/creator/status',
      creatorReview: 'POST /api/verification/creator/review/:applicationId',
      creatorPending: 'GET /api/verification/creator/pending'
    }
  });
});

module.exports = router;