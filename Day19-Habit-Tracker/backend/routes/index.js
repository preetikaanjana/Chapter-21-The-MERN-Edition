const router = require('express').Router();
const Habit = require('../models/Habit');

const getDays = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
};

router.get('/habits', async (req, res) => {
  const habits = await Habit.find();
  res.json({ habits, days: getDays() });
});
router.post('/habits', async (req, res) => res.status(201).json(await Habit.create(req.body)));
router.post('/habits/:id/toggle', async (req, res) => {
  const habit = await Habit.findById(req.params.id);
  const date = req.body.date || new Date().toISOString().split('T')[0];
  const idx = habit.completions.findIndex(c => c.date === date);
  if (idx >= 0) habit.completions.splice(idx, 1);
  else habit.completions.push({ date });
  await habit.save();
  res.json(habit);
});
router.delete('/habits/:id', async (req, res) => { await Habit.findByIdAndDelete(req.params.id); res.json({ ok: true }); });
module.exports = router;
