const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/concord', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const app = express()

app.use(bodyParser.json())

const userRouter = require("./routes/user.routes");
app.use("/", userRouter);

app.listen(9999, () => {
  console.log('Server up at 9999')
})