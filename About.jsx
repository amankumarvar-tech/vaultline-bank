import PublicLayout from "../components/PublicLayout";

export default function About() {
  return (
    <PublicLayout>
      <section className="inner-hero">
        <h1>About Vaultline Bank</h1>
        <p>Digital-first banking, built for people who don't have time to visit a branch.</p>
      </section>

      <section className="content-section">
        <div className="content-narrow">
          <h2>Our Story</h2>
          <p>
            Vaultline Bank was created as a demo digital banking platform — built to show how a
            modern bank can deliver every core service (accounts, deposits, withdrawals, transfers,
            loans, and fixed deposits) through a clean, secure, web-based experience.
          </p>

          <h2>Our Mission</h2>
          <p>
            To make everyday banking simple, transparent, and accessible — without long queues,
            paperwork, or confusing menus. Every feature here is modeled after how real banks like
            SBI and PNB structure their services, reimagined as a lightweight digital experience.
          </p>

          <h2>What We Offer</h2>
          <ul className="content-list">
            <li>Savings &amp; Current Accounts with instant digital onboarding</li>
            <li>Secure fund transfers between Vaultline accounts</li>
            <li>Personal, Home, and Education Loans with EMI calculators</li>
            <li>Fixed Deposits with flexible tenures</li>
            <li>Debit &amp; Credit Cards with reward benefits</li>
            <li>A full digital passbook for every transaction</li>
          </ul>

          <h2>Security First</h2>
          <p>
            Every password and transaction PIN is encrypted before storage. Sessions are secured
            using industry-standard JWT authentication, and sensitive actions like withdrawals and
            transfers require PIN re-verification — the same way real banking apps protect your money.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
