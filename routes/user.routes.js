const router = require("express").Router();
const User = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
  const { email, password: plainTextPassword, name } = req.body

  if (!email || typeof email !== 'string') {
    return res.json({ status: 'error', error: 'Invalid email'})
  }

  if (!plainTextPassword || typeof plainTextPassword !== 'string') {
    return res.json({ status: 'error', error: 'Invalid password'})
  }

  if (plainTextPassword.length < 5) {
    return res.json({ status: 'error', error: 'Password too small. Should ve at least 6 characters'})
  }

  if (!name || typeof name !== 'string' || name.length < 3 ) {
    return res.json({ status: 'error', error: 'Name invalid'})
  }

  const password = await bcrypt.hash(plainTextPassword, 10)

  try {
    const response = await User.create({
      name,
      email,
      password
    })

    console.log('User create successfully: ', response)

  } catch (err) {
    if (err.code === 11000) {
      return res.json({ status: 'error', error: 'email already in use'})
    }
    console.log(err)

    throw err
  }

  res.json({ status: 'ok' })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email }).lean()

  if (!user) {
    return res.json({ status: 'error', error: 'Invalid email/password'})
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email 
      }, process.env.JWT_SECRET)

    return res.json({ status: 'ok', data: token })
  }

  res.json({ status: 'ok', data: 'Invalid email/password'})
})

router.post('/change-password', async (req, res) => {
  const { token, newPassword: plainTextPassword } = req.body

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)

    const _id = user.id

    const password = await bcrypt.hash(plainTextPassword, 10)

    await User.updateOne({ _id }, {
      $set: { password }
    })

    return res.json({ status: 'ok' })
  } catch (err) {
    res.json({ status: 'error', error: 'Invalid token'})
  }
})

module.exports = router;