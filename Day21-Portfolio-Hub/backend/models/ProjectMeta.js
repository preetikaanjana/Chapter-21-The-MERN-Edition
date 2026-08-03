const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
  day: Number,
  name: String,
  slug: String,
  description: String,
  concepts: [String],
  status: { type: String, default: 'complete' },
  color: String,
}, { timestamps: true });
module.exports = mongoose.model('ProjectMeta', projectSchema);
