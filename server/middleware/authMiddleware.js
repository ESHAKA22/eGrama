const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware: Protect routes (any authenticated user)
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user and attach to request
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware: Admin-only access
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
};

// Middleware: User-only access
const userOnly = (req, res, next) => {
  if (req.user && req.user.role === "user") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Users only." });
  }
};

module.exports = { protect, adminOnly, userOnly };