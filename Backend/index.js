require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");


const submissionRoutes = require("./routes/submissions");
const aiRoutes = require("./routes/ai");
const authRoutes = require("./routes/auth");
const problemRoutes = require("./routes/problem");
const verifyToken = require("./middleware/authMiddleware");
const verifyAdmin = require("./middleware/roleMiddleware");
const leaderboardRoutes = require("./routes/leaderboard");

const app = express();

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`🌐 Incoming: ${req.method} ${req.url}`);
  next();
});


// 🔧 Middleware
app.use(cors());
app.use(express.json());

// 🧠 Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/online_judge")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 🔓 Public Routes
app.use("/api", authRoutes);  // /api/register, /api/login
app.use("/api", leaderboardRoutes);

// 🔐 Protected Routes (token required)
app.use("/api/submit", verifyToken, submissionRoutes);
app.use("/api/ai", verifyToken, aiRoutes);
app.use("/api/problem", verifyToken, problemRoutes);

// 🔒 Admin-only Route
app.get("/admin-only", verifyToken, verifyAdmin, (req, res) => {
  res.send("👑 Welcome Admin");
});

// 🌐 Serve frontend static files (if applicable)
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
