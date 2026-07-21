import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';
import User from '../src/models/User.js';

let adminSynced = false;

async function syncAdmin() {
  if (adminSynced) return;
  const adminEmail = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPass) {
    const admin = await User.findOne({ email: adminEmail }).select('+password');
    if (!admin) {
      await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: adminPass,
        role: 'admin'
      });
    } else {
      const isMatch = await admin.matchPassword(adminPass);
      if (!isMatch) {
        admin.password = adminPass;
        await admin.save();
      }
    }
  }
  adminSynced = true;
}

// Vercel Serverless Function Entrypoint
export default async function handler(req, res) {
  // Ensure the database is connected before processing the request
  await connectDB();

  // Sync admin credentials from env on cold start
  await syncAdmin();
  
  // Pass the request to the Express app
  return app(req, res);
}
