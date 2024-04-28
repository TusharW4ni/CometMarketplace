const express = require('express');
const dotenv = require('dotenv').config();
var nodemailer = require('nodemailer');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'reachtusharwani@gmail.com',
//     pass: '',
//   },
// });

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use SSL
  auth: {
    user: 'futuremarswalkerwilliams@gmail.com',
    pass: '',
  },
});

// transporter.verify(function (error, success) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Server is ready to take our messages');
//   }
// });

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
    socket.emit('user_connected');
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
    const toUserObj = await prisma.user.findUnique({
      where: {
        id: msg.to.id,
      },
    });
    console.log('to user obj', toUserObj);
    if (toUserObj.status === 'OFFLINE') {
      var mailOptions = {
        from: 'reachtusharwani@gmail.com',
        to: toUserObj.email,
        subject: `New message from ${
          msg.name === msg.chat.user1.name
            ? msg.chat.user1.name
            : msg.chat.user2.name
        }`,
        text: `You have a new message from ${
          msg.name === msg.chat.user1.name
            ? msg.chat.user1.name
            : msg.chat.user2.name
        }. It says: "${msg.text}" at ${msg.time}. Please login at http://localhost:5173/ to reply to the message.`,
      };
      console.log('mail options', mailOptions);
      // transporter.sendMail(mailOptions, function (error, info) {
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log('Email sent: ' + info.response);
      //   }
      // });
    }
    socket.to(users[msg.to.id]).emit('chat message', msg);
    const from =
      msg.name === msg.chat.user1.name ? msg.chat.user1.id : msg.chat.user2.id;
    console.log('from id', from);
    await prisma.message.create({
      data: {
        content: msg.text,
        chatId: msg.chat.id,
        senderId: from,
        createdAt: msg.time,
      },
    });
  });

  socket.on('disconnect', async () => {
    const userId = Object.keys(users).find((key) => users[key] === socket.id);
    socket.to(users[userId]).emit('user_disconnected', 'disconnected');
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
