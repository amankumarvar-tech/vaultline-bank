import { useState } from "react";
import PublicLayout from "../components/PublicLayout";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Demo-only: no backend endpoint wired for contact form submissions yet.
    setSubmitted(true);
  }

  return (
    <PublicLayout>
      <section className="inner-hero">
        <h1>Contact Us</h1>
        <p>Have a question or an issue with your account? Reach out — we're listening.</p>
      </section>

      <section className="content-section">
        <div className="contact-grid">
          <div className="contact-info">
            <h3>Customer Care</h3>
            <p>📞 1800-XXX-XXXX (Toll-Free)</p>
            <p>✉️ support@vaultlinebank.example</p>
            <p>🕒 Mon – Sat, 9:00 AM – 6:00 PM</p>

            <h3 style={{ marginTop: "28px" }}>Registered Office</h3>
            <p>Vaultline Bank Pvt. Ltd.<br />12, Kashmiri Gate Metro Complex,<br />Delhi - 110006, India</p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            {submitted ? (
              <p className="form-success">✅ Thank you, {form.name || "there"}! Your message has been noted. Our team will get back to you shortly.</p>
            ) : (
              <>
                <label className="field">
                  <span>Full Name</span>
                  <input name="name" value={form.name} onChange={handleChange} required />
                </label>
                <label className="field">
                  <span>Email</span>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </label>
                <label className="field">
                  <span>Subject</span>
                  <input name="subject" value={form.subject} onChange={handleChange} required />
                </label>
                <label className="field">
                  <span>Message</span>
                  <textarea name="message" rows="5" value={form.message} onChange={handleChange} required />
                </label>
                <button type="submit" className="btn-primary">Send Message</button>
              </>
            )}
          </form>
        </div>
      </section>
    </PublicLayout>
  );
}
