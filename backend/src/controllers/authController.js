const AuthService = require('../services/authService');
const { validate, sanitize, schemas } = require('../middleware/validation');

class AuthController {
  /**
   * Register new user
   * POST /api/auth/register
   */
  static async register(req, res) {
    try {
      const { email, password, username, firstName, lastName, applyForCreator } = req.validatedData;

      console.log(`🔐 Registration attempt: ${email}${applyForCreator ? ' (creator application)' : ''}`);

      const result = await AuthService.registerUser({
        email,
        password,
        username,
        firstName,
        lastName,
        applyForCreator
      });

      console.log(`✅ User registered successfully: ${email}${result.user.creatorApplication ? ' with creator application' : ''}`);

      // Customize message based on creator application
      let message = 'Account created successfully';
      if (result.user.creatorApplication) {
        message = 'Account created successfully! Your creator application has been submitted and is pending review.';
      }

      res.status(201).json({
        success: true,
        message,
        data: {
          user: result.user,
          token: result.token
        }
      });

    } catch (error) {
      console.error('❌ Registration controller error:', error.message);
      
      if (error.message.includes('already')) {
        return res.status(409).json({
          success: false,
          message: error.message,
          code: 'USER_ALREADY_EXISTS'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Registration failed',
        code: 'REGISTRATION_ERROR'
      });
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  static async login(req, res) {
    try {
      const { email, password } = req.validatedData;

      console.log(`🔐 Login attempt: ${email}`);

      const result = await AuthService.loginUser({ email, password });

      console.log(`✅ User logged in successfully: ${email}`);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          token: result.token
        }
      });

    } catch (error) {
      console.error('❌ Login controller error:', error.message);
      
      if (error.message.includes('Invalid email or password')) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS'
        });
      }

      if (error.message.includes('deactivated')) {
        return res.status(403).json({
          success: false,
          message: 'Account has been deactivated',
          code: 'ACCOUNT_DEACTIVATED'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Login failed',
        code: 'LOGIN_ERROR'
      });
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  static async getMe(req, res) {
    try {
      const user = req.user;

      res.json({
        success: true,
        message: 'User profile retrieved successfully',
        data: { user }
      });

    } catch (error) {
      console.error('❌ Get me controller error:', error.message);
      
      res.status(500).json({
        success: false,
        message: 'Failed to get user profile',
        code: 'PROFILE_ERROR'
      });
    }
  }

  /**
   * Update user profile
   * PUT /api/auth/profile
   */
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileData = req.validatedData;

      console.log(`🔧 Profile update: ${req.user.email}`);

      const result = await AuthService.updateProfile(userId, profileData);

      console.log(`✅ Profile updated successfully: ${req.user.email}`);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: result
      });

    } catch (error) {
      console.error('❌ Update profile controller error:', error.message);
      
      res.status(500).json({
        success: false,
        message: 'Profile update failed',
        code: 'PROFILE_UPDATE_ERROR'
      });
    }
  }

  /**
   * Request password reset
   * POST /api/auth/forgot-password
   */
  static async forgotPassword(req, res) {
    try {
      const { email } = req.validatedData;

      console.log(`🔐 Password reset request: ${email}`);

      const result = await AuthService.requestPasswordReset(email);

      res.json({
        success: true,
        message: result.message
      });

    } catch (error) {
      console.error('❌ Forgot password controller error:', error.message);
      
      res.status(500).json({
        success: false,
        message: 'Password reset request failed',
        code: 'PASSWORD_RESET_ERROR'
      });
    }
  }

  /**
   * Verify email address
   * POST /api/auth/verify-email
   */
  static async verifyEmail(req, res) {
    try {
      const userId = req.user.id;

      console.log(`📧 Email verification: ${req.user.email}`);

      const result = await AuthService.verifyEmail(userId);

      console.log(`✅ Email verified successfully: ${req.user.email}`);

      res.json({
        success: true,
        message: 'Email verified successfully',
        data: result
      });

    } catch (error) {
      console.error('❌ Email verification controller error:', error.message);
      
      res.status(500).json({
        success: false,
        message: 'Email verification failed',
        code: 'EMAIL_VERIFICATION_ERROR'
      });
    }
  }

  /**
   * Logout user (client-side token removal)
   * POST /api/auth/logout
   */
  static async logout(req, res) {
    try {
      console.log(`🔐 User logged out: ${req.user.email}`);

      res.json({
        success: true,
        message: 'Logged out successfully'
      });

    } catch (error) {
      console.error('❌ Logout controller error:', error.message);
      
      res.status(500).json({
        success: false,
        message: 'Logout failed',
        code: 'LOGOUT_ERROR'
      });
    }
  }
}

module.exports = AuthController;
