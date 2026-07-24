const mongoose = require('mongoose');
const favSchema = new mongoose.Schema({ text: String, author: String, image: String }, { timestamps: true });
module.exports = mongoose.model('FavoriteQuote', favSchema);
