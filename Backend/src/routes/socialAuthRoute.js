const express = require("express");
const {
  generateAuthUrl,
  syncAccounts,
} = require("../controllers/socialAuthController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const router = express.Router();
const { healthCheck } = require("../controllers/healthCheck");

router.get("/health", healthCheck);

/**
 * @description Generate the authentication URL for the specified social media platform and return it to the client.
 * @route GET /api/social-auth/:platform
 * @access Private
 */
router.get("/:platform", isLoggedIn, generateAuthUrl);

/**
 * @description Sync the user's connected social media accounts from Zernio and store them in the database.
 * @route GET /api/social-auth/sync-accounts
 * @access Private
 */
router.get("/sync", isLoggedIn, syncAccounts);

module.exports = router;
