// Run this once to create the first admin account: npm run seed:admin
require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const Account = require("../models/Account");

(async () => {
  await connectDB();

  const email = (process.env.ADMIN_USERNAME || "admin") + "@vaultline.bank";
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";

  const existing = await Account.findOne({ email });
  if (existing) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const pinHash = await bcrypt.hash("0000", 10);

  await Account.create({
    accountNumber: Account.generateAccountNumber(),
    name: "Bank Administrator",
    email,
    mobile: "9999999999",
    accountType: "Current",
    pinHash,
    passwordHash,
    balance: 0,
    role: "admin",
  });

  console.log("✅ Admin created.");
  console.log("   Email:", email);
  console.log("   Password:", password);
  console.log("   (Change this password after first login.)");
  process.exit(0);
})();
