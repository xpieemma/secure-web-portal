import 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';
import passport from 'passport';
import userRoutes from './routes/users.js';
import bookmarkRoutes from './routes/bookmarks.js';
import './config/passport.js';


connectDB();

const app = express();


app.use(express.json()); // Parse JSON bodies

app.use(passport.initialize()); // Initialize passport

app.use('/api/users', userRoutes); // User routes
app.use('/api/bookmarks', bookmarkRoutes); // Bookmark routes

app.use((err, req, res, next) => { // Error handling
  console.error(err.stack); // Log error
  res.status(500).json({ message: 'Something went wrong!' }); // Send error response
});

const PORT = process.env.PORT || 5501; // Get port from environment variable or default to 5000
app.listen(PORT, () => {// Start server
  console.log(`Server running on port ${PORT}`); // Log server start
});