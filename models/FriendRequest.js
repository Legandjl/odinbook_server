const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FriendRequestSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rejected: { type: Boolean, default: false },
  viewed: { type: Boolean, default: false },
});

module.exports = mongoose.model("FriendRequest", FriendRequestSchema);
