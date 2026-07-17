const mongoose = require('mongoose');
const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  color: { type: String, default: 'pastel-lemon' },
  x: { type: Number, default: 50 },
  y: { type: Number, default: 50 },
}, { timestamps: true });
module.exports = mongoose.model('Note', noteSchema);
