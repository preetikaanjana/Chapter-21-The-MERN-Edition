const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email taken' });
  const user = await User.create({ name, email, password });
  res.cookie('token', signToken(user._id), { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.status(201).json({ _id: user._id, name: user.name, email: user.email });
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await user.matchPassword(req.body.password)))
    return res.status(401).json({ message: 'Invalid credentials' });
  res.cookie('token', signToken(user._id), { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ _id: user._id, name: user.name, email: user.email });
});

router.post('/logout', (req, res) => { res.clearCookie('token'); res.json({ message: 'Logged out' }); });

router.get('/me', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    res.json(user);
  } catch { res.status(401).json({ message: 'Invalid token' }); }
});

module.exports = router;
