const router = require('express').Router();
const Artwork = require('../models/Artwork');

// Get all saved artworks
router.get('/artworks', async (req, res) => {
  try {
    const artworks = await Artwork.find().sort({ createdAt: -1 });
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Publish a new artwork
router.post('/artworks', async (req, res) => {
  const { title, author, grid } = req.body;
  if (!title || !grid) {
    return res.status(400).json({ message: 'Title and pixel grid are required' });
  }
  try {
    const newArtwork = await Artwork.create({
      title,
      author: author || 'Anonymous',
      grid
    });
    res.status(201).json(newArtwork);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Like an artwork
router.post('/artworks/:id/like', async (req, res) => {
  try {
    const artwork = await Artwork.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }
    res.json(artwork);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an artwork
router.delete('/artworks/:id', async (req, res) => {
  try {
    const deleted = await Artwork.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Artwork not found' });
    }
    res.json({ ok: true, message: 'Artwork deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
