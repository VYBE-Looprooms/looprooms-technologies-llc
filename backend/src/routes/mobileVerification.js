const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const MobileVerificationService = require('../services/mobileVerificationService');
const identityVerificationService = require('../services/identityVerificationService');
const { authenticateToken } = require('../middleware/auth');

/**
 * @route POST /api/mobile-verification/create-session
 * @desc Create a mobile verification session for desktop users
 * @access Private
 */
router.post('/create-session', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log(`📱 Creating mobile verification session for user: ${userId}`);
    
    const sessionData = await MobileVerificationService.createMobileSession(userId);
    
    res.json({
      success: true,
      message: 'Mobile verification session created',
      data: sessionData
    });
    
  } catch (error) {
    console.error('❌ Error creating mobile session:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create mobile verification session',
      error: error.message
    });
  }
});

/**
 * @route GET /api/mobile-verification/validate/:sessionId
 * @desc Validate mobile session and get user info
 * @access Public (uses session token)
 */
router.get('/validate/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Session token is required'
      });
    }
    
    console.log(`📱 Validating mobile session: ${sessionId}`);
    
    const { session, user } = await MobileVerificationService.validateMobileSession(sessionId, token);
    
    res.json({
      success: true,
      message: 'Session validated successfully',
      data: {
        sessionId,
        user: {
          id: user.id,
          email: user.email,
          name: user.profile?.firstName || 'User'
        },
        status: session.status,
        completedSteps: session.completedSteps.map(s => s.step)
      }
    });
    
  } catch (error) {
    console.error('❌ Error validating mobile session:', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route POST /api/mobile-verification/:sessionId/upload-document
 * @desc Upload identity document via mobile session
 * @access Public (uses session token)
 */
router.post('/:sessionId/upload-document', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { token, side, imageData } = req.body;
    
    if (!token || !side || !imageData) {
      return res.status(400).json({
        success: false,
        message: 'Session token, document side, and image data are required'
      });
    }
    
    // Validate session
    const { session, user } = await MobileVerificationService.validateMobileSession(sessionId, token);
    
    console.log(`📱 Mobile document upload - Session: ${sessionId}, Side: ${side}, User: ${user.id}`);
    
    // Convert base64 to buffer and save
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Create a file-like object for the uploadDocument method
    const fileObject = {
      buffer: buffer,
      mimetype: 'image/jpeg',
      originalname: `${side}_document.jpg`
    };
    
    // Save document using identity verification service
    const result = await identityVerificationService.uploadDocument(user.id, fileObject, 'NATIONAL_ID', side);
    
    // Update session progress
    await MobileVerificationService.updateSessionProgress(sessionId, `id_${side}`, {
      filename: result.fileName,
      uploadedAt: new Date()
    });
    
    res.json({
      success: true,
      message: `${side.toUpperCase()} document uploaded successfully`,
      data: {
        filename: result.fileName,
        step: `id_${side}`,
        sessionId
      }
    });
    
  } catch (error) {
    console.error('❌ Error uploading document via mobile:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to upload document',
      error: error.message
    });
  }
});

/**
 * @route POST /api/mobile-verification/:sessionId/upload-face
 * @desc Upload face verification photo via mobile session
 * @access Public (uses session token)
 */
router.post('/:sessionId/upload-face', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { token, imageData } = req.body;
    
    if (!token || !imageData) {
      return res.status(400).json({
        success: false,
        message: 'Session token and image data are required'
      });
    }
    
    // Validate session
    const { session, user } = await MobileVerificationService.validateMobileSession(sessionId, token);
    
    console.log(`📱 Mobile face upload - Session: ${sessionId}, User: ${user.id}`);
    
    // Convert base64 to buffer and save
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Create a file-like object for the uploadFaceVerification method
    const fileObject = {
      buffer: buffer,
      mimetype: 'image/jpeg',
      originalname: `face_verification.jpg`
    };
    
    // Save face photo using identity verification service
    const result = await identityVerificationService.uploadFaceVerification(user.id, fileObject);
    
    // Update session progress
    await MobileVerificationService.updateSessionProgress(sessionId, 'face_verification', {
      filename: result.fileName,
      uploadedAt: new Date()
    });
    
    res.json({
      success: true,
      message: 'Face verification photo uploaded successfully',
      data: {
        filename: result.fileName,
        step: 'face_verification',
        sessionId
      }
    });
    
  } catch (error) {
    console.error('❌ Error uploading face photo via mobile:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to upload face verification photo',
      error: error.message
    });
  }
});

/**
 * @route POST /api/mobile-verification/:sessionId/complete
 * @desc Complete mobile verification session
 * @access Public (uses session token)
 */
router.post('/:sessionId/complete', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Session token is required'
      });
    }
    
    // Validate session
    const { session, user } = await MobileVerificationService.validateMobileSession(sessionId, token);
    
    console.log(`📱 Completing mobile verification - Session: ${sessionId}, User: ${user.id}`);
    
    // Complete the session
    await MobileVerificationService.completeSession(sessionId);
    
    // Update user's verification status in database
    await identityVerificationService.completeVerification(user.id);
    
    res.json({
      success: true,
      message: 'Mobile verification completed successfully',
      data: {
        sessionId,
        completedAt: new Date(),
        userId: user.id
      }
    });
    
  } catch (error) {
    console.error('❌ Error completing mobile verification:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to complete mobile verification',
      error: error.message
    });
  }
});

/**
 * @route GET /api/mobile-verification/status/:sessionId
 * @desc Get verification session status for desktop polling
 * @access Private
 */
router.get('/status/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    
    console.log(`📱 Checking session status - Session: ${sessionId}, User: ${userId}`);
    
    const status = await MobileVerificationService.getSessionStatus(sessionId);
    
    res.json({
      success: true,
      data: status
    });
    
  } catch (error) {
    console.error('❌ Error getting session status:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get session status',
      error: error.message
    });
  }
});

/**
 * @route DELETE /api/mobile-verification/:sessionId
 * @desc Cancel/delete mobile verification session
 * @access Private
 */
router.delete('/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    
    console.log(`📱 Deleting session - Session: ${sessionId}, User: ${userId}`);
    
    const deleted = MobileVerificationService.deleteSession(sessionId);
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Mobile verification session cancelled'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
  } catch (error) {
    console.error('❌ Error deleting session:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete session',
      error: error.message
    });
  }
});

/**
 * @route POST /api/mobile-verification/create-test-session
 * @desc Create a test mobile verification session (no auth required)
 * @access Public - FOR TESTING ONLY
 */
router.post('/create-test-session', async (req, res) => {
  try {
    console.log('📱 Creating TEST mobile verification session (no auth)');
    
    // Use a test user ID for demo purposes
    const testUserId = 'test-user-desktop-qr';
    
    const sessionData = await MobileVerificationService.createMobileSession(testUserId);
    
    res.json({
      success: true,
      message: 'Test mobile verification session created',
      data: sessionData
    });
    
  } catch (error) {
    console.error('❌ Error creating test mobile session:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create test mobile verification session',
      error: error.message
    });
  }
});

module.exports = router;
