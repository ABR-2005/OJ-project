const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new user
exports.register = async (req, res) => {
  console.log("🔥 /register hit");
  console.log("📥 req.body received by backend:", req.body);
  
  const { username, email, password, role } = req.body;

  console.log("📥 req.body received by backend:", req.body);
  // ✅ Check required fields first
  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const exists = await User.findOne({ email });
    console.log("❓ User exists check:", exists);
    if (exists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();

    res.json({ message: "Registered Successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};


// Login a user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // Exclude password from response
    const { password: _, ...userData } = user._doc;

    res.json({ token, user: userData }); // 👈 Send both token and user
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Logout a user (JWT is stateless, just instruct frontend to remove token)
exports.logout = (req, res) => {
  res.json({ message: "Logout successful" });
};
