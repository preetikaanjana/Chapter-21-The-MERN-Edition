const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  author: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
}, { timestamps: true });
const movieSchema = new mongoose.Schema({
  imdbId: { type: String, unique: true },
  title: String,
  year: String,
  poster: String,
  reviews: [reviewSchema],
}, { timestamps: true });
module.exports = mongoose.model('Movie', movieSchema);
