const mongoose = require('mongoose');
const savedRecipeSchema = new mongoose.Schema({
  recipeId: Number,
  title: String,
  image: String,
  readyInMinutes: Number,
}, { timestamps: true });
module.exports = mongoose.model('SavedRecipe', savedRecipeSchema);
