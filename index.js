const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

let users = {};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

app.get("/background-image", (req, res) => {
  res.sendFile(__dirname + "/client/bg.jpg");
});

app.get("/script", (req, res) => {
  res.sendFile(__dirname + "/client/script.js");
});

app.get("/style", (req, res) => {
  res.sendFile(__dirname + "/client/style.css");
});

app.get("/tone", (req, res) => {
  res.sendFile(__dirname + "/client/iphone_notification.mp3");
});

app.get("/favi", (req, res) => {
  res.sendFile(__dirname + "/client/favicon.ico");
});

io.on("connect", (socket) => {
  socket.on("new-user", (user) => {
    users[socket.id] = user;
    socket.broadcast.emit("user-connected", user);
  });
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing_status", data);
  });
  socket.on("chat-message", (msg) => {
    socket.broadcast.emit("chat-message", {
      username: users[socket.id],
      message: msg,
    });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});

http.listen(port, () => {
  console.log(`Listeing to http://localhost:${port}`);
});
