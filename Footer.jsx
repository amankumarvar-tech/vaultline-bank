import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-col">
          <div className="brand footer-brand">
            <span className="brand-mark">V</span>
            <span className="brand-name">Vaultline Bank</span>
          </div>
          <p className="footer-about">
            Vaultline Bank ek digital-first banking platform hai jo savings, current accounts,
            loans, cards aur fixed deposits ki suvidha ek hi jagah pe deta hai.
          </p>
        </div>

        <div className="footer-col">
          <h4>Banking</h4>
          <Link to="/personal-banking">Personal Banking</Link>
          <Link to="/loans">Loans</Link>
          <Link to="/cards">Cards</Link>
          <Link to="/fixed-deposits">Fixed Deposits</Link>
          <Link to="/investments">Investments</Link>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/locate-us">Locate Us</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div className="footer-col">
          <h4>Reach Us</h4>
          <p>Toll-Free: 1800-XXX-XXXX</p>
          <p>support@vaultlinebank.example</p>
          <p>Mon–Sat, 9:00 AM – 6:00 PM</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Vaultline Bank. Demo project — not a real financial institution.</p>
      </div>
    </footer>
  );
}
