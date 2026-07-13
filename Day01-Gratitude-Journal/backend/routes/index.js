const router = require('express').Router();
const Entry = require('../models/Entry');

router.get('/entries', async (req, res) => {
  const { category } = req.query;
  const filter = category && category !== 'all' ? { category } : {};
  res.json(await Entry.find(filter).sort({ createdAt: -1 }));
});

router.get('/entries/stats', async (req, res) => {
  const byCategory = await Entry.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  const total = await Entry.countDocuments();
  res.json({ total, byCategory });
});

router.post('/entries', async (req, res) => {
  res.status(201).json(await Entry.create(req.body));
});

router.put('/entries/:id', async (req, res) => {
  const entry = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!entry) return res.status(404).json({ error: 'Not found' });
  res.json(entry);
});

router.delete('/entries/:id', async (req, res) => {
  await Entry.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
