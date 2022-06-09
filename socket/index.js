const User = require("../models/User");
module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("search", async (query) => {
      try {
        const users = await User.aggregate([
          {
            $match: {
              $or: [
                { firstName: { $regex: query, $options: "i" } },
                { lastName: { $regex: query, $options: "i" } },
                { fullName: { $regex: query, $options: "i" } },
              ],
            },
          },
          {
            $group: {
              _id: { firstName: "$firstName", lastName: "$lastName" },
            },
          },
        ]).limit(20);
        console.log(users);
        socket.emit("result", users);
      } catch (e) {
        console.log("error");
        socket.emit("result", []);
      }
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });
  });
};
