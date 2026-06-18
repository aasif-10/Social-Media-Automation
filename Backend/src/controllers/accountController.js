const zernio = require("../config/zerio-config");
const accountModel = require("../models/account-model");

/**
 * @description Get all account details of the logged-in user
 * @route GET /api/accounts
 * @access Private
 */
module.exports.getAccounts = async (req, res) => {
  try {
    const account = await accountModel.find({ user: req.user._id });

    if (!account || account.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    return res.status(200).json({ success: true, account });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @description Add a new account for the logged-in user
 * @route POST /api/accounts
 * @access Private
 */
module.exports.addAccount = async (req, res) => {
  try {
    const { platform, handle, avatarUrl } = req.body;

    const account = await accountModel.create({
      user: req.user._id,
      platform,
      handle,
      avatarUrl,
    });

    res.status(201).json({ success: true, account });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @description Delete an account of the logged-in user
 * @route DELETE /api/accounts/:id
 * @access Private
 */
module.exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await accountModel.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!account) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }
    if (account.zernioAccountId) {
      try {
        await zernio.accounts.deleteAccount({
          path: {
            accoundId: account.zernioAccountId,
          },
        });
      } catch (error) {
        console.error("Error deleting account from Zernio:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to delete account from Zernio",
        });
      }
    }

    await account.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
