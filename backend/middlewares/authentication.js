const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(403).json({ success: false, message: "forbidden" });
  }

  const token = auth.split(" ").pop();

  jwt.verify(token, process.env.SECRET, (err, payload) => {
    if (err) {
      res.status(403).json({
        success: false,
        message: `Invalid token`,
      });
    } else {
      req.token = payload;
      next();
    }
  });
};

module.exports = authentication;
