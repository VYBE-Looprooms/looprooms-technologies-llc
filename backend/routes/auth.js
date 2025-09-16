const express = require('express');
const router = express.Router();
const AuthService = require('../services/authService');
const { validateRegisterRequest, validateLoginRequest } = require('../middleware/validation');

const formatValidationError = (error) =>
  error.details.map((detail) => ({
    field: detail.path?.join('.') || detail.context?.label,
    message: detail.message,
  }));

router.post('/register', async (req, res) => {
  try {
    const { error, value } = validateRegisterRequest(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: formatValidationError(error),
      });
    }

    const authPayload = await AuthService.register({
      ...value,
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip,
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: authPayload,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('[VYBE] Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create account',
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { error, value } = validateLoginRequest(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: formatValidationError(error),
      });
    }

    const authPayload = await AuthService.login({
      ...value,
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: authPayload,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error('[VYBE] Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to log in',
    });
  }
});

module.exports = router;
