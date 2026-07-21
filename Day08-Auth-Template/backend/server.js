require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const routes = require('./routes');

const app = express();
connectDB();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api', routes);
app.get('/api/health', (_, res) => res.json({ ok: true }));
app.listen(process.env.PORT || 5000, () => console.log('Auth server running'));
