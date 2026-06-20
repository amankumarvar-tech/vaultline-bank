import { useState, useMemo } from "react";
import PublicLayout from "../components/PublicLayout";

const FD_RATES = [
  { tenure: "7 - 45 days", rate: "3.00%" },
  { tenure: "46 - 179 days", rate: "4.50%" },
  { tenure: "180 days - 1 year", rate: "5.75%" },
  { tenure: "1 - 2 years", rate: "7.10%" },
  { tenure: "2 - 5 years", rate: "7.25%" },
  { tenure: "5 - 10 years", rate: "6.80%" },
];

export default function FixedDeposits() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7.1);
  const [years, setYears] = useState(2);

  const maturity = useMemo(() => {
    const r = rate / 100;
    return principal * Math.pow(1 + r / 4, 4 * years); // quarterly compounding
  }, [principal, rate, years]);

  const interestEarned = maturity - principal;

  return (
    <PublicLayout>
      <section className="inner-hero">
        <h1>Fixed Deposits</h1>
        <p>Lock in your savings at a fixed rate and watch them grow predictably.</p>
      </section>

      <section className="content-section">
        <h2 className="section-heading">Current FD Rates</h2>
        <div className="rate-table">
          <div className="rate-row rate-head"><span>Tenure</span><span>Interest Rate (p.a.)</span></div>
          {FD_RATES.map((r) => (
            <div className="rate-row" key={r.tenure}><span>{r.tenure}</span><span>{r.rate}</span></div>
          ))}
        </div>

        <div className="calc-section">
          <h2 className="section-heading">FD Maturity Calculator</h2>
          <div className="calc-grid">
            <div className="calc-inputs">
              <label className="field">
                <span>Deposit Amount: ₹{Number(principal).toLocaleString("en-IN")}</span>
                <input type="range" min="5000" max="2000000" step="5000" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
              </label>
              <label className="field">
                <span>Interest Rate: {rate}% p.a.</span>
                <input type="range" min="3" max="8" step="0.05" value={rate} onChange={(e) => setRate(e.target.value)} />
              </label>
              <label className="field">
                <span>Tenure: {years} years</span>
                <input type="range" min="1" max="10" step="1" value={years} onChange={(e) => setYears(e.target.value)} />
              </label>
            </div>
            <div className="calc-result">
              <div className="stat-row"><span>Maturity Amount</span><strong>₹{maturity.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</strong></div>
              <div className="stat-row"><span>Interest Earned</span><strong>₹{interestEarned.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</strong></div>
            </div>
          </div>
          <p className="muted-line">Calculated with quarterly compounding. Actual returns depend on the rate locked in at booking.</p>
        </div>
      </section>
    </PublicLayout>
  );
}
