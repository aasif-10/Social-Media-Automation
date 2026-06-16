const userModel = require("../models/user-model");
const accountModel = require("../models/account-model");
const zernio = require("../config/zerio-config");

// Helper function to get or create a Zernio profile for the user
const getOrCreateZernioProfile = async (user) => {
  try {
    const result = await zernio.profiles.listProfiles();
    const profiles = result.data;

    if (profiles.length > 0) {
      const pid = profiles[0].id;
      await userModel.findByIdAndUpdate(user._id, { zernioProfileId: pid });
      return pid;
    }

    const createdProfile = await zernio.profiles.createProfile({
      body: {
        name: `${user.name}'s workspace`,
      },
    });

    const pid = createdProfile.data.id;

    await userModel.findByIdAndUpdate(user._id, { zernioProfileId: pid });

    return pid;
  } catch (error) {
    throw new Error("Failed to get or create Zernio profile");
  }
};

/**
 * @description Generate the authentication URL for the specified social media platform and return it to the client.
 * @route GET /api/social-auth/:platform
 * @access Private
 */
module.exports.generateAuthUrl = async (req, res) => {
  try {
    const { platform } = req.params;
    const profileId = await getOrCreateZernioProfile(req.user);

    const origin = req.headers.origin;
    const redirectUrl = `${origin}/accounts`;

    const result = await zernio.connect.getConnectUrl({
      path: { platform: platform },
      query: { profileId, redirectUrl },
    });

    const authUrl = result.data.authUrl;

    res.status(200).json({ success: true, authUrl });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to generate authentication URL",
      });
  }
};

/**
 * @description Sync the user's connected social media accounts from Zernio and store them in the database.
 * @route POST /api/social-auth/sync-accounts
 * @access Private
 */
module.exports.syncAccounts = async (req, res) => {
  try {
    const profileId = await getOrCreateZernioProfile(req.user);

    const result = await zernio.accounts.listAccounts({
      query: { profileId },
    });

    const data = result.data;
    const zernioAccounts = data.accounts;
    const syncedAccounts = [];
    const supportedPlatforms = ["twitter", "linkedin", "facebook", "instagram"];

    for (const zAccount of zernioAccounts) {
      const zid = zAccount.id;
      if (!zid) {
        continue;
      }
      const rawPlatform = zAccount.platform;
      const normalisedPlatform = supportedPlatforms.find((p) =>
        rawPlatform.includes(p),
      );

      if (!normalisedPlatform) {
        continue;
      }

      const account = await accountModel.findOneAndUpdate(
        { zernioAccountId: zid },
        {
          user: req.user._id,
          platform: normalisedPlatform,
          handle: zAccount.username,
          zernioAccountId: zid,
          status: "connected",
          avatarUrl: zAccount.avatarUrl,
        },
        { upsert: true, returnDocument: "after" },
      );
      syncedAccounts.push(account);
    }
    res.status(200).json({ success: true, accounts: syncedAccounts });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to sync accounts" });
  }
};
