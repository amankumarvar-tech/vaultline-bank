import { useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Deposit() {
  const { refreshAccount } = useAuth();
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg({ text: "", type: "" });
    setLoading(true);
    try {
      const res = await api.post("/transactions/deposit", { amount: Number(amount) });
      refreshAccount({ balance: res.data.balance });
      setMsg({ text: `✅ ₹${Number(amount).toLocaleString("en-IN")} deposited. New balance: ₹${res.data.balance.toLocaleString("en-IN")}`, type: "ok" });
      setAmount("");
    } catch (err) {
      setMsg({ text: err.response?.data?.message || "Deposit failed.", type: "err" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="view active">
      <div className="view-head">
        <h2>Deposit Money</h2>
        <p className="muted">Add funds to your account instantly.</p>
      </div>
      <form className="action-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Amount (₹)</span>
          <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </label>
        {msg.text && <p className={`form-msg ${msg.type}`}>{msg.text}</p>}
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Processing..." : "Deposit"}
        </button>
      </form>
    </div>
  );
}
