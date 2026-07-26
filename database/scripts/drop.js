/**
 * Drop all collections — use with caution!
 * Run: npm run drop
 */
require('dotenv').config();
const mongoose = require('mongoose');

const drop = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not set in .env file');
    process.exit(1);
  }
  console.log('\n⚠️  WARNING: This will DELETE all data in your database.');
  console.log('Connecting...');
  await mongoose.connect(process.env.MONGODB_URI);
  await mongoose.connection.dropDatabase();
  console.log('✅ Database dropped successfully.\n');
  await mongoose.disconnect();
  process.exit(0);
};

drop().catch(e => { console.error('❌', e.message); process.exit(1); });
