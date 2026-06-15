const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");
const envConfig = require("../config/env");

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
    res.cookie({ token: token });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: createdUser,
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
