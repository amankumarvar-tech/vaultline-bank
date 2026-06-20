import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/personal-banking", label: "Personal Banking" },
  { to: "/loans", label: "Loans" },
  { to: "/cards", label: "Cards" },
  { to: "/fixed-deposits", label: "Fixed Deposits" },
  { to: "/investments", label: "Investments" },
  { to: "/locate-us", label: "Locate Us" },
  { to: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const { account, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="site-header">
      <div className="topstrip">
        <span>24x7 Helpline: 1800-XXX-XXXX</span>
        <span className="topstrip-sep">|</span>
        <span>Net Banking · Mobile Banking · Locate Branch/ATM</span>
      </div>

      <div className="navbar">
        <Link to="/" className="brand">
          <span className="brand-mark">V</span>
          <span className="brand-name">Vaultline Bank</span>
        </Link>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          {account ? (
            <>
              <Link to={account.role === "admin" ? "/admin" : "/dashboard"} className="btn-small btn-outline">
                {account.role === "admin" ? "Admin Panel" : "My Account"}
              </Link>
              <button className="btn-small btn-solid" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-small btn-outline">Login</Link>
              <Link to="/signup" className="btn-small btn-solid">Open Account</Link>
            </>
          )}
          <button className="hamburger" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
