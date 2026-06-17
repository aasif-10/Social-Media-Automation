const cron = require("node-cron");
const postModel = require("../models/post-model");
const accountModel = require("../models/account-model");
const zernio = require("../config/zerio-config");
const activityLogModel = require("../models/activity-log-model");

module.exports.initScheduler = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const postToPublish = await postModel.find({
      status: "scheduled",
      scheduledAt: {
        $lte: now,
      },
    });

    for (const post of postToPublish) {
      const accounts = await accountModel({
        user: post.user,
        platform: {
          $in: post.platforms,
        },
        status: "connected",
        zernioAccountId: {
          $exists: true,
        },
      });

      if (accounts.length === 0) {
        continue;
      }

      const zernioPlatforms = accounts.map((acc) => {
        return { tform: acc.platform, accountId: acc.zernioAccountId };
      });

      const payload = {
        content: post.content,
        publishNow: true,
        ...(post.mediaUrl
          ? {
              mediaItems: [
                {
                  type: post.mediaType || "image",
                  url: post.mediaUrl,
                },
              ],
            }
          : {}),
        platforms: zernioPlatforms,
      };

      const response = await zernio.posts.createPost({
        body: payload,
      });

      const publishedPost = response.data;

      post.status = "published";

      await post.save();

      await activityLogModel.create({
        user: post.user,
        actionType: "POST_PUBLISHED",
        description: `Published post to ${accounts.map((a) => a.platform).join(", ")}`,
        relatedPost: post._id,
      });
    }
  });
};
