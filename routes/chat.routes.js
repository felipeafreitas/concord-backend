const router = require('express').Router();
const Room = require('../model/Room');
const Messages = require('../model/Message');

router.get('/chat/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();

    res.json({ status: 'ok', data: rooms });
  } catch (err) {
    res.json({ status: 'error', error: err });
  }
});

router.post('/chat/room', async (req, res) => {
  try {
    const room = await Room.create({ ...req.body });

    res.json({ status: 'ok', data: room });
  } catch (err) {
    res.json({ status: 'error', error: err });
  }
});

router.get('/chat/:room/messages', async (req, res) => {
  const room = req.params.room;

  try {
    const messages = await Messages.find({
      room: {
        $regex: `^${room}$`,
        $options: 'i',
      },
    });

    console.log(messages);

    res.json({ status: 'ok', data: messages });
  } catch (err) {
    res.json({ status: 'error', error: err });
  }
});

router.post('/');

//TODO: routes to delete and edit rooms

module.exports = router;
