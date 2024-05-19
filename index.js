const express = require('express')
const app = express()
const dotenv = require("dotenv")
const db = require("./models")
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require("morgan")
const morganBody = require("morgan-body")
const fs = require("fs")
const path = require("path")
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "logs", "access.log")
  );
const log = fs.createWriteStream(path.join(__dirname, "logs", "express.log"), {
    flags: "a",
});
const cookieParser = require('cookie-parser')

dotenv.config()
app.use(bodyParser.json({limit: '100mb', extended: true}))
app.use(cors())
morganBody(app, {
    stream: log,
  });
  app.use(morgan("combined", { stream: accessLogStream }));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

// Import blog and newsletter routes
const blog = require('./routes/blog.js')
app.use("/api/imperial-blog", blog)

db.sequelize.sync().then(() => {
app.listen(process.env.PORT, () => {
    console.log(`API server running on ${process.env.PORT}`)
})
})