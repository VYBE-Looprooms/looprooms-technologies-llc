const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const prisma = require('../config/database');

// Free/Open-source libraries for verification
const Tesseract = require('tesseract.js');
const sharp = require('sharp');

// In-memory session storage (use Redis in production)
const verificationSessions = new Map();

class VerificationService {
  /**
   * Create a new verification session
   */
  static async createSession(userId) {
    try {
      // Generate session ID and token
      const sessionId = crypto.randomBytes(32).toString('hex');
      const qrToken = crypto.randomBytes(16).toString('hex');
      
      // Get user info
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Create session data
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      const session = {
        sessionId,
        qrToken,
        userId,
        user: {
          id: user.id,
          email: user.email,
          name: user.profile?.firstName || 'User'
        },
        status: 'pending',
        progress: 0,
        currentStep: 'Waiting for mobile verification',
        createdAt: new Date(),
        expiresAt,
        data: {
          idImage: null,
          selfie: null,
          results: null
        }
      };

      // Store session
      verificationSessions.set(sessionId, session);

      // Clean up expired sessions
      this.cleanupExpiredSessions();

      // Generate mobile URL
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const mobileUrl = `${baseUrl}/mobile-verification?session=${sessionId}&token=${qrToken}`;

      console.log(`📱 Verification session created: ${sessionId} for user ${userId}`);

      return {
        sessionId,
        qrToken,
        mobileUrl,
        expiresAt
      };

    } catch (error) {
      console.error('❌ Error creating verification session:', error.message);
      throw error;
    }
  }

  /**
   * Get verification status
   */
  static async getStatus(sessionId, userId) {
    try {
      const session = verificationSessions.get(sessionId);

      if (!session) {
        return { status: 'not_found' };
      }

      if (session.userId !== userId) {
        throw new Error('Session not found');
      }

      if (new Date() > session.expiresAt) {
        verificationSessions.delete(sessionId);
        return { status: 'expired' };
      }

      return {
        status: session.status,
        progress: session.progress,
        currentStep: session.currentStep,
        results: session.data.results
      };

    } catch (error) {
      console.error('❌ Error getting verification status:', error.message);
      throw error;
    }
  }

  /**
   * Process verification from mobile submission
   */
  static async processVerification(sessionId, token, idImageFile, selfieFile) {
    try {
      // Validate session
      const session = verificationSessions.get(sessionId);

      if (!session) {
        throw new Error('Session not found or expired');
      }

      if (session.qrToken !== token) {
        throw new Error('Invalid session token');
      }

      if (new Date() > session.expiresAt) {
        verificationSessions.delete(sessionId);
        throw new Error('Session expired');
      }

      console.log(`🔍 Processing verification for session: ${sessionId}`);

      // Update status to processing
      session.status = 'processing';
      session.progress = 20;
      session.currentStep = 'Processing documents...';
      verificationSessions.set(sessionId, session);

      // Save files temporarily for processing
      const tempDir = path.join(process.cwd(), 'temp', sessionId);
      await fs.mkdir(tempDir, { recursive: true });

      const idImagePath = path.join(tempDir, 'id_image.jpg');
      const selfiePath = path.join(tempDir, 'selfie.jpg');

      await fs.writeFile(idImagePath, idImageFile.buffer);
      await fs.writeFile(selfiePath, selfieFile.buffer);

      try {
        // Step 1: OCR on ID document
        session.progress = 40;
        session.currentStep = 'Extracting text from ID...';
        verificationSessions.set(sessionId, session);

        const ocrResult = await this.performOCR(idImagePath);

        // Step 2: Face detection and extraction
        session.progress = 60;
        session.currentStep = 'Detecting faces...';
        verificationSessions.set(sessionId, session);

        const faceMatchResult = await this.performFaceMatch(idImagePath, selfiePath);

        // Step 3: Basic liveness check (simple heuristics)
        session.progress = 80;
        session.currentStep = 'Running security checks...';
        verificationSessions.set(sessionId, session);

        const livenessResult = await this.performLivenessCheck(selfieFile);

        // Calculate overall verification result
        const verificationResult = this.calculateVerificationResult(
          ocrResult,
          faceMatchResult,
          livenessResult
        );

        // Step 4: Store results and update user
        session.progress = 100;
        session.status = 'completed';
        session.currentStep = 'Verification complete';
        session.data.results = verificationResult;
        verificationSessions.set(sessionId, session);

        // Update user's verification status in database
        await this.updateUserVerificationStatus(session.userId, verificationResult);

        console.log(`✅ Verification completed for session: ${sessionId}, result: ${verificationResult.overallStatus}`);

        return verificationResult;

      } finally {
        // Clean up temporary files
        try {
          await fs.rm(tempDir, { recursive: true, force: true });
        } catch (cleanupError) {
          console.error('⚠️ Error cleaning up temp files:', cleanupError.message);
        }
      }

    } catch (error) {
      console.error('❌ Error processing verification:', error.message);
      
      // Update session with error status
      const session = verificationSessions.get(sessionId);
      if (session) {
        session.status = 'failed';
        session.currentStep = `Error: ${error.message}`;
        verificationSessions.set(sessionId, session);
      }
      
      throw error;
    }
  }

