const router = require('express').Router();
const Poll = require('../models/Poll');
router.get('/polls', async (req, res) => res.json(await Poll.find().sort({ createdAt: -1 })));
router.post('/polls', async (req, res) => {
  const { question, options } = req.body;
  const poll = await Poll.create({ question, options: options.map(t => ({ text: t, votes: 0 })) });
  res.status(201).json(poll);
});
router.post('/polls/:id/vote/:idx', async (req, res) => {
  const poll = await Poll.findByIdAndUpdate(
    req.params.id,
    { $inc: { [`options.${req.params.idx}.votes`]: 1 } },
    { new: true }
  );
  res.json(poll);
});
module.exports = router;
