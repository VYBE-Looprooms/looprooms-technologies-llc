const express = require('express');
const router = express.Router();
const LooproomService = require('../services/looproomService');

router.get('/', async (req, res) => {
  try {
    const looprooms = await LooproomService.listLooprooms();
    res.json({
      success: true,
      message: 'Looprooms retrieved successfully',
      data: looprooms,
    });
  } catch (error) {
    console.error('[VYBE] Error listing looprooms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch looprooms',
    });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await LooproomService.listCategoriesWithLooprooms();
    res.json({
      success: true,
      message: 'Looproom categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    console.error('[VYBE] Error listing looproom categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch looproom categories',
    });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const looproom = await LooproomService.getLooproomBySlug(req.params.slug);
    res.json({
      success: true,
      message: 'Looproom retrieved successfully',
      data: looproom,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }

    console.error('[VYBE] Error fetching looproom detail:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch looproom',
    });
  }
});

module.exports = router;
