const mongoose = require('mongoose');

let isConnected = false;

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.DATABASE_URL;

  if (!uri) {
    console.warn('⚠️  MONGO_URI is not set in environment variables. Running with In-Memory fallback mode.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️  Falling back to In-Memory store for this session.');
    isConnected = false;
    return false;
  }
};

/**
 * Check if Database is connected
 */
const isDBConnected = () => isConnected;

module.exports = { connectDB, isDBConnected };
