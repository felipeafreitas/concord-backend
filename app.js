require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
require('./config/db.config')();
const cors = require('cors');
const socket = require('socket.io');
const { instrument } = require('@socket.io/admin-ui');
const formatMessage = require('./utils/message');
const { userJoins } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: ['http://localhost:3000'],
  },
});

app.use(bodyParser.json());

let messages = [];

io.on('connection', (socket) => {
  console.log(`New WS Connection: ${socket.id}`);
  socket.emit('previous-messages', messages);
  socket.on('join-room', ({ user, room }) => {
    const user = userJoin(user, room);

    socket.join(user.room);
  });

  socket.on('send-message', (message, room) => {
    if (room === '') {
      socket.broadcast.emit('received-message', message);
    } else {
      socket.to(room).emit('receive-message', message);
    }
    messages.push(message);
  });
});

app.use(cors());

const userRouter = require('./routes/user.routes');
app.use('/', userRouter);

server.listen(process.env.PORT || 9999, () => {
  console.log(`Server up at ${process.env.PORT || 9999}`);
});

instrument(io, { auth: false });
