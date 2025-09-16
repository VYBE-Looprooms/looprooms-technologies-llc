const express = require('express');
const router = express.Router();
const LooproomService = require('../services/looproomService');
const { validateMoodRequest } = require('../middleware/validation');

const formatValidationError = (error) =>
  error.details.map((detail) => ({
    field: detail.path?.join('.') || detail.context?.label,
    message: detail.message,
  }));

router.post('/recommend', async (req, res) => {
  try {
    const { error, value } = validateMoodRequest(req.body || {});

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: formatValidationError(error),
      });
    }

    const recommendation = await LooproomService.recommendLooproomForMood(value);

    res.json({
      success: true,
      message: 'Mood recommendation generated successfully',
      data: recommendation,
    });
  } catch (err) {
    console.error('[VYBE] Mood recommendation error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to generate mood-based recommendation',
    });
  }
});

module.exports = router;
