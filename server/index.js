const express = require("express");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 4000;
app.use(express.static(path.join(__dirname, "../web/build")));
app.set("port", PORT);

const http = require("http").createServer(app);
const io = require("socket.io")(http);

let conections = 0;
io.on("connection", (socket) => {
  conections += 1;

  socket.emit("hello", conections);
  socket.on("play", ({ currentPlayer, board, walls }) => {
    io.emit("play", { currentPlayer, board, walls });
  });
  if (conections === 2) {
    const startTingPlayer = Math.floor(Math.random() * 2) + 1;
    io.emit("start", startTingPlayer);
  }

  socket.on("disconnect", function () {
    conections -= 1;
    //socket.manager.onClientDisconnect(socket.id); --> endless loop with this disconnect event on server side
    //socket.disconnect(); --> same here
  });
});

http.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});
