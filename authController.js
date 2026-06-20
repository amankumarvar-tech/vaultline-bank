const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

function signToken(account) {
  return jwt.sign(
    { id: account._id, accountNumber: account.accountNumber, role: account.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

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

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, mobile, accountType, pin, password, initialDeposit } = req.body;

    if (!name || !email || !mobile || !pin || !password) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ message: "Mobile number must be exactly 10 digits." });
    }
    if (!/^\d{4}$/.test(String(pin))) {
      return res.status(400).json({ message: "PIN must be exactly 4 digits." });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }
    const deposit = Number(initialDeposit || 0);
    if (deposit < 500) {
      return res.status(400).json({ message: "Initial deposit must be at least ₹500." });
    }

    const existing = await Account.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const accountNumber = Account.generateAccountNumber();
    const pinHash = await bcrypt.hash(String(pin), 10);
    const passwordHash = await bcrypt.hash(String(password), 10);

    const account = await Account.create({
      accountNumber,
      name,
      email: email.toLowerCase(),
      mobile,
      accountType: accountType === "Current" ? "Current" : "Savings",
      pinHash,
      passwordHash,
      balance: deposit,
    });

    await Transaction.create({
      account: account._id,
      accountNumber: account.accountNumber,
      type: "ACCOUNT_OPENED",
      amount: deposit,
      balanceAfter: deposit,
      note: "Initial deposit on account opening",
    });

    const token = signToken(account);
    res.status(201).json({ token, account: publicAccount(account) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong while creating the account." });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const account = await Account.findOne({ email: String(email).toLowerCase() });
    if (!account) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    if (account.status === "closed") {
      return res.status(403).json({ message: "This account has been closed." });
    }

    const match = await account.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(account);
    res.json({ token, account: publicAccount(account) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong while logging in." });
  }
};

// GET /api/auth/me
exports.me = async (req, res) => {
  res.json({ account: publicAccount(req.user) });
};
