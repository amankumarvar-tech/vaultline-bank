import PublicLayout from "../components/PublicLayout";

const CARDS = [
  { name: "Vaultline Classic Debit Card", type: "Debit", fee: "Free", perks: ["No annual fee", "ATM withdrawals nationwide", "Contactless tap & pay"] },
  { name: "Vaultline Platinum Debit Card", type: "Debit", fee: "₹199/year", perks: ["Higher daily withdrawal limit", "Airport lounge access", "Cashback on bill payments"] },
  { name: "Vaultline Rewards Credit Card", type: "Credit", fee: "₹499/year", perks: ["5x reward points on online spends", "Interest-free period up to 50 days", "Fuel surcharge waiver"] },
  { name: "Vaultline Student Card", type: "Debit", fee: "Free", perks: ["No minimum balance required", "Designed for first-time users", "Spending alerts via SMS"] },
];

export default function Cards() {
  return (
    <PublicLayout>
      <section className="inner-hero">
        <h1>Cards</h1>
        <p>Debit and credit cards designed around how you actually spend.</p>
      </section>

      <section className="content-section">
        <div className="cards-row">
          {CARDS.map((c) => (
            <div key={c.name} className="info-card card-tile">
              <div className={`card-visual ${c.type === "Credit" ? "credit" : "debit"}`}>
                <span className="card-chip" />
                <span className="card-type">{c.type} Card</span>
                <span className="card-number">•••• •••• •••• 4831</span>
                <span className="card-brand">VAULTLINE</span>
              </div>
              <h3>{c.name}</h3>
              <p className="muted-line">Annual fee: {c.fee}</p>
              <ul>{c.perks.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
