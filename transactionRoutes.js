const express = require("express");
const router = express.Router();
const {
  deposit,
  withdraw,
  transfer,
  history,
  changePin,
  closeAccount,
} = require("../controllers/transactionController");
const { requireAuth } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiters");

router.use(requireAuth);

router.post("/deposit", deposit);
router.post("/withdraw", authLimiter, withdraw);
router.post("/transfer", authLimiter, transfer);
router.get("/history", history);
router.post("/change-pin", authLimiter, changePin);
router.post("/close-account", authLimiter, closeAccount);

module.exports = router;
