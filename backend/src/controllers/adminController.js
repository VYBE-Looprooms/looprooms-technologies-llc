const AdminService = require('../services/adminService');
const { validate, sanitize, schemas } = require('../middleware/validation');

class AdminController {
  /**
   * Get all creator applications
   * GET /api/admin/applications
   */
  static async getApplications(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.',
          code: 'ADMIN_ACCESS_REQUIRED'
        });
      }

      const { status, search, page, limit } = req.query;

      console.log(`🔍 Admin ${req.user.email} fetching applications - Status: ${status || 'all'}, Search: ${search || 'none'}`);

      const result = await AdminService.getCreatorApplications({
        status,
        search,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20
      });

      res.json({
        success: true,
        message: 'Applications retrieved successfully',
        data: result.data
      });

    } catch (error) {
      console.error('❌ Get applications controller error:', error.message);
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve applications',
        code: 'FETCH_APPLICATIONS_ERROR'
      });
    }
  }

  /**
   * Get application statistics
   * GET /api/admin/applications/stats
   */
  static async getApplicationStats(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.',
          code: 'ADMIN_ACCESS_REQUIRED'
        });
      }

      console.log(`📊 Admin ${req.user.email} fetching application statistics`);

      const result = await AdminService.getApplicationStats();

      res.json({
        success: true,
        message: 'Statistics retrieved successfully',
        data: result.data
      });

    } catch (error) {
      console.error('❌ Get application stats controller error:', error.message);
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve statistics',
        code: 'FETCH_STATS_ERROR'
      });
    }
  }

  /**
   * Approve creator application
   * POST /api/admin/applications/:id/approve
   */
  static async approveApplication(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.',
          code: 'ADMIN_ACCESS_REQUIRED'
        });
      }

      const { id } = req.params;
      const { reviewNotes } = req.body;

      console.log(`✅ Admin ${req.user.email} approving application: ${id}`);

      const result = await AdminService.approveApplication(
        id,
        req.user.id,
        reviewNotes || ''
      );

      res.json({
        success: true,
        message: 'Application approved successfully',
        data: result.data
      });

    } catch (error) {
      console.error('❌ Approve application controller error:', error.message);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'Application not found',
          code: 'APPLICATION_NOT_FOUND'
        });
      }

      if (error.message.includes('already approved')) {
        return res.status(400).json({
          success: false,
          message: 'Application is already approved',
          code: 'ALREADY_APPROVED'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to approve application',
        code: 'APPROVAL_ERROR'
      });
    }
  }

  /**
   * Reject creator application
   * POST /api/admin/applications/:id/reject
   */
  static async rejectApplication(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.',
          code: 'ADMIN_ACCESS_REQUIRED'
        });
      }

      const { id } = req.params;
      const { rejectionReason, additionalInfoRequested } = req.body;

      if (!rejectionReason || !rejectionReason.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Rejection reason is required',
          code: 'REJECTION_REASON_REQUIRED'
        });
      }

      console.log(`❌ Admin ${req.user.email} rejecting application: ${id}`);

      const result = await AdminService.rejectApplication(
        id,
        req.user.id,
        rejectionReason.trim(),
        additionalInfoRequested?.trim() || ''
      );

      res.json({
        success: true,
        message: 'Application rejected successfully',
        data: result.data
      });

    } catch (error) {
      console.error('❌ Reject application controller error:', error.message);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'Application not found',
          code: 'APPLICATION_NOT_FOUND'
        });
      }

      if (error.message.includes('cannot be rejected')) {
        return res.status(400).json({
          success: false,
          message: 'Application cannot be rejected at this stage',
          code: 'INVALID_STATUS_CHANGE'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to reject application',
        code: 'REJECTION_ERROR'
      });
    }
  }

  /**
   * Request additional information
   * POST /api/admin/applications/:id/request-info
   */
  static async requestAdditionalInfo(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.',
          code: 'ADMIN_ACCESS_REQUIRED'
        });
      }

      const { id } = req.params;
      const { additionalInfoRequested } = req.body;

      if (!additionalInfoRequested || !additionalInfoRequested.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Additional information request is required',
          code: 'ADDITIONAL_INFO_REQUIRED'
        });
      }

      console.log(`📝 Admin ${req.user.email} requesting additional info for application: ${id}`);

      const result = await AdminService.requestAdditionalInfo(
        id,
        req.user.id,
        additionalInfoRequested.trim()
      );

      res.json({
        success: true,
        message: 'Additional information requested successfully',
        data: result.data
      });

    } catch (error) {
      console.error('❌ Request additional info controller error:', error.message);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'Application not found',
          code: 'APPLICATION_NOT_FOUND'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to request additional information',
        code: 'REQUEST_INFO_ERROR'
      });
    }
  }

  /**
   * Set application under review
   * POST /api/admin/applications/:id/review
   */
  static async setUnderReview(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.',
          code: 'ADMIN_ACCESS_REQUIRED'
        });
      }

      const { id } = req.params;

      console.log(`👀 Admin ${req.user.email} setting application under review: ${id}`);

      const result = await AdminService.setUnderReview(id, req.user.id);

      res.json({
        success: true,
        message: 'Application set under review successfully',
        data: result.data
      });

    } catch (error) {
      console.error('❌ Set under review controller error:', error.message);
      
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: 'Application not found',
          code: 'APPLICATION_NOT_FOUND'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to set application under review',
        code: 'SET_REVIEW_ERROR'
      });
    }
  }

  /**
   * Get admin notifications
   * GET /api/admin/notifications
   */
  static async getNotifications(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.',
          code: 'ADMIN_ACCESS_REQUIRED'
        });
      }

      console.log(`🔔 Admin ${req.user.email} fetching notifications`);

      const result = await AdminService.getAdminNotifications();

      res.json({
        success: true,
        message: 'Notifications retrieved successfully',
        data: result.data
      });

    } catch (error) {
      console.error('❌ Get notifications controller error:', error.message);
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve notifications',
        code: 'FETCH_NOTIFICATIONS_ERROR'
      });
    }
  }
}

module.exports = AdminController;