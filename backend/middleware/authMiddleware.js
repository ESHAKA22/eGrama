// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect =  (req, res, next) => {
  let token;
  console.log('Authorization Header:', req.headers.authorization); // Debug
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token:', token); // Debug
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded:', decoded); // Debug
      req.user = { _id: decoded.id };
      console.log('req.user set to:', req.user); // Debug
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      console.error('Token verification error stack:', error.stack);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('No Authorization header or incorrect format');
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };