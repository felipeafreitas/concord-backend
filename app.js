require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
require('./config/db.config')();
const cors = require('cors');
const socket = require('socket.io');
const { instrument } = require('@socket.io/admin-ui');
const Message = require('./model/Message');
const Room = require('./model/Room');

const app = express();
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://concord-sincopeiro.netlify.app/',
    ],
  },
});

app.use(bodyParser.json());
app.use(cors());

const userRouter = require('./routes/user.routes');
app.use('/', userRouter);

const chatRouter = require('./routes/chat.routes');
app.use('/', chatRouter);

io.on('connection', (socket) => {
  console.log(`New WS Connection: ${socket.id}`);

  socket.on('join-room', ({ user, room }) => {
    console.log('Room Connected: ', room);
    socket.join(room);
    Room.updateOne(
      { room },
      {
        $push: { participants: user },
      }
    );
  });

  socket.on('send-message', async (message) => {
    console.log('MENSAGEM RECEBIDA NO SERVIDOR');
    try {
      const newMessage = await Message.create({ ...message });
      socket.to(message.room.toLowerCase()).emit('received-message', message);

      console.log('New Message: ', newMessage);
    } catch (err) {
      console.log('Erro: ', err);
    }
  });
});

server.listen(process.env.PORT || 9999, () => {
  console.log(`Server up at ${process.env.PORT || 9999}`);
});

instrument(io, { auth: false });
