const express = require("express");

//controllers
const { createPost, getAllPosts } = require("../controllers/posts");

const postsRouter = express.Router()

//Middlewares
const authentication = require("../middlewares/authentication");

postsRouter.get("/", getAllPosts);
postsRouter.post(
    "/",
    authentication,
    createPost,
  );


module.exports = postsRouter;