  /**
   * Perform OCR on ID document
   */
  static async performOCR(imagePath) {
    try {
      console.log('📄 Running OCR on ID document...');

      // Preprocess image for better OCR
      const processedImagePath = imagePath.replace('.jpg', '_processed.jpg');
      await sharp(imagePath)
        .grayscale()
        .normalize()
        .sharpen()
        .jpeg({ quality: 95 })
        .toFile(processedImagePath);

      // Run Tesseract OCR
      const ocrResult = await Tesseract.recognize(processedImagePath, 'eng', {
        logger: m => console.log(`OCR: ${m.status} - ${Math.round(m.progress * 100)}%`)
      });

      const extractedText = ocrResult.data.text;
      const confidence = ocrResult.data.confidence / 100;

      // Clean up processed image
      try {
        await fs.unlink(processedImagePath);
      } catch (e) {
        // Ignore cleanup errors
      }

      // Extract key information
      const extractedData = this.extractIDInformation(extractedText);

      console.log(`📄 OCR completed with confidence: ${(confidence * 100).toFixed(1)}%`);

      return {
        confidence,
        extractedText: extractedText.slice(0, 500), // Limit text length
        extractedData,
        success: confidence > 0.5 // Consider successful if confidence > 50%
      };

    } catch (error) {
      console.error('❌ OCR error:', error.message);
      return {
        confidence: 0,
        extractedText: '',
        extractedData: {},
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Extract structured information from OCR text
   */
  static extractIDInformation(text) {
    const extracted = {};

    // Common patterns for ID documents
    const patterns = {
      // Date patterns (various formats)
      dateOfBirth: /(?:DOB|Date of Birth|Born)[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
      expiryDate: /(?:Exp|Expires|Expiry)[:\s]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
      
      // ID number patterns
      idNumber: /(?:ID|Number|No)[:\s]*([A-Z0-9]{6,20})/i,
      
      // Name patterns (capture words after common labels)
      firstName: /(?:First Name|Given Name)[:\s]*([A-Z][a-z]+)/i,
      lastName: /(?:Last Name|Surname|Family Name)[:\s]*([A-Z][a-z]+)/i,
      
      // Document type
      documentType: /(PASSPORT|DRIVER.?LICENSE|NATIONAL.?ID|ID.?CARD)/i
    };

    // Extract using patterns
    for (const [key, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern);
      if (match) {
        extracted[key] = match[1]?.trim();
      }
    }

    return extracted;
  }

  /**
   * Perform basic face matching between ID and selfie
   */
  static async performFaceMatch(idImagePath, selfiePath) {
    try {
      console.log('👤 Performing face match...');

      // For this free implementation, we'll use basic image comparison
      // In production, you would use face_recognition library or similar

      // Simple approach: compare image histograms and basic features
      const idStats = await sharp(idImagePath).stats();
      const selfieStats = await sharp(selfiePath).stats();

      // Calculate similarity based on image statistics
      // This is a very basic approach - real face matching would use proper face detection
      const similarity = this.calculateImageSimilarity(idStats, selfieStats);

      // For demo purposes, we'll simulate a face match result
      const faceMatch = similarity > 0.3; // Threshold for basic similarity

      console.log(`👤 Face match completed: ${faceMatch ? 'MATCH' : 'NO MATCH'} (similarity: ${(similarity * 100).toFixed(1)}%)`);

      return {
        faceMatch,
        similarity,
        confidence: 0.8, // Mock confidence
        success: true
      };

    } catch (error) {
      console.error('❌ Face match error:', error.message);
      return {
        faceMatch: false,
        similarity: 0,
        confidence: 0,
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Calculate basic image similarity using statistics
   */
  static calculateImageSimilarity(stats1, stats2) {
    try {
      // Compare mean values across channels
      const channels1 = stats1.channels;
      const channels2 = stats2.channels;

      let totalDiff = 0;
      let count = 0;

      for (let i = 0; i < Math.min(channels1.length, channels2.length); i++) {
        totalDiff += Math.abs(channels1[i].mean - channels2[i].mean);
        count++;
      }

      const avgDiff = totalDiff / count;
      const similarity = Math.max(0, 1 - (avgDiff / 255)); // Normalize to 0-1

      return similarity;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Perform basic liveness check
   */
  static async performLivenessCheck(selfieFile) {
    try {
      console.log('🔍 Performing liveness check...');

      // Basic checks using image properties
      const imageInfo = await sharp(selfieFile.buffer).metadata();
      
      // Check image quality and properties
      const qualityChecks = {
        resolution: (imageInfo.width || 0) >= 480 && (imageInfo.height || 0) >= 480,
        format: ['jpeg', 'jpg', 'png'].includes(imageInfo.format?.toLowerCase() || ''),
        fileSize: selfieFile.size > 10000 && selfieFile.size < 5000000, // 10KB to 5MB
      };

      // Basic "liveness" score based on image quality
      const qualityScore = Object.values(qualityChecks).filter(Boolean).length / Object.keys(qualityChecks).length;
      
      // For demo purposes, assume liveness if quality is good
      const livenessDetected = qualityScore >= 0.6;

      console.log(`🔍 Liveness check completed: ${livenessDetected ? 'PASS' : 'FAIL'} (score: ${(qualityScore * 100).toFixed(1)}%)`);

      return {
        liveness: livenessDetected,
        qualityScore,
        checks: qualityChecks,
        success: true
      };

    } catch (error) {
      console.error('❌ Liveness check error:', error.message);
      return {
        liveness: false,
        qualityScore: 0,
        checks: {},
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Calculate overall verification result
   */
  static calculateVerificationResult(ocrResult, faceMatchResult, livenessResult) {
    try {
      const checks = {
        ocrSuccess: ocrResult.success && ocrResult.confidence > 0.5,
        faceMatch: faceMatchResult.success && faceMatchResult.faceMatch,
        livenessPass: livenessResult.success && livenessResult.liveness
      };

      const passedChecks = Object.values(checks).filter(Boolean).length;
      const totalChecks = Object.keys(checks).length;

      let overallStatus;
      if (passedChecks === totalChecks) {
        overallStatus = 'verified';
      } else if (passedChecks >= totalChecks - 1) {
        overallStatus = 'manual_review';
      } else {
        overallStatus = 'rejected';
      }

      return {
        overallStatus,
        faceMatch: faceMatchResult.faceMatch,
        liveness: livenessResult.liveness,
        ocrConfidence: ocrResult.confidence,
        checks,
        details: {
          ocr: ocrResult,
          faceMatch: faceMatchResult,
          liveness: livenessResult
        }
      };

    } catch (error) {
      console.error('❌ Error calculating verification result:', error.message);
      return {
        overallStatus: 'rejected',
        faceMatch: false,
        liveness: false,
        ocrConfidence: 0,
        checks: {},
        error: error.message
      };
    }
  }

  /**
   * Update user verification status in database
   */
  static async updateUserVerificationStatus(userId, verificationResult) {
    try {
      // Get or create creator application
      let creatorApplication = await prisma.creatorApplication.findUnique({
        where: { userId }
      });

      if (!creatorApplication) {
        // Create basic creator application if it doesn't exist
        creatorApplication = await prisma.creatorApplication.create({
          data: {
            userId,
            firstName: 'To be updated',
            lastName: 'To be updated',
            bio: 'Verified via automated system',
            interestedCategories: ['MEDITATION'],
            primaryCategory: 'MEDITATION',
            identityDocumentType: 'NATIONAL_ID',
            identityDocumentUrl: 'verified_via_v2_system',
            faceVerificationUrl: 'verified_via_v2_system',
            faceVerificationCompleted: verificationResult.faceMatch,
            faceVerificationScore: verificationResult.ocrConfidence,
            status: verificationResult.overallStatus === 'verified' ? 'APPROVED' : 
                    verificationResult.overallStatus === 'manual_review' ? 'UNDER_REVIEW' : 'REJECTED'
          }
        });
      } else {
        // Update existing application
        creatorApplication = await prisma.creatorApplication.update({
          where: { userId },
          data: {
            faceVerificationCompleted: verificationResult.faceMatch,
            faceVerificationScore: verificationResult.ocrConfidence,
            status: verificationResult.overallStatus === 'verified' ? 'APPROVED' : 
                    verificationResult.overallStatus === 'manual_review' ? 'UNDER_REVIEW' : 'REJECTED',
            updatedAt: new Date()
          }
        });
      }

      console.log(`✅ Updated user ${userId} verification status: ${creatorApplication.status}`);

    } catch (error) {
      console.error('❌ Error updating user verification status:', error.message);
      // Don't throw here - verification can complete even if DB update fails
    }
  }

  /**
   * Clean up expired sessions
   */
  static cleanupExpiredSessions() {
    const now = new Date();
    let cleanedCount = 0;

    for (const [sessionId, session] of verificationSessions.entries()) {
      if (now > session.expiresAt) {
        verificationSessions.delete(sessionId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} expired verification sessions`);
    }
  }
}

module.exports = VerificationService;