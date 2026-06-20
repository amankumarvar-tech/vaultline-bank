import { Link } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";

const ACCOUNTS = [
  {
    name: "Vaultline Basic Savings",
    rate: "3.50% p.a.",
    minBalance: "₹500",
    points: ["Zero account opening fee", "Free digital passbook", "Instant fund transfers"],
  },
  {
    name: "Vaultline Current Account",
    rate: "No interest (transactional)",
    minBalance: "₹0",
    points: ["Built for business transactions", "Unlimited deposits & withdrawals", "Dedicated support"],
  },
  {
    name: "Vaultline Premium Savings",
    rate: "4.25% p.a.",
    minBalance: "₹10,000",
    points: ["Higher interest rate", "Priority customer support", "Free debit card upgrade"],
  },
];

export default function PersonalBanking() {
  return (
    <PublicLayout>
      <section className="inner-hero">
        <h1>Personal Banking</h1>
        <p>Choose an account type that fits how you actually use your money.</p>
      </section>

      <section className="content-section">
        <div className="cards-row">
          {ACCOUNTS.map((a) => (
            <div key={a.name} className="info-card">
              <h3>{a.name}</h3>
              <div className="info-card-rate">{a.rate}</div>
              <p className="muted-line">Minimum balance: {a.minBalance}</p>
              <ul>
                {a.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <Link to="/signup" className="btn-outline">Open this Account</Link>
            </div>
          ))}
        </div>

        <div className="content-narrow" style={{ marginTop: "48px" }}>
          <h2>How to Open an Account</h2>
          <ol className="content-list numbered">
            <li>Click "Open Account" and fill in your name, email, and mobile number.</li>
            <li>Choose Savings or Current account type.</li>
            <li>Set a 4-digit transaction PIN and a login password.</li>
            <li>Deposit a minimum opening amount of ₹500.</li>
            <li>Your account number is generated instantly — start banking right away.</li>
          </ol>
        </div>
      </section>
    </PublicLayout>
  );
}
