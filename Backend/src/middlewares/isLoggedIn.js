const jwt = require("jsonwebtoken");
const envConfig = require("../config/env-config");
const userModel = require("../models/user-model");

/**
 * Middleware to check if the user is logged in by verifying the JWT token.
 * If the token is valid, it attaches the user information to the request object and calls the next middleware.
 * If the token is missing or invalid, it responds with a 401 Unauthorized status.
 */
module.exports.isLoggedIn = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization?.startsWith("Bearer ") &&
    req.headers.authorization
  ) {
    token = req.headers.authorization?.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const decoded = jwt.verify(token, envConfig.JWT_SECRET);

  if (!decoded) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }

  const user = await userModel
    .findOne({ _id: decoded.userId })
    .select("-password");

  if (!user) {
    return res.status(401).json({ success: false, message: "User not found" });
  }

  req.user = user;
  next();
};
