const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
  media_id: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

//todo likes
module.exports = mongoose.model("Like", LikeSchema);
