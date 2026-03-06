const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { protect, adminOnly } = require("./middleware/authMiddleware");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running..." });
});

// Auth routes (public)
app.use("/api/auth", authRoutes);

// Protected test route
app.get("/api/profile", protect, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});

// Admin test route
app.get("/api/admin", protect, adminOnly, (req, res) => {
  res.json({
    message: "Welcome Admin",
    user: req.user,
  });
});

// Task routes (PROTECTED)
app.use("/api/tasks", protect, taskRoutes);

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

connectDB();
