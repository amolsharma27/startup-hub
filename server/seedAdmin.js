import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/startuphub';

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB...');

    const adminEmail = 'admin@startuphub.com';
    const adminPassword = 'admin123';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      admin.password = hashedPassword;
      admin.role = 'admin';
      await admin.save();
      console.log('Admin user updated successfully.');
    } else {
      admin = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        bio: 'StartupHub Platform Administrator'
      });
      console.log('Admin user created successfully.');
    }

    console.log(`Admin Email: ${adminEmail}`);
    console.log(`Admin Password: ${adminPassword}`);
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedAdmin();
