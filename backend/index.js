const express = require('express');
const dotenv = require('dotenv').config();
const io = require('socket.io')(5002, {
  cors: {
    // origin: [`${process.env.VITE_BASE_URL}`],
    // origin: 'http://localhost:5173/messages',
    // origin: ['http://localhost:5173'],
    origin: [`${process.env.VITE_BASE_URL}`],
    // methods: ["GET", "POST"]
  },
});
let users = [];
io.on('connection', (socket) => {
  users.push(socket.id);
  console.log('users', users);
  console.log('a user connected', socket.id);
  socket.on('chat message', (msg) => {
    console.log('message ' + msg);
    socket.broadcast.emit('chat message', msg); // send to all clients
  });
  socket.on('disconnect', () => {
    users = users.filter((user) => user !== socket.id);
    console.log('user disconnected', socket.id);
  });
});

const app = express();

const cors = require('cors');
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const router = require('./router.js');
app.use(router);

app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');

  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );

  next();
});

app.listen(5010, () => console.log('listening on port 5010....'));
