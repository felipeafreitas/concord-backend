const { Schema, model } = require('mongoose');

const RoomSchema = new Schema(
  {
    name: { type: String, min: 3, max: 12, required: true, unique: true },
    description: { type: String, max: 120, required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { collection: 'Rooms' }
);

const RoomModel = model('RoomSchema', RoomSchema);

module.exports = RoomModel;
