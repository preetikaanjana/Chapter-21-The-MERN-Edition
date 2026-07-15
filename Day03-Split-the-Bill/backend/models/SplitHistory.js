const mongoose = require('mongoose');
const splitSchema = new mongoose.Schema({
  total: Number,
  people: Number,
  tip: Number,
  perPerson: Number,
  names: [String],
  purpose: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });
module.exports = mongoose.model('SplitHistory', splitSchema);
