import React from "react";
import { Link } from "react-router-dom";
import "../componentStyles/Product.css";
import Rating from "./Rating";
import placeholder from "../assets/placeholder.png";
import { getImageUrl } from "../utils/getImageUrl";

function Product({ product }) {
  const imageUrl = getImageUrl(product?.image) || placeholder;

  return (
    <Link to={`/product/${product?._id}`} className="product_id">
      <div className="product-card">

        {/* IMAGE */}
        <div className="product-image-wrapper">
          <img
            src={imageUrl}
            alt={product?.name}
            className="product-image"
            onError={(e) => { e.target.src = placeholder; }}
          />
        </div>

        {/* DETAILS */}
        <div className="product-details">
          <h3 className="product-title">{product?.name}</h3>

          <div className="product-rating">
            <Rating value={product?.ratings || 0} />
          </div>

          <p className="product-price">
            ₹{product?.price?.toLocaleString("en-IN")}
          </p>

          <button className="add-to-cart">Add to Cart</button>
        </div>

      </div>
    </Link>
  );
}

export default Product;