const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const io = require("socket.io")();
const indexRouter = require("./routes/index");
const postRouter = require("./routes/post");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
require("./passport/passport.js");
require("./socket")(io);

//Set up mongoose connection
const mongoDB = process.env.DB || process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.on("open", () => {
  console.log("Connected to mongo server.");
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/auth", authRouter);

module.exports = { app, io };
