import { useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Withdraw() {
  const { refreshAccount } = useAuth();
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg({ text: "", type: "" });
    setLoading(true);
    try {
      const res = await api.post("/transactions/withdraw", { amount: Number(amount), pin });
      refreshAccount({ balance: res.data.balance });
      setMsg({ text: `✅ ₹${Number(amount).toLocaleString("en-IN")} withdrawn. New balance: ₹${res.data.balance.toLocaleString("en-IN")}`, type: "ok" });
      setAmount("");
      setPin("");
    } catch (err) {
      setMsg({ text: err.response?.data?.message || "Withdrawal failed.", type: "err" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="view active">
      <div className="view-head">
        <h2>Withdraw Money</h2>
        <p className="muted">Minimum balance must be maintained as per your account type.</p>
      </div>
      <form className="action-form" onSubmit={handleSubmit}>
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
          {loading ? "Processing..." : "Withdraw"}
        </button>
      </form>
    </div>
  );
}
