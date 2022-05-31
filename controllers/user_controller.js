const User = require("../models/User");

exports.get_user = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

exports.update_user_name = async (req, res) => {
  //needs validation todo
  try {
    const originalUser = await User.findById(req.params.id);
    const updatedUser = new User({
      name: req.body.name,
      email: originalUser.email,
      password: originalUser.password,
      friends: originalUser.friends,
      following: originalUser.following,
      followers: originalUser.followers,
      profilePic: originalUser.profilePic,
      _id: req.params.id,
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
