const mongoose = require('mongoose');
const msgSchema = new mongoose.Schema({ username: String, text: String, room: { type: String, default: 'general' } }, { timestamps: true });
module.exports = mongoose.model('Message', msgSchema);
