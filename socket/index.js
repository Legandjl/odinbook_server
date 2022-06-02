const User = require("../models/User");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("connected");

    socket.on("search", async (query) => {
      try {
        console.log("emitting");
        const users = await User.find({ name: { $regex: query } });
        socket.emit("result", users);
      } catch (e) {
        socket.emit("result", []);
      }
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });
  });
};
