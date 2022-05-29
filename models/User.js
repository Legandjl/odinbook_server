const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserScehma = new Schema({
  name: { type: String, maxlength: 20, required: true },
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

module.exports = mongoose.model("User", UserScehma);
