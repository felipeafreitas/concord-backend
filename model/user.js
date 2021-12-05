const mongoose = require('mongoose')

const UserSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photo: { type: String, required: false },
    bio: { type: String, required: false },
    phone: { type: String, required: false },
  }, 
  { collection: 'users' }
)

const model = mongoose.model('UserSchema', UserSchema)

module.exports = model