const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validate, sanitize, schemas } = require('../middleware/validation');
const CategoryController = require('../controllers/categoryController');

const router = express.Router();

/**
 * @route   GET /api/categories
 * @desc    Get all active categories
 * @access  Public
 */
router.get('/',
  sanitize,
  CategoryController.getAllCategories
);

/**
 * @route   GET /api/categories/:slug
 * @desc    Get category by slug with associated looprooms
 * @access  Public
 */
router.get('/:slug',
  sanitize,
  CategoryController.getCategoryBySlug
);

/**
 * @route   POST /api/categories
 * @desc    Create new category (Admin only)
 * @access  Private (Admin)
 */
router.post('/',
  authenticateToken,
  requireAdmin,
  sanitize,
  validate(schemas.createCategory),
  CategoryController.createCategory
);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id',
  authenticateToken,
  requireAdmin,
  sanitize,
  validate(schemas.updateCategory),
  CategoryController.updateCategory
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id',
  authenticateToken,
  requireAdmin,
  CategoryController.deleteCategory
);

module.exports = router;