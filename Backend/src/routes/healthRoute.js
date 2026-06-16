const express = require("express");
const router = express.Router();

/**
 * @description Health check endpoint to verify that the server is running.
 * @route GET /health
 * @access Public
 */
router.get("/", (req, res) => {
  res.status(200).json({ message: "Server is live" });
});

module.exports = router;
