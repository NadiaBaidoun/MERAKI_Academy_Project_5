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


// function to update post by id
const updateCommentById = (req, res) => {
    const { comment } = req.body;
    const id = req.params.id;
  
    const query = `SELECT * FROM comments WHERE id=?;`;
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
          massage: `no comment found`,
        });
      } else {
        const query = `UPDATE comments SET comment=?WHERE id=?;`;
        const data = [comment || result[0].comment, id];
  
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
            massage: `comment updated`,
            result: result,
          });
        });
      }
    });
  };


  const deleteCommentById = (req, res) => {
    const id = req.params.id;
  
    const query = `UPDATE comments SET is_deleted=1 WHERE id=?;`;
  
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
          massage: `comment not found`,
        });
      }
      res.status(200).json({
        success: true,
        massage: `comment deleted successfully`,
      });
    });
  };
  
  

module.exports = {
  createComment,updateCommentById ,deleteCommentById
};
