const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    platform: {
      type: String,
      enum: ["twitter", "linkedin", "facebook", "instagram"],
      required: true,
    },
    handle: {
      type: String,
      required: true,
    },
    zernioAccountId: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    tokenExpiresAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["connected", "disconnected"],
      default: "connected",
    },
    avatarUrl: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Account", accountSchema);
