const express = require('express');
const AdminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication
router.use(auth);

/**
 * @route   GET /api/admin/applications
 * @desc    Get all creator applications with filters
 * @access  Admin only
 * @query   status, search, page, limit
 */
router.get('/applications', AdminController.getApplications);

/**
 * @route   GET /api/admin/applications/stats
 * @desc    Get application statistics
 * @access  Admin only
 */
router.get('/applications/stats', AdminController.getApplicationStats);

/**
 * @route   POST /api/admin/applications/:id/approve
 * @desc    Approve creator application
 * @access  Admin only
 * @body    reviewNotes (optional)
 */
router.post('/applications/:id/approve', AdminController.approveApplication);

/**
 * @route   POST /api/admin/applications/:id/reject
 * @desc    Reject creator application
 * @access  Admin only
 * @body    rejectionReason (required), additionalInfoRequested (optional)
 */
router.post('/applications/:id/reject', AdminController.rejectApplication);

/**
 * @route   POST /api/admin/applications/:id/request-info
 * @desc    Request additional information from applicant
 * @access  Admin only
 * @body    additionalInfoRequested (required)
 */
router.post('/applications/:id/request-info', AdminController.requestAdditionalInfo);

/**
 * @route   POST /api/admin/applications/:id/review
 * @desc    Set application status to under review
 * @access  Admin only
 */
router.post('/applications/:id/review', AdminController.setUnderReview);

/**
 * @route   GET /api/admin/notifications
 * @desc    Get admin notifications
 * @access  Admin only
 */
router.get('/notifications', AdminController.getNotifications);

module.exports = router;