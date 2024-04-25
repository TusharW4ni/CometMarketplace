const express = require('express');
const dotenv = require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const io = require('socket.io')(5002, {
  cors: {
    origin: [`${process.env.VITE_BASE_URL}`],
  },
});

let users = [];

io.on('connection', (socket) => {
  users.push(socket.id);
  console.log('users array', users);
  console.log('a user connected', socket.id);

  socket.on('user_connected', async (userId) => {
    console.log('localUser.id', userId);
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: 'ONLINE',
        socketId: socket.id,
      },
    });
  });

  socket.on('chat message', (msg) => {
    console.log('message ' + msg);
    socket.broadcast.emit('chat message', msg); // send to all clients
  });
  socket.on('disconnect', async () => {
    await prisma.user.update({
      where: {
        socketId: socket.id,
      },
      data: {
        status: 'OFFLINE',
        socketId: null,
      },
    });
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
const { Prisma } = require('@prisma/client');
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
