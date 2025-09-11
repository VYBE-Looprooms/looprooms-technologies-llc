const prisma = require('../config/database');
const path = require('path');
const fs = require('fs').promises;

class IdentityVerificationService {
  /**
   * Upload identity document (front or back)
   */
  static async uploadDocument(userId, file, documentType, side) {
    try {
      // Check if user has a creator application
      const creatorApplication = await prisma.creatorApplication.findUnique({
        where: { userId },
        include: { user: true }
      });

      if (!creatorApplication) {
        throw new Error('Creator application not found');
      }

      // Save file to uploads directory (in production, use cloud storage)
      const uploadsDir = path.join(process.cwd(), 'uploads', 'identity');
      await fs.mkdir(uploadsDir, { recursive: true });

      const fileName = `${userId}_${documentType}_${side}_${Date.now()}.jpg`;
      const filePath = path.join(uploadsDir, fileName);
      
      await fs.writeFile(filePath, file.buffer);

      // Update creator application with document info
      const updateData = {};
      if (side === 'front') {
        updateData.identityDocumentType = documentType;
        updateData.identityDocumentUrl = `/uploads/identity/${fileName}`;
      } else if (side === 'back') {
        updateData.identityDocumentBackUrl = `/uploads/identity/${fileName}`;
      }

      const updatedApplication = await prisma.creatorApplication.update({
        where: { userId },
        data: {
          ...updateData,
          updatedAt: new Date()
        }
      });

      return {
        fileName,
        filePath: `/uploads/identity/${fileName}`,
        documentType,
        side,
        uploaded: true
      };

    } catch (error) {
      console.error('❌ Document upload service error:', error.message);
      throw error;
    }
  }

  /**
   * Upload face verification photo
   */
  static async uploadFaceVerification(userId, file) {
    try {
      // Check if user has a creator application
      const creatorApplication = await prisma.creatorApplication.findUnique({
        where: { userId },
        include: { user: true }
      });

      if (!creatorApplication) {
        throw new Error('Creator application not found');
      }

      // Save file to uploads directory
      const uploadsDir = path.join(process.cwd(), 'uploads', 'identity');
      await fs.mkdir(uploadsDir, { recursive: true });

      const fileName = `${userId}_face_verification_${Date.now()}.jpg`;
      const filePath = path.join(uploadsDir, fileName);
      
      await fs.writeFile(filePath, file.buffer);

      // Update creator application with face verification
      const updatedApplication = await prisma.creatorApplication.update({
        where: { userId },
        data: {
          faceVerificationUrl: `/uploads/identity/${fileName}`,
          faceVerificationCompleted: true,
          faceVerificationScore: 0.95, // Mock confidence score
          updatedAt: new Date()
        }
      });

      return {
        fileName,
        filePath: `/uploads/identity/${fileName}`,
        faceVerificationCompleted: true,
        uploaded: true
      };

    } catch (error) {
      console.error('❌ Face verification upload service error:', error.message);
      throw error;
    }
  }

  /**
   * Complete identity verification process
   */
  static async completeVerification(userId) {
    try {
      // Get creator application
      const creatorApplication = await prisma.creatorApplication.findUnique({
        where: { userId },
        include: { user: true }
      });

      if (!creatorApplication) {
        throw new Error('Creator application not found');
      }

      // Check if all required documents are uploaded
      const hasDocumentFront = creatorApplication.identityDocumentUrl && 
                              creatorApplication.identityDocumentUrl !== 'pending_upload';
      const hasDocumentBack = creatorApplication.identityDocumentBackUrl;
      const hasFaceVerification = creatorApplication.faceVerificationCompleted;

      if (!hasDocumentFront || !hasDocumentBack || !hasFaceVerification) {
        throw new Error('Identity verification not ready - missing required documents');
      }

      // Update user to mark identity as verified
      const updatedUser = await prisma.$transaction(async (tx) => {
        // Update user with identityVerified flag
        const user = await tx.user.update({
          where: { id: userId },
          data: {
            // Add a custom field or use existing field
            updatedAt: new Date()
          }
        });

        // Update creator application status
        const application = await tx.creatorApplication.update({
          where: { userId },
          data: {
            status: 'UNDER_REVIEW',
            updatedAt: new Date()
          }
        });

        return { user, application };
      });

      return {
        identityVerified: true,
        status: 'UNDER_REVIEW',
        message: 'Identity verification completed successfully. Your creator application is now under review.'
      };

    } catch (error) {
      console.error('❌ Complete verification service error:', error.message);
      throw error;
    }
  }

  /**
   * Get identity verification status
   */
  static async getVerificationStatus(userId) {
    try {
      const creatorApplication = await prisma.creatorApplication.findUnique({
        where: { userId },
        include: { user: true }
      });

      if (!creatorApplication) {
        return {
          hasCreatorApplication: false,
          identityVerified: false,
          status: null
        };
      }

      const hasDocumentFront = creatorApplication.identityDocumentUrl && 
                              creatorApplication.identityDocumentUrl !== 'pending_upload';
      const hasDocumentBack = !!creatorApplication.identityDocumentBackUrl;
      const hasFaceVerification = creatorApplication.faceVerificationCompleted;

      const identityVerified = hasDocumentFront && hasDocumentBack && hasFaceVerification;

      return {
        hasCreatorApplication: true,
        identityVerified,
        status: creatorApplication.status,
        documents: {
          frontUploaded: hasDocumentFront,
          backUploaded: hasDocumentBack,
          faceVerificationCompleted: hasFaceVerification
        },
        applicationDetails: {
          documentType: creatorApplication.identityDocumentType,
          submittedAt: creatorApplication.createdAt,
          lastUpdated: creatorApplication.updatedAt
        }
      };

    } catch (error) {
      console.error('❌ Get verification status service error:', error.message);
      throw error;
    }
  }
}

module.exports = IdentityVerificationService;
