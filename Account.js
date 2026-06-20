const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const accountSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Mobile number must be exactly 10 digits"],
    },
    accountType: {
      type: String,
      enum: ["Savings", "Current"],
      default: "Savings",
    },
    pinHash: { type: String, required: true }, // 4-digit transaction PIN, hashed
    passwordHash: { type: String, required: true }, // login password, hashed
    balance: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["active", "closed", "frozen"],
      default: "active",
    },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    failedPinAttempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

accountSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

accountSchema.methods.comparePin = function (plain) {
  return bcrypt.compare(plain, this.pinHash);
};

accountSchema.statics.generateAccountNumber = function () {
  const rand = Math.floor(100000000 + Math.random() * 900000000); // 9 digits
  return "VL" + rand;
};

module.exports = mongoose.model("Account", accountSchema);
