const express = require('express');
const router = express.Router();
const EngagementService = require('../services/engagementService');

router.get('/reactions', async (req, res) => {
  try {
    const presets = await EngagementService.listReactionPresets();
    res.json({
      success: true,
      message: 'Reaction presets retrieved successfully',
      data: presets,
    });
  } catch (error) {
    console.error('[VYBE] Error fetching reaction presets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load reaction presets',
    });
  }
});

router.get('/motivations', async (req, res) => {
  try {
    const messages = await EngagementService.listMotivationalMessages();
    res.json({
      success: true,
      message: 'Motivational messages retrieved successfully',
      data: messages,
    });
  } catch (error) {
    console.error('[VYBE] Error fetching motivational messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load motivational messages',
    });
  }
});

module.exports = router;
