const Comment = require("../models/Comment");
const Post = require("../models/Post");

//get comments by post id
exports.get_comments_by_post = async (req, res) => {
  try {
    const comments = await Comment.find()
      .where("post")
      .equals(req.params.id)
      .sort({ date: 1 })
      .skip(req.params.skip)
      .limit(5);

    res.status(200).json(comments);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

//post comment to a post by id
exports.post_comment = async (req, res) => {
  try {
    const checkexists = await Post.exists({ _id: req.params.id });
    if (!checkexists) {
      return res.status(404).json({ message: "Post does not exist" });
    }
    const blog_post = await Post.findById(req.params.id).exec();
    const comment = new Comment({
      user: req.user,
      comment: req.body.comment,
      post: blog_post._id,
    });
    await comment.save();
    res.status(200).json({
      comment_id: comment._id,
      post_id: blog_post._id,
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
