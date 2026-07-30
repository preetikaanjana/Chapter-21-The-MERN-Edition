const router = require('express').Router();
const Sound = require('../models/Sound');

const DEFAULTS = [
  { name: 'Rain', emoji: '🌧️', color: 'pastel-sky' },
  { name: 'Fireplace', emoji: '🔥', color: 'pastel-peach' },
  { name: 'Ocean', emoji: '🌊', color: 'pastel-mint' },
  { name: 'Birds', emoji: '🐦', color: 'pastel-lemon' },
  { name: 'Wind', emoji: '💨', color: 'pastel-lavender' },
  { name: 'Cafe', emoji: '☕', color: 'pastel-pink' },
];

router.get('/sounds', async (req, res) => {
  let sounds = await Sound.find();
  if (!sounds.length) { sounds = await Sound.insertMany(DEFAULTS); }
  res.json(sounds);
});
router.post('/sounds/:id/play', async (req, res) => {
  const sound = await Sound.findByIdAndUpdate(req.params.id, { $inc: { playCount: 1 } }, { new: true });
  res.json(sound);
});
module.exports = router;
