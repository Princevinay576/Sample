import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import AdminRoute from "./components/auth/AdminRoute";
import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import End from "./components/End/End";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import AdminPage from "./pages/AdminPage";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    const sections = document.querySelectorAll("[data-reveal]");
    if (!sections.length) return;

    sections.forEach((section) => section.classList.remove("is-visible"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Header />
      <Navbar />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/admin"
            element={(
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            )}
          />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      <Footer />
      <End />
    </div>
  );
};

export default App;
