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

const unlike = (req, res) => {
  const user_id = req.token.userId;
  const post_id = req.params.id;

  const query = `UPDATE likes SET is_deleted=1 WHERE is_liked=1 AND user_id=? AND post_id=?;`;

  const data = [user_id, post_id];

  connection.query(query, data, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        massage: "Server Error",
        err,
      });
    }

    if (!result.changedRows) {
      return res.status(404).json({
        success: false,
        massage: `post not found`,
      });
    }
    res.status(200).json({
      success: true,
      massage: `post unliked`,
    });
  });
};

const getAllLikes = (req, res) => {
  const query = `SELECT * FROM likes WHERE is_deleted=0;`;

  connection.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        massage: "Server error",
        err,
      });
    }
    if (!result.length) {
      return res.status(404).json({
        success: false,
        massage: "No likes",
      });
    }

    res.status(200).json({
      success: true,
      massage: "All likes",
      result,
    });
  });
};

module.exports = { like, unlike ,getAllLikes };
