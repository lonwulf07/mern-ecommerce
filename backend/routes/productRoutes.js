import express from "express";
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route for fetching products and creating new products (admin only)
router.route("/").get(getProducts).post(protect, admin, createProduct);

// Admin routes for updating and deleting products
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

// Create new review
router.route('/:id/reviews').post(protect, createProductReview);

export default router;
