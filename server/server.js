const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Register routes
app.use("/api/auth", authRoutes);     // /api/auth/login
app.use("/api/users", userRoutes);    // /api/users/*
app.use("/api/admin", adminRoutes);   // /api/admin/*

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Village User Management System API is running...");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
