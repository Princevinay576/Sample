import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import { formatPrice } from "../utils/formatPrice";
import { resolveProductImage } from "../utils/resolveProductImage";
import "./Pages.css";

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { products, isLoading, error } = useProducts();

  const selectedProducts = products
    .filter((product) => cartItems[product.productId])
    .map((product) => ({ ...product, quantity: cartItems[product.productId] }));

  const subtotal = selectedProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  return (
    <section className="page-wrap reveal-section" data-reveal>
      <div className="page-card">
        <h1>Your Cart</h1>
        {isLoading && <p>Loading cart products...</p>}
        {!isLoading && error && <p>{error}</p>}

        {!isLoading && selectedProducts.length === 0 ? (
          <div className="empty-state">
            <p>Your cart is empty. Add products from the shop to get started.</p>
            <Link to="/shop" className="inline-btn link-btn">
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {selectedProducts.map((product) => (
                <article className="cart-item" key={product.productId}>
                  <img src={resolveProductImage(product)} alt={product.name} />
                  <div className="cart-item-content">
                    <p className="cart-item-name">{product.name}</p>
                    <p>{formatPrice(product.price)}</p>
                    <div className="cart-actions">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.productId, product.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{product.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.productId, product.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeFromCart(product.productId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="cart-line-total">
                    {formatPrice(product.price * product.quantity)}
                  </p>
                </article>
              ))}
            </div>

            <div className="cart-summary">
              <p>Subtotal: <strong>{formatPrice(subtotal)}</strong></p>
              <div className="cart-summary-buttons">
                <button type="button" className="inline-btn">Checkout</button>
                <button type="button" className="ghost-btn" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CartPage;
