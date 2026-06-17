const express = require("express");
const {
  generatePost,
  getPosts,
  getGenerations,
  schedulePost,
} = require("../controllers/postController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const { healthCheck } = require("../controllers/healthCheck");
const router = express.Router();

router.get("/health", healthCheck);

/**
 * @description Route to generate a post based on user input
 * @route POST /api/posts/generate
 * @access Private
 */
router.post("/generate", isLoggedIn, generatePost);

/**
 * @description Route to get all posts for the authenticated user
 * @route GET /api/posts
 * @access Private
 */
router.get("/", isLoggedIn, getPosts);

/**
 * @description Route to get all generations for the authenticated user
 * @route GET /api/posts/generations
 * @access Private
 */
router.get("/generations", isLoggedIn, getGenerations);

/**
 * @description Route to schedule a post for the authenticated user
 * @route POST /api/posts/schedule
 * @access Private
 */
router.post("/schedule", isLoggedIn, schedulePost);

module.exports = router;
