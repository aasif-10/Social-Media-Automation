const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["POST_PUBLISHED", "AI_REPLY"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    aiGeneratedText: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
