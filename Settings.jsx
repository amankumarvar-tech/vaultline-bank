import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [pinMsg, setPinMsg] = useState({ text: "", type: "" });
  const [pinLoading, setPinLoading] = useState(false);

  const [closePassword, setClosePassword] = useState("");
  const [closeMsg, setCloseMsg] = useState({ text: "", type: "" });
  const [closeLoading, setCloseLoading] = useState(false);

  async function handlePinSubmit(e) {
    e.preventDefault();
    setPinMsg({ text: "", type: "" });
    setPinLoading(true);
    try {
      await api.post("/transactions/change-pin", { oldPin, newPin });
      setPinMsg({ text: "✅ PIN updated successfully.", type: "ok" });
      setOldPin("");
      setNewPin("");
    } catch (err) {
      setPinMsg({ text: err.response?.data?.message || "Could not update PIN.", type: "err" });
    } finally {
      setPinLoading(false);
    }
  }

  async function handleClose(e) {
    e.preventDefault();
    setCloseMsg({ text: "", type: "" });
    if (!window.confirm("This will permanently close your account. Continue?")) return;
    setCloseLoading(true);
    try {
      await api.post("/transactions/close-account", { password: closePassword });
      logout();
      navigate("/");
    } catch (err) {
      setCloseMsg({ text: err.response?.data?.message || "Could not close account.", type: "err" });
    } finally {
      setCloseLoading(false);
    }
  }

  return (
    <div className="view active">
      <div className="view-head">
        <h2>PIN &amp; Settings</h2>
        <p className="muted">Manage your transaction PIN or close your account.</p>
      </div>

      <form className="action-form" onSubmit={handlePinSubmit}>
        <h3 className="section-title small">Change PIN</h3>
        <label className="field"><span>Current PIN</span><input type="password" maxLength="4" inputMode="numeric" value={oldPin} onChange={(e) => setOldPin(e.target.value)} required /></label>
        <label className="field"><span>New PIN</span><input type="password" maxLength="4" inputMode="numeric" value={newPin} onChange={(e) => setNewPin(e.target.value)} required /></label>
        {pinMsg.text && <p className={`form-msg ${pinMsg.type}`}>{pinMsg.text}</p>}
        <button className="btn-primary" type="submit" disabled={pinLoading}>{pinLoading ? "Updating..." : "Update PIN"}</button>
      </form>

      <div className="danger-zone">
        <h3 className="section-title small">Close Account</h3>
        <p className="muted">This action is permanent. Your balance will be paid out and the account closed.</p>
        <form className="action-form" onSubmit={handleClose}>
          <label className="field"><span>Confirm Password</span><input type="password" value={closePassword} onChange={(e) => setClosePassword(e.target.value)} required /></label>
          {closeMsg.text && <p className={`form-msg ${closeMsg.type}`}>{closeMsg.text}</p>}
          <button className="btn-danger" type="submit" disabled={closeLoading}>{closeLoading ? "Closing..." : "Close Account"}</button>
        </form>
      </div>
    </div>
  );
}
