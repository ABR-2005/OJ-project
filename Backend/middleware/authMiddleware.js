const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // ✅ Allow public routes
  if (
    req.path === "/register" ||
    req.path === "/login" ||
    req.originalUrl === "/api/register" ||
    req.originalUrl === "/api/login"
  ) {
    return next();
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Access Denied" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: "Invalid Token" });
  }
};

module.exports = verifyToken;
