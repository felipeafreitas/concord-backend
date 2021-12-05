const router = require("express").Router();
const mongoose = require("mongoose");
const User = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = "FTF(W@X!kQL?X28Pj'q;Qgn`uS!Ewv2*92`&L&N^+F5ZK[.][sqj)D,&HJAd}QKCapcjUHkx_tedGqK,g;nsB(w~B"

router.post('/register', async (req, res) => {
  const { username, password: plainTextPassword } = req.body

  if (!username || typeof username !== 'string') {
    return res.json({ status: 'error', error: 'Invalid username'})
  }

  if (!plainTextPassword || typeof plainTextPassword !== 'string') {
    return res.json({ status: 'error', error: 'Invalid password'})
  }

  if (plainTextPassword.length < 5) {
    return res.json({ status: 'error', error: 'Password too small. Should ve at least 6 characters'})
  }

  const password = await bcrypt.hash(plainTextPassword, 10)

  try {
    const response = await User.create({
      username,
      password
    })
    console.log('User create successfully: ', response)
  } catch (err) {
    if (err.core === 11000) {
      return res.json({ status: 'error', error: 'Username already in use'})
    }
    throw err
  }

  res.json({ status: 'ok' })
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username }).lean()

  if (!user) {
    return res.json({ status: 'error', error: 'Invalid username/password'})
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username 
      }, JWT_SECRET)

    return res.json({ status: 'ok', data: token })
  }

  res.json({ status: 'ok', data: 'Invalid username/password'})
})

router.post('/change-password', async (req, res) => {
  const { token, newPassword: plainTextPassword } = req.body

  try {
    const user = jwt.verify(token, JWT_SECRET)

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