module.exports = (io) => {
  const users = {};
  let onlineUsers = [];

  io.on("connection", (socket) => {
    socket.on("user", async (user) => {
      socket.data.id = user; // set prop on socket for user id
      users[user] = socket.id; // create link between user id & socket id
      onlineUsers.push(user); // add user to online users
      io.emit("users", onlineUsers); // refresh users for all connected clients
    });
    socket.on("message", async (msg) => {
      const recipient = users[msg.to];
      // find the recipients socket id from users array
      if (recipient) {
        // send to specific socket id via io
        io.to(recipient).emit("message", { msg: msg.message, from: msg.from });
      }
      // confirm message sent to sender
      socket.emit("message", "message sent"); //emit back to client
    });

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((id) => {
        return id != socket.data.id;
        // remove this socket user from online user array
        // emit to all clients
      });
      io.emit("users", onlineUsers); // update all connected clients
    });
  });
};
