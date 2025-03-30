import mongoose from 'mongoose';

interface User {
  email: string;
  googleId: string;
  name: string;
  workspaces: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    workspaces: [{
      type: String,
      required: true,
    }],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<User>('User', userSchema); 