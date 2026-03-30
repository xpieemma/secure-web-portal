import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema( 
  {
    title: {
      type: String, // Title of the bookmark
      required: true, // Required field
    },
    url: {
      type: String, // URL of the bookmark
      required: true, // Required field
    },
    description: {
      type: String, // Description of the bookmark
      default: '', // Default value
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // User ID
      ref: 'User', // Reference to User model
      required: true, // Required field
    },
  },
  { timestamps: true } // Add timestamps
);

export default mongoose.model('Bookmark', bookmarkSchema); // Export bookmark schema