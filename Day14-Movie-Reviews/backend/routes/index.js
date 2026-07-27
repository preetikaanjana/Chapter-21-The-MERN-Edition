const router = require('express').Router();
const axios = require('axios');
const Movie = require('../models/Movie');

router.get('/movies/search', async (req, res) => {
  const key = process.env.OMDB_API_KEY;
  if (!key) return res.json({ Search: [{ Title: 'Pastel Dreams', Year: '2024', imdbID: 'tt0000001', Poster: 'N/A' }], mock: true });
  try {
    const { data } = await axios.get('https://www.omdbapi.com/', { params: { s: req.query.q, apikey: key } });
    res.json(data);
  } catch { res.json({ Search: [] }); }
});

router.get('/movies/:imdbId', async (req, res) => {
  let movie = await Movie.findOne({ imdbId: req.params.imdbId });
  if (!movie) {
    const key = process.env.OMDB_API_KEY;
    if (key) {
      const { data } = await axios.get('https://www.omdbapi.com/', { params: { i: req.params.imdbId, apikey: key } });
      movie = await Movie.create({ imdbId: data.imdbID, title: data.Title, year: data.Year, poster: data.Poster, reviews: [] });
    } else {
      movie = await Movie.create({ imdbId: req.params.imdbId, title: 'Demo Movie', year: '2024', reviews: [] });
    }
  }
  res.json(movie);
});

router.post('/movies/:imdbId/reviews', async (req, res) => {
  const movie = await Movie.findOneAndUpdate(
    { imdbId: req.params.imdbId },
    { $push: { reviews: req.body } },
    { new: true, upsert: true }
  );
  res.json(movie);
});
module.exports = router;
