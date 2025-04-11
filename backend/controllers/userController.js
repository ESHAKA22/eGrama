const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { username, password, name, email, pic } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    
    }
    const isAdmin = password === "1111";
    const user = await User.create({ username, password, name, email, pic });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isAdmin = user.isAdmin;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token,
      isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const searchUsers = async (req, res) => {
  console.log('searchUsers called with query:', req.query); // Debug
  console.log('req.user:', req.user); // Debug
  const { search } = req.query;
  try {
    if (!search) {
      console.log('Search query is missing'); // Debug
      return res.status(400).json({ message: 'Search query is required' });
    }
    if (!req.user || !req.user._id) {
      console.log('req.user is undefined or missing _id');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const users = await User.find(
      {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
        _id: { $ne: req.user._id },
      },
      { password: 0 }
    );

    console.log('Users found:', users); // Debug
    res.json(users);
  } catch (error) {
    console.error('Error in searchUsers:', error.message); // Debug
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerUser, loginUser, searchUsers };