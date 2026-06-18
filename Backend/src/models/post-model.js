const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    mediaUrl: {
      type: String,
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "published", "failed"],
      default: "scheduled",
    },
    platforms: [
      {
        type: String,
        enum: [
          "facebook",
          "twitter",
          "instagram",
          "linkedin",
        ],
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Post", postSchema);
