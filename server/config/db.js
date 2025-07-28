require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    await mongoose.connect(uri);
    console.log(' MongoDB connected successfully');
  } catch (err) {
    console.error(' MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Optional: Log when MongoDB is disconnected
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
});

module.exports = connectDB;
