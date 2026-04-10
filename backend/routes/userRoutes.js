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

// Anyone can POST to register. ONLY admins can GET all users.
router.route("/").post(registerUser).get(protect, admin, getUsers);

router.post("/login", authUser);
router.put("/profile", protect, updateUserProfile);

// ONLY admins can DELETE a user by their ID
router.route("/:id").delete(protect, admin, deleteUser);

export default router;
