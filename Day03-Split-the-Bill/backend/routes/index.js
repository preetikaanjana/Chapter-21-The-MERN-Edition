const router = require('express').Router();
const SplitHistory = require('../models/SplitHistory');
router.get('/splits', async (req, res) => {
  const splits = await SplitHistory.find().sort({ createdAt: -1 }).limit(20);
  res.json(splits);
});
router.post('/splits', async (req, res) => {
  const { total, people, tip, names, purpose, date } = req.body;
  const perPerson = ((total * (1 + tip / 100)) / people).toFixed(2);
  const split = await SplitHistory.create({
    total,
    people,
    tip,
    perPerson: +perPerson,
    names,
    purpose,
    date: date || undefined
  });
  res.status(201).json(split);
});
module.exports = router;
