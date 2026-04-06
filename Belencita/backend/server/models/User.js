import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  imageUrl: {
    type: String
  },
  lastSignIn: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Esto crea createdAt y updatedAt automáticamente
});

const User = mongoose.model('User', userSchema);
export default User;
