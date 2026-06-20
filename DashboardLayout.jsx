import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/dashboard", label: "Overview", end: true },
  { to: "/dashboard/deposit", label: "Deposit" },
  { to: "/dashboard/withdraw", label: "Withdraw" },
  { to: "/dashboard/transfer", label: "Transfer" },
  { to: "/dashboard/passbook", label: "Passbook" },
  { to: "/dashboard/settings", label: "PIN & Settings" },
];

export default function DashboardLayout() {
  const { account, logout } = useAuth();

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div className="user-card">
          <div className="avatar">{account?.name?.charAt(0).toUpperCase() || "U"}</div>
          <div>
            <p className="user-name">{account?.name}</p>
            <p className="user-acc">{account?.accountNumber}</p>
          </div>
        </div>
        <nav className="side-nav">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button className="btn-ghost-link logout" onClick={logout}>Logout</button>
      </aside>
      <main className="dash-main">
        <Outlet />
      </main>
    </div>
  );
}
