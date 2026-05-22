import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);

  const db = mongoose.connection.db;
  const usersCollection = db!.collection('users');

  const existing = await usersCollection.findOne({ email: 'admin@store.com' });

  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }

  const hashed = await bcrypt.hash('admin123', 10);

  await usersCollection.insertOne({
    name: 'Admin',
    email: 'admin@store.com',
    password: hashed,
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
