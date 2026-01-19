


import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userProfileRoutes from "./routes/userProfileRoutes.js";
import { Server } from "socket.io";
import http from "http";

// admin
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import colorRoutes from "./routes/colorRoutes.js";
import sizeRoutes from "./routes/sizeRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";

import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", userProfileRoutes);
app.use("/api/address", addressRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/createbrand", brandRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/color", colorRoutes);
app.use("/api/size", sizeRoutes);

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Root Test Route
app.get("/", (req, res) => {
  res.send("E-commerce Backend is Live!");
});

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});


app.set("io", io);

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


server.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});
