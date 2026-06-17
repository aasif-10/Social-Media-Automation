const { generatePostContent } = require("../../services/ai");
const generationModel = require("../models/generation-model");
const postModel = require("../models/post-model");

/**
 * @description Generate a post based on the provided prompt and tone, and save it to the database.
 * @route POST /api/posts/generate
 * @access Private
 */
module.exports.generatePost = async (req, res) => {
  try {
    const { prompt, tone, generateImage } = req.body;

    if (!prompt || !tone) {
      return res.status(400).json({
        success: false,
        message: "Prompt and tone are required fields.",
      });
    }
    const response = await generatePostContent(prompt, tone, generateImage);

    const generation = await generationModel.create({
      user: req.user._id,
      prompt,
      mediaUrl,
      mediaType,
      content: response.content,
      tone,
    });

    res.status(201).json({ success: true, generation });
  } catch (error) {
    console.error("Error generating post:", error);
    res.status(500).json({
      success: false,
      message: "Server error while generating post.",
    });
  }
};

/**
 * @description Get all generations for the authenticated user
 * @route GET /api/posts/generations
 * @access Private
 */
module.exports.getGenerations = async (req, res) => {
  try {
    const generations = await generationModel
      .find({ user: req.user._id })
      .sort({ createdAt: -1 });

    if (!generations) {
      return res.status(404).json({
        success: false,
        message: "No generations found for this user.",
      });
    }
    res.status(200).json({ success: true, generations: generations });
  } catch (error) {
    console.error("Error fetching generations:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching generations.",
    });
  }
};

/**
 * @description Get all posts for the authenticated user
 * @route GET /api/posts
 * @access Private
 */
module.exports.getPosts = async (req, res) => {
  try {
    const posts = await postModel.find({ user: req.user._id });
    if (!posts) {
      return res
        .status(404)
        .json({ success: false, message: "No posts found for this user." });
    }
    res.status(200).json({ success: true, posts: posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching posts." });
  }
};

/**
 * @description Schedule a post for the authenticated user
 * @route POST /api/posts/schedule
 * @access Private
 */
module.exports.schedulePost = async (req, res) => {
  try {
    const { content, platforms, mediaUrl, mediaType, scheduledAt, status } =
      req.body;

    if (!content || !scheduledAt || !platforms || platforms.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Content, scheduled time, and platforms are required fields.",
      });
    }

    let parsedPlatforms = platforms;
    if (typeof platforms === "string") {
      try {
        parsedPlatforms = JSON.parse(platforms);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid platforms format.",
        });
      }
    } else {
      parsedPlatforms = platforms;
    }

    const post = await postModel.create({
      user: req.user._id,
      content,
      platforms: parsedPlatforms,
      mediaUrl,
      mediaType,
      scheduledAt,
      status,
    });

    res.status(201).json({ success: true, post: post });
  } catch (error) {
    console.error("Error scheduling post:", error);
    res.status(500).json({
      success: false,
      message: "Server error while scheduling post.",
    });
  }
};
