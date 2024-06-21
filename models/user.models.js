import { Timestamp } from 'mongodb';
import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'please i need the name'],
    },
    image: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      required: [true, 'please i need your bio'],
    },
    social: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'please i need your email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'please i need your password'],
    },
  },
  {
    Timestamp: true,
  }
);

const User = mongoose.model('User', UserSchema);

export default User;
