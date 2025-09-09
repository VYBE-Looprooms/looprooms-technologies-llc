const express = require('express');
const router = express.Router();
const EmailService = require('../services/emailService');
const { validateEmailRequest } = require('../middleware/validation');

const emailService = new EmailService();

// Send welcome email endpoint
router.post('/send-welcome', async (req, res) => {
  try {
    console.log('📧 Received welcome email request:', {
      body: req.body,
      timestamp: new Date().toISOString()
    });

    // Validate request data
    const { error, value } = validateEmailRequest(req.body);
    
    if (error) {
      console.log('❌ Validation error:', error.details);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
      });
    }

    const { email, firstName } = value;

    // Send welcome email
    const result = await emailService.sendWelcomeEmail(email, firstName);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Welcome email sent successfully',
        data: {
          messageId: result.messageId,
          recipient: email,
          firstName: firstName
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send welcome email',
        error: result.error
      });
    }

  } catch (error) {
    console.error('❌ Error in send-welcome endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Test email connection endpoint
router.get('/test-connection', async (req, res) => {
  try {
    const result = await emailService.testConnection();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Email service connection successful'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Email service connection failed',
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Error testing email connection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to test email connection',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Email service is running',
    timestamp: new Date().toISOString(),
    service: 'VYBE LOOPROOMS™ Email API'
  });
});

module.exports = router;
