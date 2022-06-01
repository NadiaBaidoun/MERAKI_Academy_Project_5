const express = require("express");
const { createNewRole } = require("../controllers/role");



const roleRouter = express.Router();

roleRouter.post("/",createNewRole);

module.exports = roleRouter;
