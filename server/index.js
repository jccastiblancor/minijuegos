const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

let conections = 0;
io.on("connection", (socket) => {
  conections += 1;

  socket.emit("hello", conections);
  socket.on("play", ({ currentPlayer, board }) => {
    io.emit("play", { currentPlayer, board });
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

if (process.env.NODE_ENV === "production") {
  app.use(express.static("../web/build"));

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../web", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 4000;
http.listen(PORT, function () {
  console.log(`listening on port ${PORT}`);
});
