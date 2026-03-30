import express from 'express';
import authMiddleware from '../middleware/auth.js';
import Bookmark from '../models/Bookmark.js';

const router = express.Router();


router.use(authMiddleware); // Apply auth middleware to all routes

router.post('/', async (req, res) => {
  const { title, url, description } = req.body; // Get title, url, and description from request body
  if (!title || !url) {
    return res.status(400).json({ message: 'Title and URL are required' }); // Return error message
  }

  try {
    const bookmark = new Bookmark({ // Create new bookmark
      title,
      url,
      description,
      user: req.user._id,
    });
    await bookmark.save();
    res.status(201).json(bookmark); // Return created bookmark
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message }); // Return error message
  }
});


router.get('/', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(bookmarks); // Return bookmarks
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message }); // Return error message
  }
});

router.get('/:id', async (req, res) => { // Get bookmark by ID
  try {
    const bookmark = await Bookmark.findById(req.params.id); // Find bookmark by ID
    if (!bookmark) { // If bookmark not found
      return res.status(404).json({ message: 'Bookmark not found' }); // Return error message
    }
    
    if (bookmark.user.toString() !== req.user._id.toString()) { // If user is not the owner
      return res.status(403).json({ message: 'Not authorized to access this bookmark' }); // Return error message
    }
    res.json(bookmark); // Return bookmark
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message }); // Return error message
  }
});


router.put('/:id', async (req, res) => { // Update bookmark by ID
  const { title, url, description } = req.body; // Get title, url, and description from request body
  try {
    let bookmark = await Bookmark.findById(req.params.id); // Find bookmark by ID
    if (!bookmark) { // If bookmark not found
      return res.status(404).json({ message: 'Bookmark not found' }); // Return error message
    }
    if (bookmark.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this bookmark' }); // Return error message
    }

    bookmark.title = title || bookmark.title; // Update title if provided
    bookmark.url = url || bookmark.url; // Update url if provided
    bookmark.description = description !== undefined ? description : bookmark.description; // Update description if provided

    await bookmark.save(); // Save updated bookmark
    res.json(bookmark); // Return updated bookmark
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message }); // Return error message
  }
});


router.delete('/:id', async (req, res) => { // Delete bookmark by ID
  try {
    const bookmark = await Bookmark.findById(req.params.id); // Find bookmark by ID
    if (!bookmark) { // If bookmark not found
      return res.status(404).json({ message: 'Bookmark not found' }); // Return error message
    }
    if (bookmark.user.toString() !== req.user._id.toString()) { // If user is not the owner
      return res.status(403).json({ message: 'Not authorized to delete this bookmark' }); // Return error message
    }

    await bookmark.deleteOne(); // Delete bookmark
    res.json({ message: 'Bookmark removed' }); // Return success message
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message }); // Return error message
  }
});
export default router;