const express = require("express");

// controllers
const { followUser } = require("../controllers/user");

// middleware
const authentication = require("../middlewares/authentication");

const userRouter = express.Router();

userRouter.put("/follow/:target_id", authentication, followUser);

module.exports = userRouter;
