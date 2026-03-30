import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => { // Authentication middleware
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) { // If authorization header exists and starts with Bearer
    token = req.headers.authorization.split(' ')[1]; // Get token from header
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' }); // Return error if no token
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const user = await User.findById(decoded.id).select('-password'); // Find user by id
    if (!user) {
      return res.status(401).json({ message: 'User not found' }); // Return error if user not found
    }
    req.user = user; // Set user in request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' }); // Return error if token verification fails
  }
};

export default authMiddleware; // Export auth middleware
