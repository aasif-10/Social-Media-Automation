const express = require("express");
const router = express.Router();
const { registerController } = require("../controllers/registerController");
const { loginController } = require("../controllers/loginController");
const { healthCheck } = require("../controllers/healthCheck");

router.get("/health", healthCheck);

/**
 * @description Register a new user
 * @route POST /api/register
 * @access Public
 */
router.post("/register", registerController);

/**
 * @description Login a user
 * @route POST /api/login
 * @access Public
 */
router.post("/login", loginController);

module.exports = router;
