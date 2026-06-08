import React, { useMemo, useState } from "react";
import "./Shop.css";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductsContext";
import { formatPrice } from "../../utils/formatPrice";
import { resolveProductImage } from "../../utils/resolveProductImage";


const VISIBLE_COUNT = 4;

const Shop = () => {
  const { addToCart } = useCart();
  const { products, isLoading, error } = useProducts();
  const [startIndex, setStartIndex] = useState(0);

  const visibleProducts = useMemo(
    () => {
      if (!products.length) return [];
      return Array.from({ length: Math.min(VISIBLE_COUNT, products.length) }, (_, offset) => {
        const index = (startIndex + offset) % products.length;
        return products[index];
      });
    },
    [products, startIndex]
  );

  const scrollCards = (direction) => {
    if (!products.length) return;

    setStartIndex((prev) =>
      direction === "next"
        ? (prev + 1) % products.length
        : (prev - 1 + products.length) % products.length
    );
  };

  return (
    <section className="shop-section">
      <h2 className="shop-heading">Shop Favorites</h2>

      <div className="shop-shell">
        <button
          type="button"
          className="shop-nav-icon"
          aria-label="Show previous products"
          onClick={() => scrollCards("prev")}
          disabled={!products.length}
        >
          &#10094;
        </button>

        <div className="shop-track">
          {isLoading && <p>Loading products...</p>}
          {!isLoading && error && <p>{error}</p>}
          {visibleProducts.map((product) => (
            <article className="shop-card in-view" key={product.productId}>
              <div className="shop-image-wrap">
                <button type="button" className="best-seller-tag">
                  Best Seller
                </button>
                <img src={resolveProductImage(product)} alt={product.name} />
              </div>
              <div className="shop-card-body">
                <p className="shop-name">{product.name}</p>
                <p className="shop-price">{formatPrice(product.price)}</p>
                <button
                  type="button"
                  className="shop-btn"
                  onClick={() => addToCart(product.productId)}
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="shop-nav-icon"
          aria-label="Show next products"
          onClick={() => scrollCards("next")}
          disabled={!products.length}
        >
          &#10095;
        </button>
      </div>
    </section>
  );
};

export default Shop;
