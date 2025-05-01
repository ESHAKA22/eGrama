const express = require("express");
const router = express.Router();

// Middleware to protect routes
const { protect } = require("../middleware/authMiddleware");

// Controller functions
const {
  getProfile,
  requestCertificate,
  cancelCertificateRequest
} = require("../controllers/userController");

// GET /api/users/profile → Logged-in user's profile
router.get("/profile", protect, getProfile);

// POST /api/users/request-certificate → Submit certificate request
router.post("/request-certificate", protect, requestCertificate);

// POST /api/users/cancel-certificate-request → Cancel certificate request
router.post("/cancel-certificate-request", protect, cancelCertificateRequest);

module.exports = router;
