const router = require('express').Router();
const axios = require('axios');
const Watchlist = require('../models/Watchlist');

router.get('/watchlist', async (req, res) => res.json(await Watchlist.find()));
router.post('/watchlist', async (req, res) => res.status(201).json(await Watchlist.create(req.body)));
router.delete('/watchlist/:id', async (req, res) => { await Watchlist.findByIdAndDelete(req.params.id); res.json({ ok: true }); });

router.get('/crypto/prices', async (req, res) => {
  const list = await Watchlist.find();
  const ids = list.map(w => w.coinId).join(',') || 'bitcoin,ethereum';
  try {
    const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: { ids, vs_currencies: 'usd', include_24hr_change: true }
    });
    res.json(data);
  } catch { res.json({}); }
});

router.get('/crypto/search', async (req, res) => {
  try {
    const { data } = await axios.get('https://api.coingecko.com/api/v3/search', { params: { query: req.query.q } });
    res.json(data.coins.slice(0, 5));
  } catch { res.json([]); }
});
module.exports = router;
