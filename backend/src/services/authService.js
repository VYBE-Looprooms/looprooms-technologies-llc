const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const EmailService = require('../../services/emailService');

class AuthService {
  /**
   * Hash password using bcrypt
   */
  static async hashPassword(password) {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare password with hash
   */
  static async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT token
   */
  static generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  /**
   * Register new user with email and password
   */
  static async registerUser({ email, password, username, firstName, lastName, applyForCreator = false }) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email.toLowerCase() },
            ...(username ? [{ username }] : [])
          ]
        }
      });

      if (existingUser) {
        throw new Error(existingUser.email === email.toLowerCase() 
          ? 'Email already registered' 
          : 'Username already taken'
        );
      }

      // Hash password
      const passwordHash = await this.hashPassword(password);

      // Create user and profile in transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create user
        const user = await tx.user.create({
          data: {
            email: email.toLowerCase(),
            username,
            authProvider: 'EMAIL',
            passwordHash,
            isVerified: false,
            isActive: true
          }
        });

        // Create user profile
        const profile = await tx.userProfile.create({
          data: {
            userId: user.id,
            firstName,
            lastName,
            displayName: firstName && lastName ? `${firstName} ${lastName}` : username
          }
        });

        // Create free subscription
        const subscription = await tx.subscription.create({
          data: {
            userId: user.id,
            tier: 'FREE',
            status: 'TRIAL',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
            trialStart: new Date(),
            trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
          }
        });

        // Create creator application if requested
        let creatorApplication = null;
        if (applyForCreator) {
          creatorApplication = await tx.creatorApplication.create({
            data: {
              userId: user.id,
              firstName,
              lastName,
              bio: 'Applied during registration - identity verification pending',
              interestedCategories: ['RECOVERY', 'FITNESS', 'MEDITATION'], // Default to all 3 core categories
              primaryCategory: 'RECOVERY', // Default primary category
              identityDocumentType: 'NATIONAL_ID', // Default type - will be updated during verification
              identityDocumentUrl: 'pending_upload', // Placeholder - will be updated during verification
              status: 'PENDING'
            }
          });
        }

        return { user, profile, subscription, creatorApplication };
      });

      // Send welcome/registration email (don't wait for it to complete)
      const emailService = new EmailService();
      setImmediate(async () => {
        try {
          await emailService.sendRegistrationEmail(
            result.user.email, 
            firstName || 'there', 
            !!result.creatorApplication
          );
        } catch (emailError) {
          console.error('❌ Failed to send registration email:', emailError.message);
          // Don't throw error - registration should succeed even if email fails
        }
      });

      // Generate token
      const token = this.generateToken({
        userId: result.user.id,
        email: result.user.email,
        role: result.user.role,
        subscriptionTier: result.subscription.tier
      });

      return {
        success: true,
        user: {
          id: result.user.id,
          email: result.user.email,
          username: result.user.username,
          role: result.user.role,
          isVerified: result.user.isVerified,
          profile: result.profile,
          subscription: result.subscription,
          creatorApplication: result.creatorApplication
        },
        token
      };

    } catch (error) {
      console.error('❌ Registration error:', error.message);
      throw error;
    }
  }

  /**
   * Login user with email and password
   */
  static async loginUser({ email, password }) {
    try {
      // Find user with profile and subscription
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          profile: true,
          subscriptions: {
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      if (!user.isActive) {
        throw new Error('Account has been deactivated');
      }

      // Verify password
      if (!user.passwordHash || !(await this.comparePassword(password, user.passwordHash))) {
        throw new Error('Invalid email or password');
      }

      // Update last active timestamp
      await prisma.user.update({
        where: { id: user.id },
        data: { lastActiveAt: new Date() }
      });

      // Generate token
      const token = this.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        subscriptionTier: user.subscriptions[0]?.tier || 'FREE'
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          isVerified: user.isVerified,
          profile: user.profile,
          subscription: user.subscriptions[0] || null
        },
        token
      };

    } catch (error) {
      console.error('❌ Login error:', error.message);
      throw error;
    }
  }

  /**
   * Get user by ID with full profile
   */
  static async getUserById(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: {
            include: {
              preferredCategories: true
            }
          },
          subscriptions: {
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      });

      if (!user || !user.isActive) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        isVerified: user.isVerified,
        profile: user.profile,
        subscription: user.subscriptions[0] || null,
        lastActiveAt: user.lastActiveAt
      };

    } catch (error) {
      console.error('❌ Get user error:', error.message);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId, profileData) {
    try {
      const updatedProfile = await prisma.userProfile.update({
        where: { userId },
        data: {
          ...profileData,
          updatedAt: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              role: true,
              isVerified: true
            }
          }
        }
      });

      return {
        success: true,
        profile: updatedProfile
      };

    } catch (error) {
      console.error('❌ Update profile error:', error.message);
      throw error;
    }
  }

  /**
   * Send password reset email (placeholder)
   */
  static async requestPasswordReset(email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (!user) {
        // Don't reveal if email exists or not
        return { success: true, message: 'If this email is registered, you will receive a password reset link.' };
      }

      // TODO: Implement password reset token generation and email sending
      console.log(`📧 Password reset requested for: ${email}`);
      
      return { 
        success: true, 
        message: 'Password reset email sent (not implemented yet)' 
      };

    } catch (error) {
      console.error('❌ Password reset error:', error.message);
      throw error;
    }
  }

  /**
   * Verify email address
   */
  static async verifyEmail(userId) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          isVerified: true,
          emailVerifiedAt: new Date()
        }
      });

      return { success: true, user };

    } catch (error) {
      console.error('❌ Email verification error:', error.message);
      throw error;
    }
  }
}

module.exports = AuthService;
