const mongoose = require('mongoose');
const docSchema = new mongoose.Schema({ title: String, content: String }, { timestamps: true });
module.exports = mongoose.model('Document', docSchema);
