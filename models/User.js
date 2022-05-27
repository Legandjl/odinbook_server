const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserScehma = new Schema({
  name: { type: String, maxlength: 20, required: true },
  password: { type: String, required: true },
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  profilePic: { type: String, default: "n/a" },
});

module.exports = mongoose.model("User", UserScehma);
