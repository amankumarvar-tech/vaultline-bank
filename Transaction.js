const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    accountNumber: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "ACCOUNT_OPENED",
        "DEPOSIT",
        "WITHDRAW",
        "TRANSFER_OUT",
        "TRANSFER_IN",
        "ACCOUNT_CLOSED",
      ],
      required: true,
    },
    amount: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    counterpartyAccount: { type: String, default: null }, // for transfers
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

transactionSchema.index({ accountNumber: 1, createdAt: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);
