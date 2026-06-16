const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");
const envConfig = require("../config/env-config");

/**
 * @description Login a user with email and password, generate a JWT token, and return the user data and token to the client.
 * @route POST /api/auth/login
 * @access Public
 */
module.exports.loginController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userExist = await userModel.findOne({ email });
    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, userExist.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { email: email, userId: userExist._id },
      envConfig.JWT_SECRET,
      {
        expiresIn: "3d",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userExist,
      token: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
