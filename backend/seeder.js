import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";

// Load env variables and connect to DB
dotenv.config();
connectDB();

const importData = async () => {
  try {
    // 1. Clear out any existing data so we start fresh
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // 2. Create a dummy Admin user
    const createdUsers = await User.insertMany([
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "password123", // We will encrypt this properly in Phase 4
        isAdmin: true,
      },
    ]);

    // Grab the ID of that newly created admin
    const adminUserId = createdUsers[0]._id;

    // 3. Create sample products and attach the Admin's ID to them
    const sampleProducts = [
      {
        user: adminUserId,
        name: "Airpods Wireless Bluetooth Headphones",
        image:
          "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        brand: "Apple",
        category: "Electronics",
        description:
          "Bluetooth technology lets you connect it with compatible devices wirelessly.",
        price: 89.99,
        countInStock: 10,
        rating: 4.5,
        numReviews: 12,
      },
      {
        user: adminUserId,
        name: "Logitech G-Series Gaming Mouse",
        image:
          "https://images.unsplash.com/photo-1527814050087-379381547996?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        brand: "Logitech",
        category: "Electronics",
        description:
          "Get a better handle on your games with this Logitech LIGHTSYNC gaming mouse.",
        price: 49.99,
        countInStock: 7,
        rating: 4.0,
        numReviews: 8,
      },
    ];

    await Product.insertMany(sampleProducts);

    console.log("✅ Data Successfully Imported!");
    process.exit(); // Exit script successfully
  } catch (error) {
    console.error(`❌ Error with seeder: ${error.message}`);
    process.exit(1); // Exit script with a failure code
  }
};

// Run the function
importData();
