const router = require('express').Router();
const axios = require('axios');
const FavoriteQuote = require('../models/FavoriteQuote');

const QUOTES = [
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
  { text: 'Dream big and dare to fail.', author: 'Norman Vaughan' },
];

router.get('/quote/daily', async (req, res) => {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  let image = '';
  if (key) {
    try {
      const { data } = await axios.get('https://api.unsplash.com/photos/random', {
        params: { query: 'nature pastel', orientation: 'landscape' },
        headers: { Authorization: `Client-ID ${key}` }
      });
      image = data.urls.regular;
    } catch {}
  }
  res.json({ ...quote, image });
});

router.get('/quote/favorites', async (req, res) => res.json(await FavoriteQuote.find().sort({ createdAt: -1 })));
router.post('/quote/favorites', async (req, res) => res.status(201).json(await FavoriteQuote.create(req.body)));
module.exports = router;
