const connection = require("../models/db");

// function to create task
const createPost = (req, res) => {
  const { content } = req.body;
  const userId = req.token.userId;
  const query = `INSERT INTO posts (content,user_id) VALUES (?,?);`;
  const data = [content, userId];

  connection.query(query, data, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        massage: "Server error",
        err,
      });
    }
    res.status(200).json({
      success: true,
      massage: "post created",
      result,
    });
  });
};

module.exports = {
    createPost,
  };
  