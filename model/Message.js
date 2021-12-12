const { Schema, model } = require('mongoose');

const MessageSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true, unique: true },
  },
  {
    collection: 'Messages',
    timestamps: true,
  }
);

const model = model('MessageSchema', MessageSchema);

module.exports = model;
