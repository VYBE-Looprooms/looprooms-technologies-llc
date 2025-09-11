const crypto = require('crypto');
const prisma = require('../config/database');

// In-memory storage for verification sessions (use Redis in production)
const verificationSessions = new Map();

class MobileVerificationService {
  /**
   * Create a mobile verification session for desktop users
   */
  static async createMobileSession(userId) {
    try {
      // Generate a unique session ID
      const sessionId = crypto.randomBytes(32).toString('hex');
      const qrToken = crypto.randomBytes(16).toString('hex');
      
      // Create session data
      const sessionData = {
        userId,
        sessionId,
        qrToken,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        status: 'pending',
        completedSteps: [],
        deviceInfo: null
      };
      
      // Store session (use Redis in production)
      verificationSessions.set(sessionId, sessionData);
      
      // Clean up expired sessions
      this.cleanupExpiredSessions();
      
      console.log(`📱 Mobile verification session created: ${sessionId} for user ${userId}`);
      
      return {
        sessionId,
        qrToken,
        mobileUrl: `http://192.168.3.10:8080/mobile-verification?session=${sessionId}&token=${qrToken}`,
        expiresAt: sessionData.expiresAt
      };
      
    } catch (error) {
      console.error('❌ Error creating mobile session:', error.message);
      throw error;
    }
  }
  
  /**
   * Validate mobile session and return user info
   */
  static async validateMobileSession(sessionId, qrToken) {
    try {
      const session = verificationSessions.get(sessionId);
      
      if (!session) {
        throw new Error('Session not found or expired');
      }
      
      if (session.qrToken !== qrToken) {
        throw new Error('Invalid session token');
      }
      
      if (new Date() > session.expiresAt) {
        verificationSessions.delete(sessionId);
        throw new Error('Session expired');
      }
      
      // Get user info
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: {
          profile: true,
          creatorApplication: true
        }
      });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return {
        session,
        user: {
          id: user.id,
          email: user.email,
          profile: user.profile,
          creatorApplication: user.creatorApplication
        }
      };
      
    } catch (error) {
      console.error('❌ Error validating mobile session:', error.message);
      throw error;
    }
  }
  
  /**
   * Update session progress
   */
  static async updateSessionProgress(sessionId, step, data = {}) {
    try {
      const session = verificationSessions.get(sessionId);
      
      if (!session) {
        throw new Error('Session not found');
      }
      
      if (new Date() > session.expiresAt) {
        verificationSessions.delete(sessionId);
        throw new Error('Session expired');
      }
      
      // Update session data
      session.completedSteps.push({
        step,
        completedAt: new Date(),
        data
      });
      
      session.lastUpdated = new Date();
      
      verificationSessions.set(sessionId, session);
      
      console.log(`📱 Session ${sessionId} progress updated: ${step}`);
      
      return session;
      
    } catch (error) {
      console.error('❌ Error updating session progress:', error.message);
      throw error;
    }
  }
  
  /**
   * Complete mobile verification session
   */
  static async completeSession(sessionId) {
    try {
      const session = verificationSessions.get(sessionId);
      
      if (!session) {
        throw new Error('Session not found');
      }
      
      // Check if all required steps are completed
      const requiredSteps = ['id_front', 'id_back', 'face_verification'];
      const completedStepNames = session.completedSteps.map(s => s.step);
      
      const allStepsCompleted = requiredSteps.every(step => 
        completedStepNames.includes(step)
      );
      
      if (!allStepsCompleted) {
        throw new Error('Not all verification steps completed');
      }
      
      // Mark session as completed
      session.status = 'completed';
      session.completedAt = new Date();
      
      verificationSessions.set(sessionId, session);
      
      console.log(`✅ Mobile verification session completed: ${sessionId}`);
      
      return session;
      
    } catch (error) {
      console.error('❌ Error completing session:', error.message);
      throw error;
    }
  }
  
  /**
   * Get session status for desktop polling
   */
  static async getSessionStatus(sessionId) {
    try {
      const session = verificationSessions.get(sessionId);
      
      if (!session) {
        return { status: 'not_found' };
      }
      
      if (new Date() > session.expiresAt) {
        verificationSessions.delete(sessionId);
        return { status: 'expired' };
      }
      
      return {
        status: session.status,
        completedSteps: session.completedSteps.map(s => s.step),
        totalSteps: 3,
        lastUpdated: session.lastUpdated || session.createdAt
      };
      
    } catch (error) {
      console.error('❌ Error getting session status:', error.message);
      throw error;
    }
  }
  
  /**
   * Clean up expired sessions
   */
  static cleanupExpiredSessions() {
    const now = new Date();
    
    for (const [sessionId, session] of verificationSessions.entries()) {
      if (now > session.expiresAt) {
        verificationSessions.delete(sessionId);
        console.log(`🧹 Cleaned up expired session: ${sessionId}`);
      }
    }
  }
  
  /**
   * Delete session
   */
  static deleteSession(sessionId) {
    const deleted = verificationSessions.delete(sessionId);
    if (deleted) {
      console.log(`🗑️ Session deleted: ${sessionId}`);
    }
    return deleted;
  }
}

module.exports = MobileVerificationService;
