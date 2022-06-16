const connection = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email=?`;

  const data = [email];
  connection.query(query, data, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        massage: "server error",
        err: err,
      });
    }
    if (result.length != 0) {
      bcrypt.compare(password, result[0].password, (err, response) => {
        if (err) {
          return res.status(500).json({
            success: false,
            massage: "server error",
            err: err,
          });
        }
        if (response) {
          const payload = {
            userId: result[0].id,
            firstName: result[0].firstName,
            lastName: result[0].lastName,
            image: result[0].image,
            userName: result[0].userName,
            role: result[0].role_id,
          };
          const SECRET = process.env.SECRET;

          const token = jwt.sign(payload, SECRET);

          res.status(200).json({
            success: true,
            message: `Login Success`,
            token,
          });
        } else {
          res.status(403).json({
            success: false,
            message: `The password you’ve entered is incorrect`,
          });
        }
      });
    } else {
      res
        .status(404)
        .json({ success: false, message: "The email doesn't exist" });
    }
  });
};

module.exports = login;
