const mongoose = require('mongoose');
const soundSchema = new mongoose.Schema({
  name: String,
  emoji: String,
  color: String,
  playCount: { type: Number, default: 0 },
}, { timestamps: true });
module.exports = mongoose.model('Sound', soundSchema);
