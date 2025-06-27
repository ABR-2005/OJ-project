require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const authRoutes = require("./routes/auth");
const problemRoutes =require("./routes/problem");
const verifyToken = require("./middleware/authMiddleware");  
const verifyAdmin = require("./middleware/roleMiddleware");   

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/online_judge")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// Use auth routes
app.use(authRoutes);
app.use(problemRoutes);

//protected admin-only route
app.get("/admin-only", verifyToken, verifyAdmin, (req, res) => {
  res.send("Welcome Admin");
});

// Serve homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
