const express = require("express");
const {
  createComment,
  updateCommentById,
  deleteCommentById,
  getAllComments,
} = require("../controllers/comments");
const authentication = require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

const commentsRouter = express.Router();

commentsRouter.post("/:post_id", authentication, createComment);

commentsRouter.put("/update/:id", updateCommentById);

commentsRouter.delete(
  "/delete/:id",
  authentication,
  authorization("DELETE_COMMENT"),
  deleteCommentById
);

commentsRouter.get("/", getAllComments);

module.exports = commentsRouter;
