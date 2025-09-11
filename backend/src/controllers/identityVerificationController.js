const IdentityVerificationService = require('../services/identityVerificationService');

class IdentityVerificationController {
  /**
   * Upload identity document (front or back)
   * POST /api/identity/upload-document
   */
  static async uploadDocument(req, res) {
    try {
      const userId = req.user.id;
      const { documentType, side } = req.body; // 'front' or 'back'
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'Document image is required',
          code: 'FILE_REQUIRED'
        });
      }

      if (!documentType || !side) {
        return res.status(400).json({
          success: false,
          message: 'Document type and side are required',
          code: 'MISSING_PARAMETERS'
        });
      }

      console.log(`📄 Document upload: ${req.user.email} - ${documentType} ${side}`);

      const result = await IdentityVerificationService.uploadDocument(
        userId, 
        file, 
        documentType, 
        side
      );

      console.log(`✅ Document uploaded successfully: ${req.user.email} - ${documentType} ${side}`);

      res.json({
        success: true,
        message: `${documentType} ${side} uploaded successfully`,
        data: result
      });

    } catch (error) {
      console.error('❌ Document upload controller error:', error.message);
      
      res.status(500).json({
        success: false,
        message: 'Document upload failed',
        code: 'UPLOAD_ERROR'
      });
    }
  }

  /**
   * Upload face verification photo
   * POST /api/identity/upload-face
   */
  static async uploadFaceVerification(req, res) {
    try {
      const userId = req.user.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message: 'Face photo is required',
          code: 'FILE_REQUIRED'
        });
      }

      console.log(`🔍 Face verification upload: ${req.user.email}`);

      const result = await IdentityVerificationService.uploadFaceVerification(userId, file);

      console.log(`✅ Face verification uploaded successfully: ${req.user.email}`);

      res.json({
        success: true,
        message: 'Face verification uploaded successfully',
        data: result
      });

    } catch (error) {
      console.error('❌ Face verification upload controller error:', error.message);
      
      res.status(500).json({
        success: false,
        message: 'Face verification upload failed',
        code: 'UPLOAD_ERROR'
      });
    }
  }

  /**
   * Complete identity verification process
   * POST /api/identity/complete
   */
  static async completeVerification(req, res) {
    try {
      const userId = req.user.id;

      console.log(`✅ Completing identity verification: ${req.user.email}`);

      const result = await IdentityVerificationService.completeVerification(userId);

      console.log(`🎉 Identity verification completed: ${req.user.email}`);

      res.json({
        success: true,
        message: 'Identity verification completed successfully',
        data: result
      });

    } catch (error) {
      console.error('❌ Complete verification controller error:', error.message);
      
      if (error.message.includes('not found') || error.message.includes('not ready')) {
        return res.status(400).json({
          success: false,
          message: error.message,
          code: 'VERIFICATION_NOT_READY'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to complete verification',
        code: 'COMPLETION_ERROR'
      });
    }
  }

  /**
   * Get identity verification status
   * GET /api/identity/status
   */
  static async getVerificationStatus(req, res) {
    try {
      const userId = req.user.id;

      const result = await IdentityVerificationService.getVerificationStatus(userId);

      res.json({
        success: true,
        message: 'Verification status retrieved successfully',
        data: result
      });

    } catch (error) {
      console.error('❌ Get verification status controller error:', error.message);
      
      res.status(500).json({
        success: false,
        message: 'Failed to get verification status',
        code: 'STATUS_ERROR'
      });
    }
  }
}

module.exports = IdentityVerificationController;
