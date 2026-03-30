import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema( // Create user schema
  {
    name: { // User name
      type: String, // String type
      required: true, // Required field
    },
    email: { // User email
      type: String, // String type
      required: true, // Required field
      unique: true, // Unique field
      lowercase: true, // Lowercase field
      trim: true, // Trim field
    },
    password: { // User password
      type: String, // String type
      required: false, // Required field
    },
    githubId: { // GitHub ID
      type: String, // String type
      unique: true, // Unique field
      sparse: true, // allows multiple users without githubId
    },
  },
  { timestamps: true } // Add timestamps
);


userSchema.pre('save', async function (next) { // Hash password before saving
  if (!this.isModified('password') || !this.password) return; // If password is not modified or not provided, skip
  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash password
  } catch (err) { // If error occurs
  throw new Error(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) { // Compare password
  if (!this.password) return false; // If password is not provided, return false
  return await bcrypt.compare(candidatePassword, this.password); // Compare password
};

export default mongoose.model('User', userSchema); // Export user schema