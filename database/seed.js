/**
 * ENGRAVIA LABS — Master Database Seeder
 * =======================================
 * This file connects to MongoDB Atlas and populates
 * your database with sample data.
 *
 * HOW TO RUN:
 * 1. Open terminal / command prompt
 * 2. Navigate to the database folder:  cd database
 * 3. Install dependencies:             npm install
 * 4. Open .env file and paste your MongoDB URI
 * 5. Run:                              npm run seed
 *
 * This will create:
 * ✅ 1 Super Admin account
 * ✅ 5 Sample customer accounts
 * ✅ 8 Product categories
 * ✅ 24 Products with full details
 * ✅ 6 Coupons
 * ✅ 12 Testimonials
 * ✅ 3 Hero banners
 * ✅ 10 Blog posts
 * ✅ 20 Sample orders
 * ✅ 30 Product reviews
 * ✅ Site settings
 */

require('dotenv').config();
const mongoose = require('mongoose');

const seedUsers        = require('./seeders/01_users');
const seedCategories   = require('./seeders/02_categories');
const seedProducts     = require('./seeders/03_products');
const seedCoupons      = require('./seeders/04_coupons');
const seedTestimonials = require('./seeders/05_testimonials');
const seedBanners      = require('./seeders/06_banners');
const seedBlogs        = require('./seeders/07_blogs');
const seedOrders       = require('./seeders/08_orders');
const seedReviews      = require('./seeders/09_reviews');
const seedSettings     = require('./seeders/10_settings');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('\n❌ ERROR: MONGODB_URI is not set in your .env file');
  console.error('📝 Please open database/.env and paste your MongoDB Atlas connection string\n');
  process.exit(1);
}

const run = async () => {
  try {
    console.log('\n═══════════════════════════════════════════════');
    console.log('  ENGRAVIA LABS — Database Seeder');
    console.log('═══════════════════════════════════════════════\n');

    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('✅ Connected to MongoDB Atlas successfully!\n');

    const args = process.argv.slice(2);
    const shouldDrop = args.includes('--fresh');

    if (shouldDrop) {
      console.log('🗑  --fresh flag detected. Dropping all existing data...');
      await mongoose.connection.dropDatabase();
      console.log('✅ Database cleared.\n');
    }

    console.log('📦 Starting to seed data...\n');

    console.log('👤 [1/10] Seeding Users...');
    const users = await seedUsers();
    console.log(`   ✅ Created ${users.length} users\n`);

    console.log('🏷  [2/10] Seeding Categories...');
    const categories = await seedCategories();
    console.log(`   ✅ Created ${categories.length} categories\n`);

    console.log('📦 [3/10] Seeding Products...');
    const products = await seedProducts(categories, users);
    console.log(`   ✅ Created ${products.length} products\n`);

    console.log('🎟  [4/10] Seeding Coupons...');
    const coupons = await seedCoupons();
    console.log(`   ✅ Created ${coupons.length} coupons\n`);

    console.log('💬 [5/10] Seeding Testimonials...');
    const testimonials = await seedTestimonials();
    console.log(`   ✅ Created ${testimonials.length} testimonials\n`);

    console.log('🖼  [6/10] Seeding Banners...');
    const banners = await seedBanners();
    console.log(`   ✅ Created ${banners.length} banners\n`);

    console.log('📝 [7/10] Seeding Blog Posts...');
    const blogs = await seedBlogs(users);
    console.log(`   ✅ Created ${blogs.length} blog posts\n`);

    console.log('🛒 [8/10] Seeding Orders...');
    const orders = await seedOrders(users, products);
    console.log(`   ✅ Created ${orders.length} orders\n`);

    console.log('⭐ [9/10] Seeding Reviews...');
    const reviews = await seedReviews(users, products, orders);
    console.log(`   ✅ Created ${reviews.length} reviews\n`);

    console.log('⚙️  [10/10] Seeding Site Settings...');
    await seedSettings();
    console.log('   ✅ Site settings saved\n');

    console.log('═══════════════════════════════════════════════');
    console.log('  🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════\n');

    console.log('📊 Summary:');
    console.log(`   👤 Users:         ${users.length}`);
    console.log(`   🏷  Categories:    ${categories.length}`);
    console.log(`   📦 Products:       ${products.length}`);
    console.log(`   🎟  Coupons:        ${coupons.length}`);
    console.log(`   💬 Testimonials:   ${testimonials.length}`);
    console.log(`   🖼  Banners:        ${banners.length}`);
    console.log(`   📝 Blogs:          ${blogs.length}`);
    console.log(`   🛒 Orders:         ${orders.length}`);
    console.log(`   ⭐ Reviews:        ${reviews.length}`);

    console.log('\n🔐 Admin Login Credentials:');
    console.log('   Email:    admin@engravialabs.com');
    console.log('   Password: Admin@12345');
    console.log('\n🌐 Your store is ready! Log in to the admin panel');
    console.log('   and start customising your store.\n');

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    if (error.message.includes('ECONNREFUSED') || error.message.includes('timed out')) {
      console.error('\n💡 Troubleshooting tips:');
      console.error('   1. Check your MONGODB_URI in the .env file');
      console.error('   2. Make sure you replaced <password> with your actual password');
      console.error('   3. In MongoDB Atlas, go to Network Access and allow 0.0.0.0/0');
      console.error('   4. Make sure your internet connection is working\n');
    }
    await mongoose.disconnect();
    process.exit(1);
  }
};

run();
