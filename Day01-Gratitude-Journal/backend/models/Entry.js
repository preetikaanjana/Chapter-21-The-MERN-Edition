const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['people', 'health', 'nature', 'work', 'moments', 'other'],
    default: 'other',
  },
  emoji: { type: String, default: '🙏' },
}, { timestamps: true });

module.exports = mongoose.model('Entry', entrySchema);
