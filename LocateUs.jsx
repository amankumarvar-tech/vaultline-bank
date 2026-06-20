import { useState } from "react";
import PublicLayout from "../components/PublicLayout";

const BRANCHES = [
  { city: "Delhi", area: "Kashmiri Gate", address: "12, Kashmiri Gate Metro Complex, Delhi - 110006", ifsc: "VAUL0000101", type: "Branch + ATM" },
  { city: "Delhi", area: "Connaught Place", address: "F-Block, Connaught Place, New Delhi - 110001", ifsc: "VAUL0000102", type: "Branch + ATM" },
  { city: "Mumbai", area: "Andheri East", address: "3rd Floor, Tower B, Andheri East, Mumbai - 400069", ifsc: "VAUL0000201", type: "Branch + ATM" },
  { city: "Bengaluru", area: "Koramangala", address: "80 Feet Road, Koramangala 5th Block, Bengaluru - 560095", ifsc: "VAUL0000301", type: "ATM Only" },
  { city: "Pune", area: "Hinjewadi", address: "Phase 1, Hinjewadi IT Park, Pune - 411057", ifsc: "VAUL0000401", type: "Branch + ATM" },
  { city: "Lucknow", area: "Hazratganj", address: "MG Road, Hazratganj, Lucknow - 226001", ifsc: "VAUL0000501", type: "Branch + ATM" },
];

export default function LocateUs() {
  const [query, setQuery] = useState("");

  const filtered = BRANCHES.filter((b) =>
    (b.city + b.area + b.address).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <PublicLayout>
      <section className="inner-hero">
        <h1>Locate Us</h1>
        <p>Find a Vaultline branch or ATM near you.</p>
      </section>

      <section className="content-section">
        <input
          type="text"
          className="locate-search"
          placeholder="Search by city or area (e.g. Delhi, Koramangala...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="branch-list">
          {filtered.length === 0 && <p className="muted-line">No branches found matching "{query}".</p>}
          {filtered.map((b) => (
            <div key={b.ifsc} className="branch-card">
              <div className="branch-card-head">
                <h3>{b.city} — {b.area}</h3>
                <span className={`branch-tag ${b.type.includes("ATM Only") ? "atm" : ""}`}>{b.type}</span>
              </div>
              <p className="muted-line">{b.address}</p>
              <p className="branch-ifsc">IFSC: {b.ifsc}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
