import mongoose from 'mongoose';
import { CONFIG } from './index';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(CONFIG.MONGODB.URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
