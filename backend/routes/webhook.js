const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Webhook proxy route to handle n8n submissions
router.post('/n8n-proxy', [
  // Validation middleware
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters when provided')
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country name cannot exceed 100 characters')
], async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Please check your input and try again',
        errors: errors.array().map(error => ({
          field: error.path || error.param,
          message: error.msg,
          value: error.value
        }))
      });
    }

    const { firstName, lastName, email, country } = req.body;
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      return res.status(500).json({
        success: false,
        message: 'N8N webhook URL not configured'
      });
    }

    console.log('🔄 Proxying webhook request to n8n:', {
      email,
      firstName,
      lastName,
      country: country || 'Not specified'
    });

    // Make request to n8n webhook
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'VYBE-Backend/1.0'
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        country: country || '',
        timestamp: new Date().toISOString(),
        source: 'VYBE Website'
      })
    });

    let n8nResponse;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      if (text.trim()) {
        n8nResponse = JSON.parse(text);
      } else {
        n8nResponse = { success: true, message: 'Webhook processed successfully' };
      }
    } else {
      n8nResponse = { success: true, message: 'Webhook processed successfully' };
    }

    if (response.ok) {
      console.log('✅ N8N webhook success:', n8nResponse);
      
      res.status(200).json({
        success: true,
        message: 'Waitlist submission successful',
        data: {
          email,
          firstName,
          lastName,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      console.error('❌ N8N webhook failed:', response.status, n8nResponse);
      
      res.status(500).json({
        success: false,
        message: 'Failed to process waitlist submission',
        error: 'Webhook processing failed'
      });
    }

  } catch (error) {
    console.error('❌ Error in webhook proxy:', error);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// Health check for webhook proxy
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Webhook proxy service is running',
    timestamp: new Date().toISOString(),
    n8nConfigured: !!process.env.N8N_WEBHOOK_URL
  });
});

module.exports = router;
