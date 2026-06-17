const express = require("express");
const { getActivity } = require("../controllers/acitivityLogController");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/isLoggedIn");

/**
 * @description  Get user activity logs
 * @route   GET /api/activity
 * @access  Private
 */
router.get("/", isLoggedIn, getActivity);

module.exports = router;
