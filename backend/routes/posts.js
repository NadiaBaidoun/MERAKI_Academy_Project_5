const express = require("express");

//controllers
const { createPost } = require("../controllers/posts");

const postsRouter = express.Router()

//Middlewares
const authentication = require("../middlewares/authentication");

postsRouter.post(
    "/",
    authentication,
    createPost,
  );


module.exports = postsRouter;
