require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const Message = require('./models/Message');
const routes = require('./routes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: 'http://localhost:5173' } });

connectDB();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api', routes);

io.on('connection', (socket) => {
  socket.on('join', (room) => socket.join(room));
  socket.on('message', async ({ username, text, room }) => {
    const msg = await Message.create({ username, text, room });
    io.to(room).emit('message', { ...msg.toObject(), _id: msg._id });
  });
});

server.listen(process.env.PORT || 5000, () => console.log('Chat server running'));
