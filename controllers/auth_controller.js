const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();
//login

//reconfigure passport to use email instead of username for verification
exports.login = async (req, res) => {
  console.log("reached");
  //authenticate using local strategy (check if username/pwd is valid)
  passport.authenticate("local", { session: false }, (err, user, info) => {
    console.log("failed here");
    if (err || !user) {
      //authentication failed so return 400 + error message
      return res.status(400).json({
        message: info.message ? info.message : "Something went wrong",
        user: user,
      });
    }

    //auth passed so login and generate token for return to client
    const token = jwt.sign(user.toJSON(), process.env.SECRET_KEY, {
      expiresIn: "10000s",
    });
    return res.json({ user, token });
  })(req, res);
};
//signup
exports.signup = async (req, res) => {
  try {
    // Check if email in use
    const checkEmail = await User.exists()
      .where("email")
      .equals(req.body.email);
    if (checkEmail) {
      return res.status(422).json({ error: "email already in use" });
    }
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.username,
      password: hashPassword,
      email: req.body.email,
    });
    await user.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
