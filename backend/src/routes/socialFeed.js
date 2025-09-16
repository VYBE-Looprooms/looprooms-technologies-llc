const express = require('express');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { validate, sanitize, schemas } = require('../middleware/validation');
const SocialFeedController = require('../controllers/socialFeedController');

const router = express.Router();

/**
 * @route   GET /api/feed
 * @desc    Get social feed posts (SharedVybes)
 * @access  Public (but enhanced if authenticated)
 */
router.get('/',
  optionalAuth, // Allow both authenticated and unauthenticated access
  sanitize,
  SocialFeedController.getFeedPosts
);

/**
 * @route   POST /api/feed
 * @desc    Create a new shared vybe (post)
 * @access  Private
 */
router.post('/',
  authenticateToken,
  sanitize,
  validate(schemas.createPost),
  SocialFeedController.createPost
);

/**
 * @route   POST /api/feed/:postId/react
 * @desc    Add reaction to a post
 * @access  Private
 */
router.post('/:postId/react',
  authenticateToken,
  sanitize,
  validate(schemas.addReactionToPost),
  SocialFeedController.addReaction
);

/**
 * @route   DELETE /api/feed/:postId/react
 * @desc    Remove reaction from a post
 * @access  Private
 */
router.delete('/:postId/react',
  authenticateToken,
  SocialFeedController.removeReaction
);

/**
 * @route   POST /api/feed/:postId/comment
 * @desc    Add comment to a post
 * @access  Private
 */
router.post('/:postId/comment',
  authenticateToken,
  sanitize,
  validate(schemas.addComment),
  SocialFeedController.addComment
);

module.exports = router;