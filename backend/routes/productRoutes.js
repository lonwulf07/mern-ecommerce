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

router.get("/", getProducts);

// Add .post() to the standard root route
router.route("/").get(getProducts).post(protect, admin, createProduct);

// Add .put() to the specific ID route
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

// Route for leaving a review
router.route('/:id/reviews').post(protect, createProductReview);

export default router;
