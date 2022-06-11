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

// function to get all friends
const getAllFriends = (req, res) => {
  const sourceId = req.token.userId;
  const query = `SELECT * FROM users 
  RIGHT JOIN friends on friends.target_id=users.id WHERE friends.source_id=? AND friends.is_deleted=0;`;
  const data = [sourceId];
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
        massage: "You have no friends",
      });
    }

    res.status(200).json({
      success: true,
      massage: "All your friends",
      result,
    });
  });
};

const getUserFriends = (req, res) => {
  const sourceId = req.params.id;
  const query = `SELECT * FROM users 
  RIGHT JOIN friends on friends.target_id=users.id WHERE friends.source_id=? AND friends.is_deleted=0;`;
  const data = [sourceId];
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
        massage: "No friends",
      });
    }

    res.status(200).json({
      success: true,
      massage: "All User friends",
      result,
    });
  });
};

// function to delete user by id
const deleteUserById = (req, res) => {
  const id = req.params.user_id;

  const query = `UPDATE users SET is_deleted=1 WHERE id=?;`;

  const data = [id];

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
        massage: `User not found`,
      });
    }
    res.status(200).json({
      success: true,
      massage: `User deleted successfully`,
    });
  });
};

const getUserByName = (req, res) => {
  const { userName } = req.params;

  const query = `SELECT * FROM users WHERE is_deleted=0 AND userName LIKE ? ;`;
  const data = [`%${userName}%`];
  connection.query(query, data, (err, result) => {
    console.log(result);
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

// function to update user by id
const updateUserById = (req, res) => {
  const { country, bio, birthdate, cover, image } = req.body;
  const id = req.params.id;

  const query = `SELECT * FROM users WHERE id=?;`;
  const data = [id];

  connection.query(query, data, (err, result) => {
    if (err) {
      return res.status(404).json({
        success: false,
        massage: `Server error`,
        err,
      });
    }
    if (!result.length) {
      res.status(404).json({
        success: false,
        massage: `no user found`,
      });
    } else {
      const query = `UPDATE users SET country =? ,bio=? ,birthdate=?,cover=?,image=? WHERE id=?;`;
      const data = [
        country || result[0].country,
        bio || result[0].bio,
        birthdate || result[0].birthdate,
        cover || result[0].cover,
        image || result[0].image,
        id,
      ];

      connection.query(query, data, (err, result) => {
        if (err) {
          return res.status(404).json({
            success: false,
            massage: `Server error`,
            err,
          });
        }
        console.log(result);
        res.status(201).json({
          success: true,
          massage: `user updated`,
          result: result,
        });
      });
    }
  });
};
module.exports = {
  followUser,
  unFollowUser,
  getUserById,
  getAllFriends,
  deleteUserById,
  getUserByName,
  updateUserById,
  getUserFriends,
};
