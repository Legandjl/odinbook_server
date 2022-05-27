module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("new connection");

    socket.on("msg", async () => {
      //get message event
      console.log("adding message to db");
      console.log("sending latest msgs back to client");

      socket.emit("msg", "thanks"); //emit back to client
    });

    socket.on("disconnect", () => console.log("disconnected"));
  });
};
