const express = require("express");
const { createComment ,updateCommentById } = require("../controllers/comments");
const authentication = require("../middlewares/authentication");

const commentsRouter = express.Router();

commentsRouter.post("/:post_id", authentication,createComment);

commentsRouter.put("/update/:id", updateCommentById);


module.exports = commentsRouter;