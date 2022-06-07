const connection = require("../models/db");

const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const {
    firstName,
    lastName,
    age,
    country,
    email,
    image,
    bio,
    password,
    role_id,
  } = req.body;

  const salt = 10;

  const encryptedPassword = await bcrypt.hash(password, salt);
  const userName = `${firstName} ${lastName}`;
  const query = `INSERT INTO users (firstName, lastName,userName, birthdate, country,image,email,bio, password, role_id) VALUES (?,?,?,?,?,?,?,?,?,?)`;
  const data = [
    firstName,
    lastName,
    userName,
    age,
    country,
    image,
    email,
    bio,
    encryptedPassword,
    role_id,
  ];

  connection.query(query, data, (err, result) => {
    if (err) {
      return res.status(409).json({
        success: false,
        massage: "The email already exists",
      });
    }
    res.status(200).json({
      success: true,
      massage: "Account Created Successfully",
    });
  });
};

module.exports = {
  register,
};
