import PublicLayout from "../components/PublicLayout";

const PRODUCTS = [
  { name: "Mutual Funds", desc: "Curated equity, debt, and hybrid fund options for every risk appetite, with SIPs starting at ₹500/month." },
  { name: "Recurring Deposit", desc: "Save a fixed amount every month and earn FD-like interest rates, ideal for building a habit of saving." },
  { name: "Public Provident Fund (PPF)", desc: "A government-backed long-term savings scheme with tax benefits under Section 80C." },
  { name: "Sovereign Gold Bonds", desc: "Invest in gold without holding physical gold, with periodic interest payouts." },
];

export default function Investments() {
  return (
    <PublicLayout>
      <section className="inner-hero">
        <h1>Investments</h1>
        <p>Grow your money beyond your savings account with options for every goal.</p>
      </section>

      <section className="content-section">
        <div className="cards-row">
          {PRODUCTS.map((p) => (
            <div key={p.name} className="info-card">
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="content-narrow" style={{ marginTop: "40px" }}>
          <h2>A Quick Note</h2>
          <p>
            Investment products listed here are illustrative, shown for demonstration purposes only.
            In a production banking application, these would connect to KYC, regulatory disclosures,
            and licensed investment partners before any real transaction is processed.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
