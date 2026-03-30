import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Connect to MongoDB
    console.log('MongoDB Connected'); // MongoDB connected
  } catch (error) {
    console.error('MongoDB connection error:', error); // MongoDB connection error
    process.exit(1); // Exit process with failure
  }
};

export default connectDB; // Export connectDB function