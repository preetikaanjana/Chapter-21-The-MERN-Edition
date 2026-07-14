const mongoose = require('mongoose');
const bookmarkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  tags: [String],
  favorite: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('Bookmark', bookmarkSchema);
