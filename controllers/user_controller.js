const { default: mongoose, mongo } = require("mongoose");
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

// update user

exports.update_user_name = async (req, res) => {
  //needs validation todo
  // needs fullname, firstname, lastname
  // needs change to update individual fields
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

// get friend requests

exports.get_friend_requests = async (req, res) => {
  try {
    const friend_requests = await FriendRequest.find()
      .where("recipient")
      .equals(req.user._id)
      .populate("sender", "fullName profilePic");
    res.status(200).json(friend_requests);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

// send friend req

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
        $and: [
          {
            $or: [
              { recipient: req.body.recipient },
              { recipient: req.user._id },
            ],
          },
          { $or: [{ sender: req.body.recipient }, { sender: req.user._id }] },
        ],
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
    console.log(e);
    return res.status(400).json({ error: e.message });
  }
};

// handle friend req

exports.handle_friend_req = async (req, res) => {
  try {
    const friendRequest = await FriendRequest.findById(req.params.id);
    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request does not exist" });
    }
    const recipient = await User.findById(friendRequest.recipient);
    if (req.query.accept === "false") {
      await FriendRequest.findByIdAndDelete(friendRequest._id);
      return res.status(200);
    }
    await Promise.all([
      User.findByIdAndUpdate(req.user._id, {
        $push: { friends: [recipient._id] },
      }),
      User.findByIdAndUpdate(recipient._id, {
        $push: { friends: [req.user._id] },
      }),
    ]);
    await FriendRequest.findByIdAndDelete(friendRequest._id);
    res.status(200).json(req.user.friends);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

//check if friend req exists

exports.check_friend_req = async (req, res) => {
  try {
    const fr = await FriendRequest.findOne({
      $and: [
        { $or: [{ recipient: req.params.id }, { recipient: req.user._id }] },
        { $or: [{ sender: req.params.id }, { sender: req.user._id }] },
      ],
    });
    res.status(200).json(fr ? fr : false);
  } catch (e) {
    res.send(e);
  }
};

// cancel friend req

exports.cancel_friend_req = async (req, res) => {
  try {
    const fr = await FriendRequest.findOneAndDelete()
      .where("recipient")
      .equals(req.params.id)
      .where("sender")
      .equals(req.user._id);
    res.status(200).json(fr);
  } catch (e) {
    console.log("err");
    return res.status(400).json({ error: e.message });
  }
};

// remove friend

exports.remove_friend = async (req, res) => {
  let id = mongoose.Types.ObjectId(req.params.id);
  let user_id = mongoose.Types.ObjectId(req.user._id);
  try {
    await Promise.all([
      User.findByIdAndUpdate(user_id, {
        $pull: { friends: id },
      }),
      User.findByIdAndUpdate(id, {
        $pull: { friends: user_id },
      }),
    ]);
    res
      .status(200)
      .json(`Friend with id ${req.params.id} removed successfully`);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};
