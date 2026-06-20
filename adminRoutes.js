const express = require("express");
const router = express.Router();
const {
  stats,
  listAccounts,
  listTransactions,
  updateAccountStatus,
} = require("../controllers/adminController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.use(requireAuth, requireAdmin);

router.get("/stats", stats);
router.get("/accounts", listAccounts);
router.get("/transactions", listTransactions);
router.patch("/accounts/:accountNumber/status", updateAccountStatus);

module.exports = router;
