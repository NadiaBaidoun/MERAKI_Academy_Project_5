const express = require("express");
const { createComment ,updateCommentById, deleteCommentById, getAllComments } = require("../controllers/comments");
const authentication = require("../middlewares/authentication");

const commentsRouter = express.Router();

commentsRouter.post("/:post_id", authentication,createComment);

commentsRouter.put("/update/:id", updateCommentById);

commentsRouter.delete( "/delete/:id", authentication, deleteCommentById);


commentsRouter.get( "/", getAllComments);



module.exports = commentsRouter;