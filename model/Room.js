const { Schema, model } = require('mongoose');

const RoomSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    participants: [
      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    ],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message', required: true }],
  },
  { collection: 'Rooms' }
);

const model = model('RoomSchema', RoomSchema);

module.exports = model;
