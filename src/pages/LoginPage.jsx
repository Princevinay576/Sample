import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Pages.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdminAuthenticated, loginAdmin } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(value);
  const nextPath = location.state?.from || "/admin";

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAdminAuthenticated, navigate]);

  const validate = () => {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (form.password.trim().length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    return nextErrors;
  };

  const onChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setFormError("");

    if (Object.keys(nextErrors).length === 0) {
      try {
        setIsSubmitting(true);
        await loginAdmin(form.email, form.password);
        setForm({ email: "", password: "" });
        navigate(nextPath, { replace: true });
      } catch (error) {
        setFormError(error.message || "Unable to log in.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const hasErrors = useMemo(() => Object.values(errors).some(Boolean), [errors]);

  return (
    <section className="page-wrap reveal-section" data-reveal>
      <div className="page-card form-card">
        <h1>Admin Login</h1>
        <p>Only admin can sign in here to access product management.</p>

        <form className="auth-grid" onSubmit={handleSubmit} noValidate>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(event) => onChange("email", event.target.value)}
            />
            {errors.email && <small className="field-error">{errors.email}</small>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(event) => onChange("password", event.target.value)}
            />
            {errors.password && <small className="field-error">{errors.password}</small>}
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
          {formError && <p className="field-error">{formError}</p>}
          {!formError && hasErrors && <p className="field-error">Please fix highlighted fields.</p>}
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
