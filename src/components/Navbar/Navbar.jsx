import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { totalItems } = useCart();
  const { isAdminAuthenticated, logoutAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logoutAdmin();
    closeMenu();
  };

  return (
    <nav className="main-nav">
      <NavLink to="/" className="brand-logo">
        THE ART STORE
      </NavLink>

      <button
        type="button"
        className={`menu-toggle ${isMenuOpen ? "is-open" : ""}`}
        aria-label="Toggle navigation menu"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <span></span>
        <span></span>
      </button>

      <ul className={`nav-links ${isMenuOpen ? "is-open" : ""}`}>
        <li>
          <NavLink to="/" onClick={closeMenu}>HOME</NavLink>
        </li>
        <li>
          <NavLink to="/shop" onClick={closeMenu}>SHOP</NavLink>
        </li>
        <li>
          <NavLink to="/contact" onClick={closeMenu}>CONTACT</NavLink>
        </li>
        <li>
          {isAdminAuthenticated ? (
            <button type="button" className="nav-btn" onClick={handleLogout}>
              LOG OUT
            </button>
          ) : (
            <NavLink to="/login" onClick={closeMenu}>LOG IN</NavLink>
          )}
        </li>
        <li>
          <NavLink to="/admin" onClick={closeMenu}>ADMIN</NavLink>
        </li>
        <li>
          <NavLink to="/cart" aria-label="Cart" className="cart-link" onClick={closeMenu}>
            <i className="bi bi-cart4"></i>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
