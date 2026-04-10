import React, { useEffect, useState } from 'react'
import '../pageStyles/ProductDetails.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Rating from '@mui/material/Rating'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getProductDetails, removeErrors, submitReview } from '../features/products/productSlice'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'
import { addToCart } from "../features/cart/cartSlice"
import { getImageUrl } from "../utils/getImageUrl"
import placeholder from "../assets/placeholder.png"

function ProductDetails() {

  const [quantity, setQuantity]       = useState(1)
  const [userRating, setUserRating]   = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewMsg, setReviewMsg]     = useState(null) // { type, text }

  const { loading, error, product, reviewLoading } = useSelector((state) => state.products)
  const { isAuthenticated } = useSelector((state) => state.user)

  const dispatch = useDispatch()
  const { id }   = useParams()

  // Fetch product on mount / id change
  useEffect(() => {
    if (id) dispatch(getProductDetails(id))
    return () => dispatch(removeErrors())
  }, [dispatch, id])

  // Show toast on product error
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 })
      dispatch(removeErrors())
    }
  }, [dispatch, error])

  // ── Quantity controls ────────────────────────────────────────────────────
  const increaseQty = () => {
    if (quantity >= product.stock) return
    setQuantity(quantity + 1)
  }

  const decreaseQty = () => {
    if (quantity <= 1) return
    setQuantity(quantity - 1)
  }

  // ── Add to cart ──────────────────────────────────────────────────────────
  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, quantity }))
    toast.success("Product added to cart", { position: "top-center", autoClose: 2000 })
  }

  // ── Submit review ────────────────────────────────────────────────────────
  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setReviewMsg(null)

    if (!userRating) {
      setReviewMsg({ type: 'error', text: 'Please select a star rating.' })
      return
    }
    if (!reviewComment.trim()) {
      setReviewMsg({ type: 'error', text: 'Please write a review comment.' })
      return
    }

    const result = await dispatch(submitReview({
      productId: id,
      rating:    userRating,
      comment:   reviewComment.trim(),
    }))

    if (submitReview.fulfilled.match(result)) {
      setReviewMsg({ type: 'success', text: 'Review submitted successfully!' })
      setUserRating(0)
      setReviewComment('')
      // Refresh product to show new review
      dispatch(getProductDetails(id))
    } else {
      setReviewMsg({ type: 'error', text: result.payload || 'Failed to submit review.' })
    }
  }

  // ── Render states ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <PageTitle title="Product Details" />
        <Navbar />
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p>Product not found.</p>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <PageTitle title={`${product.name} - Select Dresses`} />
      <Navbar />

      <div className="product-details-container">

        <div className="product-detail-container">

          {/* PRODUCT IMAGE */}
          <div className="product-image-container">
            <img
              src={`http://localhost:8000/${product?.image?.[0]?.url?.replace('./', '')}`}
              alt={product?.name}
              className="product-detail-image"
            />
          </div>

          {/* PRODUCT INFO */}
          <div className="product-info">

            <h2>{product?.name}</h2>

            <div className="product-rating">
              <Rating value={product.ratings || 0} precision={0.5} readOnly />
              <span className='productCardSpan'>
                ({product.numOfReviews || 0} reviews)
              </span>
            </div>

            <p className="product-description">{product?.description}</p>

            <p className="product-price">Price : ₹{product?.price}</p>

            <div className="stock-status">
              <span className={product?.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                {product?.stock > 0
                  ? `In Stock (${product?.stock} left)`
                  : 'Out Of Stock'}
              </span>
            </div>

            {/* QUANTITY CONTROLS */}
            <div className="quantity-controls">
              <button className="quantity-button" onClick={decreaseQty}>−</button>
              <input
                type="number"
                value={quantity}
                min="1"
                max={product.stock}
                className="quantity-value"
                onChange={(e) => {
                  let v = Number(e.target.value)
                  if (v < 1) v = 1
                  if (v > product.stock) v = product.stock
                  setQuantity(v)
                }}
              />
              <button className="quantity-button" onClick={increaseQty}>+</button>
            </div>

            <button
              className="add-to-cart-btn"
              onClick={addToCartHandler}
              disabled={product?.stock === 0}
            >
              {product?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            {/* ── REVIEW FORM ── */}
            <div className="review-form-wrapper">
              <h3 className="review-form-heading">Leave a Review</h3>

              {!isAuthenticated ? (
                <p className="review-login-prompt">
                  Please <a href="/login">sign in</a> to write a review.
                </p>
              ) : (
                <form className="review-form" onSubmit={handleReviewSubmit}>
                  <div className="review-rating-row">
                    <span className="review-rating-label">Your Rating</span>
                    <Rating
                      value={userRating}
                      onChange={(_, newVal) => setUserRating(newVal)}
                      size="large"
                    />
                  </div>

                  <textarea
                    placeholder="Share your thoughts about this product..."
                    className="review-input"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                  />

                  {reviewMsg && (
                    <p className={`review-feedback ${reviewMsg.type}`}>
                      {reviewMsg.text}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="submit-review-btn"
                    disabled={reviewLoading}
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

        {/* ── CUSTOMER REVIEWS ── */}
        <div className="reviews-container">
          <h3>Customer Reviews ({product?.numOfReviews || 0})</h3>

          <div className="reviews-section">
            {product?.reviews?.length > 0 ? (
              product.reviews.map((review, index) => (
                <div className="review-item" key={index}>
                  <div className="review-header">
                    <div className="reviewer-avatar">
                      {review.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="review-name">{review.name}</p>
                      <Rating value={review.rating} readOnly size="small" />
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="no-reviews-text">
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </div>
        </div>

      </div>

      <Footer />
    </>
  )
}

export default ProductDetails
