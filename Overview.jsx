import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

function fmtMoney(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}
function fmtDate(d) {
  return new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function labelFor(type, counterparty) {
  const map = {
    ACCOUNT_OPENED: "Account Opened",
    DEPOSIT: "Deposit",
    WITHDRAW: "Withdrawal",
    ACCOUNT_CLOSED: "Account Closed",
  };
  if (map[type]) return map[type];
  if (type === "TRANSFER_OUT") return "Transfer to " + counterparty;
  if (type === "TRANSFER_IN") return "Received from " + counterparty;
  return type;
}
function isCredit(type) {
  return ["DEPOSIT", "ACCOUNT_OPENED", "TRANSFER_IN"].includes(type);
}

export default function Overview() {
  const { account, refreshAccount } = useAuth();
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/me").then((res) => refreshAccount(res.data.account)).catch(() => {});
    api.get("/transactions/history?limit=5")
      .then((res) => setRecent(res.data.transactions))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="view active">
      <div className="view-head">
        <h2>Namaste, {account?.name?.split(" ")[0]} 👋</h2>
        <p className="muted">Here's a quick summary of your account.</p>
      </div>

      <div className="balance-card">
        <span className="balance-label">Available Balance</span>
        <span className="balance-amount">{fmtMoney(account?.balance)}</span>
        <span className="balance-type">{account?.accountType} Account · {account?.accountNumber}</span>
      </div>

      <div className="quick-actions">
        <Link to="/dashboard/deposit" className="quick-btn"><span>＋</span>Deposit</Link>
        <Link to="/dashboard/withdraw" className="quick-btn"><span>－</span>Withdraw</Link>
        <Link to="/dashboard/transfer" className="quick-btn"><span>⇄</span>Transfer</Link>
      </div>

      <h3 className="section-title">Recent Activity</h3>
      <div className="mini-list">
        {loading && <p className="empty-note">Loading...</p>}
        {!loading && recent.length === 0 && <p className="empty-note">No transactions yet.</p>}
        {!loading && recent.map((t) => (
          <div className="mini-row" key={t._id}>
            <div>
              <div className="mr-type">{labelFor(t.type, t.counterpartyAccount)}</div>
              <div className="mr-date">{fmtDate(t.createdAt)}</div>
            </div>
            <div className={`mr-amt ${isCredit(t.type) ? "pos" : "neg"}`}>
              {isCredit(t.type) ? "+" : "−"}{fmtMoney(t.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
