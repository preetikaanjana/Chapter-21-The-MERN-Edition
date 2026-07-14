const router = require('express').Router();
const Bookmark = require('../models/Bookmark');
router.get('/bookmarks', async (req, res) => {
  const { tag } = req.query;
  const filter = tag ? { tags: tag } : {};
  const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1 });
  res.json(bookmarks);
});
router.post('/bookmarks', async (req, res) => {
  const bookmark = await Bookmark.create(req.body);
  res.status(201).json(bookmark);
});
router.put('/bookmarks/:id', async (req, res) => {
  const bookmark = await Bookmark.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(bookmark);
});
router.delete('/bookmarks/:id', async (req, res) => {
  await Bookmark.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});
module.exports = router;
