const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();

exports.login = async (req, res) => {
  //authenticate using local strategy (check if username/pwd is valid)
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      //authentication failed so return 400 + error message
      return res.status(400).json({
        message: info.message ? info.message : "Something went wrong",
        user: user,
      });
    }
    //auth success
    const token = jwt.sign(user.toJSON(), process.env.SECRET_KEY, {
      expiresIn: "1000000s",
    }); // generate token and return to client
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
    const token = jwt.sign(user.toJSON(), process.env.SECRET_KEY, {
      expiresIn: "1000000s",
    }); // generate token and return to client
    return res.json({ user, token });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
