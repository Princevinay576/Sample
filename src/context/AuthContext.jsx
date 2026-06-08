/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_EMAIL_KEY = "admin_email";

const getStoredValue = (key) => {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(key) || "";
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getStoredValue(ADMIN_TOKEN_KEY));
  const [adminEmail, setAdminEmail] = useState(() => getStoredValue(ADMIN_EMAIL_KEY));

  const persistAuth = (nextToken, nextEmail) => {
    if (typeof window === "undefined") return;
    if (nextToken) {
      window.localStorage.setItem(ADMIN_TOKEN_KEY, nextToken);
    } else {
      window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    }

    if (nextEmail) {
      window.localStorage.setItem(ADMIN_EMAIL_KEY, nextEmail);
    } else {
      window.localStorage.removeItem(ADMIN_EMAIL_KEY);
    }
  };

  const loginAdmin = async (email, password) => {
    const response = await fetch(`${apiBaseUrl}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || "Admin login failed");
    }

    const nextToken = data.token || "";
    const nextEmail = data.admin?.email || "";
    setToken(nextToken);
    setAdminEmail(nextEmail);
    persistAuth(nextToken, nextEmail);
    return data;
  };

  const logoutAdmin = () => {
    setToken("");
    setAdminEmail("");
    persistAuth("", "");
  };

  const authFetch = (url, options = {}) => {
    const headers = {
      ...(options.headers || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  };

  const value = {
    token,
    adminEmail,
    isAdminAuthenticated: Boolean(token),
    loginAdmin,
    logoutAdmin,
    authFetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
