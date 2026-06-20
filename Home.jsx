import { Link } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";

const QUICK_LINKS = [
  { icon: "🏦", label: "Open an Account", to: "/signup" },
  { icon: "💳", label: "Apply for a Card", to: "/cards" },
  { icon: "📄", label: "Apply for a Loan", to: "/loans" },
  { icon: "📈", label: "Start a Fixed Deposit", to: "/fixed-deposits" },
  { icon: "📍", label: "Locate a Branch", to: "/locate-us" },
  { icon: "🔐", label: "Login to Net Banking", to: "/login" },
];

const PRODUCTS = [
  { title: "Savings Account", desc: "Zero-hassle savings account with instant digital onboarding and a real-time passbook.", to: "/personal-banking" },
  { title: "Personal & Home Loans", desc: "Competitive interest rates with an EMI calculator and fast approval timelines.", to: "/loans" },
  { title: "Debit & Credit Cards", desc: "Contactless cards with reward points and zero-fee options for students.", to: "/cards" },
  { title: "Fixed Deposits", desc: "Lock in attractive interest rates from 7 days up to 10 years.", to: "/fixed-deposits" },
];

export default function Home() {
  return (
    <PublicLayout>
      <section className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">Trusted Digital Banking</p>
          <h1>Banking that moves<br /><span className="accent">at your pace.</span></h1>
          <p className="hero-sub">
            Khata kholiye, paisa jama/nikalo, transfer karein aur apni poori passbook dekhein —
            sab kuch ek hi platform par, bilkul real bank ki tarah.
          </p>
          <div className="hero-ctas">
            <Link to="/signup" className="btn-primary">Open a Free Account</Link>
            <Link to="/login" className="btn-outline-light">Login to Net Banking</Link>
          </div>
        </div>
        <div className="hero-stat-card">
          <div className="stat-row"><span>Interest Rate (Savings)</span><strong>3.50% p.a.</strong></div>
          <div className="stat-row"><span>FD Interest (1 Yr)</span><strong>7.10% p.a.</strong></div>
          <div className="stat-row"><span>Personal Loan from</span><strong>10.49% p.a.</strong></div>
          <div className="stat-row"><span>Account Opening</span><strong>100% Digital</strong></div>
        </div>
      </section>

      <section className="quicklinks-section">
        <div className="quicklinks-grid">
          {QUICK_LINKS.map((q) => (
            <Link key={q.label} to={q.to} className="quicklink-card">
              <span className="ql-icon">{q.icon}</span>
              <span>{q.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="products-section">
        <h2 className="section-heading">Our Products</h2>
        <div className="products-grid">
          {PRODUCTS.map((p) => (
            <Link key={p.title} to={p.to} className="product-card">
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <span className="product-link">Learn more →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="trust-section">
        <h2 className="section-heading">Why Vaultline</h2>
        <div className="trust-grid">
          <div className="trust-item"><h4>Bank-grade Security</h4><p>Passwords and PINs are encrypted; every session is protected with JWT-based authentication.</p></div>
          <div className="trust-item"><h4>Instant Transfers</h4><p>Send money to any Vaultline account number instantly, any time of day.</p></div>
          <div className="trust-item"><h4>Real Passbook</h4><p>Every transaction is logged and visible in your digital passbook, just like a physical one.</p></div>
          <div className="trust-item"><h4>24x7 Access</h4><p>Manage your account from any device, anywhere, without visiting a branch.</p></div>
        </div>
      </section>
    </PublicLayout>
  );
}
