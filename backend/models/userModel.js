import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

// 1. Method to check if entered password matches the database password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 2. Pre-save middleware: Runs BEFORE saving a user to the database
userSchema.pre("save", async function (next) {
  // If we are just updating a user's name/email, don't re-hash the password
  if (!this.isModified("password")) {
    next();
  }

  // Hash the password with a "salt" of 10 rounds (standard security)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
export default User;
