const express = require("express");

//controllers
const {
  createPost,
  getAllPosts,
  updatePostById,
  deletePostById,
  getPostByUserId,
} = require("../controllers/posts");

const postsRouter = express.Router();

//Middlewares
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

postsRouter.get("/user/:id", getPostByUserId);
postsRouter.get("/", getAllPosts);
postsRouter.put("/:id", updatePostById);
postsRouter.post("/", authentication, createPost);
postsRouter.delete(
  "/:id",
  authentication,
  authorization("DELETE_POST"),
  deletePostById
);

module.exports = postsRouter;
