import React, { useMemo, useState } from "react";
import "./Offer.css";
import product1 from "../../assets/product1.jpg";
import product2 from "../../assets/product2.jpg";
import product3 from "../../assets/product3.jpg";
import product4 from "../../assets/product4.jpg";
import { useCart } from "../../context/CartContext";

const offerItems = [
  { id: 101, image: product1, name: "Studio Set Bundle", price: 20 },
  { id: 102, image: product2, name: "Color Booster Pack", price: 18 },
  { id: 103, image: product3, name: "Travel Sketch Kit", price: 24 },
  { id: 104, image: product4, name: "Premium Watercolor Box", price: 26 },
];

const VISIBLE_COUNT = 3;

const formatPrice = (value) => `$${value.toFixed(2)}`;

const Offer = () => {
  const { addToCart } = useCart();
  const [startIndex, setStartIndex] = useState(0);

  const visibleOffers = useMemo(
    () =>
      Array.from({ length: VISIBLE_COUNT }, (_, offset) => {
        const index = (startIndex + offset) % offerItems.length;
        return offerItems[index];
      }),
    [startIndex]
  );

  const scrollOffers = (direction) => {
    setStartIndex((prev) =>
      direction === "next"
        ? (prev + 1) % offerItems.length
        : (prev - 1 + offerItems.length) % offerItems.length
    );
  };

  return (
    <section className="offer-section">
      <h2 className="offer-heading">Shop Offers</h2>

      <div className="offer-shell">
        <button
          type="button"
          className="offer-nav-icon"
          aria-label="Show previous offers"
          onClick={() => scrollOffers("prev")}
        >
          &#10094;
        </button>

        <div className="offer-track">
          {visibleOffers.map((item, index) => (
            <article className="offer-card" key={`${item.id}-${startIndex}-${index}`}>
              <div className="offer-image-wrap">
                <button type="button" className="offer-sale-tag">Sale</button>
                <img src={item.image} alt={item.name} />
              </div>
              <div className="offer-body">
                <p className="offer-name">{item.name}</p>
                <p className="offer-price">{formatPrice(item.price)}</p>
                <button
                  type="button"
                  className="offer-btn"
                  onClick={() => addToCart(item.id)}
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="offer-nav-icon"
          aria-label="Show next offers"
          onClick={() => scrollOffers("next")}
        >
          &#10095;
        </button>
      </div>
    </section>
  );
};

export default Offer;
