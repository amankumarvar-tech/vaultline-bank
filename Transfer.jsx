import { useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Transfer() {
  const { refreshAccount } = useAuth();
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg({ text: "", type: "" });
    setLoading(true);
    try {
      const res = await api.post("/transactions/transfer", {
        toAccountNumber: toAccountNumber.trim().toUpperCase(),
        amount: Number(amount),
        pin,
      });
      refreshAccount({ balance: res.data.balance });
      setMsg({ text: `✅ ₹${Number(amount).toLocaleString("en-IN")} transferred. New balance: ₹${res.data.balance.toLocaleString("en-IN")}`, type: "ok" });
      setToAccountNumber("");
      setAmount("");
      setPin("");
    } catch (err) {
      setMsg({ text: err.response?.data?.message || "Transfer failed.", type: "err" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="view active">
      <div className="view-head">
        <h2>Transfer Money</h2>
        <p className="muted">Send money to any Vaultline account number.</p>
      </div>
      <form className="action-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Recipient Account Number</span>
          <input value={toAccountNumber} onChange={(e) => setToAccountNumber(e.target.value)} placeholder="VL123456789" required />
        </label>
        <label className="field">
          <span>Amount (₹)</span>
          <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </label>
        <label className="field">
          <span>Transaction PIN</span>
          <input type="password" maxLength="4" inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value)} required />
        </label>
        {msg.text && <p className={`form-msg ${msg.type}`}>{msg.text}</p>}
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Processing..." : "Transfer"}
        </button>
      </form>
    </div>
  );
}
