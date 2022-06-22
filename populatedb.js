#! /usr/bin/env node

console.log(
  "Populates specified database passed as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
  if (!userArgs[0].startsWith('mongodb')) {
      console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
      return
  }
  */

const mongoose = require("mongoose");
const async = require("async");
const Post = require("./models/post");
const Comment = require("./models/comment");
const User = require("./models/User");
const { faker } = require("@faker-js/faker");

const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const users = [];
const posts = [];
const comments = [];

// generate users

async function userCreate(cb) {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  const userDetail = {
    firstName: firstName,
    lastName: lastName,
    fullName: firstName + " " + lastName,
    email: faker.internet.email(),
    password: "password",
    birthDate: faker.date.birthdate(),
    location: faker.address.city(),
    gender: "Male",
  };

  const user = new User(userDetail);

  try {
    await user.save();
    users.push(user);
    cb(null, user);
  } catch (e) {
    cb(e, null);
  }
}

// generate posts

async function postCreate(user, location, cb) {
  const postDetail = {
    creator: user,
    content: faker.lorem.paragraph(),
    location: location,
  };

  const post = new Post(postDetail);

  try {
    await post.save();
    posts.push(post);
    cb(null, post);
  } catch (e) {
    cb(e, null);
  }
}

// generate comments

async function commentCreate(user, post, cb) {
  const comment = new Comment({
    user: user,
    comment: faker.lorem.paragraph(),
    post: post,
  });

  try {
    await comment.save();
    comments.push(comment);
    cb(null, comment);
  } catch (e) {
    cb(e, null);
    return;
  }
}

function createUsers(cb) {
  async.series(
    [
      function (callback) {
        userCreate(callback);
      },
      function (callback) {
        userCreate(callback);
      },
      function (callback) {
        userCreate(callback);
      },
      function (callback) {
        userCreate(callback);
      },
      function (callback) {
        userCreate(callback);
      },
    ],
    // optional callback
    cb
  );
}

function createPosts(cb) {
  async.series(
    [
      function (callback) {
        postCreate(users[0], users[2], callback);
      },
      function (callback) {
        postCreate(users[1], users[1], callback);
      },
      function (callback) {
        postCreate(users[1], users[2], callback);
      },
      function (callback) {
        postCreate(users[3], users[2], callback);
      },
      function (callback) {
        postCreate(users[3], users[3], callback);
      },
      function (callback) {
        postCreate(users[2], users[2], callback);
      },
    ],
    // optional callback
    cb
  );
}

function createComments(cb) {
  async.series(
    [
      function (callback) {
        commentCreate(users[0], posts[2], callback);
      },
      function (callback) {
        postCreate(users[1], posts[1], callback);
      },
      function (callback) {
        postCreate(users[1], posts[2], callback);
      },
      function (callback) {
        postCreate(users[3], posts[2], callback);
      },
      function (callback) {
        postCreate(users[3], posts[3], callback);
      },
      function (callback) {
        postCreate(users[2], posts[2], callback);
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createUsers, createPosts, createComments],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("results: " + results);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
