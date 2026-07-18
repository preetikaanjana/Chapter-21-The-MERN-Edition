const mongoose = require('mongoose');
const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'other' },
  date: { type: Date, default: Date.now },
}, { timestamps: true });
module.exports = mongoose.model('Expense', expenseSchema);
