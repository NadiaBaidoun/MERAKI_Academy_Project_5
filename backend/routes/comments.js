const express = require("express");
const { createComment } = require("../controllers/comments");

const commentsRouter = express.Router();

commentsRouter.post("/:post_id", createComment);

module.exports = commentsRouter;