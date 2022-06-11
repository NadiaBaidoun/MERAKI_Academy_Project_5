const express = require("express");

// controllers
const {
  followUser,
  unFollowUser,
  getUserById,
  getAllFriends,
  deleteUserById,
  getUserByName,
  updateUserById,
  getUserFriends,
  getAllUsers,

} = require("../controllers/user");

// middleware
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

const userRouter = express.Router();

userRouter.put("/follow/:target_id", authentication, followUser);
userRouter.delete("/delete/:target_id", authentication, unFollowUser);

userRouter.get("/search_2/users", getAllUsers);

userRouter.get("/:user_id", authentication, getUserById);

userRouter.get("/list/friends/:id", authentication, getAllFriends);
userRouter.get("/friends/:id", getUserFriends);
userRouter.get("/search/:userName", authentication, getUserByName);
userRouter.put("/:id", updateUserById);

userRouter.delete(
  "/:user_id",
  authentication,
  authorization("DELETE_USER"),
  deleteUserById
);
module.exports = userRouter;
