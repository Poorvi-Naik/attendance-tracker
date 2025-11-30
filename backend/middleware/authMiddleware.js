const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token and attach user to the request
module.exports = async function authMiddleware(req, res, next) {
  try {
    // Extract token from "Authorization: Bearer <token>"
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user without password field
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } 
  catch (err) {
    return res.status(401).json({ message: 'Token verification failed' });
  }
};
