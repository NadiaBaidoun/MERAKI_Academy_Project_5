const express = require("express");



const { createPermission } = require("../controllers/permission");

const permissionRouter = express.Router();


permissionRouter.post("/:role_id", createPermission);



module.exports = permissionRouter;
