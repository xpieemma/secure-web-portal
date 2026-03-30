import express from 'express';
import passport from 'passport';
import User from '../models/User.js';
import { generateToken } from '../utils/token.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body; // Get name, email, and password from request body

  if (!name || !email || !password) { // If any of the fields are missing
    return res.status(400).json({ message: 'Please provide all fields' }); // Return error message
  }

  try {
    const existingUser = await User.findOne({ email }); // Find user by email
    if (existingUser) { // If user already exists
      return res.status(400).json({ message: 'User already exists' }); // Return error message
    }

    const user = new User({ name, email, password }); // Create new user
    await user.save(); // Save user to database

    const token = generateToken(user._id); // Generate JWT for the authenticated user
    res.status(201).json({ // Return user data and token
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message }); // Return error message
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Get email and password from request body

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });// Return error message
  }

  try {
    const user = await User.findOne({ email }); // Find user by email
    if (!user || !user.password) { // If user doesn't exist or password is missing
      return res.status(401).json({ message: 'Invalid credentials' }); // Return error message
    }

    const isMatch = await user.comparePassword(password); // Compare password with hashed password
    if (!isMatch) { // If password doesn't match
      return res.status(401).json({ message: 'Invalid credentials' }); // Return error message
    }

    const token = generateToken(user._id); // Generate JWT for the authenticated user
    res.json({ // Return user data and token
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message }); // Return error message
  }
});


router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] })); // Redirect to GitHub for authentication

router.get( 
  '/auth/github/callback', // Callback URL
  
  passport.authenticate('github', { session: false, failureRedirect: '/login' }), // Authenticate with GitHub
  (req, res) => { // Callback function
  
    const token = generateToken(req.user._id);// Generate JWT for the authenticated user
   
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);// Redirect to frontend with token
  }
);

export default router; // Export router