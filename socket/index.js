const User = require("../models/User");
const connectionMap = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("user", async (user) => {
      socket.id = user;
      connectionMap[socket.id] = socket;
      console.log(connectionMap);
      console.log("connecting");
      //const recipient = connectionMap[user];
      // this is how we can use the connection map
      // just an example
      // if (recipient) {
      // send to specific socket id via io
      //io.to(recipient).emit("message", "msg");
      // can then emit to a specific client
      // so for notification we can wait for the emit here
      // then if the user is online send them a refresh ping to
      //refresh their notifications
    });

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
        socket.emit("result", users);
      } catch (e) {
        console.log("error");
        socket.emit("result", []);
      }
    });

    socket.on("setRequestsViewed", async (user) => {
      console.log("connected!");
      // TODO set all friend requests to viewed
      socket.emit("setRequestsViewed", user);
    });

    socket.on("disconnect", () => {
      delete connectionMap[socket.id];
    });
  });
};
