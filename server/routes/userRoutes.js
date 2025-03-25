const express = require('express');
const { registerUser, loginUser,getAllUsers } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser); // User registration
router.post('/login', loginUser); // User login

//get all users
router.get('/',getAllUsers);

module.exports = router;
