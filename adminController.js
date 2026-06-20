const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

// GET /api/admin/stats
exports.stats = async (req, res) => {
  try {
    const totalAccounts = await Account.countDocuments({ status: { $ne: "closed" } });
    const totalTransactions = await Transaction.countDocuments();

    const balanceAgg = await Account.aggregate([
      { $match: { status: { $ne: "closed" } } },
      { $group: { _id: null, total: { $sum: "$balance" } } },
    ]);
    const totalBalance = balanceAgg[0]?.total || 0;

    const typeAgg = await Account.aggregate([
      { $match: { status: { $ne: "closed" } } },
      { $group: { _id: "$accountType", count: { $sum: 1 }, balance: { $sum: "$balance" } } },
    ]);

    // Transactions per day, last 14 days — for the trend chart
    const since = new Date();
    since.setDate(since.getDate() - 14);
    const dailyAgg = await Transaction.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          volume: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalAccounts,
      totalTransactions,
      totalBalance,
      byType: typeAgg,
      dailyActivity: dailyAgg,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load admin statistics." });
  }
};

// GET /api/admin/accounts
exports.listAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({})
      .select("-passwordHash -pinHash")
      .sort({ createdAt: -1 });
    res.json({ accounts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load accounts." });
  }
};

// GET /api/admin/transactions
exports.listTransactions = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const txns = await Transaction.find({}).sort({ createdAt: -1 }).limit(limit);
    res.json({ transactions: txns });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load transactions." });
  }
};

// PATCH /api/admin/accounts/:accountNumber/status
exports.updateAccountStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "frozen", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }
    const account = await Account.findOneAndUpdate(
      { accountNumber: req.params.accountNumber },
      { status },
      { new: true }
    ).select("-passwordHash -pinHash");
    if (!account) return res.status(404).json({ message: "Account not found." });
    res.json({ message: "Account status updated.", account });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update account status." });
  }
};
