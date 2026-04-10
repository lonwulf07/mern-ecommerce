import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  let token;

  // Check if the request headers have an Authorization token that starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get the token from the header (It looks like "Bearer eyJhbG...")
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database using the ID hidden inside the token.
      // .select('-password') means "return the user, but leave the password out!"
      req.user = await User.findById(decoded.id).select("-password");

      // Move on to the next piece of middleware or the controller
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Admin middleware - Checks if the logged-in user has the isAdmin flag
export const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        // You are an admin! Proceed to the controller.
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};