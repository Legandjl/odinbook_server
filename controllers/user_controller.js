const User = require("../models/User");

exports.get_user = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

//get user list

exports.search_users = async (req, res) => {
  try {
    const user_list = await User.find().where("name").equals(req.body.name);
    res.status(200).json(user_list);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

exports.update_user_name = async (req, res) => {
  //needs validation todo
  try {
    const updatedUser = new User({
      name: req.body.name,
      email: req.user.email,
      password: req.user.password,
      friends: req.user.friends,
      following: req.user.following,
      followers: req.user.followers,
      profilePic: req.user.profilePic,
      _id: req.user._id,
    });
    await User.findByIdAndUpdate(req.params.id, updatedUser);
    res.status(200).json({
      user_id: req.params.id,
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

// handle like use query like type?=post or type?=comment
// then if {post} increment post likes etc
