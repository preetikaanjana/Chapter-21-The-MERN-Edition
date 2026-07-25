const router = require('express').Router();
const axios = require('axios');
const https = require('https');
const GithubNote = require('../models/GithubNote');

const agent = new https.Agent({ rejectUnauthorized: false });

router.get('/github/:username', async (req, res) => {
  const username = req.params.username.trim();
  try {
    const headers = { 'User-Agent': 'Node.js/Axios' };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }
    const { data } = await axios.get(`https://api.github.com/users/${username}`, {
      headers,
      httpsAgent: agent
    });
    const note = await GithubNote.findOne({ username });
    res.json({ profile: data, note: note?.note || '' });
  } catch (err) {
    console.error('Error fetching github profile:', err.message);
    
    // Fallback to local note and a mock profile if API limit is reached
    const note = await GithubNote.findOne({ username });
    const fallbackProfile = {
      login: username,
      name: `${username.charAt(0).toUpperCase()}${username.slice(1)} (Demo Mode)`,
      avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop`,
      bio: `This profile is running in fallback mode because the GitHub API rate limit was exceeded. Personal notes are still functional!`,
      public_repos: 10,
      followers: 100,
    };
    
    res.json({ profile: fallbackProfile, note: note?.note || '', isFallback: true });
  }
});

router.post('/github/:username/note', async (req, res) => {
  const note = await GithubNote.findOneAndUpdate(
    { username: req.params.username },
    { note: req.body.note },
    { upsert: true, new: true }
  );
  res.json(note);
});
module.exports = router;
