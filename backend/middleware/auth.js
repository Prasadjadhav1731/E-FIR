const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
  try {
    let token =
      req.cookies?.token ||
      (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.slice(7).trim()
        : req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET || "shubham");
      req.user = decode;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Bad Request",
    });
  }
};