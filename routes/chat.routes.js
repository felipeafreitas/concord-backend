const router = require('express').Router();
const Room = require('../model/Room');
const Message = require('../model/Message');
const User = require('../model/User');

router.get('/chat/rooms', async (req, res) => {
  try {
    const rooms = await Room.find().populate('participants', 'name photo');

    res.json({ status: 'ok', data: rooms });
  } catch (err) {
    console.log(err);
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
    const messages = await Message.find({
      room: room,
    }).populate('author', 'name photo');

    res.json({ status: 'ok', data: messages });
  } catch (err) {
    console.log(err);
    res.json({ status: 'error', error: err });
  }
});

router.post('/');

//TODO: routes to delete and edit rooms

module.exports = router;
