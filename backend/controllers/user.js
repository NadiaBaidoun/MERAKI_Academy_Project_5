const connection = require("../models/db");

//function to follow another user
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

// function to unfollow user
const unFollowUser = (req, res) => {
  const sourceId = req.token.userId;
  const targetId = req.params.target_id;

  const query = `UPDATE friends SET is_deleted=1 WHERE source_id=? AND target_id=? AND is_deleted=0;`;

  const data = [sourceId, targetId];

  connection.query(query, data, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        massage: "Server Error",
        err,
      });
    }

    if (!result.changedRows) {
      return res.status(405).json({
        success: false,
        massage: `User unfollowed already`,
      });
    }
    res.status(200).json({
      success: true,
      massage: `User unfollowed successfully`,
    });
  });
};

//function to get user by id
const getUserById = (req, res) => {
  const userId = req.params.user_id;
  const query = `SELECT * FROM users WHERE id=? AND is_deleted=0;`;
  const data = [userId];
  connection.query(query, data, (err, result) => {
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
        massage: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      massage: "user found",
      result,
    });
  });
};

module.exports = { followUser, unFollowUser, getUserById };
