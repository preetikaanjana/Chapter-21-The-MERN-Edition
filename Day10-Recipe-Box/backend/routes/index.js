const router = require('express').Router();
const axios = require('axios');
const SavedRecipe = require('../models/SavedRecipe');

const MOCK = [
  { id: 1, title: 'Pastel Pancakes', image: '', readyInMinutes: 20 },
  { id: 2, title: 'Mint Smoothie Bowl', image: '', readyInMinutes: 10 },
  { id: 3, title: 'Lavender Lemonade', image: '', readyInMinutes: 5 },
];

router.get('/recipes/search', async (req, res) => {
  const key = process.env.SPOONACULAR_API_KEY;
  if (!key) return res.json({ results: MOCK });
  try {
    const { data } = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: { query: req.query.q || 'pasta', number: 6, apiKey: key }
    });
    res.json(data);
  } catch { res.json({ results: MOCK }); }
});

router.get('/recipes/saved', async (req, res) => res.json(await SavedRecipe.find()));
router.post('/recipes/saved', async (req, res) => res.status(201).json(await SavedRecipe.create(req.body)));
module.exports = router;
