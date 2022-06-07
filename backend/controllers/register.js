const connection = require("../models/db");

const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const { firstName, lastName, age, country, email, password, role_id } =
    req.body;

  const image =
    "https://www.icmetl.org/wp-content/uploads/2020/11/user-icon-human-person-sign-vector-10206693.png";
  const cover =
    "https://media.istockphoto.com/photos/empty-white-studio-room-abstract-background-picture-id1147521090?b=1&k=20&m=1147521090&s=170667a&w=0&h=z2Syz9Pwcb55xKIIbp08AFPJyVjZM28t5IZLyyhqV3k=";

  const salt = 10;

  const encryptedPassword = await bcrypt.hash(password, salt);
  const userName = `${firstName} ${lastName}`;
  const query = `INSERT INTO users (firstName, lastName,userName, birthdate, country,image,email,cover, password, role_id) VALUES (?,?,?,?,?,?,?,?,?,?)`;
  const data = [
    firstName,
    lastName,
    userName,
    age,
    country,
    image,
    email,
    cover,
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
