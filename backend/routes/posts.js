const express = require("express");

//controllers
const { createPost, getAllPosts, updatePostById } = require("../controllers/posts");

const postsRouter = express.Router()

//Middlewares
const authentication = require("../middlewares/authentication");

postsRouter.get("/", getAllPosts);
postsRouter.put("/:id", updatePostById);
postsRouter.post(
    "/",
    authentication,
    createPost,
  );


module.exports = postsRouter;
