import React from "react";
import Hero from "../components/Hero/Hero";
import Category from "../components/Category/Category";
import Photos from "../components/Photos/Photos";
import Shop from "../components/Shop/Shop";
import New from "../components/New/New";
import Offer from "../components/Offer/Offer";

const HomePage = () => {
  return (
    <>
      <div className="reveal-section" data-reveal style={{ "--reveal-delay": "0ms" }}>
        <Hero />
      </div>
      <div className="reveal-section" data-reveal style={{ "--reveal-delay": "70ms" }}>
        <Category />
      </div>
      <div className="reveal-section" data-reveal style={{ "--reveal-delay": "120ms" }}>
        <Photos />
      </div>
      <div className="reveal-section" data-reveal style={{ "--reveal-delay": "170ms" }}>
        <Shop />
      </div>
      <div className="reveal-section" data-reveal style={{ "--reveal-delay": "220ms" }}>
        <New />
      </div>
      <div className="reveal-section" data-reveal style={{ "--reveal-delay": "260ms" }}>
        <Offer />
      </div>
    </>
  );
};

export default HomePage;
