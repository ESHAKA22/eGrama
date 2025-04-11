const express = require('express');
const router = express.Router();
const { registerUser, loginUser, searchUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/search',protect, searchUsers);

module.exports = router;
