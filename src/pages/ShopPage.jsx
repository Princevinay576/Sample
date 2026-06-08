import React from "react";
import Category from "../components/Category/Category";
import Shop from "../components/Shop/Shop";
import Offer from "../components/Offer/Offer";

const ShopPage = () => {
  return (
    <>
      <div className="reveal-section" data-reveal style={{ "--reveal-delay": "0ms" }}>
        <Category />
      </div>
      <div className="reveal-section" data-reveal style={{ "--reveal-delay": "80ms" }}>
        <Shop />
      </div>
      <div className="reveal-section" data-reveal style={{ "--reveal-delay": "140ms" }}>
        <Offer />
      </div>
    </>
  );
};

export default ShopPage;
