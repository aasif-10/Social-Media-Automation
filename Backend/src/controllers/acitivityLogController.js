const acitivityLogModel = require("../models/acitivity-log-model");

/**
 * @description Get user activity logs
 * @route   GET /api/activity
 * @access  Private
 */
module.exports.getActivity = async (req, res) => {
  const acitivityLogs = await acitivityLogModel
    .find({ user: req.user._id })
    .sort({ createdAt: -1 });
  if (!acitivityLogs) {
    return res.status(404).json({
      success: false,
      message: "No activity logs found for this user",
    });
  }
  res.status(200).json({ success: true, activityLogs: acitivityLogs });
};
