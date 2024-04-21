// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const app = express();
// const server = http.createServer(app);
// // const io = socketIo(server);

// const io = require('socket.io')(http, {
//   cors: {
//     // origin: [`${process.env.VITE_BASE_URL}`],
//     // origin: 'http://localhost:5173/messages',
//     origin: ['http://localhost:5173'],
//     // methods: ["GET", "POST"]
//   },
// });

// // io.use((socket, next) => {
// //   const username = socket.handshake.auth.fetched_userName;
// //   socket.username = username;
// //   next();
// // });

// // io.on('connection', (socket) => {
// //   const users = [];
// //   for (let [id, socket] of io.of('/').sockets) {
// //     users.push({
// //       userID: id,
// //       username: socket.username,
// //       key: id,
// //     });
// //   }
// //   socket.emit('users', users);
// //   console.log(users);
// //   socket.broadcast.emit('user connected', {
// //     userID: socket.id,
// //     username: socket.username,
// //     key: socket.id,
// //     self: false,
// //   });

// //   socket.on('private message', ({ content, to }) => {
// //     console.log('Content: ', content, 'To: ', to);
// //     socket.to(to).emit('private message', {
// //       content,
// //       from: socket.id,
// //     });
// //   });
// // });

// // http.listen(5003, () => console.log('listening on port 5003....'));

// io.on('connection', (socket) => {
//   console.log('a user has connected', socket.id);
//   socket.on('disconnect', () => {
//     console.log('user disconnected', socket.id);
//   });
// });

// const cors = require('cors');
// const corsOptions = {
//   origin: '*',
//   credentials: true,
//   optionSuccessStatus: 200,
// };
// app.use(cors(corsOptions));

// const router = require('./router.js');
// app.use(router);

// app.use('/uploads', express.static('uploads'));

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');

//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept',
//   );

//   next();
// });

// // app.listen(5010, () => console.log('listening on port 5010....'));
// server.listen(5010, () => console.log('listening on port 5010....'));

const express = require('express');
const io = require('socket.io')(5002, {
  cors: {
    // origin: [`${process.env.VITE_BASE_URL}`],
    // origin: 'http://localhost:5173/messages',
    origin: ['http://localhost:5173'],
    // methods: ["GET", "POST"]
  },
});
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  socket.on('chat message', (msg) => {
    console.log('message ' + msg);
    socket.broadcast.emit('chat message', msg); // send to all clients
  });
  socket.on('disconnect', () => {
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
