/**
 * Seed Script — creates a default admin user
 * Run: node scripts/seed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/culinary_db';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  status: { type: String, default: 'active' },
  profileImage: { type: String, default: null },
  bio: { type: String, default: '' },
  bookmarks: []
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Admin user
    const adminExists = await User.findOne({ email: 'admin@culinaryhub.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin User',
        email: 'admin@culinaryhub.com',
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        bio: 'CulinaryHub Administrator'
      });
      console.log('✅ Admin user created: admin@culinaryhub.com / admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Demo user
    const demoExists = await User.findOne({ email: 'demo@culinaryhub.com' });
    if (!demoExists) {
      const hashedPassword = await bcrypt.hash('demo123', 10);
      await User.create({
        name: 'Demo Chef',
        email: 'demo@culinaryhub.com',
        password: hashedPassword,
        role: 'user',
        status: 'active',
        bio: 'Passionate home cook!'
      });
      console.log('✅ Demo user created: demo@culinaryhub.com / demo123');
    } else {
      console.log('ℹ️  Demo user already exists');
    }

    console.log('\n🎉 Seeding complete!\n');
    console.log('Admin Login → http://localhost:3000/admin-login');
    console.log('  Email:    admin@culinaryhub.com');
    console.log('  Password: admin123\n');
    console.log('User Login → http://localhost:3000/login');
    console.log('  Email:    demo@culinaryhub.com');
    console.log('  Password: demo123\n');

  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
