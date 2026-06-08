import React, { useMemo, useState } from "react";
import "./Pages.css";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!form.message.trim()) {
      nextErrors.message = "Message is required.";
    } else if (form.message.trim().length < 10) {
      nextErrors.message = "Message must be at least 10 characters.";
    }

    return nextErrors;
  };

  const onChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setIsSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } else {
      setIsSubmitted(false);
    }
  };

  const hasErrors = useMemo(() => Object.values(errors).some(Boolean), [errors]);

  return (
    <section className="page-wrap reveal-section" data-reveal>
      <div className="page-card">
        <h1>Contact Us</h1>
        <p>Tell us what you need and our team will help you with products, orders, and delivery.</p>

        <form className="contact-grid" onSubmit={handleSubmit} noValidate>
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(event) => onChange("name", event.target.value)}
            />
            {errors.name && <small className="field-error">{errors.name}</small>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(event) => onChange("email", event.target.value)}
            />
            {errors.email && <small className="field-error">{errors.email}</small>}
          </div>

          <div>
            <textarea
              rows="5"
              placeholder="Your Message"
              value={form.message}
              onChange={(event) => onChange("message", event.target.value)}
            />
            {errors.message && <small className="field-error">{errors.message}</small>}
          </div>

          <button type="submit">Send Message</button>
          {isSubmitted && !hasErrors && (
            <p className="field-success">Message sent successfully.</p>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactPage;
