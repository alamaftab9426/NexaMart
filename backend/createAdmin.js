import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

    const emailaddress = "admin@test.com";

    const existing = await User.findOne({ emailaddress });
    if (existing) {
      console.log("Admin already exists in database");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new User({
      name: "Admin",
      lastname: "User",
      mobileno: 9999999999,
      emailaddress,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      gender: "male",
      dob: new Date("1990-01-01"),
      role: "admin",
      isActive: true,
    });

    await admin.save();

    console.log("\n=== ADMIN CREATED SUCCESSFULLY ===");
    console.log("Email: admin@test.com");
    console.log("Password: admin123");
    console.log("=================================\n");
  } catch (err) {
    console.error("Error creating admin:", err);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
