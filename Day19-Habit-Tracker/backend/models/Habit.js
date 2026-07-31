const mongoose = require('mongoose');
const habitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, default: 'pastel-mint' },
  completions: [{ date: String }],
}, { timestamps: true });
module.exports = mongoose.model('Habit', habitSchema);
