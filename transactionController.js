const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

function publicAccount(acc) {
  return {
    id: acc._id,
    accountNumber: acc.accountNumber,
    name: acc.name,
    email: acc.email,
    mobile: acc.mobile,
    accountType: acc.accountType,
    balance: acc.balance,
    status: acc.status,
    role: acc.role,
    createdAt: acc.createdAt,
  };
}

const MIN_BALANCE = { Savings: 500, Current: 0 };

// POST /api/transactions/deposit
exports.deposit = async (req, res) => {
  try {
    const { amount } = req.body;
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      return res.status(400).json({ message: "Enter a valid deposit amount." });
    }

    const account = await Account.findById(req.user._id);
    account.balance += amt;
    await account.save();

    const txn = await Transaction.create({
      account: account._id,
      accountNumber: account.accountNumber,
      type: "DEPOSIT",
      amount: amt,
      balanceAfter: account.balance,
    });

    res.json({ message: "Deposit successful.", balance: account.balance, transaction: txn });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Deposit failed. Please try again." });
  }
};

// POST /api/transactions/withdraw
exports.withdraw = async (req, res) => {
  try {
    const { amount, pin } = req.body;
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      return res.status(400).json({ message: "Enter a valid withdrawal amount." });
    }
    if (!pin) {
      return res.status(400).json({ message: "PIN is required to withdraw money." });
    }

    const account = await Account.findById(req.user._id);
    const pinMatch = await account.comparePin(String(pin));
    if (!pinMatch) {
      return res.status(401).json({ message: "Incorrect PIN." });
    }

    const minBalance = MIN_BALANCE[account.accountType] ?? 0;
    if (account.balance - amt < minBalance) {
      return res.status(400).json({
        message: `Insufficient balance. A minimum balance of ₹${minBalance} must be maintained.`,
      });
    }

    account.balance -= amt;
    await account.save();

    const txn = await Transaction.create({
      account: account._id,
      accountNumber: account.accountNumber,
      type: "WITHDRAW",
      amount: amt,
      balanceAfter: account.balance,
    });

    res.json({ message: "Withdrawal successful.", balance: account.balance, transaction: txn });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Withdrawal failed. Please try again." });
  }
};

// POST /api/transactions/transfer
exports.transfer = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { toAccountNumber, amount, pin } = req.body;
    const amt = Number(amount);

    if (!toAccountNumber || !amt || amt <= 0) {
      return res.status(400).json({ message: "Recipient account and a valid amount are required." });
    }
    if (!pin) {
      return res.status(400).json({ message: "PIN is required to transfer money." });
    }
    if (toAccountNumber === req.user.accountNumber) {
      return res.status(400).json({ message: "You cannot transfer money to your own account." });
    }

    session.startTransaction();

    const fromAcc = await Account.findById(req.user._id).session(session);
    const pinMatch = await fromAcc.comparePin(String(pin));
    if (!pinMatch) {
      await session.abortTransaction();
      return res.status(401).json({ message: "Incorrect PIN." });
    }

    const toAcc = await Account.findOne({ accountNumber: toAccountNumber }).session(session);
    if (!toAcc || toAcc.status === "closed") {
      await session.abortTransaction();
      return res.status(404).json({ message: "Recipient account not found." });
    }

    const minBalance = MIN_BALANCE[fromAcc.accountType] ?? 0;
    if (fromAcc.balance - amt < minBalance) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance for this transfer." });
    }

    fromAcc.balance -= amt;
    toAcc.balance += amt;
    await fromAcc.save({ session });
    await toAcc.save({ session });

    await Transaction.create(
      [
        {
          account: fromAcc._id,
          accountNumber: fromAcc.accountNumber,
          type: "TRANSFER_OUT",
          amount: amt,
          balanceAfter: fromAcc.balance,
          counterpartyAccount: toAcc.accountNumber,
        },
        {
          account: toAcc._id,
          accountNumber: toAcc.accountNumber,
          type: "TRANSFER_IN",
          amount: amt,
          balanceAfter: toAcc.balance,
          counterpartyAccount: fromAcc.accountNumber,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    res.json({ message: "Transfer successful.", balance: fromAcc.balance });
  } catch (err) {
    console.error(err);
    if (session.inTransaction()) await session.abortTransaction();
    res.status(500).json({ message: "Transfer failed. Please try again." });
  } finally {
    session.endSession();
  }
};

// GET /api/transactions/history?limit=5
exports.history = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const txns = await Transaction.find({ account: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json({ transactions: txns });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load transaction history." });
  }
};

// POST /api/transactions/change-pin
exports.changePin = async (req, res) => {
  try {
    const { oldPin, newPin } = req.body;
    if (!/^\d{4}$/.test(String(newPin || ""))) {
      return res.status(400).json({ message: "New PIN must be exactly 4 digits." });
    }
    const account = await Account.findById(req.user._id);
    const match = await account.comparePin(String(oldPin));
    if (!match) {
      return res.status(401).json({ message: "Current PIN is incorrect." });
    }
    account.pinHash = await bcrypt.hash(String(newPin), 10);
    await account.save();
    res.json({ message: "PIN updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update PIN." });
  }
};

// POST /api/transactions/close-account
exports.closeAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const account = await Account.findById(req.user._id);
    const match = await account.comparePassword(password || "");
    if (!match) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    await Transaction.create({
      account: account._id,
      accountNumber: account.accountNumber,
      type: "ACCOUNT_CLOSED",
      amount: account.balance,
      balanceAfter: 0,
      note: "Final balance paid out on closure",
    });

    account.status = "closed";
    account.balance = 0;
    await account.save();

    res.json({ message: "Account closed successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not close account." });
  }
};
