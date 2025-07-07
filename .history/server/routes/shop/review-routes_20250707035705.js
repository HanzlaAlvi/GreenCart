const express = require("express");
const { body, param } = require("express-validator");
const { authMiddleware } = require("../../controllers/auth/auth-controller"); // Correct path

const {
  addProductReview,
  getProductReviews,
} = require("../../controllers/shop/product-review-controller");

const router = express.Router();

router.post(
  "/add",
  authMiddleware, // Use authMiddleware directly
  [
    body("productId").notEmpty().isString(),
    body("userId").notEmpty().isString(),
    body("userName").notEmpty().isString(),
    body("reviewMessage").notEmpty().isString(),
    body("reviewValue").isInt({ min: 1, max: 5 })
  ],
  addProductReview
);

router.get(
  "/:productId",
  param("productId").notEmpty().isString(),
  getProductReviews
);

module.exports = router;