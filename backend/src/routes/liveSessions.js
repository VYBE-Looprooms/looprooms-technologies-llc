const express = require('express');
const { authenticateToken, requireApprovedCreator } = require('../middleware/auth');
const { validate, sanitize, schemas } = require('../middleware/validation');
const LiveSessionController = require('../controllers/liveSessionController');

const router = express.Router();

/**
 * @route   POST /api/sessions
 * @desc    Create a new live session
 * @access  Private (Creator/Admin)
 */
router.post('/',
  authenticateToken,
  requireApprovedCreator,
  sanitize,
  validate({
    looproomId: { required: true, type: 'string' },
    title: { required: false, type: 'string', maxLength: 200 },
    description: { required: false, type: 'string', maxLength: 1000 },
    scheduledStartTime: { required: true, type: 'string' },
    duration: { required: false, type: 'number', min: 5, max: 180 },
    maxParticipants: { required: false, type: 'number', min: 1, max: 100 },
    allowAnonymous: { required: false, type: 'boolean' },
    requiresApproval: { required: false, type: 'boolean' },
    isRecorded: { required: false, type: 'boolean' }
  }),
  LiveSessionController.createSession
);

/**
 * @route   POST /api/sessions/:id/start
 * @desc    Start a scheduled session
 * @access  Private (Creator/Admin)
 */
router.post('/:id/start',
  authenticateToken,
  requireApprovedCreator,
  sanitize,
  LiveSessionController.startSession
);

/**
 * @route   POST /api/sessions/:id/end
 * @desc    End an active session
 * @access  Private (Creator/Admin)
 */
router.post('/:id/end',
  authenticateToken,
  requireApprovedCreator,
  sanitize,
  LiveSessionController.endSession
);

/**
 * @route   POST /api/sessions/:id/join
 * @desc    Join a live session
 * @access  Private
 */
router.post('/:id/join',
  authenticateToken,
  sanitize,
  validate({
    isAnonymous: { required: false, type: 'boolean' },
    displayName: { required: false, type: 'string', maxLength: 50 }
  }),
  LiveSessionController.joinSession
);

/**
 * @route   POST /api/sessions/:id/leave
 * @desc    Leave a live session
 * @access  Private
 */
router.post('/:id/leave',
  authenticateToken,
  sanitize,
  validate({
    moodAfter: { required: false, type: 'object' }
  }),
  LiveSessionController.leaveSession
);

/**
 * @route   GET /api/sessions/:id
 * @desc    Get session details and participants
 * @access  Public (for active sessions)
 */
router.get('/:id',
  sanitize,
  LiveSessionController.getSession
);

/**
 * @route   POST /api/sessions/:id/comments
 * @desc    Add comment to session
 * @access  Private (Session participants only)
 */
router.post('/:id/comments',
  authenticateToken,
  sanitize,
  validate({
    content: { required: true, type: 'string', minLength: 1, maxLength: 500 },
    isAnonymous: { required: false, type: 'boolean' }
  }),
  LiveSessionController.addComment
);

/**
 * @route   GET /api/looprooms/:looproomId/sessions/active
 * @desc    Get active sessions for a looproom
 * @access  Public
 */
router.get('/looprooms/:looproomId/active',
  sanitize,
  LiveSessionController.getActiveSessionsForLooproom
);

module.exports = router;