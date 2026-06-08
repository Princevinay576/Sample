/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ProductsContext = createContext(null);
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshProducts = async (signal) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch(`${apiBaseUrl}/api/products`, { signal });

      if (!response.ok) {
        throw new Error("Could not load products from API.");
      }

      const data = await response.json();
      setProducts(data);
      return data;
    } catch (err) {
      if (err.name === "AbortError") return null;
      setError(err.message || "Failed to load products.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    refreshProducts(controller.signal);
    return () => controller.abort();
  }, []);

  const productsById = useMemo(
    () =>
      products.reduce((acc, product) => {
        acc[product.productId] = product;
        return acc;
      }, {}),
    [products]
  );

  const value = {
    products,
    productsById,
    isLoading,
    error,
    refreshProducts,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};
