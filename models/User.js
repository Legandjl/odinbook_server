const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserScehma = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fullName: { type: String, required: true },

  email: { type: String, required: true },
  password: { type: String, required: true },
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  profilePic: {
    type: String,
    default:
      "https://i0.wp.com/mitchelldistribution.co.uk/wp-content/uploads/2020/06/profile-pic-MD.jpg?ssl=1",
  },
});

UserScehma.pre("save", function (next) {
  this.funnyTest = "test";
  next();
});

module.exports = mongoose.model("User", UserScehma);
