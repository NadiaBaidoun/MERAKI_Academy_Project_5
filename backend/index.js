const express = require("express");
require("dotenv").config();
const cors = require("cors");
const socket = require("socket.io");

//routers
const postsRouter = require("./routes/posts");
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const permissionRouter = require("./routes/permissions");
const roleRouter = require("./routes/role");
const commentsRouter = require("./routes/comments");
const likeRouter = require("./routes/likes");
const userRouter = require("./routes/users");
require("./models/db");

const app = express();

app.use(express.json());
app.use(cors());

// routes
app.use("/register", registerRouter);
app.use("/posts", postsRouter);
app.use("/login", loginRouter);
app.use("/role", roleRouter);
app.use("/permission", permissionRouter);
app.use("/comments", commentsRouter);
app.use("/likes", likeRouter);
app.use("/user", userRouter);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`server run on PORT ${PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    method: ["GET", "POST"],
  },
});

let onlineUsers = [];
let user = null;
io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  socket.on("userIn", (data) => {
    console.log(data);
    onlineUsers = [...onlineUsers, data.userId];
    io.emit("online", onlineUsers);
  });

  // socket.on("SEND_MESSAGE", (data) => {
  //   console.log("MESSAGE", data);
  //   socket.to(data.room).emit("RECEIVE_MESSAGE", data.content);
  // });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    onlineUsers = [];
  });
});
