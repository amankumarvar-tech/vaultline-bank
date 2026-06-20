const jwt = require("jsonwebtoken");
const Account = require("../models/Account");

// Verifies JWT and attaches the logged-in account to req.user
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Login required. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const account = await Account.findById(decoded.id);

    if (!account || account.status === "closed") {
      return res.status(401).json({ message: "Account not found or closed." });
    }

    req.user = account;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired session. Please login again." });
  }
}

// Restricts a route to admin-role accounts only
function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access only." });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
