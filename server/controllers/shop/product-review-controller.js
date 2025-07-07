const ProductReview = require("../../models/ProductReview");

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

    // Create new review
    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue
    });

    // Save review
    const savedReview = await newReview.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: savedReview
    });

  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add review"
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find all reviews for the product
    const reviews = await ProductReview.find({ productId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews
    });

  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get reviews"
    });
  }
};

module.exports = {
  addProductReview,
  getProductReviews
};