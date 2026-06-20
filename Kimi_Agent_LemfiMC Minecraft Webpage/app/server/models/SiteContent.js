const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['hero', 'community', 'footer'],
  },
  key: {
    type: String,
    required: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for section + key lookups
siteContentSchema.index({ section: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('SiteContent', siteContentSchema);
