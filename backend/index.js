const express = require('express');
const dotenv = require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const io = require('socket.io')(5002, {
  cors: {
    origin: [`${process.env.VITE_BASE_URL}`],
    methods: ['GET', 'POST'],
  },
});

let users = {};

io.on('connection', (socket) => {
  // users.push(socket.id);
  // console.log('users array', users);
  console.log('a user connected', socket.id);

  socket.on('user_connected', async (userId) => {
    console.log('localUser.id', userId);
    users[userId] = socket.id;
    console.log('users object', users);
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

  socket.on('chat message', async (msg) => {
    console.log('message ', msg);
    // socket.broadcast.emit('chat message', msg);
    socket.to(users[msg.to.id]).emit('chat message', msg);
    const from = msg.name === msg.chat.user1.name ? msg.chat.user1.id : msg.chat.user2.id;
    console.log("from id", from)
    await prisma.message.create({
      data: {
        content: msg.text,
        chatId: msg.chat.id,
        senderId: from,
        createdAt: msg.time,
      }
    })
  });

  socket.on('disconnect', async () => {
    const userId = Object.keys(users).find((key) => users[key] === socket.id);
    if (userId) {
      delete users[userId];
    }
    console.log('users object', users);
    await prisma.user.updateMany({
      where: {
        socketId: socket.id,
      },
      data: {
        status: 'OFFLINE',
        socketId: null,
      },
    });
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
