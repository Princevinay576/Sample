import React, { useState } from "react";
import "./Footer.css";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubscribe = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    setError("");
    setSuccess("");

    if (!emailPattern.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch(`${apiBaseUrl}/api/subscribers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Subscription failed.");
      }

      setEmail("");
      setSuccess("Thanks for subscribing!");
    } catch (err) {
      setError(err.message || "Subscription failed.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-news">
        <h3>Our Newsletter</h3>
        <p>Subscribe for exclusive offers, launches, and artist tips every week.</p>
        <label htmlFor="newsletter-email">Email</label>
        <input
          id="newsletter-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button type="button" className="sub" onClick={handleSubscribe} disabled={isSaving}>
          {isSaving ? "Subscribing..." : "Subscribe"}
        </button>
        {error && <small className="sub-error">{error}</small>}
        {success && <small className="sub-success">{success}</small>}
      </div>

      <div className="footer-links">
        <h3>Shop</h3>
        <ul>
          <li>Professional Art</li>
          <li>Kids Art</li>
          <li>Shipping & Returns</li>
          <li>Store Policy</li>
          <li>Payment Methods</li>
          <li>FAQ</li>
        </ul>
      </div>

      <div className="footer-contact">
        <h3>Contact</h3>
        <p>
          500 Terry Francine Street
          <br />
          San Francisco, CA 94158
          <br />
          info@mysite.com
          <br />
          123-456-7890
        </p>
      </div>
    </footer>
  );
};

export default Footer;
