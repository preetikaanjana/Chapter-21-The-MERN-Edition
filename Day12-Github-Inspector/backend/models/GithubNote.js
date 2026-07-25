const mongoose = require('mongoose');
const noteSchema = new mongoose.Schema({
  username: { type: String, required: true },
  note: String,
}, { timestamps: true });
module.exports = mongoose.model('GithubNote', noteSchema);
