const connection = require("../models/db");

const like = (req, res) => {
  const post_id = req.params.post_id;
  const user_id = req.token.userId;

  const query = `INSERT INTO likes (is_liked, user_id, post_id) VALUES (1,?,?);`;
  const data = [user_id, post_id];

  connection.query(query, data, (err, result) => {
    if (err) {
      return res.status(404).json({
        success: false,
        massage: "server error",
        err: err,
      });
    }
    res.status(201).json({
      success: true,
      massage: "post liked",
      result: result,
    });
  });
};

module.exports = { like };
