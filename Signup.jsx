import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", mobile: "", accountType: "Savings",
    pin: "", password: "", initialDeposit: "500",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!/^\d{4}$/.test(form.pin)) return setError("PIN must be exactly 4 digits.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (Number(form.initialDeposit) < 500) return setError("Initial deposit must be at least ₹500.");

    setLoading(true);
    try {
      const account = await signup(form);
      navigate(account.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout>
      <section className="auth-page">
        <form className="auth-box wide" onSubmit={handleSubmit}>
          <h2>Open a New Account</h2>
          <p className="muted-line">It takes less than two minutes — and your account number is generated instantly.</p>

          <label className="field">
            <span>Full Name</span>
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <div className="field-row">
            <label className="field">
              <span>Email</span>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <label className="field">
              <span>Mobile Number</span>
              <input name="mobile" value={form.mobile} onChange={handleChange} maxLength="10" inputMode="numeric" required />
            </label>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Account Type</span>
              <select name="accountType" value={form.accountType} onChange={handleChange}>
                <option value="Savings">Savings</option>
                <option value="Current">Current</option>
              </select>
            </label>
            <label className="field">
              <span>4-digit Transaction PIN</span>
              <input type="password" name="pin" value={form.pin} onChange={handleChange} maxLength="4" inputMode="numeric" required />
            </label>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Login Password</span>
              <input type="password" name="password" value={form.password} onChange={handleChange} required />
            </label>
            <label className="field">
              <span>Initial Deposit (min ₹500)</span>
              <input type="number" name="initialDeposit" value={form.initialDeposit} onChange={handleChange} min="500" required />
            </label>
          </div>

          {error && <p className="form-msg err">{error}</p>}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Open Account"}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </PublicLayout>
  );
}
