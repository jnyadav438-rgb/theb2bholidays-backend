import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const email = process.env.ADMIN_USERNAME;
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    console.log('User not found');
  } else {
    console.log('User found:', user.email);
    console.log('Password hash in DB:', user.password);
    const isMatch = await user.matchPassword(process.env.ADMIN_PASSWORD);
    console.log('Does password match env?', isMatch);
  }
  mongoose.disconnect();
}).catch(console.error);
