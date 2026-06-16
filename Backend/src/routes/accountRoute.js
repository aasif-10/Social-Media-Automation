const express = require("express");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const {
  getAccounts,
  addAccount,
  deleteAccount,
} = require("../controllers/accountController");
const { healthCheck } = require("../controllers/healthCheck");
const router = express.Router();

router.get("/health", healthCheck);

router.get("/", isLoggedIn, getAccounts);

router.post("/", isLoggedIn, addAccount);

router.delete("/:id", isLoggedIn, deleteAccount);

module.exports = router;
