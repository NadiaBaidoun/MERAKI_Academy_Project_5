const express = require("express");
const { like } = require("../controllers/like");
const authentication = require("../middlewares/authentication");

const likeRouter = express.Router();

likeRouter.post("/:post_id", authentication, like);

module.exports = likeRouter;
