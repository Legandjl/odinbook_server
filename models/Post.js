const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  content: { type: String, required: true },
  location: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Post", PostSchema);
