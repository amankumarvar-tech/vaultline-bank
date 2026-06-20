import { useEffect, useState } from "react";
import api from "../api/client";

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

export default function Passbook() {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/transactions/history?limit=200")
      .then((res) => setTxns(res.data.transactions))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="view active">
      <div className="view-head">
        <h2>Passbook</h2>
        <p className="muted">Your complete transaction history.</p>
      </div>
      <div className="passbook">
        <div className="passbook-row passbook-head">
          <span>Date &amp; Time</span><span>Description</span><span>Amount</span><span>Balance</span>
        </div>
        <div className="passbook-body">
          {loading && <p className="empty-note">Loading...</p>}
          {!loading && txns.length === 0 && <p className="empty-note">No transactions yet.</p>}
          {!loading && txns.map((t) => (
            <div className="passbook-row" key={t._id}>
              <span>{fmtDate(t.createdAt)}</span>
              <span>{labelFor(t.type, t.counterpartyAccount)}</span>
              <span className={isCredit(t.type) ? "pos" : "neg"}>{isCredit(t.type) ? "+" : "−"}{fmtMoney(t.amount)}</span>
              <span>{fmtMoney(t.balanceAfter)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
