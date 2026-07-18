const router = require('express').Router();
const Expense = require('../models/Expense');
router.get('/expenses', async (req, res) => {
  const { month } = req.query;
  let filter = {};
  if (month) {
    const [y, m] = month.split('-');
    filter.date = { $gte: new Date(y, m - 1, 1), $lt: new Date(y, m, 1) };
  }
  res.json(await Expense.find(filter).sort({ date: -1 }));
});
router.get('/expenses/summary', async (req, res) => {
  const result = await Expense.aggregate([
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } }
  ]);
  const grandTotal = result.reduce((s, r) => s + r.total, 0);
  res.json({ byCategory: result, grandTotal });
});
router.post('/expenses', async (req, res) => res.status(201).json(await Expense.create(req.body)));
router.delete('/expenses/:id', async (req, res) => { await Expense.findByIdAndDelete(req.params.id); res.json({ ok: true }); });
module.exports = router;
