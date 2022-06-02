const User = require("../models/User");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

//login strategy

const verifier = async (email, password, done) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      //user not found, incorrect email entered
      return done(null, false, { message: "Email not found" });
    }
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (passwordCheck) {
      //password check passed, return user
      return done(null, user);
    }
    //else password check has failed
    return done(null, false, { message: "Incorrect password" });
  } catch (e) {
    return done(e);
  }
};

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      verifier(email, password, done);
    }
  )
);

//token strategy (auth)

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    },
    async (jwtPayload, cb) => {
      try {
        const user = await User.findById(jwtPayload._id);
        if (user) {
          return cb(null, user);
        } else {
          return cb(null, false);
        }
      } catch (e) {
        return cb(e, false);
      }
    }
  )
);
