import React from "react";
import "./Photos.css";
import paint2 from "../../assets/paint2.jpg";
import paint3 from "../../assets/paint3.jpg";

const Photos = () => {
  return (
    <section className="photos">
      <article className="photo-card">
        <img src={paint2} alt="Professional art supplies" />
        <button type="button" className="photo-btn">Professional Art</button>
      </article>
      <article className="photo-card">
        <img src={paint3} alt="Kids art supplies" />
        <button type="button" className="photo-btn">Kids Art</button>
      </article>
    </section>
  );
};

export default Photos;
