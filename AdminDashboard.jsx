import { useEffect, useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

function fmtMoney(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

const PIE_COLORS = ["#2fb87f", "#d4af6a"];

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/admin/stats"), api.get("/admin/accounts")])
      .then(([s, a]) => {
        setStats(s.data);
        setAccounts(a.data.accounts);
      })
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(accountNumber, status) {
    if (!window.confirm(`Set ${accountNumber} status to "${status}"?`)) return;
    try {
      await api.patch(`/admin/accounts/${accountNumber}/status`, { status });
      setAccounts((prev) => prev.map((a) => (a.accountNumber === accountNumber ? { ...a, status } : a)));
    } catch (err) {
      alert(err.response?.data?.message || "Could not update status.");
    }
  }

  if (loading) return <div className="page-loading">Loading admin data...</div>;

  const pieData = (stats?.byType || []).map((t) => ({ name: t._id, value: t.count }));

  return (
    <div className="admin-shell">
      <div className="admin-head">
        <div>
          <h2>Admin Panel</h2>
          <p className="muted">Bank-wide overview and account management.</p>
        </div>
        <button className="btn-small btn-outline" onClick={logout}>Logout</button>
      </div>

      <div className="admin-tabs">
        <button className={`auth-tab ${tab === "overview" ? "active" : ""}`} onClick={() => setTab("overview")}>Overview</button>
        <button className={`auth-tab ${tab === "accounts" ? "active" : ""}`} onClick={() => setTab("accounts")}>Accounts</button>
      </div>

      {tab === "overview" && (
        <>
          <div className="admin-stats">
            <div className="stat-card"><span className="stat-label">Total Accounts</span><span className="stat-value">{stats.totalAccounts}</span></div>
            <div className="stat-card"><span className="stat-label">Total Bank Balance</span><span className="stat-value">{fmtMoney(stats.totalBalance)}</span></div>
            <div className="stat-card"><span className="stat-label">Total Transactions</span><span className="stat-value">{stats.totalTransactions}</span></div>
          </div>

          <div className="chart-grid">
            <div className="chart-card">
              <h3 className="section-title small">Transaction Activity (Last 14 Days)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={stats.dailyActivity}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="_id" stroke="#d8d4c4" fontSize={11} tickFormatter={(d) => d.slice(5)} />
                  <YAxis stroke="#d8d4c4" fontSize={11} />
                  <Tooltip contentStyle={{ background: "#0f201a", border: "1px solid rgba(255,255,255,0.1)", color: "#f3efe4" }} />
                  <Line type="monotone" dataKey="count" stroke="#4fd49a" strokeWidth={2} name="Transactions" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3 className="section-title small">Account Type Split</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {pieData.map((entry, i) => <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#0f201a", border: "1px solid rgba(255,255,255,0.1)", color: "#f3efe4" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card wide">
              <h3 className="section-title small">Daily Transaction Volume (₹)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats.dailyActivity}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="_id" stroke="#d8d4c4" fontSize={11} tickFormatter={(d) => d.slice(5)} />
                  <YAxis stroke="#d8d4c4" fontSize={11} />
                  <Tooltip contentStyle={{ background: "#0f201a", border: "1px solid rgba(255,255,255,0.1)", color: "#f3efe4" }} formatter={(v) => fmtMoney(v)} />
                  <Bar dataKey="volume" fill="#d4af6a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {tab === "accounts" && (
        <div className="admin-table">
          <div className="admin-row admin-head-row">
            <span>Acc No</span><span>Name</span><span>Type</span><span>Balance</span><span>Status</span><span>Action</span>
          </div>
          {accounts.map((a) => (
            <div className="admin-row six-col" key={a._id}>
              <span>{a.accountNumber}</span>
              <span>{a.name}</span>
              <span>{a.accountType}</span>
              <span>{fmtMoney(a.balance)}</span>
              <span className={`status-pill ${a.status}`}>{a.status}</span>
              <span className="admin-row-actions">
                {a.status !== "frozen" && a.role !== "admin" && (
                  <button onClick={() => updateStatus(a.accountNumber, "frozen")}>Freeze</button>
                )}
                {a.status !== "active" && (
                  <button onClick={() => updateStatus(a.accountNumber, "active")}>Activate</button>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
