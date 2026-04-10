import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // mongoose.connect returns a promise, so we use await
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit the process with failure (code 1) if the connection fails
    process.exit(1);
  }
};

export default connectDB;
