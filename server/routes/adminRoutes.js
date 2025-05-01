const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

// Import controllers
const {
  registerUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
  searchUsers,
  approveCertificate,
  downloadCertificate,
} = require("../controllers/adminController");

// Admin creates a user (with profile photo upload)
router.post("/register", upload.single("profilePhoto"), registerUser);

// Get all users
router.get("/users", getAllUsers);

// Get user by id
router.get('/users/:id', getUserById);

// Update user (with optional file upload)
router.put("/users/:id", upload.single("profilePhoto"), updateUser);

// Delete user
router.delete("/users/:id", deleteUser);

// Search users
router.get("/search", searchUsers);

// Approve/reject certificate
router.post("/approve/:id", approveCertificate);

// Generate/download character certificate PDF
router.get("/certificate/:id", downloadCertificate);

module.exports = router;