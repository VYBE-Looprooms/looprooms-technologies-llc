const VerificationService = require('../services/verificationService');
const crypto = require('crypto');

class VerificationController {
  /**
   * Create a new verification session
   * POST /api/verification/create-session
   */
  static async createSession(req, res) {
    try {
      const userId = req.user.id;

      console.log(`📱 Creating verification session for user: ${userId}`);

      const sessionData = await VerificationService.createSession(userId);

      res.json({
        success: true,
        message: 'Verification session created successfully',
        data: sessionData
      });

    } catch (error) {
      console.error('❌ Create session error:', error.message);
      
      res.status(500).json({
        success: false,
        message: 'Failed to create verification session',
        code: 'SESSION_CREATION_ERROR'
      });
    }
  }

  /**
   * Get verification status
   * GET /api/verification/status/:sessionId
   */
  static async getStatus(req, res) {
    try {
      const { sessionId } = req.params;
      const userId = req.user.id;

      console.log(`📊 Getting verification status for session: ${sessionId}`);

      const status = await VerificationService.getStatus(sessionId, userId);

      res.json({
        success: true,
        data: status
      });

    } catch (error) {
      console.error('❌ Get status error:', error.message);
      
      if (error.message.includes('not found') || error.message.includes('expired')) {
        return res.status(404).json({
          success: false,
          message: error.message,
          code: 'SESSION_NOT_FOUND'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get verification status',
        code: 'STATUS_ERROR'
      });
    }
  }

  /**
   * Submit verification data from mobile
   * POST /api/verification/submit
   */
  static async submitVerification(req, res) {
    try {
      const { sessionId, token } = req.body;
      const files = req.files;

      if (!sessionId || !token) {
        return res.status(400).json({
          success: false,
          message: 'Session ID and token are required',
          code: 'MISSING_PARAMETERS'
        });
      }

      if (!files || !files.id_image || !files.selfie) {
        return res.status(400).json({
          success: false,
          message: 'Both ID image and selfie are required',
          code: 'MISSING_FILES'
        });
      }

      console.log(`📱 Processing verification submission for session: ${sessionId}`);

      const result = await VerificationService.processVerification(
        sessionId,
        token,
        files.id_image[0],
        files.selfie[0]
      );

      res.json({
        success: true,
        message: 'Verification processed successfully',
        data: result
      });

    } catch (error) {
      console.error('❌ Submit verification error:', error.message);
      
      if (error.message.includes('session') || error.message.includes('token')) {
        return res.status(400).json({
          success: false,
          message: error.message,
          code: 'INVALID_SESSION'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Verification processing failed',
        code: 'PROCESSING_ERROR'
      });
    }
  }
}

module.exports = VerificationController;