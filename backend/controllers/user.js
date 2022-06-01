const connection = require("../models/db");

const followUser = (req, res) => {
  const sourceId = req.token.userId;
  const targetId = req.params.target_id;
  const query = `SELECT * FROM friends WHERE source_id=? AND target_id=?  AND is_deleted=0;`;
  const data = [sourceId, targetId];

  connection.query(query, data, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        massage: "server error",
        err,
      });
    }

    if (!result.length) {
      const query = `INSERT INTO friends (source_id,target_id) VALUES (?,?);`;
      const data = [sourceId, targetId];
      connection.query(query, data, (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            massage: "server error",
            err,
          });
        }
        res.status(200).json({
          success: true,
          massage: "User followed successfully",
          result,
        });
      });
    } else {
      res.status(200).json({
        success: false,
        massage: "User already followed",
        result,
      });
    }
  });
};

module.exports = { followUser };
