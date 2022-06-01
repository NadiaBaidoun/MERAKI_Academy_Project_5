const express = require("express");
require("dotenv").config();
const cors = require("cors");


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
app.use("/posts",postsRouter);
app.use("/login", loginRouter);
app.use("/role", roleRouter);
app.use("/permission", permissionRouter);
app.use("/comments",commentsRouter);
app.use("/likes",likeRouter);
app.use("/user",userRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server run on PORT ${PORT}`);
});
