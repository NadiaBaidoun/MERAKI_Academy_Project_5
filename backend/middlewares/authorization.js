const connection = require("../models/db");

const authorization = (string) => {
  return function (req, res, next) {
    const roleId = req.token.role;

    const query = `SELECT * FROM role_permission INNER JOIN permissions ON role_permission.permission_id = permissions.id WHERE role_permission.role_id = (?) AND permissions.permission = (?)`;
    const data = [roleId, string];
    connection.query(query, data, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          massage: "server error",
          err: err,
        });
      }
      if (result.length) {
        next();
      } else {
        res.status(400).json({ message: "unauthorized" });
      }
    });
  };
};

module.exports = authorization;
