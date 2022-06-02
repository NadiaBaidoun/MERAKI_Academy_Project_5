const express = require("express");
const { like, unlike, getAllLikes } = require("../controllers/like");
const authentication = require("../middlewares/authentication");

const likeRouter = express.Router();

likeRouter.get("/", getAllLikes);
likeRouter.post("/:post_id", authentication, like);
likeRouter.delete("/delete/:id", authentication, unlike);


module.exports = likeRouter;
