const { default: mongoose } = require("mongoose");
const FriendRequest = require("../models/FriendRequest");
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

exports.send_friend_req = async (req, res) => {
  //needs validation todo
  try {
    let id = mongoose.Types.ObjectId(req.user._id);
    const [check_if_friends, check_if_req] = await Promise.all([
      User.exists({
        friends: { $in: [req.body.recipient] },
        _id: id,
      }),
      FriendRequest.exists({
        sender: req.user._id,
        recipient: req.body.recipient,
      }),
    ]);
    if (check_if_friends) {
      throw new Error("User already friends");
    }
    if (check_if_req) {
      throw new Error("friend request already exists");
    }
    const friendRequest = new FriendRequest({
      sender: req.user._id,
      recipient: req.body.recipient,
    });
    await friendRequest.save();
    res.status(200).json({
      friendRequest,
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

exports.handle_friend_req = async (req, res) => {
  //needs validation todo
  try {
    const friendRequest = await FriendRequest.findById(req.params.id);
    if (!friendRequest) {
      throw new Error("Friend request does not exist");
    }
    if (friendRequest.rejected === true) {
      throw new Error("Friend request declined");
    }
    const [sender, recipient] = await Promise.all([
      User.findById(friendRequest.sender),
      User.findById(friendRequest.recipient),
    ]);
    if (req.query.accept === "false") {
      const updated = await FriendRequest.findByIdAndUpdate(req.params.id, {
        $set: { rejected: true },
      });
      return res.json(updated);
    }
    await Promise.all([
      User.findByIdAndUpdate(sender._id, {
        $push: { friends: [recipient._id] },
      }),
      User.findByIdAndUpdate(recipient._id, {
        $push: { friends: [sender._id] },
      }),
    ]);
    await FriendRequest.findByIdAndDelete(friendRequest._id);
    res.status(200).json(sender.friends);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

exports.remove_friend = async (req, res) => {
  let id = mongoose.Types.ObjectId(req.params.id);
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { friends: id },
    });
    res
      .status(200)
      .json(`Friend with id ${req.params.id} removed successfully`);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};
