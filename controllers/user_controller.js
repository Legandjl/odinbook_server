const User = require("../models/User");

exports.get_user = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};
