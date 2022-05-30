const Post = require("../models/Post");

exports.get_post = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};
//needs to get all posts that are in req.user.following
//set up auth then access user by req.user
exports.get_home_posts = async (req, res) => {
  try {
    const blog_data = await Post.find()
      .sort({ date: -1 })
      .skip(req.params.skip)
      .limit(1);
    // where creator is in req.user.following
    res.status(200).json(blog_data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

//possibly combine into one

exports.get_wall_posts = async (req, res) => {
  try {
    const blog_data = await Post.find()
      .sort({ date: -1 })
      .skip(req.params.skip)
      .limit(1);
    //where location == req.user
    res.status(200).json(blog_data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.create_post = async (req, res) => {
  //needs validation
  try {
    const post = new Post({
      creator: req.body.creator,
      content: req.body.content,
      location: req.body.location,
    });
    await post.save();
    res.status(200).json({
      post_id: post._id,
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

exports.update_post = async (req, res) => {
  //needs validation
  try {
    const originalPost = await Post.findById(req.params.id);
    const updatedPost = new Post({
      creator: originalPost.creator,
      date: originalPost.date,
      content: req.body.content,
      location: originalPost.location,
      _id: req.params.id,
    });
    await Post.findByIdAndUpdate(req.params.id, updatedPost);
    res.status(200).json({
      post_id: req.params.id,
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

exports.delete_post = async (req, res) => {
  try {
    await Post.findByIdAndRemove(req.params.id);
    return res
      .status(200)
      .json({ message: `Post with ID ${req.params.id} deleted` });
  } catch (e) {
    res.status(400).json({ error: "Post could not be removed" });
  }
};
