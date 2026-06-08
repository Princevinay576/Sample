import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductsContext";
import { formatPrice } from "../utils/formatPrice";
import { resolveProductImage } from "../utils/resolveProductImage";
import "./Pages.css";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
const initialForm = { productId: "", name: "", price: "", imageKey: "item1", imageUrl: "" };

const AdminPage = () => {
  const navigate = useNavigate();
  const { adminEmail, authFetch, logoutAdmin } = useAuth();
  const { products, isLoading, error, refreshProducts } = useProducts();
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.productId - b.productId),
    [products]
  );

  const resetForm = () => {
    setForm(initialForm);
    setEditingId("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      productId: String(product.productId),
      name: product.name,
      price: String(product.price),
      imageKey: product.imageKey || "item1",
      imageUrl: product.imageUrl || "",
    });
    setFormError("");
    setFormSuccess("");
  };

  const handleUnauthorized = () => {
    logoutAdmin();
    setFormError("Your admin session expired. Please log in again.");
    navigate("/login", { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");

    const payload = {
      productId: Number(form.productId),
      name: form.name.trim(),
      price: Number(form.price),
      imageKey: form.imageKey || undefined,
      imageUrl: form.imageUrl.trim() || undefined,
    };

    if (
      !Number.isInteger(payload.productId) ||
      !payload.name ||
      Number.isNaN(payload.price) ||
      payload.price < 0
    ) {
      setFormError("Please enter a valid product ID, name, and price.");
      return;
    }

    if (!payload.imageKey && !payload.imageUrl) {
      setFormError("Please select an image key or add a custom image URL.");
      return;
    }

    try {
      setIsSaving(true);
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${apiBaseUrl}/api/products/${editingId}`
        : `${apiBaseUrl}/api/products`;

      const response = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Unable to save product.");
      }

      await refreshProducts();
      setFormSuccess(editingId ? "Product updated." : "Product created.");
      resetForm();
    } catch (err) {
      setFormError(err.message || "Unable to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setFormError("");
    setFormSuccess("");

    try {
      const response = await authFetch(`${apiBaseUrl}/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Unable to delete product.");
      }

      await refreshProducts();
      if (editingId === id) resetForm();
      setFormSuccess("Product deleted.");
    } catch (err) {
      setFormError(err.message || "Unable to delete product.");
    }
  };

  return (
    <section className="page-wrap reveal-section" data-reveal>
      <div className="page-card">
        <h1>Product Admin</h1>
        <p>Create, update, and delete MongoDB products used by the shop and cart pages.</p>
        <div className="admin-header-actions">
          <p className="admin-email">Logged in as {adminEmail || "admin"}</p>
          <button type="button" className="ghost-btn" onClick={logoutAdmin}>
            Logout
          </button>
        </div>

        <form className="auth-grid admin-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="productId">Product ID</label>
            <input
              id="productId"
              name="productId"
              type="number"
              min="1"
              step="1"
              value={form.productId}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="price">Price</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="imageKey">Image</label>
            <select id="imageKey" name="imageKey" value={form.imageKey} onChange={handleChange}>
              <option value="">None</option>
              <option value="item1">item1</option>
              <option value="item2">item2</option>
              <option value="item3">item3</option>
              <option value="item4">item4</option>
              <option value="item5">item5</option>
            </select>
          </div>
          <div>
            <label htmlFor="imageUrl">Custom Image URL</label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>
          <div className="admin-actions">
            <button type="submit" className="inline-btn" disabled={isSaving}>
              {isSaving ? "Saving..." : editingId ? "Update Product" : "Create Product"}
            </button>
            {editingId && (
              <button type="button" className="ghost-btn" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {formError && <p className="field-error">{formError}</p>}
        {formSuccess && <p className="field-success">{formSuccess}</p>}
        {error && <p className="field-error">{error}</p>}
        {isLoading && <p>Loading products...</p>}

        <div className="admin-list">
          {sortedProducts.map((product) => (
            <article className="admin-item" key={product._id}>
              <img src={resolveProductImage(product)} alt={product.name} />
              <div>
                <p className="cart-item-name">
                  #{product.productId} {product.name}
                </p>
                <p>{formatPrice(product.price)}</p>
                <p>Image: {product.imageUrl || product.imageKey || "None"}</p>
              </div>
              <div className="admin-item-actions">
                <button type="button" className="ghost-btn" onClick={() => handleEdit(product)}>
                  Edit
                </button>
                <button type="button" className="inline-btn" onClick={() => handleDelete(product._id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
