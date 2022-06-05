const connection = require("../models/db");

// function to create post
const createPost = (req, res) => {
  const { content,image } = req.body;
  const userId = req.token.userId;
  const query = `INSERT INTO posts (content,image,user_id) VALUES (?,?,?);`;
  const data = [content,image,userId];

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

// function to get all Posts
const getAllPosts = (req, res) => {
  const query = `SELECT * FROM posts WHERE is_deleted=0;`;

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
        massage: "no posts yet",
      });
    }

    res.status(200).json({
      success: true,
      massage: "All posts",
      result,
    });
  });
};
// function to update post by id
const updatePostById = (req, res) => {
  const { content } = req.body;
  const id = req.params.id;

  const query = `SELECT * FROM posts WHERE id=?;`;
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
        massage: `no posts found`,
      });
    } else {
      const query = `UPDATE posts SET content=?WHERE id=?;`;
      const data = [content || result[0].content, id];

      connection.query(query, data, (err, result) => {
        if (err) {
          return res.status(404).json({
            success: false,
            massage: `Server error`,
            err,
          });
        }
        res.status(201).json({
          success: true,
          massage: `posts updated`,
          result: result,
        });
      });
    }
  });
};

// function to get all posts by userID
const getPostByUserId = (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM posts WHERE user_id=? AND is_deleted=0;`;
  const data = [id];
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
        massage: "no Post yet for this user",
      });
    }

    res.status(200).json({
      success: true,
      massage: "All tasks",
      result,
    });
  });
};

//function to delete post by id
const deletePostById = (req, res) => {
  const id = req.params.id;

  const query = `UPDATE posts SET is_deleted=1 WHERE id=?;`;

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
        massage: `post not found`,
      });
    }
    res.status(200).json({
      success: true,
      massage: `post deleted successfully`,
    });
  });
};

module.exports = {
  createPost,
  getAllPosts,
  updatePostById,
  getPostByUserId,
  deletePostById,
};
