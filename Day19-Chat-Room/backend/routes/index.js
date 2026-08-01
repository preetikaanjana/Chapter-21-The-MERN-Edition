const router = require('express').Router();
const Message = require('../models/Message');
router.get('/messages/:room', async (req, res) => {
  const messages = await Message.find({ room: req.params.room }).sort({ createdAt: -1 }).limit(50);
  res.json(messages.reverse());
});
module.exports = router;
