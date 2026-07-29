const mongoose = require('mongoose');
const cardSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'general' },
  timesReviewed: { type: Number, default: 0 },
  timesCorrect: { type: Number, default: 0 },
}, { timestamps: true });
module.exports = mongoose.model('Flashcard', cardSchema);
