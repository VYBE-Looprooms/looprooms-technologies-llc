const express = require('express');
const { authenticateToken, requireApprovedCreator } = require('../middleware/auth');
const { validate, sanitize, schemas } = require('../middleware/validation');
const LooproomController = require('../controllers/looproomController');

const router = express.Router();

/**
 * @route   GET /api/looprooms
 * @desc    Get all published looprooms with filtering and pagination
 * @access  Public
 */
router.get('/',
  sanitize,
  LooproomController.getAllLooprooms
);

/**
 * @route   GET /api/looprooms/:id
 * @desc    Get a specific looproom by ID
 * @access  Public
 */
router.get('/:id',
  sanitize,
  LooproomController.getLooproomById
);

/**
 * @route   GET /api/looprooms/category/:categoryId
 * @desc    Get looprooms by category
 * @access  Public
 */
router.get('/category/:categoryId',
  sanitize,
  LooproomController.getLooproomsByCategory
);

/**
 * @route   GET /api/looprooms/creator/:creatorId
 * @desc    Get looprooms by creator
 * @access  Public
 */
router.get('/creator/:creatorId',
  sanitize,
  LooproomController.getLooproomsByCreator
);

/**
 * @route   POST /api/looprooms
 * @desc    Create a new looproom (creators only)
 * @access  Private (Creator/Admin)
 */
router.post('/',
  authenticateToken,
  requireApprovedCreator,
  sanitize,
  validate(schemas.createLooproom),
  LooproomController.createLooproom
);

/**
 * @route   PUT /api/looprooms/:id
 * @desc    Update a looproom (creator owns it or admin)
 * @access  Private (Creator/Admin)
 */
router.put('/:id',
  authenticateToken,
  requireApprovedCreator,
  sanitize,
  validate(schemas.updateLooproom),
  LooproomController.updateLooproom
);

/**
 * @route   DELETE /api/looprooms/:id
 * @desc    Delete a looproom (creator owns it or admin)
 * @access  Private (Creator/Admin)
 */
router.delete('/:id',
  authenticateToken,
  requireApprovedCreator,
  LooproomController.deleteLooproom
);

/**
 * @route   POST /api/looprooms/:id/react
 * @desc    Add or update reaction to a looproom
 * @access  Private
 */
router.post('/:id/react',
  authenticateToken,
  sanitize,
  validate(schemas.addReaction),
  LooproomController.addReaction
);

/**
 * @route   DELETE /api/looprooms/:id/react
 * @desc    Remove reaction from a looproom
 * @access  Private
 */
router.delete('/:id/react',
  authenticateToken,
  LooproomController.removeReaction
);

/**
 * @route   POST /api/looprooms/:id/view
 * @desc    Increment view count for a looproom
 * @access  Public
 */
router.post('/:id/view',
  LooproomController.incrementViewCount
);

/**
 * @route   GET /api/looprooms/:id/analytics
 * @desc    Get analytics for a looproom (creator owns it or admin)
 * @access  Private (Creator/Admin)
 */
router.get('/:id/analytics',
  authenticateToken,
  requireApprovedCreator,
  LooproomController.getLooproomAnalytics
);

module.exports = router;