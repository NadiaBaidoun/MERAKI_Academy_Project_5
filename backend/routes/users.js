const express = require("express");

// controllers
const {
  followUser,
  unFollowUser,
  getUserById,
} = require("../controllers/user");

// middleware
const authentication = require("../middlewares/authentication");

const userRouter = express.Router();

userRouter.put("/follow/:target_id", authentication, followUser);
userRouter.delete("/delete/:target_id", authentication, unFollowUser);

userRouter.get("/:user_id", authentication, getUserById);

module.exports = userRouter;
