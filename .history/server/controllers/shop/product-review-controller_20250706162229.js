const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } = req.body;

    // Validate input
    if (!productId || !userId || !userName || !reviewMessage || !reviewValue) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check if user has purchased the product
    const hasPurchased = await Order.exists({
      userId,
      "cartItems.productId": productId,
      orderStatus: { $in: ["confirmed", "delivered"] } // Fixed syntax
    });

    if (!hasPurchased) {
      return res.status(403).json({
        success: false,
        message: "You must purchase the product before reviewing"
      });
    }

    // Check for existing review
    const existingReview = await ProductReview.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You've already reviewed this product"
      });
    }

    // Create and save review
    const newReview = await ProductReview.create({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue
    });

    // Update product's average rating
    const reviews = await ProductReview.find({ productId });
    const average = reviews.reduce((sum, r) => sum + r.reviewValue, 0) / reviews.length;
    
    await Product.findByIdAndUpdate(productId, { 
      averageRating: parseFloat(average.toFixed(2)) 
    });

    return res.status(201).json({
      success: true,
      data: newReview
    });

  } catch (error) {
    console.error("Review Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add review"
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    const reviews = await ProductReview.find({ productId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: reviews
    });

  } catch (error) {
    console.error("Get Reviews Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch reviews"
    });
  }
};

module.exports = { addProductReview, getProductReviews };