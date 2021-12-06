require("dotenv").config();
const express = require('express')
const bodyParser = require('body-parser')
require("./config/db.config")();
const cors = require("cors")

const app = express()

app.use(bodyParser.json())

app.use(cors())

const userRouter = require("./routes/user.routes");
app.use("/", userRouter);

app.listen(process.env.PORT || 9999, () => {
  console.log(`Server up at ${process.env.PORT || 9999}`)
})