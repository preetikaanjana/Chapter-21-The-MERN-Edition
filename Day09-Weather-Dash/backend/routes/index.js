const router = require('express').Router();
const axios = require('axios');
const City = require('../models/City');

router.get('/cities', async (req, res) => res.json(await City.find()));
router.post('/cities', async (req, res) => res.status(201).json(await City.create(req.body)));

router.get('/weather/:city', async (req, res) => {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    return res.json({ name: req.params.city, temp: 22, description: 'Partly cloudy (demo)', humidity: 65, mock: true });
  }
  try {
    const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { q: req.params.city, appid: key, units: 'metric' }
    });
    res.json({ name: data.name, temp: data.main.temp, description: data.weather[0].description, humidity: data.main.humidity });
  } catch { res.status(404).json({ message: 'City not found' }); }
});

module.exports = router;
