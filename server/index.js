const express = require("express");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 4000;
app.use(express.static(path.join(__dirname, "../web/build")));
app.set("port", PORT);

const http = require("http").createServer(app);
const io = require("socket.io")(http);

let conections = 0;
players = { p1: false, p2: false };
sockets_id = [-1, -1];
io.on("connection", (socket) => {
  if (!players.p1) {
    players.p1 = true;
    socket.emit("hello", 1);
    sockets_id[0] = socket.id;
  } else if (!players.p2) {
    players.p2 = true;
    socket.emit("hello", 2);
    sockets_id[1] = socket.id;
  } else {
    i = 0;
    socket.emit("hello", 0);
  }

  socket.on("play", ({ currentPlayer, board, walls }) => {
    io.emit("play", { currentPlayer, board, walls });
  });
  if (players.p1 && players.p2) {
    const startTingPlayer = Math.floor(Math.random() * 2) + 1;
    io.emit("start", startTingPlayer);
  }

  socket.on("disconnect", function () {
    if (sockets_id[0] === socket.id) {
      players.p1 = false;
      sockets_id[0] = -1;
    } else if (sockets_id[1] === socket.id) {
      players.p2 = false;
      sockets_id[1] = -1;
    }
    //socket.manager.onClientDisconnect(socket.id); --> endless loop with this disconnect event on server side
    //socket.disconnect(); --> same here
  });
});

http.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});
