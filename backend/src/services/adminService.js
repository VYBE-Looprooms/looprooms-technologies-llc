const prisma = require('../config/database');
const EmailService = require('../../services/emailService');

class AdminService {
  /**
   * Get all creator applications with filters
   */
  static async getCreatorApplications({ status, search, page = 1, limit = 20 }) {
    try {
      const where = {};
      
      // Status filter
      if (status && status !== 'all') {
        where.status = status;
      }
      
      // Search filter
      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { user: { email: { contains: search, mode: 'insensitive' } } }
        ];
      }

      const skip = (page - 1) * limit;

      const [applications, total] = await Promise.all([
        prisma.creatorApplication.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatarUrl: true
                  }
                }
              }
            }
          },
          orderBy: [
            { status: 'asc' }, // Pending first
            { createdAt: 'desc' }
          ],
          skip,
          take: limit
        }),
        prisma.creatorApplication.count({ where })
      ]);

      return {
        success: true,
        data: {
          applications: applications.map(app => ({
            id: app.id,
            user: {
              id: app.user.id,
              email: app.user.email,
              firstName: app.user.profile?.firstName || app.firstName,
              lastName: app.user.profile?.lastName || app.lastName,
              avatar: app.user.profile?.avatarUrl
            },
            status: app.status,
            bio: app.bio,
            interestedCategories: app.interestedCategories,
            primaryCategory: app.primaryCategory,
            identityDocumentType: app.identityDocumentType,
            identityDocumentUrl: app.identityDocumentUrl,
            faceVerificationCompleted: app.faceVerificationCompleted,
            faceVerificationScore: app.faceVerificationScore,
            reviewNotes: app.reviewNotes,
            rejectionReason: app.rejectionReason,
            additionalInfoRequested: app.additionalInfoRequested,
            submittedAt: app.createdAt,
            reviewedAt: app.reviewedAt,
            reviewedBy: app.reviewedBy
          })),
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      };

    } catch (error) {
      console.error('❌ Error getting creator applications:', error.message);
      throw error;
    }
  }

  /**
   * Get application statistics
   */
  static async getApplicationStats() {
    try {
      const [pending, underReview, approved, rejected, total] = await Promise.all([
        prisma.creatorApplication.count({ where: { status: 'PENDING' } }),
        prisma.creatorApplication.count({ where: { status: 'UNDER_REVIEW' } }),
        prisma.creatorApplication.count({ where: { status: 'APPROVED' } }),
        prisma.creatorApplication.count({ where: { status: 'REJECTED' } }),
        prisma.creatorApplication.count()
      ]);

      return {
        success: true,
        data: {
          pending,
          underReview,
          approved,
          rejected,
          total
        }
      };

    } catch (error) {
      console.error('❌ Error getting application stats:', error.message);
      throw error;
    }
  }

  /**
   * Approve creator application
   */
  static async approveApplication(applicationId, reviewedBy, reviewNotes = '') {
    try {
      const application = await prisma.creatorApplication.findUnique({
        where: { id: applicationId },
        include: {
          user: {
            include: {
              profile: true
            }
          }
        }
      });

      if (!application) {
        throw new Error('Application not found');
      }

      if (application.status === 'APPROVED') {
        throw new Error('Application is already approved');
      }

      // Update application status
      const updatedApplication = await prisma.$transaction(async (tx) => {
        // Update application
        const app = await tx.creatorApplication.update({
          where: { id: applicationId },
          data: {
            status: 'APPROVED',
            reviewNotes,
            reviewedBy,
            reviewedAt: new Date()
          }
        });

        // Update user role to CREATOR
        await tx.user.update({
          where: { id: application.userId },
          data: {
            role: 'CREATOR'
          }
        });

        return app;
      });

      // Send approval email (async)
      setImmediate(async () => {
        try {
          const emailService = new EmailService();
          await emailService.sendCreatorApprovalEmail(
            application.user.email,
            application.user.profile?.firstName || application.firstName
          );
        } catch (emailError) {
          console.error('❌ Failed to send approval email:', emailError.message);
        }
      });

      console.log(`✅ Creator application approved: ${applicationId} by admin: ${reviewedBy}`);

      return {
        success: true,
        data: updatedApplication
      };

    } catch (error) {
      console.error('❌ Error approving application:', error.message);
      throw error;
    }
  }

  /**
   * Reject creator application
   */
  static async rejectApplication(applicationId, reviewedBy, rejectionReason, additionalInfoRequested = '') {
    try {
      const application = await prisma.creatorApplication.findUnique({
        where: { id: applicationId },
        include: {
          user: {
            include: {
              profile: true
            }
          }
        }
      });

      if (!application) {
        throw new Error('Application not found');
      }

      if (application.status === 'APPROVED' || application.status === 'REJECTED') {
        throw new Error('Application cannot be rejected at this stage');
      }

      // Update application status
      const updatedApplication = await prisma.creatorApplication.update({
        where: { id: applicationId },
        data: {
          status: 'REJECTED',
          rejectionReason,
          additionalInfoRequested,
          reviewedBy,
          reviewedAt: new Date()
        }
      });

      // Send rejection email (async)
      setImmediate(async () => {
        try {
          const emailService = new EmailService();
          await emailService.sendCreatorRejectionEmail(
            application.user.email,
            application.user.profile?.firstName || application.firstName,
            rejectionReason,
            additionalInfoRequested
          );
        } catch (emailError) {
          console.error('❌ Failed to send rejection email:', emailError.message);
        }
      });

      console.log(`❌ Creator application rejected: ${applicationId} by admin: ${reviewedBy}`);

      return {
        success: true,
        data: updatedApplication
      };

    } catch (error) {
      console.error('❌ Error rejecting application:', error.message);
      throw error;
    }
  }

  /**
   * Request additional information
   */
  static async requestAdditionalInfo(applicationId, reviewedBy, additionalInfoRequested) {
    try {
      const application = await prisma.creatorApplication.findUnique({
        where: { id: applicationId },
        include: {
          user: {
            include: {
              profile: true
            }
          }
        }
      });

      if (!application) {
        throw new Error('Application not found');
      }

      // Update application with additional info request
      const updatedApplication = await prisma.creatorApplication.update({
        where: { id: applicationId },
        data: {
          status: 'PENDING', // Set back to pending for user to respond
          additionalInfoRequested,
          reviewedBy,
          reviewedAt: new Date()
        }
      });

      // Send additional info request email (async)
      setImmediate(async () => {
        try {
          const emailService = new EmailService();
          await emailService.sendAdditionalInfoRequestEmail(
            application.user.email,
            application.user.profile?.firstName || application.firstName,
            additionalInfoRequested
          );
        } catch (emailError) {
          console.error('❌ Failed to send additional info request email:', emailError.message);
        }
      });

      console.log(`📝 Additional info requested for application: ${applicationId} by admin: ${reviewedBy}`);

      return {
        success: true,
        data: updatedApplication
      };

    } catch (error) {
      console.error('❌ Error requesting additional info:', error.message);
      throw error;
    }
  }

  /**
   * Update application to under review status
   */
  static async setUnderReview(applicationId, reviewedBy) {
    try {
      const updatedApplication = await prisma.creatorApplication.update({
        where: { id: applicationId },
        data: {
          status: 'UNDER_REVIEW',
          reviewedBy,
          reviewedAt: new Date()
        }
      });

      console.log(`👀 Application set to under review: ${applicationId} by admin: ${reviewedBy}`);

      return {
        success: true,
        data: updatedApplication
      };

    } catch (error) {
      console.error('❌ Error setting application under review:', error.message);
      throw error;
    }
  }

  /**
   * Get recent notifications for admin
   */
  static async getAdminNotifications() {
    try {
      // Get pending and recently submitted applications
      const pendingApplications = await prisma.creatorApplication.findMany({
        where: {
          status: 'PENDING'
        },
        include: {
          user: {
            include: {
              profile: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      });

      const notifications = pendingApplications.map(app => ({
        id: app.id,
        type: 'new_application',
        title: 'New Creator Application',
        message: `${app.user.profile?.firstName || app.firstName} ${app.user.profile?.lastName || app.lastName} submitted a creator application`,
        timestamp: app.createdAt,
        read: false,
        data: {
          applicationId: app.id,
          userId: app.userId
        }
      }));

      return {
        success: true,
        data: {
          notifications,
          unreadCount: notifications.length
        }
      };

    } catch (error) {
      console.error('❌ Error getting admin notifications:', error.message);
      throw error;
    }
  }
}

module.exports = AdminService;