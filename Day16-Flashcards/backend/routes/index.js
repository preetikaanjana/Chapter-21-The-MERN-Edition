const router = require('express').Router();
const Flashcard = require('../models/Flashcard');
router.get('/cards', async (req, res) => res.json(await Flashcard.find()));
router.post('/cards', async (req, res) => res.status(201).json(await Flashcard.create(req.body)));
router.post('/cards/:id/review', async (req, res) => {
  const update = { $inc: { timesReviewed: 1 } };
  if (req.body.correct) update.$inc.timesCorrect = 1;
  res.json(await Flashcard.findByIdAndUpdate(req.params.id, update, { new: true }));
});
router.delete('/cards/:id', async (req, res) => { await Flashcard.findByIdAndDelete(req.params.id); res.json({ ok: true }); });
module.exports = router;
