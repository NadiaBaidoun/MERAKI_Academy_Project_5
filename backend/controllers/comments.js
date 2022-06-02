const connection = require("../models/db");

const createComment = (req, res) => {
  const post_id = req.params.post_id;
  const commenter_id = req.token.userId;

  const { comment } = req.body;

  const query = `INSERT INTO comments (comment, commenter_id, post_id) VALUES (?,?,?)`;
  const data = [comment, commenter_id, post_id];

  connection.query(query, data, (err, result) => {
    if (err) {
      res.status(404).json({
        success: false,
        massage: "server error",
        err: err,
      });
    }
    res.status(201).json({
      success: true,
      massage: "comment created",
      result: result,
    });
  });
};

module.exports = {
  createComment,
};
