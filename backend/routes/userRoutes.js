import express from "express";
import {
  authUser,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/users
// @desc    Register a new user
// @access  Public
router.route("/").post(registerUser).get(protect, admin, getUsers);

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", authUser);
router.put("/profile", protect, updateUserProfile);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.route("/:id").delete(protect, admin, deleteUser);

export default router;
