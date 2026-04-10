import React, { useState, useEffect } from "react";
import "../componentStyles/ImageSlider.css";
import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";
import banner3 from "../assets/banner3.jpg";
import banner4 from "../assets/banner4.jpg";

const CoverflowSlider = () => {
  const images = [banner1, banner2, banner3, banner4];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getPosition = (index) => {
    if (index === current) return "active";
    if (
      index === current - 1 ||
      (current === 0 && index === images.length - 1)
    )
      return "left";
    if (
      index === current + 1 ||
      (current === images.length - 1 && index === 0)
    )
      return "right";
    return "hidden";
  };

  return (
    <div className="coverflow-container">
      {images.map((img, index) => (
        <div
          key={index}
          className={`coverflow-slide ${getPosition(index)}`}
          onClick={() => setCurrent(index)}
        >
          <img src={img} alt={`Slide ${index}`} />
        </div>
      ))}
    </div>
  );
};

export default CoverflowSlider;