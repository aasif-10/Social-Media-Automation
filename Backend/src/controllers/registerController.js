const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");
const envConfig = require("../config/env-config");
const bcrypt = require("bcrypt");

/**
 * @description Register a new user by validating the input, checking for existing users, hashing the password, creating the user in the database, and returning a JWT token for authentication.
 * @route POST /api/auth/register
 * @access Public
 */
module.exports.registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userExists = await userModel.findOne({
      email: email,
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { email: email, userId: createdUser._id },
      envConfig.JWT_SECRET,
      { expiresIn: "3d" },
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        zernioProfileId: createdUser.zernioProfileId ?? null,
      },
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
