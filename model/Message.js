const { Schema, model } = require('mongoose');

const MessageSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'UserSchema', required: true },
    message: { type: String, max: 240, required: true },
    room: { type: Schema.Types.String, ref: 'Room', required: true },
  },
  {
    collection: 'Messages',
    timestamps: true,
  }
);

const MessageModel = model('MessageSchema', MessageSchema);

module.exports = MessageModel;
