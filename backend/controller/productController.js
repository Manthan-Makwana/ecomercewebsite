import Product from "../models/productModel.js";
import HandleError from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import APIFunctionality from "../utils/apiFunctionality.js";


//http://localhost:8000/api/v1/product/69915c3d58a2da66b62a75b2?keyword=shirt

import cloudinary from "../config/cloudinary.js";

// ✅ CREATE PRODUCT
export const createProducts = handleAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  
  // Handle Images (Cloudinary)
  let images = [];
  if (typeof req.body.image === "string") {
    images.push(req.body.image);
  } else if (Array.isArray(req.body.image)) {
    images = req.body.image;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const imageData = images[i].url || images[i];

    // If image URL is missing or empty, skip Cloudinary and use a placeholder
    if (!imageData || imageData.trim() === "") {
        imagesLinks.push({
            public_id: "default_product",
            url: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
        });
        continue;
    }

    try {
        const result = await cloudinary.uploader.upload(imageData, {
          folder: "products",
        });
    
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
    } catch (err) {
        console.error("Cloudinary Upload Error:", err.message);
        // Fallback to placeholder if upload fails but don't crash the request
        imagesLinks.push({
            public_id: "error_placeholder",
            url: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
        });
    }
  }

  req.body.image = imagesLinks;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product
  });
});
// GET ALL PRODUCTS
export const getAllProducts = handleAsyncError(async (req, res ,next) => {

const resultPerPage = 8;

const apiFeatures = new APIFunctionality(Product.find(), req.query)
.search()
.filter();

const filteredQuery = apiFeatures.query.clone();
const productCount = await filteredQuery.countDocuments();

const totalPages = Math.ceil(productCount / resultPerPage) || 1;

const page = Number(req.query.page) || 1;

apiFeatures.pagination(resultPerPage);

const products = await apiFeatures.query;

res.status(200).json({
success: true,
products,
productCount,
resultPerPage,
totalPages,
currentPage: page
});

});


// UPDATE PRODUCT
export const updateProduct = handleAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new HandleError("Product not found", 404));
  }

  // Handle Images (Cloudinary)
  if (req.body.image) {
    let images = [];
    if (typeof req.body.image === "string") {
      images.push(req.body.image);
    } else if (Array.isArray(req.body.image)) {
      images = req.body.image;
    }

    // Delete existing images from Cloudinary
    for (let i = 0; i < product.image.length; i++) {
      if (product.image[i].public_id !== "n/a") {
        await cloudinary.uploader.destroy(product.image[i].public_id);
      }
    }

    const imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
        const imageData = images[i].url || images[i];

        // If image URL is missing or empty, skip Cloudinary and use a placeholder
        if (!imageData || imageData.trim() === "") {
            imagesLinks.push({
                public_id: "default_product",
                url: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
            });
            continue;
        }

        try {
            const result = await cloudinary.uploader.upload(imageData, {
              folder: "products",
            });
        
            imagesLinks.push({
              public_id: result.public_id,
              url: result.secure_url,
            });
        } catch (err) {
            console.error("Cloudinary Upload Error during update:", err.message);
            // Fallback to placeholder if upload fails
            imagesLinks.push({
                public_id: "error_placeholder",
                url: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
            });
        }
      }
    
    req.body.image = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// DELETING THE PRODUCT 
export const deleteProduct = handleAsyncError(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new HandleError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully"
  });
});


// accessing single product
export const getSingleProduct = handleAsyncError(async (req, res ,next) => {

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "The product you have enter is not found"
    });
  }

  res.status(200).json({
    success: true,
    product
  });
});


// creating new review or updating the review
export const createProductReview = handleAsyncError(async (req, res, next) => {

  const { rating, comment, productId } = req.body;

  // ✅ Validate input
  if (!productId || !rating) {
    return next(new HandleError("Product ID and rating are required", 400));
  }

  const product = await Product.findById(productId);

  // ✅ Check product exists
  if (!product) {
    return next(new HandleError("Product not found", 404));
  }

  const newReview = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  };

  // ✅ Check if user already reviewed
  const existingReview = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (existingReview) {
    // 🔄 Update existing review
    existingReview.rating = Number(rating);
    existingReview.comment = comment;
  } else {
    // ➕ Add new review
    product.reviews.push(newReview);
    product.numOfReviews = product.reviews.length;
  }

  // ✅ Recalculate average rating
  const totalRating = product.reviews.reduce((sum, rev) => sum + rev.rating, 0);
  product.ratings = totalRating / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: existingReview
      ? "Review updated successfully"
      : "Review added successfully"
  });

});
//get admin products
export const getAdminProducts = handleAsyncError(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products
  });
});


//get product reviews


export const getProductReviews = handleAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new HandleError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews
  });
})
  
//delete review
export const deleteReview = handleAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) { 
    return next(new HandleError("Product not found", 404));
  } 
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  const numOfReviews = reviews.length;

  const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
  const ratings = totalRating / numOfReviews;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false
    }
  );

  res.status(200).json({
    success: true,
    message: "Review deleted successfully"
  });
});
