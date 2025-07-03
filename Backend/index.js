require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const submissionRoutes = require("./routes/submissions");
const authRoutes = require("./routes/auth");
const problemRoutes = require("./routes/problem");
const verifyToken = require("./middleware/authMiddleware");
const verifyAdmin = require("./middleware/roleMiddleware");

const app = express();

// 🔧 Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 🧠 Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/online_judge", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// 🔗 API Routes
app.use("/api", submissionRoutes);    // POST /api/submit
app.use("/api", authRoutes);          // POST /api/login etc
app.use("/api", problemRoutes);       // CRUD for problems

// 🔒 Protected route (Admin only)
app.get("/admin-only", verifyToken, verifyAdmin, (req, res) => {
  res.send("👑 Welcome Admin");
});

// 🌐 Serve frontend static files (if using basic HTML frontend)
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
