const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, default: 'Anonymous', trim: true },
  grid: { type: [[String]], required: true },
  likes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Artwork', artworkSchema);
