const express = require('express');
const SiteContent = require('../models/SiteContent');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/content
 * Get all site content entries.
 * Public route - no auth required (used by frontend to display content).
 */
router.get('/', async (req, res) => {
  try {
    const contents = await SiteContent.find().sort({ section: 1, key: 1 });
    res.json({ contents });
  } catch (err) {
    console.error('Get content error:', err);
    res.status(500).json({ message: 'Server error fetching content.' });
  }
});

/**
 * GET /api/content/:section
 * Get all content for a specific section.
 */
router.get('/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const contents = await SiteContent.find({ section }).sort({ key: 1 });
    res.json({ contents });
  } catch (err) {
    console.error('Get section content error:', err);
    res.status(500).json({ message: 'Server error fetching section content.' });
  }
});

/**
 * PUT /api/content/:section
 * Update content for a specific section.
 * Protected route - requires admin auth.
 *
 * Body: { key: value, key2: value2, ... }
 * Updates or creates entries for each key in the section.
 */
router.put('/:section', authMiddleware, async (req, res) => {
  try {
    const { section } = req.params;
    const updates = req.body;

    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ message: 'Invalid update data.' });
    }

    const results = [];

    for (const [key, value] of Object.entries(updates)) {
      const updated = await SiteContent.findOneAndUpdate(
        { section, key },
        { section, key, value, updatedAt: new Date() },
        { upsert: true, new: true }
      );
      results.push(updated);
    }

    res.json({
      message: 'Content updated successfully.',
      updated: results,
    });
  } catch (err) {
    console.error('Update content error:', err);
    res.status(500).json({ message: 'Server error updating content.' });
  }
});

/**
 * DELETE /api/content/:section/:key
 * Delete a specific content entry.
 * Protected route.
 */
router.delete('/:section/:key', authMiddleware, async (req, res) => {
  try {
    const { section, key } = req.params;
    await SiteContent.findOneAndDelete({ section, key });
    res.json({ message: 'Content deleted successfully.' });
  } catch (err) {
    console.error('Delete content error:', err);
    res.status(500).json({ message: 'Server error deleting content.' });
  }
});

module.exports = router;
