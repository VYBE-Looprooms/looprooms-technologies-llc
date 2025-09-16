const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { validate, sanitize, schemas } = require('../middleware/validation');
const UserProgressController = require('../controllers/userProgressController');

const router = express.Router();

/**
 * @route   GET /api/user/progress
 * @desc    Get user's overall progress and stats
 * @access  Private
 */
router.get('/progress',
  authenticateToken,
  sanitize,
  UserProgressController.getUserProgress
);

/**
 * @route   GET /api/user/journeys/active
 * @desc    Get user's active journeys (loopchains in progress)
 * @access  Private
 */
router.get('/journeys/active',
  authenticateToken,
  sanitize,
  UserProgressController.getActiveJourneys
);

/**
 * @route   GET /api/user/journeys/available
 * @desc    Get available journeys (loopchains) to start
 * @access  Private
 */
router.get('/journeys/available',
  authenticateToken,
  sanitize,
  UserProgressController.getAvailableJourneys
);

/**
 * @route   POST /api/user/journeys/start
 * @desc    Start a new journey (loopchain)
 * @access  Private
 */
router.post('/journeys/start',
  authenticateToken,
  sanitize,
  validate(schemas.startJourney),
  UserProgressController.startJourney
);

/**
 * @route   PUT /api/user/journeys/progress
 * @desc    Update journey progress
 * @access  Private
 */
router.put('/journeys/progress',
  authenticateToken,
  sanitize,
  validate(schemas.updateJourneyProgress),
  UserProgressController.updateJourneyProgress
);

module.exports = router;