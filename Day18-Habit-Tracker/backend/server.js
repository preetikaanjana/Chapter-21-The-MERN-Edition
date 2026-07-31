require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
const routes = require('./routes');
app.use('/api', routes);
app.get('/api/health', (_, res) => res.json({ ok: true }));
app.listen(process.env.PORT || 5000, () => console.log('Server running'));
