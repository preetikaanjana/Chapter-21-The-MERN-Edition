const router = require('express').Router();
const ProjectMeta = require('../models/ProjectMeta');

const PROJECTS = [
  { day: 1, name: 'Gratitude Journal', slug: 'Day01-Gratitude-Journal', description: 'Daily gratitude entries', concepts: ['CRUD', 'MongoDB'], color: 'pastel-pink' },
  { day: 2, name: 'Bookmark Manager', slug: 'Day02-Bookmark-Manager', description: 'Tag-filtered bookmarks', concepts: ['Arrays', 'Filters'], color: 'pastel-sky' },
  { day: 3, name: 'Split the Bill', slug: 'Day03-Split-the-Bill', description: 'Bill splitting calculator', concepts: ['State', 'History'], color: 'pastel-peach' },
  { day: 4, name: 'Kanban To-Do', slug: 'Day04-Kanban-Todo', description: 'Drag-free kanban board', concepts: ['Status Updates'], color: 'pastel-mint' },
  { day: 5, name: 'Sticky Notes', slug: 'Day05-Sticky-Notes', description: 'Positioned sticky notes', concepts: ['Coordinates'], color: 'pastel-lemon' },
  { day: 6, name: 'Expense Logger', slug: 'Day06-Expense-Logger', description: 'Track spending', concepts: ['Aggregations'], color: 'pastel-lavender' },
  { day: 7, name: 'Quick Poll', slug: 'Day07-Quick-Poll', description: 'Live voting polls', concepts: ['$inc'], color: 'pastel-rose' },
  { day: 8, name: 'Auth Template', slug: 'Day08-Auth-Template', description: 'JWT authentication', concepts: ['JWT', 'Cookies'], color: 'pastel-pink' },
  { day: 9, name: 'Weather Dashboard', slug: 'Day09-Weather-Dash', description: 'Multi-city weather', concepts: ['API Proxy'], color: 'pastel-sky' },
  { day: 10, name: 'Recipe Box', slug: 'Day10-Recipe-Box', description: 'Recipe search & save', concepts: ['Spoonacular'], color: 'pastel-peach' },
  { day: 11, name: 'Quote Picker', slug: 'Day11-Quote-Picker', description: 'Daily inspiration', concepts: ['Unsplash'], color: 'pastel-lavender' },
  { day: 12, name: 'GitHub Inspector', slug: 'Day12-Github-Inspector', description: 'Profile lookup', concepts: ['GitHub API'], color: 'pastel-mint' },
  { day: 13, name: 'Crypto Watchlist', slug: 'Day13-Crypto-Watchlist', description: 'Live crypto prices', concepts: ['Polling'], color: 'pastel-lemon' },
  { day: 14, name: 'Movie Reviews', slug: 'Day14-Movie-Reviews', description: 'Rate & review films', concepts: ['Nested Schema'], color: 'pastel-rose' },
  { day: 15, name: 'Markdown Previewer', slug: 'Day15-Markdown-Preview', description: 'Live MD preview', concepts: ['marked'], color: 'pastel-sky' },
  { day: 16, name: 'Linktree Clone', slug: 'Day16-Linktree-Clone', description: 'Link-in-bio pages', concepts: ['Dynamic Routes'], color: 'pastel-pink' },
  { day: 17, name: 'Flashcards', slug: 'Day17-Flashcards', description: '3D flip cards', concepts: ['CSS 3D'], color: 'pastel-mint' },
  { day: 18, name: 'Soundboard', slug: 'Day18-Soundboard', description: 'Ambient lo-fi tones', concepts: ['Web Audio'], color: 'pastel-peach' },
  { day: 19, name: 'Habit Tracker', slug: 'Day19-Habit-Tracker', description: 'Weekly habit grid', concepts: ['Date Matrix'], color: 'pastel-lavender' },
  { day: 20, name: 'Chat Room', slug: 'Day20-Chat-Room', description: 'Real-time chat', concepts: ['Socket.io'], color: 'pastel-sky' },
  { day: 21, name: 'Portfolio Hub', slug: 'Day21-Portfolio-Hub', description: 'This dashboard!', concepts: ['Aggregator'], color: 'pastel-lilac' },
];

router.get('/projects', async (req, res) => {
  let projects = await ProjectMeta.find().sort({ day: 1 });
  if (!projects.length) { projects = await ProjectMeta.insertMany(PROJECTS); }
  res.json(projects);
});

router.get('/stats', async (req, res) => {
  const total = await ProjectMeta.countDocuments();
  const complete = await ProjectMeta.countDocuments({ status: 'complete' });
  res.json({ total, complete, progress: Math.round(complete / total * 100) });
});
module.exports = router;
