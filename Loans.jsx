import { useState, useMemo } from "react";
import PublicLayout from "../components/PublicLayout";

const LOAN_TYPES = [
  { name: "Personal Loan", rate: "10.49% p.a. onwards", max: "₹25,00,000", tenure: "Up to 5 years" },
  { name: "Home Loan", rate: "8.25% p.a. onwards", max: "₹2,00,00,000", tenure: "Up to 30 years" },
  { name: "Education Loan", rate: "9.10% p.a. onwards", max: "₹50,00,000", tenure: "Up to 15 years" },
  { name: "Vehicle Loan", rate: "9.75% p.a. onwards", max: "₹15,00,000", tenure: "Up to 7 years" },
];

function calcEMI(principal, annualRate, months) {
  const r = annualRate / 12 / 100;
  if (!principal || !r || !months) return 0;
  const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return emi;
}

export default function Loans() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(10.5);
  const [years, setYears] = useState(5);

  const emi = useMemo(() => calcEMI(Number(amount), Number(rate), Number(years) * 12), [amount, rate, years]);
  const totalPayment = emi * years * 12;
  const totalInterest = totalPayment - amount;

  return (
    <PublicLayout>
      <section className="inner-hero">
        <h1>Loans</h1>
        <p>Personal, home, education, and vehicle loans — calculate your EMI before you apply.</p>
      </section>

      <section className="content-section">
        <div className="cards-row">
          {LOAN_TYPES.map((l) => (
            <div key={l.name} className="info-card">
              <h3>{l.name}</h3>
              <div className="info-card-rate">{l.rate}</div>
              <ul>
                <li>Max amount: {l.max}</li>
                <li>Tenure: {l.tenure}</li>
              </ul>
            </div>
          ))}
        </div>

        <div className="calc-section">
          <h2 className="section-heading">EMI Calculator</h2>
          <div className="calc-grid">
            <div className="calc-inputs">
              <label className="field">
                <span>Loan Amount: ₹{Number(amount).toLocaleString("en-IN")}</span>
                <input type="range" min="50000" max="5000000" step="10000" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </label>
              <label className="field">
                <span>Interest Rate: {rate}% p.a.</span>
                <input type="range" min="6" max="18" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
              </label>
              <label className="field">
                <span>Tenure: {years} years</span>
                <input type="range" min="1" max="30" step="1" value={years} onChange={(e) => setYears(e.target.value)} />
              </label>
            </div>
            <div className="calc-result">
              <div className="stat-row"><span>Monthly EMI</span><strong>₹{emi.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</strong></div>
              <div className="stat-row"><span>Total Interest</span><strong>₹{totalInterest.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</strong></div>
              <div className="stat-row"><span>Total Payment</span><strong>₹{totalPayment.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</strong></div>
            </div>
          </div>
          <p className="muted-line">This is an indicative calculation. Actual rates depend on credit profile and tenure chosen at application.</p>
        </div>
      </section>
    </PublicLayout>
  );
}
