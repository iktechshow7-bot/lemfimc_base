const express = require('express');
const Setting = require('../models/Setting');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/settings
 * Get all settings.
 * Public route - used by frontend to get proxy config.
 */
router.get('/', async (req, res) => {
  try {
    const settings = await Setting.find();
    // Convert to key-value object for easier consumption
    const settingsMap = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    res.json({ settings: settingsMap });
  } catch (err) {
    console.error('Get settings error:', err);
    res.status(500).json({ message: 'Server error fetching settings.' });
  }
});

/**
 * GET /api/settings/:key
 * Get a specific setting by key.
 */
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await Setting.findOne({ key });
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found.' });
    }
    res.json({ key: setting.key, value: setting.value });
  } catch (err) {
    console.error('Get setting error:', err);
    res.status(500).json({ message: 'Server error fetching setting.' });
  }
});

/**
 * PUT /api/settings
 * Update or create settings.
 * Protected route - requires admin auth.
 *
 * Body: { key: value, key2: value2, ... }
 */
router.put('/', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ message: 'Invalid update data.' });
    }

    const results = [];

    for (const [key, value] of Object.entries(updates)) {
      const updated = await Setting.findOneAndUpdate(
        { key },
        { key, value, updatedAt: new Date() },
        { upsert: true, new: true }
      );
      results.push(updated);
    }

    res.json({
      message: 'Settings updated successfully.',
      updated: results,
    });
  } catch (err) {
    console.error('Update settings error:', err);
    res.status(500).json({ message: 'Server error updating settings.' });
  }
});

module.exports = router;
