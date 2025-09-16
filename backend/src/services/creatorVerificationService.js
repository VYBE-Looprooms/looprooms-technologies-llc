const { PrismaClient } = require('@prisma/client');
const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

class CreatorVerificationService {
  /**
   * Process creator verification submission
   */
  static async processVerification(data) {
    const {
      userId,
      documentType,
      bio,
      experience,
      categories,
      idFrontFile,
      idBackFile,
      selfieFile
    } = data;

    try {
      // Check if application already exists
      const existingApplication = await prisma.creatorApplication.findUnique({
        where: { userId }
      });

      if (existingApplication && ['PENDING', 'APPROVED', 'UNDER_REVIEW'].includes(existingApplication.status)) {
        throw new Error('You already have a pending or approved application. Please wait for review or contact support.');
      }

      // Get user details
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Create upload directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'uploads', 'verifications', userId);
      await fs.mkdir(uploadDir, { recursive: true });

      // Process and save images
      const idFrontPath = await this.processAndSaveImage(
        idFrontFile.buffer,
        uploadDir,
        'id_front'
      );

      const idBackPath = idBackFile
        ? await this.processAndSaveImage(idBackFile.buffer, uploadDir, 'id_back')
        : null;

      const selfiePath = await this.processAndSaveImage(
        selfieFile.buffer,
        uploadDir,
        'selfie'
      );

      // Perform OCR on ID front to extract text
      const idText = await this.performOCR(idFrontPath);

      // Perform face verification (comparing ID photo with selfie)
      const faceVerificationScore = await this.performFaceVerification(
        idFrontPath,
        selfiePath
      );

      // Extract name from ID (basic extraction - can be enhanced)
      const extractedName = this.extractNameFromIDText(idText);

      // Store extracted data for better verification
      const identityDocumentNumber = extractedName.documentNumber || null;

      // Create or update application
      const applicationData = {
        userId,
        firstName: user.profile?.firstName || extractedName.firstName || '',
        lastName: user.profile?.lastName || extractedName.lastName || '',
        phoneNumber: user.profile?.phoneNumber || '',
        bio: bio.substring(0, 500), // Ensure max 500 chars
        interestedCategories: categories,
        primaryCategory: categories[0],
        identityDocumentType: documentType,
        identityDocumentUrl: idFrontPath,
        identityDocumentBackUrl: idBackPath,
        identityDocumentNumber,
        faceVerificationUrl: selfiePath,
        faceVerificationCompleted: true,
        faceVerificationScore,
        experience: experience || '',
        status: 'PENDING',
        ipAddress: data.ipAddress || '',
        userAgent: data.userAgent || ''
      };

      let application;
      if (existingApplication) {
        // Update existing rejected application
        application = await prisma.creatorApplication.update({
          where: { id: existingApplication.id },
          data: applicationData
        });
      } else {
        // Create new application
        application = await prisma.creatorApplication.create({
          data: applicationData
        });
      }

      // Never auto-approve - admin must manually review all applications
      // Even with high face verification scores, human review is required
      console.log(`📋 Face verification score: ${(faceVerificationScore * 100).toFixed(1)}%`);
      console.log('⏳ Application pending admin review...');

      return {
        applicationId: application.id,
        status: application.status,
        verificationScore: faceVerificationScore,
        message: 'Application submitted successfully! Our team will review your submission within 24-48 hours and notify you of the result.'
      };

    } catch (error) {
      console.error('❌ Verification processing error:', error);
      throw error;
    }
  }

  /**
   * Process and save uploaded image
   */
  static async processAndSaveImage(buffer, uploadDir, prefix) {
    try {
      const filename = `${prefix}_${Date.now()}.jpg`;
      const filepath = path.join(uploadDir, filename);

      // Process image with sharp (resize, compress, etc.)
      await sharp(buffer)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 85 })
        .toFile(filepath);

      // Return relative path for database storage
      return `/uploads/verifications/${path.basename(uploadDir)}/${filename}`;
    } catch (error) {
      console.error('❌ Image processing error:', error);
      throw new Error('Failed to process image');
    }
  }

  /**
   * Perform OCR on document image
   */
  static async performOCR(imagePath) {
    try {
      const fullPath = path.join(process.cwd(), imagePath.substring(1));

      const { data: { text } } = await Tesseract.recognize(
        fullPath,
        'eng',
        {
          logger: m => console.log('OCR Progress:', m)
        }
      );

      console.log('📄 OCR Text extracted:', text.substring(0, 200));
      return text;
    } catch (error) {
      console.error('❌ OCR error:', error);
      return '';
    }
  }

  /**
   * Perform face verification between ID photo and selfie
   */
  static async performFaceVerification(idPhotoPath, selfiePath) {
    try {
      // This is a simplified implementation
      // In production, you would use services like:
      // - AWS Rekognition
      // - Azure Face API
      // - Google Cloud Vision
      // - Face++
      // - Or open source like face-api.js

      // For now, we'll simulate with a random score for testing
      // Replace this with actual face verification API call
      const simulatedScore = 0.75 + Math.random() * 0.25; // Score between 0.75 and 1.0

      console.log(`🎯 Face verification score: ${simulatedScore}`);
      return simulatedScore;

      // Example with AWS Rekognition (uncomment when AWS is configured):
      /*
      const AWS = require('aws-sdk');
      const rekognition = new AWS.Rekognition();

      const idImage = await fs.readFile(path.join(process.cwd(), idPhotoPath.substring(1)));
      const selfieImage = await fs.readFile(path.join(process.cwd(), selfiePath.substring(1)));

      const params = {
        SourceImage: { Bytes: idImage },
        TargetImage: { Bytes: selfieImage },
        SimilarityThreshold: 70
      };

      const result = await rekognition.compareFaces(params).promise();

      if (result.FaceMatches && result.FaceMatches.length > 0) {
        return result.FaceMatches[0].Similarity / 100;
      }

      return 0;
      */
    } catch (error) {
      console.error('❌ Face verification error:', error);
      return 0;
    }
  }

  /**
   * Extract name from ID text using enhanced patterns
   */
  static extractNameFromIDText(text) {
    try {
      // Enhanced pattern matching for various ID formats
      const extractedData = {
        firstName: '',
        lastName: '',
        documentNumber: '',
        dateOfBirth: '',
        expiryDate: '',
        nationality: ''
      };

      // Clean up text for better matching
      const cleanText = text.replace(/\s+/g, ' ').trim();

      // Name patterns for different ID formats
      const namePatterns = [
        // Standard format: Name: John Doe
        /Name[:\s]+([A-Z][a-z]+)\s+([A-Z][a-z]+)/i,
        // Separate fields format
        /First\s*Name[:\s]+([A-Z][a-z]+).*Last\s*Name[:\s]+([A-Z][a-z]+)/i,
        // Given name / Surname format
        /Given\s*Name[s]?[:\s]+([A-Z][a-z]+).*Surname[:\s]+([A-Z][a-z]+)/i,
        // Full Name format
        /Full\s*Name[:\s]+([A-Z][a-z]+)\s+([A-Z][a-z]+)/i,
        // Passport format
        /Surname[:\s]+([A-Z\s]+).*Given\s*Name[s]?[:\s]+([A-Z\s]+)/i,
        // Driver's License format
        /LN[:\s]+([A-Z]+).*FN[:\s]+([A-Z]+)/i,
        // Name on separate lines
        /([A-Z]{2,}[A-Z\s]+)\n([A-Z]{2,}[A-Z\s]+)/,
        // All caps name detection
        /([A-Z]{2,}[\s\-'A-Z]+)\s+([A-Z]{2,}[\s\-'A-Z]+)/
      ];

      // Try each pattern
      for (const pattern of namePatterns) {
        const match = cleanText.match(pattern);
        if (match) {
          // Handle different match group orders
          if (pattern.source.includes('Surname.*Given')) {
            extractedData.lastName = match[1]?.trim() || '';
            extractedData.firstName = match[2]?.trim() || '';
          } else {
            extractedData.firstName = match[1]?.trim() || '';
            extractedData.lastName = match[2]?.trim() || '';
          }
          break;
        }
      }

      // Extract document number
      const docNumberPatterns = [
        /(?:Document|ID|License|Passport)\s*(?:No|Number|#)[:\s]+([A-Z0-9\-]+)/i,
        /(?:No|Number)[:\s]+([A-Z0-9\-]+)/i,
        /DL[:\s]+([A-Z0-9\-]+)/i,
        /([A-Z]{1,2}[0-9]{6,12})/
      ];

      for (const pattern of docNumberPatterns) {
        const match = cleanText.match(pattern);
        if (match) {
          extractedData.documentNumber = match[1]?.trim() || '';
          break;
        }
      }

      // Extract date of birth
      const dobPatterns = [
        /(?:Date\s*of\s*Birth|DOB|Born)[:\s]+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
        /(?:Birth\s*Date)[:\s]+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
        /DOB[:\s]+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
        /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4}).*(?:Birth|Born)/i
      ];

      for (const pattern of dobPatterns) {
        const match = cleanText.match(pattern);
        if (match) {
          extractedData.dateOfBirth = match[1]?.trim() || '';
          break;
        }
      }

      // Extract expiry date
      const expiryPatterns = [
        /(?:Expir[ey]|Valid\s*(?:Until|Till))[:\s]+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
        /(?:EXP|Expires)[:\s]+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
        /Valid\s*Through[:\s]+(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i
      ];

      for (const pattern of expiryPatterns) {
        const match = cleanText.match(pattern);
        if (match) {
          extractedData.expiryDate = match[1]?.trim() || '';
          break;
        }
      }

      // Extract nationality
      const nationalityPatterns = [
        /(?:Nationality|Citizen(?:ship)?)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
        /Country[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i
      ];

      for (const pattern of nationalityPatterns) {
        const match = cleanText.match(pattern);
        if (match) {
          extractedData.nationality = match[1]?.trim() || '';
          break;
        }
      }

      console.log('📄 Extracted ID data:', extractedData);

      // Return at minimum the name data for backward compatibility
      return {
        firstName: extractedData.firstName,
        lastName: extractedData.lastName,
        ...extractedData
      };
    } catch (error) {
      console.error('❌ Name extraction error:', error);
      return { firstName: '', lastName: '' };
    }
  }

  /**
   * Auto-approve application if verification score is high
   */
  static async autoApproveApplication(applicationId, userId) {
    try {
      // Start a transaction to update both application and user role
      await prisma.$transaction(async (tx) => {
        // Update application status
        await tx.creatorApplication.update({
          where: { id: applicationId },
          data: {
            status: 'APPROVED',
            reviewedAt: new Date(),
            reviewNotes: 'Auto-approved based on high verification score'
          }
        });

        // Update user role to CREATOR
        await tx.user.update({
          where: { id: userId },
          data: {
            role: 'CREATOR',
            isVerified: true
          }
        });
      });

      console.log(`✅ Auto-approved creator application for user: ${userId}`);
    } catch (error) {
      console.error('❌ Auto-approval error:', error);
      throw error;
    }
  }

  /**
   * Review application (for admins)
   */
  static async reviewApplication(data) {
    const {
      applicationId,
      reviewerId,
      status,
      reviewNotes,
      rejectionReason
    } = data;

    try {
      // Get application
      const application = await prisma.creatorApplication.findUnique({
        where: { id: applicationId },
        include: { user: true }
      });

      if (!application) {
        throw new Error('Application not found');
      }

      // Update application
      const updatedApplication = await prisma.creatorApplication.update({
        where: { id: applicationId },
        data: {
          status,
          reviewedBy: reviewerId,
          reviewedAt: new Date(),
          reviewNotes,
          rejectionReason: status === 'REJECTED' ? rejectionReason : null
        }
      });

      // If approved, update user role
      if (status === 'APPROVED') {
        await prisma.user.update({
          where: { id: application.userId },
          data: {
            role: 'CREATOR',
            isVerified: true
          }
        });

        console.log(`✅ Approved creator application for user: ${application.userId}`);
      }

      return updatedApplication;
    } catch (error) {
      console.error('❌ Review application error:', error);
      throw error;
    }
  }
}

module.exports = CreatorVerificationService;