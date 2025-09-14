const CreatorVerificationService = require('../services/creatorVerificationService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CreatorVerificationController {
  /**
   * Submit creator verification with ID documents
   * POST /api/verification/creator/submit
   */
  static async submitVerification(req, res) {
    try {
      const userId = req.user.id;
      const { documentType, bio, experience, categories } = req.body;
      const files = req.files;

      console.log(`📸 Creator verification submission for user: ${userId}`);

      // Validate required fields
      if (!documentType || !bio || !categories) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
          code: 'MISSING_FIELDS'
        });
      }

      // Validate files
      if (!files || !files.idFront || !files.selfie) {
        return res.status(400).json({
          success: false,
          message: 'ID front and selfie are required',
          code: 'MISSING_FILES'
        });
      }

      // Parse categories if it's a string
      let parsedCategories;
      try {
        parsedCategories = typeof categories === 'string'
          ? JSON.parse(categories)
          : categories;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid categories format',
          code: 'INVALID_CATEGORIES'
        });
      }

      // Process verification
      const result = await CreatorVerificationService.processVerification({
        userId,
        documentType,
        bio,
        experience,
        categories: parsedCategories,
        idFrontFile: files.idFront[0],
        idBackFile: files.idBack ? files.idBack[0] : null,
        selfieFile: files.selfie[0]
      });

      res.json({
        success: true,
        message: 'Verification submitted successfully',
        data: result
      });

    } catch (error) {
      console.error('❌ Creator verification error:', error);

      if (error.message.includes('already')) {
        return res.status(409).json({
          success: false,
          message: error.message,
          code: 'ALREADY_EXISTS'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Verification submission failed',
        code: 'SUBMISSION_ERROR'
      });
    }
  }

  /**
   * Get verification status
   * GET /api/verification/creator/status
   */
  static async getVerificationStatus(req, res) {
    try {
      const userId = req.user.id;

      console.log(`📊 Getting creator verification status for user: ${userId}`);

      const application = await prisma.creatorApplication.findUnique({
        where: { userId },
        select: {
          id: true,
          status: true,
          reviewNotes: true,
          rejectionReason: true,
          additionalInfoRequested: true,
          createdAt: true,
          reviewedAt: true,
          updatedAt: true,
          faceVerificationCompleted: true,
          faceVerificationScore: true
        }
      });

      if (!application) {
        return res.json({
          success: true,
          data: {
            status: 'NOT_SUBMITTED',
            message: 'No verification application found',
            canSubmit: true
          }
        });
      }

      // Check if can retry (rejected applications can be retried)
      const canRetry = application.status === 'REJECTED';

      // Calculate retry count based on updatedAt vs createdAt
      const retryCount = application.updatedAt > application.createdAt
        ? Math.floor((application.updatedAt - application.createdAt) / (24 * 60 * 60 * 1000))
        : 0;

      res.json({
        success: true,
        data: {
          status: application.status,
          reviewNotes: application.reviewNotes,
          rejectionReason: application.rejectionReason,
          additionalInfoRequested: application.additionalInfoRequested,
          submittedAt: application.createdAt,
          reviewedAt: application.reviewedAt,
          verificationScore: application.faceVerificationScore,
          canRetry,
          retryCount,
          lastAttempt: application.updatedAt
        }
      });

    } catch (error) {
      console.error('❌ Get verification status error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to get verification status',
        code: 'STATUS_ERROR'
      });
    }
  }

  /**
   * Admin: Review verification
   * POST /api/verification/creator/review/:applicationId
   */
  static async reviewVerification(req, res) {
    try {
      const { applicationId } = req.params;
      const { status, reviewNotes, rejectionReason } = req.body;
      const reviewerId = req.user.id;

      // Check if user is admin/moderator
      const reviewer = await prisma.user.findUnique({
        where: { id: reviewerId },
        select: { role: true }
      });

      if (!reviewer || !['ADMIN', 'MODERATOR'].includes(reviewer.role)) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to review applications',
          code: 'UNAUTHORIZED'
        });
      }

      console.log(`🔍 Reviewing creator application: ${applicationId}`);

      const result = await CreatorVerificationService.reviewApplication({
        applicationId,
        reviewerId,
        status,
        reviewNotes,
        rejectionReason
      });

      res.json({
        success: true,
        message: `Application ${status.toLowerCase()}`,
        data: result
      });

    } catch (error) {
      console.error('❌ Review verification error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to review application',
        code: 'REVIEW_ERROR'
      });
    }
  }

  /**
   * Get admin statistics for creator applications
   * GET /api/verification/creator/statistics
   */
  static async getStatistics(req, res) {
    try {
      const userId = req.user.id;

      // Check if user is admin/moderator
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });

      if (!user || !['ADMIN', 'MODERATOR'].includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized',
          code: 'UNAUTHORIZED'
        });
      }

      // Get statistics
      const [total, pending, approved, rejected, underReview] = await Promise.all([
        prisma.creatorApplication.count(),
        prisma.creatorApplication.count({ where: { status: 'PENDING' } }),
        prisma.creatorApplication.count({ where: { status: 'APPROVED' } }),
        prisma.creatorApplication.count({ where: { status: 'REJECTED' } }),
        prisma.creatorApplication.count({ where: { status: 'UNDER_REVIEW' } })
      ]);

      // Get recent activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const [recentApproved, recentRejected] = await Promise.all([
        prisma.creatorApplication.count({
          where: {
            status: 'APPROVED',
            reviewedAt: { gte: sevenDaysAgo }
          }
        }),
        prisma.creatorApplication.count({
          where: {
            status: 'REJECTED',
            reviewedAt: { gte: sevenDaysAgo }
          }
        })
      ]);

      // Get admin's personal review stats if they are the reviewer
      const [adminApproved, adminRejected] = await Promise.all([
        prisma.creatorApplication.count({
          where: {
            status: 'APPROVED',
            reviewedBy: userId
          }
        }),
        prisma.creatorApplication.count({
          where: {
            status: 'REJECTED',
            reviewedBy: userId
          }
        })
      ]);

      res.json({
        success: true,
        data: {
          total,
          pending,
          approved,
          rejected,
          underReview,
          approvalRate: total > 0 ? ((approved / total) * 100).toFixed(1) : 0,
          recent: {
            approved: recentApproved,
            rejected: recentRejected
          },
          adminStats: {
            approved: adminApproved,
            rejected: adminRejected,
            total: adminApproved + adminRejected
          }
        }
      });

    } catch (error) {
      console.error('❌ Get statistics error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to get statistics',
        code: 'STATISTICS_ERROR'
      });
    }
  }

  /**
   * Get all pending verifications (Admin)
   * GET /api/verification/creator/pending
   */
  static async getPendingVerifications(req, res) {
    try {
      const userId = req.user.id;

      // Check if user is admin/moderator
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });

      if (!user || !['ADMIN', 'MODERATOR'].includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized',
          code: 'UNAUTHORIZED'
        });
      }

      const applications = await prisma.creatorApplication.findMany({
        where: {
          status: {
            in: ['PENDING', 'UNDER_REVIEW']
          }
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      res.json({
        success: true,
        data: applications
      });

    } catch (error) {
      console.error('❌ Get pending verifications error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to get pending verifications',
        code: 'FETCH_ERROR'
      });
    }
  }
}

module.exports = CreatorVerificationController;