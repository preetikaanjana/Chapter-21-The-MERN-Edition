const mongoose = require('mongoose');
const watchSchema = new mongoose.Schema({ coinId: String, symbol: String, name: String }, { timestamps: true });
module.exports = mongoose.model('Watchlist', watchSchema);
