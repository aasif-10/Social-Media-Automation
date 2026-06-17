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
      default: "draft",
    },
    platforms: [
      {
        type: String,
        enum: [
          "facebook",
          "twitter",
          "instagram",
          "linkedin",
          "facebook_page",
          "linkedin_page",
        ],
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Post", postSchema);
